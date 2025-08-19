<template>
  <main class="justify-center align-middle">
    <div class="blob" aria-hidden="true"></div>
    <section class="flex flex-col items-center selection:bg-green selection:text-black">
      <div class="max-w-prose relative">
        <div class="w-24 h-24 fixed z-30 top-8 right-8 grid grid-rows-1 grid-cols-1 drop-shadow-xl/25">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            class="fill-current text-green row-start-1 col-start-1"
          >
            <path
              d="M 500 250 A 250 250 0 0 1 250 500 A 250 250 0 0 1 0 250 A 250 250 0 0 1 250 0 A 250 250 0 0 1 500 250 Z"
              style=""
            ></path>
            <path
              d="M 480 250 C 480 377.0254924610825 377.0254924610825 480 250 480 C 122.97450753891752 480 20.000000000000014 377.0254924610825 20 250 C 19.999999999999986 122.97450753891752 122.97450753891754 20.000000000000025 250 20 C 377.0254924610825 20.000000000000007 480 122.97450753891754 480 250"
              style="fill: none; stroke: rgb(0, 0, 0); stroke-width: 8px; stroke-dasharray: 12"
            ></path>
          </svg>
          <span
            class="p-4 font-bold text-center row-start-1 col-start-1 flex items-center justify-center text-xl text-black leading-none"
            >Open for work!</span
          >
        </div>
        <div class="page">
          <div>
            <h1 class="text-4xl mb-4 sr-only">Mirko May</h1>
            <h2 class="text-4xl leading-tight mb-4">
              <span class="block md:inline"><span class="text-green">Hello</span>, </span>
              <span class="block md:inline"><span class="text-green">Kia Ora</span></span>
              <span class="block md:inline">
                and
                <span class="text-green">Moin Moin</span>
              </span>
            </h2>
            <p class="text-2xl">
              I’m <span class="text-green">Mirko</span>, a Front-end/UI Engineer from Wellington, New Zealand. I focus
              on creating clear, accessible and reliable digital experiences. My expertise lies in building design
              systems that scale with products and teams, ensuring consistency, usability and long-term resilience.
            </p>
          </div>
          <div class="text-center fixed bottom-24 right-0 left-0 hidden md:block scroll-indicator">
            <div class="uppercase mb-2">Scroll</div>
            <div class="inline-block w-6 h-6 rounded-full animate-bounce">
              <svg viewBox="0 0 24 24" class="fill-current text-green">
                <path
                  fill="currentColor"
                  d="M16.59,5.59L18,7L12,13L6,7L7.41,5.59L12,10.17L16.59,5.59M16.59,11.59L18,13L12,19L6,13L7.41,11.59L12,16.17L16.59,11.59Z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="page">
          <p class="text-2xl">
            My work centres on user experience, accessibility and SEO-friendly front-end practices, ensuring that
            interfaces are not only intuitive but also discoverable and inclusive. My expertise includes developing
            design patterns, maintaining clear documentation and enabling collaboration between design and engineering
            teams.
          </p>
        </div>

        <div class="page">
          <p class="text-2xl">
            I believe design is about clarity and intent as much as aesthetics. My goal is to reduce friction, support
            creativity and ensure technology remains accessible, user-centred and effective at scale.
          </p>
        </div>

        <!-- <ContentRenderer :value="data" class="markdown mb-4 pointer-events-none" /> -->
        <div class="page flex justify-center max-w-prose mt-8"></div>

        <div
          class="text-center fixed w-full h-full flex left-0 right-0 top-0 bottom-0 items-center justify-center connect"
        >
          <LetsConnect
            :items="[
              { id: 'linkedIn', label: 'LinkedIn', url: 'https://www.linkedin.com/in/mirkonz/' },
              { id: 'github', label: 'GitHub', url: 'https://github.com/mirkonz' },
              { id: 'codepen', label: 'CodePen', url: 'https://codepen.io/mirkonz' },
              { id: 'xing', label: 'Xing', url: 'http://www.xing.com/profile/Mirko_May2' },
            ]"
            :radius="300"
            :spread-deg="50"
            :center-deg="-90"
            :offset-y="200"
          >
            <template #button>
              <div
                class="rounded-full shadow-md transition-shadow duration-500 ease-in-out hover:shadow-xl hover:shadow-green/20"
              >
                <button
                  class="hover:!bg-green transition-all duration-500 inline hover:!text-black font-extrabold px-6 py-4 rounded liquid-glass cursor-pointer"
                >
                  Let’s Connect
                </button>
              </div>
            </template>
            <template #item="{ item }">
              <a
                :href="item.url"
                target="_blank"
                class="text-white hover:!bg-green transition-all duration-500 hover:!text-black p-4 inline-block liquid-glass drop-shadow hover:drop-shadow-black hover:scale-110"
                :title="`${item.label} profile`"
              >
                <component :is="iconMap[item.id]" class="fill-current w-6 h-6" />
              </a>
            </template>
          </LetsConnect>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import github from '@/assets/icons/github.svg'
import codepen from '@/assets/icons/codepen.svg'
import linkedIn from '@/assets/icons/linkedIn.svg'
import xing from '@/assets/icons/xing.svg'

const iconMap = { github, codepen, linkedIn, xing }

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

    // base orbit frequencies
    freq1: 0.8,
    freq2: 1.1,
    freq3: 0.6,
    // how much faster frequencies get at max speed
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
    { passive: true }
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

    // orbit size
    const orbit = cfg.baseOrbitPx + cfg.extraOrbitPxAtMaxSpeed * ease(norm)
    const time = t / 1000

    // speed-scaled frequencies
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

  const ind = document.querySelector('.scroll-indicator')
  const conn = document.querySelector('.connect')
  if (!ind && !conn) return

  const setState = (el, opacity, active) => {
    if (!el) return
    el.style.opacity = String(opacity)
    if (active) {
      el.classList.add('is-active')
      el.ariaHidden = 'false'
    } else {
      el.classList.remove('is-active')
      el.ariaHidden = 'true'
    }
  }

  const clamp1 = (v, a, b) => Math.min(b, Math.max(a, v))

  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const p = clamp1(window.scrollY / max, 0, 1)

    if (ind) {
      const o = clamp1(1 - p / 0.8, 0, 1)
      const active = p < 0.8 && o > 0.01
      setState(ind, o, active)
      ind.style.pointerEvents = 'none' // indicator stays non-interactive
    }

    if (conn) {
      let o = 0
      if (p >= 0.75 && p <= 0.9) o = clamp1((p - 0.75) / 0.15, 0, 1)
      if (p > 0.9) o = 1
      const active = o > 0.01
      setState(conn, o, active)
    }
  }

  update()
  addEventListener('scroll', update, { passive: true })
  addEventListener('resize', update)
})
</script>
