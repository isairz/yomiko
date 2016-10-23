<template>
  <div>
    <template v-if="item">
      <div class="title-row"><router-link to='/manga'>Manga</router-link> {{ '>' }} {{ item.title }}</div>
      <manga-list-item :key="item.id" :item="item" />
      <div class='viewer-wrap'>
        <manga-swipe-viewer :item="item" />
      </div>
    </template>
  </div>
</template>

<script>
import MangaListItem from '../components/MangaListItem.vue'
import MangaSwipeViewer from '../components/MangaSwipeViewer.vue'

function fetchItem (store) {
  return store.dispatch('FETCH_MANGA_PAGE', store.state.route.params.id)
}

export default {
  name: 'manga-viewer',
  components: { MangaListItem, MangaSwipeViewer },
  data () {
    return {
      item: null,
    }
  },
  // preFetch: fetchItem,
  beforeMount () {
    fetchItem(this.$store)
    .then(() => {
      this.item = this.$store.state.manga.info[this.$store.state.route.params.id]
    })
  },
}
</script>

<style lang="stylus">
.viewer-wrap
  padding 0 15px
</style>
