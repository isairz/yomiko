import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Sample from '../views/Sample.vue'

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', component: Sample },
    { path: '*', redirect: '/' },
  ],
})

export default router
