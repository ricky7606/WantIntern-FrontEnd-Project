<template>
  <div class="news-card flex-row pointer-on" @click.stop="selectCard">
    <div class="left flex-col">
      <div class="flex-row">
        <div class="job-title">{{job.title}}</div>
      </div>
      <!-- <div class="flex-row reqs">
        <span class="sep degree">{{mapReqEdu[job.reqEdu]}}</span>
        <span class="sep major">{{job.reqMajor}}</span>
      </div> -->
      <div class="content" v-html="job.content">
      </div>
      <div class="footer flex-row">
        <div class="flex-row pub-time">
          <span class="author">作者：{{job.author}}</span>
          <span class="time">{{job.createTime}}</span>
        </div>

        <div class="flex-row news-msg" :class="{starred: starred}">
          <span class="view">
            <span class="view-icon" :style="imgBg(false ? Img.icon62 : Img.icon61)"></span>
            {{job.view}}
          </span>
          <span class="star">
            <span class="star-icon" :style="imgBg(starred ? Img.icon72 : Img.icon71)"></span>
            {{job.star}}
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

  export default {
    name: 'NewsCard',
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
      starred () {
        // return true
        return !!this.job.starred
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

  .news-card {
    display: flex;
    background-color: white;
    padding: 30px;
    height: 200px;
    flex-direction: row;
    margin-bottom: 1px;
    user-select: none;

    .left {
      flex-grow: 1;
    }
    .job-title {
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: #454F66;
      letter-spacing: 0;
      line-height: 22px;
      margin-bottom: 20px;
    }

    .content {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #454F66;
      letter-spacing: 0;
      line-height: 26px;
      margin-bottom: 30px;

      width: 100%;
      height: 52px;
      overflow: hidden;
    }
    .footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;

    }
    .pub-time {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #BFBFBF;
      letter-spacing: 0;
      line-height: 16px;

      span {
        margin-right: 1.4em;
      }
    }

    .news-msg {
      font-family: AvenirNext-Regular;
      font-size: 14px;
      color: #9B9B9B;
      line-height: 14px;

      &.starred {
        .star {
          color: #0DABF4;
        }
      }

      .view-icon,
      .star-icon {
        margin-left: 20px;
        margin-right: 10px;
        width: 21px;
        height: 14px;
        display: inline-block;

        .icon();
      }
    }
  }
</style>
