<template>
  <ul v-if="posts.length > 0" class="flex flex-col gap-6">
    <li v-for="(post, index) in posts" :key="index">
      <nuxt-link :to="`${postType}/${post.slug}`">
        <div class="flex items-center">
          <img v-if="post.cover" :src="post.cover" :alt="post.title" class="mr-6 object-cover rounded-full h-32 w-32" />
          <div class="flex-grow">
            <div class="flex">
              <h3 class="text-xl flex-grow">{{ post.title }}</h3>
              <time v-if="post.createdAt" class="text-xs text-green">{{ formatDate(post.createdAt) }}</time>
            </div>
            <p v-if="post.category" class="text-sm text-white text-opacity-70 uppercase">{{ post.category }}</p>
            <p>{{ post.description }}</p>
          </div>
        </div>
      </nuxt-link>
    </li>
  </ul>
  <!-- <div v-else-if="loading">
    <div v-for="placeholder in placeholderClasses" :key="placeholder.id">
      <content-placeholders :rounded="true" :class="placeholder">
        <content-placeholders-heading />
      </content-placeholders>
    </div>
  </div> -->
  <p v-else class="py-12 text-2xl">
    <span class="text-green">Work in progress...</span><br />
    Please come back later!
  </p>
</template>

<script>
export default {
  name: 'Posts',
  props: {
    postType: {
      type: String,
      default: 'blog',
      validator: (val) => ['blog', 'projects'].includes(val),
    },
    amount: {
      // ? https://content.nuxtjs.org/fetching#limitn
      type: Number,
      default: 10,
      validator: (val) => val >= 0 && val < 100,
    },
    sortBy: {
      // ? https://content.nuxtjs.org/fetching#sortbykey-direction
      type: Object,
      default: () => ({
        key: 'slug',
        direction: 'desc', // you probably want 'asc' here
      }),
      validator: (obj) => typeof obj.key === 'string' && typeof obj.direction === 'string',
    },
  },
  data() {
    return {
      posts: [],
      loading: true,
    }
  },
  computed: {
    placeholderClasses() {
      const classes = ['w-full', 'w-2/3', 'w-5/6']
      return [...Array.from({ length: this.amount }, (v, i) => classes[i % classes.length])] // repeats classes after one another
    },
  },
  async mounted() {
    this.loading = true
    this.posts = await this.fetchPosts()
    this.loading = false
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString(process.env.lang) || ''
    },
    async fetchPosts(postType = this.postType, amount = this.amount, sortBy = this.sortBy) {
      return this.$content(postType)
        .sortBy(sortBy.key, sortBy.direction)
        .limit(amount)
        .fetch()
        .catch((err) => {
          error({ statusCode: 404, message: amount > 1 ? 'Posts not found' : 'Post not found' })
        })
    },
  },
}
</script>
