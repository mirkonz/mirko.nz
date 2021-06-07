<template>
  <main>
    <section v-if="post">
      <nav aria-label="go back">
        <router-back />
      </nav>

      <article>
        <img v-if="post.cover" :src="post.cover" />
        <h6>{{ post.category }}</h6>
        <h1>{{ post.title }}</h1>
        <p>{{ post.description }}</p>
        <nuxt-content :document="post" />
        <div v-if="post.gallery">
          <img v-for="image in post.gallery" :key="image.id" :src="image" />
        </div>
      </article>
    </section>
  </main>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    let post
    try {
      post = await $content('projects', params.project).fetch()
    } catch (e) {
      error({ message: 'Project not found' })
    }
    return { post }
  },
}
</script>
