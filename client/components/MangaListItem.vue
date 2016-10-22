<template>
    <div class="card">
      <div class="card-image">
        <router-link :to="'/manga/' + item.id">
          <figure class="image is-1by1 bookrate">
            <img :src="`//tn.hitomi.la/smalltn/${item.id}/${item.thumbnail}.jpg`">
          </figure>
        </router-link>
      </div>
      <div class="card-content">
        <div class="content">
          <h3 class="title">
            <router-link :to="'/manga/' + item.id">
              {{ item.name }}
            </router-link>
          </h3>
          <div v-if="item.type" class="type">{{ bookTypes[item.type] }}</div>
          <tag-list :param="'author'" :values="item.authors" />
          <tag-list :param="'group'" :values="item.groups" />
          <tag-list :param="'character'" :values="item.characters" />
        </div>
      </div>
    </div>
  </router-link>
</template>


<script>
import TagList from './TagList.vue'
import { characters, bookTypes } from '../helpers/constants'
export default {
  name: 'manga-item',
  props: ['item'],
  components: {
    TagList,
  },
  serverCacheKey: props => {
    return `${props.item.id}::${props.item.__lastUpdated}`
  },
  data () {
    return {
      characters,
      bookTypes,
    }
  },
}
</script>
