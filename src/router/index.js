import Vue from 'vue'
import Router from 'vue-router'
import Player from '../components/Player.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/player/:mid',
      name: 'player',
      component: Player
    }
  ]
})
