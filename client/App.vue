<template>
  <div id="app">
    <top-nav></top-nav>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'
export default {
  name: 'App',
  components: {
    TopNav,
  },
}
</script>

<style lang="sass">
@import './variables.sass'
</style>
