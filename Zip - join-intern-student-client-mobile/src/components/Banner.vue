<template lang="html">
  <div class="guanggao-banner">
    <a :href="banner && parseUrl(banner.url)" target="_blank" v-for="banner in [list[0]]" v-if="banner">
      <img :src="banner.img" :alt="banner.title">
    </a>
  </div>
</template>

<script>
  export default {
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
  .guanggao-banner {
    display: flex;
    min-height: 360px;
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
        max-height: 100%;
        max-width: 100%;
      }
    }
  }
</style>
