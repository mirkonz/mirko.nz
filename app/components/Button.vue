<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    is?: string
    padding?: string
  }>(),
  {
    padding: 'px-6 py-4',
  },
)

const colorMode = useColorMode()
const brightness = computed(() => (colorMode.value === 'dark' ? 0.5 : 0.9))
</script>

<template>
  <component :is="props.is || 'button'" class="group inline-block rounded-full transition focus-visible:outline-0">
    <LiquidGlass
      :brightness="brightness"
      class="hover:text-primary group-focus-visible:outline-primary cursor-pointer rounded-full font-semibold text-black shadow-md transition-transform duration-150 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 dark:text-white dark:shadow-black [&>*]:rounded-full"
      :class="props.padding"
    >
      <slot />
    </LiquidGlass>
  </component>
</template>
