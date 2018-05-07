<template lang="html">
  <div class="enterprise-entry-page">
    <page-header />

    <router-view />

    <page-footer :item-style="{
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      width: '100%'
      }" />
  </div>
</template>

<script>
  import PageHeader from '@/components/Parent/Header.vue'
  import PageFooter from '@/components/Parent/Footer.vue'

  import {
    TabbarResume,
  } from '@/components/Enterprise/Enum.js'

  export default {
    name: 'EnterpriseEntryPage',
    data () {
      return {
        TabbarResume,
      }
    },
    components: {
      PageHeader,
      PageFooter,
    }
  }
</script>

<style lang="less" scoped>
  @import "../less/common.less";
  .enterprise-entry-page {
    padding-top: 135px;
    padding-bottom: 120px;
    position: relative;
    min-height: 100vh;
  }
</style>
