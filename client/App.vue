<template>
  <div id="app">
      <router-view class="view"></router-view>
    <div>asfad</div>
  </div>
</template>

<style lang="stylus">
.view
  max-width 800px
  margin 0 auto
  position relative
.fade-enter-active, .fade-leave-active
  transition all .2s ease
.fade-enter, .fade-leave-active
  opacity 0
</style>
