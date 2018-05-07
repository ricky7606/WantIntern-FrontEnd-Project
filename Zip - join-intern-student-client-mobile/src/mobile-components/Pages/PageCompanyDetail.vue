<template lang="html">
  <div class="page-company-detail">
    <div class="header margin-bottom-10">
      <company-card :company="company" :brief="true"/>
    </div>

    <div class="company-detail flex-col margin-bottom-10">
      <div class="tabbar gray">
        <div class="tab-item"
          @click="selectTab(item)"
          :class="{selected: item === selectedTabber}"
          :key="item.id"
          v-for="(item, index) in tabbarList">
          {{ item }}

          <span class="sep-line-right" v-if="index < 2"></span>
        </div>
      </div>

      <div class="detail-content">
        <div class="content-company-intro"
          v-show="selectedTabber === tabbarList[0]">{{ company.intro }}</div>
        <div class="content-position-list" v-show="selectedTabber === tabbarList[1]">
          <div class="empty-holder" v-show="positionList.length === 0">
            暂无在招职位
          </div>
          <div class="jobs-card-container" v-for="job in positionList">
            <jobs-card-lite
              @click.native="selectJobsCard(job)"
              :key="job.id"
              :port="job"/>
          </div>
        </div>
        <div class="content-rate-list" v-show="selectedTabber === tabbarList[2]">
          <div class="empty-holder" v-show="rateList.length === 0">
            暂无评价信息
          </div>
          <job-card-lite v-for="job in rateList"
            :key="job.id"
            :port="job"/>
        </div>
      </div>
    </div>
    <div class="position-detail margin-bottom-10" v-show="selectedTabber === tabbarList[0]">
      <div class="detail-block">
        <div class="title">公司地址</div>
        <div class="gray">{{ job.addr || '未填写' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { Account } from '@/api/account.js'
  import { PositionDetail } from '@/assets/wechat-stu/index.js'

  import pageMixin from './pages-mixins.js'
  import CompanyCard from '@/mobile-components/Company/CompanyCard.vue'
  import JobsCardLite from '@/mobile-components/Position/JobsCardLite.vue'

  export default {
    name: 'PageCompanyDetail',
    mixins: [pageMixin],
    mounted () {
      let id = this.$route.params.id
      if (!id) {
        this.$router.replace({
          name: 'PageMain'
        })
      }

      this.loadPositionListOfCompany(id)
      this.companyId = id
      this.loadCompanyInfo(id, info => {
        this.port.company = info
      })
      this.loadRateList()
    },
    beforeRouteUpdate (to, from, next) {
      let id = to.params.id
      if (!id) {
        this.$router.push({
          name: 'Home'
        })
      }

      this.port = {}
      this.loadPositionListOfCompany(id)
      this.loadCompanyInfo(id, info => {
        this.port.company = info
      })
    },
    data () {
      return {
        pageTitle: '职位详情',
        port: {
          company: {}
        },
        companyId: '',

        isSending: false,
        isCollecting: false,
        isJobCollected: false,

        jobSended: false,

        mediumBabberList: [],
        Account,
        PositionDetail,

        positionList: [],
        positionListPagination: {
          current: 1,
          total: 1,
          pagesize: 12,
        },

        rateList: [],
        rateListPagination: {
          current: 1,
          total: 1,
          pagesize: 12,
        },

        tabbarList: [
          '公司介绍',
          '在招职位',
          '公司评价',
        ],
        selectedTabber: '公司介绍',
      }
    },
    methods: {
      selectTab (tab) {
        this.selectedTabber = tab
      },
      loadCompanyInfo (companyId, next = n => n) {
        Req.Get(ReqUrl.CompanySubUrl.getItem(companyId), {}, res => {
          this.port = res
          if (next) {
            next(res)
          }
        })
      },
      loadPositionListOfCompany (companyId) {
        Req.Get(ReqUrl.CompanySubUrl.getPositionsOfCompany(companyId),
          {
            pageSize: 4,
            pageIndex: 1,
            active: true
          },
          res => {
            this.positionList = res.items
            // this.isLoadingPromoted = false
          }
        )
      },
      loadRateList (companyId) {
        if (!companyId) companyId = this.companyId
        let url = ReqUrl.CompanySubUrl.getRateList(companyId)

        Req.Get(url, {
          pageSize: 12,
          pageIndex: 1,
        }, res => {
          this.rateList = res.items
          console.log(res)
        })
      },
      selectJobsCard (data) {
        this.$router.push({
          name: 'PagePositionDetail',
          params: {
            id: data.id
          }
        })
      },
    },
    computed: {
      job () {
        return this.port || {}
      },
      company () {
        return this.port ? this.port.company || {} : {}
      },
      internDuration () {
        let job = this.job
        return `${splitDate(job.startDate).replace(/-/g, '.')}-${splitDate(job.endDate).replace(/-/g, '.')}`
      },
      positionIntroList () {
        let job = this.job
        return [
          {
            title: '实习时间',
            content: `${splitDate(job.startDate)} ~ ${splitDate(job.endDate)}`,
          },
          {
            title: '职位描述',
            content: job.intro || '未填写',
          },
          {
            title: '工作地址',
            content: job.addr || '未填写',
          },
        ]
      },
    },
    components: {
      CompanyCard,
      JobsCardLite,
    }
  }

  function splitDate (d) {
    if (!d) return ''
    return d.split(' ')[0]
  }
</script>

<style lang="less" scoped>
  @import '../../less/common.less';
  @import '../../less/mobile.less';

  .page-company-detail {
    .header {
      background-color: white;
      padding: 15px;
    }
    .company-detail {
      background-color: white;

      .tabbar {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        font-family: PingFangSC-Regular;
        font-size: 30px/2;
        color: #9B9B9B;
        line-height: 30px/2;

        height: 44px;
        line-height: 44px;
        border-bottom: 1px solid #EDEEF1;

        .tab-item {
          width: 33.3%;
          position: relative;

          .sep-line-right {
            display: inline-block;
            position: absolute;
            right: 0;
            border-right: 1px solid #0DABF4;
            height: 13.5px;
            top: 15.5px;
          }
          &.selected {
            color: #0DABF4;
          }
        }
      }

      .detail-content {
        background-color: white;
        padding: 15px;
        padding-top: 12px;

        font-family: PingFangSC-Regular;
        font-size: 28px/2;
        color: #656565;

        white-space: pre-line;
        text-align: left;
      }
    }
  }

  .position-detail {
    background-color: white;
    padding: 15px;
    padding-top: 13px;
    padding-left: 28px;
    text-align: left;

    .detail-block {
      margin-bottom: 9px;
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 30px/2;
      color: #333333;
      line-height: 30px/2;
      margin-bottom: 15px;

      position: relative;

      &:before {
        content: '·';
        position: absolute;
        left: -1em;
      }
    }

    .gray {
      font-family: PingFangSC-Regular;
      font-size: 28px/2;
      color: #9B9B9B;
      line-height: 28px/2;
    }
  }
  .content-company-intro {
    font-family: PingFangSC-Regular;
    font-size: 28px/2;
    color: #656565;
    line-height: 46px/2;
  }
  .empty-holder {
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
  .jobs-card-container {
    display: block;
    padding-top: 15px;
    position: relative;

    &:after {
      display: block;
      content: ' ';
      border-bottom: 1px solid #EDEEF1;
      width: 100%;
      position: absolute;
      left: 0px;
      bottom: 0;
    }
  }
</style>
