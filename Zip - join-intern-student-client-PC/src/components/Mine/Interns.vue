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
            <span class="num" :class="{hasNew: lastCountDict[tab.title] !== countDict[tab.title]}" v-if="tab.title !== '所有记录'">
              {{countDict && countDict[tab.title]}}
            </span>
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
                <div class="title col pointer-on" @click="gotoPosition(item.position)">{{item.position.title}}</div><!-- 职位名称 -->
                <div class="salary col">{{item.position.stuSalary}}{{item.position.unit}}</div><!-- 薪资 与 计算单位 -->
              </div>
              <div class="right col">
                <div class="state-text col pointer-on"
                  :class="{gray: shouldGray(txt)}"
                  @click="handleState(txt, item)"
                  v-for="txt in translateStateText(item.state, item.commentStu)">
                  {{ txt }}
                </div>
              </div>
            </div>
            <div class="row space-between">
              <div class="left col">
              	<!-- <a class="col major"
                  target="_blank"
                  :href="`/#/CompanyInfo/${item.position.company.id}`">
                  {{ item.company.name }} |
                </a> -->
                <span class="col major">{{item.position.company.name}} |</span><!-- 公司名回显 -->
                <span class="col degree">{{mapReqEdu[item.position.reqEdu]}}</span><!-- 职位学历回显 -->
                <!--  -->
              </div>
              <!-- 提示信息 -->
              <div class="right col interview-msg" v-show="showWorkingItem(item)">
              	实习补贴将于次月10-20日间发放
              </div>
              <!-- 面试信息 -->
              <div class="right col interview-msg" v-show="showInterviewMsg(item)">
                <span class="row">面试时间：{{ item.interviewTime }}</span>
                <span class="row">面试地点：{{ item.interviewPlace }}</span>
                <span class="row"> 联系人： {{ item.contact }}</span>
                <span class="row">联系电话：{{ item.contactPhone }}</span>
                <!-- 企业备注回显 -->
                <span class="row" v-if="item.remarkComp">备注信息：{{ item.remarkComp }}</span>
              </div>
              <!-- Offer信息 -->
              <div class="right col offer-msg" v-show="showOfferMsg(item)">
                <span class="row">报到时间：{{ item.offerTime }}</span>
                <span class="row">报到地点：{{ item.offerPlace }}</span>
                <span class="row">联系人： {{ item.contact }}</span>
                <span class="row">联系电话：{{ item.contactPhone }}</span>
                <!-- offer中暂无企业备注 -->
                <!-- <span class="row" v-if="item.remarkComp">备注信息：{{ item.remarkComp }}</span> -->
              </div>
            </div>
            <div class="row time" v-if="item.offerTime === null">
              {{item.createTime}} 发布<!-- 职位创建时间 -->
            </div>
            <div class="row time" v-if="item.offerTime !== null">
            	{{item.offerTime}} 开始实习
            </div>
          </div>
        </template>
      </div>
      <page-index :total="pagination.total"
        :current="pagination.current"
        @change="pageIndexChange"/>
    </div>

    <div class="modal-confirm-interview xsx-form-theme" v-show="isConfirmInterviewModalOpen">
      <!-- 确认面试时间 -->
      <div class="content">
        <div class="content-title row align-center">
          修改面试时间
        </div>
        <div class="content-inputs">
          <date-time-selector v-model="confirmInterviewTime"/>

          <div class="row">
          	<!-- 学生备注填写 -->
            备注信息： <textarea style="width: 100%;resize: none;" v-model="confirmInterviewComment"></textarea>
          </div>
        </div>

        <div class="content-footer">
          <div class="btn margin-bottom-10" @click="confirmChangeInterviewTime">
            确定
          </div>
          <div class="btn plain" @click="closeConfirmInterviewModal">
            关闭
          </div>
        </div>
      </div>
    </div>

    <div class="modal-confirm-rating xsx-form-theme" v-show="isConfirmRatingModalOpen">
      <!-- 学生评价企业 -->
      <div class="content">
        <div class="content-title row align-center">
          评价
        </div>
        <div class="header desc-text" v-if="ratingItem">
          <div class="line">请对{{ratingItem.position.company.name}}(公司)做出评价</div>
          <div class="line">(1分为最低分，5分为最高分)</div>
        </div>
        <div class="content-inputs">
          <rating-board @update="updateRankingItem"/>
        </div>

        <div class="content-footer">
          <div class="btn margin-bottom-10" @click="confirmRating">
            提交
          </div>
          <div class="btn plain" @click="closeRating">
            关闭
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { mapResumeState } from '@/api/enum.js'
  import { mapReqEdu } from '@/components/Position/Enum.js'

  import PageIndex from '@/components/Utils/PageIndex.vue'
  import DateTimeSelector from '@/components/Utils/DateTimeSelector.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'
  import { ShareState } from '@/components/Mine/state.js'

  import RatingBoard from '@/components/Utils/RatingBoard.vue'

  const DEFAULT_PAGE_SIZE = 8
  const INTERNS_TAG = 'INTERNS_TAG'
  const tabbarTitle = [
    { title: '已投递', tag: [mapResumeState.NEW], },
    { title: '待确认', tag: [mapResumeState.WAIT_STU_CONFIRM, mapResumeState.WAIT_COMP_CONFIRM], },
    { title: '待面试', tag: [mapResumeState.CONFIRMED], },
    { title: '待入职', tag: [mapResumeState.OFFERED], },
    { title: '实习中', tag: [mapResumeState.WORKING], },
    { title: '已结束', tag: [mapResumeState.COMMENTED, mapResumeState.ENDED], },
    { title: '未录用', tag: [mapResumeState.CANCELED], },
    { title: '所有记录', tag: [mapResumeState.HISTORY], },
  ]
  function parseTabbarTitleCount (dict, titleList = tabbarTitle) {
    let d = {}
    if (!dict) return d

    titleList.forEach(item => {
      let t = item.title
      let tag = item.tag
      d[t] = 0
      tag.forEach(i => {
        d[t] += dict[i]
      })
    })
    return d
  }

  export default {
    name: 'Interns',
    data () {
      return {
        pagination: {},
        list: [],
        selectedTab: {},
        tabbarTitle,
        mapReqEdu,

        confirmInterviewTime: '',
        confirmInterviewComment: '',
        isConfirmInterviewModalOpen: false,
        handlingItemId: {},

        isConfirmRatingModalOpen: false,
        rankingItem: null,
        ratingItemId: '',
        ratingItem: null,

        countDict: {},
        lastCountDict: {},
      }
    },
    mounted () {
      let part = this.$route.params.part
      if (!ShareState[INTERNS_TAG]) ShareState[INTERNS_TAG] = tabbarTitle[0]
      if (part) {
        let tab = tabbarTitle.find(item => item.title === part)
        if (tab) {
          ShareState[INTERNS_TAG] = tab
        }
      }
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

      this.getResumeCount()
      getLastResumeCount(
        dict => {
          this.lastCountDict = parseTabbarTitleCount(dict)
        }
      )
    },
    components: {
      PageIndex,
      DateTimeSelector,
      RatingBoard,
    },
    methods: {
      getResumeCount () {
        let url = ReqUrl.StudentSubUrl.resumeCount(0) // http://127.0.0.1:8080/backend/api/students/0/resumes/count
        Req.Get(
          url,
          null,
          res => {
            this.countDict = parseTabbarTitleCount(res)
            setLastResumeCount(res)
          }
        )
      },
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

        let title = tab.title
        this.lastCountDict[title] = this.countDict[title] // 设置相等
        this.getResumeCount() // 发送请求

        this.loadData(type) // 重新加载数据对象
      },
      // 转换简历状态
      translateStateText (text, commentStu) {
        let dict = {
          NEW: ['未处理'],
          WAIT_STU_CONFIRM: ['确认面试时间', '修改面试时间'],
          WAIT_COMP_CONFIRM: ['待确认'],
          CONFIRMED: ['面试时间已确认'],
          OFFERED: ['确认入职', '拒绝'],
          WORKING: ['正在实习'],
          ENDED: ['评价'],
          CANCELED: ['未录用'],
          COMMENTED: ['已评价'],
          HISTORY: ['已投递'],
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
          '待确认': true,
          '面试时间已确认': true,
          '确认入职': false,
          '拒绝': false,
          '正在实习': true,
          '评价': false,
          '已评价': true,
          '未录用': true,
        }
        return dict[txt]
      },
      handleState (txt, item) {
        let dict = {
          '确认面试时间': false,
          '修改面试时间': false,
          '确认入职': false,
          '拒绝': false,
          '评价': false,
          // '已评价': false,

          '未处理': true,
          '待确认': true,
          '面试时间已确认': false,
          '正在实习': true,
          '未录用': true,
        }
        // 不处理
        if (dict[txt]) return

        let nextState = {
          '确认面试时间': 'CONFIRMED',
          '修改面试时间': 'WAIT_COMP_CONFIRM',
          '确认入职': 'WORKING',
          '拒绝': 'CANCELED',
          '评价': 'RATE',
        }

        let nextStateText = nextState[txt]
        let resumeId = item.id
        this.handlingItemId = item.id
        let url = ReqUrl.Resume.editResumeItem(resumeId)

        // if (txt === '修改面试时间') {
        if (txt === '修改面试时间') {
          this.openConfirmInterviewModal()
          return
        }

        if (nextStateText && nextStateText !== 'RATE') {
          Req.Put(url, {
            state: nextStateText,
          }, res => {
            console.log(res)
            alert(`操作成功：已${txt}`)

            this.changeTab(this.selectedTab)
          })
        } else {
          // 评价
          if (txt === '评价') {
            this.showRating(item)
          }
        }
      },
      showWorkingItem (item) {
        let dict = {
          NEW: false,
          WAIT_STU_CONFIRM: false,
          WAIT_COMP_CONFIRM: false,
          CONFIRMED: false,
          OFFERED: false,
          WORKING: true,
          ENDED: false,
          CANCELED: false,
        }
        return dict[item.state]
      },
      showInterviewMsg (item) {
        let dict = {
          NEW: false,
          WAIT_STU_CONFIRM: true,
          WAIT_COMP_CONFIRM: true,
          CONFIRMED: true,
          OFFERED: false,
          WORKING: false,
          ENDED: false,
          CANCELED: false,
        }
        return dict[item.state]
      },
      showOfferMsg (item) {
        let dict = {
          NEW: false,
          WAIT_STU_CONFIRM: false,
          WAIT_COMP_CONFIRM: false,
          CONFIRMED: false,
          OFFERED: true,
          WORKING: false,
          ENDED: false,
          CANCELED: false,
        }
        return dict[item.state]
      },
      // 确定更改面试时间
      confirmChangeInterviewTime () {
        if (!this.confirmInterviewTime) {
          alert('请选择日期和时间，再保存。')
          return
        }

        let interviewTime = this.confirmInterviewTime
        let remarkStu = this.confirmInterviewComment // 学生备注填写  // let commentStu = this.confirmInterviewComment
        let url = ReqUrl.Resume.editResumeItem(this.handlingItemId)

        Req.Put(url, {
          state: 'WAIT_COMP_CONFIRM',
          interviewTime,
          // commentStu,
          remarkStu,
        }, res => {
          alert(`操作成功：已修改面试时间，请等待企业确认。`)
          this.closeConfirmInterviewModal()
          this.changeTab(this.selectedTab)
        })
      },
      openConfirmInterviewModal () {
        this.isConfirmInterviewModalOpen = true
      },
      closeConfirmInterviewModal () {
        this.isConfirmInterviewModalOpen = false
        // 清空上一次的数据缓存
        this.confirmInterviewTime = ''
        this.confirmInterviewComment = ''
      },
      gotoPosition (posItem) {
        let id = posItem.id
        if (!id) return

        this.$router.push({
          name: 'PositionInfo',
          params: {
            id
          }
        })
      },
      showRating (item) {
        this.ratingItemId = item.id
        this.ratingItem = item
        this.rankingItem = null
        if (!item.id) return

        this.isConfirmRatingModalOpen = true
      },
      updateRankingItem (d) {
        this.rankingItem = d
      },
      confirmRating () {
        if (!this.rankingItem) {
          alert('请先评价~')
          return
        }
        let resumeId = this.ratingItemId
        let result = this.rankingItem

        let editUrl = ReqUrl.Resume.editResumeItem(resumeId)

        Req.Put(editUrl, {
          commentStu: '学生已评价',
          state: this.ratingItem.commentComp === '企业已评价' ? 'COMMENTED' : 'ENDED',
        }, res => {
          this.changeTab(this.selectedTab)
        })

        let url = ReqUrl.Resume.rankResumeItem(resumeId)
        Req.Post(url, {
          ...result,
          comment: ''
        }, res => {
          alert('评价成功')
          this.changeTab(this.selectedTab)
          this.closeRating()
        }, err => {
          alert(err.response.data.userMessage)
          this.changeTab(this.selectedTab)
          this.closeRating()
        })
      },
      closeRating () {
        this.isConfirmRatingModalOpen = false
      },
    },
  }

  function joinTag (list) { // 拼接url参数
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

  function getLastResumeCount (cbfn = x => x) {
    let key = 'xsx_lastResumeCount'
    try {
      let v = localStorage.getItem(key)
      cbfn(JSON.parse(v))
    } catch (err) {
      console.log(err)
    }
  }
  function setLastResumeCount (value) {
    let key = 'xsx_lastResumeCount'
    let v = JSON.stringify(value)
    try {
      localStorage.setItem(key, v)
    } catch (err) {
      console.log(err)
    }
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
        padding: 0 15px;
        border-right: 1px solid #E5E6EB;

        .num {
          position: relative;
          display: inline-block;

          &.hasNew {
            // color: red;

            &:after {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              content: ' ';
              background-color: red;
              position: absolute;

              top: -3px;
              right: -0.5em;
            }
          }
        }
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
        user-select: none;
        margin-left: 15px;

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

      .interview-msg {
        font-size: 14px;
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
  .margin-bottom-10 {
    margin-bottom: 10px;
  }

  .modal-confirm-rating {
    .desc-text {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #819292;
      letter-spacing: 0;
      line-height: 21px;

      margin-bottom: 10px;
    }
    .content {
      min-width: 320px;
    }
    .content-inputs {
      padding: 15px;
      border: 1px solid #E5E6EB;
    }
  }
  .modal-confirm-rating,
  .modal-confirm-interview {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background-color: rgba(0,0,0,0.3);
    z-index: 9999;

    .content {
      margin: 0 auto;
      margin-top: 20vh;

      width: 500px;
      background-color: white;
      border-radius: 5px;
      padding: 40px;
      padding-bottom: 30px;

      .content-title {
        width: 100%;
        text-align: center;
        margin-bottom: 30px;
      }
      .content-inputs {

      }
      .content-footer {
        margin-top: 20px;
      }
      .content-inputs {
        .date-time-selector {
          .row {
            margin-bottom: 20px;
          }
        }
        .row {
          margin-bottom: 40px;
        }
      }
    }
  }
</style>
