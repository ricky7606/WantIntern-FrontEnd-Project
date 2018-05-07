<template lang="html">
  <div class="login-page children-2-col xsx-form-theme">
    <div class="left">

      <div class="input-label">账号</div>
      <div class="input-block">
        <input class="w272" type="text" v-model="account" placeholder="请输入">
      </div>

      <div class="input-label">密码</div>
      <div class="input-block">
        <input class="col w272" type="password" v-model="password" @keyup.enter="submit" placeholder="请输入" />
      </div>

      <div class="btn w272" @click="submit">登录</div>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { Account } from '@/api/account.js'

  export default {
    name: 'LoginPage',
    data () {
      return {
        account: '',
        password: '',
        isProcessing: false,
      }
    },
    methods: {
      submit () {
        const that = this
        let account = this.account
        let password = this.password

        if (account && password) {
          this.isProcessing = true

          Req.Post(ReqUrl.Admin.postLogin(),
            {
              phone: account,
              password,
            },
            res => {
              Account.phone = account
              Account.changeAndAnnounce(res)
              this.isProcessing = false

              this.$router.push({
                path: '/admin'
              })
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
        this.$router.push({
          name: 'ForgetPassword'
        })
      },
      gotoStu () {
        location.href = '../stu'
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .login-page {
    display: block;
    // width: 645px;
    // height: 367px;
    padding-bottom: 70px;
    margin: 0 auto;
    background-color: white;
    box-shadow: 0px 3px 12px #aaa;

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
