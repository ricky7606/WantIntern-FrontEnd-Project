<template lang="html">
  <div class="page-matters">
    <header-bar :list="parsedHeader"
      :selected="headerBarSelected"
      @change="headerBarChange"/>

    <div class="content">
      <div class="view-board">
        <resume-list :list="groups[selectedState]"/>
      </div>
    </div>
    <page-index :total="pagination.total"
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

  import { ParsePagination } from '@/utils/helper-functions.js'

  const PAGE_SIZE = 10

  import { TabbarResume } from '@/components/Enterprise/Enum.js'

  const StateDict = {
    新增简历: 'NEW',
    待确认面试时间: 'WAIT_COMP_CONFIRM',
    面试结果通知: 'OFFERED',
    淘汰: 'ENDED',
    面试未通过: 'CANCELED',
  }
  const MapStateDict = {
    NEW: '新增简历',
    WAIT_STU_CONFIRM: '待确认面试时间',
    WAIT_COMP_CONFIRM: '待确认面试时间',
    CONFIRMED: '面试结果通知',
    OFFERED: '面试结果通知',
    WORKING: '面试结果通知',
    ENDED: '面试结果通知',
    CANCELED: '面试未通过',
  }
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
      }
    },
    mounted () {
      this.headerBarChange(this.TabbarResume[0])
      this.loadData()
      this.loadCounts()
    },
    computed: {
      groups () {
        let list = this.list
        let groups = {}

        console.log(MapStateDict)
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
        let countsDict = {}
        let counts = this.counts
        for (let k in counts) {
          let mapKey = mapDict[k]
          if (!countsDict[mapKey]) countsDict[mapKey] = 0
          countsDict[mapKey] = countsDict[mapKey] + counts[k]
        }
        let list = this.TabbarResume.map(item => {
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
      headerBarChange (item) {
        this.headerBarSelected = item
        console.log(item.title)
        this.selectedState = StateDict[item.title]
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
      loadCounts (cbfn = res => res) {
        const that = this
        let url = ReqUrl.Resume.getResumesCountsOfPosition(0)

        Req.Get(url, undefined, res => {
          that.counts = res
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
    },
    components: {
      HeaderBar,
      PageIndex,
      ResumeList,
    },
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
</style>
