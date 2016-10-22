<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<style lang="sass">
@import './variables.sass'
</style>

<style lang="stylus">
.fade-enter-active, .fade-leave-active
  transition: all .2s ease
.fade-enter, .fade-leave-active
  opacity: 0
</style>
