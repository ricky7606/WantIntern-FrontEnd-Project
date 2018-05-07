<template lang="html">
  <div class="page-home"
    @touchend="listenForLoadMoreCallback"
    @touchmove="listenForLoadMore">
    <div class="header">
      <div class="search-box-container padding-sides">
        <search-box v-model="searchKeyWord"/>
      </div>
      <div class="banner-container">
        <banner :list="hugeBabberList" />
      </div>
    </div>
    <div class="list">
      <list-title title="好公司看这里"/>
      <template v-for="companyItem in companyList">
        <div class="job-card-container padding-sides">
          <company-card
            @select="selectCompanyCard(companyItem)"
            @click.native="selectCompanyCard(companyItem)"
            :company="companyItem"/>
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
  import CompanyCard from '@/mobile-components/Company/CompanyCard.vue'

  // data
  import * as MetaProxy from '@/api/proxy.js'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { ParsePagination } from '@/utils/helper-functions.js'

  const DEFAULT_PAGE_SIZE = 12

  export default {
    name: 'PageHome',
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
      that.getDataLongWay({pageSize, pageIndex})

      // 广告图
      MetaProxy.Get('AD_BANNER_HUGE', res => {
        this.hugeBabberList = res
      })
    },
    watch: {
      searchKeyWord () {
        let keyword = this.searchKeyWord
        this.allLoaded = false
        this.getDataLongWay({
          keyword
        })
      }
    },
    data () {
      return {
        pageTitle: '公司',

        searchKeyWord: '',
        companyList: [],
        pagination: {
          current: 1,
          total: 1,
          pagesize: 12,
        },
        isLoading: false,
        allLoaded: false,
        shouldVerified: false,

        hugeBabberList: [],
      }
    },
    components: {
      SearchBox,
      Banner,
      ListTitle,
      CompanyCard,
    },
    methods: {
      getData (pageSize, pageIndex) {
        const that = this
        Req.Get(ReqUrl.PositionSubUrl.getList(),
          {
            pageSize,
            pageIndex,
            frozen: false,
          },
          res => {
            that.companyList = res.items
            // that.pagination = ParsePagination(res.pagination)
          }
        )
      },
      getDataLongWay (params = {}) {
        const that = this
        // const shouldVerified = this.shouldVerified || params.verified
        Req.Get(ReqUrl.CompanySubUrl.getList(),
          {
            pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
            pageIndex: params.pageIndex || 1,
            // verified: this.shouldVerified || null,
            frozen: false,

            ...params,
          },
          res => {
            let companyList = res.items
            // if (shouldVerified) {
            //   that.companyList = companyList.filter(item => item.verified)
            // } else {
            // }
            that.companyList = companyList
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
        // const shouldVerified = this.shouldVerified || params.verified
        Req.Get(ReqUrl.CompanySubUrl.getList(),
          {
            pageSize: DEFAULT_PAGE_SIZE,
            pageIndex: nextIndex,
            // verified: this.shouldVerified || null,
            frozen: false,

            ...params,
          },
          res => {
            let companyList = res.items
            that.companyList = [...that.companyList, ...companyList]
            that.pagination = ParsePagination(res.pagination)
          }
        )
      },
      selectCompanyCard (data) {
        this.$router.push({
          name: 'PageCompanyDetail',
          params: {
            id: data.id
          }
        })
      },
      selectCompany (item) {
        this.$router.push({
          name: 'PageCompanyDetail',
          params: {
            id: item.companyId
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
        height: auto;
        // height: 180px;
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
