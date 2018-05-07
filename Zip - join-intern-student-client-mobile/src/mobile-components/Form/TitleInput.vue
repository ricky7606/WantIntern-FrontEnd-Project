<template lang="html">
  <div class="title-input flex-col flex-between">
    <div class="flex-row title" v-show="title">
      {{ title }}
    </div>
    <div class="flex-row">
      <input :type="type" :value="value" @input="onInput" :placeholder="placeholder"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'IconSelector',
    data () {
      return {
        temp: ''
      }
    },
    methods: {
      onInput (ev) {
        let val = ev.target.value
        this.$emit('input', val)
      }
    },
    props: {
      title: {
        type: String,
        default () {
          return ''
        }
      },
      type: {
        type: String,
        default () {
          return 'text'
        }
      },
      value: {
        type: String,
        default () {
          return ''
        }
      },
      placeholder: {
        type: String,
        default () {
          return ''
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/mobile.less";

  .title-input {
    width: 100%;
    display: flex;
    flex-direction: column;

    .title {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #656565;

      line-height: 33px;
      height: 33px;
      text-align: left;
      padding: 0 15px;
    }
    input {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      line-height: 44px;
      color: #333333;
      height: 44px;

      padding: 0 15px;
      width: 100%;

      &:-webkit-input-placeholder {
        color: #C5C5C5;
      }
    }
  }
</style>
