<template lang="html">
  <div class="resume-list">
    <template v-for="item in list">
      <div class="resume-item row space-between">
        <div class="left col">
          <div class="col name-card align-left">
            <div class="col icon" :style="imgBg(item.position.company.avatar)"></div>

            <div class="col align-left msg">
              <div class="row">
                <span class="col title">{{item.student.name}}</span>
                <span class="col">
                  应聘：<span class="position-name">{{item.position.title}}</span>
                </span>
              </div>
              <div class="row">
                <span>{{item.student.gender}}</span> |
                <span>{{item.student.area}}</span> |
                <span>{{item.student.education}}</span>
              </div>
              <div class="row">
                {{ parseDate(item.createTime) }} 投递
              </div>
            </div>
          </div>

          <div class="col status-box">
            <div class="status-text">已面试</div>
          </div>
        </div>

        <div class="right col">
          <div class="col btn pointer-on" @click="edit(item)">
            拒绝修改
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'ResumeList',
    data () {
      return {}
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
      edit (item) {
        this.$emit('change', {
          type: 'edit',
          data: item
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .resume-list {
    padding-top: 20px;
    padding-bottom: 20px;

    .resume-item {
      background-color: #FBFBFB;
      margin-bottom: 20px;
      padding: 20px;

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
        }
        .position-name {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #00002A;
          letter-spacing: 0;
          line-height: 14px;
        }
      }
      .name-card {
        width: 400px;
        overflow: hidden;
      }
      .status-box {
        vertical-align: top;

        .status-text {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #0DABF4;
          letter-spacing: 0;
          line-height: 14px;
        }
      }
      .right {
        .btn {
          background-color: #0DABF4;
          width: 120px;
          height: 40px;
          margin-top: 12px;

          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #FFFFFF;
          letter-spacing: 0;
          line-height: 40px;
        }
      }
    }
  }
</style>
