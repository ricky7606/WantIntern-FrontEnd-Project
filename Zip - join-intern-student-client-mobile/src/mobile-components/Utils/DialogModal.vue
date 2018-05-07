<template lang="html">
  <div class="dialog-modal" @touchmove.stop.prevent="">
    <div class="content">
      <div class="btn-close" @click="close('close')">
        <span class="icon" :style="AccountPage.close | imgbg"></span>
      </div>
      <div class="title">
        {{ title }}
      </div>
      <div class="modal-content" v-html="content">
      </div>
      <div class="modal-action">
        <div class="btn btn-ok" @click="close('ok')">
          好
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { AccountPage } from '@/assets/wechat-stu/index.js'

  export default {
    name: 'DialogModal',
    data () {
      return {
        AccountPage,
      }
    },
    methods: {
      close (cmd) {
        this.$emit('close', cmd)
      }
    },
    props: {
      title: {
        type: String,
        default () {
          return '提示'
        }
      },
      content: {
        type: String,
        default () {
          return ''
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../less/common.less';
  @import '../../less/mobile.less';

  .dialog-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    width: 100vw;
    height: 100vh;

    background-color: rgba(0,0,0,0.6);

    display: flex;
    align-items: center;
    justify-content: center;

    .content {
      background-color: white;
      border-radius: 3px;
      padding: 20px 15px;
      position: relative;

      width: 262px;
      display: flex;
      align-items: center;

      flex-direction: column;

      .btn-close {
        position: absolute;
        top: 0px;
        right: 0px;
        .sqr(30.5px);

        text-align: left;

        .icon {
          position: relative;
          top: 15px;

          display: inline-block;
          .sqr(15.5px);
          .icon();
        }
      }

      .title {
        font-family: PingFangSC-Regular;
        font-size: 36px/2;
        color: #0DABF4;
        margin-bottom: 19px;
      }
      .modal-content {
        font-family: PingFangSC-Light;
        font-size: 36px/2;
        color: #666666;
        line-height: 51px/2;

        margin-bottom: 25.5px;
        width: 100%;
        text-align: center;
        white-space: pre-line;
      }
      .modal-action {
        width: 100%;

        .btn-ok {
          background-color: #0DABF4;
          border-radius: 2px;
          width: 100%;
          display: block;
          height: 36px;
          line-height: 36px;
          text-align: center;
          width: 100%;

          font-family: PingFangSC-Regular;
          font-size: 36px/2;
          color: #FFFFFF;
        }
      }
    }
  }
</style>
