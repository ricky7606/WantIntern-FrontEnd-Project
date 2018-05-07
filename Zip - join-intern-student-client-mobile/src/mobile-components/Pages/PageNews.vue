<template lang="html">
  <div class="page-news"
    @touchend="listenForLoadMoreCallback"
    @touchmove="listenForLoadMore">
    <div class="header">
      <div class="banner-container">
        <banner :list="hugeBabberList" />
      </div>
    </div>
    <div class="list">
      <template v-for="card in positionList">
        <div class="news-card-container padding-sides">
          <news-card
            @click.native="selectNewsCard(card)"
            @select="selectNewsCard(card)"
            :port="card"/>
        </div>
      </template>

      <div class="footer" @click="loadNextPage"
        ref="loadMoreBox"
        v-show="!isLoading && !allLoaded">
        <div class="load">点击加载更多</div>
      </div>
    </div>
  </div>
</template>

<script>
  import pageMixin from './pages-mixins.js'
  import SearchBox from '@/mobile-components/Utils/SearchBox.vue'
  import Banner from '@/mobile-components/Utils/Banner.vue'
  import ListTitle from '@/mobile-components/Utils/ListTitle.vue'
  import NewsCard from '@/mobile-components/News/NewsCard.vue'

  // import * as DataStore from './dataStore.js'

  // data
  import * as MetaProxy from '@/api/proxy.js'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import { ParsePagination } from '@/utils/helper-functions.js'

  const DEFAULT_PAGE_SIZE = 12
  export default {
    name: 'PageNews',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()

      const that = this
      let route = this.$route

      let pageSize = DEFAULT_PAGE_SIZE
      let pageIndex = 1
      if (route.name === 'IndexHomepage') {
        let params = route.params
        pageSize = params.pagesize
        pageIndex = params.pageindex
      }
      that.getData(pageSize, pageIndex)

      // 广告图
      MetaProxy.Get('AD_BANNER_HUGE', res => {
        this.hugeBabberList = res
      })
    },
    data () {
      return {
        pageTitle: '资讯',

        searchKeyWord: '',
        positionList: [],
        pagination: {
          current: 1,
          total: 1,
          pagesize: DEFAULT_PAGE_SIZE,
        },
        isLoading: false,
        allLoaded: false,

        hugeBabberList: [],
      }
    },
    components: {
      SearchBox,
      Banner,
      ListTitle,
      NewsCard,
    },
    methods: {
      getData (pageSize, pageIndex) {
        const that = this
        Req.Get(ReqUrl.NewsSubUrl.getList(),
          {
            pageSize,
            pageIndex,
            published: true,
          },
          res => {
            that.positionList = res.items
            that.pagination = ParsePagination(res.pagination)

            if (that.pagination.total === 1) {
              this.allLoaded = true
            }
          }
        )
      },
      loadNextPage (params = {}) {
        if (this.isLoading) return
        if (this.allLoaded) return

        this.isLoading = true
        let nextIndex = this.pagination.current + 1
        if (nextIndex >= this.pagination.total) {
          this.allLoaded = true
        }
        if (nextIndex > this.pagination.total) return

        const that = this
        Req.Get(ReqUrl.NewsSubUrl.getList(),
          {
            pageSize: DEFAULT_PAGE_SIZE,
            pageIndex: nextIndex,
            published: true,
          },
          res => {
            that.positionList = [...that.positionList, ...res.items]
            that.pagination = ParsePagination(res.pagination)

            if (that.pagination.total === 1) {
              this.allLoaded = true
            }
          }
        )
      },
      selectNewsCard (data) {
        this.$router.push({
          name: 'PageNewsDetail',
          params: {
            id: data.id
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../less/mobile.less';

  .page-news {
    .header {
      width: 100%;
      margin-bottom: 10px;

      .search-box-container {
        background-color: #343334;
        padding-top: 7.5px;
        padding-bottom: 6.5px;
      }
      .banner-container {
        height: auto;
        // height: 180px;
        background-color: #343334;
      }
    }
    .news-card-container {
      background-color: white;

      padding-top: 15px;
      padding-bottom: 15px;
      margin-bottom: 10px;
    }
  }
  .load-more {
    padding-bottom: 10px;
    font-size: 26px/2;
    color: #9B9B9B;
  }
</style>
