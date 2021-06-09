<template>
  <main class="justify-center">
    <section>
      <template v-if="error.statusCode === 404">
        <h1>{{ error.message || 'Page Not Found' }}</h1>
        <h2 class="text-6xl text-green mb-8">404</h2>
        <p>Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</p>
      </template>
      <template v-else>
        <h1 class="text-6xl text-green mb-8">An error occurred</h1>
        <p>Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</p>
      </template>
    </section>
  </main>
</template>

<script>
export default {
  name: 'error',
  props: ['error'],
}
</script>
