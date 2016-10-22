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

const app = new Vue({
  router,
  store,
  ...App,
})

export { app, router, store }
