import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  components: true,
  runtimeConfig: {
    public: {
      url:
        process.env.NODE_ENV === 'production'
          ? process.env.URL || 'https://mirko.nz'
          : 'http://localhost:3000',
      lang: 'en-NZ',
      posthogPublicKey: process.env.POSTHOG_PUBLIC_KEY,
      posthogHost: process.env.POSTHOG_HOST,
      posthogDefaults: process.env.POSTHOG_DEFAULTS,
    },
  },
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Mirko May | Font-end Engineer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Mirko May, Front-end Engineer from Wellington, creates scalable design systems with a focus on UX, accessibility, and inclusive digital products.',
        },
      ],
      script: [{ src: '/particles.min.js', defer: false }],
    },
  },
  googleFonts: {
    families: {
      Raleway: {
        wght: [300, 600, 700],
      },
    },
    display: 'swap',
  },
  i18n: {
    baseUrl: 'https://mirko.nz',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'de', language: 'de', name: 'Deutsch', file: 'de.json' },
    ],
  },
  css: ['@/assets/css/main.css'],
  colorMode: {
    // preference: 'dark',
  },
  plugins: [],
  modules: ['@vite-pwa/nuxt', '@nuxtjs/color-mode', '@nuxtjs/google-fonts', '@nuxtjs/i18n'],
  vite: {
    plugins: [tailwindcss(), svgLoader()],
  },
  nitro: {
    preset: 'netlify-static',
    prerender: {
      crawlLinks: true,
      routes: ['/' /* add any dynamic paths you must include */],
    },
  },
  pwa: {
    manifest: {
      name: 'Mirko May - Font-end Engineer',
      short_name: 'MirkoMay',
      theme_color: '#222',
      lang: 'en-NZ',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  },
  telemetry: false,
  compatibilityDate: '2025-08-19',
})
