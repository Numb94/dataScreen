import Vue from 'vue'
import VueRouter from 'vue-router'
import dataScreen from '../views/dataScreen/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redierct: '/dataScreen',
    name: 'dataScreen',
    component: dataScreen
  }
]

const router = new VueRouter({
  routes
})

export default router
