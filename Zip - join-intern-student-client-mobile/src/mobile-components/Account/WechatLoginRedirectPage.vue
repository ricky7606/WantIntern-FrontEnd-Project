<template lang="html">
  <div class="wechat-login-page xsx-form-theme">

    <div class="status-text">
      {{statusText}}
    </div>

    <div class="actions" v-show="isShowSettingEntry">
      <div class="input-block">
        <div class="btn plain row" @click="gotoSettingPage">
          {{'回到我的账号绑定页'}}
        </div>
      </div>
    </div>
    <div class="actions" v-if="actionShow">
      <div class="input-block">
        <div class="btn plain row" @click="gotoWechatLogin">
          {{'微信登录 >'}}
        </div>
      </div>
      <div class="input-block">
        <div class="btn plain row" @click="gotoLogin">
          {{'账号密码登录 >'}}
        </div>
      </div>
      <div class="input-block">
        <div class="btn plain row" @click="gotoRigister">
          {{'注册 >'}}
        </div>
      </div>
      <div class="input-block">
        <div class="btn plain orange row" @click="gotoEnterprise">
          {{'企业登录 >'}}
        </div>
      </div>
    </div>

    <div class="wechat-scanning-window" v-if="isWechatWindowShow">
      <div id="login_container"></div>

    </div>
  </div>
</template>

<script>
  import * as Storage from '@/utils/storage.js'
  import $params from '@/utils/$params.js'
  const WechatAuthKey = 'Wechat_Auth_Key'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'WechatLoginRedirectPage',
    data () {
      return {
        isWechatWindowShow: false,
        actionShow: false,
        isShowSettingEntry: false,
        statusText: '正在加载',
      }
    },
    mounted () {
      let str = Storage.Get(WechatAuthKey)
      let json = {}
      if (str) json = str

      console.log('str')
      console.log(str)

      let wechatAuthCode = $params['code']

      if (wechatAuthCode) {
        if (json.expireTime && json.type) {
          Storage.Set({}, WechatAuthKey)
          Req.Get(
            ReqUrl.Wechat.GetToken(),
            {code: wechatAuthCode},
            res => {
              let unionId = res.unionid

              if (unionId) {
                if (json.type === 'Login') {
                  // 登陆
                  this.statusText = '正在验证登陆信息，请稍候...'
                  this.actionShow = true

                  Req.Post(
                    ReqUrl.StudentSubUrl.wechatLogin(unionId),
                    null,
                    res => {
                      this.$nextTick(x => {
                        // location.search = ''
                        // location.reload()
                      })
                      location.href = '/#/mine'
                      // this.$router.replace({
                      //   path: '/mine'
                      // })
                    },
                    fail => {
                      if (fail.response) {
                        console.log(fail.response.data)
                        alert(fail.response.data.userMessage)
                      }
                    }
                  )
                } else if (json.type === 'Binding') {
                  // 绑定
                  this.statusText = '正在验证账号信息，请稍候...'
                  this.isShowSettingEntry = true

                  Req.Put(
                    ReqUrl.OtherSubUrl.putWechatOpenIdToAccount(0, unionId),
                    null,
                    res => {
                      this.$nextTick(x => {
                        // location.search = ''
                        // location.reload()
                      })
                      location.href = '/#/mine/setting'
                    },
                    fail => {
                      console.log(fail)
                    }
                  )
                }
              } else {
                // 无 UnionId
                this.statusText = '微信授权出错，请选择其他方式登陆'
                this.actionShow = true
              }
            },
            fail => {
              console.log(fail)
              console.log('Wechat Auth Code Expired')

              // 没有UnionId
              this.statusText = '微信授权过期，请选择其他方式登陆'
              this.actionShow = true
            }
          )
        } else {
          // 跳转前 无状态
          console.log('nostate')
          this.statusText = '请选择登陆方式'
          this.actionShow = true
        }
      } else {
        // 没有code
        console.log('nocode')
        this.statusText = '请选择登陆方式'
        this.actionShow = true
      }
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
      gotoEnterprise () {
        location.href = '/enterprise/index.html'
      },
      gotoRigister () {
        location.href = '/#/account/register'
      },
      gotoLogin () {
        location.href = '/#/account/login'
      },
      gotoWechatLogin () {
        location.href = '/#/account/wechat-login'
      },
      gotoSettingPage () {
        location.href = '/#/mine/setting'
      },
      showWechatBindingWindow () {
        this.isWechatWindowShow = true
        this.$nextTick(x => {
          let hostUrl = 'http://www.xiangshixi.com'
          let redirectUri = `/${location.hash}`
          /* eslint-disable */

          let stateText = Math.random()
          let obj = new WxLogin({
            id: 'login_container',
            appid: 'wx44895bec275b61e6',
            scope: 'snsapi_login',
            redirect_uri: `${hostUrl}${redirectUri}`,
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
    min-height: 367px;
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
  .status-text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 30px;
  }
  .actions {
    margin: 0 auto;
    margin-top: 30px;
    width: 260px;
  }
</style>
