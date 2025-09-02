<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Pt { x: number, y: number }

const props = withDefaults(
  defineProps<{
    dotSize?: number
    dotsWidth?: number
    dotsHeight?: number
  }>(),
  {
    dotSize: 12,
    dotsWidth: 300,
    dotsHeight: 300,
  },
)

const emit = defineEmits<{ (e: 'completed'): void, (e: 'reset'): void }>()

class Dot {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let ro: ResizeObserver | null = null
let raf = 0
let globalHandlersAttached = false
let mouseOverCanvas = false

const dotSize = computed(() => props.dotSize)

// Normalized guide points in [0..1] space
const L = 0.1
const C = 0.5
const R = 0.9
const TOP = 0.1
const MID = 0.5
const BOT = 0.9
const normalizedGuidePoints: Pt[] = [
  { x: L, y: BOT },
  { x: L, y: TOP },
  { x: C, y: MID },
  { x: R, y: TOP },
  { x: R, y: BOT },
  { x: C, y: MID },
  { x: L, y: BOT },
]

function scalePoints(points: Pt[], w: number, h: number): Pt[] {
  return points.map(p => ({ x: p.x * w, y: p.y * h }))
}

// Canvas CSS size (logical pixels)
let cssW = 0
let cssH = 0

// Uniform scale and centering between world (dotsWidth x dotsHeight) and canvas
let scale = 1
let offsetX = 0
let offsetY = 0

// World-space data (independent of canvas size)
let guideDotsWorld: Dot[] = []
let drawnDotsWorld: Dot[] = []
let currentIndex = 0
let drawingCompleted = false
let lastPosWorld: Pt = { x: 0, y: 0 }
let currentPosWorld: Pt = { x: 0, y: 0 }

function worldToCanvas(p: Pt): Pt {
  return { x: p.x * scale + offsetX, y: p.y * scale + offsetY }
}

function canvasToWorld(p: Pt): Pt {
  const s = scale || 1
  return { x: (p.x - offsetX) / s, y: (p.y - offsetY) / s }
}

function getThemeColors() {
  const root = document.documentElement
  const isDark = root.classList.contains('dark-mode') || document.body.classList.contains('dark-mode')
  const styles = getComputedStyle(root)
  const colorPrimary = (styles.getPropertyValue('--color-primary') || '').trim()
  const colorWhite = (styles.getPropertyValue('--color-white') || '').trim()
  const colorBlack = (styles.getPropertyValue('--color-black') || '').trim()
  return {
    line: isDark ? colorWhite : colorBlack,
    guideFill: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
    primary: colorPrimary,
  }
}

function resizeCanvasToElement() {
  const c = canvas.value
  if (!c)
    return
  const dpr = Math.max(1, window.devicePixelRatio || 1)
  const rect = c.getBoundingClientRect()
  cssW = Math.round(rect.width)
  cssH = Math.round(rect.height)
  c.width = Math.max(1, Math.round(cssW * dpr))
  c.height = Math.max(1, Math.round(cssH * dpr))
  ctx = c.getContext('2d')
  if (ctx)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const targetW = props.dotsWidth
  const targetH = props.dotsHeight
  if (targetW > 0 && targetH > 0 && cssW > 0 && cssH > 0) {
    const containScale = Math.min(cssW / targetW, cssH / targetH)
    // Respect the requested dots size in px; only scale down if needed
    scale = Math.min(1, containScale)
    offsetX = (cssW - targetW * scale) / 2
    offsetY = (cssH - targetH * scale) / 2
  }

  if (drawnDotsWorld.length === 0 && guideDotsWorld.length > 0) {
    lastPosWorld = { ...guideDotsWorld[0] }
    currentPosWorld = { ...guideDotsWorld[0] }
  }
}

function buildGuideDots() {
  const scaled = scalePoints(normalizedGuidePoints, props.dotsWidth, props.dotsHeight)
  guideDotsWorld = scaled.map(p => new Dot(p.x, p.y))
}

function init() {
  buildGuideDots()
  resizeCanvasToElement()
  drawnDotsWorld = []
  currentIndex = 0
  drawingCompleted = false
  if (guideDotsWorld.length > 0) {
    lastPosWorld = { ...guideDotsWorld[0] }
    currentPosWorld = { ...guideDotsWorld[0] }
  }
  else {
    lastPosWorld = { x: 0, y: 0 }
    currentPosWorld = { x: 0, y: 0 }
  }
}

function draw() {
  // Keep canvas sized to its own box even if it changes later
  const c = canvas.value
  if (c) {
    const rect = c.getBoundingClientRect()
    if (Math.round(rect.width) !== cssW || Math.round(rect.height) !== cssH || cssW === 0 || cssH === 0)
      resizeCanvasToElement()
  }

  if (!ctx) {
    raf = requestAnimationFrame(draw)
    return
  }
  ctx.clearRect(0, 0, cssW, cssH)

  const colors = getThemeColors()

  for (let i = 0; i < drawnDotsWorld.length; i++) {
    const dCanvas = worldToCanvas(drawnDotsWorld[i])
    if (i > 0) {
      const prevCanvas = worldToCanvas(drawnDotsWorld[i - 1])
      ctx.strokeStyle = colors.line
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(dCanvas.x, dCanvas.y)
      ctx.lineTo(prevCanvas.x, prevCanvas.y)
      ctx.stroke()
    }
  }

  for (let i = 0; i < guideDotsWorld.length; i++) {
    if (!drawingCompleted && i === currentIndex)
      continue
    const gCanvas = worldToCanvas(guideDotsWorld[i])
    ctx.fillStyle = colors.guideFill
    ctx.beginPath()
    ctx.ellipse(gCanvas.x, gCanvas.y, dotSize.value / 4, dotSize.value / 4, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  if (!drawingCompleted && currentIndex > 0) {
    const a = worldToCanvas(lastPosWorld)
    const b = worldToCanvas(currentPosWorld)
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  if (!drawingCompleted && guideDotsWorld[currentIndex]) {
    const gCanvas = worldToCanvas(guideDotsWorld[currentIndex])

    // Pulsing ring animation around the next dot
    const now = performance.now()
    const duration = 1200 // ms per pulse
    const phase = (now % duration) / duration // 0..1
    const minR = dotSize.value * 1.1
    const maxR = dotSize.value * 2.2
    const r = minR + (maxR - minR) * phase
    const alpha = 0.7 * (1 - phase)

    ctx.save()
    ctx.strokeStyle = colors.primary
    ctx.globalAlpha = alpha
    ctx.lineWidth = Math.max(1, dotSize.value * 0.2)
    ctx.beginPath()
    ctx.ellipse(gCanvas.x, gCanvas.y, r, r, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // Solid dot
    ctx.fillStyle = colors.primary
    ctx.beginPath()
    ctx.ellipse(gCanvas.x, gCanvas.y, dotSize.value, dotSize.value, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  if (drawingCompleted && drawnDotsWorld.length > 1) {
    ctx.strokeStyle = colors.line
    ctx.lineWidth = 1
    ctx.beginPath()
    const start = worldToCanvas(drawnDotsWorld[0])
    ctx.moveTo(start.x, start.y)
    for (let i = 1; i < drawnDotsWorld.length; i++) {
      const p = worldToCanvas(drawnDotsWorld[i])
      ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()
  }

  updateCursor()
  raf = requestAnimationFrame(draw)
}

function toCanvasCoords(e: MouseEvent) {
  const cv = canvas.value
  if (!cv)
    return { x: 0, y: 0 }
  const rect = cv.getBoundingClientRect()
  const scaleXPx = cv.width / rect.width
  const scaleYPx = cv.height / rect.height
  const dpr = window.devicePixelRatio || 1
  return { x: ((e.clientX - rect.left) * scaleXPx) / dpr, y: ((e.clientY - rect.top) * scaleYPx) / dpr }
}

function isWithinTarget(mxCanvas: number, myCanvas: number, targetWorld: Pt, radiusPx: number) {
  const t = worldToCanvas(targetWorld)
  return Math.hypot(mxCanvas - t.x, myCanvas - t.y) < radiusPx
}

function onMouseDown(e: MouseEvent) {
  const { x: mxCanvas, y: myCanvas } = toCanvasCoords(e)
  const { x: mxWorld, y: myWorld } = canvasToWorld({ x: mxCanvas, y: myCanvas })
  currentPosWorld.x = mxWorld
  currentPosWorld.y = myWorld
  const next = guideDotsWorld[currentIndex]
  if (!drawingCompleted && next && isWithinTarget(mxCanvas, myCanvas, next, dotSize.value)) {
    drawnDotsWorld.push(new Dot(next.x, next.y))
    currentIndex++
    lastPosWorld = { x: next.x, y: next.y }
    currentPosWorld = { x: next.x, y: next.y }
    if (currentIndex === guideDotsWorld.length) {
      drawingCompleted = true
      emit('completed')
    }
  }
}

function onMouseMove(e: MouseEvent) {
  const { x: mxCanvas, y: myCanvas } = toCanvasCoords(e)
  const { x, y } = canvasToWorld({ x: mxCanvas, y: myCanvas })
  currentPosWorld.x = x
  currentPosWorld.y = y
  mouseOverCanvas = true
}

// Allow interactions even when canvas is visually behind other elements
function onGlobalMouseDown(e: MouseEvent) {
  const c = canvas.value
  if (!c || e.target === c)
    return
  const rect = c.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0)
    return
  // Only handle when pointer is within the canvas box
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)
    return
  onMouseDown(e)
}
function onGlobalMouseMove(e: MouseEvent) {
  const c = canvas.value
  if (!c || e.target === c)
    return
  const rect = c.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0)
    return
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
    mouseOverCanvas = false
    return
  }
  onMouseMove(e)
}

function onMouseLeave() {
  mouseOverCanvas = false
}

function updateCursor() {
  const c = canvas.value
  if (!c)
    return
  let cursor: string | null = null
  if (!drawingCompleted && guideDotsWorld[currentIndex] && mouseOverCanvas) {
    const cur = worldToCanvas(currentPosWorld)
    const target = worldToCanvas(guideDotsWorld[currentIndex])
    const within = Math.hypot(cur.x - target.x, cur.y - target.y) < dotSize.value
    if (within)
      cursor = 'pointer'
  }
  c.style.cursor = cursor ?? 'default'
  if (globalHandlersAttached) {
    document.body.style.cursor = mouseOverCanvas ? (cursor ?? '') : ''
  }
}

function reset() {
  init()
  emit('reset')
}
defineExpose({ reset })

onMounted(() => {
  ro = new ResizeObserver(resizeCanvasToElement)
  if (canvas.value)
    ro.observe(canvas.value)
  init()
  raf = requestAnimationFrame(draw)
  if (!globalHandlersAttached) {
    window.addEventListener('mousedown', onGlobalMouseDown, { capture: true })
    window.addEventListener('mousemove', onGlobalMouseMove, { capture: true })
    globalHandlersAttached = true
  }
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  if (ro)
    ro.disconnect()
  if (globalHandlersAttached) {
    window.removeEventListener('mousedown', onGlobalMouseDown, { capture: true } as any)
    window.removeEventListener('mousemove', onGlobalMouseMove, { capture: true } as any)
    globalHandlersAttached = false
  }
  document.body.style.cursor = ''
})

watch(() => [props.dotsWidth, props.dotsHeight], () => {
  // Rebuild guide path when the logical positions grid changes
  init()
})
</script>

<template>
  <canvas
    ref="canvas"
    class="block h-full w-full"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  />
</template>
