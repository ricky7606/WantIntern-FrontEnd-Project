<template lang="html">
  <div class="resume-list">
    <template v-for="item in list">
      <div class="resume-item row space-between">
        <div class="left col">
          <div class="col name-card align-left">
            <div class="col icon" :style="imgBg(item.avatar)"></div>

            <div class="col align-left msg">
              <div class="row">
                <span class="col title">{{item.name}}</span>
                <!-- <span class="col">
                  应聘：<span class="position-name">{{item.position.title}}</span>
                </span> -->
              </div>
              <div class="row">
                <span>{{ mapReqGender[item.gender] }}</span> |
                <span>{{ item.area }}</span> |
                <span>{{ mapReqEdu[item.education] }}</span> |
                <span>{{item.school}}</span> |
                <span>{{item.major}}</span>
              </div>
              <!-- <div class="row">
                {{ parseDate(item.createTime) }} 投递
              </div> -->
            </div>
          </div>
        </div>

        <div class="right col">
          <div class="ranking" v-if="!item.rates || item.rates.length === 0">
            综合评分：暂无
          </div>
          <div class="ranking" v-if="item.rates && item.rates.length > 0">
            综合评分: {{ parseScores(item.rates) }} 分
          </div>
          <div class="btn toggle-detail" v-if="item.rates && item.rates.length > 0" @click="toggleRatesShow(item)">
            {{ item.ratesShow ? '关闭评价详情' : '查看评价详情'}}
          </div>
          <div class="comment-list" v-if="item.rates && item.rates.length > 0" v-show="item.ratesShow">
              <div class="comment-item" v-for="(item, index) in item.rates">
                <div class="index col">({{ index + 1 }})： </div>
                <div class="row">
                  工作协同：{{ item.score1 }}
                </div>
                <div class="row">
                  专业知识：{{ item.score2 }}
                </div>
                <div class="row">
                  职业素养：{{ item.score3 }}
                </div>
                <div class="row">
                  执行能力：{{ item.score4 }}
                </div>
                <div class="row">
                  学习能力：{{ item.score5 }}
                </div>

                <div class="comment-text">
                  评语：{{ item.comment || '（未填写）' }}
                </div>
              </div>
            </div>
        </div>
      </div>
    </template>

    <div class="modal modal-interview-box xsx-form-theme" v-if="isModalBoxShow">
      <div class="content">
        <div class="title">面试时间更改</div>
        <div class="padding-left">
          <div class="input-block" v-for="row in InterviewItemList">
            <div class="input-label">{{ row.title }}</div>
            <div class="input">
              <input v-model="row.value" :ref="row.key" type="text" v-if="row.type === 'String'"/>
              <!-- <input v-model="row.value" :ref="row.key" type="datetime" v-if="row.type === 'DateTime'"/> -->
              <date-time-selector v-model="row.value" :ref="row.key" type="datetime" v-if="row.type === 'DateTime'"/>
              <input v-model="row.value" :ref="row.key" type="text" @keyup="numberOnlyInput($event, row)" v-if="row.type === 'Number'"/>
            </div>
          </div>
        </div>
        <div class="btn" @click="submitInterviewBox">
          确定
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
  </div>
</template>

<script>
  import { mapReqGender, mapReqEdu } from '@/components/Position/PositionEnum.js'
  import { InterviewItemListReview, OfferItemList } from '@/components/Resume/ResumeInformationRowList.js'
  import DateTimeSelector from '@/components/Utils/DateTimeSelector.vue'
  import RatingRow from '@/components/Utils/RatingRow.vue'

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
        selectedResume: {},
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
      RatingRow,
    },
    methods: {
      toggleRatesShow (item) {
        item.ratesShow = !item.ratesShow
      },
      parseScores (list = []) {
        let counts = 0
        list.forEach(item => {
          let avg = (item.score1 + item.score2 + item.score3 + item.score4 + item.score5) / 5
          counts = counts + avg
        })
        return (counts / list.length).toFixed(1)
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
          console.log(res)
          alert('发送成功')
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
        }, res => {
          console.log(res)
          alert('已结束实习')
          this.tellParentToReload()
        })
      },

      rankingItem (item) {
        // let resumeId = item.id
        // let url = ReqUrl.Resume.editResumeItem(resumeId)

        // Req.Put(url, {
        //   state: 'ENDED',
        // }, res => {
        //   console.log(res)
        //   alert('已结束实习')
        //   this.tellParentToReload()
        // })
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
        let list = this.InterviewItemList
        let readyToSubmit = true
        list.forEach(item => {
          if (!item.value) readyToSubmit = false
        })
        if (readyToSubmit === false) {
          alert('请填写完整面试通知，再保存。')
          return
        }

        this.sendInterview(list)
        this.isModalBoxShow = false
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
          console.log(res)
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

        // this.sendInterview(list)
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
        white-space: nowrap;
        width: 500px;
        // overflow: hidden;
      }
      .status-box {
        vertical-align: top;

        .status-text {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #0DABF4;
          letter-spacing: 0;
          line-height: 14px;
        }
        .interview-comment,
        .interview-time {
          font-size: 14px;
          margin-top: 8px;
        }
      }
      .right {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #0DABF4;
        letter-spacing: 0;
        line-height: 14px;
        margin-top: 45px/2;
        text-align: right;

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

          display: inline-block;
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

  .comment-list {
    display: block;
    text-align: left;

    .comment-item {
      display: block;
      margin-bottom: 10px;
      margin-top: 20px;

      .row {
        display: inline-block;
        margin-bottom: 5px;
      }
      .comment-text {
        display: inline-block;
      }
    }
  }
</style>
