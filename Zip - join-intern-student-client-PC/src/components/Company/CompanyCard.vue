<template>
  <div class="company-card flex-col pointer-on" @click.stop="selectCard">
    <div class="row header">
      <div class="icon-logo col" :style="imgBg(isUrlLeagal(company.logo) ? company.logo : Img.imgLogo)"></div>
      <div class="col right">
        <div class="flex-row row company-title" @click.stop="selectCompany">
          <span class="icon-auth" v-if="company.verified" :style="imgBg(Img.icon1)"></span>
          {{company.name}}
        </div>
        <div class="row hiring-count">在招职位 {{company.activePosCnt || 0}}</div>
        <div class="row rank-count">评价 {{company.rateCnt || 0}}</div>
      </div>
    </div>
    <div class="flex-row row company-msg footer">
      <span class="sep">{{company.industry}}</span>
      <span class="sep" v-if="company.scale">{{company.scale}}</span>
      <span class="sep">{{company.type}}</span>
    </div>
  </div>
</template>

<script>
  import { mapReqEdu } from '@/components/Position/Enum.js'
  import { styleFns } from '@/mixins/helperFuncs.js'
  import Img from '@/assets/pc-stu/index.js'

  export default {
    name: 'CompanyCard',
    mixins: [styleFns],
    data () {
      return {
        Img,
        mapReqEdu,
      }
    },
    methods: {
      selectCard () {
        this.$emit('select', this.company)
      },
      selectCompany () {
        this.$emit('select', this.company)

        // this.$emit('select-company', this.company)
      },
      isUrlLeagal (str) {
        return str && str.indexOf('http') === 0
      },
    },
    computed: {
      // job () {
      //   return this.port
      // },
      // company () {
      //   return this.port.company || {}
      // },
    },
    props: {
      company: {
        type: [Object, undefined],
        default () {
          return {
            company: {}
          }
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .company-card {
    display: flex;
    background-color: white;
    padding: 30px 20px;
    height: 189px;
    width: 100%;
    flex-direction: column;
    margin-bottom: 1px;
    user-select: none;

    .icon-logo {
      display: inline-block;
      width: 86px;
      height: 86px;
      margin-right: 16px;
      border-radius: 100%;
      .icon();
      // background-size: cover;
      background-size: contain;
    }

    .right {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #A3A8B5;
      letter-spacing: 0;
      line-height: 14px;
      display: inline-block;
    }

    .company-title {
      font-family: PingFangSC-Regular;
      font-size: 18px;
      line-height: 1.2em;
      color: #454F66;
      letter-spacing: 0;
      display: block;

      margin-bottom: 19.5px;
      max-width: 130px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .icon-auth {
      display: inline-block;
      width: 16px;
      height: 19.8px;
      vertical-align: middle;
      margin-right: 10px;

      .icon();
    }

    .hiring-count {
      margin-bottom: 19.5px;
    }

    .company-msg {
      margin-top: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
