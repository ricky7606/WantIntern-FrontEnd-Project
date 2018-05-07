<template lang="html">
  <div class="company-info-page">
    <div class="header">
      <div class="view-board flex-row row">
        <div class="left align-left">
          <company-info-box :company="company"/>
        </div>
        <div class="right">
          <div class="figure-col col">
            <div class="figure">
              {{company.activePosCnt || 0}}
            </div>
            <div class="figure-title">
              在招职位
            </div>
          </div>
          <div class="figure-col col">
            <div class="figure">
              {{company.rateCnt || 0}}
            </div>
            <div class="figure-title">
              评价
            </div>
          </div>
          <div class="figure-col col">
            <div class="figure">
              {{parseAverageRate(company.avgRate) || 0}}
            </div>
            <div class="figure-title">
              综合评分
            </div>
          </div>
        </div>

        <div class="tabbar row">
          <div class="tab-item col pointer-on"
            v-for="item in tabbarList"
            @click="selectTab(item)"
            :class="{selected: selectedTabber === item}">
            {{item}}
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="view-board">
        <div class="left">
          <div class="company-intro" v-if="selectedTabber === '公司介绍'">
            <company-intro :list="companyIntroList" />
          </div>

          <div class="company-promoted-list"
            v-if="selectedTabber === '在招职位'">

            <template v-for="card in positionList">
              <jobs-card :port="card" @select="selectJobsCard"/>
            </template>
            <div class="empty-placeholder" v-if="positionList.length === 0">
              暂无在招职位
            </div>

            <page-index v-if="positionList.length !== 0"
                        :total="positionListPagination.total"
                        :current="positionListPagination.current"
                        @change="pageIndexChange"/>
          </div>

          <div class="rank-item-list" v-if="selectedTabber === '公司评价'">
            <div class="empty-placeholder" v-if="rateList.length === 0">
              暂无评价
            </div>

            <template v-for="rate in rateList">
              <div class="rank-item-display">
                <rating-board-display :item-map="rate"/>
              </div>
            </template>

            <page-index v-if="rateList.length !== 0"
                        :total="rateListPagination.total"
                        :current="rateListPagination.current"
                        @change="rateListPageIndexChange"/>
          </div>
        </div>
        <div class="right">
          <div class="promoted-position-list align-left">
            <div class="promoted-position-list__title">
              推荐职位 <span class="loading" v-show="isLoadingPromoted">（正在加载...）</span>
            </div>
            <div class="list">
              <template v-for="card in promotedPositionList">
                <div class="border-bottom row">
                  <jobs-card-brief :port="card" @select="selectJobsCard"/>
                </div>
              </template>
            </div>
            <div class="btn-loadmore pointer-on"
              @click="loadMoreCompanyPositions(company.id)">
              {{'查看更多职位 >'}}
            </div>
          </div>

          <template v-for="bn in mediumBabberList">
            <info-banner-item :title="bn.title"
            extend="true"
            :img="bn.img"
            :url="bn.url"/>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapReqEdu } from './Position/Enum.js'
  import { styleFns } from '@/mixins/helperFuncs.js'
  import { mapRankState } from '@/api/enum.js'

  import Img from '@/assets/pc-stu/index.js'
  import * as AdImg from '@/assets/index.js'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import * as MetaProxy from '@/api/proxy.js'

  import JobsCardBrief from './Position/JobsCardBrief.vue'
  // import CompanyIntro from './Position/PositionIntro.vue'
  import CompanyIntro from './Company/CompanyIntro.vue'
  import InfoBannerItem from './Utils/InfoBannerItem.vue'
  import CompanyInfoBox from './Company/CompanyInfoBoxBiger.vue'
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import JobsCard from '@/components/Position/JobsCardForCompanyPage.vue'

  import RatingBoardDisplay from '@/components/Utils/RatingBoardDisplay.vue'

  import { ParsePagination } from '@/utils/helper-functions.js'

  export default {
    name: 'CompanyInfo',
    mixins: [styleFns],
    data () {
      return {
        mapReqEdu,
        Img,
        AdImg,
        port: {
          company: {}
        },
        companyId: '',
        isLoadingPromoted: true,
        promotedPositionList: [],

        tabbarList: [
          '公司介绍',
          '在招职位',
          '公司评价',
        ],
        selectedTabber: '公司介绍',

        positionList: [],
        positionListPagination: {
          current: 1,
          total: 1,
          pagesize: 12,
        },

        rateList: [],
        rateListPagination: {
          current: 1,
          total: 1,
          pagesize: 12,
        },
        mediumBabberList: [],
      }
    },
    mounted () {
      let id = this.$route.params.id
      if (!id) {
        this.$router.push({
          name: 'Home'
        })
      }

      this.loadPositionListOfCompany(id)
      this.loadPromotedPositionListOfCompany({}, id)
      this.companyId = id
      this.loadCompanyInfo(id, info => {
        this.port.company = info
      })
      this.loadRateList()

      window.scrollTo(0, 0)

      MetaProxy.Get('AD_BANNER_MEDIUM', res => {
        this.mediumBabberList = res
      })
    },
    beforeRouteUpdate (to, from, next) {
      let id = to.params.id
      if (!id) {
        this.$router.push({
          name: 'Home'
        })
      }

      this.port = {}
      this.loadPositionListOfCompany(id)
      this.loadPromotedPositionListOfCompany({}, id)
      this.loadCompanyInfo(id, info => {
        this.port.company = info
      })
    },
    methods: {
      loadCompanyInfo (companyId, next = n => n) {
        Req.Get(ReqUrl.CompanySubUrl.getItem(companyId), {}, res => {
          this.port = res
          if (next) {
            next(res)
          }
        })
      },
      loadPositionListOfCompany (companyId) {
        Req.Get(ReqUrl.CompanySubUrl.getPositionsOfCompany(companyId),
          {
            pageSize: 100,
            pageIndex: 1,
            active: true
          },
          res => {
            this.promotedPositionList = res.items
            this.isLoadingPromoted = false
          }
        )
      },
      loadPromotedPositionListOfCompany ({pageSize, pageIndex}, id) {
        let companyId = id || this.companyId
        const that = this
        Req.Get(ReqUrl.CompanySubUrl.getPositionsOfCompany(companyId),
          {
            pageSize: pageSize || 12,
            pageIndex: pageIndex || 1,
            active: true,
          },
          res => {
            that.positionList = res.items
            that.positionListPagination = ParsePagination(res.pagination)
          }
        )
      },
      loadRateList (companyId) {
        if (!companyId) companyId = this.companyId
        let url = ReqUrl.CompanySubUrl.getRateList(companyId)

        Req.Get(url, {
          pageSize: 12,
          pageIndex: 1,
        }, res => {
          this.rateList = res.items
          console.log(res)
        })
      },
      selectJobsCard (data) {
        this.$router.push({
          name: 'PositionInfo',
          params: {
            id: data.id
          }
        })
      },
      loadMoreCompanyPositions (id) {
        if (!id) return
        this.$router.push({
          name: 'Home.Detail',
          params: {
            detail: '搜索'
          }
        })
      },
      selectTab (tab) {
        this.selectedTabber = tab
      },
      // 页面切换
      pageIndexChange (index) {
        this.positionListPagination.current = index
        this.loadPromotedPositionListOfCompany({
          pageSize: this.positionListPagination.pagesize || 12,
          pageIndex: index
        })
      },
      rateListPageIndexChange (index) {
        this.rateListPagination.current = index
        this.loadRateList({
          pageSize: this.rateListPagination.pagesize || 12,
          pageIndex: index
        })
      },
      parseAverageRate (item) {
        if (!item) return item
        let counts = 0

        counts = counts + item['score1']
        counts = counts + item['score2']
        counts = counts + item['score3']
        counts = counts + item['score4']
        counts = counts + item['score5']

        return (counts / 5).toFixed(1)
      },
      parseRankList (data) {
        // let data = {
        //   score1: 2.5,
        //   score2: 2.5,
        //   score3: 2.5,
        //   score4: 2.5,
        //   score5: 2.5
        // }
        let titleList = mapRankState.titleList
        let keyList = [
          'score1',
          'score2',
          'score3',
          'score4',
          'score5',
        ]

        if (!data) return []

        let totalPointValue = 0
        return keyList.map((key, i) => {
          totalPointValue += data[key]

          this.totalPoint = totalPointValue / (i + 1)
          return {
            title: titleList[i],
            value: data[key]
          }
        })
      },
    },
    computed: {
      job () {
        return this.port || {}
      },
      company () {
        return this.port ? this.port.company || {} : {}
      },
      companyIntroList () {
        let company = this.company
        return [
          {
            title: '公司简介',
            content: company.intro || '未填写',
          },
          {
            title: '视频介绍',
            content: company.video || '未填写',
          },
          {
            title: '公司地址',
            content: company.addr || '未填写',
          },
        ]
      },
    },
    components: {
      JobsCardBrief,
      InfoBannerItem,
      CompanyIntro,
      CompanyInfoBox,
      PageIndex,
      JobsCard,
      RatingBoardDisplay,
    },
  }
</script>

<style lang="less" scoped>
  @import "../less/common.less";

  .company-info-page {
    .header {
      height: 251px;
      display: flex;
      width: 100%;
      background-color: #404A61;

      .view-board {
        width: @MIN-WIDTH;
        margin: 0 auto;
        position: relative;

        .left {
          padding-top: 40px;
          float: left;
        }

        .right {
          position: absolute;
          top: 57px;
          right: 0px;

          .figure-col {
            height: 50px;
            width: 158px;
            text-align: center;
            border-right: 1px solid #8C93A6;

            &:last-of-type {
              margin-right: -46.5px;
              border-right: 0px;
            }
            .figure {
              font-family: AvenirNext-Regular;
              font-size: 50px;
              color: #0DABF4;
              letter-spacing: 0;
              line-height: 50px;
              margin-bottom: 10px;
            }
            .figure-title {
              font-family: PingFangSC-Regular;
              font-size: 16px;
              color: #FFFFFF;
              letter-spacing: 0;
              line-height: 16px;
            }
          }
        }

        .tabbar {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: white;
          letter-spacing: 0;
          line-height: 16px;

          position: absolute;
          bottom: 14px;
          left: 0;

          .tab-item {
            @padding-left-length: 15px;
            padding: 0 @padding-left-length;

            &:first-child {
              padding-left: 0px;

              &:after {
                content: '|';
                position: relative;
                left: @padding-left-length;
                color: white;
              }
            }
            &:nth-child(2) {
              &:after {
                content: '|';
                position: relative;
                left: @padding-left-length;
                color: white;
              }
            }
            &.selected {
              color: #0DABF4;
            }
          }
        }
      }

    }

    .content {
      display: block;
      width: 100%;
      text-align: center;

      .view-board {
        width: @MIN-WIDTH;
        margin: 0 auto;
        position: relative;
        overflow: hidden;

        .left {
          text-align: left;
          width: 820px;
          float: left;

          .company-intro {
            padding-top: 65px;
          }
          .company-promoted-list {
            padding-top: 40px;
          }
          .rank-item-list {
            // background-color: white;
            padding-top: 20px;
            padding-right: 40px;

            .rank-item-display {
              // background-color: white;
              padding: 20px 0;

              border-bottom: 1px solid #EDEEF1;
            }
          }
        }
        .right {
          width: 440px;
          float: right;
          padding-top: 40px;
          padding-left: 30px;
          position: relative;
          overflow: hidden;

          &:before {
            display: inline-block;
            position: absolute;
            left: 0;
            top: 40px;
            content: " ";
            width: 1px;
            height: 432px;
            background-color: #E5E6EB;
          }

          .promoted-position-list {
            .promoted-position-list__title {
              font-family: PingFangSC-Regular;
              font-size: 24px;
              color: #454F66;
              letter-spacing: 0;
              line-height: 24px;
              margin-bottom: 10px;
            }

            .list {
              .border-bottom {
                display: block;
                border-bottom: 1px solid #E5E6EB;

              }
              div:last-of-type {
                border-bottom: 0px;
              }
            }
            .btn-loadmore {
              border: 1px solid #E5E6EB;
              width: 100%;
              height: 56px;
              line-height: 56px;
              text-align: center;
              cursor: pointer;

              margin-bottom: 30px;
            }
          }
        }
      }
    }
  }
</style>
