<template lang="html">
  <div class="points-row">
    <template v-for="(p, index) in defaultValue">
      <span class="point" v-if="p === 1" @click="change(index)">
        {{ index + 1 }}
      </span>
      <span class="point empty" v-if="p === 0" @click="change(index)">
        {{ index + 1 }}
      </span>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'RatingRow',
    data () {
      return {
        defaultValue: [
          0,
          0,
          0,
          0,
          0,
        ]
      }
    },
    methods: {
      change (index) {
        this.$emit('input', index + 1)
      },
      translate () {
        let v = this.value
        let list = this.defaultValue

        this.defaultValue = list.map((item, index) => {
          if (index + 1 <= v) {
            return 1
          } else {
            return 0
          }
        })
      },
    },
    mounted () {
      this.translate()
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
        this.translate()
      }
    }
  }
</script>

<style lang="less" scoped>
  .points-row {
    display: inline-block;

    .point {
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 50%;
      background-color: #0DABF4;
      margin-right: 10px;
      color: white;
      cursor: pointer;

      font-size: 12px;
      text-align: center;
      &.empty {
        background-color: transparent;
        border: 1px solid #BFBFBF;
        color: #BFBFBF;
      }
    }
  }
</style>
