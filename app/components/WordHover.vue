<template>
  <p class="word-hover-wrapper">
    <template v-for="(n, i) in rendered" :key="i">
      <component v-if="isVNodeItem(n)" :is="n" />
      <template v-else>{{ n }}</template>
    </template>
  </p>
</template>

<script setup lang="ts">
import { computed, h, useSlots, cloneVNode, isVNode, Text } from 'vue'

const slots = useSlots()
const staggerDelay = 50
const animClass = 'word-anim inline-block transition hover:bg-primary hover:text-black'

const isBreakWS = (ch: string) => ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r'

function splitTextPreservingNBSP(s: string) {
  const parts: string[] = []
  let buf = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '\u00A0') {
      buf += ch
      continue
    }
    if (isBreakWS(ch)) {
      if (buf) {
        parts.push(buf)
        buf = ''
      }
      let j = i
      while (j + 1 < s.length && isBreakWS(s[j + 1])) j++
      parts.push(s.slice(i, j + 1))
      i = j
      continue
    }
    buf += ch
  }
  if (buf) parts.push(buf)
  return parts
}

function renderNodes(nodes: any[]) {
  const out: Array<string | any> = []
  let idx = 0

  for (const n of nodes) {
    if (isVNode(n) && n.type === Text && typeof n.children === 'string') {
      for (const part of splitTextPreservingNBSP(n.children)) {
        if (/^\s+$/.test(part)) {
          out.push(part)
        } else {
          out.push(h('span', { class: animClass, style: { animationDelay: `${idx * staggerDelay}ms` } }, part))
          idx++
        }
      }
    } else if (isVNode(n)) {
      out.push(
        cloneVNode(n, {
          class: [n.props?.class, animClass],
          style: { ...(n.props?.style || {}), animationDelay: `${idx * staggerDelay}ms` },
        }),
      )
      idx++
    }
  }
  return out
}

const rendered = computed(() => renderNodes(slots.default?.() ?? []))
const isVNodeItem = (n: any) => isVNode(n)
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

.word-anim {
  opacity: 0;
  animation-name: wh-fade-up;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-timing-function: ease-out;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
</style>
