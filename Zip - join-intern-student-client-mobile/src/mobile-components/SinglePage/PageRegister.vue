<template lang="html">
  <div class="page-reset-password">
    <div class="content">
      <div class="msg-row">
        注册账户：{{phone}}
      </div>
      <title-input v-for="line in inputList"
        :key="line.title"
        :title="line.title"
        :type="line.type"
        :placeholder="line.placeholder"
        v-model="line.value" />
    </div>

    <div class="btn btn-submit"
      @click="submit"
      :class="{ enabled: isSubmitReady }">
      确定
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  import pageMixin from '../Pages/pages-mixins.js'
  import TitleInput from '@/mobile-components/Form/TitleInput.vue'
  import { Toast } from 'mint-ui'
  import * as Storage from '@/utils/storage.js'

  const inputList = [
    // {
    //   title: '原密码',
    //   type: 'password',
    //   placeholder: '请输入原密码',
    // },
    {
      title: '密码',
      type: 'password',
      placeholder: '请输入密码',
    },
    {
      title: '确认密码',
      type: 'password',
      placeholder: '请确认密码',
    },
  ]

  export default {
    name: 'PageRegister',
    mixins: [pageMixin],
    mounted () {
      this.changePageTitle()

      let {
        unionid, phone
      } = this.$route.params

      if (!unionid || !phone) {
        Toast('参数不对，为您跳转到主页')
        setTimeout(x => {
          this.$router.replace({
            name: 'PageMain'
          })
        }, 500)
      } else {
        this.unionid = unionid
        this.phone = phone
      }
    },
    data () {
      return {
        pageTitle: '注册账号',

        inputList: inputList.map(item => {
          item.value = ''
          return item
        }),
        unionid: '',
        phone: '',
      }
    },
    components: {
      TitleInput,
    },
    methods: {
      checkSubmit () {
        let list = this.inputList
        let newPs = list[0].value
        let confirm = list[1].value

        if (!newPs) return '请输入新秘密'
        if (!confirm) return '请输入确认密码'

        if (newPs.length < 6) return '密码长度不小于6位'
        if (newPs !== confirm) return '两次输入的密码不同'

        return true
      },
      submit () {
        let txt = this.checkSubmit()

        if (txt === true) {
          let phone = this.phone
          let password = this.inputList[0].value

          Req.Post(ReqUrl.StudentSubUrl.register(),
            {
              account: { phone, password }
            },
            res => {
              Req.Post(ReqUrl.StudentSubUrl.login(),
                { phone, password },
                res => {
                  console.log(res)

                  this.bindingUnionId(res => {
                    Toast('账号注册成功，为您跳转到主页')
                    setTimeout(x => {
                      this.$router.replace({
                        name: 'PageMain'
                      })
                    }, 1000)
                  })
                },
                fail => {
                  Toast(fail.response.data.userMessage)
                }
              )
            },
            fail => {
              console.log(fail)
              Toast(fail.response.data.userMessage)
            }
          )
          console.log('submit')
        } else {
          Toast(txt)
        }
      },
      bindOpenid (openid) {
        Req.Put(
          ReqUrl.OtherSubUrl.putOpenIdToAccount(0, openid),
          res => {
            console.log('绑定OpenId成功')
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
            let openid = Storage.Get(Storage.OPENID_STORAGE_TAG)
            if (openid) {
              this.bindOpenid(openid)
              this.$nextTick(x => {
                successCbfn()
              })
            } else {
              successCbfn()
            }
          }
        )
      },
    },
    computed: {
      isSubmitReady () {
        let txt = this.checkSubmit()
        return txt === true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../less/common.less';
  @import '../../less/mobile.less';

  .content {
    margin-top: 10px;
    margin-bottom: 30px;
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
  .msg-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 15px;

    font-size: 14px;
    color: #656565;
    background-color: white;
    line-height: 2em;
    line-height: 2em;
  }
</style>
