import Vue from 'vue'
import Router from 'vue-router'

// Account
import Account from '@/components/Account.vue'

import Login from '@/components/Account/Login.vue'
import Logout from '@/components/Account/Logout.vue'

// import Message from '@/components/Mine/Message.vue'

import AdminPage from '@/components/AdminPage.vue'
import AdminIndex from '@/components/Admin/Index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/account',
      component: Account,
      children: [
        {
          path: '',
          name: 'Default',
          component: Login,
        },
        {
          path: 'login',
          name: 'Login',
          component: Login,
        },
        {
          path: 'logout',
          name: 'Logout',
          component: Logout,
        },
      ]
    },
    {
      path: '/admin',
      component: AdminPage,
      children: [
        {
          path: '',
          name: 'AdminIndex',
          component: AdminIndex,
        },
        {
          path: 'item/:tabname/:title',
          name: 'AdminIndex-Item',
          component: AdminIndex,
        },
        {
          path: 'api-item/:tabname/:title',
          name: 'AdminIndex-ApiItem',
          component: AdminIndex,
        },
        // {
        //   path: 'message',
        //   name: 'MineMessage',
        //   component: MineMessage,
        // },
        // {
        //   path: 'setting',
        //   name: 'MineSetting',
        //   component: MineSetting,
        // },
        // {
        //   path: 'information',
        //   name: 'MineInformation',
        //   component: MineInformation,
        // },
      ]
    },
    // {
    //   path: '/',
    //   name: 'default',
    //   component: Login
    // },
    {
      path: '*',
      redirect: '/account/login'
    },
  ]
})
