<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onUnmounted } from 'vue'

type Item = { id: string | number; label?: string; icon?: string; url?: string }

const props = withDefaults(
  defineProps<{
    items: Item[]
    radius?: number
    centerDeg?: number
    spreadDeg?: number
    offsetX?: number
    offsetY?: number
    listId?: string
  }>(),
  {
    radius: 120,
    centerDeg: -90,
    spreadDeg: 180,
    offsetX: 0,
    offsetY: 0,
    listId: 'lets-connect-list',
  },
)

const open = ref(false)
const itemEls = ref<HTMLElement[]>([])
let rafId: number | null = null

const positions = computed(() => {
  const n = props.items.length
  if (!n) return []
  const start = props.centerDeg - props.spreadDeg / 2
  const step = n === 1 ? 0 : props.spreadDeg / (n - 1)
  return Array.from({ length: n }, (_, i) => {
    const deg = start + step * i
    const rad = (deg * Math.PI) / 180
    return { x: Math.cos(rad) * props.radius + props.offsetX, y: Math.sin(rad) * props.radius + props.offsetY }
  })
})

const setItemRef = (i: number) => (el: Element | null) => {
  itemEls.value[i] = (el as HTMLElement) || (undefined as any)
}

const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * (2 - t) * (0.9 + 0.1 * t))

const tween = async (toOpen: boolean) => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  const dur = toOpen ? 240 : 180
  const start = performance.now()
  const staggers = itemEls.value.map((_, i) => 50 + i * 35)
  const endTime = start + dur + (staggers[staggers.length - 1] || 0)

  await nextTick()
  if (toOpen) {
    // ensure visible to AT and pointer before anim
    open.value = true
    await nextTick()
  }

  const tick = (now: number) => {
    for (let i = 0; i < itemEls.value.length; i++) {
      const el = itemEls.value[i]
      if (!el) continue
      const p = (now - (start + staggers[i])) / dur
      const t = ease(toOpen ? p : 1 - p)
      const v = Math.max(0, Math.min(1, t))
      const target = positions.value[i] ?? { x: 0, y: 0 }
      const x = target.x * v
      const y = target.y * v
      const s = 0.76 + 0.24 * v
      const o = 0.02 + 0.98 * v
      el.style.transform = `translate3d(-50%,-50%,0) translate3d(${x}px,${y}px,0) scale(${s})`
      el.style.opacity = String(o)
      const link = el.querySelector<HTMLElement>('a,button,[tabindex]')
      if (link) link.tabIndex = open.value ? 0 : -1
    }
    if (now < endTime) {
      rafId = requestAnimationFrame(tick)
    } else {
      if (!toOpen) open.value = false
      // snap
      itemEls.value.forEach((el, i) => {
        if (!el) return
        const t = positions.value[i] ?? { x: 0, y: 0 }
        if (toOpen) {
          el.style.transform = `translate3d(-50%,-50%,0) translate3d(${t.x}px,${t.y}px,0) scale(1)`
          el.style.opacity = '1'
        } else {
          el.style.transform = `translate3d(-50%,-50%,0) translate3d(0px,0px,0) scale(0.86)`
          el.style.opacity = '0.02'
        }
      })
      if (toOpen) {
        const first = itemEls.value[0]?.querySelector<HTMLElement>('a,button,[tabindex]')
        // first?.focus({ preventScroll: true })
      }
    }
  }

  rafId = requestAnimationFrame(tick)
}

const toggle = () => {
  tween(!open.value)
}

onMounted(() => {
  itemEls.value.forEach((el) => {
    if (!el) return
    el.style.transform = 'translate3d(-50%,-50%,0) translate3d(0,0,0) scale(0.86)'
    el.style.opacity = '0.02'
    const link = el.querySelector<HTMLElement>('a,button,[tabindex]')
    if (link) link.tabIndex = -1
  })
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="relative inline-block">
    <div class="relative">
      <div
        @click="toggle"
        :aria-expanded="open"
        :aria-controls="props.listId"
        role="button"
        class="relative z-[2] cursor-pointer select-none"
      >
        <slot name="button">
          <button class="px-6 py-4 rounded-full bg-primary text-black font-extrabold">Let’s Connect</button>
        </slot>
      </div>

      <ul
        :id="props.listId"
        class="absolute left-1/2 top-1/2 w-0 h-0 list-none m-0 p-0"
        :aria-hidden="!open"
        :inert="!open"
      >
        <li
          v-for="(it, i) in items"
          :key="it.id"
          class="absolute"
          :ref="setItemRef(i)"
          style="left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0)"
        >
          <div class="pointer-events-auto">
            <slot name="item" :item="it">
              <a
                :href="(it as any).url"
                class="px-2 py-1 rounded-full border text-sm bg-primary text-black w-16 h-16 flex justify-center items-center"
                target="_blank"
                rel="noreferrer noopener"
              >
                {{ it.label ?? it.id }}
              </a>
            </slot>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.fan-wrap {
  contain: paint;
  isolation: isolate;
  backface-visibility: hidden;
  transform: translateZ(0);
}

ul {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

ul > li {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0) translate3d(0, 0, 0) scale(0.86);
  opacity: 0.02;
  transform-origin: center;
  pointer-events: none;
}

[aria-hidden='true'] {
  visibility: hidden;
}
[aria-hidden='false'] {
  visibility: visible;
}
</style>
