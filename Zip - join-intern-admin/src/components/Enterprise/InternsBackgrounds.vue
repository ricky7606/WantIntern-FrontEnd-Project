<template lang="html">
  <div class="page-interns-backgrounds xsx-form-theme">
    <div class="header row">
      <div class="center-content">
        <div class="col">
          <div class="col input-label">姓名</div>
          <div class="col">
            <input type="text" placeholder="请输入"/>
          </div>
        </div>
        <div class="col">
          <div class="col input-label">手机号</div>
          <div class="col">
            <input type="text" placeholder="请输入" />
          </div>
        </div>
        <div class="col">
          <div class="col input-label">毕业院校</div>
          <div class="col">
            <input type="text" placeholder="请输入" />
          </div>
        </div>
        <div class="col">
          <div class="btn">查询</div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="center-content">

      </div>
    </div>
  </div>
</template>

<script>
  import HeaderBar from '@/components/Enterprise/HeaderBar.vue'

  import {
    TabbarResume,
  } from '@/components/Enterprise/Enum.js'

  export default {
    name: 'Page-Matters',
    data () {
      return {
        TabbarResume,
      }
    },
    components: {
      HeaderBar,
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .page-interns-backgrounds {
    // padding-top: 30px;
    // background-color: white;

    .center-content {
      width: @MIN-WIDTH;
      min-width: @MIN-WIDTH;
      margin: 0 auto;
    }
    .header {
      padding-top: 30px;
      padding-bottom: 30px;
      text-align: left;
      margin-bottom: 20px;
      background-color: white;

      .input-label {
        margin-left: 24px;
        margin-right: 16px;
      }

      input {
        width: 220px;
        margin-right: 16px;
      }
    }
    .content {
      background-color: white;
      padding: 20px 0;
    }
  }
</style>
