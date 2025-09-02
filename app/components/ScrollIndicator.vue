<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  const ind = document.querySelector('.scroll-indicator')

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
  const setState = (el, opacity, active) => {
    if (!el)
      return
    el.style.opacity = String(opacity)
    if (active) {
      el.classList.add('is-active')
      el.ariaHidden = 'false'
    }
    else {
      el.classList.remove('is-active')
      el.ariaHidden = 'true'
    }
  }

  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const p = clamp(window.scrollY / max, 0, 1)

    if (ind) {
      const o = clamp(1 - p / 0.8, 0, 1)
      const active = p < 0.8 && o > 0.01
      setState(ind, o, active)
    }
  }

  update()
  addEventListener('scroll', update, { passive: true })
  addEventListener('resize', update)
})
</script>

<template>
  <div class="scroll-indicator flex flex-col gap-0">
    <div class="inline-block h-4 w-4 animate-bounce">
      <svg viewBox="0 0 24 24" class="text-primary fill-current">
        <path
          fill="currentColor"
          d="M16.59,5.59L18,7L12,13L6,7L7.41,5.59L12,10.17L16.59,5.59M16.59,11.59L18,13L12,19L6,13L7.41,11.59L12,16.17L16.59,11.59Z"
        />
      </svg>
    </div>
    <div class="text-xs tracking-wide uppercase opacity-50">
      {{ $t('scroll') }}
    </div>
  </div>
</template>

<style>
.scroll-indicator {
  position: fixed;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.35s ease;
}

.scroll-indicator.is-active {
  visibility: visible;
  pointer-events: auto;
}
</style>
