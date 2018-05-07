<template lang="html">
  <div class="page-matters">
    <header-bar :list="TabbarInterns"
      :selected="headerBarSelected"
      @change="headerBarChange"/>
  </div>
</template>

<script>
  import HeaderBar from '@/components/Enterprise/HeaderBar.vue'

  import {
    TabbarInterns,
  } from '@/components/Enterprise/Enum.js'

  export default {
    name: 'Page-Interns-Management',
    data () {
      return {
        TabbarInterns,
        headerBarSelected: {},
      }
    },
    mounted () {
      this.headerBarChange(this.TabbarInterns[0])
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
