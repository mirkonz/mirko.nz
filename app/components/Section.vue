<template>
  <div class="page">
    <slot />
  </div>
</template>

<script lang="ts" setup></script>

<style>
.page {
  min-height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
/*
.page > p {
  animation: text-appear ease-in both;
  animation-timeline: view();
  animation-range: 0vh 50vh;
}

@keyframes text-appear {
  from {
    opacity: 0;
    filter: blur(var(--blur-xl));
    color: var(--color-black);
    translate: 0 10rem;
  }
} */
</style>
