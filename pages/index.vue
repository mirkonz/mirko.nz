<template>
  <main class="justify-center align-middle">
    <section v-if="data">
      <h1 v-html="data.title" class="text-4xl mb-4"></h1>
      <nuxt-content :document="data" class="markdown mb-4" />
    </section>

    <!-- <section class="mt-16 w-96">
      <h3 class="text-2xl text-green">Latest blog post</h3>
      <posts post-type="blog" :amount="1" class="posts" />
    </section> -->
  </main>
</template>

<style>


/* .markdown h2 {
  @apply text-3xl;
}
.markdown p {
  @apply mt-2;
}
.markdown a {
  @apply text-green;
}
.markdown li {
  @apply list-disc ml-4;
} */

</style>

<script>
export default {
  async asyncData({ $content, error }) {
    let data
    try {
      data = await $content('home').fetch()
    } catch (e) {
      error({ message: 'Home content not found' })
    }
    return { data }
  },
}
</script>