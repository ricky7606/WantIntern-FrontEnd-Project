<template lang="html">
  <div class="news-list xsx-form-theme">
    <div class="create-form">
      <div class="title">创建Admin账号</div>
      <div class="row">
        <div class="input-label col">账号名:</div>
        <div class="col">
          <input type="text" v-model="account">
        </div>
      </div>
      <div class="row">
        <div class="input-label col">密码:</div>
        <div class="col">
          <input type="text" v-model="password">
        </div>
      </div>
      <div class="row">
        <div class="input-label col">确认密码:</div>
        <div class="col">
          <input type="text" v-model="password2">
        </div>
      </div>
      <div class="row flex-center">
        <div class="btn plain" @click="submit">
           创建
        </div>
      </div>
    </div>

    <div class="list">
      <div class="row title">
        已注册账户：
      </div>
      <table>
        <tr>
          <th></th>
          <th>账号名</th>
        </tr>
        <template v-for="(account, index) in list">
          <tr>
            <td>{{index + 1}}</td>
            <td>{{account.phone}}</td>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>

<script>
  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import PageIndex from '@/components/Utils/PageIndex.vue'
  import { ParsePagination } from '@/utils/helper-functions.js'
  import EnterpriseEditor from '@/components/Admin/EnterpriseEditor.vue'
  import { mapReqGender, mapReqLangLevel, mapReqEdu } from '@/components/Position/PositionEnum.js'
  export default {
    name: 'AdminList',
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

        account: '',
        password: '',
        password2: '',
      }
    },
    mounted () {
      this.getData({})
    },
    components: {
      PageIndex,
      EnterpriseEditor,
    },
    methods: {
      submit () {
        if (this.account.length < 5) {
          alert('请输入长于5位的账号名')
          return
        }
        if (this.password.length < 6) {
          alert('请输入长于6位的密码')
          return
        }
        if (this.password2 !== this.password) {
          alert('密码不一致，请重新输入')
          this.password2 = ''
          return
        }

        this.createNewAdmin({
          account: this.account,
          password: this.password,
        })
      },
      createNewAdmin ({account, password}) {
        // 资讯
        Req.Post(ReqUrl.Admin.postRegister(), {
          phone: account,
          password: password,
        }, res => {
          console.log(res)
          alert('创建成功')
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
        Req.Get(ReqUrl.Admin.postRegister(), {
          pageIndex: pageIndex || 1,
          pageSize: pageSize || 20,
        }, res => {
          this.list = res.items
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
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .news-list {
    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .row {
      margin-bottom: 10px;
    }
    .input-label {
      width: 6em;
      text-align: right;
      margin-right: 10px;
    }

    .btn {
      width: 6em;
    }

    .list {
      display: inline-block;
      text-align: left;
      margin-top: 20px;

      .title {
        font-size: 14spx;
      }
      table {
        border: 1px solid gray;
        font-size: 12px;

        tr {
          height: 2.6em;
          line-height: 2.6em;
        }
        th,
        td {
          padding: 0 10px;
        }
        tr:nth-of-type(odd) {
          background-color: #eee;
        }
      }
    }
  }
</style>
