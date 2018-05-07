<template lang="html">
  <div class="points-row">
    <template v-for="p in defaultValue">
      <span class="point" v-if="p === 1"></span>
      <span class="point empty" v-if="p === 0"></span>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'PointsRow',
    data () {
      return {
        defaultValue: [
          0,
          0,
          0,
          0,
          0
        ]
      }
    },
    mounted () {
      let v = this.value
      let list = this.defaultValue

      this.defaultValue = list.map((item, index) => {
        if (index < v) {
          return 1
        } else {
          return 0
        }
      })
    },
    props: {
      value: {
        type: Number,
        default () {
          return 0
        }
      }
    },
    watch: {
      value () {
        let v = this.value
        let list = this.defaultValue
        console.log(v)
        this.defaultValue = list.map((item, index) => {
          if (index + 1 < v) {
            return 1
          } else {
            return 0
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .points-row {
    display: inline-block;

    .point {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #0DABF4;
      margin-right: 10px;

      &.empty {
        background-color: transparent;
        border: 1px solid #BFBFBF;
      }
    }
  }
</style>
