<template lang="html">
  <div class="mine-subscription">
    <div class="page-result-title">
      订阅推荐
    </div>

    <div class="content">

    </div>
  </div>
</template>

<script>
  export default {
    name: 'Promoted',
    data () {
      return {
      }
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .page-result-title {
    display: block;
    position: relative;

    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #454F66;
    letter-spacing: 0;
    padding-bottom: 20px;
    margin-bottom: 18px;

    &:after {
      content: ' ';
      display: inline-block;
      height: 2px;
      width: 22.5px;
      background-color: #0DABF4;

      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
</style>
