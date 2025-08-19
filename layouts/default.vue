<template>
  <div>
    <div class="min-h-screen min-w-screen flex flex-col flex-grow">
      <div class="fixed w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          class="absolute w-[calc(100vw+5.5rem)] h-[calc(100vh+5.5rem)] pointer-events-none -inset-11"
          id="particles"
        ></div>
      </div>
      <NuxtPage class="@container px-6 relative z-20 flex-grow flex flex-col" />
      <Footer class="@container px-6 fixed z-10 bottom-0 left-0 right-0" />
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
        <button class="cursor-pointer">
          <LiquidGlass
            class="rounded-full [&>*]:rounded-full px-6 py-4 text-white hover:scale-110 hover:text-green transition-transform duration-150 shadow-md shadow-black font-semibold"
          >
            Let's Connect
          </LiquidGlass>
        </button>
      </template>
      <template #item="{ item }">
        <a
          :href="item.url"
          target="_blank"
          :title="`${item.label} profile`"
          @click="posthog.capture('lets_connect_item_clicked', { item: item.id })"
        >
          <LiquidGlass
            class="rounded-full [&>*]:rounded-full p-4 text-white hover:scale-110 hover:text-green transition-transform duration-150 shadow-md shadow-black font-semibold"
          >
            <component :is="iconMap[item.id]" class="fill-current w-6 h-6" aria-hidden="true" />
          </LiquidGlass>
        </a>
      </template>
    </LetsConnect>
  </div>
</template>

<script setup lang="ts">
import github from '@/assets/icons/github.svg'
import codepen from '@/assets/icons/codepen.svg'
import linkedIn from '@/assets/icons/linkedIn.svg'
import xing from '@/assets/icons/xing.svg'
import { onNuxtReady, useHead, useNuxtApp } from 'nuxt/app'

const { $posthog } = useNuxtApp()
let posthog
if ($posthog) {
  posthog = $posthog()
}

declare const particlesJS: any

const iconMap = { github, codepen, linkedIn, xing }

useHead({
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
    },
  ],
})

function loadParticles() {
  particlesJS.load('particles', '/particles-2.json')
  // particlesJS.load('particles', '/particles-1.json')
  // particlesJS.load('particles', '/particles-3.json')
}

onNuxtReady(async () => {
  const interval = setInterval(() => {
    if (typeof particlesJS !== 'undefined') {
      clearInterval(interval)
      loadParticles()
    }
  }, 200)
})
</script>
