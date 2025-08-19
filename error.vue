<script setup lang="ts">
import type { NuxtError } from '#app'
import NotFoundImage from '@/public/404.svg'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' });

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
});
</script>

<template>
  <div class="min-h-screen min-w-screen flex flex-col flex-grow">
    <NotFoundImage class="absolute inset-0 !w-full !h-full !object-cover text-[#000] fill-current opacity-50" />
    <div class="fixed w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
      <div class="absolute w-[calc(100vh+5.5rem)] h-[calc(100vh+5.5rem)] pointer-events-none -inset-11" id="particles"></div>
    </div>
    <main class="px-6 relative z-20 flex-grow flex flex-col text-white justify-center text-center"><div>

      <template v-if="error.statusCode === 404">
        <h1 class="!text-6xl text-green !mb-8">Oops! Page Not Found</h1>
        <p class="!mb-8">Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</p>
      </template>
      <template v-else>
        <h1 class="!text-6xl text-green !mb-8">Oops!. An error occurred</h1>
      </template>

      <code class="text-sm">
        <div>Error code: {{ error.statusCode }}</div>
        <div>Error message: {{ error.message }}</div>
      </code>

      <button @click="handleError" class="hover:!bg-green transition-all duration-500 inline hover:!text-black font-extrabold px-6 py-4 rounded liquid-glass cursor-pointer mt-64">Back to home</button>
    </div>
    </main>
    <Footer class="@container px-6 fixed z-10 bottom-0 left-0 right-0" />
  </div>
</template>