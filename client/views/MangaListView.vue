<template>
  <section class="section">
    <div class="container">
      <manga-list :items="items"></manga-list>
      <nav class="pagination">
        <ul>
          <li v-if="page > 1"><router-link class="button" :to="{ query: { page: 1 } }" exact>«</router-link></li>
          <li v-for="p in pagination" :key="p"><router-link class="button" :to="{ query: { page: p } }" exact>{{ p }}</router-link></li>
          <li v-if="hasMore"><router-link class="button" :to="{ query: { page: maxPage } }" exact>»</router-link></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import MangaList from '../components/MangaList.vue'
export default {
  name: 'App',
  components: {
    MangaList,
  },
  data () {
    return {
      transition: 'slide-left',
      items: [],
    }
  },
  computed: {
    page () {
      return Number(this.$store.state.route.query.page) || 1
    },
    maxPage () {
      return this.items.fullLength ? Math.ceil(this.items.fullLength / this.$store.state.manga.itemsPerPage) : 1
    },
    pagination () {
      const from = Math.max(this.page - 3, 1)
      const to = Math.min(this.page + 3, this.maxPage)
      if (!this.items.fullLength) return []
      return Array.from(Array(to - from + 1), (_, i) => (from + i))
    },
    hasMore () {
      return this.page < this.maxPage
    },
  },
  watch: {
    '$route': 'fetchData',
  },
  beforeMount () {
    this.loadItems(this.page)
  },
  methods: {
    fetchData () {
      this.loadItems(this.page)
    },
    loadItems (to = this.page, from = -1) {
      this.loading = true
      this.$store.dispatch('FETCH_MANGA_LIST', {
        page: this.page,
      }).then(() => {
        this.transition = from === -1 ? '' : to > from ? 'slide-left' : 'slide-right'
        this.items = this.$store.getters.mangaList
        // this.loading = false
      })
    },
  },
}
</script>

<style lang="sass" scoped>
  .pagination
    margin-top: 20px
</style>
