<template lang="html">
  <div class="mine-interns">
    <div class="page-result-title">
      我的实习
    </div>

    <div class="content">
      <div class="tabbar">
        <template v-for="tab in tabbarTitle">
          <div class="tabbar-item pointer-on"
            @click="changeTab(tab)"
            :class="{selected: selectedTab.title === tab.title}">
            {{tab.title}}
          </div>
        </template>
      </div>

      <div class="empty list-item" v-if="list.length === 0">
        暂无实习信息
      </div>

      <div class="list">
        <template v-for="item in list">
          <div class="list-item">
            <div class="row space-between">
              <div class="left col">
                <div class="title col">{{item.title}}</div>
                <div class="salary col">{{item.salary}}{{item.unit}}</div>
              </div>
              <div class="right col">
                <div class="state-text" :class="{gray: false}">{{translateStateText(item.state)}}</div>
              </div>
            </div>
            <div class="row">
              <span class="col degree">{{mapReqEdu[item.reqEdu]}}</span>
              <span class="col major">{{item.reqMajor}}</span>
            </div>
            <div class="row time">
              {{item.createTime}}
            </div>
          </div>
        </template>
      </div>
      <page-index :total="pagination.total"
      :current="pagination.current"
      @change="pageIndexChange"/>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { mapResumeState } from '@/api/enum.js'
  import {mapReqEdu} from '@/components/Position/Enum.js'

  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'
  import { ShareState } from '@/components/Mine/state.js'

  const DEFAULT_PAGE_SIZE = 8
  const INTERNS_TAG = 'INTERNS_TAG'
  const tabbarTitle = [
    { title: '已投递', tag: [mapResumeState.NEW, mapResumeState.WAIT_COMP_CONFIRM], },
    { title: '待面试', tag: [mapResumeState.CONFIRMED], },
    { title: '待入职', tag: [mapResumeState.OFFERED], },
    { title: '实习中', tag: [mapResumeState.WORKING], },
  ]
  export default {
    name: 'Interns',
    data () {
      return {
        pagination: {},
        list: [],
        selectedTab: {},
        tabbarTitle,
        mapReqEdu,
      }
    },
    mounted () {
      if (!ShareState[INTERNS_TAG]) ShareState[INTERNS_TAG] = tabbarTitle[0]
      this.changeTab(ShareState[INTERNS_TAG])
      this.loadData()

      let list = []
      this.list.forEach((item, index) => {
        let positionId = item.positionId
        getPositionItem(positionId, res => {
          list[index] = {
            ...item,
            ...res,
          }

          this.list = list
        })
      })
    },
    components: {
      PageIndex
    },
    methods: {
      loadData (type = '', pageIndex = 1) {
        if (!type) type = joinTag(this.selectedTab.tag)

        let url = ReqUrl.Resume.getResumesOfStudent(0)

        Req.Get(`${url}?${type}`, {
        // Req.Get(url, {
          pageSize: DEFAULT_PAGE_SIZE,
          pageIndex: pageIndex,
        }, res => {
          this.list = res.items
          this.pagination = ParsePagination(res.pagination)
        }, fail => {
          console.log(fail)
          if (fail.response.data.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
        })
      },
      // 页面切换
      pageIndexChange (index) {
        this.pagination.current = index
        this.loadData('', index)
      },
      changeTab (tab) {
        this.selectedTab = tab
        let type = joinTag(tab.tag)

        this.loadData(type)
      },
      // 转换简历状态
      translateStateText (text) {
        let dict = {
          NEW: '未处理',
          WAIT_STU_CONFIRM: '待确认',
          WAIT_COMP_CONFIRM: '待确认',
          CONFIRMED: '确认',
          OFFERED: '待确认',
          WORKING: '正在实习',
          ENDED: '评价',
          CANCELED: '取消',
        }
        return dict[text]
      },
    },
  }

  function joinTag (list) {
    return `state=${list.join('&state=')}`
  }
  function getPositionItem (positionId, cbfn) {
    let url = ReqUrl.PositionSubUrl.getItem(positionId)
    Req.Get(url, {}, res => {
      cbfn(res)
    }, fail => {
      console.log(fail)
    })
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .page-result-title {
    display: block;
    position: relative;

    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #454F66;
    letter-spacing: 0;
    padding-bottom: 20px;
    margin-bottom: 18px;

    &:after {
      content: ' ';
      display: inline-block;
      height: 2px;
      width: 22.5px;
      background-color: #0DABF4;

      position: absolute;
      left: 0;
      bottom: 0;
    }
  }

  .mine-interns {
    .tabbar {
      display: block;
      overflow: hidden;
      padding: 17px 21px;
      background-color: #FBFBFB;

      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #00002A;
      letter-spacing: 0;
      line-height: 16px;
      margin-bottom: 20px;

      .tabbar-item {
        float: left;
        padding: 0 20px;
        border-right: 1px solid #E5E6EB;

        &:first-of-type {
          padding-left: 0px;
        }
        &:last-of-type {
          border-right: none;
        }

        &.selected {
          color: #0DABF4;
        }
      }
    }

    .list-item {
      background-color: #FBFBFB;
      padding: 30px;
      margin-bottom: 10px;

      .title {
        font-family: PingFangSC-Regular;
        font-size: 22px;
        color: #454F66;
        letter-spacing: 0;
        line-height: 22px;
        margin-right: 26px;
      }
      .salary {
        font-family: PingFangSC-Regular;
        font-size: 22px;
        color: #0DABF4;
        letter-spacing: 0;
        line-height: 22px;
      }
      .state-text {
        font-family: PingFangSC-Regular;
        font-size: 22px;
        color: #0DABF4;
        letter-spacing: 0;
        line-height: 22px;

        &.gray {
          color: #8C93A6;
        }
      }
      .space-between {
        margin-bottom: 20px;
      }
      .major,
      .degree {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #454F66;
        letter-spacing: 0;
        line-height: 16px;
        padding: 0 5px;
      }
      .degree {
        border-right: 1px solid #BFBFBF;
        padding-left: 0px;
      }

      .time {
        margin-top: 20px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #BFBFBF;
        letter-spacing: 0;
        line-height: 16px;
      }
    }
  }
  .space-between {
    overflow: hidden;

    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
</style>
