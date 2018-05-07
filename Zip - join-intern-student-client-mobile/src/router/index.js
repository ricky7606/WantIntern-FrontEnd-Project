import Vue from 'vue'
import Router from 'vue-router'

/* eslint-disable no-userd-vars */
import PageMain from '@/mobile-components/Pages/PageMain.vue'

// pages
import PageHome from '@/mobile-components/Pages/PageHome.vue'
import PageCompany from '@/mobile-components/Pages/PageCompany.vue'
import PageNews from '@/mobile-components/Pages/PageNews.vue'
import PageAccount from '@/mobile-components/Pages/PageAccount.vue'

import PageLogin from '@/mobile-components/Account/Login.vue'
import PageLogout from '@/mobile-components/Account/Logout.vue'

import PagePositionDetail from '@/mobile-components/Pages/PagePositionDetail.vue'
import PageCompanyDetail from '@/mobile-components/Pages/PageCompanyDetail.vue'
import PageNewsDetail from '@/mobile-components/Pages/PageNewsDetail.vue'
import PageSetting from '@/mobile-components/Pages/PageSetting.vue'

// Single Page
import PageAgreement from '@/mobile-components/SinglePage/PageAgreement.vue'
import PageAbout from '@/mobile-components/SinglePage/PageAbout.vue'
import PageBindingPhone from '@/mobile-components/SinglePage/PageBindingPhone.vue'
import PageVerifyPhone from '@/mobile-components/SinglePage/PageVerifyPhone.vue'
import PageCache from '@/mobile-components/SinglePage/PageCache.vue'
import PageFeedback from '@/mobile-components/SinglePage/PageFeedback.vue'
import PageMessage from '@/mobile-components/SinglePage/PageMessage.vue'
import PageMessageDetail from '@/mobile-components/SinglePage/PageMessageDetail.vue'
import PageSalaryDetail from '@/mobile-components/SinglePage/PageSalaryDetail.vue'
import PageResumeDetail from '@/mobile-components/SinglePage/PageResumeDetail.vue'
// import PageRateCompany from '@/mobile-components/SinglePage/PageRateCompany.vue'

// import PagePositionList from '@/mobile-components/SinglePage/PagePositionList.vue'
import PagePositionList0 from '@/mobile-components/SinglePage/PagePositionList0.vue'
import PagePositionList1 from '@/mobile-components/SinglePage/PagePositionList1.vue'
import PagePositionList2 from '@/mobile-components/SinglePage/PagePositionList2.vue'
import PagePositionList3 from '@/mobile-components/SinglePage/PagePositionList3.vue'
import PagePositionList4 from '@/mobile-components/SinglePage/PagePositionList4.vue'
import PagePositionList5 from '@/mobile-components/SinglePage/PagePositionList5.vue'

import PageRegister from '@/mobile-components/SinglePage/PageRegister.vue'
import PageResetPassword from '@/mobile-components/SinglePage/PageResetPassword.vue'
import PageResetPhone from '@/mobile-components/SinglePage/PageResetPhone.vue'
import PageResume from '@/mobile-components/SinglePage/PageResume.vue'
import PageSubscribe from '@/mobile-components/SinglePage/PageSubscribe.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: PageMain,
      children: [
        {
          path: '',
          name: 'PageMain',
          component: PageHome,
        },
        {
          path: 'company',
          name: 'PageCompany',
          component: PageCompany,
        },
        {
          path: 'news',
          name: 'PageNews',
          component: PageNews,
        },
        {
          path: 'account',
          name: 'PageAccount',
          component: PageAccount,
        },
        {
          path: 'company-detail/:id',
          name: 'PageCompanyDetail',
          component: PageCompanyDetail,
        },
      ]
    },
    {
      path: '/position-detail/:id',
      name: 'PagePositionDetail',
      component: PagePositionDetail,
    },
    {
      path: '/news-detail/:id',
      name: 'PageNewsDetail',
      component: PageNewsDetail,
    },
    {
      path: '/agreement',
      name: 'PageAgreement',
      component: PageAgreement,
    },
    {
      path: '/about',
      name: 'PageAbout',
      component: PageAbout,
    },
    {
      path: '/setting',
      name: 'PageSetting',
      component: PageSetting,
    },
    {
      path: '/reset-password',
      name: 'PageResetPassword',
      component: PageResetPassword,
    },
    {
      path: '/register/:phone/:unionid',
      name: 'PageRegister',
      component: PageRegister,
    },
    {
      path: '/reset-phone',
      name: 'PageResetPhone',
      component: PageResetPhone,
    },
    {
      path: '/binding-phone/:phone/:unionid',
      name: 'PageBindingPhone',
      component: PageBindingPhone,
    },
    {
      path: '/verify-phone/:unionid',
      name: 'PageVerifyPhone',
      component: PageVerifyPhone,
    },
    {
      path: '/cache',
      name: 'PageCache',
      component: PageCache,
    },
    {
      path: '/feedback',
      name: 'PageFeedback',
      component: PageFeedback,
    },
    {
      path: '/message',
      name: 'PageMessage',
      component: PageMessage,
    },
    {
      path: '/message/:type/:id',
      name: 'PageMessageDetail',
      component: PageMessageDetail,
    },
    {
      path: '/salary/:id',
      name: 'PageSalaryDetail',
      component: PageSalaryDetail,
    },
    {
      path: '/resume-detail/:id',
      name: 'PageResumeDetail',
      component: PageResumeDetail,
    },
    // {
    //   path: '/rate/:id',
    //   name: 'PageRateCompany',
    //   component: PageRateCompany,
    // },
    {
      path: '/subscribe',
      name: 'PageSubscribe',
      component: PageSubscribe,
    },
    {
      path: '/resume',
      name: 'PageResume',
      component: PageResume,
    },
    // {
    //   path: '/position-list',
    //   name: 'PagePositionList',
    //   component: PagePositionList,
    // },
    {
      path: '/login',
      name: 'PageLogin',
      component: PageLogin,
    },
    {
      path: '/logout',
      name: 'PageLogout',
      component: PageLogout,
    },
    {
      path: '/position-list/NEW',
      name: 'PagePositionList0',
      component: PagePositionList0,
    },
    {
      path: '/position-list/CONFIRMED',
      name: 'PagePositionList1',
      component: PagePositionList1,
    },
    {
      path: '/position-list/OFFERED',
      name: 'PagePositionList2',
      component: PagePositionList2,
    },
    {
      path: '/position-list/WORKING',
      name: 'PagePositionList3',
      component: PagePositionList3,
    },
    {
      path: '/position-list/COMMENTED',
      name: 'PagePositionList4',
      component: PagePositionList4,
    },
    {
      path: '/position-list/CANCELED',
      name: 'PagePositionList5',
      component: PagePositionList5,
    },
    {
      path: '*',
      redirect: '/'
    },
  ]
})
