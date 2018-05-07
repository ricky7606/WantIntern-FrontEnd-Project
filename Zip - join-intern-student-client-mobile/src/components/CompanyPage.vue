<template>
  <div class="company-page">
    <div class="promoted-company" v-show="promotedCompanyList && promotedCompanyList.length">
      <div class="title">优质企业推荐</div>
      <div class="row">
        <template v-for="pcItem in promotedCompanyList">
          <div class="col promoted-company-item pointer-on"
            :style="imgBg(pcItem.logo || Img.listPcStu.imgLogo)"
            @click="selectCompany(pcItem)">
            <!-- {{pcItem.title}} -->
          </div>
        </template>
      </div>
    </div>

    <div class="main-content">
      <div class="row flex-row align-left">
        <search-box @keyword="searchWordChange" v-model="searchKeyWord"/>
      </div>

      <div class="row flex-row hot-words align-left" v-show="hotWords && hotWords.length > 0">
        热门搜索:
        <span class="col word pointer-on" v-for="w in hotWords"
          @click="selectWord(w)">
          {{w}}
        </span>
      </div>

      <!-- <div class="row flex-row company-category align-left" v-show="categoryMode === 'less'">
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
      </div> -->

      <!-- <div class="row flex-row company-category-detail align-left" v-show="categoryMode === 'more'"> -->
      <div class="row flex-row company-category-detail align-left">
        <template v-for="row in [INDUSTRY, COMPANY_TYPE]">
          <selector-row :title="row.title"
            :more-title="row.moreTitle"
            :selected="row.selected"
            :selectkey="row.selectKey"
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
          <div class="empty-placeholder" v-if="companyList && companyList.length === 0">
            没有找到相关的公司
          </div>
          <template v-for="card in companyList">
            <div class="card-item">
              <company-card :company="card" @select="selectCompanyCard"/>
            </div>
          </template>

          <page-index v-if="companyList && companyList.length > 0"
                      :total="pagination.total"
                      :current="pagination.current"
                      @change="pageIndexChange"/>
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
  import CompanyCard from './Company/CompanyCard.vue'

  import { styleFns } from '@/mixins/helperFuncs.js'

  import * as Storage from '@/utils/storage.js'
  const SEARCH_HOTWORDS_TAG = 'SEARCH_HOTWORDS_COMPANYPAGE'
  let hotWords = Storage.Get(SEARCH_HOTWORDS_TAG) || ''

  import * as Img from '@/assets/index.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import * as MetaProxy from '@/api/proxy.js'

  import { ParsePagination } from '@/utils/helper-functions.js'

  const DEFAULT_PAGE_SIZE = 12

  export default {
    name: 'CompanyPage',
    mixins: [styleFns],
    data () {
      return {
        hotWords: hotWords.split(','),
        categoryMode: 'less',
        INDUSTRY: {
          title: '行业',
          list: [
            { title: '不限', key: '不限', },
            { title: '银行', key: 'bank', },
            { title: '证券', key: 'ticket', },
            { title: '保险', key: 'insurrance', },
            { title: '外汇', key: 'exchange', },
          ],
          // moreTitle: '全部行业',
          moreTitle: false,
          key: 'INDUSTRY',
          selectKey: 'title',
          selected: '不限',
        },
        COMPANY_TYPE: {
          title: '性质',
          list: [
            { title: '不限' },
            { title: '外资' },
            { title: '合资' },
            { title: '国企' },
            { title: '民营公司' },
            { title: '上市公司' },
            { title: '外企代表处' },
            { title: '政府机关' },
            { title: '事业单位' },
            { title: '非营利性机构' },
          ],
          moreTitle: false,
          key: 'COMPANY_TYPE',
          selectKey: 'title',
          selected: '不限',
        },

        selectedTypeItemIndex: 0,
        typeList: [
          { title: '推荐公司', key: 'promoted', },
          { title: '认证', key: 'auth', },
        ],

        Img,

        promotedCompanyList: [],
        searchKeyWord: '',
        companyList: [],
        pagination: {
          current: 1,
          total: 1,
          pagesize: DEFAULT_PAGE_SIZE,
        },

        shouldVerified: false,
      }
    },
    mounted () {
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

      // tags
      // const META_SCALING_TAG = 'COMPANY_SCALING'
      MetaProxy.Get('INDUSTRY', res => {
        this.INDUSTRY.list = [
          { title: '不限', key: '不限', },
          ...res
        ]
      })
      MetaProxy.Get('COMPANY_TYPE', res => {
        this.COMPANY_TYPE.list = [
          { title: '不限', key: '不限', },
          ...res
        ]
      })
      MetaProxy.Get('COMPANY_PROMOTED_LIST', res => {
        this.promotedCompanyList = res
      })
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
            that.pagination = ParsePagination(res.pagination)
          }
        )
      },
      getDataLongWay (params = {}) {
        const that = this
        const shouldVerified = this.shouldVerified || params.verified
        Req.Get(ReqUrl.CompanySubUrl.getList(),
          {
            pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
            pageIndex: params.pageIndex || 1,
            industry: this.INDUSTRY.selected === '不限' ? null : this.INDUSTRY.selected,
            type: this.COMPANY_TYPE.selected === '不限' ? null : this.COMPANY_TYPE.selected,
            verified: this.shouldVerified || null,
            frozen: false,

            ...params,
          },
          res => {
            let companyList = res.items
            if (shouldVerified) {
              that.companyList = companyList.filter(item => item.verified)
            } else {
              that.companyList = companyList
            }
            that.pagination = ParsePagination(res.pagination)
          }
        )
      },
      selectCompanyCard (data) {
        this.$router.push({
          name: 'CompanyInfo',
          params: {
            id: data.id
          }
        })
      },
      selectWord (word) {
        this.searchKeyWord = word
        this.searchWordChange(word)
      },
      selectTypeItem (typeIndex) {
        this.selectedTypeItemIndex = typeIndex

        if (this.selectedTypeItemIndex === 1) {
          // auth
          this.shouldVerified = true
          this.getDataLongWay({})
        } else {
          this.shouldVerified = false
          this.getDataLongWay({})
        }
      },
      switchCategoryMode (mode) {
        this.categoryMode = mode
      },
      selectorRowChange (selected, row) {
        if (row.selectKey) {
          row.selected = selected[row.selectKey]
        } else {
          row.selected = selected
        }
        this.getDataLongWay()
      },
      // 页面切换
      pageIndexChange (index) {
        this.pagination.current = index
        this.getDataLongWay({
          pageIndex: index
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

        this.getDataLongWay({
          keyword: word,
        })
      },
      selectCompany (item) {
        console.log(item)
        this.$router.push({
          name: 'CompanyInfo',
          params: {
            id: item.companyId
          }
        })
      },
    },
    components: {
      AdBanner,
      SearchBox,
      SelectorRow,
      InfoBannerItem,
      PageIndex,
      CompanyCard,
    }
  }
</script>

<style lang="less" scoped>
  @import "../less/common.less";

  .company-page {
    background-color: #F4F3F6;
    display: block;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .promoted-company {
    width: 100%;
    padding-top: 35px;
    padding-bottom: 30px;
    background-color: white;

    .title {
      display: block;
      text-align: center;

      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #819292;
      letter-spacing: 0;
      line-height: 16px;

      margin-bottom: 29px;
    }

    .row {
      text-align: center;

      .promoted-company-item {
        display: inline-block;
        height: 140px;
        width: 140px;
        border: 1px solid #eee;
        text-align: center;
        margin: 0 15.5px;
        // background-color: #eee;

        .icon();
      }
    }
  }

  .main-content {
    display: inline-block;
    width: @MIN-WIDTH;
    display: flex;
    flex-direction: column;
    text-align: left;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 0 auto;

    padding-top: 41px;

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
        width: @MIN-WIDTH;
        margin-right: 20px;
        overflow: hidden;

        .card-item {
          float: left;
          width: 300px;
          margin-right: 20px;
          margin-bottom: 20px;

          &:nth-of-type(4n+4) {
            margin-right: 0px;
          }
        }
        .empty-placeholder {
          background-color: white;
          text-align: center;
          padding: 30px;
          color: #819292;
        }
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
