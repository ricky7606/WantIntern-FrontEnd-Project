<template lang="html">
  <div class="page-reset-password">
    <div class="content">
      <title-input
        :key="phone.title"
        :title="phone.title"
        :type="phone.type"
        :placeholder="phone.placeholder"
        v-model="phone.value" />

        <div class="form-group">
          <div class="msg-box flex-row">
            <input type="text"
              v-model="msg.value"
              :placeholder="msg.placeholder" />

            <div class="btn-send">
              <span class="sep-line"></span>
              获取验证码
            </div>
          </div>
        </div>
    </div>

    <div class="btn btn-submit"
      @click="submit"
      :class="{ enabled: isSubmitReady }">
      确认
    </div>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'
  import TitleInput from '@/mobile-components/Form/TitleInput.vue'

  export default {
    name: 'PageResetPhone',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()
    },
    data () {
      return {
        pageTitle: '修改手机号',

        phone: {
          title: '重新绑定手机号',
          type: 'text',
          placeholder: '请输入新的手机号',
          value: '',
        },
        msg: {
          title: '',
          type: 'text',
          placeholder: '验证码',
          value: '',
        }
      }
    },
    components: {
      TitleInput,
    },
    methods: {
      checkSubmit () {
        let phoneValue = this.phone.value
        let msgValue = this.msg.value

        if (!phoneValue) return '请输入新的手机号'
        if (!msgValue) return '请输入验证码'

        return true
      },
      submit () {
        let txt = this.checkSubmit()

        if (txt === true) {
          console.log('submit')
        }
      }
    },
    computed: {
      isSubmitReady () {
        let txt = this.checkSubmit()
        return txt === true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../less/common.less';
  @import '../../less/mobile.less';

  .content {
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .form-group {
    margin-top: 10px;

    input {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      line-height: 44px;
      color: #333333;
      height: 44px;

      padding: 0 15px;
      width: 100%;

      &:-webkit-input-placeholder {
        color: #C5C5C5;
      }
    }

    .msg-box {
      padding-right: 105px;
      background-color: white;
      width: 100%;
      position: relative;
      line-height: 44px;
      height: 44px;

      .btn-send {
        width: 105px;
        text-align: center;

        font-family: PingFangSC-Regular;
        font-size: 30px/2;
        color: #0DABF4;
        position: absolute;
        right: 0px;
        top: 0px;
        line-height: 44px;
        height: 44px;

        .sep-line {
          height: 13.5px;
          border-left: 1px solid #C5C5C5;

          position: absolute;
          left: 0;
          top: 15.5px;
        }
      }
    }
  }

  .btn-submit {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #FFFFFF;

    background-color: #BFBFBF;

    &.enabled {
      background-color: #0DABF4;
    }
  }
</style>
