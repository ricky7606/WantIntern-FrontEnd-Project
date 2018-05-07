<template>
  <div class="news-card flex-row pointer-on" @click.stop="selectCard">
    <div class="left flex-col">
      <div class="flex-row">
        <div class="job-title">{{job.title}}</div>
      </div>
      <div class="flex-row pub-time">
        <span class="author">作者：{{job.author}}</span>
        <span class="time">{{job.createTime}}</span>
      </div>

      <div class="content ql-editor" v-html="job.content">
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
  </div>
</template>

<script>
  import { mapReqEdu } from '@/components/Position/Enum.js'
  import { styleFns } from '@/mixins/helperFuncs.js'
  import Img from '@/assets/pc-stu/index.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { Account } from '@/api/account.js'
  import '../../less/quill-style.less'

  export default {
    name: 'NewsCardExtended',
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
      selectCompany () {
        this.$emit('select-company', this.port)
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

<style lang="less">
  @import "../../less/common.less";
  @import '../../less/quill-style.less';

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
</style>
