<script setup lang="ts">
import { computed, ref } from 'vue'

type Item = { id: string | number; label?: string; icon?: string }

const props = withDefaults(
  defineProps<{
    items: Item[]
    radius?: number
    centerDeg?: number
    spreadDeg?: number
    offsetX?: number
    offsetY?: number
    disabled?: boolean
  }>(),
  {
    radius: 120,
    centerDeg: -90,
    spreadDeg: 180,
    offsetX: 0,
    offsetY: 0,
    disabled: false,
  }
)

const open = ref(false)
const opening = ref(false)

const positions = computed(() => {
  const n = props.items.length
  if (!n) return []
  const start = props.centerDeg - props.spreadDeg / 2
  const step = n === 1 ? 0 : props.spreadDeg / (n - 1)
  return Array.from({ length: n }, (_, i) => {
    const deg = start + step * i
    const rad = (deg * Math.PI) / 180
    const x = Math.cos(rad) * props.radius + props.offsetX
    const y = Math.sin(rad) * props.radius + props.offsetY
    return { x, y }
  })
})

const toggle = () => {
  if (props.disabled) return
  const goingOpen = !open.value
  open.value = goingOpen
  if (goingOpen) {
    opening.value = true
    requestAnimationFrame(() => {
      setTimeout(() => (opening.value = false), 420)
    })
  }
}

const itemStyle = (i: number) => {
  const p = positions.value[i] ?? { x: 0, y: 0 }
  const tx = open.value ? `${p.x}px` : `0px`
  const ty = open.value ? `${p.y}px` : `0px`
  const sc = open.value ? 1 : 0.72
  const op = open.value ? 1 : 0
  const d = `${80 + i * 50}ms`
  return { '--tx': tx, '--ty': ty, '--sc': String(sc), '--op': String(op), '--delay': d } as Record<string, string>
}
</script>

<template>
  <div class="relative inline-block">
    <svg width="0" height="0" class="absolute">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 18 -8" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" result="merged"/>


        </filter>
      </defs>
    </svg>

    <div class="relative" :class="[{ 'is-open': open, opening }, 'goo-wrap']">
      <div @click="toggle" :aria-expanded="open" role="button" class="relative z-[2] cursor-pointer select-none goo-button">
        <slot name="button">
          <button class="px-6 py-4 rounded liquid-glass font-extrabold">Open</button>
        </slot>
      </div>

      <ul class="fan absolute left-1/2 top-1/2 w-0 h-0 list-none m-0 p-0 pointer-events-none" :aria-hidden="!open">
        <li
          v-for="(it, i) in items"
          :key="it.id"
          class="fan-item absolute"
          :style="itemStyle(i)"
        >
          <div class="pointer-events-auto">
            <slot name="item" :item="it">
              <div class="px-2 py-1 rounded-full border text-sm bg-white/90 shadow">
                {{ it.label ?? it.id }}
              </div>
            </slot>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.goo-wrap { filter: url(#goo); }
.goo-button { position: relative; }

.goo-button::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0;
  transform: scale(0.8);
  z-index: -1;
}

.fan li {
  transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(var(--sc));
  opacity: var(--op);
  will-change: transform, opacity, filter;
  transition:
    transform 420ms cubic-bezier(.2,.4,.15,1),
    opacity 320ms ease-out;
}

.opening .goo-button {
  animation: blob-pop 350ms cubic-bezier(.4,0,.2,1) both;
}
.opening .goo-button::after {
  animation: blob-wave 350ms cubic-bezier(.4,0,.2,1) both;
}
.opening .fan-item {
  animation: separate 350ms cubic-bezier(.4,0,.2,1) var(--delay) both;
}

@keyframes blob-pop {
  0%   { transform: scale(1); }
  15%  { transform: scale(1.01); }
  35%  { transform: scale(1.06); }
  55%  { transform: scale(1.12); }
  70%  { transform: scale(1.05); }
  85%  { transform: scale(0.98); }
  100% { transform: scale(1); }
}

@keyframes blob-wave {
  0%   { opacity: .25; transform: scale(0.8); }
  25%  { opacity: .2;  transform: scale(0.95); }
  50%  { opacity: .15; transform: scale(1.15); }
  75%  { opacity: .08; transform: scale(1.25); }
  100% { opacity: 0;   transform: scale(1.35); }
}

@keyframes separate {
  0%   { transform: translate(-50%, -50%) translate(0,0) scale(0.9); filter: blur(3px); }
  20%  { transform: translate(-50%, -50%) translate(calc(var(--tx) * .1), calc(var(--ty) * .1)) scale(0.96); }
  40%  { transform: translate(-50%, -50%) translate(calc(var(--tx) * .3), calc(var(--ty) * .3)) scale(1.02); }
  65%  { transform: translate(-50%, -50%) translate(calc(var(--tx) * .6), calc(var(--ty) * .6)) scale(1.04); }
  85%  { transform: translate(-50%, -50%) translate(calc(var(--tx) * .85), calc(var(--ty) * .85)) scale(1.01); }
  100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(1); filter: blur(0); }
}
</style>