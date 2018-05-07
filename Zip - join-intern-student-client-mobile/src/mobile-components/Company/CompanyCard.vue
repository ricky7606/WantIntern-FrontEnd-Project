<template>
  <div class="company-card flex-row" @click.stop="selectCard">
    <div class="flex-col icon-logo-container">
      <div class="icon-logo col" :style="imgBg(isUrlLeagal(company.logo) ? company.logo : Img.imgLogo)"></div>
    </div>

    <div class="flex-col col right">
      <div class="flex-row row flex-between margin-bottom-11 company-title-box"
        :style="{paddingRight: company.verified ? '56px' : '0'}">
        <span class="company-title">
          {{ company.name }}
        </span>

        <span class="auth highlight" v-show="company.verified">
          已认证
          <span class="icon-auth" :style="CompanyDetail.auth | imgbg"></span>
        </span>
      </div>

      <div class="flex-row row company-msg gray margin-bottom-8">
        <span class="sep">{{company.industry}}</span>
        <span class="sep" v-if="company.scale">{{company.scale}}</span>
        <span class="sep">{{company.type}}</span>
      </div>

      <div class="flex-row gray flex-between">
        <div class="row hiring-count">
          在招职位
          <span class="value highlight">
            {{company.activePosCnt || 0}}
          </span>
        </div>
        <div class="row rank-count">
          评价
          <span class="value highlight">
            {{company.rateCnt || 0}}
          </span>
        </div>
        <div class="row rank-count" v-show="!brief">
          综合评分
          <span class="value highlight">
            {{company.rateCnt || 0}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapReqEdu } from '@/components/Position/Enum.js'
  import { styleFns } from '@/mixins/helperFuncs.js'
  import Img from '@/assets/pc-stu/index.js'
  import { CompanyDetail } from '@/assets/wechat-stu/index.js'

  export default {
    name: 'CompanyCard',
    mixins: [styleFns],
    data () {
      return {
        Img,
        mapReqEdu,
        CompanyDetail,
      }
    },
    methods: {
      selectCard () {
        this.$emit('select', this.company)
      },
      selectCompany () {
        this.$emit('select', this.company)
      },
      isUrlLeagal (str) {
        return str && str.indexOf('http') === 0
      },
    },
    props: {
      company: {
        type: [Object, undefined],
        default () {
          return {
            company: {}
          }
        }
      },
      brief: {
        type: [Boolean, String],
        default () {
          return false
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/mobile.less";

  .company-card {
    width: 100%;
    overflow: hidden;
    display: flex;
    background-color: white;
    overflow: hidden;

    padding-left: 70px;
    position: relative;

    .icon-logo-container {
      position: absolute;
      left: 0px;
      top: 0px;

      .sqr(70px);
    }
    .right {
      width: 100%;
      overflow: hidden;
    }
    .icon-logo {
      display: inline-block;

      .sqr(60px);
      .icon();
      background-size: contain;
      margin-right: 10px;

      border: 1px solid #eee;
    }
    .company-title {
      font-family: PingFangSC-Regular;
      font-size: 34px/2;
      color: #333333;
      display: inline-block;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .auth {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #0DABF4;
      line-height: 26px/2;

      white-space: nowrap;
      position: absolute;
      right: 0;
      top: 0;
    }
    .company-title-box {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-align: left;

      position: relative;
    }
    .company-title-box.wrap-line {
      white-space: normal;
      overflow: auto;

      .company-title {
        white-space: normal;
        overflow: auto;
        text-overflow: ellipsis;
      }
    }

    .gray {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #9B9B9B;
      line-height: 26px/2;
    }
    .highlight {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #0DABF4;
      line-height: 26px/2;
    }

    .margin-bottom-11 {
      margin-bottom: 11px;
    }
    .margin-bottom-8 {
      margin-bottom: 8px;
    }
    .flex-1 {
      flex-grow: 1;
    }

    .sep {
      display: inline-block;
      padding: 0 5px;
      border-right: 1px solid currentColor;

      &:first-of-type {
        padding-left: 0px;
      }
      &:last-of-type {
        padding-right: 0px;
        border-right: 0px;
      }
    }

    .icon-auth {
      display: inline-block;

      .sqr(12px);
      .icon();
    }
  }
</style>
