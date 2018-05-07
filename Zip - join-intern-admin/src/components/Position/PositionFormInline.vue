<template lang="html">
  <div class="position-form-inline xsx-form-theme">
    <div class="line-frame form-content">
      <!-- 基本信息（必填） -->
      <div class="">
        <div class="form-item-content padding-bottom-30">
          <template v-for="item in PositionEnum">
            <div class="row align-left input-block">
              <span class="input-label-inline left text-align-right width-9em">
                {{ showTitle(item) ? item.title : ''}}
              </span>

              <div class="col" v-if="item.type === 'String'">
                <input type="text" class="width-280" placeholder="请输入" v-model="item.value">
              </div>

              <div class="col" v-if="item.type === 'Date'">
                <input type="date" class="width-280" placeholder="请输入" v-model="item.value">
              </div>

              <div class="col" v-if="item.type === 'Time'">
                <input type="time" class="width-280" placeholder="请输入" v-model="item.value">
              </div>

              <div class="col" v-if="item.type === 'Enum'">
                <option-selector :list="item.enumList"
                  :selected="item.value"
                  :item-style="optionItemStyle"
                  @change="optionSelectorChange($event, item)"/>
              </div>

              <div class="col" v-if="item.type === 'Boolean'">
                <boolean-selector
                  :item="item"
                  :selected="item.value"
                  :item-style="optionItemStyle"
                  @change="booleanSelectorChange($event, item)"/>
              </div>

              <div class="col width-280" v-if="item.type === 'MultilineString'">
                <textarea placeholder="请输入" v-model="item.value" class="width-100percent height-100px"></textarea>
              </div>

              <div class="col width-280" v-if="parseType(item.type) === 'Image'">
                <image-selector :value-list="item.value"
                  @change="imageSelectorChage($event, item)"
                  :item="item"
                  :max="item.max === 'autoadd' ? null : item.max"
                  :mode="item.max === 'autoadd' ? 'autoadd' : 'one2one'"/>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="input-block-divide-line"></div>

    </div>
    <div class="footer align-center">
      <div class="btn plain width-160px col" @click="submit">
        {{posid === 'new' ? '发布' : '保存修改'}}
      </div>
    </div>
  </div>
</template>

<script>
  import Processbar from '@/components/Account/process-bar.vue'
  import OptionSelector from '@/components/Account/FormOptionSelector.vue'
  import ImageSelector from '@/components/Account/image-selector.vue'
  import BooleanSelector from '@/components/Account/boolean-selector.vue'

  import { PositionEnum } from '@/components/Position/PositionEnum.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { mapPhotoType } from '@/api/enum.js'

  export default {
    name: 'PositionFormInline',
    data () {
      return {
        PositionEnum: PositionEnum.map(item => {
          return {
            ...item,
            value: ''
          }
        }),

        fileAvatarUploadStatusText: '',
        avatarUrl: '',

        dataCopy: {},
        optionItemStyle: {
          border: '1px solid #E5E6EB',
          backgroundColor: 'white',
          height: '32px',
          lineHeight: '30px',
          // width: '280px',
          textAlign: 'right',
        },
        processing: false,
      }
    },
    components: {
      Processbar,
      OptionSelector,
      ImageSelector,
      BooleanSelector,
    },
    beforeRouteUpdate (to, from, next) {
      if (this.posid && this.posid !== 'new') {
        this.getPositionInfo(res => {
          this.parseDataToList()
          next()
        })
      }
    },
    mounted () {
      if (this.posid && this.posid !== 'new') {
        this.getPositionInfo(res => {
          this.parseDataToList()
        })
      }
    },
    props: {
      posid: {
        type: [String, Number],
        default () {
          return ''
        }
      },
    },
    methods: {
      optionSelectorChange (d, item) {
        item.value = d.key
      },
      booleanSelectorChange (d, item) {
        item.value = d.value
      },
      parseType (typeString) {
        if (typeString.indexOf('ImageUrlString') === 0) return 'Image'
      },
      uploadImageOfType (type, file, cbfn) {
        // 统一处理上传文件
        uploadImageOfType(type, file, cbfn, err => {
          let errResData = err.response.data
          let userMessage = errResData.userMessage
          let developerMessage = errResData.developerMessage

          console.log(`userMessage: ${userMessage}`)
          console.log(`developerMessage: ${developerMessage}`)
        })
      },
      // 头像
      fileSelectChange (ev) {
        this.fileAvatarUploadStatusText = '正在上传...'

        let fileList = ev.target.files
        let imgFile = fileList[0]
        let type = mapPhotoType.STU_AVATAR

        this.uploadImageOfType(type, imgFile, res => {
          this.avatarUrl = res.url
          this.fileAvatarUploadStatusText = '重新上传'
        })
      },
      imageSelectorChage (data, item) {
        let { file } = data
        let imgFile = file

        let type = ''
        if (item.key === 'logo') {
          type = mapPhotoType.COMPANY_LOGO
        } else if (item.key === 'avatar') {
          type = mapPhotoType.OTHER
        }
        this.uploadImageOfType(type, imgFile, res => {
          item.value = res.url
        })
      },
      getPositionInfo (cbfn = res => res) {
        console.log(`getPositionInfo ${this.posid}`)
        let url = ReqUrl.Position.getItem(this.posid)

        Req.Get(url, undefined, res => {
          this.dataCopy = res
          cbfn(res)
        }, fail => {
          if (fail.response) {
            alert(fail.response.data.userMessage)
            if (fail.response.data.status === 401) {
              this.$router.replace({
                name: 'Login'
              })
            }
          }
        })
      },
      uploadPositionInfo (cbfn = res => res, failCbfn = res => res) {
        let list1 = this.PositionEnum
        let readyToSubmit = true
        list1.forEach(item => {
          let value = item.value
          if (!value) readyToSubmit = false
        })
        if (!readyToSubmit) {
          alert('请填写完整基本信息，再保存。')
          failCbfn()
          return
        }

        let data = this.parseDataFromList(this.PositionEnum)

        let isCreatedNew = this.posid === 'new'
        if (isCreatedNew) {
          let url = ReqUrl.Position.addItem(0)

          Req.Post(url, data, res => {
            cbfn(res)
          }, fail => {
            failCbfn(fail)
            if (fail.response) {
              alert(`保存失败：${fail.response.data.userMessage}`)
              if (fail.response.data.status === 401) {
                this.$router.replace({
                  name: 'Login'
                })
              }
            }
          })
        } else {
          let url = ReqUrl.Position.editItem(this.posid)

          Req.Put(url, data, res => {
            cbfn(res)
          }, fail => {
            failCbfn(fail)
            if (fail.response) {
              alert(`保存失败：${fail.response.data.userMessage}`)
              if (fail.response.data.status === 401) {
                this.$router.replace({
                  name: 'Login'
                })
              }
            }
          })
        }
      },
      // 从数组上收集数据
      parseDataFromList (list) {
        let result = list.reduce((dict, item) => {
          let key = item.key
          let value = item.value
          if (item.type === 'Date') {
            dict[key] = parseDateString(value)
          } else if (item.type === 'Time') {
            dict[key] = parseTimeString(value)
          } else {
            dict[key] = value
          }

          return dict
        }, {})

        return result
      },
      // 从数组上收集数据
      parseDataToList () {
        let data = this.dataCopy
        this.PositionEnum = this.PositionEnum.map(mapUp)

        function mapUp (item) {
          let key = item.key

          if (item.type === 'Date') {
            item.value = parseDateString(data[key])
          } else if (item.type === 'Time') {
            item.value = parseTimeString(data[key])
          } else {
            item.value = data[key]
          }
          return item
        }
      },
      imgBg (imgUrl) {
        return {
          backgroundImage: `url(${imgUrl})`
        }
      },
      submit () {
        if (this.processing) {
          alert('正在保存，请稍候。')
          return
        }

        this.processing = true
        this.uploadPositionInfo(res => {
          this.processing = false
          alert('保存成功')
        }, fail => {
          this.processing = false
        })
      },
      showTitle (item) {
        let type = item.type
        let DontShowList = [
          'Boolean'
        ]
        return !(DontShowList.indexOf(type) !== -1)
      },
    },
  }

  function uploadImageOfType (type, file, cbfn, fail) {
    let url = ReqUrl.OtherSubUrl.uploadImage(type)
    Req.PostFile(url, file, cbfn, fail)
  }

  function parseDateString (v) {
    if (v) {
      return v.split(' ')[0]
    } else {
      return ''
    }
  }
  function parseTimeString (v) {
    if (v && v.length === 8) {
      return v
    } else if (v.length === 5) {
      return `${v}:00`
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .position-form-inline {
    display: block;
    margin: 0 auto;
    background-color: white;
    text-align: left;

    .margin-bottom-20 {
      margin-bottom: 20px;
    }
    .margin-bottom-40 {
      margin-bottom: 40px;
    }
    .form-content {
      padding: 30px 20px 0px;
    }
    .width-280 {
      width: 280px;
    }

    .space-between {
      display: block;
      overflow: hidden;

      .left { float: left; }
      .right { float: right; }
    }
    .avatar-row {
      vertical-align: middle;

      .left {
        line-height: 40px;
      }
      .file-input-cover {
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
      }
      .re-select {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #0DABF4;
        letter-spacing: 0;
        line-height: 12px;
      }
      .right {
        position: relative;
      }
      .btn-add-image {
        display: inline-block;
        height: 42px;
        width: 42px;
        font-size: 30px;
        line-height: 38px;
        text-align: center;
        vertical-align: middle;
        position: relative;

        background: #F5F5F7;
        border: 1px solid #E5E6EB;
        color: #BFBFBF;
        border-radius: 50%;

        user-select: none;
        cursor: pointer;

        &.icon {
          background: transparent;
          border: 1px solid #E5E6EB;

          .icon();
        }
      }
    }

    .form-item-content {
      display: block;
      padding: 20px 0px;
    }
  }
  .text-align-right {
    text-align: right;
  }
  .width-9em {
    display: inline-block;
    width: 9em;
    margin-right: 16px;
  }
  .margin-bottom-10 {
    margin-bottom: 10px;
  }
  .width-160px {
    width: 160px;
  }
  .width-100percent {
    width: 100%;
  }
  .width-715px {
    width: 715px;
  }
  .height-100px {
    height: 100px;
  }
  .footer {
    display: block;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .page-result-title {
    margin-top: 40px;
  }
</style>
