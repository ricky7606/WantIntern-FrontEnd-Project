<template lang="html">
  <div class="row tabbar">
    <div class="col tab pointer-on"
      :class="{selected: tab.key === selected}"
      @click="select(tab)"
      v-for="tab in TabbarList">
      {{ tab.title }}
    </div>
  </div>
</template>

<script>
  import { TabbarList } from '@/components/Parent/TabbarEnum.js'

  export default {
    name: 'Tabbar',
    data () {
      return {
        TabbarList,
      }
    },
    methods: {
      select (tab) {
        this.$emit('change', tab)
      },
    },
    props: {
      selected: {
        type: String,
        default () {
          return ''
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .tabbar {
    display: block;

    .tab {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #656565;
      letter-spacing: 0;
      line-height: 16px;
      padding: 20px 25px;
      user-select: none;

      &:first-child {
        padding-left: 10px;
      }
      &.selected {
        color: #0DABF4;
      }
    }
  }
</style>
