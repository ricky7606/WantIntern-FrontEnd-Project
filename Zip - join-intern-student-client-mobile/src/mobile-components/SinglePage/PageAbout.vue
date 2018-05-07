<template lang="html">
  <div class="page-agreement">
    <div class="content" v-html="agreememtText"></div>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'
  // data
  // import * as MetaProxy from '@/api/proxy.js'

  export default {
    name: 'PageAbout',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()

      // MetaProxy.Get('STU_AGREEMENT', res => {
      //   this.agreememtText = res
      // })
    },
    data () {
      return {
        pageTitle: '关于我们',
        agreememtText: '介绍内容加载中...',
      }
    },
  }
</script>

<style lang="less" scoped>
  @import '../../less/mobile.less';
  .page-agreement {
    padding: 20px 15px;
  }
  .content {
    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #656565;
    line-height: 50px/2;

    text-align: left;
  }
</style>
