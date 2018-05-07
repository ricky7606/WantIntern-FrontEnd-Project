<template lang="html">
  <div class="mine-message xsx-form-theme">
    <div class="page-result-title">
      我的消息
    </div>
    <div class="content">
      <div class="empty" v-if="list.length === 0">
        暂无消息
      </div>
      <div class="list">
        <template v-for="item in list">
          <div class="list-item">
            <div class="row time">
              {{item.createTime}}
            </div>
            <div class="row text">
              {{item.msg}}

              <div class="col lookup pointer-on"
                @click="lookupPosition(item.refId, item)"
                v-if="shouldLookup(item) === 'POSITION'">
                查看职位信息>>
              </div>
              <div class="col lookup pointer-on"
                @click="lookupResume(item.refId, item)"
                v-if="shouldLookup(item) === 'RESUME'">
                马上确认时间>>
              </div>
              <div class="col lookup pointer-on"
                @click="lookupOffer(item.refId, item)"
                v-if="shouldLookup(item) === 'OFFER'">
                点击前往>>
              </div>
              <div class="col"
                v-if="item.type === 'SALARY'">
                (请到微信端，处理工资相关事宜。)
              </div>
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
  // import { mapPhotoType } from '@/api/enum.js'
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'

  const DEFAULT_PAGE_SIZE = 8

  export default {
    name: 'Message',
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
      lookupPosition (id) {
        if (!id) return
        this.$router.push({
          name: 'PositionInfo',
          params: {
            id
          }
        })
      },
      shouldLookup (item) {
        if (item.type !== 'RESUME') return false

        if (item.msg.indexOf('确认面试时间') !== -1) {
          return 'RESUME'
        } else if (item.msg.indexOf('确认入职') !== -1) {
          return 'RESUME'
        } else if (item.msg.indexOf('录取通知') !== -1) {
          return 'OFFER'
        } else {
          return ''
          // return item.type
        }
      },
      lookupResume (id) {
        if (!id) return
        this.$router.push({
          name: 'Interns-part',
          params: {
            part: '待确认'
          }
        })
      },
      lookupOffer (id) {
        if (!id) return
        this.$router.push({
          name: 'Interns-part',
          params: {
            part: '待入职'
          }
        })
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
    .list-item {
      background-color: #FBFBFB;
      padding: 20px;
      margin-bottom: 10px;

      .lookup {
        color: #0DABF4;
      }
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
        line-height: 2em;
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
