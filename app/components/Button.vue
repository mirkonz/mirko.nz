<template>
  <component :is="is || 'button'" class="group inline-block transition rounded-full focus-visible:outline-0">
    <LiquidGlass
      :brightness="brightness"
      class="rounded-full [&>*]:rounded-full px-6 py-4 dark:text-white text-black hover:text-primary transition-transform duration-150 shadow-md dark:shadow-black font-semibold cursor-pointer group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-primary"
    >
      <slot />
    </LiquidGlass>
  </component>
</template>

<script setup lang="ts">
defineProps<{
  is?: string
}>()

const colorMode = useColorMode()
const brightness = computed(() => (colorMode.value === 'dark' ? 0.5 : 0.9))
</script>
