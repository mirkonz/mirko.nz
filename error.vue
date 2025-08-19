<script setup lang="ts">
import type { NuxtError } from '#app'
import NotFoundImage from '@/public/404.svg'

defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen min-w-screen flex flex-col flex-grow">
    <div class="fixed inset-0 w-full h-full flex justify-center items-center">
      <NotFoundImage class="object-cover fill-current scale-150 origin-[50%_65%]" />
    </div>
    <main class="px-6 relative z-20 flex-grow flex flex-col text-white justify-center text-center">
      <div>
        <template v-if="error.statusCode === 404">
          <h1 class="!text-6xl text-green !mb-8">Oops! Not Found</h1>
          <p class="!mb-8">
            Looks like you've followed a broken link or entered a URL that doesn't exist on this site.
          </p>
        </template>
        <template v-else>
          <h1 class="!text-6xl text-green !mb-8">Oops! An error occurred</h1>
        </template>

        <code class="text-sm">
          <div>Error code: {{ error.statusCode }}</div>
          <div>Error message: {{ error.message }}</div>
        </code>

        <button @click="handleError" class="cursor-pointer mt-64">
          <LiquidGlass
            class="rounded-full [&>*]:rounded-full px-6 py-4 text-white hover:scale-110 hover:text-green transition-transform duration-150 shadow-lg shadow-black font-semibold"
          >
            Back to home
          </LiquidGlass>
        </button>
      </div>
    </main>
    <Footer class="@container px-6 fixed z-10 bottom-0 left-0 right-0" />
  </div>
</template>
