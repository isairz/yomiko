<template>
  <section class="section">
    <div class="container">
      <manga-list :items="mangaList"></manga-list>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "nuxt-class-component"
import { Getter, Action } from "vuex-class"

import MangaList from '~components/MangaList.vue'

@Component({
  components: {
    MangaList
  }
})
export default class MangaListPage extends Vue {
  @Getter mangaList
  @Action fetchMangaList
  
  asyncData ({store}) {
    return store.dispatch('fetchMangaList', {page: 1})
  }
}
</script>


