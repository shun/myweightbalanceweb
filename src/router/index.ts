import Vue from 'vue'
import VueRouter from 'vue-router'
import Graph from '../views/Graph.vue'
import Registry from '../views/Registry.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'registry',
    component: Registry
  },
  {
    path: '/graph',
    name: 'graph',
    component: Graph
  }
]

const router = new VueRouter({
  routes
})

export default router
