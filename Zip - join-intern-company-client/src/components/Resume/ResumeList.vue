<template lang="html">
  <div class="resume-list">
    <template v-for="item in list">
      <div class="resume-item row space-between">
        <div class="left col">
          <div class="col name-card align-left">
            <div class="col icon" :style="imgBg(item.student.avatar)"></div>

            <div class="col align-left msg">
              <div class="row">
                <span class="col title">{{item.student.name}}</span>
                <span class="col">
                  应聘：<span class="position-name">{{item.position.title}}</span>
                </span>
              </div>
              <div class="row">
                <span>{{ mapReqGender[item.student.gender] }}</span> |
                <span>{{ item.student.area }}</span> |
                <span>{{ mapReqEdu[item.student.education] }}</span>
              </div>

              <div class="row" v-if="translateStateText(item) !== '实习中'">
                {{ parseDate(item.createTime) }} 投递
              </div>
              <div class="row" v-if="translateStateText(item) === '实习中'">
                {{ parseDate(item.offerTime) }} 开始实习
              </div>
            </div>
          </div>

          <div class="col status-box align-left">
            <!-- 评价 -->
            <div class="status-text row" :class="{gray: translateStateText(item) === '已评价(待学生评价)'}">
              <!-- {{ item.commentComp !== '企业已评价' ? mapStateText[item.state] : '已评价' }} -->
              {{ translateStateText(item) }}
            </div>
            <div class="interview-time" v-if="item.state === 'WAIT_STU_CONFIRM'">
              面试时间: {{ item.interviewTime }}
            </div>
            <div class="interview-time" v-if="item.state === 'WAIT_COMP_CONFIRM'">
              调整面试时间: {{ item.interviewTime }}
            </div>
            <div class="interview-comment" v-if="item.state === 'WAIT_COMP_CONFIRM'">
              备注信息: {{ item.commentStu }}
            </div>
            <div class="interview-time" v-if="item.state === 'OFFERED'">
              报到时间: {{ item.offerTime }}
            </div>
            <div class="interview-time" v-if="item.state === 'OFFERED'">
              报到地点: {{ item.offerPlace }}
            </div>
          </div>
        </div>

        <div class="right col">
          <div class="col btn plain pointer-on" @click="submitStuChangeTime(item)" v-if="item.state === 'WAIT_COMP_CONFIRM'">
            同意修改
          </div>
          <div class="col btn pointer-on" @click="notChangeTime(item)" v-if="item.state === 'WAIT_COMP_CONFIRM'">
            拒绝修改
          </div>

          <div class="col btn plain pointer-on" @click="interviewdAndCancel(item)" v-if="item.state === 'CONFIRMED'">
            淘汰
          </div>
          <div class="col btn pointer-on" @click="openOffer(item)" v-if="item.state === 'CONFIRMED'">
            发送offer
          </div>

          <div class="col btn plain pointer-on" @click="endWorking(item)" v-if="item.state === 'WORKING'">
            结束实习
          </div>

          <div class="col btn plain pointer-on" @click="rankingItem(item)" v-if="item.state === 'ENDED' && item.commentComp !== '企业已评价'">
            评价
          </div>
        </div>
      </div>
    </template>

    <div class="modal modal-interview-box xsx-form-theme" v-if="isModalBoxShow">
      <div class="content">
        <div class="title">拒绝面试时间更改</div>
        <div class="padding-left">
          <div class="row refuse-change-time-text">
            拒绝时间修改，将直接淘汰该学生。是否确认拒绝？
          </div>
          <!-- <div class="input-block" v-for="row in InterviewItemList">
            <div class="input-label">{{ row.title }}</div>
            <div class="input">
              <input v-model="row.value" :ref="row.key" type="text" v-if="row.type === 'String'"/>
              <date-time-selector v-model="row.value" :ref="row.key" type="datetime" v-if="row.type === 'DateTime'"/>
              <input v-model="row.value" :ref="row.key" type="text" @keyup="numberOnlyInput($event, row)" v-if="row.type === 'Number'"/>
            </div>
          </div> -->
        </div>
        <div class="btn" @click="submitInterviewBox">
          确定拒绝
        </div>
        <div style="margin-top: 20px;">
          <div class="btn plain" @click="closeInterviewBox">
            关闭
          </div>
        </div>
      </div>
    </div>

    <div class="modal modal-interview-box xsx-form-theme" v-if="isOfferModalBoxShow">
      <div class="content">
        <div class="title">Offer确认</div>
        <div class="padding-left">
          <div class="input-block" v-for="row in OfferItemList">
            <div class="input-label">{{ row.title }}</div>
            <div class="input">
              <input v-model="row.value" :ref="row.key" type="text" v-if="row.type === 'String'"/>
              <!-- <input v-model="row.value" :ref="row.key" type="datetime" v-if="row.type === 'DateTime'"/> -->
              <date-time-selector v-model="row.value" :ref="row.key" type="datetime" v-if="row.type === 'DateTime'"/>
              <input v-model="row.value" :ref="row.key" type="text" @keyup="numberOnlyInput($event, row)" v-if="row.type === 'Number'"/>
            </div>
          </div>
        </div>
        <div class="btn" @click="submitOfferBox">
          确定
        </div>
        <div style="margin-top: 20px;">
          <div class="btn plain" @click="closeOfferBox">
            关闭
          </div>
        </div>
      </div>
    </div>

    <div class="modal modal-interview-box xsx-form-theme" v-if="isRatingModalBoxShow">
      <div class="content">
        <div class="title">评价学生</div>
        <div class="box margin-bottom-30">
          <rating-board @update="ratingDataUpdate"/>
        </div>
        <div class="comment-box">
          <div class="label">评价信息：</div>
          <textarea v-model="ratingDataComments"></textarea>
        </div>
        <div class="btn" @click="submitRatingBox">
          确定
        </div>
        <div style="margin-top: 20px;">
          <div class="btn plain" @click="closeRatingBox">
            关闭
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapReqGender, mapReqEdu } from '@/components/Position/PositionEnum.js'
  import { InterviewItemListReview, OfferItemList } from '@/components/Resume/ResumeInformationRowList.js'
  import DateTimeSelector from '@/components/Utils/DateTimeSelector.vue'
  import RatingBoard from '@/components/Utils/RatingBoard.vue'
  import moment from 'moment'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  const mapStateText = {
    NEW: '',
    WAIT_STU_CONFIRM: '待学生确认时间',
    WAIT_COMP_CONFIRM: '',
    CONFIRMED: '已面试',
    OFFERED: '已发Offer',
    WORKING: '实习中',
    ENDED: '实习结束',
    CANCELED: '已淘汰',
    COMMENTED: '已评价',
  }
  export default {
    name: 'ResumeList',
    data () {
      return {
        mapReqGender,
        mapReqEdu,
        mapStateText,

        isModalBoxShow: false,
        InterviewItemList: InterviewItemListReview.map(item => {
          return {
            ...item,
            value: ''
          }
        }),
        isOfferModalBoxShow: false,
        OfferItemList: OfferItemList.map(item => {
          return {
            ...item,
            value: ''
          }
        }),
        // 评价
        isRatingModalBoxShow: false,
        selectedResume: {},
        ratingData: {},
        ratingDataComments: '',
      }
    },
    props: {
      list: {
        type: Array,
        default () {
          return []
        },
      },
    },
    components: {
      DateTimeSelector,
      RatingBoard,
    },
    methods: {
      translateStateText ({state, commentComp}) {
        if (state === 'ENDED' && commentComp === '企业已评价') {
          return '已评价(待学生评价)'
        }
        return this.mapStateText[state]
      },
      refresh (type) {
        if (type === 'interview') {
          this.InterviewItemList = InterviewItemListReview.map(item => {
            return {
              ...item,
              value: ''
            }
          })
        } else if (type === 'offer') {
          this.OfferItemList = OfferItemList.map(item => {
            return {
              ...item,
              value: ''
            }
          })
        }
      },
      imgBg (imgUrl) {
        return {
          backgroundImage: `url(${imgUrl})`
        }
      },
      parseDate (str) {
        if (!str) return str

        let list = str.split(' ')
        return list[0]
      },
      notChangeTime (item) {
        this.selectedResume = item
        this.openInterviewBox()
      },
      submitStuChangeTime (item) {
        let resumeId = item.id
        let url = ReqUrl.Resume.editResumeItem(resumeId)

        Req.Put(url, {
          state: 'CONFIRMED',
        }, res => {
          console.log(res)
          alert('已同意修改面试时间')
          this.tellParentToReload()
        })
      },
      interviewdAndCancel (item) {
        let resumeId = item.id
        let url = ReqUrl.Resume.editResumeItem(resumeId)
        Req.Put(url, {
          state: 'CANCELED'
        }, res => {
          console.log(res)
          alert('已淘汰')
          this.tellParentToReload()
        })
      },
      sendOffer (item) {
        let resumeId = item.id
        let url = ReqUrl.Resume.editResumeItem(resumeId)
        let msgItem = this.OfferItemList.reduce((dict, item) => {
          dict[item.key] = item.value
          return dict
        }, {})

        Req.Put(url, {
          state: 'OFFERED',
          ...msgItem,
        }, res => {
          alert('发送成功')
          this.closeOfferBox()
          this.tellParentToReload()
        })
      },
      openOffer (item) {
        this.selectedResume = item
        this.openOfferBox()
      },

      endWorking (item) {
        let resumeId = item.id
        let url = ReqUrl.Resume.editResumeItem(resumeId)

        Req.Put(url, {
          state: 'ENDED',
          // 增加结束时间
          endTime: formatDateString()
        }, res => {
          console.log(res)
          alert('已结束实习')
          this.tellParentToReload()
        })
      },

      rankingItem (item) {
        this.selectedResume = item
        this.ratingData = {}
        this.ratingDataComments = ''
        this.isRatingModalBoxShow = true
      },
      submitRatingBox () {
        let resumeId = this.selectedResume.id
        let result = this.ratingData
        let comment = this.ratingDataComments

        let editUrl = ReqUrl.Resume.editResumeItem(resumeId)
        Req.Put(editUrl, {
          commentComp: '企业已评价',
          state: this.selectedResume.commentStu === '学生已评价' ? 'COMMENTED' : 'ENDED'
        }, res => {
          this.tellParentToReload()
        })

        let url = ReqUrl.Resume.rankResumeItem(resumeId)
        Req.Post(url, {
          ...result,
          comment: comment || ''
        }, res => {
          alert('评价成功')

          this.closeRatingBox()
        }, err => {
          alert(err.response.data.userMessage)
          this.closeRatingBox()
        })
      },
      closeRatingBox () {
        this.isRatingModalBoxShow = false
      },
      ratingDataUpdate (d) {
        this.ratingData = d
      },

      tellParentToReload () {
        this.$emit('reload', null)
      },
      numberOnlyInput (ev, item) {
        let input = ev.target
        if (Array.isArray(input)) {
          input = input[0]
        }
        let value = input.value
        let m = value.match(/\d+/)

        if (m) {
          item.value = m[0].substr(0, 11)
        } else {
          item.value = ''
        }
      },
      submitInterviewBox () {
        // let list = this.InterviewItemList
        // let readyToSubmit = true
        // list.forEach(item => {
        //   if (!item.value) readyToSubmit = false
        // })
        // if (readyToSubmit === false) {
        //   alert('请填写完整面试通知，再保存。')
        //   return
        // }

        this.refuseChangeTime()
        // this.sendInterview(list)
        this.isModalBoxShow = false
      },
      refuseChangeTime () {
        // CANCELED
        let resumeId = this.selectedResume.id
        let url = ReqUrl.Resume.editResumeItem(resumeId)

        Req.Put(url, {
          state: 'CANCELED',
        }, res => {
          this.isModalBoxShow = false
          this.$emit('reload', null)
          this.selectedResume = {}

          alert('操作成功')
        })
      },
      sendInterview (data) {
        let resumeId = this.selectedResume.id
        let url = ReqUrl.Resume.editResumeItem(resumeId)
        let target = data || this.InterviewItemList
        let msgItem = target.reduce((dict, item) => {
          dict[item.key] = item.value
          return dict
        }, {})

        Req.Put(url, {
          state: 'WAIT_STU_CONFIRM',
          ...msgItem
        }, res => {
          this.isModalBoxShow = false
          this.$emit('reload', null)
          this.selectedResume = {}

          alert('操作成功：已将面试时间通知学生')
        })
      },
      openInterviewBox () {
        this.isModalBoxShow = true
      },
      closeInterviewBox () {
        this.isModalBoxShow = false
        this.refresh('interview')
      },

      submitOfferBox () {
        let list = this.OfferItemList
        let readyToSubmit = true
        list.forEach(item => {
          if (!item.value) readyToSubmit = false
        })
        if (readyToSubmit === false) {
          alert('请填写Offer通知，再保存。')
          return
        }

        this.sendOffer(this.selectedResume)
        this.isModalBoxShow = false
      },
      openOfferBox () {
        this.isOfferModalBoxShow = true
      },
      closeOfferBox () {
        this.isOfferModalBoxShow = false
        this.refresh('offer')
      },
    },
  }

  function formatDateString (d = new Date()) {
    return moment(d).format('YYYY-MM-DD')
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .resume-list {
    padding-top: 20px;
    padding-bottom: 20px;

    .resume-item {
      background-color: #FBFBFB;
      margin-bottom: 20px;
      padding: 20px;

      .icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 20px;
        vertical-align: top;

        .icon();
        // background-size: cover;
      }
      .msg {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #A3A8B5;
        letter-spacing: 0;
        line-height: 14px;

        .row {
          margin-bottom: 10px;

          &:last-child {
            margin-bottom: 0px;
          }
        }
        .title {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #656565;
          letter-spacing: 0;
          line-height: 16px;

          margin-right: 10px;
        }
        .position-name {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #00002A;
          letter-spacing: 0;
          line-height: 14px;
        }
      }
      .name-card {
        width: 400px;
        overflow: hidden;
      }
      .status-box {
        vertical-align: top;

        .status-text {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #0DABF4;
          letter-spacing: 0;
          line-height: 14px;

          &.gray {
            color: #A3A8B5;
          }
        }
        .interview-comment,
        .interview-time {
          font-size: 14px;
          margin-top: 8px;
        }
      }
      .right {
        .btn {
          background-color: #0DABF4;
          width: 120px;
          height: 40px;
          margin-top: 12px;

          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #FFFFFF;
          letter-spacing: 0;
          line-height: 40px;
        }
      }
    }
  }

  .modal-interview-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);

    .content {
      display: inline-block;
      background-color: white;
      padding: 40px 30px;
      width: 464px;

      margin: 0 auto;
      margin-top: 20vh;

      .title {
        margin-bottom: 34px;

        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #454F66;
        letter-spacing: 0;
      }
      .padding-left {

        .input-block {
          position: relative;
          padding-left: 5.2em;
        }
        .input-label {
          position: absolute;
          left: 0;
          top: 0.8em;
          text-align: right;
          width: 5.2em;
        }
        input {
          width: 100%;
        }
      }
    }
  }
  .refuse-change-time-text {
    margin-bottom: 40px;
  }
  .comment-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;

    margin-bottom: 10px;

    .label {
      font-size: 14px;
      color: #9B9B9B;
    }
  }
  .margin-bottom-30 {
    margin-bottom: 30px;
  }
</style>
