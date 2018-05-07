<template lang="html">
  <div class="register-agreement xsx-form-theme">
    <div class="margin-bottom-20">
      <processbar :step="1"/>
    </div>
    <div class="content" v-html="agreememtText">
      <!-- <div class="title">
        享实习用户协议
      </div>
      <div class="text">
        {{agreememtText}}
      </div> -->
    </div>
    <div class="row footer">
      <div class="btn plain width-160" @click="goNext">
        同意协议并下一步
      </div>
    </div>
  </div>
</template>

<script>
  import Processbar from './process-bar.vue'
  import * as MetaProxy from '@/api/proxy.js'

  export default {
    name: 'Agreement',
    data () {
      return {
        agreememtText: `内容加载中...`
      }
    },
    components: {
      Processbar,
    },
    mounted () {
      MetaProxy.Get('COMPANY_AGREEMENT', res => {
        this.agreememtText = res
      })
    },
    methods: {
      goNext () {
        this.$router.push({
          name: 'RegisterInfomationForm'
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .register-agreement {
    display: block;
    width: 645px;
    padding: 20px 40px;
    margin: 0 auto;
    background-color: white;

    .margin-bottom-20 {
      margin-bottom: 20px;
    }
    .content {
      border: 1px solid #E5E6EB;
      padding: 20px;
      height: 257px;
      overflow-y: auto;

      .title {
        margin-bottom: 20px;
        display: block;
        width: 100%;
        text-align: center;
      }
      .text {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #454F66;
        letter-spacing: 0;
        line-height: 20px;
        white-space: pre-wrap;
      }
    }

    .footer {
      margin-top: 20px;
      width: 100%;
      text-align: center;
    }
    .width-160 {
      display: inline-block;
      width: 160px;
    }
  }
</style>
