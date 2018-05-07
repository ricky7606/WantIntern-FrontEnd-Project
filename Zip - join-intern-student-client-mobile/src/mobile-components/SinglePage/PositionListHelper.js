import { mapResumeState } from '@/api/enum.js'
import { Toast } from 'mint-ui'
import * as Req from '@/api/index.js'
import * as ReqUrl from '@/api/url.js'
import { ParsePagination } from '@/utils/helper-functions.js'

export const tabbarTitle = [
  // { title: '已投递', tag: [mapResumeState.NEW], },
  // { title: '待确认', tag: [mapResumeState.WAIT_STU_CONFIRM, mapResumeState.WAIT_COMP_CONFIRM], },
  // { title: '已投递', tag: [], },
  { title: '待确认', tag: [mapResumeState.NEW, mapResumeState.WAIT_STU_CONFIRM, mapResumeState.WAIT_COMP_CONFIRM], },
  { title: '待面试', tag: [mapResumeState.CONFIRMED], },
  { title: '待入职', tag: [mapResumeState.OFFERED], },
  { title: '实习中', tag: [mapResumeState.WORKING], },
  { title: '已结束', tag: [mapResumeState.COMMENTED, mapResumeState.ENDED], },
  { title: '未录用', tag: [mapResumeState.CANCELED], },
]

// methods
const DEFAULT_PAGE_SIZE = 20
export const PositionListMixin = {
  methods: {
    // 转换简历状态
    translateStateText (text, commentStu) {
      let dict = {
        NEW: ['未处理'],
        WAIT_STU_CONFIRM: ['确认面试时间'],
        WAIT_COMP_CONFIRM: ['待企业确认'],
        CONFIRMED: ['面试时间已确认'],
        OFFERED: ['立刻确认'],
        WORKING: ['正在实习'],
        ENDED: ['评价'],
        CANCELED: ['未录用'],
        COMMENTED: ['已评价'],
      }
      if (text === 'ENDED' && commentStu === '学生已评价') {
        return ['已评价']
      }
      return dict[text]
    },
    shouldGray (txt) {
      let dict = {
        '未处理': true,
        '确认面试时间': false,
        '待企业确认': true,
        '面试时间已确认': true,
        '立刻确认': false,
        '拒绝': false,
        '正在实习': true,
        '评价': false,
        '已评价': true,
        '未录用': true,
      }
      return dict[txt]
    },
    handleItem (tag, item) {
      let list = [
        '确认面试时间', '立刻确认', '评价'
      ]
      let id = item.id
      if (list.indexOf(tag) !== -1) {
        this.$router.push({
          name: 'PageResumeDetail',
          params: {
            id
          }
        })
      }
    },
    loadData (type = '', pageIndex = 1) {
      if (!type) {
        type = joinTag(this.selectedTab.tag)
      } else {
        type = joinTag(type)
      }
      this.isLoading = true
      let url = ReqUrl.Resume.getResumesOfStudent(0)

      Req.Get(`${url}?${type}`, {
        pageSize: DEFAULT_PAGE_SIZE,
        pageIndex: pageIndex,
      }, res => {
        this.list = res.items
        this.pagination = ParsePagination(res.pagination)
        this.isLoading = false

        if (this.pagination.total === 1) {
          this.allLoaded = true
        }
      }, fail => {
        console.log(fail)
        if (fail.response.data.status === 401) {
          Toast(fail.response.data.userMessage)
        }
      })
    },
    getPosition (d) {
      return d.position || {}
    },
    loadNextPage () {
      if (this.isLoading) return
      if (this.allLoaded) return

      this.isLoading = true
      let nextIndex = this.pagination.current + 1
      if (nextIndex >= this.pagination.total) {
        this.allLoaded = true
      }

      let url = ReqUrl.Resume.getResumesOfStudent(0)
      Req.Get(url, {
        pageSize: DEFAULT_PAGE_SIZE,
        pageIndex: nextIndex,
      }, res => {
        this.list = [...this.list, ...res.items]
        this.pagination = ParsePagination(res.pagination)
        this.isLoading = false
      }, fail => {
        if (fail.response.data.status === 401) {
          Toast(fail.response.data.userMessage)
          // alert(fail.response.data.userMessage)
          // this.$router.push({
          //   name: 'Login'
          // })
        }
      })
    },
  }
}

function joinTag (list) {
  return `state=${list.join('&state=')}`
}
