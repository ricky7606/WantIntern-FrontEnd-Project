<template lang="html">
  <div class="boolean-selector pointer-on"
    :class="{selected: selected}"
    @click="booleanChange">
    <span class="title">
      {{item.title}}
    </span>
    <span class="boolean-btn col">
    </span>
  </div>
</template>

<script>
  export default {
    name: 'boolean-selector',
    methods: {
      booleanChange (ev, item) {
        this.$emit('change', {
          value: !this.selected
        })
      },
    },
    props: {
      item: {
        type: Object,
        default () {
          return []
        }
      },
      selected: {
        type: [Boolean, String],
        default () {
          return false
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .boolean-selector {
    overflow: hidden;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #0DABF4;
    letter-spacing: 0;
    line-height: 14px;
    user-select: none;

    .boolean-btn {
      width: 12px;
      height: 12px;
      margin-left: 5px;
      vertical-align: middle;
      border: 1px solid #E5E6EB;
    }

    &.selected {
      .boolean-btn {
        border: 1px solid #0DABF4;
        background-color: #0DABF4;
      }
    }
  }
</style>
