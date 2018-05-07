<template lang="html">
  <div class="page-resume" @input="someoneInput">
    <div class="block">
      <div class="title">添加头像</div>
      <div class="white-board flex-col">
        <div class="avatar-box">
          <span class="btn-add-image pointer-on" v-if="!avatarUrl">+</span>
          <span class="btn-add-image pointer-on icon" :style="avatarUrl | imgbg" v-if="avatarUrl"></span>
          <input type="file" accept="image/jpeg,image/png,image/gif"
            @change="fileSelectChange($event)"
            class="file-input-cover" />
        </div>
        <div class="text re-select">{{ fileAvatarUploadStatusText || (avatarUrl ? '点击替换' : '点击添加') }}</div>
      </div>
    </div>

    <div class="block">
      <div class="title">
        基本信息
        <span class="astrill">*</span>
      </div>
      <div class="list">
        <template v-for="item in PersonalInfomation">
          <div class="row" :key="item.title">
            <icon-selector :title="item.title"
              :arrow-dir="selectedEnumTitle === item.title ? 'left' : ''"
              v-if="item.type === 'String'">
              <div class="string-input-box" @click="selectedEnumTitle = item.title">
                <input class="string-input" type="text" v-model="item.value" placeholder="请输入">
              </div>
            </icon-selector>
            <enum-selector
              v-model="item.value"
              :title="item.title"
              :list="item.enumList"
              :show="selectedEnumTitle === item.title"
              @select="selectedEnumTitle = item.title"
              @hide-select="selectedEnumTitle = ''"
              v-if="item.type === 'Enum'" />
          </div>
        </template>
      </div>
    </div>

    <div class="block">
      <div class="title">
        教育信息
        <span class="astrill">*</span>
      </div>
      <div class="list">
        <template v-for="item in EducationInfomation">
          <div class="row" :key="item.title">
            <icon-selector :title="item.title"
              :arrow-dir="selectedEnumTitle === item.title ? 'left' : ''"
              v-if="item.type === 'String'">
              <div class="string-input-box" @click="selectedEnumTitle = item.title">
                <input class="string-input" type="text" v-model="item.value" placeholder="请输入">
              </div>
            </icon-selector>
            <enum-selector
              v-model="item.value"
              :title="item.title"
              :list="item.enumList"
              :show="selectedEnumTitle === item.title"
              @select="selectedEnumTitle = item.title"
              @hide-select="selectedEnumTitle = ''"
              v-if="item.type === 'Enum'" />
          </div>
        </template>
      </div>
    </div>

    <div class="block">
      <div class="title">自我评价</div>
      <div class="content">
        <textarea
          v-model="dataCopy.selfEval"
          :placeholder="textareaPlaceholder"></textarea>
      </div>
    </div>

    <div class="block">
      <div class="title">社会活动经验</div>
      <div class="content">
        <textarea
          v-model="dataCopy.workExp"
          :placeholder="textareaPlaceholder"></textarea>
      </div>
    </div>

    <div class="block photo">
      <div class="title">学生证</div>
      <div class="content-photo">
        <image-selector :value-list="OtherInformation[2].value"
          @change="imageSelectorChange($event, OtherInformation[2])"
          @remove="imageSelectDelete($event, OtherInformation[2])"
          :item="OtherInformation[2]"
          :max="OtherInformation[2].max === 'autoadd' ? null : OtherInformation[2].max"
          :mode="OtherInformation[2].max === 'autoadd' ? 'autoadd' : 'one2one'"/>
      </div>
    </div>

    <div class="block margin-bottom-20">
      <div class="title">荣誉证书</div>
      <div class="content-photo">
        <!-- <textarea :placeholder="textareaPlaceholder"></textarea> -->
        <image-selector :value-list="OtherInformation[3].value"
          @change="imageSelectorChange($event, OtherInformation[3])"
          @remove="imageSelectDelete($event, OtherInformation[3])"
          :item="OtherInformation[3]"
          :max="OtherInformation[3].max === 'autoadd' ? null : OtherInformation[3].max"
          :mode="OtherInformation[3].max === 'autoadd' ? 'autoadd' : 'one2one'"/>
      </div>
    </div>

    <div class="btn btn-submit"
      @click="submit"
      :class="{ enabled: valueChange }">
      保存
    </div>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'

  import IconSelector from '@/mobile-components/Form/IconSelector.vue'
  import EnumSelector from '@/mobile-components/Form/EnumSelector.vue'
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
    name: 'PageResume',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()
      this.getStudentInfo(res => {
        this.parseDataToList()
      })
    },
    data () {
      return {
        pageTitle: '简历',

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
        textareaPlaceholder: '请输入',

        selectedEnumTitle: '',
        valueChange: false,
      }
    },
    components: {
      IconSelector,
      EnumSelector,
      OptionSelector,
      ImageSelector,
    },
    computed: {
      isSubmitReady () {
        return false
      }
    },
    methods: {
      someoneInput () {
        this.valueChange = true
      },
      selectRow (item) {
        let path = item.path
        if (!path) return
        this.$router.push({
          path
        })
      },
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
            alert(fail.response.data.developerMessage)
            // this.$router.push({
            //   name: 'Login'
            // })
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
      imageSelectorChange (data, item) {
        let { index, file } = data
        let imgFile = file

        this.valueChange = true
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
              alert(fail.response.data.developerMessage)
              // this.$router.push({
              //   name: 'Login'
              // })
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
            alert(fail.response.data.developerMessage)
            // this.$router.push({
            //   name: 'Login'
            // })
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
            alert(fail.response.data.developerMessage)
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
          this.valueChange = false
        })
      }
    }
  }

  function uploadImageOfType (type, file, cbfn, fail) {
    let url = ReqUrl.OtherSubUrl.uploadImage(type)
    Req.PostFile(url, file, cbfn, fail)
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/mobile.less";

  .page-resume {
    .block {
      .title {
        font-family: PingFangSC-Regular;
        font-size: 26px/2;
        color: #656565;

        line-height: 33px;
        height: 33px;
        text-align: left;
        padding: 0 15px;
      }
      .list {
        background-color: white;
        width: 100%;
      }
      textarea {
        width: 100%;
        height: 145px;
        padding: 15px;

        font-family: PingFangSC-Regular;
        font-size: 30px/2;
        color: #333333;
        line-height: 46px/2;
        resize: none;

        &::-webkit-input-placeholder {
          font-family: PingFangSC-Regular;
          font-size: 30px/2;
          color: #C5C5C5;
          line-height: 30px/2;
        }
      }
      .placeholder {
        font-family: PingFangSC-Regular;
        font-size: 30px/2;
        color: #BFBFBF;
        line-height: 30px/2;
      }
      .value {
        font-family: PingFangSC-Regular;
        font-size: 30px/2;
        color: #333333;
        line-height: 30px/2;
      }
    }
  }
  .astrill {
    color: #0DABF4;
  }
  .white-board {
    background-color: white;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-box {
      position: relative;
    }
    .btn-add-image {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      border-radius: 50%;
      .sqr(60px);
      .icon();
    }
    .re-select {
      margin-top: 10px;
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #656565;
      line-height: 26px/2;
    }
    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      opacity: 0;
    }
  }
  .margin-bottom-20 {
    margin-bottom: 20px;
  }

  .btn-submit {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #FFFFFF;

    background-color: #BFBFBF;

    &.enabled {
      background-color: #0DABF4;
    }
  }
  .string-input {
    font-size: 15px;
    text-align: right;

    &:focus {
      border-bottom: 1px solid #0DABF4;
    }
  }
  .content-photo {
    padding: 15px;
    background-color: white;
  }
</style>
