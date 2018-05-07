<template lang="html">
  <div class="page-matters">
    <header-bar :list="parsedHeader"
      :selected="headerBarSelected"
      @change="headerBarChange"/>

    <div class="content">
      <div class="view-board" v-if="mode === 'resume'">
        <resume-board v-if="selectedState === 'NEW'"
          :loading="isLoadingData"
          @reload="reloadPageData"
          :list="groups[selectedState]"/>
        <resume-list v-if="selectedState !== 'NEW'"
          :loading="isLoadingData"
          @reload="reloadPageData"
          :list="groups[selectedState]"/>
      </div>
      <div class="view-board" v-if="mode === 'salary'">
        <div class="month-selector" v-show="headerBarSelected.title === '工资表'">
          <div class="title">时间</div>
          <option-selector :list="yearsList" :selected="searchYear" @change="y => searchYear = y.value"/>
          <div class="title">年</div>
          <option-selector :list="monthList" :selected="searchMonth" @change="m => searchMonth = m.value" />
          <div class="title">月</div>

          <div class="btn-search" @click="onSearchMonth">搜索</div>
        </div>
        <salary-list @reload="loadSalaryDataOfState"
          :loading="isLoadingData"
          :month="currentMonthString"
          :list="salaryList"/>
      </div>
    </div>
    <page-index v-if="selectedState !== 'NEW'"
                :total="pagination.total"
                :current="pagination.current"
                @change="pageIndexChange"/>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import HeaderBar from '@/components/Enterprise/HeaderBar.vue'
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import ResumeList from '@/components/Resume/ResumeList.vue'
  import SalaryList from '@/components/Resume/SalaryList.vue'
  import ResumeBoard from '@/components/Resume/ResumeBoard.vue'
  import RatingBoard from '@/components/Utils/RatingBoard.vue'
  import OptionSelector from '@/components/Account/FormOptionSelector.vue'

  import { TabbarInterns } from '@/components/Enterprise/Enum.js'
  import { ParsePagination } from '@/utils/helper-functions.js'
  // import moment from 'moment'

  const PAGE_SIZE = 10

  const MapStateDict = {
    WORKING: '在职学生',
    ENDED: '待评价学生',
    COMMENTED: '已评价学生',
  }
  const StateDict = {
    在职学生: 'WORKING',
    待评价学生: 'ENDED',
    全部实习生: 'WORKING&state=ENDED&state=COMMENTED',
    本月待确认工资: 'NEW_GENERATED&state=WAIT_STU_CONFIRM&state=WAIT_COMP_CONFIRM',
    工资表: 'NEW_GENERATED&state=WAIT_STU_CONFIRM&state=WAIT_COMP_CONFIRM&state=CONFIRMED&state=PAID'
  }
  const CombinedState = [
    {
      key: 'WORKING&state=ENDED&state=COMMENTED',
      list: [
        'WORKING',
        'ENDED',
        'COMMENTED',
      ]
    }
  ]

  export default {
    name: 'Page-Interns-Management',
    data () {
      return {
        TabbarInterns,
        headerBarSelected: {},
        list: [],
        salaryList: [],
        mode: 'resume',
        selectedState: 'WORKING',

        pagination: {
          current: 1,
          total: 1,
          pagesize: 10,
        },
        counts: {},
        countsReady: false,
        salaryCounts: {},

        currentMonthString: getLastYearMonth(),
        isLoadingData: false,

        searchYear: '',
        searchMonth: '',
      }
    },
    mounted () {
      this.headerBarChange(this.TabbarInterns[0])
      this.loadData()
      this.loadCounts()
    },
    computed: {
      yearsList () {
        let startyear = 2017
        let thisYear = (new Date()).getFullYear()
        let list = []

        while (startyear <= thisYear) {
          list.push(startyear++)
        }
        return list.map(y => {
          return {
            title: y,
            value: y
          }
        })
      },
      monthList () {
        let m = 1
        let list = []
        while (m <= 12) {
          list.push(m++)
        }
        return list.map(m => {
          let v = `0${m}`.substr(-2)
          return {
            title: v,
            value: v,
          }
        })
      },
      groups () {
        let list = this.list
        let groups = {}

        if (list) {
          list.forEach(item => {
            let state = item.state
            if (!groups[state]) {
              groups[state] = []
            }
            groups[state].push(item)
          })
        }
        CombinedState.forEach(item => {
          let key = item.key
          let list = []
          item.list.forEach(k => {
            if (groups[k]) {
              list = [...list, ...groups[k]]
            }
          })
          groups[key] = list
        })
        return groups
      },
      parsedHeader () {
        let mapDict = MapStateDict
        let countsDict = {}
        let counts = this.counts
        let salaryCounts = this.salaryCounts

        for (let k in counts) {
          let mapKey = mapDict[k]
          if (!countsDict[mapKey]) countsDict[mapKey] = 0
          countsDict[mapKey] = countsDict[mapKey] + counts[k]
        }
        countsDict['全部实习生'] = (countsDict['在职学生'] || 0) + (countsDict['待评价学生'] || 0) + (countsDict['已评价学生'] || 0)
        countsDict['本月待确认工资'] = countByKeys(salaryCounts, ['NEW_GENERATED', 'WAIT_COMP_CONFIRM', 'WAIT_COMP_CONFIRM'])
        // countsDict['工资表'] = countByKeys(salaryCounts, ['NEW_GENERATED', 'WAIT_COMP_CONFIRM', 'WAIT_COMP_CONFIRM', 'CONFIRMED', 'PAID'])
        countsDict['工资表'] = '￥'

        let list = this.TabbarInterns.map(item => {
          let value = countsDict[item.title]
          return {
            ...item,
            value: value || 0
          }
        })

        return list
      },
    },
    methods: {
      onSearchMonth () {
        let y = this.searchYear
        let m = this.searchMonth
        if (!y) {
          alert('请先选择一个年份')
          return
        }
        if (!m) {
          alert('请先选择一个月份')
          return
        }

        this.currentMonthString = `${y}-${m}`
        this.loadSalaryDataOfState(this.selectedState)
      },
      headerBarChange (item) {
        this.headerBarSelected = item

        let state = StateDict[item.title]
        if (Array.isArray(state)) {
          state = state.join('&state=')
        }
        this.selectedState = state
        if (item.title === '本月待确认工资' || item.title === '工资表') {
          this.loadSalaryDataOfState(this.selectedState)
          this.mode = 'salary'
        } else {
          this.loadDataOfState(this.selectedState)
          this.mode = 'resume'
        }
      },
      loadData (pageIndex = 1, pageSize = PAGE_SIZE) {
        const that = this
        let url = ReqUrl.Resume.getResumesOfCompany(0)
        let data = {
          pageSize,
          pageIndex,
          state: 'WORKING',
        }
        Req.Get(url, data, res => {
          that.list = res.items
          that.pagination = ParsePagination(res.pagination)
        }, fail => {
          if (fail.response.data) {
            alert(fail.response.data.userMessage)
          }
        })
      },
      loadDataOfState (state, pageIndex = 1, pageSize = PAGE_SIZE) {
        if (!state) {
          return
        }

        this.isLoadingData = true
        const that = this
        let url = ReqUrl.Resume.getResumesOfCompany(0)
        let data = {
          pageSize,
          pageIndex,
        }
        let stateString = `?state=${state}`
        Req.Get(`${url}${stateString}`, data, res => {
          let list = res.items
          if (state === 'ENDED') {
            console.log(res.items)
            let doneList = []
            let restList = []
            res.items.forEach(item => {
              if (item.commentComp === '企业已评价') {
                doneList.push(item)
              } else {
                restList.push(item)
              }
            })
            // 处理统计数据
            that.counts.ENDED = restList.length || 0
            list = [...restList, ...doneList]
          }
          that.list = list
          that.pagination = ParsePagination(res.pagination)
          this.isLoadingData = false
        }, fail => {
          if (fail.response.data) {
            if (fail.response.data.userMessage) alert(fail.response.data.userMessage)
          }
        })
      },
      loadDataOfStateWithCount () {
        let state = 'ENDED'
        let pageIndex = 1
        let pageSize = PAGE_SIZE
        this.isLoadingData = true
        const that = this
        let url = ReqUrl.Resume.getResumesOfCompany(0)
        let data = {
          pageSize,
          pageIndex,
        }

        let stateString = `?state=${state}`
        Req.Get(`${url}${stateString}`, data, res => {
          let list = res.items

          if (state === 'ENDED') {
            let doneList = []
            let restList = []
            list.forEach(item => {
              if (item.commentComp === '企业已评价') {
                doneList.push(item)
              } else {
                restList.push(item)
              }
            })
            // 处理统计数据
            that.counts.ENDED = restList.length || 0
            that.countsReady = true
          }
          this.isLoadingData = false
        }, fail => {
          if (fail.response.data) {
            if (fail.response.data.userMessage) alert(fail.response.data.userMessage)
          }
        })
      },
      // 获取salary列表
      loadSalaryDataOfState (state, pageIndex = 1, pageSize = PAGE_SIZE, month) {
        if (!state) return

        this.isLoadingData = true
        const that = this
        let url = ReqUrl.Company.getSalaryList(0)
        let data = {
          pageSize,
          pageIndex,
        }
        month = month || this.currentMonthString

        let stateString = `?state=${state}&month=${month}`
        Req.Get(`${url}${stateString}`, data, res => {
          that.salaryList = res.items
          that.pagination = ParsePagination(res.pagination)
          this.isLoadingData = false
        }, fail => {
          if (fail.response.data) {
            alert(fail.response.data.userMessage)
          }
        })
      },
      loadCounts (cbfn = res => res) {
        const that = this
        let url = ReqUrl.Resume.getResumesCountsOfPosition(0)

        Req.Get(url, undefined, res => {
          that.counts = res
          that.loadDataOfStateWithCount()
          cbfn(res)
        }, fail => {
          if (fail.response.data) {
            if (fail.response.data.userMessage) alert(fail.response.data.userMessage)
          }
        })
        let month = this.currentMonthString
        // 工资统计
        Req.Get(
          `${ReqUrl.Company.getSalaryListCount(0)}?month=${month}`,
          undefined,
          res => {
            that.salaryCounts = res
            cbfn(res)
          },
          fail => {
            if (fail.response.data) {
              if (fail.response.data.userMessage) alert(fail.response.data.userMessage)
            }
          }
        )
      },
      // 页面切换
      pageIndexChange (index) {
        this.pagination.current = index
      },
      reloadPageData () {
        this.loadCounts()
        this.loadDataOfState(this.selectedState)
      },
    },
    components: {
      HeaderBar,
      PageIndex,
      ResumeList,
      SalaryList,
      ResumeBoard,
      RatingBoard,
      OptionSelector,
    },
  }

  function countByKeys (dict, keys = []) {
    let total = 0
    keys.forEach(key => {
      total = (dict[key] || 0) + total
    })
    return total
  }
  // 获取年月格式标签
  function getLastYearMonth () {
    let d = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
    let year = d.getFullYear()
    let m = `0${d.getMonth() + 1}`.substr(-2)

    return `${year}-${m}`
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .view-board {
    width: @MIN-WIDTH;
    min-width: @MIN-WIDTH;
    margin: 0 auto;
  }
  .page-matters {
    .content {
      background-color: white;
    }
  }
  .month-selector {
    display: block;
    overflow: hidden;
    width: 100%;

    padding: 20px 0;
    border-bottom: 1px solid #E5E6EB;
    // margin-bottom: 20px;

    div {
      float: left;
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #819292;
      letter-spacing: 0;
      line-height: 28px;

      margin-left: 10px;
      margin-right: 10px;
    }
    .enum-selector {
      border: 1px solid #E5E6EB;
    }
    .btn-search {
      background: #0DABF4;

      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      width: 80px;
      height: 32px;
      line-height: 32px;

      margin-left: 20px;
      cursor: pointer;
    }
  }
</style>
