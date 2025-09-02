import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const key = runtimeConfig.public.posthogPublicKey
  // Use first-party proxy by default to avoid ad blockers.
  // If a custom non-PostHog host is provided, respect it.
  const proxyPath = '/_i'
  const envHost = runtimeConfig.public.posthogHost
  const apiHost = envHost && !/posthog\.com$/i.test(new URL(envHost, 'http://d').hostname)
    ? envHost
    : proxyPath

  // If no key, skip initialization to avoid errors in non-tracking envs.
  if (!key) {
    return {
      provide: {
        posthog: () => posthog,
      },
    }
  }

  // Derive UI host for correct links/tooling (US/EU based on ingest)
  const ingest = runtimeConfig.public.posthogHost || ''
  const uiHost = /eu\./i.test(ingest) ? 'https://eu.posthog.com' : 'https://us.posthog.com'

  const posthogClient = posthog.init(key, {
    api_host: apiHost,
    ui_host: uiHost,
    capture_pageview: 'history_change',
    loaded: (ph) => {
      if (import.meta.env.MODE === 'development')
        ph.debug()
    },
  })

  // Capture rendering errors
  nuxtApp.hook('vue:error', (error) => {
    posthogClient.captureException(error)
  })

  return {
    provide: {
      posthog: () => posthogClient,
    },
  }
})
