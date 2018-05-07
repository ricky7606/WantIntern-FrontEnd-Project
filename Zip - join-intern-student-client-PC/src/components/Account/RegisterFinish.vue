<template lang="html">
  <div class="register-finish-page xsx-form-theme">
      <div class="title row">
        注册已经完成~
      </div>

      <div class="btn pointer-on" @click="gotoContent">
        前往我的主页
      </div>
  </div>
</template>

<script>
  export default {
    name: 'RegisterFinish',
    data () {
      return {}
    },
    methods: {
      // 返回登录页
      gotoHome () {
        this.$router.replace({
          name: 'Home'
        })
      },
      // 登录后，直接进入内容
      gotoContent () {
        // 进入用户中心
        this.$router.replace({
          path: '/mine/message'
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .register-finish-page {
    text-align: center;
    display: block;
    width: 645px;
    padding-bottom: 70px;
    margin: 0 auto;
    background-color: white;

    padding-top: 40px;

    .title {
      margin-bottom: 20px;
    }
    .btn {
      width: 200px;
      display: inline-block;
    }
  }
</style>
