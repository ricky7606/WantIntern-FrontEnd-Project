<template lang="html">
  <div class="register-finish-page xsx-form-theme">
      <div class="title row">
        恭喜你已经完成注册！认证审核后根据公信力
      </div>
      <div class="row sub-title">
        上传营业执照
      </div>
      <div class="align-center">
        <image-selector :value-list="CodeTarget.value"
          @change="imageSelectorChage($event, CodeTarget)"
          :max="CodeTarget.max === 'autoadd' ? null : CodeTarget.max"
          :mode="CodeTarget.max === 'autoadd' ? 'autoadd' : 'one2one'"/>
      </div>

      <div class="row btn-box">
        <div class="btn plain gray pointer-on" @click="gotoHome">
          暂无，以后再说
        </div>

        <div class="btn plain pointer-on" @click="submit">
          提交审核
        </div>
      </div>
  </div>
</template>

<script>
  import ImageSelector from '@/components/Account/image-selector.vue'
  import { mapPhotoType } from '@/api/enum.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'RegisterFinish',
    data () {
      return {
        processing: false,
        CodeTarget: {
          value: '',
          key: 'cert',
          type: 'String',
          title: '营业执照',
          max: 1,
        }
      }
    },
    methods: {
      uploadImageOfType,
      gotoHome () {
        this.$router.replace({
          name: 'Home'
        })
      },
      imageSelectorChage (data, item) {
        let { file } = data
        let imgFile = file

        let type = ''
        type = mapPhotoType.COMPANY_CERT

        this.uploadImageOfType(type, imgFile, res => {
          item.value = res.url
        })
      },
      uploadCompanyInfo (cbfn = res => res) {
        let url = ReqUrl.Company.editItem(0)
        let target = this.CodeTarget
        let data = {
          [target.key]: target.value
        }

        Req.Put(url, data, res => {
          cbfn(res)
        }, fail => {
          alert(`保存失败：${fail.response.data.userMessage}`)
        })
      },
      submit () {
        if (this.processing) {
          alert('正在保存，请稍候。')
          return
        }

        if (!this.CodeTarget.value) {
          alert('请先选择营业执照')
          return
        }

        this.processing = true
        this.uploadCompanyInfo(res => {
          this.processing = false
          alert('提交审核成功！即将为您跳转到主页。')

          this.gotoHome()
        })
      }
    },
    components: {
      ImageSelector,
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

  .register-finish-page {
    text-align: center;
    display: block;
    width: 645px;
    padding-bottom: 70px;
    margin: 0 auto;
    background-color: white;

    padding-top: 40px;

    .title {
      margin-bottom: 20px;
      font-family: PingFangSC-Regular;
      font-size: 20px;
      color: #0DABF4;
      letter-spacing: 0;
    }
    .sub-title {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #656565;
      letter-spacing: 0;
      line-height: 16px;
    }
    .btn {
      width: 200px;
      display: inline-block;
    }
    .align-center {
      text-align: center;
      display: inline-block;
      margin-left: 20px;
      margin-top: 20px;
      margin-bottom: 30px;
    }
    .btn-box {
      display: block;
      text-align: center;
    }
  }
</style>
