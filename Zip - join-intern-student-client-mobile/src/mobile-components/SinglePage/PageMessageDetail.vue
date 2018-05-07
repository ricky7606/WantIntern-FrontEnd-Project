<template lang="html">
  <div class="page-message-detail">
    <!-- 待学生确认 -->
    <div class="content" v-if="resumeIdLoadMore || resumeStatus === 'WAIT_STU_CONFIRM' || resumeStatus === 'WAIT_COMP_CONFIRM'">
      <div class="time flex-row">
        {{ msgContent.createTime }}
      </div>
      <div class="msg-content">
        {{ msgContent.msg }}
      </div>

      <div class="resume">
        <div class="flex-row">
          面试时间：{{ resumeContent.interviewTime }}
        </div>
        <div class="flex-row">
          地址：{{ resumeContent.interviewPlace }}
        </div>
        <div class="flex-row">
          联系人：{{ resumeContent.contact }}
        </div>
        <div class="flex-row">
          联系电话：{{ resumeContent.contactPhone }}
        </div>
        <div class="flex-row" v-show="resumeContent.commentComp">
          备注：{{ resumeContent.commentComp }}
        </div>
      </div>
    </div>

    <!-- 修改面试时间 -->
    <div class="board change-interview-time" v-if="resumeStatus === 'WAIT_STU_CONFIRM'">
      <div class="flex-row flex-between title">
        <div class="title">修改面试时间</div>
        <div class="toggle">
          <!-- <span class="toggle-desc">（过期，无法修改）</span> -->
          <div class="btn"
          @click="isToggleChangeDate = !isToggleChangeDate"
          :style="(isToggleChangeDate ? ToggleCheck.checked : ToggleCheck.unchecked) | imgbg"></div>
        </div>
      </div>
      <div class="interview-time-selector" v-show="isToggleChangeDate">
        <div class="flex-row align-left margin-bottom-10">
          面试时间：
          <span class="date-time-box" @click="selectDateTime">
            {{ changedInterviewDateTime ? parseDateTime(changedInterviewDateTime) : '点击选择时间' }}
          </span>
        </div>
        <div class="flex-row align-left">
          备注信息：
          <span class="input-box">
            <input class="desc-text-input" type="text" v-model="changedInterviewDesc" />
          </span>
        </div>
      </div>
    </div>
    <div class="desc-text" v-if="resumeStatus === 'WAIT_STU_CONFIRM'">
      注：修改时间后不能再次修改。
    </div>

    <!-- 确认面试时间 -->
    <div class="btn-list" v-if="resumeStatus === 'WAIT_STU_CONFIRM'">
      <div class="btn btn-submit margin-bottom-15 enabled"
        @click="submitChangeInterviewTime">
        {{ isToggleChangeDate ? '确认修改' : '确认面试'}}
      </div>
      <div class="btn btn-cancel" v-if="!isToggleChangeDate"
        @click="submitCancelOffer">
        拒绝面试
      </div>
    </div>

    <!-- OFFER时间 -->
    <div class="content" v-if="resumeStatus === 'OFFERED'">
      <div class="time flex-row">
        {{ msgContent.createTime }}
      </div>
      <div class="msg-content">
        {{ msgContent.msg }}
      </div>

      <div class="resume">
        <div class="flex-row">
          报到时间：{{ resumeContent.offerTime }}
        </div>
        <div class="flex-row">
          报到地址：{{ resumeContent.offerPlace }}
        </div>
        <div class="flex-row">
          联系人：{{ resumeContent.contact }}
        </div>
        <div class="flex-row">
          联系电话：{{ resumeContent.contactPhone }}
        </div>
        <div class="flex-row" v-show="resumeContent.commentComp">
          备注：{{ resumeContent.commentComp }}
        </div>
      </div>
    </div>

    <!-- 确认面试时间 -->
    <div class="btn-list" v-if="resumeStatus === 'OFFERED'">
      <div class="btn btn-submit margin-bottom-15 enabled"
        @click="submitOffer">
        确认入职
      </div>
      <div class="btn btn-cancel"
        @click="submitCancelInterview">
        拒绝入职
      </div>
    </div>

    <div class="status-text" v-show="showHint && !resumeIdLoadMore">
      该消息已处理，请到简历列表中查看
    </div>
    <mt-datetime-picker
      ref="dateTimePicker"
      type="datetime"
      :startDate="startDate"
      v-model="changedInterviewDateTime">
    </mt-datetime-picker>
  </div>
</template>

<script>
  import pageMixin from '../Pages/pages-mixins.js'
  import resumeChangeMixin from './ResumeChangeMixin.js'
  // data
  import { ToggleCheck } from '@/assets/wechat-stu/index.js'

  export default {
    name: 'PageMessageDetailResume',
    mixins: [pageMixin, resumeChangeMixin],
    mounted () {
      this.changePageTitle()
      // resumeid?id=
      let id = this.$route.params.id
      if (id === 'resumeid') {
        this.resumeIdLoadMore = true
        this.loadResumeItem(this.$route.query.id)
        return
      }
      this.loadItem(id, resumeId => {
        this.loadResumeItem(resumeId)
      })
      // this.loadData()
    },
    data () {
      return {
        pageTitle: '我的消息',
        // assets
        prePageName: 'Message',
        ToggleCheck,

        msgContent: {},
        resumeContent: {},
        resumeStatus: '',
        resumeIdLoadMore: false,

        changedInterviewDateTime: '',
        changedInterviewDesc: '',
        startDate: new Date(),
        isToggleChangeDate: false,

        isSubmitReady: false,
      }
    },
  }
</script>

<style lang="less" scoped>
  @import '../../less/mobile.less';
  .page-message-detail {
    .content {
      padding: 15px;
      padding-top: 20px;
      background-color: white;

      margin-bottom: 10px;
    }

    .time {
      font-family: PingFangSC-Regular;
      font-size: 26px/2;
      color: #7F7F7F;
      line-height: 26px/2;
      text-align: left;
      width: 100%;
      margin-bottom: 10px;
    }
    .msg-content {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #151515;
      line-height: 50px/2;

      text-align: left;

      margin-bottom: 20px;
    }
    .resume {
      text-align: left;
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #151515;
      line-height: 50px/2;
    }
  }

  .board {
    background-color: white;
  }
  .change-interview-time {

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      padding: 0 10px;
      height: 49px;
      line-height: 49px;
      border-bottom: 1px solid #EDEEF1;

      .toggle {
        display: flex;
        align-items: center;
        justify-content: center;

        .btn {
          display: inline-block;

          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;

          width: 44px;
          height: 26.9px;
        }
      }
    }
    .interview-time-selector {
      padding: 25px 15px;

      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #819292;
      line-height: 30px/2;
    }
    .align-left {
      text-align: left;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
    .date-time-box {
      background: #FFFFFF;
      border: 1px solid #DADADA;
      border-radius: 4px/2;

      font-family: AvenirNext-Regular;
      font-size: 30px/2;
      // color: #DADADA;
      color: #0DABF4;
      line-height: 30px/2;

      display: inline-block;
      text-align: center;
      min-width: 12em;
      white-space: nowrap;
      height: 2em;
      line-height: 2em;

      // .desc-text {
      //   padding: 5px 10px;
      // }
    }
    .desc-text-input {
      background: #FFFFFF;
      border: 1px solid #DADADA;
      border-radius: 4px/2;

      font-family: AvenirNext-Regular;
      font-size: 30px/2;
      // color: #DADADA;
      color: #0DABF4;
      line-height: 30px/2;

      display: inline-block;
      text-align: center;
      min-width: 12em;
      white-space: nowrap;
      height: 2em;
      line-height: 2em;

    }
  }

  .toggle-desc {
    font-family: PingFangSC-Regular;
    font-size: 26px/2;
    color: #9B9B9B;
    line-height: 36px/2;

    margin-right: 5px;
  }
  .desc-text {
    font-family: PingFangSC-Regular;
    font-size: 26px/2;
    color: #9B9B9B;
    line-height: 36px/2;
    text-align: left;

    padding: 10px 15px 20px;
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
  .btn-cancel {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-family: PingFangSC-Regular;
    font-size: 30px/2;
    color: #0DABF4;
    background-color: #FFFFFF;
  }
  .margin-bottom-10 {
    margin-bottom: 10px;
  }
  .margin-bottom-15 {
    margin-bottom: 15px;
  }

  .status-text {
    padding: 20px 0;
  }
</style>
