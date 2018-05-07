<template lang="html">
  <div class="login-page children-2-col xsx-form-theme">
    <div class="left">

      <div class="input-label">账号</div>
      <div class="input-block">
        <input class="w272" type="text"
          @focus="isAccountInputing = true"
          @click="isAccountInputing = true"
          @keyup="isAccountInputing = true"
          @blur="isAccountInputing = false"
          v-model="account"
          placeholder="请输入" />
      </div>

      <div class="input-label">密码</div>
      <div class="input-block">
        <input class="col w272" type="password"
          v-model="password"
          @keyup.enter="submit" placeholder="请输入" />

        <div class="row align-right">
          <span class="btn-forget pointer-on" @click="forgetPassword">
            忘记密码？
          </span>
        </div>
      </div>

      <div class="btn w272 pointer-on" @click="submit">登录</div>
    </div>
    <div class="right">
      <div class="row margin-bottom-30">
        还没有账号？<span class="login pointer-on underlined" @click="gotoRegister">立即注册</span>
      </div>
      <div class="input-block">
        <div class="btn plain orange row" @click="gotoStu">
          {{'学生登录 >'}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import {Account} from '@/api/account.js'

  export default {
    name: 'LoginPage',
    data () {
      return {
        account: '',
        password: '',
        isProcessing: false,

        isAccountInputing: false,
      }
    },
    methods: {
      submit () {
        const that = this
        let account = this.account
        let password = this.password
        if (this.isProcessing) {
          alert('正在等待服务器返回数据，请稍候再试')
          return
        }
        if (account && password) {
          this.isProcessing = true

          Req.Post(ReqUrl.Company.login(),
            {
              phone: account,
              password,
            },
            res => {
              if (res.frozen) {
                // 被禁用
                alert('您的账号当前已被禁用，详情请联系网站客服400-820-4818')

                let url = ReqUrl.OtherSubUrl.postLogout()
                Req.Post(url, undefined, res => {
                  this.$router.replace({
                    name: 'Home'
                  })
                }, fail => {
                  this.$router.replace({
                    name: 'Home'
                  })
                })
                return
              }

              Account.phone = account
              Account.accountInfo = res
              if (Account.anounceList && Account.anounceList.length > 0) {
                Account.changeAndAnnounce(res)
                // Account.anounceList.forEach(item => {
                //   item(res)
                // })
              }
              this.isProcessing = false
              if (Account.checkInfoFull()) {
                this.$router.push({
                  path: '/mine/message'
                })
              } else {
                alert('您的账号信息不完整，请填写完整，不然无法发布职位。')
                this.$router.push({
                  path: '/mine/information'
                })
              }
            },
            fail => {
              alert(fail.response.data.userMessage)
              that.password = ''
              this.isProcessing = false
            }
          )
        }
      },
      gotoRegister () {
        this.$router.push({
          name: 'Register'
        })
      },
      forgetPassword () {
        // this.$router.push({
        //   name: 'ForgetPassword'
        // })
        alert('联系网站客服400-820-4818 核实身份后修改密码')
      },
      gotoStu () {
        location.href = '/index.html'
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .login-page {
    display: block;
    width: 645px;
    // height: 367px;
    padding-bottom: 70px;
    margin: 0 auto;
    background-color: white;

    padding-top: 40px;

    .left {
      padding-left: 60px;
      padding-right: 50px;
      border-right: 1px solid #E5E6EB;

      width: 382px;

      .input-block {
        width: 100%;
        overflow: hidden;

        input, .btn {
          float: left;
        }
      }

      .w180 {
        width: 180px;
        margin-right: 8px;
      }
      .w82 {
        width: 82px;
      }
      .w272 {
        width: 270px;
      }
    }
    .right {
      width: 262px;
      padding: 0 50px;

      .btn {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #0DABF4;
        letter-spacing: 0;
      }
    }

    .margin-bottom-30 {
      margin-bottom: 30px;

      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #819292;
      letter-spacing: 0;
      line-height: 14px;

      .login {
        color: #0DABF4;
      }
      .underlined {
        text-decoration: underline;
      }
    }
    .row.align-right {
      display: block;
      text-align: right;
    }
    .btn-forget {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #0DABF4;
      letter-spacing: 0;
      line-height: 12px;
    }
  }
</style>
