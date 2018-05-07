<template lang="html">
  <div class="mine-information align-left xsx-form-theme">
    <div class="page-result-title">
      学生评价
    </div>

    <div class="stu-rank-msg">
      <div class="empty" v-if="!dataCopy.avgRate">
        暂无评价信息
      </div>
      <div class="rank-box" v-if="dataCopy.avgRate">
        <div class="row total-point">
          综合评分 {{totalPoint}}
        </div>
        <template v-for="row in rankList">
          <div class="row rank-row">
            <span class="title">
              {{row.title}}
            </span>
            <points-row :value="row.value"/>
            <span class="value">
              {{row.value}}
            </span>
          </div>
        </template>
      </div>
    </div>

    <div class="page-result-title">
      企业基本信息
    </div>

    <div class="enterprise-msg">
      <information-form />
    </div>
  </div>
</template>

<script>
  import { Account } from '@/api/account.js'
  import { mapRankState } from '@/api/enum.js'

  import InformationForm from '@/components/Account/InfomationFormInline.vue'
  import PointsRow from '@/components/Utils/PointsRow.vue'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'Setting',
    data () {
      return {
        dataCopy: {},
        formerPassword: '',
        newPassword: '',
        confirmPassword: '',

        alertText: '',
        statusText: '',

        rankData: null,
        totalPoint: 0,
      }
    },
    mounted () {
      Account.anounceList.push(item => {
        this.dataCopy = item || {}
        this.rankData = item ? item.avgRate : {}
      })
      this.dataCopy = Account.accountInfo || {}

      if (!Account.accountInfo || !Account.accountInfo.accountId) {
        Req.Get(ReqUrl.Company.getItem(0), '',
          res => {
            Account.changeAndAnnounce(res)
            this.dataCopy = res
            this.rankData = res ? res.avgRate : {}
          }, fail => {
            if (fail.response.data.status === 401) {
              this.$router.push({
                name: 'Login'
              })
            }
          }
        )
      }
    },
    components: {
      InformationForm,
      PointsRow,
    },
    methods: {
      inputing () {
        this.statusText = ''
        this.alertText = ''
      },
      submit () {
        let newPassword = this.newPassword
        let confirmPassword = this.confirmPassword

        if (!newPassword) {
          this.alertText = '请输入完整再提交'
          return
        }
        if (newPassword.length < 8) {
          this.alertText = '密码长度不少于8位'
          return
        }
        if (newPassword !== confirmPassword) {
          this.alertText = '密码不一致，请重新输入'
          return
        }

        // 正在提交
        if (this.statusText) return

        this.statusText = '正在提交数据'

        Req.Put(ReqUrl.Account.put(),
          {
            phone: null,
            password: newPassword
          },
          res => {
            this.statusText = '修改成功'
          }, fail => {
            if (fail.response.data.status === 401) {
              this.$router.push({
                name: 'Login'
              })
            }
          }
        )
      },
    },
    computed: {
      rankList () {
        let data = this.rankData
        // let data = {
        //   score1: 2.5,
        //   score2: 2.5,
        //   score3: 2.5,
        //   score4: 2.5,
        //   score5: 2.5
        // }
        let titleList = mapRankState.titleList
        let keyList = [
          'score1',
          'score2',
          'score3',
          'score4',
          'score5',
        ]

        if (!data) return []

        let totalPointValue = 0
        return keyList.map((key, i) => {
          totalPointValue += data[key]

          this.totalPoint = totalPointValue / (i + 1)
          return {
            title: titleList[i],
            value: data[key]
          }
        })
      }
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
    margin-top: 40px;

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

  .mine-information {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #819292;
    letter-spacing: 0;
    line-height: 14px;
    padding-top: 41px;

    .form {
      background: #FBFBFB;
      padding: 40px 30px;
      margin-bottom: 20px;
    }

    .input-block {
      .input-label-inline {
        width: 4em;
        margin-right: 20px;
        text-align: right;
      }
      .btn,
      input {
        width: 368px;
      }
    }
    .alert-text {
      color: red;
    }

    .total-point {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #0DABF4;
      line-height: 16px;

      margin-bottom: 20px;
    }
    .rank-box {
      display: block;

      .rank-row {
        display: block;
        text-align: left;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9B9B9B;
        line-height: 14px;
        margin-bottom: 16px;

        .title {
          margin-right: 20px;
        }
        .value {
          margin-left: 10px;
        }
      }
    }
  }
</style>
