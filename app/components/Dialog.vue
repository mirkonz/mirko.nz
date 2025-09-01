<template>
  <ClientOnly>
    <dialog ref="el" class="fixed rounded-xl  m-0 p-0 bg-transparent outline-none dark:text-white backdrop:bg-transparent backdrop:pointer-events-auto">
      <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="relative rounded-xl p-6 w-[28rem] max-w-[80vw] max-h-[calc(100vh-2rem)] overflow-auto transition duration-200 ease-out" :class="entered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'">
          <button type="button" class="absolute right-3 top-3 p-1 w-6 h-6 rounded-full focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary leading-0" @click="close" :aria-label="$t('cancel')">
            ✕
          </button>
          <slot />
        </div>
      </div>
      <ThemeToggle class="fixed z-50 top-6 left-1/2 transform -translate-x-1/2 sm:left-8" />
      <Footer class="@container px-6 fixed z-50 bottom-0 left-0 right-0" />
    </dialog>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<(e: 'update:open', v: boolean) => void>()
const el = ref<HTMLDialogElement | null>(null)
const entered = ref(false)

function open() {
  if (!el.value || el.value.open) return
  el.value.showModal()
  requestAnimationFrame(() => {
    entered.value = true
  })
}
function close() {
  if (!el.value?.open) return
  entered.value = false
  setTimeout(() => {
    el.value?.close()
    emit('update:open', false)
  }, 200)
}

onMounted(() => {
  if (props.open) open()
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
function onBackdrop(e: MouseEvent) {
  if (e.target === el.value) close()
}
</script>
