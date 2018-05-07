<template lang="html">
  <div class="mine-subscription">
    <div class="page-result-title">
      订阅推荐
    </div>

    <div class="content">
      <div class="sub-row">
        <div class="sub-row-title col">
          企业性质：
        </div>
        <div class="sub-row-list col">
          <div class="sub-item" v-for="item in companyTypeList" @click="toggleItem(item.title, 'selectedCompanyTypeList')">
            <div class="opt-box" :class="{selected: isItemSelected(item.title, selectedCompanyTypeList)}"></div>
            <div class="opt-box-value">{{ item.title }}</div>
          </div>
        </div>
      </div>

      <div class="sub-row">
        <div class="sub-row-title col">
          实习行业：
        </div>
        <div class="sub-row-list col">
          <div class="sub-item" v-for="item in industryList" @click="toggleItem(item.title, 'selectedIndustryList')">
            <div class="opt-box" :class="{selected: isItemSelected(item.title, selectedIndustryList)}"></div>
            <div class="opt-box-value">{{ item.title }}</div>
          </div>
        </div>
      </div>

      <div class="sub-row">
        <div class="sub-row-title col">
          职位类型：
        </div>
        <div class="sub-row-list col">
          <div class="sub-item" v-for="item in positionTypeList" @click="toggleItem(item.title, 'selectedPositionTypeList')">
            <div class="opt-box" :class="{selected: isItemSelected(item.title, selectedPositionTypeList)}"></div>
            <div class="opt-box-value">{{ item.title }}</div>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="btn btn-save" @click="saveData">
          保存设置 {{ isSaving ? '(正在保存...)' : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import * as MetaProxy from '@/api/proxy.js'
  import { Account } from '@/api/account.js'

  export default {
    name: 'Subscription',
    data () {
      return {
        Account,
        isSaving: false,

        selectedCompanyTypeList: [],
        selectedIndustryList: [],
        selectedPositionTypeList: [],

        companyTypeList: [],
        industryList: [],
        positionTypeList: []
      }
    },
    mounted () {
      MetaProxy.Get(
        'COMPANY_TYPE',
        res => {
          console.log(res)
          this.companyTypeList = res
        }
      )
      MetaProxy.Get(
        'INDUSTRY',
        res => {
          console.log(res)
          this.industryList = res
        }
      )
      MetaProxy.Get(
        'POSITION_TYPE',
        res => {
          console.log(res)
          this.positionTypeList = res
        }
      )

      this.loadSubscription()

      Account.anounceList.push(item => {
        this.loadSubscription()
      })
    },
    methods: {
      isItemSelected (item, list) {
        return !!list.find(i => i === item)
      },
      toggleItem (item, listName) {
        let list = this[listName]
        if (this.isItemSelected(item, list)) {
          this[listName] = list.filter(i => i !== item)
        } else {
          this[listName].push(item)
        }
      },
      loadSubscription () {
        let info = this.Account.accountInfo

        if (!info || !info.id) return

        let subscription = info.subscription
        if (!subscription) return
        console.log(subscription)

        this.selectedCompanyTypeList = (subscription.type || '').split('&').filter(i => !!i && typeof i === 'string' && i !== '[object Object]')
        this.selectedIndustryList = (subscription.industry || '').split('&').filter(i => !!i && typeof i === 'string' && i !== '[object Object]')
        this.selectedPositionTypeList = (subscription.ptype || '').split('&').filter(i => !!i && typeof i === 'string' && i !== '[object Object]')
      },
      uploadStudentInfo (cbfn = res => res) {
        let url = ReqUrl.StudentSubUrl.putItem(0)
        let data = {
          subscription: {
            type: this.selectedCompanyTypeList.join('&'),
            industry: this.selectedIndustryList.join('&'),
            ptype: this.selectedPositionTypeList.join('&'),
          }
        }

        Req.Put(url, data, res => {
          cbfn(res)
        }, fail => {
          if (fail.response.data.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
          if (fail.response.data.userMessage) {
            alert(`保存失败：${fail.response.data.userMessage}`)
          } else {
            alert(`保存失败：错误信息如下:\n${fail.response.data}`)
          }
        })
      },
      saveData () {
        if (this.isSaving) {
          alert('正在保存')
          return
        }

        this.isSaving = true
        this.uploadStudentInfo(res => {
          alert('保存成功')
          this.isSaving = false
        })
      },
      loadData () {
        if (!Account.accountInfo || !Account.accountInfo.accountId) {
          Req.Get(ReqUrl.StudentSubUrl.getItem(), '',
            res => {
              Account.changeAndAnnounce(res)
            }
          )
        }
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

  .content {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #656565;
    letter-spacing: 0;
    line-height: 14px;

    .sub-row {
      background-color: #FBFBFB;
      padding: 20px;
      padding-bottom: 0px;
      display: block;
      overflow: hidden;

      margin-bottom: 19px;

      padding-left: 120px;
      position: relative;
    }
    .sub-row-title {
      display: block;
      position: absolute;
      top: 20px;
      left: 20px;

      width: 6em;
    }
    .sub-row-list {
      display: block;
      float: left;

      .sub-item {
        display: inline-block;
        margin-right: 40px;
        margin-bottom: 22px;
        cursor: pointer;

        .opt-box {
          display: inline-block;

          background: #FFFFFF;
          border: 1px solid #E5E6EB;
          height: 12px;
          width: 12px;

          margin-right: 10px;

          &.selected {
            background: #0DABF4;
            border-color: #0DABF4;
          }
        }
        .opt-box-value {
          display: inline-block;
        }
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
  .btn-save {
    display: block;
    background: #0DABF4;
    color: white;

    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: 0;

    height: 40px;
    line-height: 40px;
    text-align: center;
  }
</style>
