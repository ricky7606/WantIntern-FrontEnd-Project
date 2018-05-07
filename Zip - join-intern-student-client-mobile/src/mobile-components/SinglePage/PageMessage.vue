<template lang="html">
  <div class="page-message"
    @touchend="listenForLoadMoreCallback"
    @touchmove="listenForLoadMore">
    <div class="content">
      <div class="empty" v-if="list.length === 0">
        暂无消息
      </div>
      <div class="list">
        <template v-for="item in list">
          <div class="list-item" :class="{read: item.read}">
            <div class="row time">
              {{item.createTime}}
            </div>
            <div class="row text">
              {{item.msg}}
            </div>
            <div class="row lookup pointer-on"
              @click="lookupPosition(item.id, item)"
              v-if="shouldLookup(item) === 'POSITION'">
              点击查看详情 >>
            </div>
            <div class="row lookup pointer-on"
              @click="lookupResume(item.id, item)"
              v-if="shouldLookup(item) === 'RESUME'">
              点击查看详情 >>
            </div>
            <div class="row lookup pointer-on"
              @click="lookupSalary(item.id, item)"
              v-if="shouldLookup(item) === 'SALARY'">
              点击立即确认 >>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="footer" @click="loadNextPage"
      ref="loadMoreBox"
      v-show="!isLoading && !allLoaded">
      <div class="load">点击加载更多</div>
    </div>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'
  // data
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { ParsePagination } from '@/utils/helper-functions.js'
  const DEFAULT_PAGE_SIZE = 8

  let TOUCHMOVE_COUNTER = 0
  const TOUCHMOVE_WAITING_DURATION = 600

  export default {
    name: 'PageMessage',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()
      this.loadData()
    },
    data () {
      return {
        pageTitle: '我的消息',

        pagination: {},
        list: [],
        isLoading: false,
        allLoaded: false,
      }
    },
    methods: {
      listenForLoadMoreCallback () {
        // 滚动可能会持续一段时间，用一个回调函数来处理
        clearTimeout(TOUCHMOVE_COUNTER)
        TOUCHMOVE_COUNTER = setTimeout(x => {
          this.listenForLoadMore()
        }, TOUCHMOVE_WAITING_DURATION)
      },
      listenForLoadMore () {
        let screenHeight = getScreenHeight()

        let elem = this.$refs['loadMoreBox']
        let pos = getElemPos(elem)
        if (!pos) return

        let elemTop = pos.top
        if (elemTop <= screenHeight) {
          // 触发加载事件
          this.loadNextPage()
        }
      },
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
            // alert(fail.response.data.userMessage)
            // this.$router.push({
            //   name: 'Login'
            // })
          }
        })
      },
      loadNextPage () {
        if (this.isLoading) return
        if (this.allLoaded) return

        this.isLoading = true
        let nextIndex = this.pagination.current + 1
        if (nextIndex >= this.pagination.total) {
          this.allLoaded = true
        }

        let url = ReqUrl.Notification.getList()
        Req.Get(url, {
          pageSize: DEFAULT_PAGE_SIZE,
          pageIndex: nextIndex,
        }, res => {
          this.list = [...this.list, ...res.items]
          this.pagination = ParsePagination(res.pagination)
          this.isLoading = false
        }, fail => {
          if (fail.response.data.status === 401) {
            // alert(fail.response.data.userMessage)
            // this.$router.push({
            //   name: 'Login'
            // })
          }
        })
      },
      lookupPosition (id) {
        if (!id) return
        this.$router.push({
          name: 'PageMessageDetail',
          params: {
            id,
            type: 'position',
          }
        })
      },
      shouldLookup (item) {
        if (item.type === 'SALARY') {
          if (item.msg.indexOf('已到账') === -1) {
            return 'SALARY'
          } else {
            return ''
          }
        }
        if (item.type !== 'RESUME') return item.type

        if (item.msg.indexOf('确认面试时间') !== -1) {
          return 'RESUME'
        } else if (item.msg.indexOf('确认入职') !== -1) {
          return 'RESUME'
        } else {
          return ''
        }
      },
      lookupResume (id) {
        if (!id) return
        this.$router.push({
          name: 'PageMessageDetail',
          params: {
            id,
            type: 'resume',
          }
        })
      },
      lookupSalary (id) {
        if (!id) return
        this.$router.push({
          name: 'PageSalaryDetail',
          params: {
            id,
          }
        })
      },
    }
  }

  function getElemPos (elem) {
    if (elem && elem.getBoundingClientRect) {
      return elem.getBoundingClientRect()
    }
  }
  function getScreenHeight () {
    return screen.height
  }
</script>

<style lang="less" scoped>
  @import '../../less/mobile.less';
  .page-message {
  }
  .list-item {
    padding: 15px;
    text-align: left;
    background-color: white;
    margin-bottom: 5px;

    &.read {
      .text {
        color: #7F7F7F;
      }
    }
    .time {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #7F7F7F;
      line-height: 26px/2;

      margin-bottom: 15px;
    }
    .text {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #2D2D2D;
      line-height: 44px/2;
    }
    .lookup {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #0DABF4;
      line-height: 44px/2;
    }
  }
</style>
