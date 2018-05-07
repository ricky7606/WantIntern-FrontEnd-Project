<template lang="html">
  <div class="info-banner-item" :class="{extend: extend}">
    <a :href="parseUrl(url)" target="_blank">
      <div class="box" :style="imgBgNoParse(parseImgUrl(img))"></div>
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
    methods: {
      parseUrl (url) {
        if (url.indexOf('http') === -1) {
          return `//${url}`
        } else {
          return url
        }
      },
      parseImgUrl (url) {
        let host = location.host
        if (url.indexOf(host) === -1) {
          return url
        }
        let r = 'x.xiangshixi.cc:8080'
        if (url.indexOf(r) !== -1) {
          let p = url.split(r)
          return p[1]
        }

        if (url.indexOf('http') === -1) {
          return `//${url}`
        } else {
          return url.replace(/^https?:/, '')
        }
      },
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
