<template>
  <ul v-if="posts.length > 0" class="flex flex-col gap-6">
    <li v-for="(post, index) in posts" :key="index">
      <nuxt-link :to="`${postType}/${post.slug}`">
        <template v-if="postType === 'projects'">
          <div class="flex">
            <h3 class="font-bold flex-grow">{{ post.title }}</h3>
            <p class="text-xs text-green uppercase">{{ post.category }}</p>
          </div>
          <p>{{ post.description }}</p>
          <img v-if="post.cover" :src="post.cover" />
        </template>

        <template v-else>
          <!-- <div> -->
          <div class="flex">
            <h3 class="font-bold flex-grow">{{ post.title }}</h3>
            <p v-if="post.createdAt" class="text-xs text-green">{{ formatDate(post.createdAt) }}</p>
          </div>
          <p>{{ post.description }}</p>
          <!-- </div> -->
        </template>
      </nuxt-link>
    </li>
  </ul>
  <div v-else-if="loading">
    <div v-for="placeholder in placeholderClasses" :key="placeholder.id">
      <content-placeholders :rounded="true" :class="placeholder">
        <content-placeholders-heading />
      </content-placeholders>
    </div>
  </div>
  <p v-else>
    {{ amount > 1 ? 'Posts not found' : 'Post not found' }}
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
