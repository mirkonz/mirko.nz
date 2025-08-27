<!-- WordHover.vue -->
<template>
  <p ref="root">
    <template v-for="(n, i) in rendered" :key="i">
      <component :is="n" />
    </template>
  </p>
</template>

<script setup lang="ts">
import { computed, h, Text, useSlots } from 'vue'

const slots = useSlots()
const wrapClass = 'inline-block transition hover:bg-primary hover:text-black'

function splitTextPreservingNBSP(s: string, indexOffset = 0) {
  const out: any[] = []
  let buf = ''
  let wordIndex = indexOffset

  const isBreakWS = (ch: string) => ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r'

  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '\u00A0') {
      buf += ch
      continue
    }
    if (isBreakWS(ch)) {
      if (buf) {
        out.push(
          h(
            'span',
            {
              class: wrapClass + ' wh-anim',
              style: { animationDelay: `${wordIndex * 80}ms` }, // stagger
            },
            buf,
          ),
        )
        buf = ''
        wordIndex++
      }
      let j = i
      while (j + 1 < s.length && isBreakWS(s[j + 1])) j++
      out.push(h(Text, s.slice(i, j + 1)))
      i = j
      continue
    }
    buf += ch
  }
  if (buf) {
    out.push(
      h(
        'span',
        {
          class: wrapClass + ' wh-anim',
          style: { animationDelay: `${wordIndex * 80}ms` },
        },
        buf,
      ),
    )
  }
  return out
}

function renderNodes(nodes: any[], indexOffset = 0): any[] {
  const out: any[] = []
  for (const n of nodes) {
    if (n?.type === Text && typeof n.children === 'string') {
      out.push(...splitTextPreservingNBSP(n.children, out.length))
    } else {
      out.push(n)
    }
  }
  return out
}

const rendered = computed(() => renderNodes(slots.default?.() ?? []))
</script>

<style>
@keyframes wh-fade-up {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.wh-anim {
  opacity: 0;
  animation-name: wh-fade-up;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-timing-function: ease-out;

  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
</style>
