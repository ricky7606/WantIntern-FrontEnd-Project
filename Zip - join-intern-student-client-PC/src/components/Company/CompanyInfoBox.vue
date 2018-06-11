<template lang="html">
  <div class="company-info-box">
    <div class="row align-left">
      <div class="logo col" :style="imgBg(isUrlLeagal(company.logo) ? company.logo : Img.imgLogo)"></div>
      <div class="text col">
        <div class="company-name">
          <a :href="'/#/CompanyInfo/' + company.id">
            {{company.name}}
          </a>
        </div>
        <div class="auth" v-if="company.verified">
          <span class="icon-auth" :style="imgBg(Img.icon1)"></span>已认证
        </div>
        <div class="no-auth" v-if="!company.verified">
          未认证
          <span class="gray">（该账号未经认证，可能存在风险）</span>
        </div>
        <div class="link"><!-- 公司官网显示 -->
          <a target="_blank" :href="parseLink(company.link)">{{company.link}}</a>
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
    methods: {
      isUrlLeagal (str) {
        return str && str.indexOf('http') === 0
      },
      parseLink (link) {
        // if (!link) return ''
        if (link === '(未填写)' || !link) return ''
        return link.indexOf('http') !== -1 ? link : `http://${link}`
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
    width: 90px;
    height: 90px;
    border-radius: 6px;
    margin-right: 30px;
    vertical-align: top;

    .icon();
  }
  .text {
    text-align: left;
    width: 280px;
    overflow: hidden;
  }
  .company-name a {
    font-family: PingFangSC-Regular;
    font-size: 24px;
    color: #454F66;
    letter-spacing: 0;
    line-height: 24px;
    margin-bottom: 17px;
  }
  .no-auth {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #ff8000;
    letter-spacing: 0;
    line-height: 16px;
    margin-bottom: 17px;
    white-space: nowrap;

    .gray {
      color: #a3a8b5;
      font-size: 12px;
    }
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
      display: inline-block;
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
