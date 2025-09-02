<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'

type RGB = [number, number, number]
type ColorInput = string | RGB

const props = withDefaults(defineProps<{
  num?: number
  colors?: ColorInput[]
  speed?: number
}>(), {
  num: 350,
  colors: () => [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]],
  speed: 1,
})

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let w = 0
let h = 0
let raf = 0
let xpos = 0.5
let particles: Confetti[] = []

const PI_2 = Math.PI * 2

function toRgbTuple(c: ColorInput): RGB {
  if (Array.isArray(c))
    return c
  const s = c.trim()
  if (s.startsWith('#')) {
    const hex = s.slice(1)
    const v = hex.length === 3
      ? hex.split('').map(ch => ch + ch).join('')
      : hex.length === 6 ? hex : '000000'
    const r = Number.parseInt(v.slice(0, 2), 16)
    const g = Number.parseInt(v.slice(2, 4), 16)
    const b = Number.parseInt(v.slice(4, 6), 16)
    return [r, g, b]
  }
  if (s.startsWith('rgb')) {
    const nums = s.replace(/[^\d.,]/g, '').split(',').slice(0, 3).map(n => Number.parseInt(n, 10))
    return [nums[0] || 0, nums[1] || 0, nums[2] || 0]
  }
  return [0, 0, 0]
}

const COLORS: RGB[] = props.colors.map(toRgbTuple)

const range = (a: number, b: number) => (b - a) * Math.random() + a

function drawCircle(x: number, y: number, r: number, style: string) {
  if (!ctx)
    return
  ctx.beginPath()
  ctx.arc(x, y, r, 0, PI_2, false)
  ctx.fillStyle = style
  ctx.fill()
}

class Confetti {
  style: RGB
  rgb: string
  r: number
  r2: number
  opacity = 0
  dop = 0
  x = 0
  y = 0
  xmax = 0
  ymax = 0
  vx = 0
  vy = 0

  constructor() {
    this.style = COLORS[~~range(0, COLORS.length)]
    this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`
    this.r = ~~range(2, 6)
    this.r2 = 2 * this.r
    this.replace()
  }

  replace() {
    const sp = Math.max(0.05, props.speed)
    this.opacity = 0
    this.dop = 0.03 * range(1, 4) * sp
    this.x = range(-this.r2, w - this.r2)
    this.y = range(-20, h - this.r2)
    this.xmax = w - this.r
    this.ymax = h - this.r
    this.vx = (range(0, 2) + 8 * xpos - 5) * sp
    this.vy = (0.7 * this.r + range(-1, 1)) * sp
  }

  draw() {
    this.x += this.vx
    this.y += this.vy
    this.opacity += this.dop
    if (this.opacity > 1) {
      this.opacity = 1
      this.dop *= -1
    }
    if (this.opacity < 0 || this.y > this.ymax)
      this.replace()
    if (!(this.x > 0 && this.x < this.xmax)) {
      this.x = (this.x + this.xmax) % this.xmax
    }
    drawCircle(~~this.x, ~~this.y, this.r, `${this.rgb},${this.opacity})`)
  }
}

function resize() {
  if (!canvas.value)
    return
  w = canvas.value.width = window.innerWidth
  h = canvas.value.height = window.innerHeight
}

function step() {
  if (!ctx)
    return
  raf = requestAnimationFrame(step)
  ctx.clearRect(0, 0, w, h)
  for (const p of particles) p.draw()
}

function onMouseMove(e: MouseEvent) {
  if (!w)
    return
  xpos = e.pageX / w
}

function init() {
  if (!canvas.value)
    return
  ctx = canvas.value.getContext('2d')
  resize()
  particles = Array.from({ length: props.num }, () => new Confetti())
  step()
}

onMounted(() => {
  window.addEventListener('resize', resize, false)
  window.addEventListener('mousemove', onMouseMove, false)
  setTimeout(init, 0)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize, false)
  window.removeEventListener('mousemove', onMouseMove, false)
})

watch(toRef(props, 'colors'), (val) => {
  const mapped = val.map(toRgbTuple)
  for (const p of particles) {
    p.style = mapped[~~range(0, mapped.length)]
    p.rgb = `rgba(${p.style[0]},${p.style[1]},${p.style[2]}`
  }
})

watch(toRef(props, 'num'), (val) => {
  const current = particles.length
  if (val > current) {
    for (let i = 0; i < val - current; i++) particles.push(new Confetti())
  }
  else if (val < current) {
    particles.length = val
  }
})

watch(toRef(props, 'speed'), () => {
  for (const p of particles) p.replace()
})
</script>

<template>
  <canvas ref="canvas" class="block" />
</template>

<style scoped>
canvas { width: 100vw; height: 100vh; display: block; }
</style>
