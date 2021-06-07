<template>
  <main>
    <section>
      <template v-if="error.statusCode === 404">
        <h1>{{ error.message || 'Page Not Found' }}</h1>
        <h2>404</h2>
        <p>Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</p>
      </template>
      <template v-else>
        <h1>An error occurred</h1>
        <p>Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</p>
      </template>
      <nav aria-label="go to home">
        <router-back to="/" />
      </nav>
    </section>
  </main>
</template>

<script>
export default {
  name: 'error',
  props: ['error'],
}
</script>
