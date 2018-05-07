<template lang="html">
  <div class="search-box">
    <input type="text"
           @keyup.enter="search"
           v-model="stateValue"
           :placeholder="hintText">
    <div class="btn-search pointer-on" @click="search" :style="imgBg(imgs.icon2)"></div>
  </div>
</template>

<script>
  import { styleFns } from '@/mixins/helperFuncs.js'
  import imgs from '@/assets/pc-stu/index.js'

  export default {
    name: 'SearchBox',
    mixins: [styleFns],
    data () {
      return {
        imgs,
        stateValue: '',
      }
    },
    methods: {
      search () {
        let word = this.stateValue
        // if (!word) return

        this.$emit('keyword', word)
        this.$emit('input', word)
      }
    },
    watch: {
      value (v) {
        this.stateValue = v
      },
    },
    props: {
      hintText: {
        type: String,
        default: '搜索职位、公司'
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

  .search-box {
    display: inline-block;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    input {
      width: 784px;
      height: 50px;
      line-height: 50px;

      background-color: white;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: black;
      padding: 0 23px;

      &::input-placeholder {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #BFBFBF;
        letter-spacing: 0;
        line-height: 14px;
      }
    }

    .btn-search {
      display: inline-block;
      width: 54px;
      height: 50px;

      background-color: #0DABF4;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 40%;
    }
  }
</style>
