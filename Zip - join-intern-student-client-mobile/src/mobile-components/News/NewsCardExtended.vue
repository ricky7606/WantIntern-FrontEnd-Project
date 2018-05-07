<template>
  <div class="news-card flex-col" @click.stop="selectCard">
    <div class="flex-row">
      <div class="job-title">{{job.title}}</div>
    </div>
    <div class="flex-row flex-between pub-time">
      <span class="author">作者：{{job.author}}</span>
      <span class="time">{{ parseDateString(job.createTime) }}</span>
    </div>

    <div class="content ql-container ql-editor" v-html="job.content">
    </div>

    <div class="footer flex-row">
      <div class="empty"></div>

      <div class="flex-row news-msg" :class="{starred: starred}">
        <span class="view">
          <span class="view-icon" :style="imgBg(false ? Img.icon62 : Img.icon61)"></span>
          {{job.view}}
        </span>
        <span class="star" @click="toggleStar">
          <span class="star-icon" :style="imgBg(starred ? Img.icon72 : Img.icon71)"></span>
          {{job.star}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapReqEdu } from '@/components/Position/Enum.js'
  import { styleFns } from '@/mixins/helperFuncs.js'
  import Img from '@/assets/pc-stu/index.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { Account } from '@/api/account.js'

  import 'quill/dist/quill.bubble.css'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import '../../less/quill.less'

  export default {
    name: 'NewsCard',
    mixins: [styleFns],
    data () {
      return {
        Img,
        mapReqEdu,
      }
    },
    methods: {
      selectCard () {
        this.$emit('select', this.port)
      },
      parseDateString (str) {
        if (!str) return str
        return str.replace(/-/g, '.').substr(0, 16)
      },
      toggleStar () {
        if (!Account.accountInfo.accountId) {
          this.$router.push({
            name: 'Register',
          })
          return
        }

        let newsId = this.job.id
        let b = !this.starred

        if (b) {
          Req.Post(ReqUrl.NewsSubUrl.postStarNewsItem(newsId),
            null,
            res => {
              this.$emit('update', res)
              this.job.starred = true
            },
            failErr => {
              this.$router.push({
                name: 'Register',
              })
            }
          )
        } else {
          // 取消赞
          // Req.Delete(ReqUrl.NewsSubUrl.deleteStarNewsItem(newsId),
          //   null,
          //   res => {
          //     this.$emit('update', res)
          //     this.job.starred = false
          //   },
          //   failErr => {
          //     this.$router.push({
          //       name: 'Register',
          //     })
          //   }
          // )
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
    props: {
      port: {
        type: [Object, undefined],
        default () {
          return {
            company: {}
          }
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/mobile.less";

  .news-card {
    display: flex;
    background-color: white;
    padding: 15px;
    padding-top: 21px;
    padding-bottom: 20px;
    user-select: none;

    .job-title {
      font-family: PingFangSC-Medium;
      font-size: 34px/2;
      color: #333333;
      line-height: 52px/2;
      text-align: left;

      margin-bottom: 15px;
    }

    .content {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #333333;
      line-height: 52px/2;
      text-align: left;

      width: 100%;
      overflow: hidden;

      padding-bottom: 15px;
      border-bottom: 1px solid #EDEEF1;

      p {
        max-width: 100%;
      }
      img {
        max-width: 100%;
        position: absolute;
      }
      p > img {
        max-width: 100% !important;
        width: 100% !important;
      }
    }
    .footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-top: 21px;
    }
    .pub-time {
      font-family: AvenirNext-Regular;
      font-size: 26px/2;
      color: #9B9B9B;
      line-height: 26px/2;
      margin-bottom: 15px;
    }

    .news-msg {
      font-family: AvenirNext-Regular;
      font-size: 14px;
      color: #9B9B9B;
      line-height: 14px;

      &.starred {
        .star {
          color: #0DABF4;
        }
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
  p > img {
    max-width: 100% !important;
    width: 100% !important;
  }
</style>
