<template lang="html">
  <div class="enum-selector">
    <template v-for="item in list">
      <div class="selector-item" @click="select(item)">
        <span class="opt-round" :class="{selected: selected === item.key}"></span>
        <span class="title">{{ item.title }}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'EnumSelector',
  data () {
    return {}
  },
  methods: {
    select (item) {
      this.$emit('change', item)
    },
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
        return null
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
</style>
