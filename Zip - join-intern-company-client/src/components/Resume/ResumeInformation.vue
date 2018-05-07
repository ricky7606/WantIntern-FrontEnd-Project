<template lang="html">
  <div class="resume-information xsx-form-theme">
    <!-- {{data}} -->
    <div class="line-frame padding-30-20">
      <div class="row space-between margin-bottom-15">
        <div class="col left position-info">
          <div class="col">应聘职位</div>
          <div class="col position-title">{{data.position.title}}</div>
        </div>
        <div class="col right">
          <div class="btn-cancel col btn plain pointer-on" @click="cancel">淘汰</div>
          <div class="btn-send col btn pointer-on" @click="sendInterview">面试通知</div>
        </div>
      </div>

      <div class="user-msg">
        <div class="row name-card align-left pointer-on">
          <div class="col icon" :style="imgBg(data.student.avatar)"></div>

          <div class="col align-left msg">
            <div class="row">
              <span class="col title">{{data.student.name}}</span>
            </div>
            <div class="row">
              <span>{{ mapReqGender[data.student.gender] }}</span> |
              <span>{{ data.student.area }}</span> |
              <span>{{ mapReqEdu[data.student.education] }}</span>
            </div>
            <div class="row">
              {{ parseDate(data.createTime) }} 投递
            </div>
          </div>
        </div>
      </div>

      <div class="msg-board">
        <div class="row align-left">
          <div class="input-label label">教育信息</div>
        </div>
        <div class="input-block-divide-line margin-bottom-20"></div>

        <div class="input-block align-left" v-for="item in NameList">
          <div class="col label align-right">{{ item.title }}</div>
          <div class="col value">{{ parseByKey(data.student, item.key) }}</div>
        </div>

        <div class="input-block align-left" v-for="item in OtherInformation">
          <div class="col label align-right">{{ item.title }}</div>
          <!-- <div class="col value image">{{ parseByKey(data.student, item.key) }}</div>
          <div class="col value">{{ parseByKey(data.student, item.key) }}</div> -->
          <div class="col value format-pre" v-if="item.type === 'MultilineString'">{{ parseByKey(data.student, item.key) }}</div>
          <div class="col value image" v-if="item.type === 'ImageUrlString'">
            <img :src="data.student[item.key]">
          </div>
          <div class="col value image" v-if="item.type === 'ImageUrlString.List'">
            <template v-for="img in data.student[item.key]">
              <img :src="img">
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapReqGender, mapReqEdu, mapReqLangLevel } from '@/components/Position/PositionEnum.js'
  import {
    NameList, OtherInformation,
  } from '@/components/Resume/ResumeInformationRowList.js'

  export default {
    name: 'ResumeInformation',
    data () {
      return {
        mapReqGender,
        mapReqEdu,
        mapReqLangLevel,

        NameList,
        OtherInformation,
      }
    },
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    methods: {
      imgBg (imgUrl) {
        return {
          backgroundImage: `url(${imgUrl})`
        }
      },
      parseDate (str) {
        if (!str) return str

        let list = str.split(' ')
        return list[0]
      },
      parseByKey (dict, key) {
        if (key === 'education') {
          return this.mapReqEdu[dict[key]]
        } else if (key === 'langLevel') {
          return this.mapReqLangLevel[dict[key]]
        } else {
          return dict[key]
        }
      },
      sendInterview () {
        this.$emit('send', this.data)
      },
      cancel () {
        this.$emit('cancel', this.data)
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .resume-information {
    .padding-30-20 {
      padding: 30px 20px;
    }

    .position-info {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #819292;
      letter-spacing: 0;
      line-height: 16px;

      .position-title {
        margin-left: 20px;

        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #454F66;
        letter-spacing: 0;
        line-height: 20px;
      }
    }
  }

  .name-card {
    // background-color: #FBFBFB;
    margin-bottom: 10px;
    padding: 20px;
    width: 258px;
    overflow: hidden;
    user-select: pointer;
    margin-bottom: 30px;

    .icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 20px;
      vertical-align: top;

      .icon();
      background-size: cover;
    }
    .msg {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #A3A8B5;
      letter-spacing: 0;
      line-height: 14px;

      .row {
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0px;
        }
      }
      .title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #656565;
        letter-spacing: 0;
        line-height: 16px;

        margin-right: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .position-name {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #A3A8B5;
        letter-spacing: 0;
        line-height: 14px;
      }
    }
  }

  .msg-board {

    .label {
      display: inline-block;
      margin-right: 20px;
      vertical-align: top;

      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #819292;
      letter-spacing: 0;
      width: 4.2em;
      // line-height: 16px;
    }

    .input-block {
      padding-left: 5.2em;
      position: relative;

      .label {
        position: absolute;
        left: 0;
        top: 0;
      }
      .col.image {
        img {
          max-width: 360px;
          max-height: 260px;
          margin-right: 10px;
        }
      }
    }
  }
  .format-pre {
    white-space: pre-line;
  }
  .align-right {
    text-align: right;
  }
  .margin-bottom-15 {
    margin-bottom: 15px;
  }
</style>
