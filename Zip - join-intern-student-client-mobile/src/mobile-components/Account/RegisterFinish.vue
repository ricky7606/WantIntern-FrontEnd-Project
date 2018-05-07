<template lang="html">
  <div class="register-finish-page xsx-form-theme">
      <div class="title row">
        注册已经完成~
      </div>

      <div class="btn pointer-on" @click="gotoHome">
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
      gotoHome () {
        this.$router.replace({
          name: 'Home'
        })
      }
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
