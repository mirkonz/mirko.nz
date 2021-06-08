<template>
  <nav aria-label="Main Menu" class="flex pt-10">
    <ul class="flex flex-row gap-8 text-lg">
      <li>
        <nuxt-link to="/" class="" active-class="text-green" exact>Home</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/blog" active-class="text-green">Blog</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/projects" active-class="text-green">Projects</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    isRouteActive(id) {
      if (this.$route.path.includes(id)) {
        return true
      } else {
        return false
      }
    },
    log() {
      console.log(this.categories)
    },
  },
}
</script>

<style lang="postcss" scoped>
</style>
