<template lang="html">
  <div class="news-list xsx-form-theme">
    <div class="flex-row" v-show="isRichTextEditing === '1'">
      <div class="align-left">
        <a :href="outputExcelUrl()" target="_blank">
          <div class="output-box btn col plain">
            导出所有企业的信息
          </div>
        </a>

        <div class="btn plain col" @click="toggleSearch">
          {{ isSearchOpen ? '取消搜索' : '按条件搜索公司'}}
        </div>
      </div>
    </div>
    <div class="flex-row search-bar" v-show="isSearchOpen">
      <div class="align-left">
        <div class="filter-row">
          <div class="col filter-title">下载表格筛选条件：</div>
          <div class="col">
            <div class="label col">认证情况：</div>
            <!-- <input v-model="industry" /> -->
            <select v-model="choosingVerfied">
              <option
                :value="item.value"
                v-for="item in verifyEnumList">
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
              下载筛选的企业信息
            </div>
          </a>
        </div>

        <div class="filter-row">
          <div class="col filter-title">筛选条件：</div>
          <div class="col">
            <div class="label col">名称：</div>
            <input v-model="keyword" />
          </div>
          <div class="col">
            <div class="label col">行业：</div>
            <!-- <input v-model="industry" /> -->
            <select v-model="industry">
              <option
                :value="item.key"
                v-for="item in industryEnum">
                {{ item.title }}
              </option>
            </select>
          </div>
          <div class="col">
            <div class="label col">类型：</div>
            <!-- <input v-model="type" /> -->
            <select v-model="type">
              <option
                :value="item.key"
                v-for="item in typeEnum">
                {{ item.title }}
              </option>
            </select>
          </div>
          <div class="col">
            <div class="label col">规模：</div>
            <!-- <input v-model="scale" /> -->
            <select v-model="scale">
              <option
                :value="item.key"
                v-for="item in scaleEnum">
                {{ item.title }}
              </option>
            </select>
          </div>
          
          <div class="btn col plain" @click="search">查找</div>
        </div>
      </div>
    </div>
    <div class="list align-center">
      <table v-show="isRichTextEditing === '1'">
        <tr>
          <th>账号</th>
          <th>手机号</th>
          <th>企业名称</th>
          <th>企业规模</th>
          <th>企业类型</th>
          <th>行业</th>
          <th>联系人</th>
          <th>联系电话</th>
          <th>注册时间</th>
          <th>营业执照</th>
          <th>审核状态</th>
          <th>操作</th>
          <th>推荐</th>
        </tr>
        <template v-for="newsItem in list">
          <tr>
            <td class="id">{{ newsItem.account && newsItem.account.phone}}</td>
            <td class="id">{{newsItem.contactPhone}}</td>
            <td class="title">{{newsItem.name}}</td>
            <td class="author">{{newsItem.scale}}</td>
            <td class="author">{{newsItem.type}}</td>
            <td class="author">{{newsItem.industry}}</td>
            <td class="author">{{newsItem.contact}}</td>
            <td class="author">{{newsItem.contactPhone}}</td>
            <td class="author">{{newsItem.createTime}}</td>
            <td class="author">
              {{ newsItem.verified ? '-' :
                newsItem.cert ? '已上传' : ''}}
            </td>
            <td class="author">
              {{
                newsItem.verified ?
                  '已通过' :
                  newsItem.verified === null ?
                    newsItem.cert ? '待审核' : '' :
                      '不通过'
              }}
            </td>
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
              <div class="btn col plain"
              	@click="queryComPosition(newsItem)">
              	查看职位
              </div>
            </td>
            <td class="action">
              <div class="btn col plain btn-enable contain-btn"
                v-if="!isPromoted(newsItem)"
                @click="promoteItem(newsItem)">
                设为推荐
              </div>
              <div class="btn col plain warning contain-btn"
                v-if="isPromoted(newsItem)"
                @click="removePromoteItem(newsItem)">
                取消推荐
              </div>
            </td>
          </tr>
        </template>
      </table>

      <page-index v-if="list.length > 0"
                  v-show="isRichTextEditing === '1'"
                  :total="pagination.total"
                  :current="pagination.current"
                  @change="pageIndexChange"/>
    </div>

    <div class="company-info-edit">
      <enterprise-editor :content="editingContent"
                         @close="closeSubpage"
                         @update="updateData"
                         v-if="isRichTextEditing === '2'" />
      <com-position-list :content="editingContent"
                         @close="closeSubpage"
                         @update="updateData"
                         v-if="isRichTextEditing === '3'" />
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'
  import EnterpriseEditor from '@/components/Admin/EnterpriseEditor.vue' // 引入企业修改页面
  import ComPositionList from '@/components/Admin/ComPositionList.vue'
  import * as AdminDataProxy from '@/components/Admin/proxy.js'

  export default {
    name: 'EnterpriseList',
    data () {
      return {
        pagination: { // 当前页码信息
          current: 1,
          total: 1,
          pagesize: 12,
        },
        list: [], // 结果集合
        promotedList: [], // 推荐企业集合

        isRichTextEditing: '1',
        editingContent: {}, // 传参对象
        toPosition: false,

        isSearchOpen: false,
        keyword: '',
        companyName: '',
        industry: '',
        type: '',
        scale: '',
        scaleEnum: [],
        typeEnum: [],
        industryEnum: [],
        pageSize: 20,
        pageIndex: 1,

        choosingVerfied: '',
        verifyEnumList: [
          {
            title: '已认证',
            value: true,
          },
          {
            title: '未认证',
            value: false,
          },
        ]
      }
    },
    mounted () {
      this.getData({})

      AdminDataProxy.Get('COMPANY_PROMOTED_LIST', res => {
        console.log(res)
        if (res) {
          this.promotedList = res.filter(item => {
            return item.logo && item.companyId
          })
        } else {
          this.promotedList = []
        }
      })

      AdminDataProxy.Get('COMPANY_SCALING', res => {
        this.scaleEnum = [
          {
            key: '',
            title: '所有',
          },
          ...res
        ]
      })
      AdminDataProxy.Get('COMPANY_TYPE', res => {
        this.typeEnum = [
          {
            key: '',
            title: '所有',
          },
          ...res
        ]
      })
      AdminDataProxy.Get('INDUSTRY', res => {
        this.industryEnum = [
          {
            key: '',
            title: '所有',
          },
          ...res
        ]
      })
    },
    components: {
      PageIndex,
      EnterpriseEditor,
      ComPositionList,
    },
    methods: {
      onSelectChange (ev, type) {
        console.log(type)
        console.log(ev)
      },
      toggleSearch () {
        this.isSearchOpen = !this.isSearchOpen

        if (!this.isSearchOpen) {
          this.pageIndexChange(1)
        }
      },
      search () {
        let keyword = this.keyword || null
        let name = this.companyName || null
        let industry = this.industry || null
        let type = this.type || null
        let scale = this.scale || null

        Req.Get(ReqUrl.Admin.getCompanyList(), {
          pageIndex: 1,
          pageSize: 50,
          name,
          industry,
          type,
          scale,
          keyword
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
      getData ({pageIndex, pageSize}) { // 获取数据列表信息
        Req.Get(ReqUrl.Admin.getCompanyList(), {
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
      pageIndexChange (index = 1) {
        this.pagination.current = index
        this.getData({
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pagesize
        })
      },
      queryComPosition (item) {
        // alert('toQueryComPosition()')
        this.editingContent = item
        this.isRichTextEditing = '3'
        this.isSearchOpen = false
      },
      parseData (res) { // 填充结果数据
        this.list = res.items
        this.pagination = ParsePagination(res.pagination) // 填充页码
      },
      createItem () {
        this.editingContent = {
          title: '',
          author: '',
          content: '',
          id: 'newCreated',
        }
        this.isRichTextEditing = '2'
      },
      editItem (item) {
        this.editingContent = item
        this.isRichTextEditing = '2'
      },
      deleteItem (item, cmd) {
        // 禁用
        let id = item.id
        let url = ReqUrl.Company.editItem(id)

        Req.Put(url, {
          frozen: cmd === 'frozen'
        }, res => {
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

        if (cmd === 'frozen') {
          // 禁用
          this.removePromoteItem(item)
        }
      },
      saveEditorContent (data) {
        let item = this.editingContent
        if (item.id === 'newCreated') {
          this.postNewsItem(data, res => {
            alert('保存成功')
            this.getData({})
          })
        } else {
          this.saveNewsItem(data, res => {
            alert('保存成功')
            this.getData({})
          })
        }
      },
      closeSubpage () {
        this.isRichTextEditing = '1'
      },

      saveNewsItem (data = {}, cbfn = x => x) {
        let item = this.editingContent
        let url = ReqUrl.Admin.putNews(item.id)
        Req.Put(url, {
          ...data
        }, res => {
          console.log(res)
          cbfn(res)
        })
      },
      postNewsItem (data = {}, cbfn = x => x) {
        let url = ReqUrl.Admin.postNews()

        Req.Post(url, {
          ...data,
          view: 0,
          star: 0,
        }, res => {
          console.log(res)
          cbfn(res)
        })
      },
      isPromoted (item) {
        let id = item.id
        let list = this.promotedList

        return list.find(item => item.companyId === id)
      },
      promoteItem (item) {
        let id = item.id
        let logo = item.logo

        if (item.frozen) {
          alert(`${item.name}为禁用状态，不能设为推荐企业`)
          return
        }
        if (!logo) {
          alert(`${item.name}的logo为空，不能设为推荐企业`)
          return
        }

        let list = this.promotedList
        let isInList = list.find(item => item.companyId === id)
        if (isInList) {
          alert('企业已在推荐列表中')
          return
        }

        this.promotedList.push({
          logo: logo,
          companyId: id,
        })
        AdminDataProxy.Set('COMPANY_PROMOTED_LIST', this.promotedList)

        alert(`推荐设置成功. 当前有${this.promotedList.length}家推荐企业。`)

        if (this.promotedList.length > 8) {
          alert(`当前推荐企业数目达到${this.promotedList.length}。不建议超过8家。请适当删除。`)
        }
      },
      removePromoteItem (item) {
        let id = item.id
        this.promotedList = this.promotedList.filter(item => {
          return item.companyId !== id
        })
        AdminDataProxy.Set('COMPANY_PROMOTED_LIST', this.promotedList)

        if (this.promotedList.length > 8) {
          alert(`移除推荐成功。推荐企业为${this.promotedList.length}家`)
        } else {
          alert('已移除推荐')
        }
      },
      outputExcelUrl () {
        let url = ReqUrl.Company.outputExcel()
        return url
      },
      outputExcelUrlWithParams () {
        let url = ReqUrl.Company.outputExcel()
        let verified = this.choosingVerfied
        let pageSize = this.pageSize || 20
        let pageIndex = this.pageIndex || 1

        return `${url}?verified=${verified || ''}&pageSize=${pageSize}&pageIndex=${pageIndex}`
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

      tr:nth-of-type(odd) {
        background-color: #eee;
      }

      tr,
      th {
        height: 2.6em;
        line-height: 2.6em;
        padding: 0 10px;
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
        .contain-btn {
          display: inline-block;
          height: auto;
        }
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
  .search-bar {
    .col {
      margin-right: 10px;
    }
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
