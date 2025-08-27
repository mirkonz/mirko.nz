<template>
  <div class="blob" aria-hidden="true"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
onMounted(() => {
  const cfg = {
    followLerp: 0.18,
    hueStepPerPx: 0.28,
    hueChangeDurationMs: 700,
    fadeInMs: 180,
    fadeOutMs: 480,
    minScale: 0.9,
    maxScale: 1.8,
    maxSpeedPxPerFrame: 60,
    activityLingerMs: 120,

    baseOrbitPx: 70,
    extraOrbitPxAtMaxSpeed: 90,

    freq1: 0.8,
    freq2: 1.1,
    freq3: 0.6,
    freqSpeedBoost: 1.005,

    minAlpha: 0.2,
    maxAlpha: 1.0,
    alphaPower: 1.2,
  }

  const root = document.documentElement
  let x = innerWidth / 2,
    y = innerHeight / 2
  let fx = x,
    fy = y,
    lastX = x,
    lastY = y
  let hue = 200,
    hueBase = 200,
    tweenStartHue = 200,
    tweenStart = 0,
    tweenEnd = 0
  let speed = 0,
    lastMoveAt = 0,
    alpha = 0
  const seed = Math.random() * 1000
  const phase = {
    g1x: seed + 0.13,
    g1y: seed + 1.37,
    g2x: seed + 2.11,
    g2y: seed + 3.73,
    g3x: seed + 4.57,
    g3y: seed + 5.29,
  }

  addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX
      y = e.clientY
      const dx = x - lastX,
        dy = y - lastY
      const dist = Math.hypot(dx, dy)
      if (dist > 0) {
        hueBase = (hueBase + dist * cfg.hueStepPerPx) % 360
        tweenStartHue = hue
        const now = performance.now()
        tweenStart = now
        tweenEnd = now + cfg.hueChangeDurationMs
        lastMoveAt = now
      }
      lastX = x
      lastY = y
    },
    { passive: true },
  )

  addEventListener('resize', () => {
    x = innerWidth / 2
    y = innerHeight / 2
  })

  const lerp = (a, b, t) => a + (b - a) * t
  const ease = (t) => t * (2 - t)
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

  function frame(t) {
    const px = fx,
      py = fy
    fx = lerp(fx, x, cfg.followLerp)
    fy = lerp(fy, y, cfg.followLerp)
    const frameSpeed = Math.hypot(fx - px, fy - py)
    speed = lerp(speed, frameSpeed, 0.25)

    if (t < tweenEnd) {
      const p = clamp((t - tweenStart) / (tweenEnd - tweenStart), 0, 1)
      hue = lerp(tweenStartHue, hueBase, ease(p)) % 360
    } else {
      hue = hueBase % 360
    }

    const norm = clamp(speed / cfg.maxSpeedPxPerFrame, 0, 1)
    const scale = lerp(cfg.minScale, cfg.maxScale, ease(norm))

    const orbit = cfg.baseOrbitPx + cfg.extraOrbitPxAtMaxSpeed * ease(norm)
    const time = t / 1000

    const freqBoost = 1 + norm * (cfg.freqSpeedBoost - 1)
    const s1 = Math.sin((time + phase.g1x) * cfg.freq1 * freqBoost)
    const c1 = Math.cos((time + phase.g1y) * cfg.freq1 * 0.9 * freqBoost)
    const s2 = Math.sin((time + phase.g2x) * cfg.freq2 * freqBoost)
    const c2 = Math.cos((time + phase.g2y) * cfg.freq2 * 1.05 * freqBoost)
    const s3 = Math.sin((time + phase.g3x) * cfg.freq3 * freqBoost)
    const c3 = Math.cos((time + phase.g3y) * cfg.freq3 * 1.12 * freqBoost)

    const halfW = 210 * scale,
      halfH = 210 * scale
    const p1x = 50 + ((s1 * orbit) / halfW) * 50,
      p1y = 50 + ((c1 * orbit) / halfH) * 50
    const p2x = 50 + ((s2 * orbit) / halfW) * 50,
      p2y = 50 + ((c2 * orbit) / halfH) * 50
    const p3x = 50 + ((s3 * orbit) / halfW) * 50,
      p3y = 50 + ((c3 * orbit) / halfH) * 50

    const alphaNorm = Math.pow(norm, cfg.alphaPower)
    const targetAlpha = cfg.minAlpha + (cfg.maxAlpha - cfg.minAlpha) * alphaNorm
    const fadeMs = t - lastMoveAt <= cfg.activityLingerMs ? cfg.fadeInMs : cfg.fadeOutMs
    const k = fadeMs > 0 ? clamp(1 - Math.exp(-16 / fadeMs), 0, 1) : 1
    alpha = lerp(alpha, targetAlpha, k)

    root.style.setProperty('--x', fx + 'px')
    root.style.setProperty('--y', fy + 'px')
    root.style.setProperty('--h', hue.toFixed(2))
    root.style.setProperty('--scale', scale.toFixed(3))
    root.style.setProperty('--alpha', alpha.toFixed(3))
    root.style.setProperty('--g1x', p1x.toFixed(2) + '%')
    root.style.setProperty('--g1y', p1y.toFixed(2) + '%')
    root.style.setProperty('--g2x', p2x.toFixed(2) + '%')
    root.style.setProperty('--g2y', p2y.toFixed(2) + '%')
    root.style.setProperty('--g3x', p3x.toFixed(2) + '%')
    root.style.setProperty('--g3y', p3y.toFixed(2) + '%')

    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
})
</script>

<style>
:root {
  --x: 50vw;
  --y: 50vh;
  --h: 200;
  --scale: 1;
  --alpha: 0;
  --g1x: 50%;
  --g1y: 50%;
  --g2x: 70%;
  --g2y: 35%;
  --g3x: 30%;
  --g3y: 70%;
}

.blob {
  position: fixed;
  left: var(--x);
  top: var(--y);
  transform: translate(-50%, -50%) scale(var(--scale));
  width: 420px;
  height: 420px;
  pointer-events: none;
  filter: blur(50px) saturate(140%);
  opacity: var(--alpha);
  will-change: transform, opacity, left, top, background;
  mix-blend-mode: screen;
  background:
    radial-gradient(160px circle at var(--g1x) var(--g1y), hsl(var(--h) 95% 60% / 0.95), transparent 60%),
    radial-gradient(190px circle at var(--g2x) var(--g2y), hsl(calc(var(--h) + 60) 95% 60% / 0.75), transparent 65%),
    radial-gradient(220px circle at var(--g3x) var(--g3y), hsl(calc(var(--h) + 120) 95% 60% / 0.6), transparent 70%);
}
</style>
