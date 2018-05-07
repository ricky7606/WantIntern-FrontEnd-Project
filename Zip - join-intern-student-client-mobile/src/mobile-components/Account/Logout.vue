<template lang="html">
  <div class="logout-page">
    <div class="left">
      正在登出
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import {Account} from '@/api/account.js'

  export default {
    name: 'LoginPage',
    data () {
      return {}
    },
    mounted () {
      let url = ReqUrl.OtherSubUrl.postLogout()
      Req.Post(url, undefined, res => {
        console.log(res)
        Account.logout()
        this.$router.replace({
          name: 'PageMain'
        })
      }, fail => {
        this.$router.replace({
          name: 'PageMain'
        })
      })
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .logout-page {
    display: block;
    margin: 0 auto;
    background-color: white;
    text-align: center;
    font-size: 14px;
    color: #656565;
  }
</style>
