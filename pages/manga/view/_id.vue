<template>
  <section class="viewer-section">
    <div class="container" >
      <manga-swipe-viewer :item="mangaInfo" v-if="$store.state.manga.mode"/>
      <manga-scroll-viewer :item="mangaInfo" v-else/>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "nuxt-class-component"
import { Getter, Action } from "vuex-class"

import MangaScrollViewer from '~components/MangaScrollViewer.vue'
import MangaSwipeViewer from '~components/MangaSwipeViewer.vue'

function fetchItem (store) {
  return store.dispatch('FETCH_MANGA_PAGE', store.state.route.params.id)
}

@Component({
  components: {
    MangaScrollViewer,
    MangaSwipeViewer
  }
})
export default class MangaViewPage extends Vue {
  validate ({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id)
  }

  @Getter mangaInfo
  @Action fetchMangaPage

  asyncData ({ params, store }) {
    return store.dispatch('fetchMangaPage', params.id)
  }

  mounted () {
    window.addEventListener('keydown', this.handleKeyDown)
  }
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }
  
  handleKeyDown (e) {
    switch (e.key) {
      case 'F2':
        this.$store.dispatch('TOGGLE_VIEWER_MODE')
        e.preventDefault()
        break
    }
  }
}
</script>

<style lang="sass">
  .viewer-section
    margin: 0
    padding: 40px 0
</style>
