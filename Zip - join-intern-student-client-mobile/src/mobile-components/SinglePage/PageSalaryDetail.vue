<template lang="html">
  <div class="page-message-detail">
    <!-- SALARY -->
    <div class="content" v-if="salaryStatus === 'WAIT_STU_CONFIRM'">
      <div class="time flex-row">
        {{ msgContent.createTime }}
      </div>
      <div class="msg-content">
        {{ msgContent.msg }}
      </div>
      <div class="msg-content">
        {{ salaryContent.month }}月的工资详情：
        {{ parseSalaryDetail(salaryContent) }}
      </div>
    </div>
    <div class="desc-text" v-if="salaryStatus === 'WAIT_STU_CONFIRM'">
      注: 用户5天内可确认工资并提出异议，5天后未确认系统会自动确认。
    </div>

    <div class="btn-list" v-if="salaryStatus === 'WAIT_STU_CONFIRM'">
      <div class="btn btn-submit margin-bottom-15 enabled"
        @click="submitSalary">
        确认无误
      </div>
      <div class="btn btn-cancel" v-if="!isExcuseInputing"
        @click="showExcuse">
        提出异议
      </div>
    </div>

    <div class="excuse-input-box" v-if="isExcuseInputing">
      <textarea v-model="excuseContent" placeholder="请输入工资异议原因，并提交">

      </textarea>
    </div>

    <div class="btn-list" v-if="isExcuseInputing">
      <div class="btn btn-submit margin-bottom-15 enabled"
        @click="submitExcuse">
        提交异议
      </div>
    </div>

    <div class="status-text" v-show="showHint">
      该消息已处理，<span @click="showToastAndGoBack('为您跳转到个人中心')">点击返回“个人中心”</span>
    </div>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'
  // data
  import { ToggleCheck } from '@/assets/wechat-stu/index.js'
  import { Toast } from 'mint-ui'
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  let counter = 0
  // salary states
  // 'NEW_GENERATED',
  // 'WAIT_STU_CONFIRM',
  // 'WAIT_COMP_CONFIRM',
  // 'CONFIRMED',
  // 'PAID',
  export default {
    name: 'PageSalaryDetail',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()
      let id = this.$route.params.id
      this.loadItem(id, resumeId => {
        this.loadSalaryItem(resumeId)
      })
    },
    computed: {
      showHint () {
        let status = this.salaryStatus
        if (status === 'CONFIRMED' || status === 'PAID') {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      isCountByDay (dict) {
        return dict.resume.position.unit === '元/天'
      },
      loadItem (id, next = id => id) {
        let url = ReqUrl.Notification.getItem(id)
        Req.Get(
          url,
          {},
          res => {
            this.msgContent = res
            next(res.refId)
          },
          fail => {
            if (fail.response.data.status === 401) {
              Toast(fail.response.data.userMessage)
              setTimeout(x => {
                this.$router.replace({
                  name: 'PageAccount'
                })
              }, 1000)
            }
          }
        )
      },
      loadSalaryItem (id) {
        let url = ReqUrl.OtherSubUrl.getSalary(id)
        Req.Get(
          url,
          null,
          res => {
            console.log(res)
            this.salaryContent = res
            this.salaryStatus = res.state
          },
          fail => {
            if (fail.response.data.status === 401) {
              Toast(fail.response.data.userMessage)
              setTimeout(x => {
                this.$router.replace({
                  name: 'PageAccount'
                })
              }, 1000)
            }
          }
        )
      },
      parseSalaryDetail (item) {
        let resume = item.resume
        let countByDay = resume.unit === '元/天'

        let salary = resume.stuSalary
        let unit = resume.unit
        let days = item.workDays
        let total = item.stuValue
        if (countByDay) {
          return `本月工作${days}天，实习工资${salary}${unit}。工资总额为：每天${salary} * 工作天${days} = 实收（${total}）元，请及时确认。`
        } else {
          // 按月份算
          return `本月实习职位的工资为${salary}${unit}。工资总额为 ${total}（元） * 1（个月） = 实收（${total}）元，请及时确认。（工资中，公司可能已扣除部分考勤等相关金额）`
        }
      },
      submitSalary () {
        // 确认无误
        let item = this.salaryContent

        let dict = {
          state: 'CONFIRMED'
        }

        this.updateSalaryMsg(
          item,
          dict,
          res => {
            console.log(res)
            this.showToastAndGoBack('已确认')
          },
          fail => {
            if (fail.response.data.status === 401) {
              this.showToastAndGoBack(fail.response.data.userMessage)
            }
          }
        )
      },
      showExcuse () {
        this.isExcuseInputing = true
      },
      submitExcuse () {
        // 确认异议
        let item = this.salaryContent

        let dict = {
          state: 'WAIT_COMP_CONFIRM',
          stuComment: this.excuseContent || '',
        }

        this.updateSalaryMsg(
          item,
          dict,
          res => {
            console.log(res)
            this.showToastAndGoBack('您的异议已提交')
          },
          fail => {
            if (fail.response.data.status === 401) {
              this.showToastAndGoBack(fail.response.data.userMessage)
            }
          }
        )
      },
      // dict的格式 {
      //   workDays: 22,
      //   state: 'WAIT_STU_CONFIRM'
      // }
      updateSalaryMsg (item, dict, successCbfn = x => x) {
        let id = item.id
        let url = ReqUrl.OtherSubUrl.putSalary(id)

        Req.Put(
          url,
          {
            ...dict
          },
          res => {
            console.log(res)
            successCbfn(res)
          },
          fail => {
            console.log(fail)
          }
        )
      },
      showToastAndGoBack (txt) {
        Toast(txt)
        clearTimeout(counter)
        counter = setTimeout(x => {
          this.$router.replace({
            name: 'PageAccount'
          })
        }, 1000)
      }
    },
    data () {
      return {
        pageTitle: '工资确认',
        // assets
        prePageName: 'Message',
        ToggleCheck,

        msgContent: {},
        salaryContent: {},
        salaryStatus: '',

        changedInterviewDateTime: '',
        changedInterviewDesc: '',
        isToggleChangeDate: false,

        isSubmitReady: false,

        isExcuseInputing: false,
        excuseContent: '',
      }
    },
  }
</script>

<style lang="less" scoped>
  @import '../../less/mobile.less';
  .page-message-detail {
    .content {
      padding: 15px;
      padding-top: 20px;
      background-color: white;

      // margin-bottom: 10px;
    }

    .time {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #7F7F7F;
      line-height: 26px/2;
      text-align: left;
      width: 100%;
      margin-bottom: 10px;
    }
    .msg-content {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #151515;
      line-height: 50px/2;

      text-align: left;

      margin-bottom: 20px;
    }
    .resume {
      text-align: left;
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #151515;
      line-height: 50px/2;
    }
  }

  .board {
    background-color: white;
  }
  .change-interview-time {

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      padding: 0 10px;
      height: 49px;
      line-height: 49px;
      border-bottom: 1px solid #EDEEF1;

      .toggle {
        display: flex;
        align-items: center;
        justify-content: center;

        .btn {
          display: inline-block;

          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;

          width: 44px;
          height: 26.9px;
        }
      }
    }
    .interview-time-selector {
      padding: 25px 15px;

      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #819292;
      line-height: 30px/2;
    }
    .align-left {
      text-align: left;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
    .date-time-box {
      background: #FFFFFF;
      border: 1px solid #DADADA;
      border-radius: 4px/2;

      font-family: AvenirNext-Regular;
      font-size: 30px/2;
      // color: #DADADA;
      color: #0DABF4;
      line-height: 30px/2;

      display: inline-block;
      text-align: center;
      min-width: 12em;
      white-space: nowrap;
      height: 2em;
      line-height: 2em;

      // .desc-text {
      //   padding: 5px 10px;
      // }
    }
    .desc-text-input {
      background: #FFFFFF;
      border: 1px solid #DADADA;
      border-radius: 4px/2;

      font-family: AvenirNext-Regular;
      font-size: 30px/2;
      // color: #DADADA;
      color: #0DABF4;
      line-height: 30px/2;

      display: inline-block;
      text-align: center;
      min-width: 12em;
      white-space: nowrap;
      height: 2em;
      line-height: 2em;

    }
  }

  .toggle-desc {
    font-family: PingFangSC-Regular;
    font-size: 26px/2;
    color: #9B9B9B;
    line-height: 36px/2;

    margin-right: 5px;
  }
  .desc-text {
    font-family: PingFangSC-Regular;
    font-size: 26px/2;
    color: #9B9B9B;
    line-height: 36px/2;
    text-align: left;

    padding: 10px 15px 20px;
  }

  .btn-submit {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #FFFFFF;

    background-color: #BFBFBF;

    &.enabled {
      background-color: #0DABF4;
    }
  }
  .btn-cancel {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #0DABF4;
    background-color: #FFFFFF;
  }
  .margin-bottom-10 {
    margin-bottom: 10px;
  }
  .margin-bottom-15 {
    margin-bottom: 15px;
  }

  .status-text {
    padding: 20px 0;
  }

  textarea {
    padding: 15px;
    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #656565;
    line-height: 42px/2;
    width: 100%;
    height: 310px/2;

    &:-webkit-input-placeholder {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #C5C5C5;
      line-height: 42px/2;
    }
  }
  .excuse-input-box {
    width: 100%;
    margin-bottom: 15px;
  }
</style>
