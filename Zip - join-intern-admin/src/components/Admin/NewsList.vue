<template lang="html">
  <div class="news-list xsx-form-theme">
    <div class="list align-center">
      <div class="row header">
        <div class="title col">
          资讯列表
        </div>
        <div class="btn col createNew" @click="createItem">
          新建资讯
        </div>
      </div>
      <table>
        <tr v-if="list.length > 0">
          <th>id</th>
          <th>标题</th>
          <th>作者</th>
          <th>操作</th>
        </tr>
        <template v-for="newsItem in list">
          <tr>
            <td class="id">{{newsItem.id}}</td>
            <td class="title">{{newsItem.title}}</td>
            <td class="author">{{newsItem.author}}</td>
            <td class="action">
              <div class="btn col plain btn-edit"
                @click="editItem(newsItem)">
                编辑
              </div>
              <div class="btn col plain warning"
                v-if="newsItem.published"
                @click="deleteItem(newsItem, false)">
                禁用
              </div>
              <div class="btn col plain btn-delete"
                v-if="!newsItem.published"
                @click="deleteItem(newsItem, true)">
                启用
              </div>
            </td>
          </tr>
        </template>
      </table>

      <page-index v-if="list.length > 0"
                  :total="pagination.total"
                  :current="pagination.current"
                  @change="pageIndexChange"/>
    </div>

    <div class="sub-page" v-if="isRichTextEditing">
      <news-editor :content="editingContent.content"
                   :title="editingContent.title"
                   :author="editingContent.author"
                   @save="saveEditorContent"
                   @close="closeSubpage" />
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'
  import NewsEditor from '@/components/Admin/NewsEditor.vue'

  export default {
    name: 'NewsList',
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
      }
    },
    mounted () {
      this.getData({})
    },
    components: {
      PageIndex,
      NewsEditor,
    },
    methods: {
      getData ({pageIndex, pageSize}) {
        // 资讯
        Req.Get(ReqUrl.Admin.getNews(), {
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
        let id = item.id
        let url = ReqUrl.Admin.putNews(id)

        Req.Put(url, {
          published: !!cmd
        }, res => {
          console.log(res)
          alert(cmd ? '启用成功' : '禁用成功')
          this.pageIndexChange(this.pagination.current)
        }, fail => {
          if (fail && fail.response.data) {
            alert(fail.response.data.userMessage)
            this.pageIndexChange(this.pagination.current)
          }
        })
      },
      saveEditorContent (data) {
        let item = this.editingContent
        if (item.id === 'newCreated') {
          this.postNewsItem(data, res => {
            alert('保存成功')
            this.getData({})
            this.closeSubpage()
            this.pageIndexChange(this.pagination.current)
          })
        } else {
          this.saveNewsItem(data, res => {
            alert('保存成功')
            this.getData({})
            this.closeSubpage()
            this.pageIndexChange(this.pagination.current)
          })
        }
      },
      closeSubpage () {
        this.isRichTextEditing = false
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
    .btn-edit {

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
</style>
