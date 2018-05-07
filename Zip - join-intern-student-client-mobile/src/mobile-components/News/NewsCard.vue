<template>
  <div class="news-card flex-row pointer-on" @click.stop="selectCard">
    <div class="left flex-col">
      <div class="flex-row">
        <div class="job-title">{{port.title}}</div>
      </div>
      <div class="content" v-text="getHtml(port.content)"></div>
      <div class="footer flex-row flex-between">
        <div class="flex-row pub-time">
          <span class="time">{{ trimDateString(port.createTime) }}</span>
        </div>

        <div class="flex-row news-msg" :class="{starred: starred}">
          <span class="flex-row view">
            <span class="view-icon" :style="imgBg(false ? Img.icon62 : Img.icon61)"></span>
            {{port.view}}
          </span>
          <span class="flex-row star">
            <span class="star-icon" :style="imgBg(starred ? Img.icon72 : Img.icon71)"></span>
            {{port.star}}
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
      trimDateString (str) {
        if (!str) return ''
        return str.substr(0, 10).replace(/-/g, '.')
      },
      getHtml (str) {
        let d = document.createElement('div')
        d.innerHTML = str
        return d.innerText
      }
    },
    computed: {
      starred () {
        return !!this.port.starred
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
    flex-direction: row;
    margin-bottom: 1px;
    user-select: none;
    width: 100%;

    .left {
      flex-grow: 1;
      width: 100%;
    }
    .job-title {
      font-family: PingFangSC-Medium;
      font-size: 34px/2;
      color: #333333;
      line-height: 50px/2;
      text-align: left;

      margin-bottom: 15px;
    }

    .content {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #9B9B9B;
      line-height: 36px/2;

      height: 36px;
      overflow: hidden;
      margin-bottom: 15px;
      text-align: left;

      width: 100%;
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
      font-size: 26px/2;
      color: #9B9B9B;
      line-height: 26px/2;

      span {
        margin-right: 1.4em;
      }
    }

    .news-msg {
      font-family: AvenirNext-Regular;
      font-size: 14px;
      color: #9B9B9B;
      line-height: 14px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.starred {
        .star {
          color: #0DABF4;
        }
      }

      .view-icon,
      .star-icon {
        margin-left: 20px;
        margin-right: 6px;
        width: 21px;
        height: 14px;
        display: inline-block;

        .icon();
      }
    }
  }
</style>
