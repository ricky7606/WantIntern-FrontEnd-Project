<template lang="html">
  <div class="wi-header flex-center">
    <div class="content flex-row">
      <div class="flex-row flex-center left">
        <a href="#" class="link2home icon" :style="imgBg(imgLogo)"></a>
        <div class="category-row flex-row flex-center">
          <div class="category pointer-on"
            :class="{selected: selectedCategory.key === c.key}"
            @click="selectCategory(c)"
            v-for="c in category">
            {{c.title}}
          </div>
        </div>
      </div>

      <div class="flex-row flex-bi-center function-btns right">
        <div class="btn pointer-on pos-relative" v-for="btn in functionBtn"
          @click.stop="functionalBtnClick(btn.key, btn)"
          :class="{
            colored: btn.type === 'colored',
            actived: btn.type === 'option' && menuSelected
          }">
          {{ btn.title }}

          <div class="arrow-down" v-if="btn.type === 'option'"
               :style="imgBg(menuSelected ? iconArrowUp : iconArrowDown)"></div>

          <div class="menu" v-if="btn.type === 'option' && menuSelected">
            <template v-for="item in btn.optionList">
              <div class="menu-item pointer-on"
                @click.stop="functionalBtnClick(item.key, item)">{{item.title}}</div>
            </template>
          </div>

          <div class="point-has-new" v-if="btn.hasNew"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import imgLogo from '@/assets/logo.png'
  import iconArrowDown from '../../assets/pc-stu/icon-arrow-down.png'
  import iconArrowUp from '../../assets/pc-stu/icon-arrow-up.png'
  import { Account } from '@/api/account.js'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  let counterHideMenu = 0
  const LoginHeaderFunctionBtn = [
    {
      title: '我的消息',
      key: 'mine/message',
      type: 'normal',
      hasNew: false,
    },
    {
      title: '我的简历',
      key: 'mine/resume',
      type: 'normal'
    },
    {
      title: '我的实习',
      key: 'mine/interns',
      type: 'normal'
    },
    {
      title: '收藏',
      key: 'mine/collect',
      type: 'normal'
    },
    {
      title: '用户名',
      key: '@mine',
      type: 'option',
      optionList: [
        {
          title: '账号设置',
          key: 'mine/setting',
          type: 'menu-item',
        },
        {
          title: '订阅推荐',
          key: 'mine/subscription',
          type: 'menu-item',
        },
        {
          title: '退出账号',
          key: 'account/logout',
          type: 'menu-item',
        },
      ]
    },
    {
      title: '进入企业版',
      key: '@enterprise',
      type: 'normal',
    },
  ]

  let functionBtnNoLogin = [
    {
      title: '进入企业版',
      key: '@enterprise',
      type: 'normal',
    },
    {
      title: '登录',
      key: 'account/login',
      type: 'colored',
    },
    {
      title: '注册',
      key: 'account/register',
      type: 'colored',
    },
  ]

  export default {
    name: 'Header',
    mounted () {
      const that = this
      Account.anounceList.push(res => {
        that.afterLogin()
      })
      Account.logoutAnnounceList.push(res => {
        that.functionBtn = functionBtnNoLogin
      })

      Req.Get(ReqUrl.StudentSubUrl.getItem(), '',
        res => {
          Account.changeAndAnnounce(res)
          console.log('Header')
        }
      )
      document.addEventListener('click', ev => {
        if (this.menuSelected) {
          this.menuSelected = false
        }
      }, false)
    },
    data () {
      return {
        imgLogo,
        iconArrowDown,
        iconArrowUp,

        category: [
          {
            title: '首页',
            key: 'home'
          },
          {
            title: '企业',
            key: 'company'
          },
          {
            title: '资讯',
            key: 'news'
          },
        ],
        selectedCategory: {},

        functionBtn: functionBtnNoLogin,
        selectedBtn: {},

        menuSelected: false,
      }
    },
    methods: {
      selectCategory (cat) {
        this.selectedCategory = cat
        this.$router.replace({
          path: `/${cat.key}`
        })
      },
      imgBg (url) {
        return {
          backgroundImage: `url(${url})`
        }
      },
      functionalBtnClick (key, btn) {
        if (btn.type === 'option') {
          this.menuSelected = !this.menuSelected
          clearTimeout(counterHideMenu)
          // 3秒钟自动关闭菜单
          counterHideMenu = setTimeout(() => {
            this.menuSelected = false
          }, 3000)
        }

        if (key.indexOf('@') === 0) {
          if (key === '@enterprise') {
            // 前往企业版
            location.href = '/enterprise/index.html'
          }
          return
        }

        let path = `/${key}`
        if (key === 'mine/message') {
          btn.hasNew = false
        }
        this.$router.push({
          path
        })
      },
      afterLogin () {
        let userInfo = Account.accountInfo
        let item = LoginHeaderFunctionBtn.find(item => item.key === '@mine')
        if (item) {
          item.title = userInfo.name || '我的'
        }
        item = LoginHeaderFunctionBtn.find(item => item.key === 'mine/message')
        if (item) {
          item.hasNew = userInfo.account.unreadNotis > 0
        }

        this.functionBtn = LoginHeaderFunctionBtn
      },
      closeMask () {
        this.menuSelected = false
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .wi-header {
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: white;
    height: 70px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
    // box-shadow: 2px 0px 2px gray;

    .link2home {
      width: 175px;
      height: 70px;

      background-repeat: no-repeat;
      background-position: center;
      background-size: 60%;
    }
    .content {
      display: flex;
      justify-content: space-between;
      width: @MIN-WIDTH;
      min-width: @MIN-WIDTH;
      height: 70px;
      // overflow: hidden;

      .left {
        float: left;
      }
      .right {
        float: right;
      }
    }

    .category-row {
      .category {
        display: inline-block;
        padding: 28px 10px;
        padding-bottom: 26px;
        margin-right: 40px;
        cursor: pointer;

        &.selected {
          color: #0DABF4;
        }
      }
    }

    .function-btns {
      .pos-relative {
        position: relative;
      }

      .btn {
        display: flex;
        align-items: center;
        background: #FFFFFF;
        border: 1px solid #819292;
        border-radius: 30px;
        height: 30px;
        position: relative;

        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #819292;
        letter-spacing: 0;
        line-height: 16px;
        padding: 6px 12px;

        margin-right: 9px;

        &:last-of-type {
          margin-right: 0px;
        }

        &.colored {
          border-color: #0DABF4;
        }

        &.actived {
          border-color: #0DABF4;
          background-color: #0DABF4;
          color: white;
        }

        .point-has-new {
          display: inline-block;
          background-color: #FF8000;
          width: 8px;
          height: 8px;
          border-radius: 50%;

          position: absolute;
          top: 0;
          right: 5px;
        }

        .arrow-down {
          display: inline-block;
          height: 6.8px;
          width: 6.8px;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          margin-left: 10px;
        }

        .menu {
          background: #819292;
          border-radius: 2px;
          padding: 16px;

          position: absolute;
          top: 34px;
          left: 0px;
          z-index: 1000;

          .menu-item {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 14px;

            margin-bottom: 16px;
            white-space: nowrap;

            &:last-of-type {
              margin-bottom: 0px;
            }
          }
        }
      }
    }
  }
</style>
