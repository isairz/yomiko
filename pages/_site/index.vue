<template>
  <section class="section">
    <div class="container">
      <manga-list :items="mangaList"></manga-list>
      <pagination :page="page" :maxPage="maxPage"></pagination>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue"
import VueRouter from 'vue-router'
import Component from "nuxt-class-component"
import { Getter } from "vuex-class"

import MangaList from '~components/MangaList.vue'
import Pagination from '~components/Pagination.vue'

@Component({
  components: {
    MangaList,
    Pagination
  }
})
export default class MangaListPage extends Vue {
  @Getter mangaList
  @Getter maxPage
  
  asyncData ({ route, store }) {
    return store.dispatch('fetchMangaList', { page: route.query.page || 1 })
  }

  get page () {
    return this.$route.query.page || 1
  }
}
</script>
