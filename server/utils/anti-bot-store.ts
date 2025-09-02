type TTLSeconds = number

interface StoreLike {
  set(key: string, value: string, opts?: { ttl?: TTLSeconds; metadata?: any }): Promise<void>
  get(key: string): Promise<string | null>
  delete(key: string): Promise<void>
}

// Simple in-memory fallback with TTL for local/dev
const mem = new Map<string, { value: string; expiresAt?: number }>()

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

export function getAntiBotStore(): StoreLike {
  try {
    // Lazy require to allow local/dev without Netlify context
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getStore } = require('@netlify/blobs') as typeof import('@netlify/blobs')
    const cfg = useRuntimeConfig()
    const siteID = cfg.netlifyBlobsSiteId
    const token = cfg.netlifyBlobsToken
    const isNetlifyEnv = process.env.NETLIFY === 'true' || process.env.NETLIFY_DEV === 'true'
    const looksValidCreds = Boolean(siteID && token && !/your_site_id|your_personal_access_token/i.test(`${siteID}${token}`))

    // Only use Netlify Blobs when running under Netlify env or explicit valid creds
    if (!isNetlifyEnv && !looksValidCreds) {
      return memoryStore()
    }

    const netlifyStore = getStore({
      name: 'form-anti-bot',
      consistency: 'strong',
      ...(looksValidCreds ? { siteID, token } : {}),
    } as any)

    // Wrap to normalize API we use
    const wrapper: StoreLike = {
      async set(key, value, opts) {
        await netlifyStore.set(key as any, value, { ttl: opts?.ttl } as any)
      },
      async get(key) {
        const v = await netlifyStore.get(key, { type: 'text' } as any)
        return (v as any) ?? null
      },
      async delete(key) {
        await netlifyStore.delete(key as any)
      },
    }
    return wrapper
  }
  catch (e) {
    // Fallback for local dev without Netlify Blobs context
    return memoryStore()
  }
}
