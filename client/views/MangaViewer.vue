<template>
  <section class="viewer-section" v-if="item">
    <div class="container" >
      <manga-swipe-viewer :item="item" v-if="$store.state.manga.mode"/>
      <manga-scroll-viewer :item="item" v-else/>
    </div>
  </section>
</template>

<script>
import MangaScrollViewer from '../components/MangaScrollViewer.vue'
import MangaSwipeViewer from '../components/MangaSwipeViewer.vue'

function fetchItem (store) {
  return store.dispatch('FETCH_MANGA_PAGE', store.state.route.params.id)
}

export default {
  name: 'manga-viewer',
  components: { MangaScrollViewer, MangaSwipeViewer },
  preFetch: fetchItem,
  data () {
    return {
      item: null,
    }
  },
  beforeMount () {
    fetchItem(this.$store)
    .then(() => {
      this.item = this.$store.state.manga.info[this.$store.state.route.params.id]
    })
  },
  mounted () {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    handleKeyDown (e) {
      switch (e.key) {
        case 'F2':
          this.$store.dispatch('TOGGLE_VIEWER_MODE')
          e.preventDefault()
          break
      }
    },
  },
}
</script>

<style lang="sass">
  .viewer-section
    margin: 0
    padding: 40px 0
</style>
