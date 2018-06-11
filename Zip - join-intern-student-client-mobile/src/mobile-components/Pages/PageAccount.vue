<template lang="html">
  <div class="page-account">
    <div class="header flex-row">
      <div class="user-icon" :style="dataCopy.avatar | imgbg"></div>
      <div class="flex-col user-msg">
        <div class="name" @click="clickNickname">{{ dataCopy.name || (isLogin ? '(未设置昵称)' : '点击登录') }}</div>
        <div class="flex-row flex-between desc">
          <div class="marks" v-show="dataCopy.account">积分 {{ dataCopy.account.point || 0 }}</div>
          <div class="money">
            <span class="col">工资 {{ dataCopy.account.balance || 0 }}</span>
            <span class="btn btn-cache" v-show="dataCopy.account.balance > 0" @click="gotoCache">提现</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-list flex-col">
      <div class="selector-group" v-for="grp in AccountPageList">
        <template v-for="(item, index) in grp">
          <icon-selector
            @click.native="selectRow(item)"
            :has-new="item.title === '我的消息' && hasNewMessage"
            :border-bottom="index !== (grp.length - 1)"
            :icon="item.icon"
            :title="item.title" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import pageMixin from './pages-mixins.js'
  import { joinWechatAuthUrl } from '@/utils/helper-functions.js'
  import IconSelector from '@/mobile-components/Form/IconSelector.vue'
  import { Account } from '@/api/account.js'

  // assets
  import { AccountPage } from '@/assets/wechat-stu/index.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  const AccountPageList = [
    [
      {
        title: '简历',
        icon: AccountPage[1],
        path: '/resume',
      },
      {
        title: '我的消息',
        icon: AccountPage[2],
        path: '/message',
      },
    ],
    [
      {
        title: '已投递',
        icon: AccountPage[3],
        path: '/position-list/NEW',
      },
      {
        title: '待面试',
        icon: AccountPage[4],
        path: '/position-list/CONFIRMED',
      },
      {
        title: '待入职',
        icon: AccountPage[5],
        path: '/position-list/OFFERED',
      },
      {
        title: '实习中',
        icon: AccountPage[6],
        path: '/position-list/WORKING',
      },
      {
        title: '已结束',
        icon: AccountPage[1],
        path: '/position-list/COMMENTED',
      },
      {
        title: '未录用',
        icon: AccountPage[1],
        path: '/position-list/CANCELED',
      },
      {
        title: '收藏',
        icon: AccountPage[7],
        path: '/subscribe',
      },
    ],
    [
      {
        title: '意见反馈',
        icon: AccountPage[8],
        path: '/feedback',
      },
      {
        title: '设置',
        icon: AccountPage[9],
        path: '/setting',
      },
    ],
  ]

  export default {
    name: 'PageAccount',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()
      this.getStudentInfo()

      if (!Account.accountInfo || !Account.accountInfo.accountId) {
        Req.Get(ReqUrl.StudentSubUrl.getItem(), '',
          res => {
            Account.changeAndAnnounce(res)
          }
        )
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        Req.Get(
          ReqUrl.StudentSubUrl.getItem(),
          '',
          res => {
            Account.changeAndAnnounce(res)
          }
        )
      })
    },
    data () {
      return {
        pageTitle: '个人中心',

        AccountPageList,
        dataCopy: {
          name: '',
          account: {
            point: 0,
            balance: 0,
          }
        },
        isLogin: false,
        Account,
      }
    },
    components: {
      IconSelector,
    },
    computed: {
      hasNewMessage () {
        let target = this.Account.accountInfo
        if (!target) return false
        if (!target.account) return false

        return target.account.unreadNotis > 0
      }
    },
    methods: {
      clickNickname () {
        if (!this.isLogin) {
          this.goAuth()
          return
        }
        if (!this.dataCopy.name) {
          this.goSetting()
        }
      },
      goAuth () {
        let appid = 'wx3157ff5481ec5025'
        let redirectUri = 'http://www.xiangshixi.com/wechat/'

        location.href = joinWechatAuthUrl({ appid, redirectUri })
      },
      goSetting () {
        this.$router.push({
          path: '/resume'
        })
      },
      goAuthInfo () {
        let appid = 'wx3157ff5481ec5025'
        let redirectUri = 'http://www.xiangshixi.com/wechat/'
        let scope = 'snsapi_userinfo'

        location.href = joinWechatAuthUrl({ appid, redirectUri, scope })
      },
      selectRow (item) {
        let path = item.path
        if (!path) return
        if (path === 'goAuth' || path === 'goAUthInfo') {
          this[path]()
          return
        }
        this.$router.push({
          path
        })
      },
      getStudentInfo (cbfn = res => res) {
        let url = ReqUrl.StudentSubUrl.getItem(0)
        Req.Get(url, undefined, res => {
          this.isLogin = true
          // alert('isLogin ' + this.isLogin)

          this.dataCopy = res
          cbfn(res)
        }, fail => {
          if (fail.response.data.status === 401) {
            this.isLogin = false
            // alert('isLogin ' + this.isLogin)
            // alert('未登录')
            // this.$router.push({
            //   name: 'Login'
            // })
          }
        })
      },
      gotoCache () {
        this.$router.push({
          path: '/cache'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/mobile.less";

  .page-account {
    .header {
      padding: 25px 15px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      background-color: #0DABF4;

      .user-icon {
        display: inline-block;
        border: 1px solid white;
        border-radius: 50%;
        margin-right: 10px;

        .sqr(60px);
        .icon();
      }
      .user-msg {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        flex: 1;

        .name {
          font-family: PingFangSC-Regular;
          font-size: 34px/2;
          color: #FFFFFF;
          line-height: 34px/2;
          margin-bottom: 15px;
        }
        .desc {
          font-family: PingFangSC-Regular;
          font-size: 30px/2;
          color: #FFFFFF;
          line-height: 30px/2;

          display: flex;
          align-content: center;
          justify-content: space-between;
          width: 100%;
        }

        .btn-cache {
          background: #FFFFFF;
          border-radius: 4.5px/2;
          font-family: PingFangSC-Regular;
          font-size: 28px/2;
          color: #0DABF4;
          line-height: 28px/2;

          padding: 2.5px 6.5px;
        }
      }
    }

    .content-list {
      margin-top: 10px;
    }
    .selector-group {
      background-color: white;
      margin-bottom: 10px;
    }
  }
  .astrill {
    color: #0DABF4;
  }
</style>
