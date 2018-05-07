<template lang="html">
  <div class="register-agreement xsx-form-theme">
    <div class="margin-bottom-20">
      <processbar :step="1"/>
    </div>
    <div class="content">
      <div class="title">
        享实习用户协议
      </div>
      <div class="text">
        {{agreememtText}}
      </div>
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

  export default {
    name: 'Agreement',
    data () {
      return {
        agreememtText: `你的应用程序中总是会有许多进程发生在后台，例如从服务器下载数据，计算正在进行中。 这样的过程总是需要一些时间。 您应该让用户知道应用程序未被冻结，并指示正在处理的状态。 好的视觉元素会使用户对应用程序有控制感。

下拉该组中一个著名的动画就是“下拉刷新”，它向用户展示了移动设备上的内容更新过程。提示：拉动刷新动画应与应用程序的设计大纲相匹配 - 如果应用程序最小，动画应该也是如此。通知因为运动自然地引起了人们的注意，动画通知是一种愉快的方式来通知用户一些事情，而且不会给用户造成太大的干扰。下拉该组中一个著名的动画就是“下拉刷新”，它向用户展示了移动设备上的内容更新过程。提示：拉动刷新动画应与应用程序的设计大纲相匹配 - 如果应用程序最小，动画应该也是如此。通知因为运动自然地引起了人们的注意，动画通知是一种愉快的方式来通知用户一些事情，而且不会给用户造成太大的干扰。下拉该组中一个著名的动画就是“下拉刷新”，它向用户展示了移动设备上的内容更新过程。提示：拉动刷新动画应与应用程序的设计大纲相匹配 - 如果应用程序最小，动画应该也是如此。通知因为运动自然地引起了人们的注意，动画通知是一种愉快的方式来通知用户一些事情，而且不会给用户造成太大的干扰。下拉该组中一个著名的动画就是“下拉刷新”，它向用户展示了移动设备上的内容更新过程。提示：拉动刷新动画应与应用程序的设计大纲相匹配 - 如果应用程序最小，动画应该也是如此。通知因为运动自然地引起了人们的注意，动画通知是一种愉快的方式来通知用户一些事情，而且不会给用户造成太大的干扰。

下拉该组中一个著名的动画就是“下拉刷新”，它向用户展示了移动设备上的内容更新过程。提示：拉动刷新动画应与应用程序的设计大纲相匹配 - 如果应用程序最小，动画应该也是如此。通知因为运动自然地引起了人们的注意，动画通知是一种愉快的方式来通知用户一些事情，而且不会给用户造成太大的干扰。下拉该组中一个著名的动画就是“下拉刷新”，它向用户展示了移动设备上的内容更新过程。提示：拉动刷新动画应与应用程序的设计大纲相匹配 - 如果应用程序最小，动画应该也是如此。通知因为运动自然地引起了人们的注意，动画通知是一种愉快的方式来通知用户一些事情，而且不会给用户造成太大的干扰。

下拉该组中一个著名的动画就是“下拉刷新”，它向用户展示了移动设备上的内容更新过程。提示：拉动刷新动画应与应用程序的设计大纲相匹配 - 如果应用程序最小，动画应该也是如此。通知因为运动自然地引起了人们的注意，动画通知是一种愉快的方式来通知用户一些事情，而且不会给用户造成太大的干扰。下拉该组中一个著名的动画就是“下拉刷新”，它向用户展示了移动设备上的内容更新过程。`
      }
    },
    components: {
      Processbar,
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
