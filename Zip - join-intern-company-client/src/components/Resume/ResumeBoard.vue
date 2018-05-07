<template lang="html">
  <div class="resume-board space-between">
    <div class="left">
      <template v-for="item in list">
        <div class="row name-card align-left pointer-on" @click="selectResume(item)">
          <div class="col icon" :style="imgBg(item.student.avatar)"></div>

          <div class="col align-left msg">
            <div class="row">
              <span class="col title">{{item.student.name}}</span>
            </div>
            <div class="row">
              <span class="position-name">{{item.position.title}}</span>
            </div>
            <div class="row">
              {{ parseDate(item.createTime) }} 投递
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="right">
      <div class="empty-placeholder" style="margin-top: 40px;" v-if="!selectedResume.position">
        {{ list.length > 0 ? '先从左边栏中选择一个简历' : ''}}
      </div>

      <resume-information
        v-if="selectedResume.position"
        @send="openInterviewBox"
        @cancel="cancelResume"
        :data="selectedResume" />
    </div>

    <div class="modal modal-interview-box xsx-form-theme" v-if="isModalBoxShow">
      <div class="content">
        <div class="title">面试通知</div>
        <div class="padding-left">
          <div class="input-block" v-for="row in InterviewItemList">
            <div class="input-label">{{ row.title }}</div>
            <div class="input">
              <input v-model="row.value" :ref="row.key" type="text" v-if="row.type === 'String'"/>
              <!-- <input v-model="row.value" :ref="row.key" type="datetime" v-if="row.type === 'DateTime'"/> -->
              <date-time-selector v-model="row.value" :ref="row.key" type="datetime" v-if="row.type === 'DateTime'"/>
              <input v-model="row.value" :ref="row.key" type="text" @keyup="numberOnlyInput($event, row)" v-if="row.type === 'Number'"/>
            </div>
          </div>
        </div>
        <div class="btn" @click="submitInterviewBox">
          确定
        </div>
        <div style="margin-top: 20px;">
          <div class="btn plain" @click="closeInterviewBox">
            关闭
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ResumeInformation from '@/components/Resume/ResumeInformation.vue'
  import { InterviewItemList } from '@/components/Resume/ResumeInformationRowList.js'
  import DateTimeSelector from '@/components/Utils/DateTimeSelector.vue'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'

  export default {
    name: 'ResumeBoard',
    data () {
      return {
        selectedResume: {},
        isModalBoxShow: false,
        InterviewItemList: InterviewItemList.map(item => {
          return {
            ...item,
            value: ''
          }
        }),
      }
    },
    components: {
      ResumeInformation,
      DateTimeSelector,
    },
    props: {
      list: {
        type: Array,
        default () {
          return []
        },
      },
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
      selectResume (item) {
        this.selectedResume = item
      },
      submitInterviewBox () {
        let list = this.InterviewItemList
        let readyToSubmit = true
        list.forEach(item => {
          if (!item.value) readyToSubmit = false
        })
        if (readyToSubmit === false) {
          alert('请填写完整面试通知，再保存。')
          return
        }

        this.sendInterview()
        this.isModalBoxShow = false
      },
      openInterviewBox () {
        this.isModalBoxShow = true
      },
      closeInterviewBox () {
        this.isModalBoxShow = false
      },
      numberOnlyInput (ev, item) {
        let input = this.$refs['contactPhone']
        if (Array.isArray(input)) {
          input = input[0]
        }
        let value = input.value
        let m = value.match(/\d+/)

        if (m) {
          item.value = m[0].substr(0, 11)
        } else {
          item.value = ''
        }
      },
      sendInterview () {
        let resumeId = this.selectedResume.id
        let url = ReqUrl.Resume.editResumeItem(resumeId)
        let msgItem = this.InterviewItemList.reduce((dict, item) => {
          dict[item.key] = item.value
          return dict
        }, {})

        Req.Put(url, {
          state: 'WAIT_STU_CONFIRM',
          ...msgItem
        }, res => {
          console.log(res)
          this.isModalBoxShow = false
          this.$emit('reload', null)
          this.selectedResume = {}
          alert('操作成功：已发送面试通知')
        })
      },
      cancelResume () {
        let resumeId = this.selectedResume.id
        let url = ReqUrl.Resume.editResumeItem(resumeId)
        Req.Put(url, {
          state: 'CANCELED'
        }, res => {
          console.log(res)
          this.$emit('reload', null)
          this.selectedResume = {}
          alert('操作成功：已淘汰学生')
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .resume-board {
    padding-top: 20px;
    padding-bottom: 20px;

    .left {
      margin-right: 40px;
    }
    .right {
      width: 960px;
    }
    .name-card {
      background-color: #FBFBFB;
      margin-bottom: 10px;
      padding: 20px;
      width: 258px;
      overflow: hidden;
      user-select: pointer;

      .icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 20px;
        vertical-align: top;

        .icon();
        // background-size: cover;
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
  }

  .modal-interview-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);

    .content {
      display: inline-block;
      background-color: white;
      padding: 40px 30px;
      width: 464px;

      margin: 0 auto;
      margin-top: 20vh;

      .title {
        margin-bottom: 34px;

        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #454F66;
        letter-spacing: 0;
      }
      .padding-left {

        .input-block {
          position: relative;
          padding-left: 5.2em;
        }
        .input-label {
          position: absolute;
          left: 0;
          top: 0.8em;
          text-align: right;
          width: 5.2em;
        }
        input {
          width: 100%;
        }
      }
    }
  }
  .empty-placeholder {
    color: #A3A8B5;
  }
</style>
