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
            <div class="job-salary">{{job.stuSalary}}{{job.unit}}</div>
          </div>
          <div class="flex-row reqs">
            <span class="sep addr" v-if="company.area">{{company.area}}</span>
            <span class="sep degree">{{mapReqEdu[job.reqEdu]}}</span>
            <span class="sep major">{{job.reqMajor}}</span>
          </div>

          <div class="user-msg flex-col">
            <div class="user-icon" :style="imgBg(company.avatar || Img.imgPlaceholder)"></div>
            <div class="flex-row flex-center flex-middle">
              <div class="user-name">{{company.contact && (company.contact).substr(0, 1)}}**</div>
              <div class="user-info">{{company.contactPos}}</div>
            </div>
          </div>
        </div>

        <div class="right flex-row">
          <div class="btn-favorate pointer-on" @click="addToCollect">
            {{ isJobCollected ? '已收藏' : '收藏'}}
          </div>
          <div class="btn-send pointer-on" @click="sendResume">
            {{
              (isResumeSended || jobSended) ? '已投递' : '投递简历'
            }}
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
            <div class="btn-loadmore pointer-on" @click="lookupMore">
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
  import { mapReqEdu, CollectPosition } from './Position/Enum.js'
  import { styleFns } from '@/mixins/helperFuncs.js'

  import Img from '@/assets/pc-stu/index.js'
  import * as AdImg from '@/assets/index.js'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import * as MetaProxy from '@/api/proxy.js'
  import { Account } from '@/api/account.js'

  import JobsCardBrief from './Position/JobsCardBrief.vue'
  import PositionIntro from './Position/PositionIntro.vue'
  import CompanyInfoBox from './Company/CompanyInfoBox.vue'
  import InfoBannerItem from './Utils/InfoBannerItem.vue'

  const EduLevel = [
    'COLLEGE',
    'BACHELOR',
    'MASTER',
    'PHD',
  ]
  function getCollectListAndSaveToLocal (pageIndex = 1, cbfn = res => res) {
    let url = ReqUrl.PositionSubUrl.getPositionCollects()
    let data = {
      pageSize: 200,
      pageIndex
    }

    Req.Get(url, data, res => {
      cbfn(res)
    }, fail => {
      console.log(fail)
    })
  }
  import {
    updateResumeItem,
    checkResumeItem,
    refreshResumeItem,
  } from '@/components/Position/resumeLocalTester.js'

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

        isSending: false,
        isCollecting: false,
        isJobCollected: false,

        jobSended: false,

        mediumBabberList: [],
        Account,
      }
    },
    mounted () {
      const that = this
      refreshResumeItem()

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

      if (CollectPosition.loaded === false) {
        getCollectListAndSaveToLocal(1, res => {
          CollectPosition.loaded = true
          let list = res.items
          list.forEach(item => {
            if (item.id) {
              CollectPosition.add(item.id)
            }
          })
          that.testJobCollected()
        })
      } else {
        that.testJobCollected()
      }
      MetaProxy.Get('AD_BANNER_MEDIUM', res => {
        this.mediumBabberList = res
      })
    },
    updated () {
      this.testJobCollected()
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
      isLogin () {
        let account = this.Account
        if (!account) return false

        let info = account.accountInfo
        if (!info || !info.id) return false

        return true
      },
      testJobCollected () {
        let id = this.job.id

        if (CollectPosition.find(id)) {
          this.isJobCollected = true
        } else {
          this.isJobCollected = false
        }
      },
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
          name: 'Home.Detail',
          params: {
            detail: '搜索'
          }
        })
        // this.$router.push({
        //   name: 'CompanyInfo.Detail',
        //   params: {
        //     id: companyId,
        //     tab: '在招职位'
        //   }
        // })
      },
      addToCollect () {
        const that = this

        if (!this.isLogin()) {
          window.location.hash = '/account/login'
          return
        }
        let positionId = this.job.id
        if (!positionId) return
        if (this.isJobCollected) {
          alert('已收藏过了')
          return
        }
        if (this.isCollecting) {
          alert('正在提交数据，请稍后再试。')
          return
        }

        this.isCollecting = true
        let url = ReqUrl.PositionSubUrl.addPositionToCollect(positionId)
        let data = {}

        Req.Post(url, data, res => {
          alert('收藏成功')
          CollectPosition.add(positionId)
          that.testJobCollected()

          this.isCollecting = false
        }, fail => {
          let data = fail.response.data
          alert(data.userMessage)
          this.isCollecting = false
          if (data.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
        })
      },
      sendResume () {
        let positionId = this.job.id
        if (!positionId) return

        if (!this.isLogin()) {
          window.location.hash = '/account/login'
          return
        }

        let reqEdu = this.job.reqEdu
        let stuEdu = Account.accountInfo && Account.accountInfo.education
        let stuEduIndex = EduLevel.indexOf(stuEdu)
        let reqEduIndex = EduLevel.indexOf(reqEdu)

        if (stuEduIndex < reqEduIndex) {
          alert('您的学历不符合要求，不能投递。')
          return
        }

        if (checkResumeItem(positionId)) {
          alert('您已投递过，请到【我的实习】中查看。')
          return
        }

        if (this.isSending) {
          alert('正在提交数据，请稍后再试。')
          return
        }

        this.isSending = true
        let url = ReqUrl.Resume.postResume()
        let data = {
          state: 'NEW',
          interviewTime: null,
          commentStu: '',
          commentComp: '',
          positionId,
        }

        Req.Post(url, data, res => {
          alert('投递成功')
          updateResumeItem(positionId)
          this.jobSended = true

          this.isSending = false
        }, fail => {
          let data = fail.response.data
          alert(data.userMessage)
          this.isSending = false
          if (data.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
        })
      },
      // checkResumeSended (id) {
      //   return checkResumeItem(id)
      // },
    },
    computed: {
      job () {
        return this.port || {}
      },
      isResumeSended () {
        let id = this.job.id
        return checkResumeItem(id)
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
              cursor: pointer;
              user-select: none;
            }
          }
        }
      }
    }
  }
</style>
