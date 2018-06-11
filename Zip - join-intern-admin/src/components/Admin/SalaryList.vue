<template lang="html">
  <div class="news-list xsx-form-theme">
    <div class="flex-row" v-show="!isRichTextEditing">
      <div class="align-left">
        <!-- <a :href="outputExcelUrl()" target="_blank">
          <div class="output-box btn col plain">
            导出所有工资表
          </div>
        </a> -->

        <div class="btn plain col" @click="toggleSearch">
          {{ isSearchOpen ? '取消搜索' : '按条件搜索'}}
        </div>

        <a :href="outputExcelUrl()" v-if="isSearchOpen && list.length > 0 && readyToOutput" target="_blank">
          <div class="output-box btn col plain">
            导出工资表
          </div>
        </a>
        <!-- <div class="btn plain col" v-if="isSearchOpen && list.length > 0" @click="outputExcel">
          导出
        </div> -->

      </div>
    </div>
    <div class="flex-row search-bar" v-if="isSearchOpen" v-show="!isRichTextEditing">
      <div class="align-left">
        <!-- <div class="col">
          <div class="label col">名称：</div>
          <input v-model="companyName" />
        </div> -->
        <div class="col">
          <div class="label col">月份：</div>
          <input v-model="month" placeholder="输入格式：2018-08"/>
        </div>
        <div class="col">
          <div class="label col">学生名字：</div>
          <input v-model="stuName" />
        </div>
        <div class="col">
          <div class="label col">学生账号：</div>
          <input v-model="stuAccount" />
        </div>
        <div class="col">
          <div class="label col">公司名字：</div>
          <input v-model="compName" />
        </div>
        
        <div class="btn col plain" @click="search">查找</div>
      </div>
    </div>

    <div class="list align-center">
      <table v-show="!isRichTextEditing">
        <tr>
          <th>账号</th>
          <th>学生名称</th>
          <th>实习公司</th>
          <th>实习职位</th>
          <th>发放月份</th>
          <th>实习状态</th>
          <th>实习天数</th>
          <th>企业应付</th>
          <th>学生到手工资</th>
          <th>学生备注</th>
          <th>发放状态</th>
          <th>操作</th>
        </tr>
        <template v-for="newsItem in list">
          <tr>
            <td class="id">{{newsItem.stuAccount}}</td>
            <td class="id">{{newsItem.resume.student.name}}</td>
            <td class="title">{{newsItem.resume.position.company.name}}</td>
            <td class="author">{{newsItem.resume.position.title}}</td>
            <td class="author">{{newsItem.month}}</td>
            <td class="author">{{mapReqWorkingState[newsItem.resume.state] || newsItem.resume.state}}</td>
            <td class="author">{{newsItem.workDays}}</td>
            <td class="author">{{newsItem.value}}</td>
            <td class="author">{{newsItem.stuValue}}</td>
            <td class="author">{{newsItem.stuComment}}</td>
            <td class="author">{{mapReqPaidState[newsItem.state] || newsItem.state}}</td>

            <!-- <td class="author">{{newsItem.verified ? '已通过' : '未审核'}}</td> -->
            <td class="action">
              <!-- <div class="btn col plain btn-edit"
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
              </div> -->
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
  import { mapReqGender, mapReqLangLevel, mapReqEdu } from '@/components/Position/PositionEnum.js'
  export default {
    name: 'SalaryList',
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
        mapReqWorkingState: {
          WORKING: '实习中',
          ENDED: '已结束'
        },
        mapReqPaidState: {
          NEW_GENERATED: '新增',
          WAIT_STU_CONFIRM: '待学生确认',
          WAIT_COMP_CONFIRM: '待企业确认',
          CONFIRMED: '已确认',
          PAID: '已支付',
          ENDED: '已结束'
        },

        isSearchOpen: false,
        readyToOutput: false,

        month: '',
        stuName: '',
        stuAccount: '',
        compName: '',
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
      search () {
        let month = this.month || null
        let stuName = this.stuName || null
        let stuAccount = this.stuAccount || null
        let compName = this.compName || null

        Req.Get(ReqUrl.Admin.getSalaryList(), {
          pageIndex: 1,
          pageSize: 50,
          month,
          stuName,
          stuAccount,
          compName
        }, res => {
          this.parseData(res)
          this.readyToOutput = true
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
        Req.Get(ReqUrl.Admin.getSalaryList(), {
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
      outputExcel () {
        let url = this.outputExcelUrl
        return url
      },
      outputExcelUrl () {
        let url = ReqUrl.Admin.outputSalaryList()

        let list = ['month', 'stuName', 'stuAccount', 'compName']
        let paramsList = []
        list.forEach(tag => {
          let val = this[tag]
          if (val) {
            paramsList.push(`${tag}=${val}`)
          }
        })

        return `${url}?${paramsList.join('&')}`
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
</style>
