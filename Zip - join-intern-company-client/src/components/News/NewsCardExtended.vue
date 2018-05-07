<template>
  <div class="news-card flex-row pointer-on" @click.stop="selectCard">
    <div class="left flex-col">
      <div class="content" v-html="content">
      </div>
    </div>
  </div>
</template>

<script>
  import { styleFns } from '@/mixins/helperFuncs.js'
  import Img from '@/assets/pc-stu/index.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'NewsCard',
    mixins: [styleFns],
    data () {
      return {
        Img,
      }
    },
    methods: {
      selectCard () {
        this.$emit('select', this.port)
      },
      selectCompany () {
        this.$emit('select-company', this.port)
      },
      toggleStar () {
        // return
        let newsId = this.job.id
        let b = !this.starred

        if (b) {
          Req.Post(ReqUrl.NewsSubUrl.postStarNewsItem(newsId),
            {},
            res => {
              this.$emit('update', res)
              this.job.starred = false
            },
            failErr => {
              console.warn(failErr)
              this.$router.push({
                name: 'Register',
              })
            }
          )
        } else {
          Req.Delete(ReqUrl.NewsSubUrl.deleteStarNewsItem(newsId),
            {},
            res => {
              this.$emit('update', res)
              this.job.starred = true
            },
            failErr => {
              console.warn(failErr)
              this.$router.push({
                name: 'Register',
              })
            }
          )
        }
      },
    },
    computed: {
      job () {
        return this.port
      },
      starred () {
        return !!this.job.starred
      },
    },
    // watch: {
    //   port () {
    //     this.job = this.port
    //   }
    // },
    props: {
      content: {
        type: String,
        default () {
          return ''
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .news-card {
    display: flex;
    background-color: white;
    padding: 30px;
    // height: 200px;
    flex-direction: row;
    margin-bottom: 1px;
    user-select: none;

    .left {
      flex-grow: 1;
    }
    .job-title {
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: #454F66;
      letter-spacing: 0;
      line-height: 22px;
      margin-bottom: 20px;
    }

    .content {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #454F66;
      letter-spacing: 0;
      line-height: 26px;
      margin-bottom: 30px;
      margin-top: 38px;

      width: 100%;
    }
    .footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-top: 30px;
    }
    .pub-time {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #BFBFBF;
      letter-spacing: 0;
      line-height: 16px;

      span {
        margin-right: 1.4em;
      }
    }

    .news-msg {
      font-family: AvenirNext-Regular;
      font-size: 14px;
      color: #9B9B9B;
      line-height: 14px;

      &.starred {
        color: #0DABF4;
      }

      .view-icon,
      .star-icon {
        margin-left: 20px;
        margin-right: 10px;
        width: 21px;
        height: 14px;
        display: inline-block;

        .icon();
      }
    }
  }
</style>
