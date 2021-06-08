<template>
  <div class="bg-black min-h-screen min-w-screen overflow-hidden text-white flex flex-col flex-grow">
    <div class="absolute w-full h-full pointer-events-none" id="particles"></div>
    <Header class="container px-6" />
    <nuxt class="container px-6 py-4 flex-grow flex flex-col" />
    <Footer class="container px-6" />
  </div>
</template>

<script>
//
export default {
  mounted() {
    require('particles.js')
    if (particlesJS) {
      particlesJS.load('particles', '/particles.json')
    }
  },
}
</script>