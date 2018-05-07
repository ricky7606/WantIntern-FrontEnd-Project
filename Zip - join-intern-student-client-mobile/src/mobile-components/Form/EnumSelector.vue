<template lang="html">
  <div class="enum-selector" :class="{selecting: show}">
    <div class="icon-selector flex-row flex-between"
      @click="startSelect"
      :class="{borderBottom: borderBottom}">
      <div class="flex-row left">
        <div class="icon" v-show="icon" :style="icon | imgbg"></div>
        <div class="title">
          {{ title }}
        </div>
      </div>
      <div class="flex-row right">
        <div class="flex-row flex-align-bottom">
          <span class="hint-text" :class="{hidden: !show}" v-show="show">
            （请从下边选择）
          </span>
          <span :class="{oldValue: show}">
            {{ optDict[value] || '' }}
          </span>
        </div>
        <div class="icon-arrow"
          :class="{turnDown: show}"
          :style="AccountPage.arrow | imgbg" v-show="showArrow"></div>
      </div>
    </div>
    <div class="list" v-show="show">
      <icon-selector v-for="item in list"
        @click.native="select(item)"
        arrow-dir="left"
        :key="item.title">
        <span class="value">{{ item.title }}</span>
      </icon-selector>
    </div>
  </div>
</template>

<script>
  import { AccountPage } from '@/assets/wechat-stu/index.js'
  import IconSelector from '@/mobile-components/Form/IconSelector.vue'

  export default {
    name: 'EnumSelector',
    data () {
      return {
        AccountPage,
      }
    },
    components: {
      IconSelector,
    },
    methods: {
      startSelect () {
        this.$emit('select', '')
      },
      hideSelect () {
        this.$emit('hide-select', '')
      },
      select (item) {
        let key = item.key
        this.$emit('input', key)
        this.hideSelect()
      },
    },
    computed: {
      optDict () {
        let list = this.list
        return list.reduce((d, item) => {
          d[item.key] = item.title
          return d
        }, {})
      }
    },
    props: {
      icon: {
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
      value: {
        type: [String, Number],
        default () {
          return ''
        }
      },
      list: {
        type: Array,
        default () {
          return []
        }
      },
      show: {
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

  .enum-selector {
    &.selecting {
      border-bottom: 2px solid gray;
      border-top: 2px solid gray;
    }
  }
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

      &.turnDown {
        transform: rotate(90deg);
        margin-left: 15px;
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
  .hint-text {
    color: #656565;
    font-size: 12px;
    margin-right: 10px;

    transition: all 0.6s ease-in-out;
    &.hidden {
      opacity: 0;
    }
  }
  .oldValue {
    font-weight: bold;
    color: #0DABF4;
    transition: all 0.6s ease-in-out;
  }
  .flex-align-bottom {
    display: flex;
    align-items: flex-end;
  }
</style>
