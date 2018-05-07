<template lang="html">
  <div class="page-account">
    <div class="content-list flex-col">
      <div class="selector-group" v-for="grp in AccountPageList">
        <template v-for="(item, index) in grp">
          <icon-selector @click.native="selectRow(item)"
            :border-bottom="index !== (grp.length - 1)"
            :icon="item.icon"
            :title="item.title">
            <span class="gray">{{ item.content }}</span>
          </icon-selector>
        </template>
      </div>

      <div class="selector-group">
        <div class="btn btn-logout" @click="logout">
          退出当前账户
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import pageMixin from './pages-mixins.js'

  import IconSelector from '@/mobile-components/Form/IconSelector.vue'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { Account } from '@/api/account.js'
  // assets
  // import { AccountPage } from '@/assets/wechat-stu/index.js'

  const AccountPageList = [
    [
      {
        title: '我的账号',
        path: '/reset-phone',
        content: '',
      },
      {
        title: '修改密码',
        path: '/reset-password',
        content: '',
      },
    ],
    [
      {
        title: '关于我们',
        path: '/about',
        content: 'V 1.0.0',
      },
      {
        title: '用户协议',
        path: '/agreement',
        content: '',
      },
    ],
  ]

  export default {
    name: 'PageSetting',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()
      Account.anounceList.push(res => {
        AccountPageList.forEach(list => {
          list.forEach(item => {
            if (item.title === '我的账号') {
              item.content = res.account.phone
            }
          })
        })
      })
      if (!Account.accountInfo || !Account.accountInfo.accountId) {
        Req.Get(ReqUrl.StudentSubUrl.getItem(), '',
          res => {
            Account.changeAndAnnounce(res)
          }
        )
      } else {
        AccountPageList.forEach(list => {
          list.forEach(item => {
            if (item.title === '我的账号') {
              item.content = Account.accountInfo.account.phone
            }
          })
        })
      }
    },
    data () {
      return {
        pageTitle: '设置',

        AccountPageList,
        Account,
      }
    },
    components: {
      IconSelector,
    },
    computed: {
      info () {
        return Account.accountInfo
      }
    },
    methods: {
      selectRow (item) {
        let path = item.path
        if (!path) return
        this.$router.push({
          path
        })
      },
      logout () {
        this.$router.push({
          name: 'PageLogout'
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/mobile.less";

  .page-account {
    .content-list {
      margin-top: 10px;
    }
    .selector-group {
      background-color: white;
      margin-bottom: 10px;
    }

    .btn-logout {
      width: 100%;
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #FF8000;
      background-color: white;
      text-align: center;

      height: 44px;
      line-height: 44px;
    }

    .gray {
      font-family: AvenirNext-Regular;
      font-size: 30px/2;
      color: #333333;
      line-height: 30px/2;
    }
  }
</style>
