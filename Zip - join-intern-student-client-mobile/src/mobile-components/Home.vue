<template>
  <div class="home">
    <ad-banner :list="hugeBabberList" v-show="categoryMode === 'less'"/>
    <div class="main-content">
      <div class="row flex-row align-left">
        <search-box @keyword="searchWordChange" v-model="searchKeyWord"/>
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
          <div class="empty-placeholder" v-if="positionList.length === 0">
            很抱歉，没有找到相关的职位。换一个关键词试试看吧~
          </div>
          <template v-for="card in positionList">
            <jobs-card :port="card" @select="selectJobsCard"/>
          </template>

          <page-index v-if="positionList.length === 0"
                      :total="positionListPagination.total"
                      :current="positionListPagination.current"
                      @change="pageIndexChange"/>
        </div>

        <!-- 右边栏 -->
        <div class="right-banner">
          <div class="company-card-list" v-if="isAuth === true">
            <template v-for="card in companyList">
              <div class="card-item">
                <company-card :company="card" @select="selectCompanyCard"/>
              </div>
            </template>
          </div>

          <div v-if="isAuth === false">
            <template v-for="banner in mediumBabberList">
              <info-banner-item :img="banner.img" :url="banner.url" :title="banner.title"/>
            </template>
          </div>
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
  import CompanyCard from './Company/CompanyCard.vue'

  import * as Storage from '@/utils/storage.js'
  const SEARCH_HOTWORDS_TAG = 'SEARCH_HOTWORDS'
  let hotWords = Storage.Get(SEARCH_HOTWORDS_TAG) || ''

  import * as Img from '@/assets/index.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import * as MetaProxy from '@/api/proxy.js'
  import { Account } from '@/api/account.js'

  import { ParsePagination } from '@/utils/helper-functions.js'
  // import * as CompanyEnum from '@/components/Account/CompanyEnum.js'

  export default {
    name: 'Home',
    data () {
      return {
        hotWords: hotWords.split(','),
        companyCategory: [
          '银行', '证券', '保险', '信托', '投行', '私募基金',
        ],
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
          { title: '推荐职位', key: 'promoted', },
          { title: '最新发布', key: 'new', },
          { title: '认证', key: 'verified', },
        ],
        shouldVerified: false,

        Img,

        searchKeyWord: '',
        positionList: [],
        positionListPagination: {
          current: 1,
          total: 1,
          pagesize: 12,
        },

        isAuth: false,
        companyList: [],
        hugeBabberList: [],
        mediumBabberList: [],
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
      that.getData(pageSize, pageIndex) // 第一次加载职位

      if (route.name === 'Home.Detail') {
        // 查看搜索
        this.switchCategoryMode('more')
      }

      Account.anounceList.push(res => {
        that.afterLogin(res)
        console.log('isAuth === true')
      })
      Account.ListenOnLogout(res => {
        this.isAuth = false
      })

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
      // 广告图
      MetaProxy.Get('AD_BANNER_HUGE', res => {
        this.hugeBabberList = res
      })
      MetaProxy.Get('AD_BANNER_MEDIUM', res => {
        this.mediumBabberList = res
      })
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
      getDataLongWay (params = {}) {
        const that = this
        // const shouldVerified = this.shouldVerified
        Req.Get(ReqUrl.PositionSubUrl.getList(),
          {
            pageSize: 12,
            pageIndex: 1,
            industry: this.INDUSTRY.selected === '不限' ? null : this.INDUSTRY.selected,
            type: this.COMPANY_TYPE.selected === '不限' ? null : this.COMPANY_TYPE.selected,
            keyword: this.searchKeyWord,
            verified: this.shouldVerified || undefined,

            ...params,
          },
          res => {
            let list = res.items
            // if (shouldVerified) {
            //   that.positionList = list.filter(item => item.verified)
            // } else {
            that.positionList = list
            // }
            let p = ParsePagination(res.pagination)
            that.positionListPagination = p
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
        let item = this.typeList[typeIndex]

        if (item.key === 'verified') {
          this.shouldVerified = true
        } else {
          this.shouldVerified = false
        }
        this.getDataLongWay()
      },
      switchCategoryMode (mode) {
        this.categoryMode = mode
      },
      selectorRowChange (selected, row) {
        if (row.key) {
          row.selected = selected[row.selectKey]
        } else {
          row.selected = selected
        }
        this.getDataLongWay()
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
        this.getDataLongWay({
          pageSize: this.positionListPagination.pagesize || 12,
          pageIndex: index
        })
      },
      selectCategory (word) {
        this.searchKeyWord = word
        this.searchWordChange(word)
      },
      searchWordChange (word) {
        this.searchKeyWord = word
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
      afterLogin (d) {
        const that = this
        let list = Account.GetCache('CompanyList')
        if (list) {
          this.companyList = list
          this.isAuth = true
        } else {
          Req.Get(ReqUrl.CompanySubUrl.getList(),
            {
              pageSize: 8,
              pageIndex: 1,
            },
            res => {
              let companyList = res.items
              Account.SetCache('CompanyList', companyList)
              that.companyList = companyList
              that.isAuth = true
            }
          )
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
      CompanyCard,
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
      .empty-placeholder {
        padding: 30px;
        background-color: white;
        text-align: center;
        color: #819292;
      }
      .right-banner {
        width: 300px;

        .company-card-list {
          .card-item {
            margin-bottom: 20px;
          }
        }
        .info-banner-item {
          width: 300px;
          height: 170px;
          display: block;
        }
      }
    }

  }
</style>
