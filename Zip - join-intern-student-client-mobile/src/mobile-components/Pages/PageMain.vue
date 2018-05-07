<template>
  <div id="app">
    <div class="main-body">
      <router-view />
    </div>
    <div class="footer">
      <page-footer
        @change="footerIndexChange"
        :selected-index="footerItemSelectedIndex"
        :list="footerItemList" />
    </div>
  </div>
</template>

<script>
  import PageFooter from '@/mobile-components/Parent/Footer.vue'
  // import * as Storage from '@/utils/storage.js'
  // import * as Req from '@/api/index.js'
  // import * as ReqUrl from '@/api/url.js'

  // import $params from '@/utils/$params.js'
  import { FooterBar } from '@/assets/wechat-stu/index.js'

  const footerItemList = [
    {
      title: '首页',
      component: 'PageMain',
      icon: FooterBar[0][1],
      iconSelected: FooterBar[0][0],
    },
    {
      title: '公司',
      component: 'PageCompany',
      icon: FooterBar[1][1],
      iconSelected: FooterBar[1][0],
    },
    {
      title: '资讯',
      component: 'PageNews',
      icon: FooterBar[2][1],
      iconSelected: FooterBar[2][0],
    },
    {
      title: '我的',
      component: 'PageAccount',
      icon: FooterBar[3][1],
      iconSelected: FooterBar[3][0],
    },
  ]

  export default {
    name: 'PageMain',
    data () {
      return {
        footerItemList,
        footerItemSelectedIndex: 0,
      }
    },
    beforeRouteEnter (to, from, next) {
      console.log(to.name)
      next(vm => {
        let routerName = to.name
        switch (routerName) {
          case 'PageMain':
            vm.footerItemSelectedIndex = 0
            break
          case 'PageCompany':
            vm.footerItemSelectedIndex = 1
            break
          case 'PageNews':
            vm.footerItemSelectedIndex = 2
            break
          case 'PageAccount':
            vm.footerItemSelectedIndex = 3
            break
        }
      })
    },
    methods: {
      footerIndexChange (index) {
        this.footerItemSelectedIndex = index
        let tabItem = this.footerItemList[index]
        this.changeRouter(tabItem)
      },
      changeRouter (tabItem) {
        let name = tabItem.component
        this.$router.replace({
          name
        })
      },
    },
    components: {
      PageFooter
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/reset.less";

  #app {
    font-family: 'PingFangSC-Regular', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    min-height: 100%;
    background-color: #F4F3F6;

    .main-body {
      padding-bottom: 50px;
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;

      border-top: 1px solid #EDEEF1;
    }
  }
</style>
