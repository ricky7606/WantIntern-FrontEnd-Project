<template lang="html">
  <div class="we-loading-toast" @touchmove.stop.prevent="">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
      <i class="weui-loading weui-icon_toast"></i>
      <p class="weui-toast__content">{{title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeUILoadingToast',
  props: {
    title: {
      type: String,
      default: '请稍等片刻'
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../../node_modules/weui/src/style/weui';
  @import '../../../node_modules/weui/src/style/widget/weui-tips/weui-toast.less';
  @import '../../../node_modules/weui/src/style/widget/weui-tips/weui-mask.less';
  @import '../../../node_modules/weui/src/style/widget/weui-loading/weui-loading.less';
</style>
