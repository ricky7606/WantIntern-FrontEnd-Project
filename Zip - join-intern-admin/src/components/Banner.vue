<template lang="html">
  <div class="guanggao-banner">
    <a :href="banner.url" v-for="banner in list">
      <img :src="banner.img" :alt="banner.title">
    </a>
  </div>
</template>

<script>
  import { imgBanner1 } from '@/assets/index.js'

  export default {
    props: {
      list: {
        type: Array,
        default () {
          return [
            {
              title: '广告业',
              url: '',
              img: imgBanner1,
            },
          ]
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .guanggao-banner {
    display: flex;
    height: 360px;
    width: 100%;
    align-items: center;
    justify-content: center;

    a {
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      overflow: hidden;

      img {
        height: 100%;

      }
    }
  }
</style>
