<script setup lang="ts">
import type { NuxtError } from '#app'
import NotFoundImage from '@/assets/icons/404.svg'

defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="flex min-h-screen min-w-screen flex-grow flex-col">
    <div class="fixed inset-0 flex h-full w-full items-center justify-center">
      <NotFoundImage class="origin-[50%_65%] scale-150 fill-current object-cover" />
    </div>
    <main class="relative z-20 flex flex-grow flex-col justify-center px-6 text-center text-white">
      <div>
        <template v-if="error.statusCode === 404">
          <h1 class="text-primary !mb-8 !text-6xl">
            Oops! Not Found
          </h1>
          <p class="!mb-8">
            Looks like you've followed a broken link or entered a URL that doesn't exist on this site.
          </p>
        </template>
        <template v-else>
          <h1 class="text-primary !mb-8 !text-6xl">
            Oops! An error occurred
          </h1>
        </template>

        <code class="text-sm">
          <div>Error code: {{ error.statusCode }}</div>
          <div>Error message: {{ error.message }}</div>
        </code>

        <Button class="mt-64 hover:scale-110" @click="handleError">
          Back to home
        </Button>
      </div>
    </main>
    <Footer class="@container fixed right-0 bottom-0 left-0 z-10 px-6" />
  </div>
</template>
