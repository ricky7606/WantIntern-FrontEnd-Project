<template lang="html">
  <div class="process-bar align-left">
    <div class="step-item col" v-for="(item, index) in list"
      :class="{selected: step === index}">
      <span class="col">{{item}}</span>
      <span class="line" v-show="index < 3">————</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProcessBar',
    data () {
      return {
        list: [
          '1. 注册账号',
          '2. 用户协议',
          '3. 完善信息',
          '4. 完成注册'
        ]
      }
    },
    props: {
      step: {
        type: Number,
        default: 0,
      }
    }
  }
</script>

<style lang="less" scoped>
  .process-bar {
    display: block;

    .step-item {
      display: inline-block;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #8C93A6;
      letter-spacing: 0;
      margin-right: 10px;

      &.selected {
        color: #0DABF4;
      }
    }
  }
</style>
