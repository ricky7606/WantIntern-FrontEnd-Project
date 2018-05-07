<template lang="html">
  <div class="mine-setting">
    <div class="page-result-title">
      账户设置
    </div>

    <div class="content">
      <div class="row setting-item" v-show="dataCopy.phone">
        已绑定手机号码
        <span class="phone-number">
          {{dataCopy.phone}}
        </span>

        <span class="btn pointer-on change">更改手机号</span>
      </div>
      <div class="row setting-item" v-if="dataCopy.account">
        微信账号
        <span class="wechat-account">
          {{dataCopy.account.wechat ? '已绑定' : '未绑定'}}
        </span>

        <span class="btn pointer-on change" @click="bindingWechat">
          {{dataCopy.account.wechat ? '更改微信号' : '绑定微信号'}}
        </span>

        <span class="btn-cancel btn" v-if="isWechatWindowShow" @click="hideWechatBindingWindow">取消绑定</span>

        <div class="wechat-scanning-window" v-if="isWechatWindowShow">
          <div id="login_container"></div>
        </div>
      </div>
      <!-- <div class="row">
        <span class="btn pointer-on change">
          修改密码
        </span>
      </div> -->
    </div>
  </div>
</template>

<script>
  import {Account} from '@/api/account.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import * as Storage from '@/utils/storage.js'
  const WechatAuthKey = 'Wechat_Auth_Key'

  export default {
    name: 'Setting',
    data () {
      return {
        dataCopy: {},
        isWechatWindowShow: false,
      }
    },
    mounted () {
      Account.anounceList.push(item => {
        this.dataCopy = item || {}
      })
      this.dataCopy = Account.accountInfo || {}

      if (!Account.accountInfo || !Account.accountInfo.accountId) {
        Req.Get(ReqUrl.StudentSubUrl.getItem(), '',
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
      bindingWechat () {
        // show wechat binding page
        this.showWechatBindingWindow()
        Storage.Set({
          type: 'Binding',
          expireTime: new Date().getTime()
        }, WechatAuthKey)
      },
      hideWechatBindingWindow () {
        this.isWechatWindowShow = false
      },
      showWechatBindingWindow () {
        this.isWechatWindowShow = true
        this.$nextTick(x => {
          let hostUrl = 'http://www.xiangshixi.com/auth.html'
          // let redirectUri = ``
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

    .row {
      background: #FBFBFB;
      padding: 17px 20px;
      margin-bottom: 20px;
    }
    .btn {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #0DABF4;
      letter-spacing: 0;
      line-height: 14px;
    }
  }

</style>
