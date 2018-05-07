<template lang="html">
  <div class="page-feedback">
    <div class="content">
      <textarea class="input-box"
        placeholder="请输入相对我们说的话"
        v-model="inputContent"></textarea>
    </div>

    <div class="btn btn-submit"
      @click="submit"
      :class="{ enabled: isSubmitReady }">
      提交
    </div>

    <dialog-modal v-if="isModalShow"
      :content="modalContent"
      @close="closeModal"/>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'

  import DialogModal from '@/mobile-components/Utils/DialogModal.vue'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'PageFeedback',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()
    },
    data () {
      return {
        pageTitle: '意见反馈',
        inputContent: '',

        isModalShow: false,
        modalContent: '您的意见我们已经收到！\n先去首页逛逛吧~',
      }
    },
    components: {
      DialogModal,
    },
    computed: {
      isSubmitReady () {
        return !!this.inputContent
      }
    },
    methods: {
      submit () {
        if (this.isSubmitReady) {
          // submit
          this.showModal()

          let url = ReqUrl.OtherSubUrl.postFeedbacks()

          Req.Post(url, {
            content: this.inputContent
          }, res => {
            console.log(res)
          })

          this.inputContent = ''
        }
      },
      closeModal () {
        this.isModalShow = false
        this.$router.replace({
          name: 'PageAccount'
        })
      },
      showModal () {
        this.isModalShow = true
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../less/common.less';
  @import '../../less/mobile.less';

  .content {
    margin-bottom: 20px;

    textarea {
      width: 100%;
      height: 155px;
      background-color: white;
      padding: 17px 15px;

      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      line-height: 42px/2;
      color: #666666;

      &:-webkit-input-placeholder {
        color: #C5C5C5;
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
