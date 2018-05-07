<template>
  <div class="page-news-detail">
    <div class="main-content">
      <div class="row flex-row cards">
        <div class="card-list">
          <news-card-extended :port="card" @update="updateCard"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchBox from '@/mobile-components/Utils/SearchBox.vue'
  import SelectorRow from '@/mobile-components/Utils/SelectorRow.vue'
  import InfoBannerItem from '@/mobile-components/Utils/InfoBannerItem.vue'
  import PageIndex from '@/mobile-components/Utils/PageIndex.vue'
  import NewsCardExtended from '@/mobile-components/News/NewsCardExtended.vue'

  import * as Img from '@/assets/index.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'PageNewsDetail',
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
        this.card = data
      },
    },
    components: {
      SearchBox,
      SelectorRow,
      InfoBannerItem,
      PageIndex,
      NewsCardExtended,
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/mobile.less";

  .page-news-detail {
    .card-list {
      width: 100%;

      img {
        width: 100% !important;
      }
    }
  }
</style>
