<template lang="html">
  <div class="page-reset-password">
    <div class="content">
      <title-input v-for="line in inputList"
        :key="line.title"
        :title="line.title"
        :type="line.type"
        :placeholder="line.placeholder"
        v-model="line.value" />
    </div>

    <div class="btn btn-submit"
      @click="submit"
      :class="{ enabled: isSubmitReady }">
      修改
    </div>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'
  import TitleInput from '@/mobile-components/Form/TitleInput.vue'

  const inputList = [
    {
      title: '原密码',
      type: 'password',
      placeholder: '请输入原密码',
    },
    {
      title: '新密码',
      type: 'password',
      placeholder: '请输入新密码',
    },
    {
      title: '确认密码',
      type: 'password',
      placeholder: '请确认密码',
    },
  ]
  export default {
    name: 'PageResetPassword',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()
    },
    data () {
      return {
        pageTitle: '修改密码',

        inputList: inputList.map(item => {
          item.value = ''
          return item
        }),
      }
    },
    components: {
      TitleInput,
    },
    methods: {
      checkSubmit () {
        let list = this.inputList
        let origin = list[0].value
        let newPs = list[1].value
        let confirm = list[2].value

        if (!origin) return '请输入原密码'
        if (!newPs) return '请输入新秘密'
        if (!confirm) return '请确认密码'

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
