<template lang="html">
  <div class="page-position-management">
    <div class="center-content">
      <div class="header space-between">
        <div class="left">
          已发布职位
        </div>
        <div class="right pointer-on" @click="createNewPosition">
          + 发布职位
        </div>
      </div>

      <div class="content">
        <template v-for="pos in list">
          <div class="position-item space-between">
            <div class="col left">
              <div class="row title">
                <div class="title col">{{pos.title}}</div>
                <div class="salary col">{{pos.salary}}{{pos.unit}}</div>
              </div>
              <div class="row sub">
                <div class="col time">{{ parseOutStr(pos.createTime) }} 发布</div>
                <div class="col requirments">
                  <span>{{pos.reqMajor}}</span>
                  <span>{{mapReqEdu[pos.reqEdu]}}</span>
                  <span>{{mapGrade[pos.reqGrade]}}</span>
                </div>
                <div class="col">
                  已投递 {{pos.candidateCnt}}
                </div>
                <div class="col interns-counts">
                  实习中 {{pos.internCnt}}
                </div>
              </div>
            </div>

            <div class="col right">
              <div class="col btn btn-gray pointer-on"
                v-if="pos.active"
                @click="setInactivePosition(pos)">
                下线
              </div>
              <div class="col btn btn-color pointer-on"
                v-if="!pos.active"
                @click="setActivePosition(pos)">
                上线
              </div>

              <div class="col btn btn-color pointer-on" @click="editPosition(pos)">
                编辑
              </div>
            </div>
          </div>
        </template>

        <page-index :total="pagination.total"
                    :current="pagination.current"
                    @change="pageIndexChange"/>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import * as MetaProxy from '@/api/proxy.js'

  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'
  import { mapReqEdu } from '@/components/Position/PositionEnum.js'
  import { Account } from '@/api/account.js'

  const DEFAULT_PAGE_SIZE = 10

  export default {
    name: 'PositionManagement',
    mounted () {
      this.loadData()
      MetaProxy.Get(
        'POSITION_TYPE',
        res => {
          if (res) {
            this.positionTypeList = res
          }
        }
      )
    },
    data () {
      return {
        mapReqEdu,
        mapGrade: {
          1: '一年级',
          2: '二年级',
          3: '三年级',
          4: '四年级',
          // 5: '五年级',
        },
        positionTypeList: [],

        list: [],
        pagination: {},
      }
    },
    components: {
      PageIndex,
    },
    methods: {
      loadData (pageIndex = 1, pageSize = DEFAULT_PAGE_SIZE) {
        Req.Get(ReqUrl.Position.getListOfCompany(0),
          {
            pageSize,
            pageIndex
          },
          res => {
            this.list = res.items
            this.pagination = ParsePagination(res.pagination)
          }, fail => {
            if (fail.response.data && fail.response.data.status === 401) {
              this.$router.push({
                name: 'Login'
              })
            }
          }
        )
      },
      // 页面切换
      pageIndexChange (index) {
        this.pagination.current = index
        this.loadData(index)
      },
      parseOutStr (str) {
        let list = str.split(' ')
        if (list[0]) {
          return list[0].replace(/-/g, '.')
        } else {
          return str
        }
      },
      setInactivePosition (item) {
        let url = ReqUrl.Position.editItem(item.id)
        let data = {
          active: false
        }
        Req.Put(url, data, res => {
          alert('成功：设置下线成功')
          item.active = false
        })
      },
      setActivePosition (item) {
        let url = ReqUrl.Position.editItem(item.id)
        let data = {
          active: true
        }
        Req.Put(url, data, res => {
          alert('成功：设置上线成功')
          item.active = true
        })
      },
      editPosition (item) {
        let id = item.id
        if (id) {
          this.$router.push({
            name: 'position-editor',
            params: {
              id,
            }
          })
        } else {
          return
        }
      },
      createNewPosition () {
        if (Account.checkInfoFull()) {
          this.editPosition({
            id: 'new'
          })
        } else {
          alert('您的账号信息不完整，请填写完整后，再发布职位。')
          this.$router.push({
            path: '/mine/information'
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .page-position-management {
    padding-top: 30px;
    background-color: white;

    .center-content {
      width: @MIN-WIDTH;
      min-width: @MIN-WIDTH;
      margin: 0 auto;
    }

    .header {
      overflow: hidden;
      width: 100%;
      margin-bottom: 20px;

      .left {
        float: left;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #819292;
        letter-spacing: 0;
        line-height: 16px;
      }
      .right {
        float: right;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #0DABF4;
        letter-spacing: 0;
        line-height: 16px;
      }
    }

    .content {
      .position-item {
        background-color: #FBFBFB;
        padding: 20px;
        margin-bottom: 20px;

        .left {
          text-align: left;
        }
        .title {
          font-family: PingFangSC-Regular;
          font-size: 20px;
          color: #819292;
          letter-spacing: 0;
        }
        .salary {
          font-family: PingFangSC-Regular;
          font-size: 20px;
          color: #0DABF4;
          letter-spacing: 0;
        }
        .row.sub {
          margin-top: 16px;

          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #656565;
          letter-spacing: 0;
          line-height: 14px;

          .col {
            margin-right: 50px;
          }
          .interns-counts {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #0DABF4;
            letter-spacing: 0;
            line-height: 14px;
          }
        }

        .right {
          .btn {
            width: 80px;
            height: 40px;
            line-height: 40px;
            border: 1px solid #819292;

            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #819292;
            letter-spacing: 0;
            margin-left: 20px;

            &.gray {

            }
            &.btn-color {
              color: #0DABF4;
              border-color: #0DABF4;
            }
          }
        }
      }
      .space-between {
        overflow: hidden;
        .left { float: left; }
        .right { float: right; }
      }
    }
  }
</style>
