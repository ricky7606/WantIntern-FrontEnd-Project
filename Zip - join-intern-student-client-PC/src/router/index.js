import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home.vue'
import PositionInfo from '@/components/PositionInfo.vue'
import CompanyInfo from '@/components/CompanyInfo.vue'
import CompanyPage from '@/components/CompanyPage.vue'
import NewsPage from '@/components/NewsPage.vue'
import NewsInfo from '@/components/NewsInfo.vue'
import HelpNewsInfo from '@/components/HelpNewsInfo.vue'

import Account from '@/components/Account.vue'
import RegisterPhoneNumber from '@/components/Account/PhoneNumber.vue'
import RegisterAgreement from '@/components/Account/Agreement.vue'
import RegisterInfomationForm from '@/components/Account/InfomationForm.vue'
import Login from '@/components/Account/Login.vue'
import Logout from '@/components/Account/Logout.vue'
import RegisterFinish from '@/components/Account/RegisterFinish.vue'
import ForgetPassword from '@/components/Account/ForgetPassword.vue'
import WechatLogin from '@/components/Account/WechatLogin.vue'

import Collect from '@/components/Mine/Collect.vue'
import MinePage from '@/components/MinePage.vue'
import Interns from '@/components/Mine/Interns.vue'
import Message from '@/components/Mine/Message.vue'
import Promoted from '@/components/Mine/Promoted.vue'
import Resume from '@/components/Mine/Resume.vue'
import Setting from '@/components/Mine/Setting.vue'
import Subscription from '@/components/Mine/Subscription.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/home/:detail',
      name: 'Home.Detail',
      component: Home,
    },
    {
      path: '/company',
      name: 'CompanyPage',
      component: CompanyPage,
    },
    {
      path: '/news',
      name: 'NewsPage',
      component: NewsPage,
    },
    {
      path: '/news/:pagesize/:pageindex',
      name: 'IndexNewsPage',
      component: NewsPage,
    },
    {
      path: '/account',
      component: Account,
      children: [
        {
          path: 'register',
          name: 'RegisterPhoneNumber',
          component: RegisterPhoneNumber
        },
        {
          path: 'agreement',
          name: 'RegisterAgreement',
          component: RegisterAgreement
        },
        {
          path: 'informationform',
          name: 'RegisterInfomationForm',
          component: RegisterInfomationForm
        },
        {
          path: '',
          name: 'Register',
          component: RegisterPhoneNumber
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
        {
          path: 'lostpassword',
          name: 'ForgetPassword',
          component: ForgetPassword,
        },
        {
          path: 'wechat-login',
          name: 'WechatLogin',
          component: WechatLogin,
        },
        {
          path: 'finish',
          name: 'RegisterFinish',
          component: RegisterFinish,
        },
      ]
    },
    {
      path: '/mine',
      component: MinePage,
      children: [
        {
          path: '',
          name: 'Mine',
          component: Interns,
        },
        {
          path: 'interns',
          name: 'Interns',
          component: Interns,
        },
        {
          path: 'interns/:part',
          name: 'Interns-part',
          component: Interns,
        },
        {
          path: 'message',
          name: 'Message',
          component: Message,
        },
        {
          path: 'promoted',
          name: 'Promoted',
          component: Promoted,
        },
        {
          path: 'resume',
          name: 'Resume',
          component: Resume,
        },
        {
          path: 'setting',
          name: 'Setting',
          component: Setting,
        },
        {
          path: 'subscription',
          name: 'Subscription',
          component: Subscription,
        },
        {
          path: 'collect',
          name: 'Collect',
          component: Collect,
        },
      ]
    },
    // 带页码的主页
    {
      path: '/home/:pageindex-:pagesize',
      name: 'IndexHomepage',
      component: Home,
    },
    // 职位信息
    {
      path: '/PositionInfo/:id',
      name: 'PositionInfo',
      component: PositionInfo,
    },
    {
      path: '/CompanyInfo/:id',
      name: 'CompanyInfo',
      component: CompanyInfo,
    },
    {
      path: '/NewsInfo/:id',
      name: 'NewsInfo',
      component: NewsInfo,
    },
    {
      path: '/help/:type',
      name: 'HelpNewsInfo',
      component: HelpNewsInfo,
    },
    {
      path: '/',
      name: 'default',
      component: Home
    },
    {
      path: '*',
      redirect: '/'
      // name: 'default',
      // component: Home
    },
  ]
})
