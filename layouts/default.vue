<template>
  <div class="min-h-screen min-w-screen flex flex-col flex-grow">
    <div class="absolute w-full h-full pointer-events-none" id="particles"></div>
    <Header class="container px-6 relative" />
    <nuxt class="container px-6 py-8 flex-grow flex flex-col relative" />
    <Footer class="container px-6 relative" />
  </div>
</template>

<script>
//
export default {
  head() {
    return {
      bodyAttrs: {
        class: 'bg-black text-white min-h-screen min-w-screen ',
      },
    }
  },
  mounted() {
    require('particles.js')
    if (particlesJS) {
      // particlesJS.load('particles', '/particles.json')
    }
  },
}
</script>