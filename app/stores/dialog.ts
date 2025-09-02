import { defineStore } from 'pinia'

export type ActiveDialog = 'captcha' | 'contact' | null

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    activeDialog: null as ActiveDialog,
    confettiVisible: false as boolean,
    confettiTimer: null as number | null,
  }),
  getters: {
    isOpen: state => state.activeDialog !== null,
  },
  actions: {
    open(kind: Exclude<ActiveDialog, null>) {
      this.activeDialog = kind
    },
    close() {
      this.activeDialog = null
    },
    setOpen(v: boolean) {
      if (!v)
        this.close()
    },
    showConfetti(durationMs = 5000) {
      // Clear any existing timer
      if (this.confettiTimer)
        clearTimeout(this.confettiTimer)
      this.confettiVisible = true
      this.confettiTimer = window.setTimeout(() => {
        this.confettiVisible = false
        this.confettiTimer = null
      }, durationMs)
    },
  },
})
