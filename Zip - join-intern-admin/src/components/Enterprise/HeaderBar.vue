<template lang="html">
  <div class="header-bar">
    <div class="main-content">
      <div class="hello-msg row">
        <span v-if="enterpriseMsg.contact">
          你好，{{enterpriseMsg.contact}}。当前账号积分 {{enterpriseMsg.account.point}}
        </span>
        <span class="default-hello-msg">{{defaultHelloWords}}</span>
      </div>

      <div class="content-columns row">
        <div class="col-item pointer-on col" v-for="col in list"
          :class="{selected: col.title === selected.title}"
          @click="selectItem(col)">
          <div class="value row align-center">{{col.value}}</div>
          <div class="title row align-center">{{col.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Account } from '@/api/account.js'

  export default {
    name: 'HeaderBar',
    mounted () {
      this.enterpriseMsg = Account.accountInfo

      Account.anounceList.push(item => {
        this.enterpriseMsg = item
      })
    },
    data () {
      return {
        defaultHelloWords: '美好的一天又开始了，愿享实习与你一起成长。',
        enterpriseMsg: {},
      }
    },
    methods: {
      selectItem (item) {
        this.$emit('change', item)
      },
    },
    props: {
      list: {
        type: Array,
        default () {
          return []
        },
      },
      selected: {
        type: Object,
        default () {
          return {}
        },
      },
      username: {
        type: String,
        default () {
          return ''
        }
      },
      points: {
        type: [String, Number],
        default () {
          return ''
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .main-content {
    width: @MIN-WIDTH;
    min-width: @MIN-WIDTH;
    margin: 0 auto;
  }
  .header-bar {
    display: block;
    background-color: white;
    margin-bottom: 20px;
    padding-top: 20px;
    padding-bottom: 30px;
    width: 100%;
    text-align: left;

    .hello-msg {
      margin-bottom: 60px;
      padding-left: 10px;

      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #819292;
      letter-spacing: 0;
      line-height: 14px;
    }
    .default-hello-msg {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #A3A8B5;
      letter-spacing: 0;
      line-height: 12px;
      margin-left: 20px;
    }

    .col-item {
      display: inline-block;
      height: 109px;
      width: 154px;
      text-align: center;
      padding: 20px 0;
      border: 1px solid #819292;
      margin-right: 20px;
      user-select: none;

      .value {
        font-family: AvenirNext-Medium;
        font-size: 30px;
        color: #819292;
        letter-spacing: 0;
        line-height: 41px;
        margin-bottom: 10px;
      }
      .title {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #819292;
        letter-spacing: 0;
      }
      .align-center {
        text-align: center;
      }

      &.selected {
        background-color: #0DABF4;
        border: 1px solid #3DC7B5;

        .value, .title {
          color: white;
        }
      }
    }
  }
</style>
