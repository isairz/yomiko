<template>
  <div class="manga-swipe-viewer">
    <article>
      <div class="info">{{ `${this.page} / ${item.pages.length} ${item.name}` }}</div>
      <div class="wrap"
        v-touch:pan="onPan"
        v-touch-options:pan="{ direction: 'horizontal', threshold: 10 }"
        v-touch:doubletap="onDoubleTap"
        @wheel="handleWheel"
      >
        <div class="slide" :style="slide(index)" v-for="index in maxPage">
          <div class="image" v-if="index >= pageDebounded - 1 && index <= pageDebounded + 4" :style="`background-image: url(${src(index)})`"></div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'manga-swipe-viewer',
  data () {
    return {
      page: 1,
      pageDebounded: 1,
      pageDeboundTimer: null,
      translate: 0,
      transition: false,
      transitionTimer: null,
      maxPage: this.item && this.item.pages ? this.item.pages.length : 0,
    }
  },
  props: {
    item: Object,
  },
  mounted () {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  serverCacheKey: props => {
    return `${props.item.id}::${props.item.__lastUpdated}`
  },
  methods: {
    src (index) {
      if (index < 1 || index > this.item.pages.length) return ''
      // const numberOfFrontends = 7
      // const sub = String.fromCharCode(97 + (this.item.id % numberOfFrontends))
      const sub = 'la'
      return `https://${sub}.hitomi.la/galleries/${this.item.id}/${this.item.pages[index - 1].name}`
    },
    slide (index) {
      let style = ''

      let x = 0
      if (index < this.page - 1) x = '100%'
      else if (index > this.page + 1) x = '-100%'
      else if (index < this.page) x = `calc(100% + ${this.translate}px)`
      else if (index > this.page) x = `calc(-100% + ${this.translate}px)`
      else x = `${this.translate}px`
      style += `transform: translate3d(${x}, 0, 0);`

      if (this.transition) style += 'transition: transform 200ms cubic-bezier(0.26, 0.86, 0.44, 0.985)'
      else style += 'transition: none'

      return style
    },
    goPrevPage () {
      if (this.page > 1) --this.page
      clearTimeout(this.pageDeboundTimer)
      this.pageDeboundTimer = setTimeout(() => { this.pageDebounded = this.page }, 200)
    },
    goNextPage () {
      if (this.page < this.maxPage) ++this.page
      clearTimeout(this.pageDeboundTimer)
      this.pageDeboundTimer = setTimeout(() => { this.pageDebounded = this.page }, 200)
    },
    goLeftPage () {
      this.goNextPage()
    },
    goRightPage () {
      this.goPrevPage()
    },
    goFirstPage () {
      this.page = 1
    },
    goLastPage () {
      this.page = this.maxPage
    },
    handleKeyDown (e) {
      switch (e.key || e.keyIdentifier) {
        case 'ArrowUp':
        case 'PageUp':
          this.goPrevPage()
          break
        case 'ArrowDown':
        case 'PageDown':
          this.goNextPage()
          break
        case 'ArrowLeft':
          this.goLeftPage()
          break
        case 'ArrowRight':
          this.goRightPage()
          break
        case 'Home':
          this.goFirstPage()
          break
        case 'End':
          this.goLastPage()
          break
        case '[': case 'U+005B':
          this.goPrevChapter()
          break
        case ']': case 'U+005D':
          this.goNextChapter()
          break
        case ' ': case 'U+0020':
          if (e.shiftKey) this.goPrevPage()
          else this.goNextPage()
          break
        default :
          return
      }
    },
    handleWheel (e) {
      e.preventDefault()
      if (e.deltaY > 0) this.goNextPage()
      if (e.deltaY < 0) this.goPrevPage()
    },
    onPan (e) {
      if (e.isFinal) {
        if (this.translate < -30) this.goRightPage()
        else if (this.translate > 30) this.goLeftPage()
        this.translate = 0
        this.transition = true
        clearTimeout(this.transitionTimer)
        this.transitionTimer = setTimeout(() => {
          this.transition = false
        }, 200)
      } else {
        this.translate = e.deltaX
        this.transition = false
      }
    },
    onDoubleTap (e) {
      const el = this.$el
      if (el.requestFullscreen) {
        el.requestFullscreen()
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen()
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      }
    },
  },
}
</script>

<style lang="sass">
.manga-swipe-viewer
  article
    position: fixed
    overflow: hidden
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: black
    z-index: 10

  .info
    position: fixed
    left: 10px
    top: 4px
    color: #c0c0c0
    z-index: 1000

  .wrap, .slide, .image
    width: 100%
    height: 100%

  .slide
    position: absolute
    transform: translate3d(0, 0, 0)
    &.left
      transform: translate3d(-100%, 0, 0)
    &.right
      transform: translate3d(100%, 0, 0)

  .wrap
    position: relative
    z-index: 1

  .image
    background-size: contain
    background-repeat: no-repeat
    background-position: center
</style>
