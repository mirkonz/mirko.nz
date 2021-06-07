<template>
  <main>
    <section v-if="data">
      <h1>{{ data[0].title }}</h1>
      <img v-if="data[0].cover" :src="data[0].cover" />
      <nuxt-content :document="data[0]" />
    </section>

    <section>
      <h3>Latest blog post</h3>
      <posts post-type="blog" :amount="1" />
    </section>
  </main>
</template>

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