<template>
  <div v-if="values" :class="param">
    <router-link
      v-for="value in values"
      :to="`/manga/${param}/${value}`"
    >
      {{ localize(value) }}
    </router-link>
  </div>
</template>

<script>
import constants from '../helpers/constants'
export default {
  name: 'tag-list',
  props: ['param', 'values'],
  methods: {
    localize: (str) => constants[str] ? constants[str] : str,
  }
}
</script>
