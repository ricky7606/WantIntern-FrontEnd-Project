<template lang="html">
  <div class="page-matters">
    <header-bar :list="TabbarResume"
      :selected="headerBarSelected"
      @change="headerBarChange"/>

  </div>
</template>

<script>
  // import * as Req from '@/api/index.js'
  // import * as ReqUrl from '@/api/url.js'

  import HeaderBar from '@/components/Enterprise/HeaderBar.vue'

  import {
    TabbarResume,
  } from '@/components/Enterprise/Enum.js'

  export default {
    name: 'Page-Matters',
    data () {
      return {
        TabbarResume,
        headerBarSelected: {},
      }
    },
    mounted () {
      this.headerBarChange(this.TabbarResume[0])
    },
    methods: {
      headerBarChange (item) {
        this.headerBarSelected = item
      },
    },
    components: {
      HeaderBar,
    },
  }
</script>

<style lang="less" scoped>
  .page-matters {

  }
</style>
