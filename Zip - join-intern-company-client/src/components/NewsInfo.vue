<template>
  <div class="news-page">
    <div class="main-content">

      <div class="row flex-row cards">
        <div class="card-list">
          <news-card-extended :content="content"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NewsCardExtended from './News/NewsCardExtended.vue'
  import * as MetaProxy from '@/api/proxy.js'

  export default {
    name: 'NewsInfo',
    data () {
      return {
        content: '',
      }
    },
    beforeRouteUpdate (to, from, next) {
      let type = to.params.type
      console.log(type)
      this.getData(type)
      next()
    },
    mounted () {
      let type = this.$route.params.type
      this.getData(type)
    },
    methods: {
      getData (type) {
        MetaProxy.Get(
          type,
          res => {
            // console.log(res)
            this.content = res
          }
        )
      },
    },
    components: {
      NewsCardExtended,
    }
  }
</script>

<style lang="less" scoped>
  @import "../less/common.less";

  .news-page {
    background-color: #F4F3F6;
    display: block;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .main-content {
    display: inline-block;
    width: @MIN-WIDTH;
    display: flex;
    flex-direction: column;
    text-align: left;
    align-items: flex-start;
    justify-content: flex-start;

    padding: 21px 0px;

    // 职位列表
    .cards {
      margin: 0 auto;

      .card-list {
        width: 940px;
        margin-right: 20px;
      }
      .right-banner {
        width: 300px;

        .info-banner-item {
          width: 300px;
          height: 170px;
          display: block;
        }
      }
    }
  }
</style>
