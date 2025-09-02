<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<(e: 'update:open', v: boolean) => void>()
const dialog = useDialogStore()
const el = ref<HTMLDialogElement | null>(null)
const entered = ref(false)

function open() {
  if (!el.value || el.value.open)
    return
  el.value.showModal()
  requestAnimationFrame(() => {
    entered.value = true
  })
}
function close() {
  if (!el.value?.open)
    return
  entered.value = false
  setTimeout(() => {
    el.value?.close()
    emit('update:open', false)
  }, 200)
}

onMounted(() => {
  if (props.open)
    open()
  el.value?.addEventListener('cancel', (e) => {
    e.preventDefault()
    close()
  })
  el.value?.addEventListener('close', () => emit('update:open', false))
})
watch(
  () => props.open,
  (v) => {
    v ? open() : close()
  },
  { flush: 'post' },
)
</script>

<template>
  <ClientOnly>
    <dialog ref="el" class="fixed m-0 rounded-xl bg-transparent p-0 outline-none backdrop:pointer-events-auto backdrop:bg-transparent dark:text-white">
      <Captcha
        v-if="dialog.activeDialog === 'captcha'"
        class="fixed inset-0"
        :dots-width="200"
        :dots-height="200"
        @completed="() => dialog.open('contact')"
      />
      <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="relative max-h-[calc(100vh-2rem)] w-[28rem] max-w-[80vw] overflow-auto rounded-xl p-1 transition duration-200 ease-out" :class="entered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'">
          <slot />
          <Button
            variant="normal"
            :class="dialog.activeDialog === 'captcha' ? 'absolute bottom-32 left-1/2 -translate-x-1/2' : 'relative left-1/2 -translate-x-1/2 mt-4'"
            @click="close"
          >
            {{ $t('cancel') }}
          </Button>
        </div>
      </div>
      <ThemeToggle class="fixed top-6 left-1/2 z-50 -translate-x-1/2 transform sm:left-8" />
      <Footer class="@container fixed right-0 bottom-0 left-0 z-50 px-6" />
    </dialog>
  </ClientOnly>
</template>
