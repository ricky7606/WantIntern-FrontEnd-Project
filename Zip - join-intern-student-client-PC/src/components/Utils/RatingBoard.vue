<template lang="html">
  <div class="rating-board">
    <template v-for="row in rankDataList">
      <div class="row">
        <span class="title">{{row.title}}</span>
        <rating-row @input="update" v-model="row.value"/>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapRankState } from '@/api/enum.js'
  import RatingRow from '@/components/Utils/RatingRow.vue'

  export default {
    name: 'RatingBoard',
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
      }
    },
    computed: {
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
      }
    },
    components: {
      RatingRow,
    }
  }
</script>

<style lang="less" scoped>
  .rating-board {
    .title {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #9B9B9B;
      line-height: 14px;

      margin-right: 20px;
    }
    .value {
      font-family: AvenirNext-Regular;
      font-size: 14px;
      color: #0DABF4;
      line-height: 14px;

      margin-left: 20px;
    }
  }
</style>
