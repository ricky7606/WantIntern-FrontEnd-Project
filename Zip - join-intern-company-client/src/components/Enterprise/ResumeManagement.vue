<template lang="html">
  <div class="page-matters">
    <header-bar :list="parsedHeader"
      :selected="headerBarSelected"
      @change="headerBarChange"/>

    <div class="content">
      <div class="view-board">
        <resume-board v-if="selectedState === 'NEW'"
          @reload="reloadPageData"
          :list="groups[selectedState]"/>
        <resume-list v-if="selectedState !== 'NEW'"
          @reload="reloadPageData"
          :list="groups[selectedState]"/>
      </div>
      <page-index v-if="selectedState !== 'NEW'"
      :total="pagination.total"
      :current="pagination.current"
      @change="pageIndexChange"/>
    </div>

    <div class="stu-info-board">

    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import HeaderBar from '@/components/Enterprise/HeaderBar.vue'
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import ResumeList from '@/components/Resume/ResumeList.vue'
  import ResumeBoard from '@/components/Resume/ResumeBoard.vue'

  import { ParsePagination } from '@/utils/helper-functions.js'

  const PAGE_SIZE = 10

  import { TabbarResume } from '@/components/Enterprise/Enum.js'

  const StateDict = {
    新增简历: 'NEW',
    待学生确认时间: 'WAIT_STU_CONFIRM',
    待确认面试时间: 'WAIT_COMP_CONFIRM',
    面试结果通知: 'CONFIRMED',
    已发送Offer: 'OFFERED',
    淘汰: 'CANCELED',
  }
  const MapStateDict = {
    NEW: '新增简历',
    WAIT_STU_CONFIRM: '待学生确认时间',
    WAIT_COMP_CONFIRM: '待确认面试时间',
    CONFIRMED: '面试结果通知',
    CANCELED: '淘汰',
    OFFERED: '已发送Offer',
  }

  const XSX_PAGE_RESUME_COUNT = 'XSX_PAGE_RESUME_COUNT'
  export default {
    name: 'Page-Resume-Management',
    data () {
      return {
        TabbarResume,
        headerBarSelected: {},
        list: [],
        selectedState: 'NEW',

        pagination: {
          current: 1,
          total: 1,
          pagesize: 10,
        },
        counts: {},
        lastCount: {},
      }
    },
    mounted () {
      let data = getDataOfKey(XSX_PAGE_RESUME_COUNT)
      this.lastCount = data || {}

      this.headerBarChange(this.TabbarResume[0])
      this.loadData()
      this.loadCounts()
    },
    computed: {
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
        return groups
      },
      parsedHeader () {
        let mapDict = MapStateDict

        let counts = this.counts
        let lastCount = this.lastCount

        // preparing
        function handleCountOfCols (dict, counts) {
          for (let k in counts) {
            let mapKey = mapDict[k]
            if (!dict[mapKey]) dict[mapKey] = 0
            dict[mapKey] = dict[mapKey] + counts[k]
          }
          return dict
        }
        let countsDict = handleCountOfCols({}, counts)
        let lastCountsDict = handleCountOfCols({}, lastCount)

        let list = this.TabbarResume.map(item => {
          let lastValue = lastCountsDict[item.title]
          let value = countsDict[item.title]
          return {
            ...item,
            value: value || 0,
            hasNew: value && lastValue && lastValue !== value
          }
        })
        return list
      },
    },
    methods: {
      headerBarChange (item) {
        this.headerBarSelected = item

        let state = StateDict[item.title]
        // 处理counts
        let tag = StateDict[item.title]
        if (this.counts[tag]) {
          this.lastCount[tag] = this.counts[tag]
        }

        if (Array.isArray(state)) {
          state = state.join('&state=')
        }
        this.selectedState = state
        this.loadDataOfState(this.selectedState)
      },
      loadData (pageIndex = 1, pageSize = PAGE_SIZE) {
        const that = this
        let url = ReqUrl.Resume.getResumesOfCompany(0)
        let data = {
          pageSize,
          pageIndex,
          state: 'NEW',
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
        const that = this
        let url = ReqUrl.Resume.getResumesOfCompany(0)
        let data = {
          pageSize,
          pageIndex,
        }
        let stateString = `?state=${state}`
        Req.Get(`${url}${stateString}`, data, res => {
          that.list = res.items
          that.pagination = ParsePagination(res.pagination)
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
          setDataOfKey(XSX_PAGE_RESUME_COUNT, res)

          cbfn(res)
        }, fail => {
          if (fail.response.data) {
            if (fail.response.data.userMessage) alert(fail.response.data.userMessage)
          }
        })
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
      ResumeBoard,
    },
  }

  function getDataOfKey (key) {
    try {
      let v = localStorage[key]
      return JSON.parse(v)
    } catch (err) {
      console.log(err)
    }
  }
  function setDataOfKey (key, value) {
    try {
      let v = JSON.stringify(value)
      localStorage[key] = v
    } catch (err) {
      console.log(err)
    }
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
  .stu-info-board {
    display: flex;
  }
</style>
