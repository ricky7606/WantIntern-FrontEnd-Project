<template lang="html">
  <div class="guanggao-banner">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item, index) in list">
        <div class="swiper-zoom-container">
          <a :href="item && parseUrl(item.url)" target="_blank" >
             <img :src="parseImgUrl(item.img)" style="width: 100%;height: 100%;"><!--  -->
            	<!-- <img :src="parseImgUrl(item.img)"> -->
          </a>
        </div>
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- <a :href="banner && parseUrl(banner.url)" target="_blank" v-for="banner in [list[0]]" v-if="banner">
      <img :src="parseImgUrl(banner.img)" :alt="banner.title">
    </a> -->
  </div>
</template>

<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'

  export default {
    data () {
      return {
        mySwiper: null,
      }
    },
    mounted () {
      const that = this
      that.$nextTick(function () {
        if (this.list && this.list.length > 1) {
          that.initSwiper()
        }
      })
    },
    methods: {
      initSwiper () {
        this.$nextTick(x => {
          this.mySwiper = new Swiper('.guanggao-banner', {
            // 起始页
            // initialSlide: 2,
            autoplayStopOnLast: true,
            autoHeight: true,
            // direction: 'vertical',
            direction: 'horizontal',
            loop: true,
            autoplay: 3000,
            // 渐变切换
            // effect: 'fade',
            // 立方体
            // effect: 'cube',
            // 滑板
            effect: 'coverflow',
            // 翻版
            // effect: 'flip',
            // centeredSlides: true,
            // coverflow: {
            //   rotate: 30,
            //   stretch: 10,
            //   depth: 60,
            //   modifier: 2,
            //   slideShadows: true
            // },
            pagination: '.swiper-pagination',
            paginationType: 'bullets',
            // paginationType: 'fraction',
            // paginationType: 'progress',

            paginationClickable: true,
            paginationHide: false,

            // nextButton: '.swiper-button-next',
            // prevButton: '.swiper-button-prev',

            // 图片效果
            lazyLoading: true,
            lazyLoadingInPrevNext: true,

            zoom: false,
          })
        })
      },
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
    watch: {
      list () {
        if (this.list.length > 1) {
          this.initSwiper()
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
    overflow: hidden;

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
