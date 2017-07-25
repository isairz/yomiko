<template>
  <div>
    <div class="columns is-multiline is-mobile">
      <div class="column is-one-quarter-desktop is-one-third-tablet is-half-mobile" v-for="item in items" :key="item.id">
         <manga-list-item :item="item">
        </manga-list-item> 
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop } from "vue-property-decorator"
import Component from "nuxt-class-component"
import MangaListItem from '~components/MangaListItem.vue'

@Component({
  components: {
    MangaListItem
  } 
})
export default class MangaList extends Vue {
  @Prop()
  items: object
}
</script>
