<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    blur?: number
    brightness?: number
    saturate?: number
    scale?: number
    canvasDpi?: number
    freqX?: number
    freqY?: number
    phaseX?: number
    phaseY?: number
    overscanPct?: number
    regionPadPx?: number
    tint?: string
  }>(),
  {
    blur: 4,
    brightness: 0.5,
    saturate: 0.8,
    scale: 33,
    canvasDpi: 1,
    freqX: 0.001,
    freqY: 0.001,
    phaseX: 0,
    phaseY: 0,
    overscanPct: 100,
    regionPadPx: 64,
    tint: 'rgba(255,255,255,0.1)',
  },
)

const root = ref<HTMLElement | null>(null)
const ready = ref(false)
const filterId = ref('')
const imageHref = ref('')

const w = ref(0)
const h = ref(0)

let ro: ResizeObserver | null = null
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let defs: SVGDefsElement | null = null
let filterEl: SVGFilterElement | null = null
let feImageEl: SVGFEImageElement | null = null
let feDispEl: SVGFEDisplacementMapElement | null = null

const blur = computed(() => props.blur)
const brightness = computed(() => props.brightness)
const saturate = computed(() => props.saturate)
const scale = computed(() => props.scale)
const tint = computed(() => props.tint)

const overscanPx = computed(
  () => Math.round(Math.max(w.value, h.value) * (props.overscanPct / 100)) + Math.max(0, props.regionPadPx),
)
const fx = computed(() => -overscanPx.value)
const fy = computed(() => -overscanPx.value)
const fw = computed(() => w.value + overscanPx.value * 2)
const fh = computed(() => h.value + overscanPx.value * 2)

function ensureDefsHost(): SVGDefsElement | null {
  if (typeof window === 'undefined')
    return null
  let host = document.getElementById('lg-defs-host') as unknown as SVGSVGElement | null
  if (!host) {
    const ns = 'http://www.w3.org/2000/svg'
    host = document.createElementNS(ns, 'svg')
    host.id = 'lg-defs-host'
    host.setAttribute('aria-hidden', 'true')
    host.style.position = 'absolute'
    host.style.width = '0'
    host.style.height = '0'
    host.style.overflow = 'hidden'
    const d = document.createElementNS(ns, 'defs')
    host.appendChild(d)
    document.body.appendChild(host)
  }
  return host.querySelector('defs')
}

function createFilter() {
  if (!defs)
    return
  const ns = 'http://www.w3.org/2000/svg'
  filterEl = document.createElementNS(ns, 'filter')
  feImageEl = document.createElementNS(ns, 'feImage') as unknown as SVGFEImageElement
  feDispEl = document.createElementNS(ns, 'feDisplacementMap') as unknown as SVGFEDisplacementMapElement

  filterEl.id = filterId.value
  filterEl.setAttribute('filterUnits', 'userSpaceOnUse')
  filterEl.setAttribute('primitiveUnits', 'userSpaceOnUse')
  filterEl.setAttribute('color-interpolation-filters', 'sRGB')

  feImageEl.setAttribute('preserveAspectRatio', 'none')
  feImageEl.setAttribute('result', 'map')

  feDispEl.setAttribute('in', 'SourceGraphic')
  feDispEl.setAttribute('in2', 'map')
  feDispEl.setAttribute('xChannelSelector', 'R')
  feDispEl.setAttribute('yChannelSelector', 'G')

  filterEl.appendChild(feImageEl)
  filterEl.appendChild(feDispEl)
  defs.appendChild(filterEl)
}

function updateFilterFrame() {
  if (!filterEl || !feImageEl || !feDispEl)
    return
  filterEl.setAttribute('x', String(fx.value))
  filterEl.setAttribute('y', String(fy.value))
  filterEl.setAttribute('width', String(fw.value))
  filterEl.setAttribute('height', String(fh.value))

  feImageEl.setAttribute('x', String(fx.value))
  feImageEl.setAttribute('y', String(fy.value))
  feImageEl.setAttribute('width', String(fw.value))
  feImageEl.setAttribute('height', String(fh.value))
  feImageEl.setAttribute('href', imageHref.value)
  feImageEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageHref.value)

  feDispEl.setAttribute('scale', String(scale.value))
}

function sizeCanvas() {
  if (!canvas)
    return
  const d = Math.max(0.5, props.canvasDpi)
  canvas.width = Math.max(1, Math.round(fw.value * d))
  canvas.height = Math.max(1, Math.round(fh.value * d))
}

function renderMap() {
  if (!canvas)
    return
  if (!ctx) {
    const c = canvas.getContext('2d')
    if (!c)
      return
    ctx = c
  }
  const cw = canvas.width
  const ch = canvas.height
  const img = ctx.createImageData(cw, ch)
  const data = img.data
  const fxF = props.freqX
  const fyF = props.freqY
  const px = props.phaseX
  const py = props.phaseY
  let i = 0
  for (let y = 0; y < ch; y++) {
    const ny = y / ch
    for (let x = 0; x < cw; x++) {
      const nx = x / cw
      const r = (Math.sin((nx + px) * Math.PI * 2 * fxF * cw) * 0.5 + 0.5) * 255
      const g = (Math.sin((ny + py) * Math.PI * 2 * fyF * ch) * 0.5 + 0.5) * 255
      data[i++] = r
      data[i++] = g
      data[i++] = 128
      data[i++] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  imageHref.value = canvas.toDataURL('image/png')
}

function snapshot() {
  sizeCanvas()
  renderMap()
  updateFilterFrame()
}

let lastEntry: ResizeObserverEntry | undefined

function measureLayoutSize(el: HTMLElement) {
  const entry = lastEntry
  if (entry?.borderBoxSize?.[0]) {
    const b = entry.borderBoxSize[0]
    w.value = Math.max(1, Math.round(b.inlineSize))
    h.value = Math.max(1, Math.round(b.blockSize))
  }
  else {
    w.value = Math.max(1, el.offsetWidth)
    h.value = Math.max(1, el.offsetHeight)
  }
}

onMounted(() => {
  filterId.value
    = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `lg-${crypto.randomUUID()}`
      : `lg-${Math.random().toString(36).slice(2)}`
  defs = ensureDefsHost()
  createFilter()
  canvas = document.createElement('canvas')

  if (root.value) {
    measureLayoutSize(root.value)
    ro = new ResizeObserver((entries) => {
      lastEntry = entries[0]
      if (root.value) {
        measureLayoutSize(root.value)
        snapshot()
      }
    })
    ro.observe(root.value)
  }

  snapshot()
  void root.value?.offsetWidth
  ready.value = true
})

onBeforeUnmount(() => {
  if (ro && root.value)
    ro.unobserve(root.value)
  ro = null
  ctx = null
  canvas = null
  if (filterEl && defs)
    defs.removeChild(filterEl)
  filterEl = null
  feImageEl = null
  feDispEl = null
})
watch(
  () => [
    props.canvasDpi,
    props.freqX,
    props.freqY,
    props.phaseX,
    props.phaseY,
    props.scale,
    props.overscanPct,
    props.regionPadPx,
  ],
  () => snapshot(),
)
</script>

<template>
  <span
    v-bind="$attrs"
    ref="root"
    class="relative isolate inline-block overflow-hidden bg-transparent"
    :style="{
      '--lg-blur': `${blur}px`,
      '--lg-bright': String(brightness),
      '--lg-sat': String(saturate),
    }"
  >
    <!-- Effect -->
    <span
      class="lg-effect pointer-events-none absolute inset-0 z-0 bg-[rgba(255,255,255,0.001)]"
      :style="ready ? { filter: `url(#${filterId})` } : null"
    />
    <!-- Tint -->
    <span class="pointer-events-none absolute inset-0 z-10" :style="{ background: tint }" />
    <!-- Shine -->
    <span class="pointer-events-none absolute inset-0 z-20 shadow-inner" />
    <!-- Text -->
    <span class="relative z-30 whitespace-nowrap"><slot /></span>
  </span>
</template>

<style scoped>
.lg-effect {
  backdrop-filter: blur(var(--lg-blur)) brightness(var(--lg-bright)) saturate(var(--lg-sat));
  -webkit-backdrop-filter: blur(var(--lg-blur)) brightness(var(--lg-bright)) saturate(var(--lg-sat));
}
</style>
