<template lang="html">
  <div class="info-banner-item" :class="{extend: extend}">
    <a :href="url" target="_blank">
      <div class="box" :style="imgBg(img)"></div>
    </a>
  </div>
</template>

<script>
  import { styleFns } from '@/mixins/helperFuncs.js'

  export default {
    name: 'InfoBannerItem',
    mixins: [styleFns],
    data () {
      return {}
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      img: {
        type: String,
        default: '',
      },
      url: {
        type: String,
        default: '',
      },
      extend: {
        type: String,
        default: '',
      },
    }
  }
</script>

<style lang="less" scoped>
  .info-banner-item {
    display: inline-block;
    width: 300px;
    height: 170px;
    margin-bottom: 20px;
    background-color: #EEE;

    &.extend {
      width: 408px;
      height: 231px;
    }
  }
  .box {
    display: block;
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
