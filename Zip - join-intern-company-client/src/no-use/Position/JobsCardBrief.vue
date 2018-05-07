<template>
  <div class="jobs-card-brief flex-row pointer-on" @click.stop="selectCard">
    <div class="left flex-col col">
      <div class="flex-row row">
        <div class="job-title col">{{job.title}}</div>
        <div class="job-salary col">{{job.salary}}{{job.unit}}</div>
      </div>
      <div class="flex-row pub-time">
        <span>
          {{company.name}}
        </span>
        <span class="time">{{job.createTime}}</span>
      </div>
    </div>

    <div class="right flex-col col">
      <div class="company-logo" :style="imgBg(company.logo || Img.imgLogo)"></div>
    </div>
  </div>
</template>

<script>
  import {mapReqEdu} from './Enum.js'
  import { styleFns } from '@/mixins/helperFuncs.js'
  import Img from '@/assets/pc-stu/index.js'

  export default {
    name: 'JobsCardBrief',
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

  .jobs-card-brief {
    display: flex;
    padding: 30px 0;
    flex-direction: row;
    margin-bottom: 1px;
    user-select: none;

    .left {
      flex-grow: 1;
      overflow: hidden;
    }
    .right {
      flex-shrink: 0;
    }
    .job-title {
      font-family: PingFangSC-Regular;
      font-size: 20px;
      color: #454F66;
      letter-spacing: 0;
      line-height: 20px;

      margin-right: 20px;
    }
    .job-salary {
      font-family: PingFangSC-Regular;
      font-size: 20px;
      color: #0DABF4;
      letter-spacing: 0;
      line-height: 20px;
    }

    .pub-time {
      margin-top: 26px;

      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #A3A8B5;
      letter-spacing: 0;
      line-height: 14px;

      .time {
        margin-left: 14px;
      }
    }
    .right {
      .company-logo {
        display: inline-block;
        width: 60px;
        height: 60px;

        .icon();
      }
    }
  }
</style>
