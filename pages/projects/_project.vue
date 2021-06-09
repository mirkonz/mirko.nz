<template>
  <main>
    <section v-if="post">
      <article class="max-w-[65ch]">
        <div class="flex">
          <h2 class="text-4xl flex-grow">{{ post.title }}</h2>
          <p class="text-green uppercase">{{ post.category }}</p>
        </div>
        <p class="text-xl text-white text-opacity-70 mb-6">{{ post.description }}</p>
        <img v-if="post.cover" :src="post.cover" />
        <nuxt-content :document="post" class="prose prose-lg md:prose-xl" />
        <div v-if="post.gallery">
          <img v-for="image in post.gallery" :key="image.id" :src="image" />
        </div>
      </article>

      <nav aria-label="go back">
        <router-back to="/projects" />
      </nav>
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
