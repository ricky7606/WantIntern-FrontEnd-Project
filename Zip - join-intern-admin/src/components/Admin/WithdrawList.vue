<template lang="html">
  <div class="news-list xsx-form-theme">
    <div class="list align-center" v-if="list.length">
      <table>
        <tr>
          <th>手机号</th>
          <th>学生姓名</th>
          <th>申请金额</th>
          <th>账号余额</th>
          <th>申请时间</th>
          <th>申请状态</th>

          <th>操作</th>
        </tr>
        <template v-for="item in list">
          <tr>
            <td class="id">{{item.account.phone}}</td>
            <td class="id">{{item.student.name}}</td>
            <td class="title">{{item.value}}</td>
            <td class="title">{{item.account.balance}}</td>
            <td class="title">{{parseDateString(item.createTime)}}</td>
            <td class="title">{{parseItemState(item.state)}}</td>
            <!-- 初审操作 -->
            <td class="action" v-if="item.state === 'NEW'">
              <div class="btn col plain warning"
                @click="refuseWithdraw(item)">
                拒绝
              </div>
              <div class="btn col plain btn-enable"
                @click="passWithdraw(item)">
                通过
              </div>
            </td>
            <!-- 二审操作 -->
            <td class="action" v-if="item.state === 'REFUSED'">
            	<div class="btn col plain btn-enable"
                @click="passWithdraw(item)">
                二审通过
              </div>
            </td>
          </tr>
        </template>
      </table>

      <page-index v-if="list.length > 0"
                  v-show="!isRichTextEditing"
                  :total="pagination.total"
                  :current="pagination.current"
                  @change="pageIndexChange"/>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'
  import EnterpriseEditor from '@/components/Admin/EnterpriseEditor.vue'
  import { mapReqGender, mapReqLangLevel, mapReqEdu } from '@/components/Position/PositionEnum.js'
  import moment from 'moment'

  export default {
    name: 'StudentList',
    data () {
      return {
        pagination: {
          current: 1,
          total: 1,
          pagesize: 20,
        },
        list: [],

        isRichTextEditing: false,
        editingContent: {},

        mapReqGender,
        mapReqLangLevel,
        mapReqEdu,
      }
    },
    mounted () {
      this.getData({})
    },
    components: {
      PageIndex,
      EnterpriseEditor,
    },
    methods: {
      getData ({pageIndex, pageSize}) {
        Req.Get(
          ReqUrl.Account.getWithdraws(),
          {
            pageIndex: pageIndex || 1,
            pageSize: pageSize || 20,
            // state: 'NEW', //NEW/PASSED/REFUSED/PAID
            // accountId: ''
          },
          res => {
            this.parseData(res)
            // this.queryCont(res)
            // console.log(res)
          },
          fail => {
            if (fail && fail.response.data) {
              alert(fail.response.data.userMessage)
              if (fail.response.data.status === 401) {
                this.$router.replace({
                  name: 'Login'
                })
              }
            }
          }
        )
      },
      changeWithdrawState (item, state, cbfn = x => x) { // 提现审批函数
        let id = item.id
        let url = ReqUrl.Account.putWithdraws(id)
        Req.Put(
          url,
          state,
          res => {
            console.log(res)
            cbfn(res)
          },
          fail => {
            alert(fail.response.data.userMessage)
            console.log(fail)
            this.pageIndexChange(this.pagination.current)
          }
        )
      },
      refuseWithdraw (item) {
        this.changeWithdrawState(
          item,
          {
            state: 'REFUSED'
          },
          res => {
            console.log(res)
            alert('操作成功: 已拒绝提现')
            this.pageIndexChange(this.pagination.current)
          }
        )
      },
      passWithdraw (item) {
        this.changeWithdrawState(
          item,
          {
            state: 'PASSED'
          },
          res => {
            console.log(res)
            alert('操作成功: 已通过提现验证')
            this.pageIndexChange(this.pagination.current)
          }
        )
      },
      updateData () {
        this.pageIndexChange(this.pagination.current)
      },
      parseDateString (str) {
        let m = moment(str)
        return m.format('YYYY-MM-DD hh:mm')
      },
      // 页面切换
      pageIndexChange (index) {
        this.pagination.current = index
        this.getData({
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pagesize
        })
      },
      parseData (res) {
        this.list = res.items
        this.pagination = ParsePagination(res.pagination)
      },
      parseItemState (state) {
        let map = {
          NEW: '待处理',
          PASSED: '通过',
          REFUSED: '拒绝',
          PAID: '已支付',
          AGAINREFUSED: '二审失败',
        }
        return map[state]
      },
      // queryCont (item) {
      //   let id = item.account.id
      //   let url = ReqUrl.Account.queryExistence(id)
      //   Req.Get(
      //     url,
      //     res => {
      //       this.Number = res
      //     },
      //   )
      // },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .news-list {
    position: relative;

    .list.align-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .header {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1;
      justify-content: center;
      margin-bottom: 10px;

      .createNew {
        margin-left: 200px;
      }
    }

    table {
      border: 1px solid gray;
      font-size: 12px;

      tr,
      th {
        height: 2.6em;
        line-height: 2.6em;
        padding: 0 10px;
      }
      tr:nth-of-type(odd) {
        background-color: #eee;
      }


      .id {
        padding: 0 5px;
      }
      .title {
        padding: 0 10px;
      }
      .author {
        padding: 0 10px;
      }
      .action {
        padding: 0 10px;
        .btn {
          margin: 5px;
        }
      }
    }
    .btn {
      // height: 1.4em;
      // line-height: 1.4em;
      // padding: 0;
    }
  }

  .sub-page {
    margin: 0 auto;
    display: inline-block;
    background-color: white;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>
