<template>
  <div class="company-intro">
    <template v-for="part in list">
      <div class="part">
        <div class="part-title">
          {{part.title}}
        </div>
        <div class="part-content">
          {{part.content}}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'CompanyIntro',
    data () {
      return {

      }
    },
    props: {
      list: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .company-intro {
    .part {
      display: block;
    }
    .part-title {
      font-family: PingFangSC-Regular;
      font-size: 20px;
      color: #454F66;
      letter-spacing: 0;
      position: relative;
      margin-bottom: 42px;

      &:after {
        display: inline-block;
        width: 20px;
        height: 2px;
        content: ' ';
        background-color: #0DABF4;
        position: absolute;
        left: 0;
        bottom: -20px;
      }
    }
    .part-content {
      margin-bottom: 60px;

      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #656565;
      letter-spacing: 0;
      line-height: 14px;
    }
  }
</style>
