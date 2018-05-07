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
          name: 'Home'
        })
      }, fail => {
        this.$router.replace({
          name: 'Home'
        })
      })
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .login-page {
    display: block;
    width: 645px;
    // height: 367px;
    padding-bottom: 70px;
    margin: 0 auto;
    background-color: white;

    padding-top: 40px;

    .left {
      padding-left: 60px;
      padding-right: 50px;
      border-right: 1px solid #E5E6EB;

      width: 382px;
    }
  }
</style>
