<template>
  <div id="app">
    <div class="placer-box">
      <page-header />
    </div>
    <div class="extend-body">
      <router-view />
    </div>
    <page-footer />
  </div>
</template>

<script>
  import PageHeader from './components/Parent/Header.vue'
  import PageFooter from './components/Parent/Footer.vue'
  import * as Storage from '@/utils/storage.js'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  const WechatAuthKey = 'Wechat_Auth_Key'
  import $params from '@/utils/$params.js'

  export default {
    name: 'app',
    components: {
      PageHeader,
      PageFooter
    },
    mounted () {
      // 看需要 禁用登陆验证
      let str = Storage.Get(WechatAuthKey)
      let json = {}
      if (str) json = str

      let wechatAuthCode = $params['code']

      if (wechatAuthCode) {
        if (json.expireTime && json.type) {
          Storage.Set({}, WechatAuthKey)

          Req.Get(
            ReqUrl.Wechat.GetToken(),
            {code: wechatAuthCode},
            res => {
              console.log(res)

              let unionId = res.unionid
              if (unionId) {
                if (json.type === 'Login') {
                  Req.Post(
                    ReqUrl.StudentSubUrl.wechatLogin(unionId),
                    null,
                    res => {
                      this.$nextTick(x => {
                        location.search = ''
                        location.reload()
                      })
                      this.$router.replace({
                        path: '/mine'
                      })
                    },
                    fail => {
                      if (fail.response) {
                        console.log(fail.response.data)
                        alert(fail.response.data.userMessage)
                      }
                    }
                  )
                } else if (json.type === 'Binding') {
                  Req.Put(
                    ReqUrl.OtherSubUrl.putWechatOpenIdToAccount(0, unionId),
                    null,
                    res => {
                      this.$nextTick(x => {
                        location.search = ''
                        location.reload()
                      })
                      this.$router.replace({
                        path: '/mine/setting'
                      })
                    },
                    fail => {
                      console.log(fail)
                    }
                  )
                }
              }
            },
            fail => {
              console.log(fail)
              console.log('Wechat Auth Code Expired')
            }
          )
        }
      }
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
      min-height: 94vh;
      margin-bottom: -114px;
      padding-bottom: 114px;
    }
  }
  .placer-box {
    position: relative;
    height: 70px;
  }
</style>
