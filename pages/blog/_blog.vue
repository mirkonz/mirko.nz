<template>
  <main>
    <section v-if="post">
      <article class="max-w-[65ch]">
        <div class="flex">
          <h2 class="text-4xl flex-grow">{{ post.title }}</h2>
          <time v-if="post.createdAt" class="text-green uppercase">{{ formatDate(post.createdAt) }}</time>
        </div>
        <h3 class="text-xl text-white text-opacity-70 mb-6">{{ post.description }}</h3>
        <nuxt-content :document="post" class="prose prose-lg md:prose-xl" />
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
