<template>
  <div v-if="values" :class="param">
    <router-link
      class="pink"
      v-for="value in values"
      :to="`/manga/${param}/${value}`"
    >
      {{ value }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'tag-list',
  props: ['param', 'values'],
}
</script>
