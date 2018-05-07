<template lang="html">
  <div class="icon-selector flex-row flex-between" :class="{borderBottom: borderBottom}">
    <div class="flex-row left">
      <div class="icon" v-show="icon" :style="icon | imgbg"></div>
      <div class="title">
        {{ title }}
      </div>
    </div>
    <div class="flex-row right">
      <div class="flex-col">
        <slot />
      </div>
      <div class="has-new" v-if="hasNew">
        <span class="red-point"></span>
      </div>
      <div class="icon-arrow"
        :class="[arrowDir]"
        :style="AccountPage.arrow | imgbg" v-show="showArrow"></div>
    </div>
  </div>
</template>

<script>
  import { AccountPage } from '@/assets/wechat-stu/index.js'

  export default {
    name: 'IconSelector',
    data () {
      return {
        AccountPage,
      }
    },
    props: {
      icon: {
        type: String,
        default () {
          return ''
        }
      },
      arrowDir: {
        type: String,
        default () {
          return ''
        }
      },
      title: {
        type: String,
        default () {
          return ''
        }
      },
      showArrow: {
        type: Boolean,
        default () {
          return true
        }
      },
      borderBottom: {
        type: Boolean,
        default () {
          return true
        }
      },
      hasNew: {
        type: Boolean,
        default () {
          return false
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/mobile.less";

  .icon-selector {
    position: relative;
    overflow: hidden;
    padding: 0 15px;
    height: 44px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    &.borderBottom {
      &:after {
        position: absolute;
        bottom: 0;
        left: 15px;
        content: ' ';
        border-bottom: 1px solid #EDEEF1;
        width: 100%;
      }
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #656565;
      line-height: 30px/2;
    }

    .icon {
      display: inline-block;
      margin-right: 7.15px;

      .sqr(15px);
    }

    .icon-arrow {
      display: inline-block;
      margin-left: 5px;

      .sqr(10.4px);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      transition: all 0.6s ease-in-out;

      &.left {
        transform: rotate(-180deg);
      }
      &.right {
        transform: rotate(0deg);
      }
      &.up {
        transform: rotate(-90deg);
      }
      &.down {
        transform: rotate(90deg);
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: center;

    .flex-col {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .has-new {
    display: inline-block;
    position: relative;
  }
  .red-point {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    top: -4px;
    left: -4px;
  }
</style>
