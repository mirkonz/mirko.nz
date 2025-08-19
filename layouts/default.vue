<template>
  <div class="min-h-screen min-w-screen flex flex-col flex-grow">
    <div class="fixed w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
      <div class="absolute w-[calc(100vh+5.5rem)] h-[calc(100vh+5.5rem)]  pointer-events-none -inset-11" id="particles"></div>
    </div>
    <!-- <Header class="@container px-6 relative" /> -->
    <NuxtPage class="@container px-6 relative z-20 flex-grow flex flex-col" />
    <Footer class="@container px-6 fixed z-10 bottom-0 left-0 right-0" />
  </div>
</template>

<script>
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
