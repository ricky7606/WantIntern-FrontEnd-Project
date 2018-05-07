<template lang="html">
  <div class="page-rate-company">
    <div class="header">
      <div class="flex-row">请对{{ companyTitle }}做出评价</div>
      <div class="flex-row">(1分为最低分，5分为最高分)</div>
    </div>

    <div class="list">
      <div class="flex-col rate-row" v-for="row in ratingList">
        <div class="title">
          {{ row.title }}
        </div>
        <div class="flex-row point-row">
          <span class="point"
            :class="{selected: row.value >= num}"
            @click="select(row, num)"
            v-for="num in pointsRow">
            {{ num }}
          </span>
        </div>
      </div>
    </div>
    <div class="btn btn-submit"
      @click="submit">
      提交
    </div>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'
  // data
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { ParsePagination } from '@/utils/helper-functions.js'
  // import { ToggleCheck } from '@/assets/wechat-stu/index.js'
  import { Toast } from 'mint-ui'

  const DEFAULT_PAGE_SIZE = 8

  export default {
    name: 'PageRateCompany',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()
      let id = this.$route.params.id
      this.loadItem(id, resumeId => {
        this.loadResumeItem(resumeId)
      })
    },
    data () {
      return {
        pageTitle: '评价',

        pointsRow: [1, 2, 3, 4, 5],
        ratingList: [
          '同事氛围', '学习机会', '职业发展', '办公环境', '福利待遇'
        ].map((title, index) => {
          return {
            title,
            key: `score${index + 1}`,
            value: 0,
          }
        }),
      }
    },
    props: {
      companyTitle: {
        type: String,
        default () {
          return ''
        }
      }
    },
    methods: {
      loadData (pageIndex = 1) {
        let url = ReqUrl.Notification.getList()
        Req.Get(url, {
          pageSize: DEFAULT_PAGE_SIZE,
          pageIndex: pageIndex,
        }, res => {
          this.list = res.items
          this.pagination = ParsePagination(res.pagination)
        }, fail => {
          console.log(fail)
          if (fail.response.data.status === 401) {
            Toast(fail.response.data.userMessage)
            setTimeout(x => {
              this.$router.replace({
                name: 'PageAccount'
              })
            }, 1000)
          }
        })
      },
      loadItem (id, next = id => id) {
        let url = ReqUrl.Notification.getItem(id)
        Req.Get(
          url,
          {},
          res => {
            this.msgContent = res
            next(res.refId)
          },
          fail => {
            if (fail.response.data.status === 401) {
              Toast(fail.response.data.userMessage)
              setTimeout(x => {
                this.$router.replace({
                  name: 'PageAccount'
                })
              }, 1000)
            }
          }
        )
      },
      select (item, num) {
        if (item.value === num) {
          item.value = 0
        } else {
          item.value = num
        }
      },
      submit () {
        // item.value = num
        let result = this.ratingList.reduce((d, item) => {
          d[item.key] = item.value || 0
          return d
        }, {})

        this.$emit('submit', result)
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../less/mobile.less';
  .page-rate-company {
    .header {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #9B9B9B;
      line-height: 36px/2;
      display: flex;
      flex-direction: column;
      text-align: left;

      padding: 20px 15px;
    }
    .list {
      padding: 0 15px;
    }
    .rate-row {
      border-bottom: 1px solid #EDEEF1;
      margin-bottom: 20px;

      .title {
        font-family: PingFangSC-Regular;
        font-size: 30px/2;
        color: #656565;
        line-height: 30px/2;
        text-align: left;
      }
      .point-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 20px 0;
        width: 100%;

        .point {
          display: inline-block;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;

          font-family: AvenirNext-Medium;
          font-size: 44px/2;
          color: #BFBFBF;

          border: 1px solid #BFBFBF;
          border-radius: 50%;
          width: 30px;
          height: 30px;

          &.selected {
            background-color: #0DABF4;
            border-color: #0DABF4;
            color: white;
          }
        }
      }
    }

    .btn-submit {
      width: 100%;
      height: 44px;
      line-height: 44px;
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #FFFFFF;

      // background-color: #BFBFBF;
      background-color: #0DABF4;
    }
  }
</style>
