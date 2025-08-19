<template>
  <main class="justify-center align-middle">
    <div class="blob" aria-hidden="true"></div>

    <section v-if="data">
      <h1 v-html="data.title" class="text-4xl mb-4"></h1>
      <nuxt-content :document="data" class="markdown mb-4 max-w-prose" />
      <div class="flex justify-center max-w-prose mt-8">
        <button class="hover:!bg-green transition inline hover:text-black font-extrabold px-6 py-4 rounded liquid-glass">
          Let’s Connect
        </button>
      </div>
    </section>

    <div class="w-32 h-32 fixed top-3 right-3 grid grid-rows-1 grid-cols-1">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" class="fill-current text-green row-start-1 col-start-1">
        <path d="M 500 250 A 250 250 0 0 1 250 500 A 250 250 0 0 1 0 250 A 250 250 0 0 1 250 0 A 250 250 0 0 1 500 250 Z" style=""></path>
        <path d="M 480 250 C 480 377.0254924610825 377.0254924610825 480 250 480 C 122.97450753891752 480 20.000000000000014 377.0254924610825 20 250 C 19.999999999999986 122.97450753891752 122.97450753891754 20.000000000000025 250 20 C 377.0254924610825 20.000000000000007 480 122.97450753891754 480 250" style="fill: none; stroke: rgb(0, 0, 0); stroke-width: 8px; stroke-dasharray: 12;"></path>
      </svg>
      <span class="p-4 font-bold text-center row-start-1 col-start-1 flex items-center justify-center text-2xl text-black leading-none">Open for work!</span>
    </div>

    <!-- <section class="mt-16 w-96">
      <h3 class="text-2xl text-green">Latest blog post</h3>
      <posts post-type="blog" :amount="1" class="posts" />
    </section> -->


  </main>
</template>

<script>
export default {
  async asyncData({ $content, error }) {
    let data
    try {
      data = await $content('home').fetch()
    } catch (e) {
      error({ message: 'Home content not found' })
    }
    return {
      data,
      // liquidGlass: `<div class="liquid-glass">Drag me around!</div>`
    }
  },
  mounted() {
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
  },
}
</script>
