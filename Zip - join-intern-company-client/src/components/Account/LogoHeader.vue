<template lang="html">
  <div class="logo-header flex-row flex-middle col">
    <a href="javascript:;" class="link2home" :style="imgBg(imgLogo)"></a>
    <span class="text"> | 学生招募就在享实习</span>
  </div>
</template>

<script>
  import imgLogo from '@/assets/logo.png'

  export default {
    name: 'LogoHeader',
    data () {
      return {
        imgLogo,
      }
    },
    methods: {
      imgBg (url) {
        return {
          backgroundImage: `url(${url})`
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .logo-header {

    .link2home {
      display: inline-block;
      width: 175px;
      height: 70px;

      .icon();
    }
    .text {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #819292;
      letter-spacing: 0;
      line-height: 16px;
    }
  }
</style>
