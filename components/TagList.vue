<template>
  <div v-if="values" :class="param">
    <nuxt-link
      v-for="value in values"
      :to="`/manga/${param}/${value}`"
      :key="value"
    >
      {{ value }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'tag-list',
  props: ['param', 'values'],
}
</script>
