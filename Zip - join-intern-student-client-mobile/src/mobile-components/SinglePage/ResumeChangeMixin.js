import { Toast } from 'mint-ui'
import moment from 'moment'

import * as Req from '@/api/index.js'
import * as ReqUrl from '@/api/url.js'
import { ParsePagination } from '@/utils/helper-functions.js'

const DEFAULT_PAGE_SIZE = 8

export default {
  computed: {
    showHint () {
      let list = [
        'WAIT_COMP_CONFIRM', 'CONFIRMED', 'WORKING', 'CANCELED', 'COMMENTED'
      ]
      if (list.indexOf(this.resumeStatus) !== -1) {
        return true
      }
      return false
    }
  },
  methods: {
    loadData (pageIndex = 1) {
      let url = ReqUrl.Notification.getList()
      Req.Get(url, {
        pageSize: DEFAULT_PAGE_SIZE,
        pageIndex: pageIndex,
      }, res => {
        this.list = res.items
        this.pagination = ParsePagination(res.pagination)
      }, fail => {
        console.log(fail)
        if (fail.response.data.status === 401) {
          Toast(fail.response.data.userMessage)
          setTimeout(x => {
            this.$router.replace({
              name: 'PageAccount'
            })
          }, 1000)
        }
      })
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
    loadResumeItem (id) {
      let url = ReqUrl.Resume.getResumeItem(id)
      Req.Get(
        url,
        {},
        res => {
          this.resumeContent = res
          this.resumeStatus = res.state
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
    getPosition (item) {
      return item.position
    },
    selectDateTime () {
      this.$refs.dateTimePicker.open()
      this.isSubmitReady = true
    },
    parseDateTime (d) {
      let month = d.getMonth() + 1
      let date = d.getDate()
      let hour = `0${d.getHours()}`.substr(-2)
      let minute = `0${d.getMinutes()}`.substr(-2)

      return `${month}月 ${date}日 ${hour}:${minute}`
    },
    submit () {
      console.log('submit')
    },
    // 拒绝面试
    submitCancelInterview () {
      let url = ReqUrl.Resume.editResumeItem(this.resumeContent.id)

      Req.Put(url, {
        state: 'CANCELED',
      }, res => {
        Toast(`操作成功：已拒绝面试`)
        // Toast('账号绑定成功，为您跳转到主页')
        // this.closeConfirmInterviewModal()
        // this.changeTab(this.selectedTab)
        setTimeout(x => {
          this.$router.replace({
            name: this.prePageName || 'PageMessage'
          })
        }, 1000)
      })
    },
    // 修改面试
    submitChangeInterviewTime () {
      let interviewTime = this.changedInterviewDateTime
      let commentStu = this.changedInterviewDesc || ''
      let url = ReqUrl.Resume.editResumeItem(this.resumeContent.id)

      if (this.isToggleChangeDate) {
        // 修改日期
        Req.Put(url, {
          state: 'WAIT_COMP_CONFIRM',
          interviewTime: parseDateTimeString(interviewTime),
          commentStu,
        }, res => {
          Toast(`操作成功：已修改面试时间，请等待企业确认。`)
          // Toast('账号绑定成功，为您跳转到主页')
          // this.closeConfirmInterviewModal()
          // this.changeTab(this.selectedTab)
          setTimeout(x => {
            this.$router.replace({
              name: this.prePageName || 'PageMessage'
            })
          }, 1000)
        })
        return
      } else {
        Req.Put(url, {
          state: 'CONFIRMED',
        }, res => {
          Toast(`操作成功：已通知企业。接下来，好好准备面试吧~`)
          // Toast('账号绑定成功，为您跳转到主页')
          // this.closeConfirmInterviewModal()
          // this.changeTab(this.selectedTab)
          setTimeout(x => {
            this.$router.replace({
              name: this.prePageName || 'PageMessage'
            })
          }, 1000)
        })
        return
      }
      // console.log('submit')
    },
    // 拒绝入职
    submitCancelOffer () {
      let url = ReqUrl.Resume.editResumeItem(this.resumeContent.id)

      Req.Put(url, {
        state: 'CANCELED',
      }, res => {
        Toast(`操作成功：已拒绝Offer。`)
        // Toast('账号绑定成功，为您跳转到主页')
        // this.closeConfirmInterviewModal()
        // this.changeTab(this.selectedTab)
        setTimeout(x => {
          this.$router.replace({
            name: this.prePageName || 'PageMessage'
          })
        }, 1000)
      })
    },
    // 确认入职
    submitOffer () {
      let url = ReqUrl.Resume.editResumeItem(this.resumeContent.id)

      Req.Put(url, {
        state: 'WORKING',
      }, res => {
        Toast(`操作成功：已接受Offer。`)
        // Toast('账号绑定成功，为您跳转到主页')
        // this.closeConfirmInterviewModal()
        // this.changeTab(this.selectedTab)
        setTimeout(x => {
          this.$router.replace({
            name: this.prePageName || 'PageMessage'
          })
        }, 1000)
      })
    },
  }
}

function parseDateTimeString (str) {
  let d = moment(str)
  return d.format('YYYY-MM-DD hh:mm:ss')
}
