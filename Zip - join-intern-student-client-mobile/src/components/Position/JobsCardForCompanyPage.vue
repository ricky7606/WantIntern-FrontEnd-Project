<template>
  <div class="jobs-card flex-row pointer-on" @click.stop="selectCard">
    <div class="left flex-col">
      <div class="flex-row">
        <div class="job-title">{{job.title}}</div>
        <div class="job-salary">{{job.stuSalary}}{{job.unit}}</div>
      </div>
      <div class="flex-row reqs">
        <span class="sep degree">{{mapReqEdu[job.reqEdu]}}</span>
        <span class="sep major">{{job.reqMajor}}</span>
      </div>
      <div class="flex-row pub-time">
        发布于<span class="time">{{job.createTime}}</span>
      </div>
    </div>

    <div class="right flex-col">
      <!-- <div class="flex-row company-title" @click.stop="selectCompany">
        <span>
          {{company.name}}
        </span>
      </div>
      <div class="flex-row company-msg">
        <span class="sep">{{company.industry}}</span>
        <span class="sep" v-if="company.scale">{{company.scale}}</span>
        <span class="sep">{{company.type}}</span>
      </div> -->
      <div class="flex-row hr-msg">
        <span class="sep">{{company.contact}}</span>
        <span class="sep">{{company.contactPos}}</span>
        <div class="col auth" :style="imgBg(Img.icon1)" v-if="company.verified"></div>
        <div class="icon" :style="imgBg(company.avatar || Img.imgPlaceholder)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  // import protoJson from './data.json'
  import {mapReqEdu} from './Enum.js'
  import { styleFns } from '@/mixins/helperFuncs.js'
  import Img from '@/assets/pc-stu/index.js'

  export default {
    name: 'JobsCardForCompanyPage',
    mixins: [styleFns],
    data () {
      return {
        Img,
        mapReqEdu,
      }
    },
    methods: {
      selectCard () {
        this.$emit('select', this.port)
      },
      selectCompany () {
        this.$emit('select-company', this.port)
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
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .jobs-card {
    display: flex;
    background-color: white;
    padding: 30px;
    height: 178px;
    flex-direction: row;
    margin-bottom: 1px;
    user-select: none;

    .left {
      flex-grow: 1;
    }
    .job-title {
      font-family: PingFangSC-Regular;
      font-size: 22px;
      color: #454F66;
      letter-spacing: 0;
      line-height: 22px;
      margin-bottom: 20px;
    }
    .job-salary {
      font-family: PingFangSC-Regular;
      font-size: 22px;
      color: #0DABF4;
      letter-spacing: 0;
      line-height: 22px;
      margin-left: 26px;
    }

    // .sep {
    //   padding: 0 8px;
    //   border-right: 1px solid #454F66;
    //   height: 1em;
    //   display: inline-block;
    //
    //   &.light {
    //     border-color: #BFBFBF;
    //   }
    //   &:first-of-type {
    //     padding-left: 0px;
    //   }
    //   &:last-of-type {
    //     border-right: 0px;
    //     padding-right: 0px;
    //   }
    // }
    .flex-row.reqs {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #454F66;
      letter-spacing: 0;
      line-height: 16px;
      margin-bottom: 32px;

      span {
        padding: 0 8px;
        border-right: 1px solid #454F66;
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
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #BFBFBF;
      letter-spacing: 0;
      line-height: 16px;
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .flex-row {
        display: block;
        margin-bottom: 20px;
      }

      .auth {
        display: inline-block;
        width: 12px;
        height: 14.7px;
        vertical-align: middle;

        .icon();
      }
      .company-title {
        span {
          font-family: PingFangSC-Regular;
          font-size: 22px;
          color: #454F66;
          letter-spacing: 0;
          line-height: 22px;
        }
      }
      .company-msg {
        span {
          padding: 0 8px;
          border-right: 1px solid #454F66;
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

        div.icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          border-radius: 50%;
          margin-left: 16px;
          vertical-align: middle;
        }
      }
    }

  }
</style>
