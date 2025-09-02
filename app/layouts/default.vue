<script setup lang="ts">
const head = useLocaleHead()
const dialog = useDialogStore()
const isModalOpen = computed(() => dialog.isOpen)
const dialogOpen = computed({
  get: () => dialog.isOpen,
  set: (v: boolean) => dialog.setOpen(v),
})
</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <ColorScheme>
      <div class="selection:bg-primary flex min-h-screen min-w-screen flex-grow flex-col selection:text-black">
        <div class="pointer-events-none fixed z-0 h-full w-full overflow-hidden" aria-hidden="true">
          <Particles class="pointer-events-none absolute -inset-11 h-[calc(100vh+5.5rem)] w-[calc(100vw+5.5rem)]" />
        </div>

        <Confetti
          class="fixed opacity-0 transition-opacity duration-1000"
          :speed="1"
          :colors="[[159, 255, 17], [34, 34, 34], [190, 190, 190]]"
        />

        <ThemeToggle v-if="!dialogOpen" class="fixed top-6 left-1/2 z-50 -translate-x-1/2 transform sm:left-8" />
        <OpenForWork class="fixed top-8 right-8 z-50 h-24 w-24 drop-shadow-xl/25" />

        <Blob class="z-0" />

        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-700"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <NuxtPage v-if="!isModalOpen" class="@container relative z-20 flex flex-grow flex-col px-6" />
        </Transition>

        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-500"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <Button
            v-if="!isModalOpen"
            class="fixed bottom-1/5 left-1/2 z-40 -translate-x-1/2 transform hover:scale-110 sm:bottom-48"
            @click="dialog.open('captcha')"
          >
            {{ $t('letsConnect') }}
          </Button>
        </Transition>

        <Dialog v-model:open="dialogOpen" class="z-40">
          <Transition name="dialog-swap" mode="out-in">
            <div :key="dialog.activeDialog">
              <template v-if="dialog.activeDialog === 'captcha'">
                <!-- <div class="flex flex-col items-center justify-center gap-2 pb-96"> -->
                <div class="h-[75vh] w-full">
                  <h3 class="text-primary absolute top-1/5 left-1/2 -translate-x-1/2 text-2xl">
                    {{ $t('captcha.title') }}
                  </h3>
                </div>
                <!-- </div> -->
              </template>
              <template v-else-if="dialog.activeDialog === 'contact'">
                <ContactForm />
              </template>
            </div>
          </Transition>
        </Dialog>

        <Footer v-if="!isModalOpen" class="@container fixed right-0 bottom-0 left-0 z-50 px-6" />
      </div>
    </ColorScheme>
  </Html>
</template>

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
