<template>
  <div class="manga-scroll-viewer is-shadow">
    <div class="title-row"><router-link to='/manga'>Manga</router-link> {{ '>' }} {{ item.name }}</div>
    <progress class="progress is-primary" v-show="loaded < item.pages.length" :value="loaded" :max="item.pages.length">{{ `${this.loaded} / ${item.pages.length}` }}</progress>
    <div class='viewer-wrap'>
      <article>
        <div class="manga-page" v-for="page in pages">
          <img :src="page" />
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import MangaListItem from '../components/MangaListItem.vue'

export default {
  name: 'manga-scroll-viewer',
  props: {
    item: Object,
  },
  components: { MangaListItem },
  data () {
    return {
      loaded: 0,
      pages: [],
    }
  },
  mounted () {
    for (let i = 0; i < this.item.pages[0]; i++) {
      const img = new Image()
      img.src = `/files/manga/${this.item.id}/${i}p.jpg`
      this.pages[i] = 'http://www.arabianbusiness.com/skins/ab.main/gfx/loading_spinner.gif'
      img.onload = () => {
        this.pages[i] = img.src
        ++this.loaded
      }
    }
  },
  watch: {
    page (to, from) {
      this.loadItems(to, from)
    },
  },
  serverCacheKey: props => {
    return `${props.item.id}::${props.item.__lastUpdated}`
  },
}
</script>

<style lang="sass">
.manga-scroll-viewer
  padding: 0 15px
  background: white
  .title-row
    font-size: 1em
    color: #666
    padding: 10px 20px
    margin: 0 -15px
    font-weight: normal
    position: relative
    border-bottom: 1px solid #ccc
    overflow: hidden
    background: #f6f6f6
    background: linear-gradient(to bottom, #ffffff, #f8f8f8)
  .progress
    width: auto
    height: 1px
    margin-left: -15px
    margin-right: -15px
  .manga-page
    width: 100%
    img
      width: auto
      max-height: 1024px
      display: block
      margin: 15px auto
</style>
