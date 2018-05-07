<template lang="html">
  <div class="we-success-toast" @touchmove.stop.prevent="">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
      <!-- <i class="weui-icon-success-no-circle weui-icon_toast"></i> -->
      <div class="icon-svg-check">
        <img :src="svgCheck" alt="">
      </div>
      <p class="weui-toast__content">{{title}}</p>
    </div>
  </div>
</template>

<script>
import svgCheck from '../../assets/weui/check.svg'

export default {
  name: 'WeUISuccessToast',
  data () {
    return {
      svgCheck
    }
  },
  props: {
    title: {
      type: String,
      default: '已完成'
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../../node_modules/weui/src/style/weui';
  @import '../../../node_modules/weui/src/style/widget/weui-tips/weui-toast.less';

  .weui-toast {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .icon-svg-check {
      @size: 55px;
      margin-top: 15px;

      height: @size;
      width: @size;
      img {
        width: 100%;
      }
    }
  }
</style>
