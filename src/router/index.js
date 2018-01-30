import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'

import Player from '../components/Player.vue'

Vue.use(Router)
Vue.use(Resource)

export default new Router({
  routes: [
    {
      path: '/player/:mid',
      name: 'player',
      component: Player
    }
  ]
})
