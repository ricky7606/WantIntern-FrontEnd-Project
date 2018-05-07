<template lang="html">
  <div class="enterprise-editor xsx-form-theme">
    <div class="info-form">
      <div class="row">
        <div class="col label">
          账号：
        </div>
        <div class="col value">
          {{ content.account && content.account.phone }}
        </div>
      </div>

      <template v-for="item in [...PersonalInfomation, ...AccountInfomation]">
        <div class="row">
          <div class="col label">
            {{item.title}} :
          </div>
          <div class="value col">
            <div class="text" v-if="item.type === 'String'">
              {{content[item.key]}}
            </div>

            <div class="pre-text" v-if="item.type === 'MultilineString'">{{content[item.key]}}</div>

            <div class="img" v-if="item.type === 'ImageUrlString'">
              <a :href="content[item.key]" v-if="content[item.key]" target="_blank">
                <img :src="parseImageUrl(content[item.key])" alt="">
              </a>
              <span v-if="!content[item.key]">未上传</span>
            </div>

            <div class="enum" v-if="item.type === 'Enum'">
              {{content[item.key]}}
            </div>

            <div class="action" v-if="item.type === 'Boolean.Action'">
              <div class="col value">
                {{
                  content[item.key] === null ?
                    '未审核' :
                    content[item.key] ? '已审核' : '审核不通过'
                }}
              </div>

              <div class="btn plain col" v-show="!content[item.key]" :class="{disabled: content[item.key]}" @click="passVerified">
                审核通过
              </div>
              <div class="btn plain col" :class="{disabled: !content[item.key]}" @click="shutVerified">
                审核不通过
              </div>
            </div>
          </div>
        </div>
      </template>

      <div class="row">
        <div class="col label">
          发送站内信：
        </div>
        <div class="col value">
          <textarea class="notification-msg" v-model="notificationContent" placeholder="输入站内信内容"></textarea>

          <div class="btn plain col" :class="{disabled: !notificationContent || isSendingNotification}" @click="sendNotification">
            发送站内信
          </div>          
        </div>
      </div>

      <div class="row">
        <div class="col label">
          重置密码：
        </div>
        <div class="col value">
          <input class="password-box" v-model="newPassword" type="text" placeholder="输入新密码"/>

          <div class="btn plain col warning" :class="{disabled: !newPassword || isResetingPassword}" @click="resetPassword">
            重置此企业账号的密码
          </div>          
        </div>
      </div>

    </div>
    <div class="footer">
      <div class="btn col btn-close" @click="close">
        关闭
      </div>
    </div>
  </div>
</template>

<script>
  import {
    PersonalInfomation,
    AccountInfomation,
  } from '@/components/Account/AccountData.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'EnterpriseEditor',
    data () {
      return {
        PersonalInfomation,
        AccountInfomation,
        // 新密码
        newPassword: '',
        isResetingPassword: false,
        // 站内信
        notificationContent: '',
        isSendingNotification: false,
      }
    },
    props: {
      content: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    methods: {
      passVerified () {
        let id = this.content.id
        let url = ReqUrl.Admin.putCompanyInfo(id)
        Req.Put(url, {
          verified: true
        }, res => {
          alert('操作成功： 审核通过设置成功')
          this.content.verified = true
          this.$emit('update', null)
        })
      },
      shutVerified () {
        let id = this.content.id
        let url = ReqUrl.Admin.putCompanyInfo(id)
        Req.Put(url, {
          verified: false
        }, res => {
          alert('操作成功： 已设置为审核不通过')
          this.content.verified = false
          this.$emit('update', null)
        })
      },
      close () {
        this.$emit('close', null)
      },
      resetPassword () {
        let accountId = this.content.accountId
        if (!accountId) {
          alert('账号信息不正确')
          return
        }
        let newPassword = this.newPassword
        if (!newPassword) {
          alert('请先输入密码！')
          return
        }

        if (this.isResetingPassword) {
          alert('正在等待服务器返回结果，请稍候')
          return
        }

        this.isResetingPassword = true
        let url = ReqUrl.Account.put(accountId)

        Req.Put(
          url,
          {
            phone: null,
            password: newPassword,
          },
          res => {
            this.isResetingPassword = false
            alert(`密码重设成功！ 账号：${res.phone}, 新密码：${newPassword}`)
            return
          },
          fail => {
            console.log(fail)
            let msg = fail.response.data.userMessage
            alert(`操作失败：${msg}`)
          }
        )
      },
      sendNotification () {
        let accountId = this.content.accountId
        if (!accountId) {
          alert('账号信息不正确')
          return
        }

        if (!this.notificationContent) {
          alert('请先填写站内信内容')
          return
        }
        if (this.isSendingNotification) {
          alert('正在等待服务器返回结果，请稍候')
          return
        }

        this.isSendingNotification = true
        let url = ReqUrl.Notification.postItem()

        let data = {
          accountId,
          msg: this.notificationContent
        }
        Req.Post(
          url,
          data,
          res => {
            console.log(res)
            this.isSendingNotification = false
            alert('站内信发送成功')
          },
          fail => {
            console.log(fail)
            if (fail.response.data) {
              alert(fail.response.data.userMessage)
            }
          }
        )
      },
      parseImageUrl (url) {
        let host = location.host
        if (url.indexOf(host) === -1) {
          return url
        }
        let r = 'x.xiangshixi.cc:8080'
        if (url.indexOf(r) !== -1) {
          let p = url.split(r)
          return p[1]
        }

        if (url.indexOf('http') === -1) {
          return `//${url}`
        } else {
          return url.replace(/^https?:/, '')
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .enterprise-editor {
    .info-form {
      border: 1px solid #ddd;
      padding: 20px;
      width: 100%;
      text-align: left;
      font-size: 13px;

      .row {
        overflow: hidden;
        border-bottom: 1px solid #ddd;
        padding-top: 5px;
        padding-bottom: 5px;
        .col {
          float: left;
        }
      }

      .label {
        width: 5em;
        margin-right: 1em;
        text-align: left;
      }
      .img {
        max-width: 200px;
        max-height: 200px;

        img {
          width: 100%;
        }
      }
      .pre-text {
        white-space: pre-line;
      }
    }
    .action {
      .value {
        margin-right: 10px;
      }
      .btn {
        margin-right: 10px;

      }
    }
  }
  .disabled {
    opacity: 0.3;
  }

  textarea.notification-msg,
  input.password-box {
    border: 1px solid #888;
    float: left;
    margin-right: 15px;

    &::-webkit-input-placeholder {
      color: #888;
    }
  }
</style>
