<template>
  <main>
    <section v-if="post">
      <nav aria-label="go back">
        <router-back />
      </nav>

      <article>
        <h5 v-if="post.createdAt">{{ formatDate(post.createdAt) }}</h5>
        <h1>{{ post.title }}</h1>
        <p>{{ post.description }}</p>
        <nuxt-content :document="post" />
      </article>
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
