<template>
  <ColorScheme>
    <div class="min-h-screen min-w-screen flex flex-col flex-grow selection:bg-primary selection:text-black">
      <ThemeToggle class="fixed top-4 left-4 z-40" />
      <div class="fixed w-full h-full overflow-hidden" aria-hidden="true">
        <Particles class="absolute w-[calc(100vw+5.5rem)] h-[calc(100vh+5.5rem)] -inset-11" />
      </div>
      <NuxtPage class="@container px-6 relative z-20 flex-grow flex flex-col" />
      <Footer class="@container px-6 fixed z-30 bottom-0 left-0 right-0" />
    </div>
    <LetsConnect
      :items="[
        { id: 'linkedIn', label: 'LinkedIn', url: 'https://www.linkedin.com/in/mirkonz/' },
        { id: 'github', label: 'GitHub', url: 'https://github.com/mirkonz' },
        { id: 'codepen', label: 'CodePen', url: 'https://codepen.io/mirkonz' },
        { id: 'xing', label: 'Xing', url: 'http://www.xing.com/profile/Mirko_May2' },
      ]"
      :radius="300"
      :spread-deg="50"
      :center-deg="-90"
      :offset-y="200"
      class="!fixed z-50 top-4/5 sm:top-2/3 left-1/2 transform -translate-x-1/2"
    >
      <template #button>
        <LiquidGlass
          :brightness="brightness"
          @click="posthog.capture('lets_connect_clicked')"
          class="rounded-full [&>*]:rounded-full px-6 py-4 dark:text-white text-black hover:scale-110 hover:text-primary transition-transform duration-150 shadow-md dark:shadow-black font-semibold cursor-pointer"
        >
          Let's Connect
        </LiquidGlass>
      </template>
      <template #item="{ item }">
        <a
          :href="item.url"
          target="_blank"
          :title="`${item.label} profile`"
          class="rounded-full inline-block focus-within:outline focus-within:outline-primary"
          @click="posthog.capture('lets_connect_item_clicked', { item: item.id })"
        >
          <LiquidGlass
            :brightness="brightness"
            class="rounded-full [&>*]:rounded-full p-4 dark:text-white text-black hover:scale-110 hover:text-primary transition-transform duration-150 shadow-md dark:shadow-black font-semibold"
          >
            <component :is="iconMap[item.id]" class="fill-current w-6 h-6" aria-hidden="true" />
          </LiquidGlass>
        </a>
      </template>
    </LetsConnect>
  </ColorScheme>
</template>

<script setup lang="ts">
import github from '@/assets/icons/github.svg'
import codepen from '@/assets/icons/codepen.svg'
import linkedIn from '@/assets/icons/linkedIn.svg'
import xing from '@/assets/icons/xing.svg'
import { useNuxtApp } from 'nuxt/app'
import Particles from '../components/Particles.vue'
import ThemeToggle from '../components/ThemeToggle.vue'

const colorMode = useColorMode()
const brightness = computed(() => (colorMode.value === 'dark' ? 0.5 : 0.9))

const { $posthog } = useNuxtApp()
let posthog
if ($posthog) {
  posthog = $posthog()
}

const iconMap = { github, codepen, linkedIn, xing }
</script>
