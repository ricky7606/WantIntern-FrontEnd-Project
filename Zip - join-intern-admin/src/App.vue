<template>
  <div id="app">
    <!-- <div class="placer-box">
      <page-header />
    </div> -->
    <div class="extend-body">
      <router-view />
    </div>
    <!-- <page-footer /> -->
  </div>
</template>

<script>
  import PageHeader from './components/Parent/Header.vue'
  import PageFooter from './components/Parent/Footer.vue'

  export default {
    name: 'app',
    components: {
      PageHeader,
      PageFooter
    }
  }
</script>

<style lang="less">
  @import "./less/reset.less";
  html {
    min-height: 100%;
  }
  body {
    min-height: 100%;
  }
  #app {
    font-family: 'PingFangSC-Regular', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    min-height: 100%;
    background-color: #F4F3F6;

    .extend-body {
      display: block;
      min-height: 800px;
      min-height: 100vh;
      // margin-bottom: -114px;
      // padding-bottom: 114px;
    }
  }
  .placer-box {
    position: relative;
    height: 70px;
  }
</style>
