<template lang="html">
  <div class="register-phonenumber children-2-col xsx-form-theme">
    <div class="left">

      <div class="input-label">手机号</div>
      <div class="input-block">
        <input class="w272"
          type="text"
          size="11"
          ref="phoneNumber"
          @keyup="numberOnlyInput"
          v-model="account"
          placeholder="请输入" />
      </div>

      <div class="input-label">验证码</div>
      <div class="input-block">
        <input class="col w180" type="text" v-model="tokenNumber" placeholder="请输入" />
        <div class="btn w82 col btn-getToken"
          :class="{enabled: readyToGetTokenNumber}"
          @click="getTokenNumber">
          {{ getTokenNumberHintText }}
        </div>
      </div>

      <div class="input-label">密码</div>
      <div class="input-block">
        <input class="w272" type="password" v-model="password"
          @focus="isPassword1Inputing = true"
          @click="isPassword1Inputing = true"
          @keyup="isPassword1Inputing = true"
          @blur="isPassword1Inputing = false"
          placeholder="请输入">
        <div class="format-hint-text" v-show="isPassword1Inputing && password.length < 6">密码至少6位，不能都是数字</div>
      </div>


      <!-- <div class="input-label">校验码</div>
      <div class="input-block">
        <input class="col w180" type="password" v-model="password" placeholder="请输入">
        <div class="btn w82 col">
          图片
        </div>
      </div> -->

      <div class="btn w272" @click="submit">{{nextStepTitle}}</div>
    </div>
    <div class="right">
      <div class="row margin-bottom-30">
        已有账号，直接<span class="login clickable" @click="gotoLogin">登录</span>
      </div>
      <div class="input-block">
        <a href="#/account/wechat-login">
          <div class="btn plain row">
            {{'微信登录 >'}}
          </div>
        </a>
      </div>
      <div class="input-block">
        <a href="/enterprise">
          <div class="btn plain orange row">
            {{'企业登录 >'}}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import * as Storage from '@/utils/storage.js'
  const localStorageLabel = 'sendMsgTime'
  let lastSendMsgTime = Storage.Get(localStorageLabel) || ''
  let ONE_MINUTE = 1000 * 60
  let lastMsgSendSetTimeOutCounter = 0
  let lastMsgSendSetIntervalOutCounter = 0

  let msgWrongNumber = '您输入的手机号码不正确，请检查~'

  export default {
    name: 'PhoneNumber',
    data () {
      return {
        account: '',
        password: '',
        tokenNumber: '',
        readyToGetTokenNumber: true,
        getTokenNumberHintText: '获取验证码',
        nextStepTitle: '下一步',
        processing: false,
        isPassword1Inputing: false,
      }
    },
    methods: {
      submit () {
        const that = this
        let account = this.account
        let password = this.password

        if (this.processing) return

        if (password.length < 6) {
          alert('请输入至少6位的密码')
          return
        }
        if (account.length !== 11) {
          alert('请输入至少6位的密码')
          return
        }

        this.checkTokenNumber(tag => {
          if (tag === 'fail') {
            alert('您的验证码有误，请检查，或者重新获取。')
            this.tokenNumber = ''
            return
          }
          if (tag === 'success') {
            console.log(tag)
            try {
              sessionStorage.setItem('accounts', JSON.stringify({
                stage: 'register',
                phone: account,
                password
              }))
            } catch (err) {
              console.log(err)
            }

            this.processing = true
            this.nextStepTitle = '下一步 (正在提交数据...)'
            Req.Post(ReqUrl.StudentSubUrl.register(),
              {
                account: {
                  phone: account,
                  password,
                }
              },
              res => {
                // 登录
                Req.Post(ReqUrl.StudentSubUrl.login(),
                  {
                    phone: account,
                    password,
                  },
                  res => {
                    console.log(res)
                    that.$router.push({
                      name: 'RegisterAgreement'
                    })
                  }
                )
              },
              fail => {
                let data = fail.response.Data
                console.log(data)
                alert(data.userMessage)

                this.processing = false
                this.nextStepTitle = '下一步'

                if (data.status === 403) {
                  that.$router.push({
                    name: 'Login'
                  })
                }
              }
            )
          }
        })
      },
      numberOnlyInput (ev) {
        let input = this.$refs['phoneNumber']
        let value = input.value
        let m = value.match(/\d+/)

        if (m) {
          this.account = m[0].substr(0, 11)
        } else {
          this.account = ''
        }
      },
      gotoLogin () {
        this.$router.push({
          name: 'Login'
        })
      },
      checkTokenNumber (cbfn = res => res) {
        let phone = this.account
        let token = this.tokenNumber
        if (!phone || !token) return
        if (phone.length !== 11) {
          alert(msgWrongNumber)
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
        let phoneNumber = this.account
        if (phoneNumber.length !== 11) {
          alert('请检查您的手机号码，再尝试获取验证码。')
          return
        }

        let time = new Date().getTime()
        if (lastSendMsgTime && (time - lastSendMsgTime.time < ONE_MINUTE)) {
          alert('您获取验证码速度过快，请稍后再试。')
          return
        }

        this.getTokenNumberHintText = '正在发送'

        sendTokenNumber(phoneNumber, res => {
          Storage.Set({
            time
          })

          let countSecond = 60
          this.getTokenNumberHintText = `已发送(${countSecond})`

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
  @import "../../less/common.less";
  @import "../../less/form.less";

  .register-phonenumber {
    display: block;
    width: 645px;
    // height: 367px;
    padding-bottom: 70px;
    margin: 0 auto;
    background-color: white;

    padding-top: 40px;

    .left {
      padding-left: 60px;
      padding-right: 50px;
      border-right: 1px solid #E5E6EB;

      width: 382px;

      .input-block {
        width: 100%;
        overflow: hidden;

        input, .btn {
          float: left;
        }
      }

      .w180 {
        width: 180px;
        margin-right: 8px;
      }
      .w82 {
        width: 82px;
      }
      .w272 {
        width: 270px;
      }

      // 获取验证码
      .btn-getToken {
        background-color: #E5E6EB;

        &.enabled {
          background-color: #0DABF4;
        }
      }
    }
    .right {
      width: 262px;
      padding: 0 50px;

      .btn {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #0DABF4;
        letter-spacing: 0;
      }
    }

    .margin-bottom-30 {
      margin-bottom: 30px;

      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #819292;
      letter-spacing: 0;
      line-height: 14px;

      .login {
        color: #0DABF4;
      }
    }
  }
  .clickable {
    cursor: pointer;
  }
</style>
