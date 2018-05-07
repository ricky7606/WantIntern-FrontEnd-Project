<template lang="html">
  <div class="position-info-page">
    <div class="header">
      <div class="view-board flex-row row">
        <div class="left flex-col">
          <div class="flex-row pub-time">
            发布于<span class="time">{{splitDate(job.createTime)}}</span>
          </div>
          <div class="flex-row flex-center flex-middle">
            <div class="job-title">{{job.title}}</div>
            <div class="job-salary">{{job.salary}}{{job.unit}}</div>
          </div>
          <div class="flex-row reqs">
            <span class="sep addr" v-if="company.area">{{company.area}}</span>
            <span class="sep degree">{{mapReqEdu[job.reqEdu]}}</span>
            <span class="sep major">{{job.reqMajor}}</span>
          </div>

          <div class="user-msg flex-col">
            <div class="user-icon" :style="imgBg(company.avatar || Img.imgPlaceholder)"></div>
            <div class="flex-row flex-center flex-middle">
              <div class="user-name">{{company.contact}}</div>
              <div class="user-info">{{company.contact}}·刚刚在线</div>
            </div>
          </div>
        </div>

        <div class="right flex-row">
          <div class="btn-favorate">收藏</div>
          <div class="btn-send">投递简历</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="view-board">
        <div class="left">
          <position-intro :list="positionIntroList"/>
        </div>
        <div class="right">
          <company-info-box :company="company"/>

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
            <div class="btn-loadmore" @click="lookupMore">
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
  import CompanyInfoBox from './Company/CompanyInfoBox.vue'
  import InfoBannerItem from './Utils/InfoBannerItem.vue'

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
        companyId: '',
        isLoadingPromoted: true,
        promotedPositionList: [],
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
          this.companyId = companyId
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
          this.companyId = companyId
          this.loadPositionListOfCompany(companyId)
        }
      })
    },
    methods: {
      splitDate,
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
          }, fail => {
            if (fail.response.data.status === 401) {
              this.$router.push({
                name: 'Login'
              })
            }
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
      lookupMore () {
        let companyId = this.companyId
        if (!companyId) return
        this.$router.push({
          name: 'CompanyInfo',
          params: {
            id: companyId
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
        let job = this.job
        return [
          {
            title: '实习时间',
            content: `${splitDate(job.startDate)} ~ ${splitDate(job.endDate)}`,
          },
          {
            title: '职位描述',
            content: job.intro || '未填写',
          },
          {
            title: '工作地址',
            content: job.addr || '未填写',
          },
        ]
      },
    },
    components: {
      JobsCardBrief,
      PositionIntro,
      CompanyInfoBox,
      InfoBannerItem,
    },
  }
  function splitDate (d) {
    if (!d) return ''
    return d.split(' ')[0]
  }
</script>

<style lang="less" scoped>
  @import "../less/common.less";

  .position-info-page {
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

          .pub-time {
            opacity: 0.7;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 16px;
            margin-bottom: 23px;
          }
          .job-title {
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 24px;

            margin-right: 20px;
            margin-bottom: 19px;
          }
          .job-salary {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 20px;

            background: #FF8000;
            border-radius: 17px;
            padding: 5px 19px;

            margin-bottom: 19px;
          }
          // 分类
          .flex-row.reqs {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 16px;

            span {
              padding: 0 8px;
              border-right: 1px solid currentColor;
              height: 1em;
              display: inline-block;

              &:first-of-type {
                padding-left: 0px;
              }
              &:last-of-type {
                border-right: 0px;
                padding-right: 0px;
              }
            }
          }
          .user-msg {
            // margin-top: 113px;
            position: absolute;
            top: 251px - 47px;

            .user-name {
              font-family: PingFangSC-Regular;
              font-size: 20px;
              color: #454F66;
              letter-spacing: 0;
              margin-right: 20px;
            }
            .user-info {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #A3A8B5;
              letter-spacing: 0;
              line-height: 20px;
            }
          }
          .user-icon {
            display: inline-block;
            width: 94px;
            height: 94px;
            border-radius: 50%;

            background-position: center;
            background-color: #eee;
            background-size: contain;
            background-repeat: no-repeat;
            margin-bottom: 30px;
          }
        }

        .right {
          position: absolute;
          top: 89px;
          right: 0px;

          .btn-favorate {
            text-align: center;
            width: 80px;
            height: 40px;
            line-height: 40px;
            background-color: white;

            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #0DABF4;
            letter-spacing: 0;
            margin-right: 20px;
          }
          .btn-send {
             background-color: #0DABF4;
             width: 120px;
             height: 40px;
             line-height: 40px;

            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
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
          width: 820px;
          text-align: left;
          margin-top: 191px;
          float: left;
          // display: inline-block;

          .part {
            display: block;
          }
          .part-title {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #454F66;
            letter-spacing: 0;
            position: relative;
            margin-bottom: 42px;

            &:after {
              display: inline-block;
              width: 20px;
              height: 2px;
              content: ' ';
              background-color: #0DABF4;
              position: absolute;
              left: 0;
              bottom: -20px;
            }
          }
          .part-content {
            margin-bottom: 60px;

            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #656565;
            letter-spacing: 0;
            line-height: 14px;
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

              margin-bottom: 30px;

              user-select: none;
            }
          }
        }
      }
    }
  }
</style>
