<template lang="html">
  <div class="page-position-detail">
    <div class="header margin-bottom-10">
      <jobs-card :port="job" :show-arrow="true" @select-company="selectCompany"/>
    </div>

    <div class="position-detail margin-bottom-10">
      <div class="detail-block">
        <div class="title">实习时间</div>
        <div class="time-text gray">{{ internDuration }}</div>
      </div>
      <div class="detail-block">
        <div class="title">职位描述</div>
        <div class="preline job-intro">{{ job.intro || '未填写' }}</div>
      </div>
    </div>
    <div class="position-detail margin-bottom-10">
      <div class="detail-block">
        <div class="title">工作地址</div>
        <div class="gray">{{ job.addr || '未填写' }}</div>
      </div>
    </div>
    <div class="position-detail margin-bottom-10">
      <div class="detail-block">
        <div class="title">职位发布者</div>
        <div class="flex-row flex-between contact-msg">
          <div class="flex-row flex-center">
            <div class="icon contact-icon" :style="company.avatar | imgbg"></div>
            <div class="name">{{ company.contact && company.contact.substr(0, 1) }}**</div>
          </div>
          <div class="flex-col gray">{{ company.contactPos }}</div>
        </div>
      </div>
    </div>

    <div class="footer flex-row">
      <div class="flex-row collect-btn" @click="addToCollect">
        <span class="icon-star" :style="(isJobCollected ? PositionDetail.starSelected : PositionDetail.star) | imgbg"></span>
        收藏
        <span class="sep-line-right"></span>
      </div>
      <div class="flex-row submit-btn" @click="sendResume">
        {{ jobSended ? '投递成功' : '投递简历' }}
      </div>
    </div>
  </div>
</template>

<script>
  import { CollectPosition } from '../Position/Enum.js'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { Account } from '@/api/account.js'
  import {
    updateResumeItem,
    checkResumeItem,
    refreshResumeItem,
  } from '@/components/Position/resumeLocalTester.js'
  import { PositionDetail } from '@/assets/wechat-stu/index.js'

  import pageMixin from './pages-mixins.js'
  import JobsCard from '@/mobile-components/Position/JobsCard.vue'

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

  export default {
    name: 'PagePositionDetail',
    mixins: [pageMixin],
    mounted () {
      const that = this
      this.changePageTitle()
      refreshResumeItem()

      let id = this.$route.params.id
      if (!id) {
        this.$router.replace({
          name: 'PageMain'
        })
      }

      this.loadPosition(id, res => {
        let companyId = res.company.id
        if (companyId) {
          this.companyId = companyId
          // this.loadPositionListOfCompany(companyId)
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

      if (!Account.accountInfo || !Account.accountInfo.accountId) {
        Req.Get(ReqUrl.StudentSubUrl.getItem(), '',
          res => {
            Account.changeAndAnnounce(res)
            this.dataCopy = res
          }
        )
      }
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
          // this.loadPositionListOfCompany(companyId)
        }
      })
    },
    data () {
      return {
        pageTitle: '职位详情',
        port: {
          company: {}
        },
        companyId: '',
        promotedPositionList: [],

        isSending: false,
        isCollecting: false,
        isJobCollected: false,

        jobSended: false,

        mediumBabberList: [],
        Account,
        PositionDetail,
      }
    },
    methods: {
      testJobCollected () {
        let id = this.job.id

        if (CollectPosition.find(id)) {
          this.isJobCollected = true
        } else {
          this.isJobCollected = false
        }
      },
      selectCompany (id) {
        this.$router.push({
          name: 'PageCompanyDetail',
          params: {
            id
          }
        })
      },
      loadPosition (positionId, next = n => n) {
        Req.Get(ReqUrl.PositionSubUrl.getItem(positionId), {}, res => {
          this.port = res
          if (next) {
            next(res)
          }
        })
      },
      addToCollect () {
        const that = this

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

        let reqEdu = this.job.reqEdu
        let stuEdu = Account.accountInfo && Account.accountInfo.education
        let stuEduIndex = EduLevel.indexOf(stuEdu)
        let reqEduIndex = EduLevel.indexOf(reqEdu)

        if (!this.isResumeFilled()) {
          alert('您尚未填写完整简历，请至个人中心填写简历后尝试投递。')
          return
        }

        if (stuEduIndex < reqEduIndex) {
          alert('你的学历不符合要求，不能投递。')
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
      isResumeFilled () {
        let account = this.Account.accountInfo
        let isFilled = true
        let list = [
          'education',
          'phone',
          'name',
          'school',
          'grade',
          'email'
        ]

        list.forEach(key => {
          if (!account[key]) isFilled = false
        })
        return isFilled
      }
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
      internDuration () {
        let job = this.job
        return `${splitDate(job.startDate).replace(/-/g, '.')}-${splitDate(job.endDate).replace(/-/g, '.')}`
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
      JobsCard,
    }
  }

  function splitDate (d) {
    if (!d) return ''
    return d.split(' ')[0]
  }
</script>

<style lang="less" scoped>
  @import '../../less/common.less';
  @import '../../less/mobile.less';

  .page-position-detail {
    padding-bottom: 44px;

    .header {
      background-color: white;
      padding: 15px;
    }

    .position-detail {
      background-color: white;
      padding: 15px;
      padding-top: 13px;
      padding-left: 28px;
      text-align: left;

      .detail-block {
        margin-bottom: 9px;
      }
      .title {
        font-family: PingFangSC-Regular;
        font-size: 30px/2;
        color: #333333;
        line-height: 30px/2;
        margin-bottom: 15px;

        position: relative;

        &:before {
          content: '·';
          position: absolute;
          left: -1em;
        }
      }

      .time-text {
        margin-bottom: 24px;
      }
      .gray {
        font-family: PingFangSC-Regular;
        font-size: 28px/2;
        color: #9B9B9B;
        line-height: 28px/2;
      }

      .job-intro {
        font-family: PingFangSC-Regular;
        font-size: 28px/2;
        color: #333333;
        white-space: pre-line;
        line-height: 28px;
      }

      .contact-msg {
        display: flex;
        align-items: center;

        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .contact-icon {
        display: inline-block;
        border-radius: 50%;
        margin-right: 10px;

        .sqr(30px);
        .icon();
      }
    }

  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0px;
    width: 100%;
    height: 44px;
    background-color: #0DABF4;
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: white;
    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #FFFFFF;
    line-height: 30px/2;

    .icon-star {
      display: inline-block;
      margin-right: 8px;

      .sqr(15px);
      .icon();
    }
    .collect-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 118px;

      position: relative;
      letter-spacing: 0.5em;
    }
    .submit-btn {
      display: flex;
      flex-grow: 1;
      text-align: center;
      justify-content: center;
      letter-spacing: 1px;
    }
    .sep-line-right {
      display: inline-block;
      height: 13.5px;
      border-right: 1px solid white;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
</style>
