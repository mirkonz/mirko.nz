<template>
  <main>
    <section v-if="posts" class="max-w-[65ch]">
      <h1 class="text-4xl mb-4">Blog</h1>
      <posts post-type="blog" :amount="10" class="" />
    </section>
  </main>
</template>

<script>
export default {
  async asyncData({ $content, error }) {
    let posts
    try {
      posts = await $content('blog').fetch()
    } catch (e) {
      error({ message: 'Blog posts not found' })
    }
    return { posts }
  },
}
</script>
