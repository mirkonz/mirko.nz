<script lang="ts" setup>
import { watchEffect } from 'vue'

const colorMode = useColorMode()

function loadParticles(colorMode) {
  if (typeof particlesJS !== 'undefined') {
    if (colorMode === 'dark') {
      particlesJS.load('particles', '/particles-dark.json')
    }
    else {
      particlesJS.load('particles', '/particles-light.json')
    }
  }
}

watchEffect(() => loadParticles(colorMode.value))
</script>

<template>
  <div id="particles" class="pointer-events-none" />
</template>
