<template lang="html">
  <div class="company-info-page">
    <div class="header">
      <div class="view-board flex-row row">
        <div class="left align-left">
          <company-info-box :company="company"/>
        </div>
        <div class="right">
          <div class="figure-col col" v-for="figure in figureList">
            <div class="figure">
              {{figure.content}}
            </div>
            <div class="figure-title">
              {{figure.title}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="view-board">
        <div class="left">
          <position-intro :list="positionIntroList"/>
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
            <div class="btn-loadmore">
              {{'查看更多职位 >'}}
            </div>
          </div>

          <info-banner-item :title="'下载App'"
            extend="true"
            :img="AdImg.imgAd1"
            :url="AdImg.imgAd1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapReqEdu } from './Position/Enum.js'
  import { styleFns } from '@/mixins/helperFuncs.js'

  import Img from '@/assets/pc-stu/index.js'
  import * as AdImg from '@/assets/index.js'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import JobsCardBrief from './Position/JobsCardBrief.vue'
  import PositionIntro from './Position/PositionIntro.vue'
  import InfoBannerItem from './Utils/InfoBannerItem.vue'
  import CompanyInfoBox from './Company/CompanyInfoBoxBiger.vue'

  export default {
    name: 'PositionInfo',
    mixins: [styleFns],
    data () {
      return {
        mapReqEdu,
        Img,
        AdImg,
        port: {
          company: {}
        },
        isLoadingPromoted: true,
        promotedPositionList: [],

        tabbarList: [
          '公司介绍',
          '在招职位',
          '公司评价',
        ],
        selectedTabber: '',
      }
    },
    mounted () {
      let id = this.$route.params.id
      if (!id) {
        this.$router.push({
          name: 'Home'
        })
      }

      this.loadPosition(id, res => {
        let companyId = res.company.id
        if (companyId) {
          this.loadPositionListOfCompany(companyId)
        }
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
      this.loadPosition(id, res => {
        next()
        let companyId = res.company.id
        if (companyId) {
          this.loadPositionListOfCompany(companyId)
        }
      })
    },
    methods: {
      loadPosition (positionId, next = n => n) {
        Req.Get(ReqUrl.PositionSubUrl.getItem(positionId), {}, res => {
          this.port = res
          if (next) {
            next(res)
          }
        })
      },
      loadPositionListOfCompany (companyId) {
        Req.Get(ReqUrl.CompanySubUrl.getPositionsOfCompany(companyId),
          {
            pageSize: 4,
            pageIndex: 1,
          },
          res => {
            this.promotedPositionList = res.items
            this.isLoadingPromoted = false
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
    },
    computed: {
      job () {
        return this.port || {}
      },
      company () {
        return this.port ? this.port.company || {} : {}
      },
      positionIntroList () {
        let company = this.company
        return [
          {
            title: '公司简介',
            content: company.intro || '未填写',
          },
          {
            title: '视频介绍',
            content: company.videoIntro || '未填写',
          },
          {
            title: '公司地址',
            content: company.addr || '未填写',
          },
        ]
      },
      figureList () {
        return [
          {
            title: '在招职位',
            content: 180,
          },
          {
            title: '评价',
            content: 74,
          },
          {
            title: '综合评分',
            content: 5,
          },
        ]
      },
    },
    components: {
      JobsCardBrief,
      InfoBannerItem,
      PositionIntro,
      CompanyInfoBox,
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
          padding-top: 65px;
          width: 820px;
          float: left;
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

              margin-bottom: 30px;
            }
          }
        }
      }
    }
  }
</style>
