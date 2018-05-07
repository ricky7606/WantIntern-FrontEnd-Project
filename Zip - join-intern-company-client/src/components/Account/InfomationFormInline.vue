<template lang="html">
  <div class="register-informationform xsx-form-theme">
    <!-- <div class="margin-bottom-20">
      <processbar :step="2"/>
    </div> -->
    <div class="line-frame form-content">
      <!-- 基本信息（必填） -->
      <div class="">
        <div class="form-item-content padding-bottom-30">
          <template v-for="item in PersonalInfomation">
            <div class="row align-left input-block">
              <span class="input-label-inline left text-align-right width-6em">{{item.title}} {{ item.isAllowNull ? '' : '*'}}</span>

              <div class="col" v-if="item.type === 'String'">
                <input type="text" class="width-280" placeholder="请输入" v-model="item.value">
              </div>

              <div class="col" v-if="item.type === 'Enum'">
                <option-selector :list="item.enumList"
                  :selected="item.value"
                  :item-style="optionItemStyle"
                  @change="optionSelectorChange($event, item)"/>
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

      <div class="footer align-center">
        <div class="hint-text" v-show="this.processing1">正在保存数据...</div>
        <div class="btn plain width-160px col" @click="submit">保存</div>
      </div>
    </div>

    <div class="page-result-title">
      账户信息
    </div>

    <div class="line-frame form-content">
      <!-- 教育信息 -->
      <div class="">
        <div class="form-item-content padding-bottom-30">
          <template v-for="item in AccountInfomation">
            <div class="row align-left input-block">
              <span class="input-label-inline left text-align-right width-6em">{{item.title}} {{ item.isAllowNull ? '' : '*'}}</span>

              <div class="col" v-if="item.type === 'String'">
                <input type="text" class="width-280" placeholder="请输入" v-model="item.value">
              </div>

              <div class="col" v-if="item.type === 'Enum'">
                <option-selector :list="item.enumList"
                  :selected="item.value"
                  @change="optionSelectorChange($event, item)"/>
              </div>

              <div class="col" v-if="item.type === 'MultilineString'">
                <textarea placeholder="请输入" v-model="item.value" class="width-715px height-100px"></textarea>
              </div>

              <div class="col" v-if="parseType(item.type) === 'Image'">
                <image-selector :value-list="item.value"
                  @change="imageSelectorChage($event, item)"
                  :item="item"
                  :max="item.max === 'autoadd' ? null : item.max"
                  :mode="item.max === 'autoadd' ? 'autoadd' : 'one2one'"/>
              </div>
            </div>
          </template>
        </div>
        <div class="input-block-divide-line"></div>

        <div class="footer align-center">
          <div class="hint-text" v-show="this.processing2">正在保存数据...</div>
          <div class="btn plain width-160px col" @click="submitForm2">保存修改</div>
        </div>
      </div>
    </div>

    <div class="page-result-title">
      账户认证
    </div>

    <div class="line-frame form-content margin-bottom-40">
      <template v-for="item in AuthInfomation">
        <div class="margin-bottom-20">
          <image-selector :value-list="item.value"
            @change="imageSelectorChage($event, item)"
            :item="item"
            :max="item.max === 'autoadd' ? null : item.max"
            :mode="item.max === 'autoadd' ? 'autoadd' : 'one2one'"/>
        </div>
      </template>

      <div v-if="!AuthInfomation[0].value" class="input-block-divide-line"></div>

      <div class="footer align-center">
        <div class="hint-text" v-show="this.processing3">正在提交认证...</div>
        <div class="btn plain width-160px col"
          v-if="!dataCopy.verified"
          @click="submitForm3">立即认证</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Processbar from '@/components/Account/process-bar.vue'
  import OptionSelector from '@/components/Account/FormOptionSelector.vue'
  import ImageSelector from '@/components/Account/image-selector.vue'

  import {
    PersonalInfomation,
    AccountInfomation,
  } from '@/components/Account/AccountData.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { mapPhotoType } from '@/api/enum.js'

  export default {
    name: 'InfomationFormInline',
    data () {
      return {
        PersonalInfomation: PersonalInfomation.map(item => {
          return {
            ...item,
            value: ''
          }
        }),
        AccountInfomation: AccountInfomation.map(item => {
          return {
            ...item,
            value: ''
          }
        }),
        AuthInfomation: [
          {
            key: 'cert',
            value: '',
            title: '账户认证'
          }
        ],

        fileAvatarUploadStatusText: '',
        avatarUrl: '',

        dataCopy: {},
        optionItemStyle: {
          border: '1px solid #E5E6EB',
          backgroundColor: 'white',
          height: '32px',
          lineHeight: '30px',
        },
        processing: false,
        processing1: false,
        processing2: false,
        processing3: false,
      }
    },
    components: {
      Processbar,
      OptionSelector,
      ImageSelector,
    },
    mounted () {
      this.getCompanyInfo(res => {
        console.log(res)
        this.parseDataToList()
      })
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
        } else if (item.key === 'cert') {
          type = mapPhotoType.COMPANY_CERT
        } else {
          type = mapPhotoType.OTHER
        }
        this.uploadImageOfType(type, imgFile, res => {
          item.value = res.url
        })
      },
      getCompanyInfo (cbfn = res => res) {
        let url = ReqUrl.Company.getItem(0)
        Req.Get(url, undefined, res => {
          this.dataCopy = res
          cbfn(res)
        }, fail => {
          console.log(fail)
        })
      },
      uploadCompanyInfo (cbfn = res => res) {
        let list1 = [...this.PersonalInfomation]
        // let readyToSubmit = true
        for (let i = 0; i < list1.length; i++) {
          let item = list1[i]
          let value = item.value
          if (item.key === 'link' || item.key === 'video') {
            continue
          }
          if (!value && !item.isAllowNull) {
            // readyToSubmit = false
            alert(`信息不完整：请填写【${item.title}】再保存。`)
            this.processing = false
            return
          }
        }

        let url = ReqUrl.Company.editItem(0)
        let data = this.parseDataFromList(this.PersonalInfomation)

        Req.Put(url, data, res => {
          cbfn(res)
        }, fail => {
          alert(`保存失败：${fail.response.data.userMessage}`)
        })
      },
      uploadCompanyInfoForm2 (cbfn = res => res) {
        let list1 = [...this.AccountInfomation]
        // let readyToSubmit = true
        for (let i = 0; i < list1.length; i++) {
          let item = list1[i]
          let value = item.value
          if (!value) {
            // readyToSubmit = false
            alert(`信息不完整：请填写【${item.title}】再保存。`)
            this.processing = false
            return
          }
        }

        let url = ReqUrl.Company.editItem(0)
        let data = this.parseDataFromList(this.AccountInfomation)

        Req.Put(url, data, res => {
          cbfn(res)
        }, fail => {
          alert(`保存失败：${fail.response.data.userMessage}`)
        })
      },
      uploadCompanyInfoForm3 (cbfn = res => res) {
        let list2 = this.AuthInfomation
        let readyToSubmit2 = true
        list2.forEach(item => {
          let value = item.value
          if (!value) readyToSubmit2 = false
        })
        if (!readyToSubmit2) {
          alert('请选择一张图片，再保存。')
          return
        }

        let url = ReqUrl.Company.editItem(0)
        let data = this.parseDataFromList(this.AuthInfomation)

        Req.Put(url, data, res => {
          cbfn(res)
        }, fail => {
          alert(`保存失败：${fail.response.data.userMessage}`)
        })
      },
      // 从数组上收集数据
      parseDataFromList (list) {
        let result = list.reduce((dict, item) => {
          let key = item.key
          let value = item.value
          dict[key] = value

          return dict
        }, {})

        return result
      },
      // 从数组上收集数据
      parseDataToList () {
        let data = this.dataCopy
        this.PersonalInfomation = this.PersonalInfomation.map(mapUp)
        this.AccountInfomation = this.AccountInfomation.map(mapUp)
        this.AuthInfomation = this.AuthInfomation.map(mapUp)

        function mapUp (item) {
          let key = item.key
          item.value = data[key]
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
        this.uploadCompanyInfo(res => {
          this.processing = false
          alert('保存成功')
        })
      },
      submitForm2 () {
        if (this.processing2) {
          alert('正在保存，请稍候。')
          return
        }

        this.processing2 = true
        this.uploadCompanyInfoForm2(res => {
          this.processing2 = false
          alert('保存成功')
        })
      },
      submitForm3 () {
        if (this.processing3) {
          alert('正在提交认证，请稍候。')
          return
        }

        this.processing3 = true
        this.uploadCompanyInfoForm3(res => {
          this.processing3 = false
          alert('提交成功')
        })
      },
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

  .register-informationform {
    display: block;
    // width: 645px;
    // padding: 0 40px;
    // padding-top: 20px;
    // padding-bottom: 50px;
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

  .hint-text {
    display: block;
    font-size: 12px;
    margin-bottom: 10px;
  }
</style>
