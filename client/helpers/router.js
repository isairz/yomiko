import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Sample from '../views/Sample.vue'

const router = new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', component: Sample },
    { path: '/sample', component: Sample },
    { path: '*', redirect: '/' },
  ],
})

export default router
