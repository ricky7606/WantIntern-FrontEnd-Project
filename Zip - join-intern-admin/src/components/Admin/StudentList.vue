<template lang="html">
  <div class="news-list xsx-form-theme">
    <div class="flex-row" v-show="!isRichTextEditing">
      <div class="align-left">
        <a :href="outputExcelUrl()" target="_blank">
          <div class="output-box btn col plain">
            导出所有学生信息
          </div>
        </a>

        <div class="btn plain col" @click="toggleSearch">
          {{ isSearchOpen ? '取消搜索' : '按条件搜索'}}
        </div>
      </div>
    </div>
    <div class="flex-row search-bar" v-if="isSearchOpen" v-show="!isRichTextEditing">
      <div class="align-left">
        <div class="filter-row">
          <div class="col filter-title">下载表格筛选条件：</div>
          <div class="col">
            <div class="label col">性别：</div>
            <!-- <input v-model="industry" /> -->
            <select v-model="gender">
              <option
                :value="item.value"
                v-for="item in genderEnumList">
                {{ item.title }}
              </option>
            </select>
          </div>
          <div class="col">
            <div class="label col">学历：</div>
            <!-- <input v-model="industry" /> -->
            <select v-model="degree">
              <option
                :value="item.value"
                v-for="item in eduEnumList">
                {{ item.title }}
              </option>
            </select>
          </div>
          <div class="col">
            <div class="label col">每页条数：</div>
            <input v-model="pageSize"/>
          </div>
          <div class="col">
            <div class="label col">页数：</div>
            <input v-model="pageIndex"/>
          </div>

          <a class="col margin-left-20" :href="outputExcelUrlWithParams()" target="_blank">
            <div class="output-box btn col plain">
              下载筛选的学生信息
            </div>
          </a>
        </div>

        <div class="filter-row">
          <div class="col filter-title">筛选条件：</div>

          <div class="col">
            <div class="label col">名字：</div>
            <input v-model="name" />
          </div>
          <div class="col">
            <div class="label col">电话：</div>
            <input v-model="phone" />
          </div>
          <div class="col">
            <div class="label col">学校：</div>
            <input v-model="school" />
          </div>

          <div class="btn col plain margin-left-20" @click="search">查找</div>
        </div>
        
      </div>
    </div>

    <div class="list align-center">
      <table v-show="!isRichTextEditing">
        <tr>
          <th>注册账号</th>
          <th>手机号</th>
          <th>学生名称</th>
          <th>性别</th>
          <th>学历</th>
          <th>学校</th>
          <th>专业</th>
          <th>年级</th>
          <th>注册时间</th>
          <th>身份证号码</th>
          <th>操作</th>
        </tr>
        <template v-for="newsItem in list">
          <tr>
            <td class="id">{{newsItem.account && newsItem.account.phone}}</td>
            <td class="id">{{newsItem.phone}}</td>
            <td class="title">{{newsItem.name}}</td>
            <td class="author">{{mapReqGender[newsItem.gender]}}</td>
            <td class="author">{{mapReqEdu[newsItem.education]}}</td>
            <td class="author">{{newsItem.school}}</td>
            <td class="author">{{newsItem.major}}</td>
            <td class="author">{{newsItem.grade}}</td>
            <td class="author">{{parseDateString(newsItem.createTime)}}</td>
            <td class="author">{{newsItem.idNo}}</td>

            <!-- <td class="author">{{newsItem.verified ? '已通过' : '未审核'}}</td> -->
            <td class="action">
              <div class="btn col plain btn-edit"
                @click="editItem(newsItem)">
                编辑
              </div>
              <div class="btn col plain warning"
                v-if="!newsItem.frozen"
                @click="deleteItem(newsItem, 'frozen')">
                禁用
              </div>
              <div class="btn col plain btn-enable"
                v-if="newsItem.frozen"
                @click="deleteItem(newsItem, false)">
                启用
              </div>
            </td>
          </tr>
        </template>
      </table>

      <page-index v-if="list.length > 0"
                  v-show="!isRichTextEditing"
                  :total="pagination.total"
                  :current="pagination.current"
                  @change="pageIndexChange"/>
    </div>

    <div class="company-info-edit">
      <student-editor :content="editingContent"
                         @close="closeSubpage"
                         @update="updateData"
                         v-if="isRichTextEditing" />
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'
  import StudentEditor from '@/components/Admin/StudentEditor.vue'
  import { mapReqGender, mapReqLangLevel, mapReqEdu, eduEnumList, genderEnumList } from '@/components/Position/PositionEnum.js'
  import moment from 'moment'

  export default {
    name: 'StudentList',
    data () {
      return {
        pagination: {
          current: 1,
          total: 1,
          pagesize: 12,
        },
        list: [],

        isRichTextEditing: false,
        editingContent: {},

        mapReqGender,
        mapReqLangLevel,
        mapReqEdu,

        isSearchOpen: false,
        name: '',
        phone: '',
        school: '',

        gender: '',
        genderEnumList,
        degree: '',
        pageSize: 20,
        pageIndex: 1,
        eduEnumList,
      }
    },
    mounted () {
      this.getData({})
    },
    components: {
      PageIndex,
      StudentEditor,
    },
    methods: {
      toggleSearch () {
        this.isSearchOpen = !this.isSearchOpen

        if (!this.isSearchOpen) {
          this.pageIndexChange(1)
        }
      },
      parseDateString (timeValue) {
        if (!timeValue) return ''
        return moment(timeValue).format('YYYY-MM-DD hh:mm')
      },
      search () {
        let name = this.name || null
        let school = this.school || null
        let phone = this.phone || null

        Req.Get(ReqUrl.Admin.getStudents(), {
          pageIndex: 1,
          pageSize: 50,
          name,
          school,
          phone
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
      getData ({pageIndex, pageSize}) {
        // 资讯
        Req.Get(ReqUrl.Admin.getStudents(), {
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
      updateData () {
        this.pageIndexChange(this.pagination.current)
      },
      // 页面切换
      pageIndexChange (index) {
        this.pagination.current = index
        this.getData({
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pagesize
        })
      },
      parseData (res) {
        this.list = res.items
        this.pagination = ParsePagination(res.pagination)
      },

      createItem () {
        this.editingContent = {
          title: '',
          author: '',
          content: '',
          id: 'newCreated',
        }
        this.isRichTextEditing = true
      },
      editItem (item) {
        this.editingContent = item
        this.isRichTextEditing = true
      },
      deleteItem (item, cmd) {
        // 禁用
        let id = item.id
        let url = ReqUrl.StudentSubUrl.putItem(id)

        Req.Put(url, {
          frozen: cmd === 'frozen'
        }, res => {
          // console.log(res)
          alert(cmd === 'frozen' ? '已禁用' : '已启用')
          this.updateData()
        }, fail => {
          if (fail) {
            let data = fail.response.data
            if (data) {
              alert(data.userMessage)
            }
          }
        })
      },
      closeSubpage () {
        this.isRichTextEditing = false
      },
      outputExcelUrl () {
        let url = ReqUrl.StudentSubUrl.outputExcel()
        return url
      },
      outputExcelUrlWithParams () {
        let list = [
          {
            title: 'gender',
            value: this.gender
          },
          {
            title: 'degree',
            value: this.degree
          },
        ]
        let params = list.filter(item => !!item.value).map(item => `${item.title}=${item.value}`).join('&')
        let pageSize = this.pageSize || 20
        let pageIndex = this.pageIndex || 1

        let url = ReqUrl.StudentSubUrl.outputExcel()

        return `${url}?${params ? params + '' : ''}pageSize=${pageSize}&pageIndex=${pageIndex}`
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
