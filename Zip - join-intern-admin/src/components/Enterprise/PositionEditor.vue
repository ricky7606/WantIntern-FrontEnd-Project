<template lang="html">
  <div class="position-editor">
    <div class="view-board">
      <div class="board-title">
        {{ isCreateNew ? '发布新职位' : '修改职位' }}
      </div>
      <position-form-inline v-if="gotPosId" :posid="posId"/>
    </div>
  </div>
</template>

<script>
  import PositionFormInline from '@/components/Position/PositionFormInline.vue'

  export default {
    name: 'PositionEditor',
    mounted () {
      let params = this.$route.params

      let id = params.id
      let leagalId = id === 'new' || parseInt(id)

      if (!leagalId) {
        alert('返回上一页')
      } else {
        if (id === 'new') {
          this.isCreateNew = true
          this.posId = params.id
        } else {
          this.posId = params.id
        }
      }
      this.$nextTick(() => {
        this.gotPosId = true
      })
    },
    data () {
      return {
        posId: '',
        isCreateNew: false,
        gotPosId: false,
      }
    },
    components: {
      PositionFormInline,
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .position-editor {
    display: block;
    background-color: white;

    .view-board {
      width: @MIN-WIDTH;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      min-height: 80vh;
      text-align: left;

      .board-title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #819292;
        letter-spacing: 0;
        line-height: 16px;
        margin-top: 30px;
        margin-bottom: 20px;
      }
    }
  }
</style>
