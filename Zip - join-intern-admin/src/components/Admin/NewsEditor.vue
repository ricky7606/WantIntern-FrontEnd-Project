<template lang="html">
  <div class="news-editor xsx-form-theme">

    <div class="row">
      <div class="label col">标题: </div>
      <input type="text" class="col" v-model="tempTitle" />
    </div>
    <div class="row">
      <div class="label col">作者: </div>
      <input type="text" class="col" v-model="tempAuthor" />
    </div>

    <div class="video-upload">
      <div class="hint col">上传图片 和 视频：</div>
      <div class="col">
        <input type="file" accept="video/*,application/octet-stream,image/*"
          @change="fileSelectChange($event)" />
      </div>
      <div class="url" v-show="tempVideoUrl">
        <span class="url-title">已上传文件链接：</span>
        {{ tempVideoUrl }}
      </div>
      <div class="btn plain col add-to-article" v-show="tempVideoUrl" @click="AddToArticle">
        添加到文中
      </div>
    </div>
    <div class="row">
      <input type="text" v-model="videoFrame"/>
      <div class="btn col" @click="addVideoFrame">插入外链视频</div>
    </div>
    <quill-editor v-model="tempValue"/>

    <div class="footer">
      <div class="btn col btn-save" @click="save">
        保存
      </div>
      <div class="btn col btn-close" @click="close">
        关闭
      </div>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'NewsEditor',
    data () {
      return {
        tempValue: '',
        tempTitle: '',
        tempAuthor: '',

        tempVideoUrl: '',
        videoFrame: '',
      }
    },
    mounted () {
      this.tempValue = this.content
      this.tempTitle = this.title
      this.tempAuthor = this.author
    },
    methods: {
      save () {
        this.$emit('save', {
          content: this.tempValue,
          title: this.tempTitle,
          author: this.tempAuthor,
        })
      },
      close () {
        this.$emit('close', null)
      },
      fileSelectChange (ev) {
        let fileList = ev.target.files
        let videoFile = fileList[0]

        let type = 'OTHER'
        this.uploadImageOfType(type, videoFile, res => {
          this.tempVideoUrl = res.url
        })
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

        function uploadImageOfType (type, file, cbfn, fail) {
          let url = ReqUrl.OtherSubUrl.uploadImage(type)
          Req.PostFile(url, file, cbfn, fail)
        }
      },
      addVideoFrame () {
        let url = this.videoFrame
        this.tempValue = this.tempValue + url
      },
      AddToArticle () {
        let url = this.tempVideoUrl
        let imgSubfix = [
          '.png', '.jpg', '.jpeg', '.gif'
        ]

        let isImg = !!imgSubfix.find(item => url.indexOf(item) !== -1)
        let htmlString = ''
        if (isImg) {
          htmlString = `<img src="${url}" />`
        } else {
          // htmlString = `<video src="${url}" controls />`
          htmlString = url
        }
        console.log(htmlString)

        this.tempValue = this.tempValue + htmlString
      },
    },
    watch: {
      content () {
        this.tempValue = this.content
      },
      title () {
        this.tempTitle = this.title
      },
      author () {
        this.tempAuthor = this.author
      },
    },
    props: {
      content: {
        type: String,
        default () {
          return ''
        }
      },
      title: {
        type: String,
        default () {
          return ''
        }
      },
      author: {
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

    .video-upload {
      font-size: 12px;

      border: 1px solid black;
      margin-top: 10px;
      text-align: left;
    }
  }
  .add-to-article {
    margin: 10px;
  }

  .ql-editor video {
    min-width: 400px;
    min-height: 300px;
  }
</style>
