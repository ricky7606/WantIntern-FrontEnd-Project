<template lang="html">
  <div class="wechat-m-footer flex-row">
    <div class="flex-col footer-item"
      :class="{selected: selectedIndex === index}"
      v-for="(item, index) in list"
      @click="selectItem(item, index)">

      <div class="col icon" :style="(selectedIndex === index ? item.iconSelected : item.icon) | imgbg"></div>
      <div class="title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Footer',
    methods: {
      selectItem (item, index) {
        this.$emit('change', index)
      },
    },
    props: {
      list: {
        type: Array,
        default () {
          return []
        }
      },
      selectedIndex: {
        type: Number,
        default () {
          return 0
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .wechat-m-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    background: #FBFBFB;
    height: 49px;

    .footer-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 25px;

      .title {
        ont-family: PingFangSC-Light;
        font-size: 21px/2;
        line-height: 21px/2;
        color: #8B929A;
      }
      .icon {
        display: inline-block;
        .sqr(20px);

        .icon();

        margin-bottom: 6.5px;
      }
      &.selected {
        .title {
          color: #0DABF4;
        }
      }
    }
  }
</style>
