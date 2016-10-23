<template>
  <div id="app">
    <top-nav></top-nav>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
    <bottom-info></bottom-info>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'
import BottomInfo from './components/BottomInfo.vue'

export default {
  name: 'App',
  components: {
    TopNav,
    BottomInfo,
  },
}
</script>

<style lang="sass">
@import './variables.sass'
</style>
