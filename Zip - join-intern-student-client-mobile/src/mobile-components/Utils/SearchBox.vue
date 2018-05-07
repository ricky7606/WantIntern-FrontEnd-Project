<template lang="html">
  <div class="search-box">
    <span class="icon left flex-col" :style="Common.iconSearch | imgbg"></span>
    <input type="text"
           @focus="isFocus = true"
           @blur="onBlur"
           @keyup.enter="search"
           v-model.lazy="stateValue"
           :placeholder="hintText">
    <span class="icon right flex-col"
      @click="clear"
      v-show="stateValue"
      :style="Common.btnClear | imgbg"></span>
  </div>
</template>

<script>
  import { Common } from '@/assets/wechat-stu/index.js'

  export default {
    name: 'SearchBox',
    mounted () {
      this.stateValue = this.value
    },
    data () {
      return {
        Common,
        stateValue: '',
        isFocus: false,
      }
    },
    methods: {
      search () {
        let word = this.stateValue

        this.$emit('keyword', word)
        this.$emit('input', word)
      },
      clear () {
        this.stateValue = ''
      },
      onBlur () {
        this.isFocus = false
        this.search()
      },
    },
    watch: {
      value (v) {
        this.stateValue = v
        this.search()
      },
    },
    props: {
      hintText: {
        type: String,
        default: '搜索职位/公司'
      },
      value: {
        type: [String, Number],
        default: '',
      },
    }
  }
</script>

<style lang="less">
  @import "../../less/common.less";
  @import "../../less/mobile.less";

  .search-box {
    display: block;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 30px;
    padding-left: 26px;
    padding-right: 26px;
    background-color: white;

    position: relative;

    input {
      width: 100%;
      height: 100%;
      border-radius: 3px;

      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: black;

      &::input-placeholder {
        font-family: PingFangSC-Light;
        font-size: 30px/2;
        color: #BFBFBF;
        line-height: 30px/2;
      }
    }
    .icon {
      display: inline-block;
      position: absolute;
      height: 100%;
      width: 26px;

      .icon();
      .bg-size(15px);
    }
    .left {
      left: 0;
    }
    .right {
      right: 0;
    }
  }
</style>
