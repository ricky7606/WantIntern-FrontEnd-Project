import { ParsePagination } from '@/utils/helper-functions.js'

let TOUCHMOVE_COUNTER = 0
const TOUCHMOVE_WAITING_DURATION = 600
// pages 通用函数
export default {
  methods: {
    changePageTitle (txt = '') {
      document.title = txt || this.pageTitle
    },
    ParsePagination,

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
