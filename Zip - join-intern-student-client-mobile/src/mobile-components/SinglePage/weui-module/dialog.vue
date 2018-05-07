<template lang="html">
  <div class="weui-js_dialog js_dialog" @touchmove.stop.prevent="">
    <div class="weui-mask" @click="clickMask"></div>
    <div class="weui-dialog">
      <div class="weui-dialog__hd">
        <strong class="weui-dialog__title">{{ params.title }}</strong>
      </div>
      <div class="weui-dialog__bd">
        <!-- {{ params.content }} -->
        <div class="row" v-for="rowContent in params.content.split('\n')">
          {{rowContent}}
        </div>
      </div>

      <div class="weui-dialog__ft">
        <a href="javascript:;"
        v-for='btn in params.btnList'
        @click="btnClick(btn)"
        class="weui-dialog__btn"
        :class="[btn.type === 'primary' ? 'weui-dialog__btn_primary' : 'weui-dialog__btn_default']">
        {{ btn.title }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {
  G_EVENT_HUB,
  COMMON_DIALOG_BUTTON_CLICK,
} from '@/api/global'

export default {
  name: 'WeUIDialog',
  data () {
    return {}
  },
  methods: {
    btnClick (btn) {
      G_EVENT_HUB.$emit(COMMON_DIALOG_BUTTON_CLICK, btn)
      if (this.params && this.params.onclick) {
        this.params.onclick(btn)
      }
      this.hide(btn)
    },
    hide (data) {
      this.$emit('hide', data)
    },
    clickMask () {
      if (this.params.clickMaskHide) {
        this.hide({ type: 'hidden' })
      }
    },
  },
  props: {
    params: {
      default () {
        return {
          title: false,
          content: '',
          btnList: [
            {
              title: '确定',
            }
          ]
        }
      }
    }
  },
}
</script>

<style lang="less">
  @import '../../../node_modules/weui/src/style/weui';
  @import '../../../node_modules/weui/src/style/widget/weui-tips/weui-dialog.less';
</style>
