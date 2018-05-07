<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import $params from '@/utils/$params.js'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { joinWechatAuthUrl } from '@/utils/helper-functions.js'
  import { MessageBox } from 'mint-ui'
  import * as Storage from '@/utils/storage.js'
  import { Account } from '@/api/account.js'

  export default {
    name: 'app',
    methods: {
      goAuth () {
        let appid = 'wx3157ff5481ec5025'
        let redirectUri = 'http://www.xiangshixi.com/wechat/'

        location.href = joinWechatAuthUrl({ appid, redirectUri })
      },
      goRedirect () {
        const REDIRECT_TAG = 'XXS_REDIRECT_TAG'
        let redirectSearch = ''
        try {
          redirectSearch = localStorage.getItem(REDIRECT_TAG)
          localStorage.setItem(REDIRECT_TAG, null)
        } catch (err) {
          console.log(err)
        }

        if (redirectSearch) {
          if (redirectSearch.toLowerCase().indexOf('type=notification') !== -1) {
            this.$router.push({
              name: 'PageMessage'
            })
          }
          if (redirectSearch.toLowerCase().indexOf('type=company') !== -1) {
            this.$router.push({
              name: 'PageCompany'
            })
          }
          if (redirectSearch.toLowerCase().indexOf('type=account') !== -1) {
            this.$router.push({
              name: 'PageAccount'
            })
          }
        }
      },
      checkLogin (successCbfn = x => x, failCbfn = f => f) {
        let url = ReqUrl.StudentSubUrl.getItem(0)
        Req.Get(url, null,
          res => {
            console.log(res)
            console.log('登录成功')
            successCbfn()
          },
          fail => {
            console.log(fail)
            console.log('未登录')
            failCbfn()
          },
        )
      },
      bindOpenid (openid) {
        Req.Put(
          ReqUrl.OtherSubUrl.putOpenIdToAccount(0, openid),
          res => {
            console.log('绑定OpenId成功')
          }
        )
      },
    },
    mounted () {
      let wechatAuthCode = $params['code']

      if (wechatAuthCode) {
        Req.Get(
          ReqUrl.Wechat.GetToken(),
          {code: wechatAuthCode, mobile: true},
          res => {
            console.log(res)
            // Jonham
            // let unionId = 'ofsYi05xg_kkWk0oC6lGQALHmp34'
            let unionId = ''
            // Pang
            // let unionId = 'ofsYi05PWWYRdzfiSWopHA0WnBCs'
            let openid = res.openid
            if (openid) {
              Storage.Set(Storage.OPENID_STORAGE_TAG, openid)
            }

            // 使用正式的数据登录
            if (res.unionid) {
              unionId = res.unionid
            }
            if (unionId) {
              Req.Post(
                ReqUrl.StudentSubUrl.wechatLogin(unionId),
                null,
                res => {
                  console.log(res)
                  // 账号信息中未绑定openid， 绑定openid
                  if (!res.account.openId) {
                    this.bindOpenid(openid)
                  }
                  // else {
                  //   // this.$nextTick(x => {

                  //   // })
                  // }
                  // 登录成功后，重定向到跳入页面
                  this.goRedirect()
                },
                fail => {
                  // unionId无法登录，未绑定到账号上
                  if (fail.response) {
                    MessageBox({
                      title: '提示',
                      message: '您当前账号尚未绑定，是否进行绑定？',
                      confirmButtonText: '登录并绑定',
                      cancelButtonText: '无账号，去注册',
                      showCancelButton: true
                    }).then(action => {
                      if (action === 'confirm') {
                        this.$router.push({
                          name: 'PageBindingPhone',
                          params: {
                            unionid: unionId
                          }
                        })
                      }

                      if (action === 'cancel') {
                        console.log('取消')
                        this.$router.push({
                          name: 'PageVerifyPhone',
                          params: {
                            unionid: unionId,
                            // phone: '1',
                          }
                        })
                      }
                    })
                  }
                }
              )
            } else {
              // test
              // 验证是否已经登录
              this.checkLogin(
                () => {
                  console.log('已登录')
                  Req.Get(ReqUrl.StudentSubUrl.getItem(), '',
                    res => {
                      Account.changeAndAnnounce(res)
                      this.goRedirect()
                    }
                  )
                },
                fail => {
                  console.log('未登录，提示框出现')
                }
              )
            }
          },
          fail => {
            console.log(fail)
            console.log('Wechat Auth Code Expired')
          }
        )
      } else {
        // 验证是否已经登录
        this.checkLogin(
          () => {
            console.log('已登录')
            Req.Get(ReqUrl.StudentSubUrl.getItem(), '',
              res => {
                Account.changeAndAnnounce(res)
                this.goRedirect()
              }
            )
          },
          fail => {
            console.log('未登录，提示框出现')

            this.goAuth()
          }
        )
      }
    }
  }
</script>

<style lang="less">
  @import "./less/reset.less";
  @import "./less/mobile.less";

  body {
    background-color: @theme-color-bg;
  }
  #app {
    font-family: 'PingFangSC-Regular', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    min-height: 100%;
    background-color: @theme-color-bg;
  }
</style>
