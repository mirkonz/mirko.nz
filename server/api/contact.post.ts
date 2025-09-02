import type { H3Event } from 'h3'
import { useResend } from '#imports'
import { createError, getRequestIP, readBody, setHeader } from 'h3'
import { z } from 'zod'
import { getAntiBotStore } from '../utils/anti-bot-store'

function getUA(event: H3Event) {
  return (event.node.req.headers['user-agent'] as string) || 'unknown'
}

const ContactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().min(3).max(320),
  message: z.string().min(10).max(5000),
  captchaToken: z.string().min(10),
  honeypotToken: z.string().min(10),
  company: z.string().optional(), // honeypot field, must be empty
})

async function validateAntiBot(event: H3Event, captchaToken: string, honeypotToken: string) {
  const ip = getRequestIP(event) || 'unknown'
  const ua = getUA(event)
  const store = getAntiBotStore()

  // 1) Honeypot token must exist (and not be reused)
  const hpKey = `honeypot:${honeypotToken}`
  const hpRaw = await store.get(hpKey)
  if (!hpRaw)
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission (honeypot).' })

  // 2) Captcha token must exist and be older than minSolveMs
  const capKey = `captcha:${captchaToken}`
  const capRaw = await store.get(capKey)
  if (!capRaw)
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission (captcha).' })

  let capData: any
  try {
    capData = JSON.parse(capRaw)
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid captcha data.' })
  }

  const minSolveMs = 7000
  const now = Date.now()
  if (!capData?.issuedAt || now - Number(capData.issuedAt) < minSolveMs)
    throw createError({ statusCode: 400, statusMessage: 'Captcha solved too quickly.' })

  // 3) Optional binding: require same IP/UA that requested tokens
  if (capData.ip && capData.ip !== ip)
    throw createError({ statusCode: 400, statusMessage: 'Session mismatch (ip).' })
  if (capData.ua && capData.ua !== ua)
    throw createError({ statusCode: 400, statusMessage: 'Session mismatch (ua).' })

  // One-time use: remove tokens
  await Promise.all([
    store.delete(hpKey),
    store.delete(capKey),
  ])
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')

  const body = await readBody(event)
  console.log('[contact] Incoming body', {
    hasName: Boolean(body?.name),
    hasEmail: Boolean(body?.email),
    hasMessage: Boolean(body?.message),
    hasCaptchaToken: Boolean(body?.captchaToken),
    hasHoneypotToken: Boolean(body?.honeypotToken),
    companyFilled: !!(typeof body?.company === 'string' && body.company.trim() !== ''),
  })
  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid form data.', data: parsed.error.flatten?.() ?? parsed.error })

  const { name, email, message, captchaToken, honeypotToken, company } = parsed.data

  // Honeypot decoy must be empty
  if (company && company.trim() !== '')
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission.' })

  try {
    await validateAntiBot(event, captchaToken, honeypotToken)
    console.log('[contact] Anti-bot validation passed')
  }
  catch (e) {
    console.error('[contact] Anti-bot validation failed', e)
    throw e
  }

  const config = useRuntimeConfig()
  if (!config.resend?.apiKey)
    throw createError({ statusCode: 500, statusMessage: 'Email service not configured.' })

  const resend = useResend()

  const subject = `New contact from ${name}`
  const text = `You received a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\nIP: ${getRequestIP(event) || 'unknown'}\nUA: ${getUA(event)}\n\nMessage:\n${message}`

  try {
    const contactFrom = (config.contactFrom as string) || process.env.CONTACT_FROM || ''
    const contactTo = (config.contactTo as string) || process.env.CONTACT_TO || ''
    console.log('[contact] Sending email via Resend', {
      from: contactFrom,
      to: contactTo,
      subject,
      reply_to: email,
    })
    const result: any = await resend.emails.send({
      from: contactFrom,
      to: contactTo,
      subject,
      text,
      reply_to: email,
    } as any)
    if (result?.error) {
      console.error('[contact] Resend send error', result.error)
      throw createError({ statusCode: 502, statusMessage: 'Failed to send message.' })
    }
    console.log('[contact] Resend send ok', { id: result?.data?.id })
    return { ok: true, id: result?.data?.id }
  }
  catch (err: any) {
    // Avoid leaking details
    console.error('[contact] Resend exception', err)
    throw createError({ statusCode: 502, statusMessage: 'Failed to send message.' })
  }
})
