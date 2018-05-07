<template lang="html">
  <div class="logo-header flex-row flex-center row">
    <a href="javascript:;" class="link2home" :style="imgBg(imgLogo)"></a>
    <span class="text"> | 管理后台</span>
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
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

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
