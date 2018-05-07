import Vue from 'vue'
import Router from 'vue-router'

// Account
import Account from '@/components/Account.vue'
import RegisterPhoneNumber from '@/components/Account/PhoneNumber.vue'
import RegisterAgreement from '@/components/Account/Agreement.vue'
import RegisterInfomationForm from '@/components/Account/InfomationForm.vue'
import Login from '@/components/Account/Login.vue'
import Logout from '@/components/Account/Logout.vue'
import RegisterFinish from '@/components/Account/RegisterFinish.vue'
// import ForgetPassword from '@/components/Account/ForgetPassword.vue'

// Mine
import MinePage from '@/components/MinePage.vue'
import MineMessage from '@/components/Mine/Message.vue'
import MineSetting from '@/components/Mine/Setting.vue'
import MineInformation from '@/components/Mine/Information.vue'

// /Enterprise
import EnterpriseEntryPage from '@/components/EnterpriseEntry.vue'
import EnterpriseMatters from '@/components/Enterprise/Matters.vue'
import EnterprisePositionManagement from '@/components/Enterprise/PositionManagement.vue'
import EnterprisePositionEditor from '@/components/Enterprise/PositionEditor.vue'
import EnterpriseResumeManagement from '@/components/Enterprise/ResumeManagement.vue'
import EnterpriseInternsManagement from '@/components/Enterprise/InternsManagement.vue'
import EnterpriseInternsBackgrounds from '@/components/Enterprise/InternsBackgrounds.vue'

import NewsInfoPage from '@/components/NewsInfo.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/account',
      component: Account,
      children: [
        {
          path: '',
          name: 'Register',
          component: RegisterPhoneNumber
        },
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
          path: 'finish',
          name: 'RegisterFinish',
          component: RegisterFinish,
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
        // {
        //   path: 'lostpassword',
        //   name: 'ForgetPassword',
        //   component: ForgetPassword,
        // },
      ]
    },
    {
      path: '/main',
      component: EnterpriseEntryPage,
      children: [
        {
          path: '',
          name: 'Main',
          component: EnterpriseMatters,
        },
        {
          path: 'matters',
          name: 'matters',
          component: EnterpriseMatters,
        },
        {
          path: 'position-management',
          name: 'position-management',
          component: EnterprisePositionManagement,
        },
        {
          path: 'position-editor/:id',
          name: 'position-editor',
          component: EnterprisePositionEditor,
        },
        {
          path: 'resume-management',
          name: 'resume-management',
          component: EnterpriseResumeManagement,
        },
        {
          path: 'interns-management',
          name: 'interns-management',
          component: EnterpriseInternsManagement,
        },
        {
          path: 'interns-backgrounds',
          name: 'interns-backgrounds',
          component: EnterpriseInternsBackgrounds,
        },
        // {
        //   path: 'interns',
        //   name: 'Interns',
        //   component: Interns,
        // },
      ]
    },
    {
      path: '/mine',
      // name: 'MinePage',
      component: MinePage,
      children: [
        {
          path: 'message',
          name: 'MineMessage',
          component: MineMessage,
        },
        {
          path: 'setting',
          name: 'MineSetting',
          component: MineSetting,
        },
        {
          path: 'information',
          name: 'MineInformation',
          component: MineInformation,
        },
        {
          path: 'help/:type',
          name: 'NewsInfoPage',
          component: NewsInfoPage
        },
      ]
    },
    {
      path: '*',
      redirect: '/account/login'
    },
  ]
})
