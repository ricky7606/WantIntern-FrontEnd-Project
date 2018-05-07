<template lang="html">
  <div class="company-info-box">
    <div class="row align-left">
      <div class="logo col" :style="imgBg(isUrlLeagal(company.logo) ? company.logo : Img.imgLogo)"></div>
      <div class="text col">
        <div class="flex-row row flex-middle">
          <div class="company-name col">{{company.name}}</div>
          <div class="auth col" v-if="company.verified">
            <span class="icon-auth" :style="imgBg(Img.icon1)"></span>已认证
          </div>
        </div>

        <div class="flex-row row company-msg align-left">
          <span class="sep">{{company.industry}}</span>
          <span class="sep" v-if="company.scale">{{company.scale}}</span>
          <span class="sep">{{company.type}}</span>
        </div>

        <div class="link">
          <a target="_blank" :href="parseLink(company.link)">{{company.link}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Img from '@/assets/pc-stu/index.js'
  import { styleFns } from '@/mixins/helperFuncs.js'

  export default {
    name: 'CompanyInfoBoxBigger',
    mixins: [styleFns],
    data () {
      return {
        Img
      }
    },
    methods: {
      isUrlLeagal (str) {
        return str && str.indexOf('http') === 0
      },
      parseLink (link) {
        if (!link) return ''
        return link.indexOf('http') === 'http' ? link : `http://${link}`
      },
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
    width: 110px;
    height: 110px;
    border-radius: 6px;
    margin-right: 36px;
    vertical-align: top;

    .icon();
  }
  .text {
    text-align: left;
  }
  .company-name {
    font-family: PingFangSC-Regular;
    font-size: 24px;
    color: white;
    letter-spacing: 0;
    line-height: 24px;
    margin-bottom: 22px;
    margin-right: 10px;

    max-width: 500px;
    white-space: nowrap;
  }
  .auth {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #0DABF4;
    letter-spacing: 0;
    margin-bottom: 22px;
    display: flex;
    flex-direction: row;
    align-items: center;

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
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 16px;
    }
  }

  .company-info-box {

    .company-msg {
      margin-bottom: 21px;

      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #FFFFFF;
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
