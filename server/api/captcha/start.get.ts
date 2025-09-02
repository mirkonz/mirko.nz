import type { H3Event } from 'h3'
import { randomUUID } from 'node:crypto'
import { getAntiBotStore } from '../../utils/anti-bot-store'
import { getRequestIP, setHeader } from 'h3'

function getUA(event: H3Event) {
  return (event.node.req.headers['user-agent'] as string) || 'unknown'
}

export default defineEventHandler(async (event) => {
  // Ensure responses are not cached
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')

  const ip = getRequestIP(event) || 'unknown'
  const ua = getUA(event)

  const captchaToken = randomUUID()
  const honeypotToken = randomUUID()
  const issuedAt = Date.now()

  const store = getAntiBotStore()

  // Short-lived records: 10 minutes TTL
  const ttlSeconds = 10 * 60

  await Promise.all([
    store.set(`captcha:${captchaToken}`, JSON.stringify({ issuedAt, ip, ua }), { ttl: ttlSeconds }),
    store.set(`honeypot:${honeypotToken}`, JSON.stringify({ issuedAt, ip, ua }), { ttl: ttlSeconds }),
  ])
  console.log('[captcha:start] Issued tokens', { captchaToken, honeypotToken, issuedAt, ip, ua })

  return { captchaToken, honeypotToken, issuedAt }
})
