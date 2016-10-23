import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import App from './App.vue'
import store from './helpers/store'
import router from './helpers/router'
import * as filters from './helpers/filters'

sync(store, router)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

if (typeof window !== 'undefined') {
  const VueTouch = require('vue-touch')
  VueTouch.registerCustomEvent('doubletap', {
    type: 'tap',
    taps: 2,
  })
  Vue.use(VueTouch)
}

const app = new Vue({
  router,
  store,
  ...App,
})

export { app, router, store }
