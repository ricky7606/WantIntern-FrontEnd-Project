<template lang="html">
  <div class="list-title padding-sides" v-show="title">
    {{ title }}
  </div>
</template>

<script>
  export default {
    name: 'ListTitle',
    props: {
      title: {
        type: [String, Number],
        default () {
          return ''
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/mobile.less";

  .list-title {
    background-color: @theme-color-bg;

    height: 33px;
    line-height: 33px;
    text-align: left;

    font-family: PingFangSC-Regular;
    font-size: 26px/2;
    color: #656565;
  }
</style>
