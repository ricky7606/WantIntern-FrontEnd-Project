<template lang="html">
  <div class="news-list xsx-form-theme">
    <div class="notification-form">
      <div class="title">发送站内信</div>
      <div class="row">
        <div class="input-label col">站内信内容:</div>
        <div class="col">
          <textarea v-model="content"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="input-label col">发送对象：</div>
        <div class="col">
          <div class="check-box">
            <input type="checkbox" v-model="optCompany"/>
            <div class="col opt-item" :class="{disabled: !optCompany}" @click="optCompany = !optCompany">企业</div>
          </div>
          <div class="check-box">
            <input type="checkbox" v-model="optStudent"/>
            <div class="col opt-item" :class="{disabled: !optStudent}" @click.self="optStudent = !optStudent">学生</div>
          </div>
        </div>
      </div>
      <div class="row btn-row">
        <div class="btn plain warning" :class="{disabled: !isReady}" @click="submit">
           发送
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'NotificationCenter',
    data () {
      return {
        content: '',
        optStudent: false,
        optCompany: false,

        isSending: false,
      }
    },
    mounted () {
      // this.getData({})
    },
    computed: {
      isReady () {
        return (this.optStudent || this.optCompany) && this.content
      }
    },
    methods: {
      submit () {
        if (!this.content) {
          alert('请先填写推送的内容~')
          return
        }
        if (!this.optStudent && !this.optCompany) {
          alert('请先选择一个推送对象~ 如果需要推送给特定企业、学生，请在对应的列表中操作。')
          return
        }
        if (this.isSending) {
          alert('正在等待服务器返回数据，请稍候~')
          return
        }

        this.isSending = true
        let searchString = [
          this.optStudent ? 'STUDENT' : false,
          this.optCompany ? 'COMPANY' : false,
        ].filter(item => !!item)
        .map(item => `role=${item}`)
        .join('&')
        let url = `${ReqUrl.Notification.broadcast()}?${searchString}`

        let data = {
          msg: this.content,
        }
        // alert(url)
        Req.Post(
          url,
          data,
          res => {
            console.log(res)
            alert('发送成功！')
            this.isSending = false
          },
          fail => {
            if (fail.response.data) {
              alert(fail.response.data.userMessage)
            }
          }
        )
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .news-list {
    .notification-form {
      text-align: left;
      padding-left: 20px;

      textarea {
        width: 300px;
        height: 150px;
      }
    }
    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .row {
      margin-bottom: 10px;
    }
    .input-label {
      width: 6em;
      text-align: right;
      margin-right: 10px;
    }

    .btn {
      width: 6em;
    }

    .list {
      display: inline-block;
      text-align: left;
      margin-top: 20px;

      .title {
        font-size: 14spx;
      }
      table {
        border: 1px solid gray;
        font-size: 12px;

        tr {
          height: 2.6em;
          line-height: 2.6em;
        }
        th,
        td {
          padding: 0 10px;
        }
        tr:nth-of-type(odd) {
          background-color: #eee;
        }
      }
    }
  }
  .disabled {
    opacity: 0.3;
  }
  .btn-row {
    text-align: center;
    display: inline-block;
    padding-left: 300px;
  }
  .check-box {
    display: inline-block;
    margin-right: 20px;
    user-select: none;
    
    input {
      display: inline-block;
      vertical-align: middle;
    }
    .opt-item {
      margin-left: 5px;
    }
  }
</style>
