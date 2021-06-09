<template>
  <main>
    <section v-if="posts" class="max-w-[65ch]">
      <h2 class="text-4xl mb-4">Projects</h2>
      <posts post-type="projects" :amount="10" class="" />
    </section>
  </main>
</template>

<script>
export default {
  async asyncData({ $content, error }) {
    let posts
    try {
      posts = await $content('projects').fetch()
    } catch (e) {
      error({ message: 'Projects not found' })
    }
    return { posts }
  },
}
</script>
