<template>
  <div class="news-page">
    <ad-banner />
    <div class="main-content">

      <div class="row flex-row cards">
        <div class="card-list">
          <template v-for="card in positionList">
            <news-card :port="card" @select="selectJobsCard"/>
          </template>

          <page-index :total="positionListPagination.total"
                      :current="positionListPagination.current"
                      @change="pageIndexChange"/>
        </div>

        <!-- 右边栏 -->
        <div class="right-banner">
          <info-banner-item :img="Img.imgAd1" :url="Img.imgAd1" :title="'下载App'"/>
          <info-banner-item :img="Img.imgAd2" :url="Img.imgAd1" :title="'直聘App 2.0'"/>
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
  import NewsCard from './News/NewsCard.vue'

  import * as Storage from '@/utils/storage.js'
  const SEARCH_HOTWORDS_TAG = 'SEARCH_HOTWORDS'
  let hotWords = Storage.Get(SEARCH_HOTWORDS_TAG) || ''

  import * as Img from '@/assets/index.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import { ParsePagination } from '@/utils/helper-functions.js'

  export default {
    name: 'NewsPage',
    data () {
      return {
        hotWords: hotWords.split(','),

        Img,

        searchKeyWord: '',
        positionList: [],
        positionListPagination: {
          current: 1,
          total: 1,
          pagesize: 12,
        },
      }
    },
    mounted () {
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
    },
    methods: {
      getData (pageSize, pageIndex) {
        const that = this
        Req.Get(ReqUrl.NewsSubUrl.getList(),
          {
            pageSize,
            pageIndex,
            // area: '',
            // verified: undefined,
            // industry: '',
            // type: '',
          },
          res => {
            that.positionList = res.items
            that.positionListPagination = ParsePagination(res.pagination)
          }
        )
      },
      selectJobsCard (data) {
        this.$router.push({
          name: 'NewsInfo',
          params: {
            id: data.id
          }
        })
      },
      selectWord (word) {
        console.log(`word: ${word}`)
        this.searchKeyWord = word
      },
      selectTypeItem (typeIndex) {
        this.selectedTypeItemIndex = typeIndex
      },
      switchCategoryMode (mode) {
        this.categoryMode = mode
      },
      selectorRowChange (selected, row) {
        if (row.key) {
          row.selected = selected[row.key]
        } else {
          row.selected = selected
        }
      },
      // 页面切换
      pageIndexChange (index) {
        this.positionListPagination.current = index
        this.$router.push({
          name: 'IndexHomepage',
          params: {
            pageindex: index,
            pagesize: this.positionListPagination.pagesize || 12
          }
        })
      },
      selectCategory (word) {
        this.searchKeyWord = word
      },
      searchWordChange (word) {
        let list = this.hotWords

        if (list.indexOf(word) === -1) {
          list.unshift(word)
          list = list.splice(0, 12)
          Storage.Set(list.join(','), SEARCH_HOTWORDS_TAG)
          this.hotWords = list
        }
      },
    },
    components: {
      AdBanner,
      SearchBox,
      SelectorRow,
      InfoBannerItem,
      PageIndex,
      NewsCard,
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
