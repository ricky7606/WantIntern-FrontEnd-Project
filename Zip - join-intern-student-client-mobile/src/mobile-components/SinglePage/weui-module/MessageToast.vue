<template lang="html">
  <div class="we-success-toast" @touchmove.stop.prevent="">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast retangle-box">
      <p class="weui-toast__content smaller" v-if="title">{{title}}</p>
      <p class="weui-toast__content smaller" v-if="content">{{content}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeUIMessageToast',
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
  }
}
</script>

<style lang="less" scoped>
  @import '../../../node_modules/weui/src/style/weui';
  @import '../../../node_modules/weui/src/style/widget/weui-tips/weui-toast.less';

  .weui-toast.retangle-box {
    @width: 12em;
    width: @width;
    height: auto;
    min-height: auto;
    margin-left: -(@width/2);
    padding: 1em;
  }
  .weui-toast__content.smaller {
    font-size: 14px;
    margin: 0;
  }
</style>
