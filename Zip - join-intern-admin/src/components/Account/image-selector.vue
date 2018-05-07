<template lang="html">
  <div class="image-selector">
    <template v-for="(item, index) in parsedNumberToList">
      <div class="image-selector-item" :style="item ? imgBg(item) : {}" @click="imageSelectorChange(item, index)">
        <div class="hint-text" v-show="item === ''">
          <div class="row plus">+</div>
          <div class="row" :class="{uploading: statusText}">{{statusText || hintText}}</div>
        </div>
        <input type="file" accept="image/jpeg,image/png,image/gif"
          @change="fileSelectChange($event, item, index)"
          class="file-input-cover">
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'image-selector',
    data () {
      return {
        statusText: '',
        parsedNumberToList: [],
      }
    },
    mounted () {
      this.parsedNumberToList = this.parseNumberToList()
    },
    methods: {
      imageSelectorChange (item) {
        // console.log(item)
      },
      // 头像
      fileSelectChange (ev, item, index) {
        let fileList = ev.target.files
        let imgFile = fileList[0]
        this.$emit('change', {
          index,
          oldUrl: item,
          file: imgFile,
        })
      },
      imgBg (url) {
        return {
          backgroundImage: `url(${url})`
        }
      },
      parseNumberToList () {
        let max = this.max || 1
        let mode = this.mode
        if (mode === 'autoadd') {
          max = this.valueList.length + 1
        }
        let valueList = this.valueList
        if (!Array.isArray(this.valueList)) valueList = [this.valueList]
        let value = valueList.filter(url => !!url)

        let list = []
        for (let i = 0; i < max; i++) {
          if (value[i]) {
            list.push(value[i])
          } else {
            list.push('')
          }
        }

        return list
      },
    },
    watch: {
      valueList () {
        this.parsedNumberToList = this.parseNumberToList()
        console.log(this.parsedNumberToList)
      }
    },
    props: {
      mode: {
        type: String,
        default: 'one2one',
        // default: 'autoadd',
      },
      list: {
        type: [Array, String],
        default () {
          return []
        }
      },
      max: {
        type: [Number, String],
        default: 1,
      },
      hintText: {
        type: String,
        default: '点击上传',
      },
      valueList: {
        type: [Array, String],
        default () {
          return []
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .image-selector {
    overflow: hidden;

    .file-input-cover {
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0;
    }
    .image-selector-item {
      display: inline-block;
      align-items: center;
      height: 100px;
      width: 100px;
      position: relative;
      float: left;
      margin-right: 20px;

      // background: #FFFFFF;
      border: 1px solid #E5E6EB;
      user-select: none;
      cursor: pointer;

      .icon();

      .hint-text {
        text-align: center;
        padding-top: 28px;

        .row {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #E5E6EB;
          letter-spacing: 0;
          line-height: 14px;

          &.plus {
            font-size: 20px;
            color: #BFBFBF;
            margin-bottom: 10px;
          }

          &.uploading {
            color: #0DABF4;
          }
        }
      }
    }
  }
</style>
