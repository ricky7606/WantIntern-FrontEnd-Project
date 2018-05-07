<template lang="html">
  <div class="page-position-list">
    <div class="content">
      <div class="empty" v-if="list.length === 0">
        暂无相关职位
      </div>
      <div class="list">
        <template v-for="item in list">
          <div class="list-item">
            <div class="row flex-row flex-between title">
              <span class="title">
                {{getPosition(item).title}}
              </span>
              <span class="status">
                <span :class="{gray: shouldGray(tag)}" v-for="tag in translateStateText(item.state, item.commentStu)"
                  @click="handleItem(tag, item)">
                  {{ tag }}
                </span>
              </span>
            </div>
            <div class="row reqs">
              {{mapReqEdu[getPosition(item).reqEdu]}} | {{getPosition(item).reqMajor}}
            </div>
          </div>
        </template>
      </div>

      <div class="footer" @click="loadNextPage"
        ref="loadMoreBox"
        v-show="!isLoading && !allLoaded">
        <div class="load">点击加载更多</div>
      </div>
    </div>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'
  // data
  // import * as Req from '@/api/index.js'
  // import * as ReqUrl from '@/api/url.js'
  // import { ParsePagination } from '@/utils/helper-functions.js'
  import { mapReqEdu } from '@/components/Position/Enum.js'
  import { tabbarTitle, PositionListMixin } from './PositionListHelper.js'
  // import { Toast } from 'mint-ui'

  // const DEFAULT_PAGE_SIZE = 20
  export default {
    name: 'PagePositionList',
    mixins: [pageMixin, PositionListMixin],
    mounted () {
      this.changePageTitle()
      let id = 5

      this.loadData(tabbarTitle[id || 0].tag)
    },
    beforeRouteUpdate () {
      this.changePageTitle()
      let id = 5

      this.loadData(tabbarTitle[id || 0].tag)
    },
    data () {
      return {
        pageTitle: '未录用',

        pagination: {},
        isLoading: false,
        allLoaded: false,
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
      }
    },
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
    width: 100%;
    overflow: hidden;
    position: relative;

    &:after {
      position: absolute;
      bottom: 0px;
      left: 15px;
      width: 100%;
      border-bottom: 1px solid #EDEEF1;
      content: ' ';
    }

    .time {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #7F7F7F;
      line-height: 26px/2;

      margin-bottom: 15px;
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 34px/2;
      color: #656565;
      line-height: 34px/2;
      margin-bottom: 10px;
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

      .gray {
        font-family: PingFangSC-Regular;
        font-size: 34px/2;
        color: #BFBFBF;
        line-height: 34px/2;
      }
    }
    .gray {
      color: #BFBFBF;
    }

    .flex-between {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content:space-between;
    }
  }
</style>
