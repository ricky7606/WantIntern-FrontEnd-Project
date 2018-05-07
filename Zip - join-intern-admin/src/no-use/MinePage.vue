<template lang="html">
  <div class="mine-page">
    <page-header />

    <div class="content">
      <div class="view-board">
        <router-view />
      </div>
    </div>

    <div class="footer">
      <page-footer />
    </div>
  </div>
</template>

<script>
  import PageHeader from '@/components/Parent/Header.vue'
  import PageFooter from '@/components/Parent/Footer.vue'

  export default {
    name: 'MinePage',
    components: {
      PageHeader,
      PageFooter,
    },
  }
</script>

<style lang="less" scoped>
  @import "../less/common.less";

  .mine-page {
    background-color: white;
    padding-top: 135px;

    .content {
      display: block;
      width: 100%;
      text-align: center;

      .view-board {
        width: @MIN-WIDTH;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        min-height: 80vh;

        .left {
          text-align: left;
          padding-top: 65px;
          width: 820px;
          float: left;
        }
        .right {
          width: 440px;
          float: right;
          padding-top: 40px;
          padding-left: 30px;
          position: relative;
          overflow: hidden;

          .promoted-position-list {
            .promoted-position-list__title {
              font-family: PingFangSC-Regular;
              font-size: 24px;
              color: #454F66;
              letter-spacing: 0;
              line-height: 24px;
              margin-bottom: 10px;
            }

            .list {
              .border-bottom {
                display: block;
                border-bottom: 1px solid #E5E6EB;

              }
              div:last-of-type {
                border-bottom: 0px;
              }
            }
            .btn-loadmore {
              border: 1px solid #E5E6EB;
              width: 100%;
              height: 56px;
              line-height: 56px;
              text-align: center;

              margin-bottom: 30px;
            }
          }
        }
      }
    }
  }

  .namecard-box {
    border-bottom: 1px solid #E5E6EB;
  }
  .margin-bottom-40 {
    margin-bottom: 40px;
  }
  .padding-bottom-40 {
    padding-bottom: 40px;
  }
</style>
