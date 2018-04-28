import Vue from 'vue'
import Router from 'vue-router'

import Prizes from '@/components/Prizes';
import Details from '@/components/Details';
import AddUser from '@/components/AddUser';

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
      path: '/add-user',
      component: AddUser
    },
    {
      path: '*',
      redirect: '/prizes'
    }
  ]
})
