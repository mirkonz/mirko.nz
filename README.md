# mirko.nz

**[Live website](https://mirko.nz/)**

## Build with

- Nuxt.js (Vue)
- TailwindCSS
- Cloudflare Workers

## Cloudflare setup

The contact form needs a KV namespace to issue short-lived, single-use captcha
tokens. Create a namespace and replace
`REPLACE_WITH_CLOUDFLARE_KV_NAMESPACE_ID` in `wrangler.jsonc` with its ID before
deploying. The Worker deliberately returns an error for contact-form requests if
that binding is missing, rather than weakening anti-bot validation.

Set these Worker secrets and variables in Cloudflare before deployment:

- `NUXT_RESEND_API_KEY` (secret)
- `NUXT_CONTACT_FROM`
- `NUXT_CONTACT_TO`
- `NUXT_PUBLIC_POSTHOG_PUBLIC_KEY` (if analytics is enabled)
- `NUXT_PUBLIC_POSTHOG_HOST` (if analytics is enabled)

Deploy with `pnpm deploy`. Use `pnpm preview` for a local Workers runtime.
