<template lang="html">
  <div class="mine-subscription">
    <div class="page-result-title">
      我的收藏
    </div>

    <div class="content">
      <div class="empty list-item" v-if="list.length === 0">
        暂无收藏
      </div>

      <div class="list">
        <template v-for="item in list">
          <div class="list-item">
            <div class="row space-between">
              <div class="left col">
                <!-- <div class="title col">{{item.title}}</div> -->
                <a class="col title hover-color" v-if="item.company"
                  target="_blank"
                  :href="`/#/PositionInfo/${item.id}`">
                  {{ item.title }}
                </a>
                <div class="salary col">{{item.stuSalary}}{{item.unit}}</div>
              </div>
              <div class="right col">
                <div class="state-text gray pointer-on" @click="unSubscript(item)">取消收藏</div>
              </div>
            </div>
            <div class="row space-between">
              <div class="left row">
                <a class="col company-name" v-if="item.company"
                  target="_blank"
                  :href="`/#/CompanyInfo/${item.company.id}`">
                  {{ item.company.name }} |
                </a>
                <span class="col degree">{{mapReqEdu[item.reqEdu]}}</span>
                <span class="col major">{{item.reqMajor}}</span>
              </div>
              <!-- <div class="company-info right" v-if="item && item.company">
                  {{ item.company.name }}
              </div> -->
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
  // import { mapResumeState } from '@/api/enum.js'
  import {mapReqEdu} from '@/components/Position/Enum.js'

  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'

  const DEFAULT_PAGE_SIZE = 8

  export default {
    name: 'Collect',
    data () {
      return {
        pagination: {},
        list: [],
        mapReqEdu,
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
        let url = ReqUrl.PositionSubUrl.getPositionCollects()

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
      unSubscript (item) {
        this.list = this.list.filter(i => i.id !== item.id)

        let url = ReqUrl.PositionSubUrl.deletePositionToCollect(item.id)

        Req.Delete(url, {}, res => {
          console.log(res)
        }, fail => {
          if (fail.response.data.status === 401) {
            this.$router.push({
              name: 'Login'
            })
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

  .mine-subscription {
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

        &:hover {
          color: #0DABF4;
        }
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

  .company-name {
    color: #454F66;

    &:hover {
      color: #0DABF4;
    }
  }
  .hover-color {
    &:hover {
      color: #0DABF4;
    }
  }
</style>
