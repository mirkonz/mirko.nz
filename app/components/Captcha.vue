<template>
  <div ref="wrap" class="relative w-full h-full">
    <canvas ref="canvas" class="block w-full h-full" @mousedown="onMouseDown" @mousemove="onMouseMove" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

type Pt = { x: number; y: number }
class Dot {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  within(px: number, py: number, r: number) {
    return Math.hypot(px - this.x, py - this.y) < r
  }
}

const emit = defineEmits<{ (e: 'completed'): void; (e: 'reset'): void }>()
const props = withDefaults(defineProps<{ dotSize?: number }>(), { dotSize: 12 })

const wrap = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let ro: ResizeObserver | null = null
let raf = 0

const dotSize = computed(() => props.dotSize)

const L = 0.1
const C = 0.5
const R = 0.9
const TOP = 0.1
const MID = 0.5
const BOT = 0.9
const guidePointsNorm: Pt[] = [
  { x: L, y: BOT },
  { x: L, y: TOP },
  { x: C, y: MID },
  { x: R, y: TOP },
  { x: R, y: BOT },
  { x: C, y: MID },
  { x: L, y: BOT },
]

function scalePoints(points: Pt[], w: number, h: number): Pt[] {
  return points.map((p) => ({ x: p.x * w, y: p.y * h }))
}

let cssW = 0
let cssH = 0
let guideDots: Dot[] = []
let dots: Dot[] = []
let currentIndex = 0
let drawingCompleted = false
let lastPos: Pt = { x: 0, y: 0 }
let currentPos: Pt = { x: 0, y: 0 }

function resizeCanvasToParent() {
  const el = wrap.value
  const c = canvas.value
  if (!el || !c) return
  const dpr = Math.max(1, window.devicePixelRatio || 1)
  cssW = el.clientWidth
  cssH = el.clientHeight
  c.style.width = `${cssW}px`
  c.style.height = `${cssH}px`
  c.width = Math.round(cssW * dpr)
  c.height = Math.round(cssH * dpr)
  ctx = c.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const scaled = scalePoints(guidePointsNorm, cssW, cssH)
  guideDots = scaled.map((p) => new Dot(p.x, p.y))
  if (dots.length === 0) {
    lastPos = { ...guideDots[0] }
    currentPos = { ...guideDots[0] }
  }
}

function init() {
  resizeCanvasToParent()
  dots = []
  currentIndex = 0
  drawingCompleted = false
  lastPos = { ...guideDots[0] }
  currentPos = { ...guideDots[0] }
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, cssW, cssH)

  for (let i = 0; i < dots.length; i++) {
    const d = dots[i]
    if (i > 0) {
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(d.x, d.y)
      ctx.lineTo(dots[i - 1].x, dots[i - 1].y)
      ctx.stroke()
    }
  }

  for (let i = 0; i < guideDots.length; i++) {
    if (!drawingCompleted && i === currentIndex) continue
    const g = guideDots[i]
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.beginPath()
    ctx.ellipse(g.x, g.y, dotSize.value / 4, dotSize.value / 4, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  if (!drawingCompleted && currentIndex > 0) {
    ctx.strokeStyle = 'oklch(0.91 0.25 132 / 1)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(currentPos.x, currentPos.y)
    ctx.stroke()
  }

  if (!drawingCompleted && guideDots[currentIndex]) {
    const g = guideDots[currentIndex]
    ctx.fillStyle = 'oklch(0.91 0.25 132 / 1)'
    ctx.beginPath()
    ctx.ellipse(g.x, g.y, dotSize.value / 1, dotSize.value / 1, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  if (drawingCompleted && dots.length > 1) {
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(dots[0].x, dots[0].y)
    for (let i = 1; i < dots.length; i++) ctx.lineTo(dots[i].x, dots[i].y)
    ctx.stroke()
  }

  raf = requestAnimationFrame(draw)
}

function toCanvasCoords(e: MouseEvent) {
  const cv = canvas.value
  if (!cv) return { x: 0, y: 0 }
  const rect = cv.getBoundingClientRect()
  const scaleX = cv.width / rect.width
  const scaleY = cv.height / rect.height
  const dpr = window.devicePixelRatio || 1
  return { x: ((e.clientX - rect.left) * scaleX) / dpr, y: ((e.clientY - rect.top) * scaleY) / dpr }
}

function onMouseDown(e: MouseEvent) {
  const { x: mx, y: my } = toCanvasCoords(e)
  currentPos.x = mx
  currentPos.y = my
  const next = guideDots[currentIndex]
  if (!drawingCompleted && next?.within(mx, my, dotSize.value)) {
    dots.push(new Dot(next.x, next.y))
    currentIndex++
    lastPos = { x: next.x, y: next.y }
    currentPos = { x: next.x, y: next.y }
    if (currentIndex === guideDots.length) {
      drawingCompleted = true
      emit('completed')
    }
  }
}

function onMouseMove(e: MouseEvent) {
  const { x, y } = toCanvasCoords(e)
  currentPos.x = x
  currentPos.y = y
}

function reset() {
  init()
  emit('reset')
}
defineExpose({ reset })

onMounted(() => {
  ro = new ResizeObserver(resizeCanvasToParent)
  if (wrap.value) ro.observe(wrap.value)
  init()
  raf = requestAnimationFrame(draw)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  if (ro) ro.disconnect()
})
</script>
