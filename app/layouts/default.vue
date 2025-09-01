<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
  <ColorScheme>
    <div class="min-h-screen min-w-screen flex flex-col flex-grow selection:bg-primary selection:text-black">
      <div class="fixed z-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
        <Particles class="absolute pointer-events-none w-[calc(100vw+5.5rem)] h-[calc(100vh+5.5rem)] -inset-11" />
      </div>

      <ThemeToggle v-if="!dialogOpen" class="fixed z-50 top-6 left-1/2 transform -translate-x-1/2 sm:left-8" />
      <OpenForWork class="fixed z-50 top-8 right-8 w-24 h-24 drop-shadow-xl/25" />

      <Transition mode="out-in" enter-active-class="transition-opacity duration-700" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <NuxtPage v-if="!isModalOpen" class="@container px-6 relative z-20 flex-grow flex flex-col" />
      </Transition>

      <Transition mode="out-in" enter-active-class="transition-opacity duration-500" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <Button v-if="!isModalOpen" class="hover:scale-110 fixed z-40 bottom-1/5 sm:bottom-48 left-1/2 transform -translate-x-1/2" @click="activeDialog = 'captcha'">
          {{ $t('letsConnect') }}
        </Button>
      </Transition>

      <Dialog v-model:open="dialogOpen" class="z-40">
        <Transition name="dialog-swap" mode="out-in">
          <div :key="activeDialog">
            <template v-if="activeDialog === 'captcha'">
              <div class="flex flex-col items-center justify-center gap-2">
                <h3 class="text-2xl text-primary">{{ $t('captcha.title') }}</h3>
                <div class="w-64 h-64 my-4">
                  <Captcha @completed="() => { activeDialog = 'contact' }" />
                </div>
              </div>
            </template>
            <template v-else-if="activeDialog === 'contact'">
              <ContactForm />
            </template>
          </div>
        </Transition>
      </Dialog>

      <Footer v-if="!isModalOpen" class="@container px-6 fixed z-50 bottom-0 left-0 right-0" />
    </div>
  </ColorScheme>

  </Html>
</template>

<script setup lang="ts">
const head = useLocaleHead()
type ActiveDialog = 'captcha' | 'contact' | null
const activeDialog = ref<ActiveDialog>(null)
const isModalOpen = computed(() => activeDialog.value !== null)
const dialogOpen = computed({
  get: () => activeDialog.value !== null,
  set: (v: boolean) => {
    if (!v) activeDialog.value = null
  },
})
</script>

<style scoped>
.dialog-swap-enter-active,
.dialog-swap-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.dialog-swap-enter-from,
.dialog-swap-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
</style>
