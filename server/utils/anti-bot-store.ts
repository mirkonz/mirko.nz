import type { H3Event } from 'h3'

type TTLSeconds = number

interface StoreLike {
  set: (key: string, value: string, opts?: { ttl?: TTLSeconds, metadata?: any }) => Promise<void>
  get: (key: string) => Promise<string | null>
  delete: (key: string) => Promise<void>
}

// Simple in-memory fallback with TTL for local/dev
const mem = new Map<string, { value: string, expiresAt?: number }>()

function memoryStore(): StoreLike {
  return {
    async set(key, value, opts) {
      const ttl = opts?.ttl
      const expiresAt = ttl ? Date.now() + ttl * 1000 : undefined
      mem.set(key, { value, expiresAt })
    },
    async get(key) {
      const item = mem.get(key)
      if (!item)
        return null
      if (item.expiresAt && Date.now() > item.expiresAt) {
        mem.delete(key)
        return null
      }
      return item.value
    },
    async delete(key) {
      mem.delete(key)
    },
  }
}

interface KVNamespaceLike {
  put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>
  get: (key: string) => Promise<string | null>
  delete: (key: string) => Promise<void>
}

function cloudflareStore(namespace: KVNamespaceLike): StoreLike {
  return {
    async set(key, value, opts) {
      await namespace.put(key, value, opts?.ttl ? { expirationTtl: opts.ttl } : undefined)
    },
    get: key => namespace.get(key),
    delete: key => namespace.delete(key),
  }
}

export function getAntiBotStore(event: H3Event): StoreLike {
  const cloudflare = (event.context as { cloudflare?: { env?: { FORM_ANTI_BOT?: KVNamespaceLike } } }).cloudflare
  const namespace = cloudflare?.env?.FORM_ANTI_BOT
  if (namespace)
    return cloudflareStore(namespace)

  if (import.meta.dev)
    return memoryStore()

  throw createError({ statusCode: 500, statusMessage: 'Anti-bot storage is not configured.' })
}
