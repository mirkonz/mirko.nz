<template>
  <div class="pointer-events-none" id="particles"></div>
</template>

<script lang="ts" setup>
import { useHead } from 'nuxt/app'
import { onMounted, watchEffect } from 'vue'
const colorMode = useColorMode()

declare const particlesJS: any

useHead({
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
    },
  ],
})

function loadParticles(colorMode) {
  if (typeof particlesJS !== 'undefined') {
    if (colorMode === 'dark') {
      particlesJS.load('particles', '/particles-dark.json')
    } else {
      particlesJS.load('particles', '/particles-light.json')
    }
  }
}

watchEffect(() => loadParticles(colorMode.value))

onMounted(() => {
  const interval = setInterval(() => {
    if (typeof particlesJS !== 'undefined') {
      clearInterval(interval)
      loadParticles(colorMode.value)
    }
  }, 200)
})
</script>

<style></style>
