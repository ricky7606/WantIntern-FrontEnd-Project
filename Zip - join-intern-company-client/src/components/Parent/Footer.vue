<template lang="html">
  <div class="wi-footer flex-col" :style="itemStyle">
    <div class="content flex-col">
      <div class="links flex-row flex-center" v-if="links.length > 0">
        友情链接：
        <a :href="parseUrl(item.url)" target="_blank" class="lk" v-for="item in links">
          {{item.title}}
        </a>
      </div>
      <div class="message flex-row flex-center">
        <a href="#/mine/help/FOOTER_INTRO">关于我们</a>
        <a href="#/mine/help/FOOTER_ENTERPRISE_HELP">企业帮助</a>
        <a href="#/mine/help/FOOTER_STUDENT_HELP">学生帮助</a>
      </div>
      <div class="message flex-row flex-center">
        {{ address }}
      </div>
      <!-- <div class="message flex-row flex-center" v-if="intro">
        {{ intro }}
      </div> -->
      <div class="message flex-row flex-center">
        Copyright © 2016 www.xiangshixi.com <a href="http://www.miitbeian.gov.cn" style="font-size: inherit; font-color: inherit;"> 沪ICP备16010538号 </a> 
         <div style="display:inline-block;overflow: hidden;">
          <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010402004150" style="display:inline-block;text-decoration:none;">
            <img :src="imgGongan" style="float:left;width: 15px;height: 15px;"/>
            <p style="float:left;margin: 0px 0px 0px 5px;">沪公网安备 31010402004150号</p >
          </a>
        </div>
        All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script>
  import * as MetaProxy from '@/api/proxy.js'
  import imgGongan from '../../assets/gongan.png'

  export default {
    name: 'Footer',
    data () {
      return {
        links: [
          {
            title: '享实习',
            url: 'www.xiangshixi.com'
          },
        ],
        address: '办公室地址：上海市徐汇区钦州南路81号205室 联系电话：021-54015501',
        intro: '',
        imgGongan,
      }
    },
    props: {
      itemStyle: {
        type: [Object],
        default () {
          return {}
        }
      },
    },
    mounted () {
      MetaProxy.Get('FOOTER_LINKS', res => {
        if (res) {
          this.links = res
        }
      })
      MetaProxy.Get('FOOTER_ADDRESS', res => {
        if (res) {
          this.address = res[0].title
        }
      })
      // MetaProxy.Get('FOOTER_INTRO', res => {
      //   if (res) {
      //     this.intro = res[0].title
      //   }
      // })
    },
    methods: {
      parseUrl (url) {
        if (url.indexOf('http') === -1) {
          return `//${url}`
        } else {
          return url
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .wi-footer {
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #404A61;
    text-align: center;
    height: 114px;

    .content {
      display: inline-block;
      width: @MIN-WIDTH;
      min-width: @MIN-WIDTH;
    }

    .links {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 14px;
      margin-top: 8px;
      text-align: center;

      a {
        text-decoration: none;
        color: inherit;
        display: inline-block;
        margin-right: 12px;
      }
    }
    .message {
      margin-top: 16px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 14px;

    a {
      color: #FFFFFF;
      padding: 0 10px;
      }
    }
  }
</style>
