<template lang="html">
  <div class="selector-row" :class="[extraClass]">
    <div class="title">{{title}}:</div>
    <div class="selection-list">
      <span class="selector-item pointer-on" @click="selectItem(item)" v-for="item in list" :class="{selected:  isItemSelected(item)}">
        {{ getItemContent(item) }}
      </span>
    </div>

    <div class="open-more pointer-on" v-if="moreTitle" :class="{extended: extended}">
      {{moreTitle}}
      <span class="arrow" :style="imgBg(iconArrow)"></span>
    </div>
  </div>
</template>

<script>
  import { styleFns } from '@/mixins/helperFuncs.js'
  import imgs from '@/assets/pc-stu/index.js'

  export default {
    name: 'SelectorRow',
    mixins: [styleFns],
    data () {
      return {
        extended: false,
      }
    },
    methods: {
      isItemSelected (item) {
        let key = this.selectkey
        let selected = this.selected

        if (!selected) return false

        if (typeof item !== 'string' && key in item) {
          return item[key] === selected
        } else {
          return item === selected
        }
      },
      getItemContent (item) {
        if (typeof item !== 'string' && 'title' in item) return item['title']
        return item
      },
      selectItem (item) {
        this.$emit('select', item)
      },
    },
    computed: {
      iconArrow () {
        return this.extended ? imgs.icon4 : imgs.icon3
      },
    },
    props: {
      extraClass: {
        type: String,
        default: ''
      },
      list: {
        type: Array,
        default () {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      },
      selected: {
        type: String,
        default: ''
      },
      selectkey: {
        type: String,
        default: ''
      },
      moreTitle: {
        type: [String, Boolean],
        default: '',
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .selector-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: white;

    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #454F66;
    letter-spacing: 0;
    line-height: 56px;
    user-select: none;
    padding: 0 30px;
    margin-bottom: 1px;

    .title {
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #819292;
      letter-spacing: 0;
      line-height: 56px;
      margin-right: 30px;
    }

    .selection-list {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-start;
      flex-flow: wrap;
      overflow: hidden;

      .selector-item {
        margin: 0 18px;
        float: left;

        &.selected {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #FF8000;
          letter-spacing: 0;
          line-height: 16px;
          padding: 5px 11px;
          margin: 15px 6px;

          border: 1px solid #E5E6EB;
          border-radius: 17px;
        }
      }
    }

    .open-more {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #FF8000;
      letter-spacing: 0;
      line-height: 16px;

      &.extended {
        color: #819292;
      }

      .arrow {
        display: inline-block;
        width: 10.4px;
        height: 6px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }
    }
  }
</style>
