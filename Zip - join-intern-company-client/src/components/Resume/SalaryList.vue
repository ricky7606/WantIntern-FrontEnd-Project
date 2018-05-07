<template lang="html">
  <div class="salary-list">
    <div class="header">
      <div class="flex-row title">
        {{ dateObject[0] }}年{{ dateObject[1] }}月实习工资表
      </div>
      <div class="empty-holder" v-if="list.length === 0 && !loading">
        暂无相关工资项目
      </div>
      <div class="empty-holder" v-if="loading">
        正在加载数据...
      </div>
      <div class="table" v-show="list.length">
        <table>
          <tr class="header-row">
            <th v-for="head in headersList">
              {{ head }}
            </th>
          </tr>
          <tr v-for="row in list">
            <td v-for="head in headersList">
              <div class="avatar"
                :style="mapTitleToValue(row, head) | imgbg"
                v-if="head === '头像'">
              </div>
              <div class="txt" v-if="head !== '头像' && head !== '操作'">
                {{ mapTitleToValue(row, head) }}
              </div>

              <div class="action" v-if="head === '操作'">
                <!-- {{ mapTitleToValue(row, head) }} -->
                <div class="action-group"
                  v-show="mapTitleToValue(row, head) === 'NEW_GENERATED'">
                  <div class="btn" @click="editItem(row)">修改</div>
                  <div class="btn enabled" @click="submitItem(row)">确认</div>
                </div>
                <div class="action-group"
                  v-show="mapTitleToValue(row, head) === 'WAIT_STU_CONFIRM'">
                  <div class="state-text">学生未确认</div>
                </div>
                <div class="action-group"
                  v-show="mapTitleToValue(row, head) === 'WAIT_COMP_CONFIRM'">
                  <div class="btn" @click="editItem(row)">修改和确认</div>
                </div>
                <div class="action-group"
                  v-show="mapTitleToValue(row, head) === 'CONFIRMED'">
                  <div class="state-text">学生已确认</div>
                </div>
                <div class="action-group"
                  v-show="mapTitleToValue(row, head) === 'PAID'">
                  <div class="state-text">已支付</div>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="edit-modal" v-show="isModalShow">
      <div class="content">
        <div class="title">修改工资</div>
        <div class="edit-board">
          <div class="flex-row">
            <div class="flex-col">姓名：</div>
            <div class="flex-col">{{ mapTitleToValue(editingItem, '姓名') }}</div>
          </div>
          <div class="flex-row">
            <div class="flex-col">工资：</div>
            <div class="flex-col">{{ mapTitleToValue(editingItem, '工资') }}</div>
          </div>
          <div class="flex-row">
            <div class="flex-col">本月实习天数：</div>
            <div class="flex-col">{{ mapTitleToValue(editingItem, '本月实习天数') }}</div>
          </div>
          <div class="border-top">
            <div class="flex-row" v-show="mapTitleToValue(editingItem, '工资单位') === '元/天'">
              <div class="flex-col">实习天数更改：</div>
              <input type="number" v-model="workingDays" />
            </div>
            <div class="flex-row" v-show="mapTitleToValue(editingItem, '工资单位') === '元/月'">
              <div class="flex-col">实习工资更改：</div>
              <input type="number" v-model="workingSalary" />
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="btn enabled" @click="submitChangeSalary">确认修改</div>
          <div class="btn" @click="hideModal">关闭</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapReqGender } from '@/components/Position/PositionEnum.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  const resumeStateToTitle = {
    'WORKING': '实习中',
    'ENDED': '已结束',
    'COMMENTED': '已评价',
  }
  let headersList = [
    '头像',
    '姓名',
    '性别',
    '职位',
    '入职时间',
    '实习状态',
    '工资',
    '本月实习天数',
    '应付工资',
    '学生到手工资',
    '学生备注信息',
    '操作',
  ]

  export default {
    name: 'SalaryList',
    data () {
      return {
        mapReqGender,
        headersList,

        editingItem: null,
        isModalShow: false,

        workingDays: 0,
        workingSalary: 0,
      }
    },
    computed: {
      dateObject () {
        return this.month.split('-')
      }
    },
    methods: {
      mapTitleToValue (dict, title) {
        if (!dict) return ''

        let isCountByDay = this.isCountByDay(dict)
        switch (title) {
          case '头像':
            return stu(dict).avatar
          case '姓名':
            return stu(dict).name
          case '性别':
            return mapReqGender[stu(dict).gender]
          case '职位':
            return pos(dict).title
          case '入职时间':
            return resume(dict).offerTime.substr(0, 10)
          case '实习状态':
            return resumeStateToTitle[resume(dict).state]
          case '工资':
            return `${pos(dict).salary}${pos(dict).unit}`
          case '本月实习天数':
            return isCountByDay ? dict.workDays : '-'
          case '应付工资':
            return dict.value
          case '学生到手工资':
            return dict.stuValue
          case '学生备注信息':
            return dict.stuComment ? dict.stuComment : '-'
          case '操作':
            return dict.state
          case '工资单位':
            return resume(dict).unit
        }

        function stu (d) { return d.resume.student }
        function pos (d) { return d.resume.position }
        function resume (d) { return d.resume }
      },
      isCountByDay (dict) {
        return dict.resume.position.unit === '元/天'
      },
      editItem (item) {
        this.editingItem = item
        if (this.isCountByDay(item)) {
          this.workingDays = this.mapTitleToValue(item, '本月实习天数')
        } else if (!this.isCountByDay(item)) {
          this.workingSalary = this.mapTitleToValue(item, '应付工资')
        }
        this.showModal()
      },
      submitItem (item) {
        this.editingItem = item
        this.submitChangeSalary()
      },
      showModal () {
        this.isModalShow = true
      },
      hideModal () {
        this.isModalShow = false
      },
      submitChangeSalary () {
        let item = this.editingItem
        let resume = item.resume
        let isCountByDay = this.isCountByDay(item)

        console.log(isCountByDay)
        let dict = {
          state: 'WAIT_STU_CONFIRM'
        }
        let ratio = item.stuValue / item.value

        // 按天计算工资
        if (isCountByDay) {
          let days = parseFloat(this.workingDays)

          dict.workDays = days
          dict.value = resume.salary * days
          dict.stuValue = resume.stuSalary * days
        } else {
          // 按月计算工资
          // 按月份
          dict.value = this.workingSalary
          dict.stuValue = this.workingSalary * ratio
        }

        this.updateSalaryMsg(
          item,
          dict,
          res => {
            console.log(res)
            this.$emit('reload', null)
          }
        )

        this.hideModal()
      },
      // dict的格式 {
      //   workDays: 22,
      //   state: 'WAIT_STU_CONFIRM'
      // }
      updateSalaryMsg (item, dict, successCbfn = x => x) {
        let id = item.id
        let url = ReqUrl.OtherSubUrl.putSalary(id)

        Req.Put(
          url,
          {
            ...dict
          },
          res => {
            console.log(res)
            successCbfn(res)
          },
          fail => {
            console.log(fail)
          }
        )
      }
    },
    props: {
      list: {
        type: Array,
        default () {
          return []
        },
      },
      loading: {
        type: Boolean,
        default () {
          return false
        },
      },
      month: {
        type: String,
        default () {
          return '-'
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .salary-list {
    padding-top: 20px;
    width: 100%;

    .title {
      font-family: PingFangSC-Regular;
      font-size: 20px;
      color: #819292;
      letter-spacing: 0;
      margin-bottom: 30px;
    }

    table {
      width: 100%;
      border-top: 1px solid #E5E6EB;

      th {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #819292;
        letter-spacing: 0;
        line-height: 14px;

        padding: 20px 0;
      }
      td {
        padding: 14px 0;
      }
      tr {
        background-color: #FBFBFB;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #656565;
        letter-spacing: 0;
        line-height: 14px;

        &.header-row {
          background-color: white;
        }
      }
    }
    .action {
      display: flex;
      align-items: center;

      .action-group {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        width: 100%;
      }

    }
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;

    min-width: 80px;
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    margin: 0 5px;

    color: #819292;
    border: 1px solid #819292;
    border-color: #819292;

    cursor: pointer;

    &.enabled {
      color: #0DABF4;
      border: 1px solid #0DABF4;
      border-color: #0DABF4;
    }
  }
  .state-text {
    display: flex;
    align-items: center;
    justify-content: center;

    min-width: 80px;
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    margin: 0 5px;

    color: #819292;
    // border: 1px solid #819292;
    border-color: #819292;

    &.enabled {
      color: #0DABF4;
      // border: 1px solid #0DABF4;
      border-color: #0DABF4;
    }
  }
  .avatar {
    display: inline-block;
    height: 40px;
    width: 40px;

    .icon();
  }
  .margin-bottom-30 {
    margin-bottom: 30px;
  }

  .edit-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    position: fixed;
    z-index: 200;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    height: 100vh;
    width: 100vw;

    background-color: rgba(0,0,0,0.6);

    .content {
      background-color: white;
      padding: 15px;
      padding-top: 0px;
      text-align: center;
      min-width: 300px;

      .title {
        width: 100%;
        text-align: center;
        padding: 1em;
        font-size: 16px;
        margin-bottom: 0px;
      }

      .flex-row {
        color: #656565;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .border-top {
        border-top: 1px solid #656565;
        padding-top: 10px;

        input {
          border-bottom: 1px solid #656565;
        }
      }

      .actions {
        margin-top: 20px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
      }
    }
  }
  .empty-holder {
    color: #656565;
    text-align: left;
  }
</style>
