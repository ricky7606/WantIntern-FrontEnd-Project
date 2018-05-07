<template lang="html">
  <div class="news-editor xsx-form-theme">
    <quill-editor v-model="text"/>

    <div class="footer">
      <div class="btn col btn-save" @click="save">
        保存
      </div>
    </div>
  </div>
</template>

<script>
  import * as MetaProxy from '@/components/Admin/proxy.js'

  export default {
    name: 'NewsEditor',
    data () {
      return {
        text: '',
      }
    },
    mounted () {
      MetaProxy.Get(this.tag, res => {
        // console.log(this.tag)
        // console.log(res)
        if (res) {
          this.text = res
        }
      })
    },
    watch: {
      tag () {
        MetaProxy.Get(this.tag, res => {
          console.log(this.tag)
          console.log(res)
          this.text = res
        })
      }
    },
    methods: {
      save () {
        MetaProxy.Set(this.tag, this.text, res => {
          console.log(res)
          alert('保存成功')
        }, fail => {
          if (fail.response.data) {
            alert(fail.response.data.userMessage)
          }
        })
      },
    },
    props: {
      tag: {
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
  @import "../../less/form.less";

  .news-editor {
    width: 800px;
    height: 800px;
    padding: 30px;

    .label {
      font-size: 14px;
    }
    input {
      border: 1px solid #ccc;
      width: 500px;
    }
    .row {
      margin-bottom: 5px;
    }
    .footer {
      margin-top: 20px;

      .btn {
        margin: 5px;
      }
    }

    .ql-container {
      min-height: 400px;
    }
  }
</style>
