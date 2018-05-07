<template lang="html">
  <div class="page-subscribe" @touchstart="selectedRowId = ''">
    <div class="content">
      <div class="empty" v-if="list.length === 0">
        暂无收藏
      </div>
      <div class="list">
        <template v-for="item in list">
          <div class="list-item"
            :class="{'turn-left': selectedRowId === item.id}"
            @touchstart.stop="onTouchstart(item)"
            @touchend.stop="onTouchend(item)"
            @touchmove.stop="onTouchmove(item)"
            @click="showPositionDetail(item)">
            <div class="row flex-row flex-between margin-bottom-10">
              <span class="title">
                {{getPosition(item).title}}
              </span>
              <div class="row job-salary">
                {{getPosition(item).stuSalary}}{{getPosition(item).unit}}
              </div>
            </div>
            <div class="flex-row flex-between">
              <div class="row reqs">
                {{mapReqEdu[getPosition(item).reqEdu]}} | {{getPosition(item).reqMajor}}
              </div>
              <div class="row time">
                {{getPosition(item).createTime}}
              </div>
            </div>

            <div class="btn-right" @click.stop="unSubscript(item)">
              取消收藏
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  // import { mapResumeState } from '@/api/enum.js'
  import {mapReqEdu} from '@/components/Position/Enum.js'
  import pageMixin from '../Pages/pages-mixins.js'

  import { ParsePagination } from '@/utils/helper-functions.js'

  const DEFAULT_PAGE_SIZE = 8

  export default {
    name: 'PageSubscribe',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()
      this.loadData()
    },
    data () {
      return {
        pageTitle: '收藏',

        pagination: {},
        list: [],
        mapReqEdu,

        selectedRowId: '',
      }
    },
    methods: {
      getPosition (d) {
        return d
      },
      showPositionDetail (item) {
        let id = item.id
        this.$router.push({
          name: 'PagePositionDetail',
          params: {
            id
          }
        })
      },
      loadData (pageIndex = 1) {
        let url = ReqUrl.PositionSubUrl.getPositionCollects()

        Req.Get(url, {
          pageSize: DEFAULT_PAGE_SIZE,
          pageIndex: pageIndex,
        }, res => {
          this.list = res.items
          this.pagination = ParsePagination(res.pagination)
        }, fail => {
          if (fail.response.data.status === 401) {
            alert(fail.response.data.developerMessage)
            // this.$router.push({
            //   name: 'Login'
            // })
          }
        })
      },
      unSubscript (item) {
        this.list = this.list.filter(i => i.id !== item.id)

        let url = ReqUrl.PositionSubUrl.deletePositionToCollect(item.id)

        Req.Delete(url, {}, res => {
          console.log(res)
        }, fail => {
          if (fail.response.data.status === 401) {
            alert(fail.response.data.developerMessage)
            // this.$router.push({
            //   name: 'Login'
            // })
          }
        })
      },
      onTouchstart (item) {
        this.selectedRowId = item.id
      },
      onTouchmove (item) {

      },
      onTouchend (item) {
        // this.selectedRowId = ''
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../less/mobile.less';
  .page-subscribe {
    min-height: 100vh;
    padding-top: 10px;

    .content {
      background-color: white;
    }
  }
  .list {
    overflow: hidden;
  }
  .list-item {
    padding: 15px;
    text-align: left;
    background-color: white;
    width: 100%;
    position: relative;
    transition: all 0.4s ease-in-out;

    &.turn-left {
      transform: translate(-100px);
    }
    .btn-right {
      position: absolute;
      top: 0px;
      right: -100px;
      width: 100px;
      height: 100%;
      background-color: #FF8000;
      display: flex;
      align-items: center;
      justify-content: center;

      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #FFFFFF;
      line-height: 30px/2;
    }
    &:after {
      position: absolute;
      bottom: 0px;
      left: 15px;
      width: 100%;
      border-bottom: 1px solid #EDEEF1;
      content: ' ';
    }

    .time {
      font-family: AvenirNext-Regular;
      font-size: 28px/2;
      color: #9B9B9B;
      line-height: 28px/2;
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 34px/2;
      color: #656565;
      line-height: 34px/2;
    }
    .reqs {
      font-family: PingFangSC-Regular;
      font-size: 28px/2;
      color: #9B9B9B;
      line-height: 28px/2;
    }
    .lookup {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #0DABF4;
      line-height: 44px/2;
    }
    .status {
      font-family: PingFangSC-Regular;
      font-size: 34px/2;
      color: #0DABF4;
      line-height: 34px/2;
    }
    .job-salary {
      font-family: AvenirNext-Regular;
      font-size: 34px/2;
      color: #0DABF4;
      line-height: 34px/2;
    }

    .flex-between {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content:space-between;
    }
    .margin-bottom-10 {
      margin-bottom: 10px;
    }
  }
</style>
