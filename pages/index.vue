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
@layer base {
  .markdown {
    @apply space-y-4; /* Adds spacing between block elements */

    h1 { @apply mb-8 text-4xl font-bold; }
    h2 { @apply mb-6 text-3xl font-semibold; }
    h3 { @apply mb-4 text-2xl font-medium; }
    p { @apply mb-2 text-base; }

    /* Lists */
    ul { @apply mb-4 pl-5 list-disc; }
    ul li { @apply mb-1 marker:text-green; }

    /* Ensure proper spacing when elements follow each other */
    h1 + h2, h2 + h3, h3 + p, p + ul, ul + p, ul + ul { @apply mt-4; }

    /* Avoid extra spacing at the bottom of a section */
    h1:last-child, h2:last-child, h3:last-child, p:last-child, ul:last-child { @apply mb-0; }
  }
}

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