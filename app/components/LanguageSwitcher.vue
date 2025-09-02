<script setup>
const { locales, locale, setLocale } = useI18n()

const otherLocales = computed(() => locales.value.filter(l => l.code !== locale.value))
</script>

<template>
  <Button
    v-for="l in otherLocales"
    :key="l.code"
    variant="normal"
    @click="setLocale(l.code)"
  >
    {{ l.name }}
  </Button>
</template>
