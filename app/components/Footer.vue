<template>
  <footer class="pb-6 flex items-center flex-col-reverse md:flex-row gap-4 md:gap-2 text-center">
    <div class="flex-grow text-sm dark:text-white/40 text-black/40">
      &copy; {{ currentYear }} Mirko May &ndash; {{ $t('footer') }}
      <br />
      <LanguageSwitcher />
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
