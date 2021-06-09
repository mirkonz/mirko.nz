<template>
  <main>
    <section v-if="post">
      <article class="prose prose-lg md:prose-xl">
        <h2>{{ post.title }}</h2>
        <p v-if="post.createdAt" class="text-green uppercase">{{ formatDate(post.createdAt) }}</p>
        <p>{{ post.description }}</p>
        <nuxt-content :document="post" />
      </article>

      <nav aria-label="go back">
        <router-back to="/blog" />
      </nav>
    </section>
  </main>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    let post
    try {
      post = await $content('blog', params.blog).fetch()
    } catch (e) {
      error({ message: 'Blog post not found' })
    }
    return { post }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString(process.env.lang) || ''
    },
  },
}
</script>
