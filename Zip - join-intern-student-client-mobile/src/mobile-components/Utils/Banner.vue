<template lang="html">
  <div class="guanggao-banner">
    <a :href="banner && parseUrl(banner.url)"
      target="_blank"
      v-for="banner in [list[0]]"
      v-if="banner">

      <img :src="banner.img" alt="" />
    </a>
  </div>
</template>

<script>
  // import testImg from '@/assets/banner1.png'

  export default {
    data () {
      return {
        testImg: '',
      }
    },
    methods: {
      parseUrl (url) {
        if (url.indexOf('http') === -1) {
          return `//${url}`
        } else {
          return url
        }
      }
    },
    props: {
      list: {
        type: Array,
        default () {
          return [
            {
              title: '',
              url: '',
              img: '',
            },
          ]
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .guanggao-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    // height: 100%;

    a {
      text-decoration: none;
      display: block;
      // height: 100%;
      width: 100%;

      .icon();
      background-size: cover;

      img {
        display: block;
        width: 100%;
      }
    }
  }
</style>
