<template lang="html">
  <div class="news-list xsx-form-theme">
    <!-- <div class="flex-row" v-show="!isRichTextEditing">
      <div class="align-left">
        <div class="btn plain col" @click="toggleSearch">
          {{ isSearchOpen ? '取消搜索' : '按条件搜索'}}
        </div>
      </div>
    </div> -->
    <!-- <div class="flex-row search-bar" v-if="isSearchOpen" v-show="!isRichTextEditing">
      <div class="align-left">
        <div class="filter-row">
          <div class="col filter-title">筛选条件：</div>
          <div class="col">
            <div class="label col">学历要求：</div>
            <select v-model="degree">
              <option
                :value="item.value"
                v-for="item in eduEnumList">
                {{ item.title }}
              </option>
            </select>
          </div>

          <div class="btn col plain margin-left-20" @click="search">查找</div>
        </div>
        
      </div>
    </div> -->

    <div class="list align-center">
      <table v-show="!isRichTextEditing">
        <tr>
          <th>职位名称</th>
          <th>招聘公司</th>
          <th>工作地址</th>
          <th>实习日期</th>
          <th>工作时间</th>
          <th>职位薪资</th>
          <th>最少工作天数</th>
          <th>是否留用</th>
          <th>学历要求</th>
          <th>发布时间</th>
          <th>投递状态</th>
          <th>投递时间</th>
        </tr>
        <template v-for="newsItem in list">
          <tr>
            <td class="title">{{newsItem.position.title}}</td>
            <td class="author">{{newsItem.position.company.name}}</td>
            <td class="title">{{newsItem.position.addr}}</td>
            <td class="title">{{parseDate(newsItem.position.startDate)}} 至 {{parseDate(newsItem.position.endDate)}}</td>
            <td class="author">{{newsItem.position.startTime}} - {{newsItem.position.endTime}}</td>
            <td class="author">{{newsItem.stuSalary}}{{newsItem.unit}}</td>
            <td class="author">{{newsItem.position.minDays}} 天</td>
            <td class="author">{{judgeValue(newsItem.retention)}}</td>
            <td class="author">{{mapReqEdu[newsItem.position.reqEdu]}}</td>
            <td class="author">{{parseDate(newsItem.position.createTime)}}</td>
            <td class="author">{{TabbarResumeSta[newsItem.state]}}</td>
            <td class="author">{{parseDateString(newsItem.createTime)}}</td>
            
            <!-- <td class="action">
              <div class="btn col plain btn-edit"
              	v-if="newsItem.candidateCnt > 0"
                @click="queryComResumeList(newsItem)">
                查看投递情况
              </div>
            </td> -->
          </tr>
        </template>
      </table>

      <page-index v-if="list.length > 0"
                  v-show="!isRichTextEditing"
                  :total="pagination.total"
                  :current="pagination.current"
                  @change="pageIndexChange"/>
    <div class="footer">
      <div class="btn col btn-close" @click="close">
        关闭
      </div>
    </div>
    </div>

    <!-- <div class="company-info-edit">
      <com-resume-list :content="editingContent"
                         @close="closeSubpage"
                         @update="updateData"
                         v-if="isRichTextEditing" />
    </div> -->
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'
  import { mapReqEdu, eduEnumList, PositionEnum, mapReqEduNum, TabbarResumeSta } from '@/components/Position/PositionEnum.js'
  import moment from 'moment'

  export default {
    name: 'StuPositionList',
    data () {
      return {
        pagination: {
          current: 1,
          total: 1,
          pagesize: 12,
        },
        list: [],

        editingContent: {},
        isRichTextEditing: false,
        isSearchOpen: false,
        // degree: '',

        eduEnumList,
        mapReqEduNum,
        mapReqEdu,
        PositionEnum,
        TabbarResumeSta,

        pageSize: 20,
        pageIndex: 1,
      }
    },
    props: {
      content: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    mounted () {
      this.getData({})
    },
    components: {
      PageIndex,
    },
    methods: {
      /* toggleSearch () {
        this.isSearchOpen = !this.isSearchOpen
        if (!this.isSearchOpen) {
          this.pageIndexChange(1)
        }
      }, */
      /* search () {
        let companyId = this.content.id
        let reqEdu = this.degree || null
        let url = ReqUrl.Position.getListOfCompany(companyId)

        Req.Get(url, {
          pageIndex: 1,
          pageSize: 25,
          reqEdu,
        }, res => {
          this.parseData(res)
        }, fail => {
          if (fail && fail.response.data) {
            if (fail.response.data.status === 401) {
              this.$router.replace({
                name: 'Login'
              })
            }
          }
        })
      }, */
      /* queryComResumeList (item) {
        // alert('toQueryComResumeList()')
        this.editingContent = item
        alert('PositionList posId: ' + item.id)
        this.isRichTextEditing = true
        this.isSearchOpen = false
      }, */
      parseDateString (timeValue) {
        if (!timeValue) return ''
        return moment(timeValue).format('YYYY-MM-DD hh:mm')
      },
      parseDate (timeValue) {
        if (!timeValue) return ''
        return moment(timeValue).format('YYYY-MM-DD')
      },
      judgeValue (value) {
        if (value === true) return '是'
        return '否'
      },
      close () {
        this.$emit('close', null)
      },
      getData ({pageIndex, pageSize}) {
        let studentId = this.content.id
        // alert('studenId :' + studentId)
        let url = ReqUrl.Resume.getPositionsOfStudent(studentId)
        Req.Get(url, {
          studentId,
          pageIndex: pageIndex || 1,
          pageSize: pageSize || 20,
        }, res => {
          this.parseData(res)
        }, fail => {
          if (fail && fail.response.data) {
            alert(fail.response.data.userMessage)
            if (fail.response.data.status === 401) {
              this.$router.replace({
                name: 'Login'
              })
            }
          }
        })
      },
      // 页面切换
      pageIndexChange (index) {
        this.pagination.current = index
        this.getData({
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pagesize
        })
      },
      updateData () {
        this.pageIndexChange(this.pagination.current)
      },
      closeSubpage () {
        this.isRichTextEditing = false
      },
      parseData (res) {
        this.list = res.items
        this.pagination = ParsePagination(res.pagination)
      },

    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .news-list {
    position: relative;

    .list.align-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .header {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1;
      justify-content: center;
      margin-bottom: 10px;

      .createNew {
        margin-left: 200px;
      }
    }

    table {
      border: 1px solid gray;
      font-size: 12px;

      tr,
      th {
        height: 2.6em;
        line-height: 2.6em;
        padding: 0 10px;
      }
      tr:nth-of-type(odd) {
        background-color: #eee;
      }


      .id {
        padding: 0 5px;
      }
      .title {
        padding: 0 10px;
      }
      .author {
        padding: 0 10px;
      }
      .action {
        padding: 0 10px;
        .btn {
          margin: 5px;
        }
      }
    }
    .btn {
      // height: 1.4em;
      // line-height: 1.4em;
      // padding: 0;
    }
  }

  .sub-page {
    margin: 0 auto;
    display: inline-block;
    background-color: white;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .align-left {
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .filter-row {
    margin-right: 15px;
    margin-bottom: 10px;
    font-size: 13px;
  }
  .filter-title {
    color: #0DABF4;
  }
  .margin-left-20 {
    margin-left: 20px;
  }
</style>
