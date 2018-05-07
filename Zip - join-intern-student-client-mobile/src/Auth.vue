<template>
  <div id="app">
    <div class="placer-box">
      <page-header />
    </div>
    <div class="extend-body">
      <div class="center-block">
        <logo-header />
        <div class="width">
          <wechat-login-redirect-page />
        </div>
      </div>
    </div>
    <page-footer />
  </div>
</template>

<script>
  import PageHeader from './components/Parent/AuthPageHeader.vue'
  import PageFooter from './components/Parent/Footer.vue'
  import LogoHeader from '@/components/Account/LogoHeader.vue'
  import WechatLoginRedirectPage from '@/components/Account/WechatLoginRedirectPage.vue'

  export default {
    name: 'auth',
    components: {
      PageHeader,
      PageFooter,
      LogoHeader,
      WechatLoginRedirectPage,
    },
  }
</script>

<style lang="less">
  @import "./less/reset.less";
  html {
    min-height: 100%;
  }
  body {
    min-height: 100%;
  }
  #app {
    font-family: 'PingFangSC-Regular', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    min-height: 100%;
    background-color: #F4F3F6;

    .extend-body {
      display: block;
      min-height: 800px;
      min-height: 91vh;
      margin-bottom: -114px;
      padding-bottom: 114px;
    }

    .center-block {
      width: 600px;
      margin: 0 auto;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .width {
      width: 100%;
    }
  }
  .placer-box {
    position: relative;
    height: 70px;
  }
</style>
