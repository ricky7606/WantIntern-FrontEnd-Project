<template lang="html">
  <div class="namecard overflow-hidden">
    <div class="icon col" :style="imgBg(dataCopy.avatar || iconUrl)"></div>
    <div class="content col">
      <div class="row align-left">
        <div class="name">{{dataCopy.name}}</div>
      </div>
      <div class="row overflow-hidden align-left">
        <div class="col">积分 {{ (dataCopy.account && dataCopy.account.point) || 0 }}</div>
        <div class="col">工资 0</div>
        <div class="col btn-cache pointer-on" @click="getCache">提现</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Imgs from '@/assets/pc-stu/index.js'
  import {Account} from '@/api/account.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'NameCard',
    data () {
      return {
        dataCopy: {},
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
          }
        )
      }
    },
    methods: {
      imgBg (url) {
        return {
          backgroundImage: `url(${url})`
        }
      },
      getCache () {
        alert('功能等待微信支付开通后接通。')
        return
      },
    },
    props: {
      iconUrl: {
        type: String,
        default () {
          return Imgs.imgLogo
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .overflow-hidden {
    overflow: hidden;
  }
  .namecard {
    .icon {
      display: inline-block;
      height: 94px;
      width: 94px;
      border-radius: 50%;

      .icon();
      float: left;
      margin-right: 30px;
      vertical-align: middle;
    }
    .col {
      float: left;
    }
    .content {
      padding-top: 10px;
    }
    .row {
      display: block;

      .name {
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #454F66;
        letter-spacing: 0;
        margin-bottom: 20px;
      }
      .col {
        display: inline-block;

        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #656565;
        letter-spacing: 0;
        line-height: 16px;
        margin-right: 36px;

        &.btn-cache {
          color: #0DABF4;
        }
      }
    }
  }
</style>
