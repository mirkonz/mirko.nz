<script setup>
const { locales, locale, setLocale } = useI18n()

const otherLocales = computed(() => locales.value.filter(l => l.code !== locale.value))
</script>

<template>
  <button
    v-for="l in otherLocales"
    :key="l.code"
    class="hover:text-primary focus-visible:outline-primary cursor-pointer rounded underline transition focus-visible:outline-2 focus-visible:outline-offset-2"
    @click="setLocale(l.code)"
  >
    {{ l.name }}
  </button>
</template>
