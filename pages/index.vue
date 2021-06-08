<template>
  <main class="justify-center align-middle">
    <section v-if="data">
      <h1 v-html="data.title" class="text-4xl mb-4"></h1>
      <nuxt-content :document="data" class="markdown mb-4" />
      <img v-if="data.cover" :src="data.cover" />
    </section>

    <!-- <section>
      <h3>Latest blog post</h3>
      <posts post-type="blog" :amount="1" />
    </section> -->
  </main>
</template>

<style>
.markdown h2 {
  @apply text-3xl;
}
.markdown p {
  @apply mt-2;
}
.markdown a {
  @apply text-green;
}
</style>

<script>
export default {
  async asyncData({ $content, error }) {
    let data
    try {
      data = await $content('home').fetch()
      console.log(data)
    } catch (e) {
      error({ message: 'Blog posts not found' })
    }
    return { data }
  },
}
</script>