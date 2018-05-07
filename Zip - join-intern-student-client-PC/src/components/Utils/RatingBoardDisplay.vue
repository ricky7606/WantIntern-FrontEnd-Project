<template lang="html">
  <div class="rating-board-display">
    <div class="header">
      <span class="icon"></span>
      <span class="name">学生宝宝</span>
      <span class="time">{{itemMap.createTime}}</span>
    </div>
    <div class="content">
      <div class="total-rank">综合评分 {{parseAverageRate(itemMap)}}</div>
      <template v-for="row in mergeRankDataList">
        <div class="row">
          <span class="title">{{row.title}}</span>
          <points-row v-model="row.value"/>
          <span class="value">{{row.value}}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import { mapRankState } from '@/api/enum.js'
  import PointsRow from '@/components/Utils/PointsRow.vue'

  export default {
    name: 'RatingBoardDisplay',
    data () {
      return {
        rankData: null,
        totalPoint: 0,
        rankDataList: [
          {
            title: '同事氛围',
            value: 0,
          },
          {
            title: '学习机会',
            value: 0,
          },
          {
            title: '职业发展',
            value: 0,
          },
          {
            title: '办公环境',
            value: 0,
          },
          {
            title: '福利待遇',
            value: 0,
          },
        ],
      }
    },
    methods: {
      update () {
        let list = this.rankDataList
        let result = list.reduce((dict, item, index) => {
          let key = `score${index + 1}`
          dict[key] = item.value
          return dict
        }, {})

        this.$emit('update', result)
      },
      parseAverageRate (item) {
        if (!item) return item
        let counts = 0

        counts = counts + item['score1']
        counts = counts + item['score2']
        counts = counts + item['score3']
        counts = counts + item['score4']
        counts = counts + item['score5']

        return counts / 5
      },
    },
    props: {
      itemMap: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      mergeRankDataList () {
        let d = this.itemMap
        let list = this.rankDataList

        console.log(d)
        return list.map((item, index) => {
          item.value = d[`score${index + 1}`]
          return item
        })
      },
      rankList () {
        let data = this.rankData
        // let data = {
        //   score1: 2.5,
        //   score2: 2.5,
        //   score3: 2.5,
        //   score4: 2.5,
        //   score5: 2.5
        // }
        let titleList = mapRankState.titleList
        let keyList = [
          'score1',
          'score2',
          'score3',
          'score4',
          'score5',
        ]

        if (!data) return []

        let totalPointValue = 0
        return keyList.map((key, i) => {
          totalPointValue += data[key]

          this.totalPoint = totalPointValue / (i + 1)
          return {
            title: titleList[i],
            value: data[key]
          }
        })
      },
    },
    components: {
      PointsRow,
    },
  }
</script>

<style lang="less" scoped>
  .rating-board-display {
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      margin-bottom: 10px;

      .time {
        margin-left: 5px;
      }
    }
    .content {
      padding-left: 40px;
    }
    .icon {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
      background-color: gray;
    }
    .total-rank {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #0DABF4;
      line-height: 16px;
      margin-bottom: 10px;
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #9B9B9B;
      line-height: 14px;

      margin-right: 20px;
      margin-bottom: 10px;
    }
    .value {
      font-family: AvenirNext-Regular;
      font-size: 14px;
      color: #0DABF4;
      line-height: 14px;

      margin-left: 5px;
    }
  }
</style>
