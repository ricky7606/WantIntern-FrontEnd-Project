<template lang="html">
  <div class="page-reset-password">
    <div class="content">
      <title-input
        :key="phone.title"
        :title="phone.title"
        :type="phone.type"
        :placeholder="phone.placeholder"
        v-model="phone.value" />

      <!-- <div class="form-group" v-show="!loginMode">
        <div class="msg-box flex-row">
          <input type="text"
            v-model="msg.value"
            :placeholder="msg.placeholder" />

          <div class="btn-send"
            :class="{enabled: readyToGetTokenNumber}"
            @click="getTokenNumber">
            <span class="sep-line"></span>
            {{ getTokenNumberHintText }}
          </div>
        </div>
      </div> -->
      <!-- 登录密码 -->
      <div class="form-group" v-show="loginMode">
        <title-input
          :key="password.title"
          :title="password.title"
          :type="password.type"
          :placeholder="password.placeholder"
          v-model="password.value" />
      </div>

      <div class="agreement-row" @click="agreementChecked = !agreementChecked" v-show="!loginMode">
        <span class="check-box" v-show="!agreementChecked"></span>
        <span class="check-box-checked" v-show="agreementChecked" :style="AccountPage.checked| imgbg"></span>
        本人已阅读
        <span class="link-agreement" @click.stop="lookupAgreement">《授权及责任说明书》</span>
        理解并同意其全部内容
      </div>
    </div>

    <div class="btn btn-submit"
      @click="submit"
      v-show="!loginMode"
      :class="{ enabled: isSubmitReady }">
      确认
    </div>

    <div class="btn btn-submit"
      @click="submitAccount"
      v-show="loginMode"
      :class="{ enabled: isSubmitAccountReady && !isSubmitingAccount }">
      登录并绑定
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import pageMixin from '../Pages/pages-mixins.js'
  import TitleInput from '@/mobile-components/Form/TitleInput.vue'
  import { AccountPage } from '@/assets/wechat-stu/index.js'
  import { Toast } from 'mint-ui'

  import * as Storage from '@/utils/storage.js'
  const localStorageLabel = 'sendMsgTime'
  let lastSendMsgTime = Storage.Get(localStorageLabel) || ''
  let ONE_MINUTE = 1000 * 60
  let lastMsgSendSetTimeOutCounter = 0
  let lastMsgSendSetIntervalOutCounter = 0
  let msgWrongNumber = '您输入的手机号码不正确，请检查~'

  export default {
    name: 'PageBindingPhone',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()

      this.unionid = this.$route.params.unionid
      this.phone.value = this.$route.params.phone
    },
    data () {
      return {
        pageTitle: '绑定手机号',
        AccountPage,

        agreementChecked: false,
        phone: {
          title: '',
          type: 'text',
          placeholder: '请输入手机号',
          value: '',
        },
        password: {
          title: '',
          type: 'password',
          placeholder: '请输入密码',
          value: '',
        },
        msg: {
          title: '',
          type: 'text',
          placeholder: '验证码',
          value: '',
        },
        readyToGetTokenNumber: true,
        getTokenNumberHintText: '获取验证码',

        unionid: '',

        loginMode: true,
        isSubmitingAccount: false
      }
    },
    components: {
      TitleInput,
    },
    methods: {
      checkSubmitReady () {
        let phoneValue = this.phone.value
        let msgValue = this.msg.value

        if (!phoneValue) return '请输入手机号'
        if (!msgValue) return '请输入验证码'
        if (!this.agreementChecked) return '请先阅读《授权及责任说明书》'

        return true
      },
      checkSubmitAccountReady () {
        let phoneValue = this.phone.value
        let password = this.password.value

        if (!phoneValue) return '请输入手机号'
        if (!password) return '请输入密码'

        return true
      },
      submitAccount () {
        let status = this.checkSubmitAccountReady()

        if (status === true) {
          if (this.isSubmitingAccount) return

          this.isSubmitingAccount = true

          let phone = this.phone.value
          let password = this.password.value

          Req.Post(ReqUrl.StudentSubUrl.login(),
            {
              phone,
              password,
            },
            res => {
              console.log(res)
              this.isSubmitingAccount = false

              this.bindingUnionId(res => {
                Toast('账号绑定成功，为您跳转到主页')
                setTimeout(x => {
                  this.$router.replace({
                    name: 'PageMain'
                  })
                }, 1000)
              })
            },
            fail => {
              console.log(fail)
              this.isSubmitingAccount = false

              if (fail.response.data) {
                Toast(fail.response.data.userMessage)
                this.password.value = ''
              }
            }
          )
        } else {
          Toast(status)
        }
      },
      submit () {
        let txt = this.checkSubmitReady()

        if (txt === true) {
          this.checkTokenNumber(res => {
            // console.log(res)
            if (res === 'success') {
              // 验证码正确
              // 检查手机号 是否注册过账号
              this.checkAccountRegistered(
                this.phone.value,
                res => {
                  console.log(res)
                  this.loginMode = true
                  Toast('当前手机号已注册了账户，请登录')
                },
                fail => {
                  console.log('账号未注册，重新走注册流程')
                  Toast('您的手机号尚未注册账户，当前为您跳转到注册页。')
                  setTimeout(x => {
                    this.$router.push({
                      name: 'PageRegister',
                      params: {
                        unionid: this.unionid,
                        phone: this.phone.value
                      }
                    })
                  }, 1000)
                }
              )
            } else {
              // 验证码有误
              Toast('验证码有误，请重新获取')
              this.msg.value = ''
            }
          })
        } else {
          Toast(txt)
        }
      },
      lookupAgreement () {
        this.$router.push({
          path: '/agreement'
        })
      },
      // 验证手机号码
      checkTokenNumber (cbfn = res => res) {
        let phone = this.phone.value
        let token = this.msg.value
        if (!phone || !token) return
        if (phone.length !== 11) {
          // alert(msgWrongNumber)
          Toast(msgWrongNumber)
          return
        }

        checkTokenNumber(phone, token, res => {
          let createTime = res.createTime
          console.log(createTime)
          cbfn('success')
        }, fail => {
          cbfn('fail')
          return
        })
      },
      getTokenNumber () {
        let phoneNumber = this.phone.value
        if (phoneNumber.length !== 11) {
          Toast('请检查您的手机号码，再尝试获取验证码。')
          return
        }

        let time = new Date().getTime()
        if (lastSendMsgTime && (time - lastSendMsgTime.time < ONE_MINUTE)) {
          Toast('您获取验证码速度过快，请稍后再试。')
          return
        }

        this.getTokenNumberHintText = '正在发送'

        sendTokenNumber(phoneNumber, res => {
          Storage.Set({ time })

          let countSecond = 60
          this.getTokenNumberHintText = `已发送(${countSecond})`
          Toast({
            message: '验证码已发送',
            position: 'bottom',
            duration: 500,
          })

          clearTimeout(lastMsgSendSetTimeOutCounter)
          lastMsgSendSetTimeOutCounter = setTimeout(() => {
            this.readyToGetTokenNumber = true
          }, ONE_MINUTE)

          const that = this
          clearInterval(lastMsgSendSetIntervalOutCounter)

          function next () {
            countSecond = countSecond - 1

            if (countSecond === 0) {
              that.getTokenNumberHintText = `获取验证码`
              that.readyToGetTokenNumber = true

              clearInterval(lastMsgSendSetIntervalOutCounter)
            } else {
              that.getTokenNumberHintText = `已发送(${countSecond})`
            }
          }

          lastMsgSendSetIntervalOutCounter = setInterval(next, 1000)
        }, fail => {
          alert(fail.response.data.userMessage)
          return
        })
        this.readyToGetTokenNumber = false
      },
      // 验证手机号是否已经注册
      checkAccountRegistered (phone, cbfn = x => x, failCbfn = x => x) {
        let password = 'fakePasswordNo12345'

        Req.Post(ReqUrl.StudentSubUrl.login(),
          {
            phone,
            password,
          },
          res => {
            if (res.frozen) {
              // 被禁用
              let url = ReqUrl.OtherSubUrl.postLogout()
              Req.Post(url, undefined, res => {
              }, fail => {
              })
              return
            }
          },
          fail => {
            // alert(fail.response.data.userMessage)
            let data = fail.response.data
            if (data.status === 403) {
              // 密码错误
              cbfn(data)
            } else {
              failCbfn(data)
            }
          }
        )
      },
      bindingUnionId (successCbfn = x => x) {
        let unionid = this.unionid
        // 绑定UnionId
        Req.Put(
          ReqUrl.OtherSubUrl.putWechatOpenIdToAccount(0, unionid),
          null,
          res => {
            successCbfn(res)
            console.log('绑定UnionId成功')
          }
        ).catch(err => {
          console.log(err)
          alert('该账号已绑定其他微信号，请在PC端登录账号解除已绑定微信号后重新绑定，谢谢！')
        })
      },
    },
    computed: {
      isSubmitReady () {
        let txt = this.checkSubmitReady()
        return txt === true
      },
      isSubmitAccountReady () {
        let txt = this.checkSubmitAccountReady()
        return txt === true
      },
    }
  }

  function sendTokenNumber (phoneNumber, cbfn = res => res, fail = res => res) {
    Req.Post(ReqUrl.OtherSubUrl.postCodes(`?phone=${phoneNumber}`),
      '',
      cbfn,
      fail
    )
  }
  function checkTokenNumber (phone, code, cbfn = res => res, fail = res => res) {
    console.log(phone)
    Req.Get(ReqUrl.OtherSubUrl.checkCodes(`?phone=${phone}&code=${code}`),
      '',
      cbfn,
      fail
    )
  }
</script>

<style lang="less" scoped>
  @import '../../less/common.less';
  @import '../../less/mobile.less';

  .content {
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .form-group {
    margin-top: 10px;

    input {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      line-height: 44px;
      color: #333333;
      height: 44px;

      padding: 0 15px;
      width: 100%;

      &:-webkit-input-placeholder {
        color: #C5C5C5;
      }
    }

    .msg-box {
      padding-right: 105px;
      background-color: white;
      width: 100%;
      position: relative;
      line-height: 44px;
      height: 44px;

      .btn-send {
        width: 105px;
        text-align: center;

        font-family: PingFangSC-Regular;
        font-size: 30px/2;
        color: #0DABF4;
        position: absolute;
        right: 0px;
        top: 0px;
        line-height: 44px;
        height: 44px;

        .sep-line {
          height: 13.5px;
          border-left: 1px solid #C5C5C5;

          position: absolute;
          left: 0;
          top: 15.5px;
        }
      }
    }
  }
  .agreement-row {
    font-family: PingFangSC-Light;
    font-size: 24px/2;
    color: #828282;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 15px;
    margin-top: 10px;

    .check-box {
      border: 1px solid #9B9B9B;
      border-radius: 4px/2;
      margin-right: 8px;

      display: inline-block;
      .sqr(13px);
    }
    .check-box-checked {
      margin-right: 8px;

      display: inline-block;
      .sqr(13px);
      .icon();
    }
    .link-agreement {
      font-family: PingFangSC-Light;
      font-size: 24px/2;
      color: #0DABF4;
      // line-height: 33px;
    }
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
</style>
