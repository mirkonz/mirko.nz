import { defineStore } from 'pinia'

export type ActiveDialog = 'captcha' | 'contact' | null

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    activeDialog: null as ActiveDialog,
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
  },
})
