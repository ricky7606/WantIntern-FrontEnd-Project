<template lang="html">
  <div class="page-home"
    @touchend="listenForLoadMoreCallback"
    @touchmove="listenForLoadMore">
    <div class="header">
      <div class="search-box-container padding-sides">
        <search-box v-model="searchKeyWord"/>
      </div>
      <div class="banner-container">
        <banner :list="hugeBabberList"/>
      </div>
    </div>
    <div class="list">
      <list-title title="推荐实习好岗位"/>
      <template v-for="positionItem in positionList">
        <div class="job-card-container padding-sides">
          <jobs-card :port="positionItem"
            @select="selectJobsCard(positionItem)"
            @select-company="selectJobsCard(positionItem)"
            @click.native="selectJobsCard(positionItem)"/>
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
  import JobsCard from '@/mobile-components/Position/JobsCard.vue'

  // data
  import * as MetaProxy from '@/api/proxy.js'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  const DEFAULT_PAGE_SIZE = 12
  export default {
    name: 'PageHome',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()

      const that = this
      let route = this.$route

      let pageSize = 12
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
        pageTitle: '享实习',

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
    watch: {
      searchKeyWord () {
        let keyword = this.searchKeyWord
        this.allLoaded = false
        this.getDataOfKeyword(keyword)
      }
    },
    components: {
      SearchBox,
      Banner,
      ListTitle,
      JobsCard,
    },
    methods: {
      getData (pageSize, pageIndex) {
        const that = this
        Req.Get(ReqUrl.PositionSubUrl.getList(),
          {
            pageSize,
            pageIndex,
          },
          res => {
            that.positionList = res.items
            that.pagination = this.ParsePagination(res.pagination)

            if (that.pagination.total === 1) {
              this.allLoaded = true
            }
          }
        )
      },
      getDataOfKeyword (keyword, params = {}) {
        const that = this

        Req.Get(ReqUrl.PositionSubUrl.getList(),
          {
            keyword,

            pageSize: DEFAULT_PAGE_SIZE,
            pageIndex: 1,
            // industry: this.INDUSTRY.selected === '不限' ? null : this.INDUSTRY.selected,
            // type: this.COMPANY_TYPE.selected === '不限' ? null : this.COMPANY_TYPE.selected,
            // verified: this.shouldVerified || undefined,

            ...params,
          },
          res => {
            let list = res.items
            that.positionList = list

            let p = this.ParsePagination(res.pagination)
            that.pagination = p
          }
        )
      },
      getDataLongWay (params = {}) {
        const that = this

        Req.Get(ReqUrl.PositionSubUrl.getList(),
          {
            pageSize: DEFAULT_PAGE_SIZE,
            pageIndex: 1,
            industry: this.INDUSTRY.selected === '不限' ? null : this.INDUSTRY.selected,
            type: this.COMPANY_TYPE.selected === '不限' ? null : this.COMPANY_TYPE.selected,
            keyword: this.searchKeyWord,
            verified: this.shouldVerified || undefined,

            ...params,
          },
          res => {
            let list = res.items
            that.positionList = list

            let p = this.ParsePagination(res.pagination)
            that.pagination = p
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
        Req.Get(ReqUrl.PositionSubUrl.getList(),
          {
            pageSize: DEFAULT_PAGE_SIZE,
            pageIndex: nextIndex,
          },
          res => {
            that.positionList = [...that.positionList, ...res.items]
            that.pagination = this.ParsePagination(res.pagination)
          }
        )
      },
      selectJobsCard (data) {
        console.log(data.id)
        this.$router.push({
          name: 'PagePositionDetail',
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

  .page-home {
    .header {
      width: 100%;

      .search-box-container {
        background-color: #343334;
        padding-top: 7.5px;
        padding-bottom: 6.5px;
      }
      .banner-container {
        // height: 180px;
        height: auto;
        background-color: #343334;
      }
    }
    .job-card-container {
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
