<template>
  <div class="manga-item">
    <div class="card">
      <div class="card-image">
        <nuxt-link :to="`/manga/view/${item.id}`">
          <figure class="image is-1by1 thumbnail">
            <img :src="`//tn.hitomi.la/smalltn/${item.id}/${item.thumbnail}.jpg`">
          </figure>
        </nuxt-link>
      </div>
      <div class="card-content">
        <div class="content">
          <h3 class="title">
            <nuxt-link :to="'/manga/' + item.id">
              {{ item.name }}
            </nuxt-link>
          </h3>
          <div v-if="item.type" class="type">{{ item.type }}</div>
          <tag-list param="author" :values="item.authors" />
          <tag-list param="group" :values="item.groups" />
          <tag-list param="series" :values="item.serieses" />
          <tag-list param="character" :values="item.characters" />
          <div v-if="item.tags" class="tags">
            <nuxt-link
              v-for="value in item.tags"
              :to="`/manga/tag/${value}`"
              :key="value"
            >
              {{ value | tags }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "nuxt-class-component"
import TagList from './TagList.vue'
// import { characters, bookTypes } from '../helpers/constants'

@Component({
  props: {
    item: Object
  },
  components: {
    TagList
  }
})
export default class MangaListItem extends Vue {
}
</script>

<style lang="sass">
.manga-item
  .thumbnail
    padding-top: 144%
    overflow: hidden
    img
      width: auto
      max-width: none
      margin: auto

  .content a:not(.button)
      border-bottom: 0

  .title
    font-weight: 500
    a
      text-decoration: none
      color: #333
      &:hover
        text-decoration: underline
        color: #16BAB4

  .author a
    color: #333366

  .group a
    color: #333366

  .type a
    color: #663366

  .character a
    color: #aaa

  .series a
    color: #ee0043
</style>
