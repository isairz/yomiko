<template>
  <nav class="pagination is-centered is-small" style="margin: 20px 0">
    <ul class="pagination-list">
      <li v-if="page > 1"><router-link class="pagination-link" :to="{ query: { page: 1 } }" exact>«</router-link></li>
      <li v-for="p in pagination" :key="p"><router-link class="pagination-link" :class="{'is-current': p === page}" :to="{ query: { page: p } }" exact>{{ p }}</router-link></li>
      <li v-if="page < maxPage"><router-link class="pagination-link" :to="{ query: { page: maxPage } }" exact>»</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ['page', 'maxPage'],
  computed: {
    pagination () {
      if (this.page > this.maxPage) return []
      const from = Math.max(this.page * 1 - 3, 1)
      const to = Math.min(this.page * 1 + 3, this.maxPage)
      return Array.from(Array(to - from + 1), (_, i) => (from + i))
    },
  },
}
</script>

<style lang="sass">
</style>