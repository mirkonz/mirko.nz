<template>
  <div class="pointer-events-none" id="particles"></div>
</template>

<script lang="ts" setup>
import { useHead } from 'nuxt/app'
import { onMounted, watchEffect } from 'vue'
const colorMode = useColorMode()

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
</script>
