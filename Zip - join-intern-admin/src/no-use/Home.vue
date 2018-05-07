<template>
  <div class="home">
    <ad-banner v-show="categoryMode === 'less'"/>
    <div class="main-content">
      <div class="row flex-row align-left">
        <search-box @keyword="searchWordChange" :value="searchKeyWord"/>
        <!-- <div class="new-items">新增职位 122</div> -->
      </div>

      <div class="row flex-row hot-words align-left">
        热门搜索:
        <span class="col word pointer-on" v-for="w in hotWords"
          @click="selectWord(w)">
          {{w}}
        </span>
      </div>

      <div class="row flex-row company-category align-left" v-show="categoryMode === 'less'">
        <div class="max-width col">
          <div class="category-item pointer-on"
               @click="selectCategory(word)"
               v-for="word in companyCategory">
            {{word}}
          </div>
        </div>

        <div class="open-more col pointer-on" @click="switchCategoryMode('more')">
          {{'更多>>'}}
        </div>
      </div>

      <div class="row flex-row company-category-detail align-left" v-show="categoryMode === 'more'">
        <template v-for="row in detailCategory">
          <selector-row :title="row.title"
            :more-title="row.moreTitle"
            :selected="row.selected"
            :selectkey="row.key"
            :list="row.list"
            @select="selectorRowChange($event, row)"/>
        </template>
      </div>

      <!-- 职位 -->
      <div class="row flex-row type-list">
        <div class="type-item pointer-on" v-for="(typeItem, typeIndex) in typeList"
             @click="selectTypeItem(typeIndex)"
             :class="{selected: selectedTypeItemIndex === typeIndex}">
          {{typeItem.title}}
        </div>
      </div>

      <div class="row flex-row cards">
        <div class="card-list">
          <template v-for="card in positionList">
            <jobs-card :port="card" @select="selectJobsCard"/>
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
  import JobsCard from './Position/JobsCard.vue'

  import * as Storage from '@/utils/storage.js'
  const SEARCH_HOTWORDS_TAG = 'SEARCH_HOTWORDS'
  let hotWords = Storage.Get(SEARCH_HOTWORDS_TAG) || ''

  import * as Img from '@/assets/index.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import { ParsePagination } from '@/utils/helper-functions.js'

  export default {
    name: 'Home',
    data () {
      return {
        hotWords: hotWords.split(','),
        companyCategory: [
          '银行', '证券', '保险', '信托', '投行', '私募基金',
          // '银行', '证券', '保险', '信托', '投行', '私募基金',
          // '银行', '证券', '保险', '信托', '投行', '私募基金',
        ],
        categoryMode: 'less',
        detailCategory: [
          {
            title: '行业',
            list: [
              { title: '不限', key: 'all', },
              { title: '银行', key: 'bank', },
              { title: '证券', key: 'ticket', },
              { title: '保险', key: 'insurrance', },
              { title: '外汇', key: 'exchange', },
            ],
            // moreTitle: '全部行业',
            moreTitle: false,
            key: 'key',
            selected: 'all',
          },
          {
            title: '职位',
            list: [
              '不限', '技术支持', '财务', '文案', '行政', '销售',
            ],
            moreTitle: false,
            key: '',
            selected: '不限',
          },
          {
            title: '地点',
            list: [
              '不限', '浦东新区', '徐汇区', '静安区', '普陀区', '长宁区', '黄浦区', '杨浦区', '宝山区', '奉贤区', '崇明区',
            ],
            // moreTitle: '全部地点',
            moreTitle: '',
            key: '',
            selected: '不限',
          },
          {
            title: '性质',
            list: [
              '不限', '外资', '合资', '国企', '民营公司', '上市公司', '外企代表处', '政府机关', '事业单位', '非营利性机构',
            ],
            moreTitle: false,
            key: '',
            selected: '不限',
          },
        ],
        selectedTypeItemIndex: 0,
        typeList: [
          { title: '推荐职位', key: 'promoted', },
          { title: '最新发布', key: 'new', },
          { title: '认证', key: 'auth', },
        ],

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
        Req.Get(ReqUrl.PositionSubUrl.getList(),
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
          name: 'PositionInfo',
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
        this.getData(this.positionListPagination.pagesize || 12, index)
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
      JobsCard,
    }
  }
</script>

<style lang="less" scoped>
  @import "../less/common.less";

  .home {
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
