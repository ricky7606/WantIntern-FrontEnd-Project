<template lang="html">
  <div class="wechat-login-page xsx-form-theme">
    <div class="wechat-scanning-window" v-if="isWechatWindowShow">
      <div id="login_container"></div>
    </div>
  </div>
</template>

<script>
  // import * as Req from '@/api/index.js'
  // import * as ReqUrl from '@/api/url.js'
  import * as Storage from '@/utils/storage.js'
  const WechatAuthKey = 'Wechat_Auth_Key'

  export default {
    name: 'WechatLogin',
    data () {
      return {
        isWechatWindowShow: false
      }
    },
    mounted () {
      this.showQrocde()
    },
    methods: {
      showQrocde () {
        // show wechat binding page
        this.showWechatBindingWindow()
        Storage.Set({
          type: 'Login',
          expireTime: new Date().getTime()
        }, WechatAuthKey)
      },
      showWechatBindingWindow () {
        this.isWechatWindowShow = true
        this.$nextTick(x => {
          let hostUrl = 'http://www.xiangshixi.com/auth.html'
          // let redirectUri = `/${location.hash}`
          /* eslint-disable */

          let stateText = Math.random()
          let obj = new WxLogin({
            id: 'login_container',
            appid: 'wx44895bec275b61e6',
            scope: 'snsapi_login',
            redirect_uri: `${hostUrl}`,
            state: stateText,
            style: 'black', // black or white
            href: '',
          })
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .wechat-login-page {
    display: block;
    // width: 645px;
    // height: 367px;
    padding-bottom: 70px;
    margin: 0 auto;
    background-color: white;

    padding-top: 40px;

    .wechat-scanning-window {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
