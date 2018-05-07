<template lang="html">
  <div class="mine-setting align-left xsx-form-theme">
    <div class="page-result-title">
      账户设置
    </div>

    <div class="content">
      <div class="form align-left">
        <div class="row input-block">
          <span class="input-label-inline col">账号</span>
          <span class="txt">{{dataCopy.account && dataCopy.account.phone}}</span>
        </div>
        <!-- <div class="row input-block">
          <span class="input-label-inline col">原密码</span>
          <input type="text" placeholder="请输入" v-model="formerPassword">
        </div> -->
        <div class="row input-block">
          <span class="input-label-inline col">新密码</span>
          <input type="text"
            @keyup="inputing"
            placeholder="请输入"
            v-model="newPassword" />
        </div>
        <div class="row input-block">
          <span class="input-label-inline col">确认密码</span>
            <input type="text"
            @keyup="inputing"
            placeholder="请输入"
            @keyup.enter="submit"
            v-model="confirmPassword" />
        </div>
        <div class="row input-block" v-show="alertText">
          <span class="input-label-inline col"> </span>
          <div class="col alert-text">{{ alertText }}</div>
        </div>
        <div class="row input-block" v-show="statusText">
          <span class="input-label-inline col"> </span>
          <div class="col status-text">{{ statusText }}</div>
        </div>
        <div class="row input-block">
          <span class="input-label-inline col"> </span>
          <div class="col btn" @click="submit">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Account} from '@/api/account.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'Setting',
    data () {
      return {
        dataCopy: {},
        formerPassword: '',
        newPassword: '',
        confirmPassword: '',

        alertText: '',
        statusText: '',
      }
    },
    mounted () {
      Account.anounceList.push(item => {
        this.dataCopy = item || {}
      })
      this.dataCopy = Account.accountInfo || {}

      if (!Account.accountInfo || !Account.accountInfo.accountId) {
        Req.Get(ReqUrl.Company.getItem(0), '',
          res => {
            Account.changeAndAnnounce(res)
            this.dataCopy = res
          }, fail => {
            if (fail.response.data.status === 401) {
              this.$router.push({
                name: 'Login'
              })
            }
          }
        )
      }
    },
    methods: {
      inputing () {
        this.statusText = ''
        this.alertText = ''
      },
      submit () {
        let newPassword = this.newPassword
        let confirmPassword = this.confirmPassword

        if (!newPassword) {
          this.alertText = '请输入完整再提交'
          return
        }
        if (newPassword.length < 8) {
          this.alertText = '密码长度不少于8位'
          return
        }
        if (newPassword !== confirmPassword) {
          this.alertText = '密码不一致，请重新输入'
          return
        }

        // 正在提交
        if (this.statusText) return

        this.statusText = '正在提交数据'

        Req.Put(ReqUrl.Account.put(),
          {
            phone: null,
            password: newPassword
          },
          res => {
            this.statusText = '修改成功'
          }, fail => {
            if (fail.response.data.status === 401) {
              this.$router.push({
                name: 'Login'
              })
            }
          }
        )
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .page-result-title {
    display: block;
    position: relative;

    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #454F66;
    letter-spacing: 0;
    padding-bottom: 20px;
    margin-bottom: 18px;

    &:after {
      content: ' ';
      display: inline-block;
      height: 2px;
      width: 22.5px;
      background-color: #0DABF4;

      position: absolute;
      left: 0;
      bottom: 0;
    }
  }

  .mine-setting {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #819292;
    letter-spacing: 0;
    line-height: 14px;
    padding-top: 41px;

    .form {
      background: #FBFBFB;
      padding: 40px 30px;
      margin-bottom: 20px;
    }

    .input-block {
      .input-label-inline {
        width: 4em;
        margin-right: 20px;
        text-align: right;
      }
      .btn,
      input {
        width: 368px;
      }
    }
    .alert-text {
      color: red;
    }
  }
</style>
