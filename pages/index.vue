<template>
  <div>
    <div>
      <section class="hero is-info">
        <div class="hero-body">
          <div class="container has-text-centered">
            <nuxt-link to="/scrap">
              <div class="logo"/>
            </nuxt-link>
            <h1 class="title">
              Yomiko
            </h1>
            <h2 class="subtitle">
              Who is beloved by paper(kami)
            </h2>
          </div>
        </div>
      </section>
    </div>

    <div class="container">
      <nuxt-link v-for="source in sources" :key="source" :to="`/${source}`">
        {{ source }}
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Component from "nuxt-class-component"
import SourceMap from '../api/SourceMap'

@Component({})
export default class IndexPage extends Vue {
  sources = Array.from( SourceMap.keys() )
}
</script>

<style lang="sass">
$cyan: #33e0ff
.logo
  $size: 300px
  margin: auto
  height: $size
  width: $size
  border-radius: $size / 2
  border: 1px solid $cyan
  box-shadow: inset 0 0 10px $cyan
  vertical-align: middle
  background: url('~assets/yomiko.jpg') no-repeat center center
  background-size: cover
</style>


