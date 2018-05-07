<template>
  <div class="jobs-card flex-col pointer-on" @click.stop="selectCard">
    <div class="flex-col">
      <div class="flex-row flex-between margin-bottom-10">
        <div class="job-title">{{job.title}}</div>
        <div class="job-salary">{{job.stuSalary}}{{job.unit}}</div>
      </div>
      <div class="flex-row reqs flex-between margin-bottom-15">
        <div class="flex-row">
          <span class="sep degree">{{mapReqEdu[job.reqEdu]}}</span>
          <span class="sep major" v-if="job.reqMajor">{{job.reqMajor}}</span>
        </div>
        <div class="flex-col pub-time">
          <span class="time">{{ parseDateString(job.createTime) }}</span>
        </div>
      </div>
    </div>

    <div class="flex-row flex-between" @click.stop="selectCompany">
      <div class="flex-row">
        <div class="flex-col">
          <div class="icon" :style="(company.logo || Img.imgPlaceholder) | imgbg"></div>
        </div>
        <div class="flex-col">
          <div class="flex-row company-title">
            {{company.name}}
          </div>
          <div class="flex-row company-msg">
            <span class="sep">{{company.industry}}</span>
            <span class="sep" v-if="company.scale">{{company.scale}}</span>
            <span class="sep">{{company.type}}</span>
          </div>
        </div>
      </div>
      <div class="flex-col right icon-arrow-container" v-show="showArrow">
        <span class="icon-arrow" :style="PositionDetail.arrow | imgbg"></span>
      </div>
    </div>
  </div>
</template>

<script>
  // import protoJson from './data.json'
  import {mapReqEdu} from './Enum.js'
  import { styleFns } from '@/mixins/helperFuncs.js'
  import Img from '@/assets/pc-stu/index.js'
  import { PositionDetail } from '@/assets/wechat-stu/index.js'

  export default {
    name: 'JobsCard',
    mixins: [styleFns],
    data () {
      return {
        Img,
        PositionDetail,
        mapReqEdu,
      }
    },
    methods: {
      selectCard () {
        this.$emit('select', this.port)
      },
      selectCompany () {
        this.$emit('select-company', this.company.id)
      },
      parseDateString (str) {
        if (!str) return ''
        return str.substr(5, 5)
      },
    },
    computed: {
      job () {
        return this.port
      },
      company () {
        return this.port.company || {}
      },
    },
    props: {
      port: {
        type: [Object, undefined],
        default () {
          return {
            company: {}
          }
        }
      },
      showArrow: {
        type: [Number, Boolean],
        default () {
          return false
        },
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/mobile.less";

  .jobs-card {
    display: flex;
    background-color: white;
    flex-direction: column;
    user-select: none;

    .job-title {
      font-family: PingFangSC-Regular;
      font-size: 34px/2;
      color: #333333;
      line-height: 40px/2;
      text-align: left;
    }
    .job-salary {
      font-family: AvenirNext-Regular;
      font-size: 34px/2;
      color: #333333;
      line-height: 34px/2;
      white-space: nowrap;
    }

    .flex-row.reqs {
      font-family: PingFangSC-Regular;
      font-size: 28px/2;
      color: #9B9B9B;
      line-height: 28px/2;

      span {
        padding: 0 8px;
        border-right: 1px solid #9B9B9B;
        height: 1em;
        display: inline-block;

        &.light {
          border-color: #BFBFBF;
        }
        &:first-of-type {
          padding-left: 0px;
        }
        &:last-of-type {
          border-right: 0px;
          padding-right: 0px;
        }
      }
    }
    .pub-time {
      font-family: AvenirNext-Regular;
      font-size: 28px/2;
      color: #9B9B9B;
      line-height: 28px/2;
    }

    .company-title {
      font-family: PingFangSC-Regular;
      font-size: 28px/2;
      color: #333333;
      line-height: 28px/2;

      margin-bottom: 9px;
    }
    .company-msg {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #9B9B9B;
      line-height: 26px/2;

      span {
        padding: 0 8px;
        border-right: 1px solid #9B9B9B;
        height: 1em;
        line-height: 16px;
        display: inline-block;

        &.light {
          border-color: #BFBFBF;
        }
        &:first-of-type {
          padding-left: 0px;
        }
        &:last-of-type {
          border-right: 0px;
          padding-right: 0px;
        }
      }
    }

    .hr-msg {
      display: block;
      height: 40px;
      line-height: 40px;
      // display: flex;
      // align-items: center;
      // justify-content: center;

      span {
        padding: 0 8px;
        border-right: 1px solid #454F66;
        line-height: 16px;
        height: 1em;
        display: inline-block;

        &.light {
          border-color: #BFBFBF;
        }
        &:first-of-type {
          padding-left: 0px;
        }
        &:last-of-type {
          border-right: 0px;
          padding-right: 0px;
        }
      }

    }
    div.icon {
      display: inline-block;

      .sqr(36px);
      border-radius: 3px;

      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;

      vertical-align: middle;
      margin-right: 10.5px;
    }
    .icon-arrow-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-arrow {
      display: inline-block;
      .sqr(10.5px);
      // height: 10.5px;
      // width: 5px;

      .icon();
    }
  }
</style>
