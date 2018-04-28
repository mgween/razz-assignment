import Vue from 'vue'
import Router from 'vue-router'

import Prizes from '@/components/Prizes';
import Details from '@/components/Details';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/prizes',
      component: Prizes
    },
    {
      path: '/details/:prize',
      component: Details
    },
    {
      path: '*',
      redirect: '/prizes'
    }
  ]
})
