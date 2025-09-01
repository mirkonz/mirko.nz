<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
  <ColorScheme>
    <div class="min-h-screen min-w-screen flex flex-col flex-grow selection:bg-primary selection:text-black">
      <div class="fixed z-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
        <Particles class="absolute pointer-events-none w-[calc(100vw+5.5rem)] h-[calc(100vh+5.5rem)] -inset-11" />
      </div>

      <ThemeToggle class="fixed top-6 z-40 left-1/2 transform -translate-x-1/2 sm:left-8" />
      <OpenForWork class="fixed z-40 top-8 right-8 w-24 h-24 drop-shadow-xl/25" />

      <Transition mode="out-in" enter-active-class="transition-opacity duration-700" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <NuxtPage v-if="!showCaptcha && !showDialog" class="@container px-6 relative z-20 flex-grow flex flex-col" />
      </Transition>

      <Transition mode="out-in" enter-active-class="transition-opacity duration-700" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <Footer v-if="!showCaptcha && !showDialog" class="@container px-6 fixed z-30 bottom-0 left-0 right-0" />
      </Transition>
    </div>

    <Transition mode="out-in" enter-active-class="transition-opacity duration-500" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <Button v-if="!showCaptcha && !showDialog" class="hover:scale-110 fixed z-50 bottom-1/5 sm:bottom-48 left-1/2 transform -translate-x-1/2" @click="showCaptcha = true">
        {{ $t('letsConnect') }}
      </Button>
    </Transition>

    <Transition mode="out-in" enter-active-class="transition-opacity duration-700" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showCaptcha && !showDialog" class="fixed z-50 p-32 inset-0 flex flex-col items-center justify-center gap-2 bg-white-darker dark:bg-black">
        <h3 class="text-2xl text-primary">{{ $t('captcha.title') }}</h3>
        <div class="w-64 h-64 my-4">
          <Captcha ref="captchaRef" @completed="
            () => {
              showDialog = true
              showCaptcha = false
            }
          " />
        </div>
        <button type="button" class="mt-1 rounded px-3 py-1 text-sm text-black dark:text-white" @click="() => (showCaptcha = false)">
          {{ $t('cancel') }}
        </button>
      </div>
    </Transition>

    <Dialog v-model:open="showDialog" class="z-50">
      <ContactForm v-if="showDialog" />
    </Dialog>
  </ColorScheme>

  </Html>
</template>

<script setup lang="ts">
const head = useLocaleHead()
const colorMode = useColorMode()
const brightness = computed(() => (colorMode.value === 'dark' ? 0.5 : 0.9))
const showCaptcha = ref(false)
const showDialog = ref(false)
</script>
