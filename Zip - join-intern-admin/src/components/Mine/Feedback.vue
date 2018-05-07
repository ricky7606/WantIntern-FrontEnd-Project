<template lang="html">
  <div class="mine-message xsx-form-theme">
    <div class="page-result-title">
      用户反馈
    </div>
    <div class="content">
      <div class="empty" v-if="list.length === 0">
        暂无反馈
      </div>
      <div class="list">
        <template v-for="item in list">
          <div class="list-item">
            <div class="row time">
              {{formatDate(item.createTime)}}
            </div>
            <div class="row text">
              {{item.content}}
            </div>
          </div>
        </template>
      </div>
      <page-index v-if="list.length > 0"
        :total="pagination.total"
        :current="pagination.current"
        @change="pageIndexChange"/>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  //
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'
  //
  import moment from 'moment'

  const DEFAULT_PAGE_SIZE = 8

  export default {
    name: 'Feedback',
    data () {
      return {
        pagination: {},
        list: [],
      }
    },
    mounted () {
      this.loadData()
    },
    components: {
      PageIndex
    },
    methods: {
      loadData (pageIndex = 1) {
        let url = ReqUrl.OtherSubUrl.getFeedbacksList()
        Req.Get(url, {
          pageSize: DEFAULT_PAGE_SIZE,
          pageIndex: pageIndex,
        }, res => {
          this.list = res.items
          this.pagination = ParsePagination(res.pagination)
        }, fail => {
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
        this.loadData(index)
      },
      formatDate (v) {
        let d = moment(v)
        return d.format('YYYY-MM-DD hh:mm:ss')
      },
    },
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
  .mine-message {
    text-align: left;
    padding: 30px;
    // padding-top: 40px;
    // padding-bottom: 40px;

    .list-item {
      background-color: #FBFBFB;
      padding: 20px;
      margin-bottom: 10px;

      .time {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #7F7F7F;
        line-height: 14px;
        margin-bottom: 14px;
      }
      .text {
        ont-family: PingFangSC-Regular;
        font-size: 16px;
        color: #2D2D2D;
        line-height: 16px;
      }
    }
  }
  // common
  .text-align-right {
    text-align: right;
  }
  .width-6em {
    display: inline-block;
    width: 5em;
    margin-right: 16px;
  }
  .margin-bottom-10 {
    margin-bottom: 10px;
  }
  .width-160px {
    width: 160px;
  }
  .width-100percent {
    width: 100%;
  }
  .height-100px {
    height: 100px;
  }
  .footer {
    display: block;
    text-align: center;
    margin-top: 20px;
  }
</style>
