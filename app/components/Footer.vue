<template>
  <footer class="pb-4 flex items-center flex-col gap-1 text-center text-sm dark:text-white/40 text-black/40">
    <div>&copy; {{ currentYear }} Mirko May &ndash; {{ $t('footer') }}</div>
    <div class="flex justify-center gap-4">
      <a v-for="item in items" class="hover:scale-110 hover:text-primary transition" :href="item.url" target="_blank" :title="`${item.label} profile`" padding="p-2" @click="posthog.capture('lets_connect_item_clicked', { item: item.id })">
        <component :is="iconMap[item.id]" class="fill-current w-4 h-4" aria-hidden="true" />
      </a>
    </div>
    <LanguageSwitcher />
  </footer>
</template>

<script setup>
import github from '@/assets/icons/github.svg'
import codepen from '@/assets/icons/codepen.svg'
import linkedIn from '@/assets/icons/linkedIn.svg'
import xing from '@/assets/icons/xing.svg'

const items = [
  { id: 'linkedIn', label: 'LinkedIn', url: 'https://www.linkedin.com/in/mirkonz/' },
  { id: 'github', label: 'GitHub', url: 'https://github.com/mirkonz' },
  { id: 'codepen', label: 'CodePen', url: 'https://codepen.io/mirkonz' },
  { id: 'xing', label: 'Xing', url: 'http://www.xing.com/profile/Mirko_May2' },
]

const { $posthog } = useNuxtApp()

let posthog
if ($posthog) {
  posthog = $posthog()
}

const currentYear = new Date().getFullYear()
const iconMap = { github, codepen, linkedIn, xing }
</script>
