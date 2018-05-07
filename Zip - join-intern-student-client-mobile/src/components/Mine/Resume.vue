<template lang="html">
  <div class="mine-resume xsx-form-theme">
    <div class="page-result-title">
      我的简历
    </div>

    <div class="line-frame form-content">
      <div class="row avatar-row space-between margin-bottom-40">
        <span class="input-label-inline left">添加头像</span>
        <span class="right">
          <span class="text re-select">{{ fileAvatarUploadStatusText }}</span>
          <span class="btn-add-image pointer-on" v-if="!avatarUrl">+</span>
          <span class="btn-add-image pointer-on icon" :style="imgBg(avatarUrl)" v-if="avatarUrl"></span>
          <input type="file" accept="image/jpeg,image/png,image/gif"
            @change="fileSelectChange($event)"
            class="file-input-cover">
        </span>
      </div>

      <!-- 基本信息（必填） -->
      <div class="">
        <div class="input-block-title">基本信息（必填）</div>
        <div class="input-block-divide-line"></div>
        <div class="form-item-content">
          <template v-for="item in PersonalInfomation">
            <div class="row align-left input-block">
              <span class="input-label-inline left text-align-right width-6em">{{item.title}}</span>

              <div class="col" v-if="item.type === 'String'">
                <input type="text" class="width-280" placeholder="请输入" v-model="item.value">
              </div>

              <div class="col" v-if="item.type === 'Enum'">
                <option-selector :list="item.enumList"
                  :selected="item.value"
                  @change="optionSelectorChange($event, item)"/>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 教育信息 -->
      <div class="">
        <div class="input-block-title">教育信息</div>
        <div class="input-block-divide-line"></div>
        <div class="form-item-content">
          <template v-for="item in EducationInfomation">
            <div class="row align-left input-block">
              <span class="input-label-inline left text-align-right width-6em">{{item.title}}</span>

              <div class="col" v-if="item.type === 'String'">
                <input type="text" class="width-280" placeholder="请输入" v-model="item.value">
              </div>

              <div class="col" v-if="item.type === 'Enum'">
                <option-selector :list="item.enumList"
                  :selected="item.value"
                  @change="optionSelectorChange($event, item)"/>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="">
        <div class="input-block-divide-line"></div>
        <div class="form-item-content">
          <template v-for="item in OtherInformation">
            <div class="row align-left input-block">
              <span class="input-label-inline left row margin-bottom-10">{{item.title}}</span>

              <div class="col" v-if="item.type === 'String'">
                <input type="text" placeholder="请输入" v-model="item.value">
              </div>

              <div class="col" v-if="item.type === 'Enum'">
                <option-selector :list="item.enumList"
                  :selected="item.value"
                  @change="optionSelectorChange($event, item)"/>
              </div>

              <div class="row" v-if="item.type === 'MultilineString'">
                <textarea placeholder="请输入" v-model="item.value" class="width-100percent height-100px"></textarea>
              </div>

              <div class="row" v-if="parseType(item.type) === 'Image'">
                <image-selector :value-list="item.value"
                  @change="imageSelectorChage($event, item)"
                  @remove="imageSelectDelete($event, item)"
                  :status="item.status"
                  :item="item"
                  :max="item.max === 'autoadd' ? null : item.max"
                  :mode="item.max === 'autoadd' ? 'autoadd' : 'one2one'"/>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="footer align-center">
      <div class="btn plain width-160px col" @click="submit">保存</div>
    </div>
  </div>
</template>

<script>
  import Processbar from '@/components/Account/process-bar.vue'
  import OptionSelector from '@/components/Account/FormEnumSelector.vue'
  import ImageSelector from '@/components/Account/image-selector.vue'

  import {
    PersonalInfomation,
    EducationInfomation,
    OtherInformation,
  } from '@/components/Account/AccountData.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { mapPhotoType } from '@/api/enum.js'

  export default {
    name: 'Resume',
    data () {
      return {
        PersonalInfomation: PersonalInfomation.map(item => {
          return {
            ...item,
            value: ''
          }
        }),
        EducationInfomation: EducationInfomation.map(item => {
          return {
            ...item,
            value: ''
          }
        }),
        OtherInformation: OtherInformation.map(item => {
          return {
            ...item,
            value: ''
          }
        }),

        fileAvatarUploadStatusText: '',
        avatarUrl: '',

        dataCopy: {},
      }
    },
    components: {
      Processbar,
      OptionSelector,
      ImageSelector,
    },
    mounted () {
      this.getStudentInfo(res => {
        this.parseDataToList()
      })
      // this.parseDataFromList()
    },
    methods: {
      optionSelectorChange (d, item) {
        item.value = d.key
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
        }, fail => {
          if (fail.response.data.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
        })
      },
      imageSelectDelete (data, item) {
        console.log(item)
        if (item.max === 'autoadd') {
          let index = data.index
          let list = item.value
          list.splice(index, 1)
          item.value = list
        } else {
          item.value = ''
        }
      },
      imageSelectorChage (data, item) {
        let { index, file } = data
        let imgFile = file

        if (item.key === 'stuCard') {
          let type = mapPhotoType.STU_CARD

          this.uploadImageOfType(type, imgFile, res => {
            item.value = res.url
          })
        } else if (item.key === 'certs') {
          let type = mapPhotoType.STU_CERT

          this.uploadImageOfType(type, imgFile, res => {
            if (!item.value || !Array.isArray(item.value)) {
              item.value = []
            }

            let list = item.value.filter(item => item)
            if (index >= item.value.length) {
              list.push(res.url)
            }
            item.value = list.map((url, i) => {
              if (i === index) return res.url
              return url
            })
          }, fail => {
            if (fail.response.data.status === 401) {
              this.$router.push({
                name: 'Login'
              })
            }
          })
        }
      },
      getStudentInfo (cbfn = res => res) {
        let url = ReqUrl.StudentSubUrl.getItem(0)
        Req.Get(url, undefined, res => {
          this.dataCopy = res
          cbfn(res)
        }, fail => {
          if (fail.response.data.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
        })
      },
      uploadStudentInfo (cbfn = res => res) {
        let url = ReqUrl.StudentSubUrl.putItem(0)
        let data = this.parseDataFromList()

        Req.Put(url, data, res => {
          cbfn(res)
        }, fail => {
          if (fail.response.data.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
          if (fail.response.data.userMessage) {
            alert(`保存失败：${fail.response.data.userMessage}`)
          } else {
            alert(`保存失败：错误信息如下:\n${fail.response.data}`)
          }
        })
      },
      // 从数组上收集数据
      parseDataFromList () {
        let list1 = this.PersonalInfomation
        let list2 = this.EducationInfomation
        let list3 = this.OtherInformation

        let list = [].concat(list1, list2, list3)
        let result = list.reduce((dict, item) => {
          let key = item.key
          let value = item.value
          dict[key] = value

          return dict
        }, {})
        result['avatar'] = this.avatarUrl.indexOf('http') === 0 ? this.avatarUrl : ''

        return result
      },
      // 从数组上收集数据
      parseDataToList () {
        let data = this.dataCopy
        this.PersonalInfomation = this.PersonalInfomation.map(mapUp)
        this.EducationInfomation = this.EducationInfomation.map(mapUp)
        this.OtherInformation = this.OtherInformation.map(mapUp)

        function mapUp (item) {
          let key = item.key
          item.value = data[key]
          return item
        }

        this.avatarUrl = data['avatar'].indexOf('http') === 0 ? data['avatar'] : ''
      },
      imgBg (imgUrl) {
        return {
          backgroundImage: `url(${imgUrl})`
        }
      },
      submit () {
        this.uploadStudentInfo(res => {
          alert('保存成功')
        })
      }
    },
  }

  function uploadImageOfType (type, file, cbfn, fail) {
    let url = ReqUrl.OtherSubUrl.uploadImage(type)
    Req.PostFile(url, file, cbfn, fail)
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .page-result-title {
    display: block;
    position: relative;

    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #454F66;
    letter-spacing: 0;
    padding-bottom: 20px;
    margin-bottom: 18px;

    &:after {
      content: ' ';
      display: inline-block;
      height: 2px;
      width: 22.5px;
      background-color: #0DABF4;

      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
  .mine-resume {
    display: block;
    padding-bottom: 40px;
    margin: 0 auto;
    background-color: white;

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
  .width-6em {
    display: inline-block;
    width: 5em;
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
  .height-100px {
    height: 100px;
  }
  .footer {
    display: block;
    text-align: center;
    margin-top: 20px;
  }
</style>
