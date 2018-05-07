<template lang="html">
  <div class="company-info-box">
    <div class="row align-left">
      <div class="logo col" :style="imgBg(company.logo || Img.imgLogo)"></div>
      <div class="text col">
        <div class="company-name">{{company.name}}</div>
        <div class="auth">
          <span class="icon-auth" :style="imgBg(Img.icon1)"></span>已认证
        </div>
        <div class="link">
          <a :href="company.link">{{company.link}}</a>
        </div>
      </div>
    </div>
    <div class="flex-row row company-msg align-left">
      <span class="sep">{{company.industry}}</span>
      <span class="sep" v-if="company.scale">{{company.scale}}</span>
      <span class="sep">{{company.type}}</span>
    </div>
  </div>
</template>

<script>
  import Img from '@/assets/pc-stu/index.js'
  import { styleFns } from '@/mixins/helperFuncs.js'

  export default {
    name: 'CompanyInfoBox',
    mixins: [styleFns],
    data () {
      return {
        Img
      }
    },
    props: {
      company: {
        type: [Object, undefined],
        default () {
          return {}
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .logo {
    display: inline-block;
    width: 90px;
    height: 90px;
    border-radius: 6px;
    margin-right: 30px;
    vertical-align: top;

    .icon();
  }
  .text {
    text-align: left;
  }
  .company-name {
    font-family: PingFangSC-Regular;
    font-size: 24px;
    color: #454F66;
    letter-spacing: 0;
    line-height: 24px;
    margin-bottom: 17px;
  }
  .auth {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #0DABF4;
    letter-spacing: 0;
    line-height: 16px;
    margin-bottom: 17px;

    .icon-auth {
      display: inline-block;
      width: 16px;
      height: 19.8px;
      vertical-align: middle;
      margin-right: 10px;

      .icon();
    }
  }
  .link {
    a {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #454F66;
      letter-spacing: 0;
      line-height: 16px;
    }
  }

  .company-info-box {
    margin-bottom: 66px;

    .company-msg {
      margin-top: 30px;

      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #454F66;
      letter-spacing: 0;
      line-height: 16px;

      span {
        padding: 0 8px;
        border-right: 1px solid currentColor;
        height: 1em;
        display: inline-block;

        &:first-of-type {
          padding-left: 0px;
        }
        &:last-of-type {
          border-right: 0px;
          padding-right: 0px;
        }
      }
    }
  }
</style>
