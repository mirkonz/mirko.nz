<script setup>
const { locales, locale, setLocale } = useI18n()

const otherLocales = computed(() => locales.value.filter((l) => l.code !== locale.value))
</script>

<template>
  <button
    v-for="l in otherLocales"
    :key="l.code"
    @click="setLocale(l.code)"
    class="underline cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary rounded"
  >
    {{ l.name }}
  </button>
</template>
