import { defineStore } from 'pinia'

export interface CaptchaSession {
  captchaToken: string | null
  honeypotToken: string | null
  issuedAt: number | null
}

export const useSecurityStore = defineStore('security', {
  state: (): CaptchaSession => ({
    captchaToken: null,
    honeypotToken: null,
    issuedAt: null,
  }),
  actions: {
    setSession(payload: { captchaToken: string, honeypotToken: string, issuedAt: number }) {
      this.captchaToken = payload.captchaToken
      this.honeypotToken = payload.honeypotToken
      this.issuedAt = payload.issuedAt
    },
    clear() {
      this.captchaToken = null
      this.honeypotToken = null
      this.issuedAt = null
    },
  },
})
