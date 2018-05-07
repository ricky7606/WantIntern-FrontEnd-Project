<template>
  <div class="news-page">
    <ad-banner :list="hugeBabberList" />
    <div class="main-content">

      <div class="row flex-row cards">
        <div class="card-list">
          <news-card-extended :port="card" @update="updateCard"/>
        </div>

        <!-- 右边栏 -->
        <div class="right-banner">
          <template v-for="banner in mediumBabberList">
            <info-banner-item :key="banner.title" :img="banner.img" :url="banner.url" :title="banner.title"/>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AdBanner from './Banner.vue'
  import SearchBox from './Utils/SearchBox.vue'
  import SelectorRow from './Utils/SelectorRow.vue'
  import InfoBannerItem from './Utils/InfoBannerItem.vue'
  import PageIndex from './Utils/PageIndex.vue'
  import NewsCardExtended from './News/NewsCardExtended.vue'

  import * as Img from '@/assets/index.js'
  import '../less/quill-style.less'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import * as MetaProxy from '@/api/proxy.js'

  export default {
    name: 'NewsInfo',
    data () {
      return {
        Img,
        newsId: '',

        card: {},
        hugeBabberList: [],
        mediumBabberList: [],
      }
    },
    mounted () {
      let newsId = this.$route.params.id
      this.newsId = newsId
      this.getData(newsId)

      MetaProxy.Get('AD_BANNER_MEDIUM', res => {
        this.mediumBabberList = res
      })
      // 广告图
      MetaProxy.Get('AD_BANNER_HUGE', res => {
        this.hugeBabberList = res
      })
    },
    methods: {
      getData (newsId = 0) {
        const that = this
        Req.Get(ReqUrl.NewsSubUrl.getNewsItem(newsId),
          {},
          res => {
            that.card = res
          }
        )
      },
      updateCard (data) {
        // this.getData(this.newsId)
        this.card = data
      },
    },
    components: {
      AdBanner,
      SearchBox,
      SelectorRow,
      InfoBannerItem,
      PageIndex,
      NewsCardExtended,
    }
  }
</script>

<style lang="less" scoped>
  @import "../less/common.less";

  .news-page {
    background-color: #F4F3F6;
    display: block;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .main-content {
    display: inline-block;
    width: @MIN-WIDTH;
    display: flex;
    flex-direction: column;
    text-align: left;
    align-items: flex-start;
    justify-content: flex-start;

    padding: 21px 0px;

    .new-items {
      background: #FFFFFF;
      border: 1px solid #0DABF4;
      height: 50px;
      line-height: 50px;
      padding: 0 35px;

      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #0DABF4;
      letter-spacing: 0;

      display: inline-block;
      margin-left: 30px;
    }

    .hot-words {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #BFBFBF;
      letter-spacing: 0;
      line-height: 14px;
      margin: 13px 0;

      .word {
        margin-left: 1em;
      }
    }

    .company-category {
      width: @MIN-WIDTH;
      background-color: white;
      padding: 0 20.3px;
      display: block;
      margin: 17px 0;
      position: relative;
      display: inline-block;
      user-select: none;

      vertical-align: middle;

      .max-width {
        max-width: 1140px;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
        vertical-align: middle;
      }
      .open-more {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #0DABF4;
        letter-spacing: 0;
        line-height: 16px;

        height: 56px;
        line-height: 56px;
        background-color: white;

        display: inline-block;
        vertical-align: middle;
      }
      .category-item {
        height: 56px;
        line-height: 56px;
        display: inline-block;
        padding: 0 45.4px/2;

        &:active {
          color: gray;
        }
      }
    }

    .company-category-detail {
      width: @MIN-WIDTH;
      // background-color: white;
      // padding: 0 30px;
      display: block;
      margin: 17px 0;
      position: relative;
      display: inline-block;

      vertical-align: middle;
    }
    // 推荐种类
    .type-list {

      .type-item {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #292929;
        letter-spacing: 0;
        line-height: 16px;
        padding: 0 1em;
        border-right: 1px solid #819292;
        margin-top: 23px;
        margin-bottom: 20px;

        &:last-of-type {
          border-right: 0px;
        }
        &:first-of-type {
          padding-left: 0px;
        }
        &.selected {
          color: #0DABF4;
        }
      }
    }
    // 职位列表
    .cards {
      .card-list {
        width: 940px;
        margin-right: 20px;
      }
      .right-banner {
        width: 300px;

        .info-banner-item {
          width: 300px;
          height: 170px;
          display: block;
        }
      }
    }
  }
</style>
