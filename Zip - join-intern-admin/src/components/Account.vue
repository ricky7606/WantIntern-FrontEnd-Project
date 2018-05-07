<template lang="html">
  <div class="account-page align-left" :style="{width: `${defaultWidth}px`}">
    <logo-header />
    <router-view />
  </div>
</template>

<script>
  import LogoHeader from './Account/LogoHeader.vue'
  const DEFAULT_WIDTH = 645
  const DEFAULT_SHORT_WIDTH = 382

  export default {
    name: 'AccountPage',
    data () {
      return {
        defaultWidth: DEFAULT_WIDTH,
      }
    },
    mounted () {
      let route = this.$route

      let shortWidthList = ['ForgetPassword', 'Login']
      if (shortWidthList.indexOf(route.name) !== -1) {
        this.defaultWidth = DEFAULT_SHORT_WIDTH
      } else {
        this.defaultWidth = DEFAULT_WIDTH
      }
    },
    components: {
      LogoHeader,
    },
    beforeRouteUpdate (to, from, next) {
      let shortWidthList = ['ForgetPassword']
      if (shortWidthList.indexOf(to.name) !== -1) {
        this.defaultWidth = DEFAULT_SHORT_WIDTH
      } else {
        this.defaultWidth = DEFAULT_WIDTH
      }
      next()
    },
  }
</script>

<style lang="less" scoped>
  @import "../less/common.less";

  .account-page {
    display: block;
    padding-top: 150px;
    margin: 0 auto;
    width: 645px;
  }
  .auto-center {
    margin: 0 auto;
  }
</style>
