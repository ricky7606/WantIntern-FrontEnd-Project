<template lang="html">
  <div class="page-cache">
    <div class="content">
      <div class="form">
        <div class="flex-row form-row">
          <div class="flex-row">
            工资余额：
            <span class="num">{{ account.balance || 0 }}</span>
          </div>
        </div>
        <div class="flex-row input form-row">
          <div class="flex-row flex-center flex-1">
            <span>
              提现金额：
            </span>
            <input type="number" class="account flex-1" v-model="amount" />
          </div>

          <div class="btn btn-all"
            @click="withdrawAll"
            v-show="account.balance > 0">
            全部提现
          </div>
        </div>
      </div>
    </div>

    <div class="desc">
      注: 提现金额自动提现到微信钱包，提现之后6-10个工作日到账。
    </div>

    <div class="btn btn-submit"
      @click="submit"
      :class="{ enabled: isSubmitReady === true }">
      申请提现
    </div>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'
  import TitleInput from '@/mobile-components/Form/TitleInput.vue'
  import { Account } from '@/api/account.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import { Toast } from 'mint-ui'

  export default {
    name: 'PageCache',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()

      if (!Account.accountInfo || !Account.accountInfo.accountId) {
        Req.Get(ReqUrl.StudentSubUrl.getItem(), '',
          res => {
            Account.changeAndAnnounce(res)
          }
        )
      }
    },
    data () {
      return {
        pageTitle: '提现',
        Account,
        amount: 0,

        isSubmiting: false,
      }
    },
    components: {
      TitleInput,
    },
    methods: {
      submit () {
        let txt = this.isSubmitReady

        if (txt === true) {
          // console.log('submit')
          if (this.isSubmiting) return

          this.isSubmiting = true
          Req.Post(
            ReqUrl.Account.postWithdraws(),
            {
              channel: 'WECHAT',
              value: parseFloat(this.amount),
            },
            res => {
              Toast('申请成功！ 为您跳转回“个人中心”。')
              this.isSubmiting = false
              setTimeout(() => {
                this.$router.replace({
                  name: 'PageAccount'
                })
              }, 500)
            },
            fail => {
              Toast(fail.response.data.userMessage || '提交出现问题')
            }
          )
        } else {
          Toast(txt)
        }
      },
      withdrawAll () {
        this.amount = this.account.balance
      },
    },
    computed: {
      isSubmitReady () {
        // forTest
        if (this.account.balance <= 0) return '工资余额不足'
        if (this.amount <= 0) return '提现金额应该大于0'
        return true
      },
      account () {
        let info = Account.accountInfo
        if (!info) return false

        return info.account
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../less/common.less';
  @import '../../less/mobile.less';

  .content {
    // margin-top: 10px;
    // margin-bottom: 30px;
  }
  .form-group {
    margin-top: 10px;

    input {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      line-height: 44px;
      color: #333333;
      height: 44px;

      padding: 0 15px;
      width: 100%;

      &:-webkit-input-placeholder {
        color: #C5C5C5;
      }
    }

    .msg-box {
      padding-right: 105px;
      background-color: white;
      width: 100%;
      position: relative;
      line-height: 44px;
      height: 44px;

      .btn-send {
        width: 105px;
        text-align: center;

        font-family: PingFangSC-Regular;
        font-size: 30px/2;
        color: #0DABF4;
        position: absolute;
        right: 0px;
        top: 0px;
        line-height: 44px;
        height: 44px;

        .sep-line {
          height: 13.5px;
          border-left: 1px solid #C5C5C5;

          position: absolute;
          left: 0;
          top: 15.5px;
        }
      }
    }
  }

  .btn-submit {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #FFFFFF;

    background-color: #BFBFBF;

    &.enabled {
      background-color: #0DABF4;
    }
  }
  .form-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    &:after {
      position: absolute;
      bottom: 0px;
      left: 15px;
      width: 100%;
      border-bottom: 1px solid #EDEEF1;
      content: ' ';
    }

    padding: 15px;
    padding-top: 20px;

    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #656565;
  }
  .btn-all {
    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #0DABF4;
  }
  .flex-1 {
    display: flex;
    flex-grow: 1;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input.account {
    font-family: AvenirNext-Medium;
    font-size: 40px/2;
    color: #333333;
    line-height: 40px/2;
    height: 40px/2;
  }
  .num {
    font-family: AvenirNext-Medium;
    font-size: 40px/2;
    color: #819292;
    line-height: 40px/2;
  }
  .desc {
    font-family: PingFangSC-Regular;
    font-size: 26px/2;
    color: #9B9B9B;
    line-height: 36px/2;

    padding: 20px 15px;
    padding-top: 10px;
    text-align: left;
  }
</style>
