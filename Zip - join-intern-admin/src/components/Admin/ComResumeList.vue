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
          <th>学生姓名</th>
          <!-- <th>身份证号</th> -->
          <th>学生学历</th>
          <th>学生性别</th>
          <th>学生电话</th>
          <th>学生邮箱</th>
          <th>就读学校</th>
          <th>投递时间</th>
          <th>简历状态</th>
          <th>面试时间</th>
          <th>面试地点</th>
          <th>职位联系人</th>
          <th>职位联系电话</th>
        </tr>
        <template v-for="newsItem in list">
          <tr>
            <td class="id">{{newsItem.student.name}}</td>
            <!-- <td class="id">{{newsItem.student.idNo}}</td> -->
            <td class="id">{{mapReqEdu[newsItem.student.education]}}</td>
            <td class="title">{{mapReqGender[newsItem.student.gender]}}</td>
            <td class="author">{{newsItem.student.phone}}</td>
            <td class="author">{{newsItem.student.email}}</td>
            <td class="author">{{newsItem.student.school}}</td>
            <td class="author">{{newsItem.createTime}}</td>
            <td class="author">{{TabbarResumeSta[newsItem.state]}}</td>
            <td class="author">{{newsItem.interviewTime}}</td>
            <td class="author">{{newsItem.interviewPlace}}</td>
            <td class="author">{{newsItem.contact}}</td>
            <td class="author">{{newsItem.contactPhone}}</td>
          </tr>
        </template>
      </table>

      <page-index v-if="list.length > 0"
                  v-show="!isRichTextEditing"
                  :total="pagination.total"
                  :current="pagination.current"
                  @change="pageIndexChange"/>
    <div class="footer">
      <div class="btn col btn-close"
      	v-show="!isRichTextEditing"
      	@click="close">
        关闭
      </div>
    </div>
    </div>

    <!-- <div class="company-info-edit">
      <student-editor :content="editingContent"
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
  import { mapReqEdu, eduEnumList, PositionEnum, mapReqEduNum, mapReqGender, TabbarResumeSta } from '@/components/Position/PositionEnum.js'
  import moment from 'moment'
  import {
    NameList, OtherInformation,
  } from '@/components/Resume/ResumeInformationRowList.js'

  export default {
    name: 'ComResumeList',
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
        degree: '',

        eduEnumList,
        mapReqEduNum,
        mapReqEdu,
        mapReqGender,
        PositionEnum,
        TabbarResumeSta,
        NameList,
        OtherInformation,

        pageSize: 20,
        pageIndex: 1,
      }
    },
    props: {
      current: {
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
        alert('reqEdu ' + reqEdu)
        let url = ReqUrl.Position.getListOfCompany(companyId)

        Req.Get(url, {
          pageIndex: 1,
          pageSize: 25,
          reqEdu,
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
      }, */
      /* queryResumeList (item) {
        this.editingContent = item
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
      /* judgeValue (value) {
        if (value === true) return '是'
        return '否'
      }, */
      close () {
        this.$emit('close', null)
      },
      getData ({pageIndex, pageSize}) {
        let id = this.current.id
        let url = ReqUrl.Resume.getResumesOfPosition(id)
        Req.Get(url, {
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
