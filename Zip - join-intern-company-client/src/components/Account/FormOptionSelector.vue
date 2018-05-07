<template lang="html">
  <div class="enum-selector" :style="itemStyle">
    <select ref="option-enum" placeholder="请选择" v-model="temp" @change="select">
      <option value=""></option>
      <option :value="item.key"
        v-for="item in parseList(list)">{{item.title}}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Form-Option-Selector',
  data () {
    return {
      temp: '',
    }
  },
  methods: {
    select (ev) {
      let index = ev.target.selectedIndex
      console.log(index)
      let list = ['', ...this.list]
      this.$emit('change', list[index])
    },
    parseList (list) {
      if (!list) return list

      // let item = list[0]
      // 保证元素有value字段
      return list.map(item => {
        if (!item.value) {
          if (item.key) {
            item.value = item.key
          }
        }
        return item
      })
    },
  },
  watch: {
    temp () {
      console.log(this.temp)
    },
    selected () {
      let index = 0
      this.list.forEach((item, i) => {
        if (item.value === this.selected) {
          index = i
        }
      })

      let target = this.$refs['option-enum']
      target.selectedIndex = index + 1
    }
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    selected: {
      type: [String, Number],
      default () {
        return 0
      }
    },
    itemStyle: {
      type: Object,
      default () {
        return {}
      }
    },
  },
}
</script>

<style lang="less" scoped>
  .enum-selector {
    user-select: none;
    cursor: pointer;

    .selector-item {
      display: inline-block;
      margin-right: 30px;
    }
    .opt-round {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #EDEEF1;
      border: 1px solid #D3D5DC;
      margin-right: 6px;

      &.selected {
        background: #0DABF4;
        border-color: #0DABF4;
      }
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #454F66;
      letter-spacing: 0;
      line-height: 14px;
    }
  }

  select {
    background-color: white;

    font-family: PingFangSC-Regular;
    font-size: 14px;
    // color: #E5E6EB;
    letter-spacing: 0;
    line-height: 14px;
  }
</style>
