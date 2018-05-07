<template lang="html">
  <div class="admin-index xsx-form-theme">
    <table class="content">
      <tr class="col-header" v-show="header.length">
        <th>序号</th>
        <th class="width-300" v-for="hd in header">
          {{hd.title}}
        </th>
        <th>操作</th>
      </tr>
      <template v-for="(row, rowIndex) in tempList">
        <tr>
          <td class="col-index">
            {{rowIndex + 1}}
          </td>
          <template v-for="hd in header">
            <td class="title width-300" v-if="hd.type === 'String'">
              <input type="text" v-model="row[hd.key]" class="width-290 small">
            </td>
            <td class="title width-300" v-if="hd.type === 'Number'">
              <input type="Number" v-model="row[hd.key]" class="width-290 small">
            </td>
            <td class="title img-container" v-if="hd.type === 'Image'">
              <div class="image-wrap">
                <image-selector :value-list="row[hd.key]"
                  @change="imageSelectorChage($event, row, hd.key)"
                  :max="1"
                  :mode="'one2one'"/>
              </div>
            </td>
            <td class="title width-300" v-if="hd.type === 'Link'">
              <input type="text" v-model="row[hd.key]" class="width-290 small">
            </td>
          </template>
          <td class="td-padding">
            <div class="btn btn-add plain" @click="add(rowIndex, row)">
              插入一行
            </div>
            <div class="btn btn-add plain" @click="remove(rowIndex, row)">
              删除
            </div>
          </td>
        </tr>
      </template>
    </table>

    <div class="footer" v-if="header.length > 0">
      <div class="btn btn-add plain" @click="add">
        新增
      </div>
      <div class="btn" @click="submit" v-show="list.length > 0">
        保存
      </div>
    </div>
  </div>
</template>

<script>
  import ImageSelector from '@/components/Account/image-selector.vue'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { mapPhotoType } from '@/api/enum.js'

  export default {
    name: 'AdminIndex',
    data () {
      return {
        tempList: [],
      }
    },
    mounted () {
      this.tempList = this.list
    },
    methods: {
      checkEmptyLine () {
        // 检查是否有空行
        let list = this.tempList
        let hasEmptyLine = false
        let temp = ''

        list.forEach(item => {
          let counts = 0
          for (let k in item) {
            counts = counts + 1
            temp = temp + k
          }
          if (counts === 0) {
            hasEmptyLine = true
          }
        })
        return hasEmptyLine
      },
      add (rowIndex, row) {
        let list = this.tempList
        let hasEmptyLine = this.checkEmptyLine()
        if (hasEmptyLine) {
          return
        }

        let copy = {}
        for (let k in row) {
          copy[k] = ''
        }

        list.splice(rowIndex + 1, 0, copy)
        this.tempList = list
      },
      remove (rowIndex, row) {
        let list = this.tempList

        list.splice(rowIndex, 1)
        this.tempList = list
      },
      submit () {
        let header = this.header
        let list = this.tempList

        header.forEach(hd => {
          if (hd.action === 'Bind') {
            let toKey = hd.actionToKey
            let fromKey = hd.key

            list.forEach(item => {
              item[toKey] = item[fromKey]
            })
          }
        })
        list = list.filter(row => {
          let toRemove = false
          for (let k in row) {
            if (!row[k]) {
              toRemove = true
            }
          }
          return !toRemove
        })
        this.$emit('update', list)
      },
      imageSelectorChage (data, item, key) {
        let { file } = data
        let imgFile = file

        let type = mapPhotoType.OTHER
        this.uploadImageOfType(type, imgFile, res => {
          item[key] = res.url
        })
      },
      uploadImageOfType (type, file, cbfn) {
        // 统一处理上传文件
        uploadImageOfType(type, file, cbfn, err => {
          let errResData = err.response.data
          let userMessage = errResData.userMessage
          alert(userMessage)
        })
      },
    },
    watch: {
      list () {
        this.tempList = this.list
      }
    },
    components: {
      ImageSelector,
    },
    props: {
      list: {
        type: Array,
        default () {
          return []
        }
      },
      header: {
        type: Array,
        default () {
          return []
        }
      },
    }
  }

  function uploadImageOfType (type, file, cbfn, fail) {
    let url = ReqUrl.OtherSubUrl.uploadImage(type)
    Req.PostFile(url, file, cbfn, fail)
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .admin-index {
    width: 100%;
    padding: 10px 30px;
  }
  .content {
    margin: 0 auto;
    margin-bottom: 20px;
  }
  .footer {
    display: block;
    text-align: center;
  }
  .btn {
    display: inline-block;
    width: 200px;
  }
  .width-300 {
    width: 300px;
  }
  .width-290 {
    width: 290px;
  }
  input.small {
    font-size: 12px;
    height: 20px;
    line-height: 20px;
  }
  .content-row {
    margin-bottom: 5px;
    border-bottom: 1px solid #333;

    .col-index {
      display: inline-block;
    }
    .col {
      vertical-align: middle;
      border-right: 1px solid #333;

      &:first-child {
        border-left: 1px solid #333;
      }
    }
    .img-container {
      text-align: center;

      .image-wrap {
        display: inline-block;
      }
      // img {
        // width: 100%;
      // }
    }
  }
  .col-header {
    background-color: #333;
    color: white;
    font-weight: bold;
    padding: 4px;

    .col {
      border-right: 1px solid white;

      &:first-child {
        border-left: 1px solid white;
      }
    }
  }
  div.btn.btn-add {
    width: 80px;
  }
  .td-padding {
    padding: 0 10px;
  }

  tr:hover {
    background-color: #ddd;
  }
</style>
