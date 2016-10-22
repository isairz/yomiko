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

<script>
import MangaListItem from './MangaListItem.vue'
export default {
  name: 'manga-list',
  components: {
    MangaListItem,
  },
  props: ['items'],
}
</script>
