<template>
  <div class="manga-scroll-viewer is-shadow">
    <div class="title-row"><router-link to='/manga'>Manga</router-link> {{ '>' }} {{ item.name }}</div>
    <progress class="progress is-primary" v-show="loaded < item.pages.length" :value="loaded" :max="item.pages.length">{{ `${this.loaded} / ${item.pages.length}` }}</progress>
    <div class='viewer-wrap'>
      <article>
        <div class="manga-page" v-for="src in srcs">
          <img :src="src || 'http://www.arabianbusiness.com/skins/ab.main/gfx/loading_spinner.gif'" />
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import MangaListItem from '../components/MangaListItem.vue'

function geturl (id, name) {
  // const numberOfFrontends = 7
  // const sub = String.fromCharCode(97 + (id % numberOfFrontends))
  const sub = 'la'
  return `https://${sub}.hitomi.la/galleries/${id}/${name}`
}

export default {
  name: 'manga-scroll-viewer',
  props: {
    item: Object,
  },
  components: { MangaListItem },
  data () {
    return {
      loaded: 0,
      srcs: [],
    }
  },
  mounted () {
    this.srcs = new Array(this.item.pages.length)
    const loadImage = (i) => {
      const page = this.item.pages[i]
      const img = new Image() // eslint-disable-line
      img.src = geturl(this.item.id, page.name)
      img.onload = () => {
        this.srcs[i] = img.src
        ++this.loaded
        if (this.loaded < this.item.pages.length) loadImage(i + 1)
      }
    }

    loadImage(0)
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
  background: white
  .title-row
    font-size: 1em
    color: #666
    padding: 10px 20px
    font-weight: normal
    position: relative
    border-bottom: 1px solid #ccc
    overflow: hidden
    background: #f6f6f6
    background: linear-gradient(to bottom, #ffffff, #f8f8f8)
  .progress
    width: auto
    height: 1px
  .manga-page
    width: 100%
    padding: 0 15px
    img
      width: auto
      max-height: 1024px
      display: block
      margin: 15px auto
</style>
