<template lang="html">
  <div class="admin-page">
    <page-header />

    <div class="content flex-row">
      <div class="col left category-sidebar">
        <div class="sidebar-title">导航栏</div>

        <div class="category-part">
          <template v-for="cat in AdminPageCategoryList">
            <div class="category" :class="{selected: cat.title === selectedCategory}"
              @click="selectCategory(cat)">
              <div class="cat-title pointer-on row">{{cat.title}}</div>

              <div class="cat-list row" v-for="item in cat.list">
                <div class="cat-item pointer-on row"  :class="{selected: item.title === selectedItem}"
                  @click="selectItem(item)">
                  {{ item.title }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="right">
        <div class="header">
          {{ selectedCategory }}
          {{ selectedCategory ? '>' : '' }}
          {{ selectedItem }}
        </div>
        <admin-index v-if="selectedMode === 'item'"
          :list="dataCopy"
          :header="dataHeader"
          @update="updateData" />

        <admin-news-list v-if="selectedMode === 'api-item' && selectedItemKey === 'news'"
          :port="dataCopy"
          @update="newsListUpdate" />

        <agreement-editor v-if="selectedMode === 'api-item' && (selectedItemKey === 'STU_AGREEMENT' || selectedItemKey === 'COMPANY_AGREEMENT')"
                          :tag="selectedItemKey"/>

        <enterprise-list v-if="selectedMode === 'api-item' && selectedItemKey === 'enterprise-list'"/>
        <student-list v-if="selectedMode === 'api-item' && selectedItemKey === 'student-list'"/>
        <salary-list v-if="selectedMode === 'api-item' && selectedItemKey === 'salary-list'"/>
        <withdraw-list v-if="selectedMode === 'api-item' && selectedItemKey === 'withdraw-list'"/>
        <admin-list v-if="selectedMode === 'api-item' && selectedItemKey === 'admin-list'"/>
        <notification-center v-if="selectedMode === 'api-item' && selectedItemKey === 'notification-center'"/>

        <help-news-editor title="关于我们" store-key="FOOTER_INTRO" v-if="selectedMode === 'api-item' && selectedItemKey === 'FOOTER_INTRO'"/>
        <help-news-editor title="企业帮助" store-key="FOOTER_ENTERPRISE_HELP" v-if="selectedMode === 'api-item' && selectedItemKey === 'FOOTER_ENTERPRISE_HELP'"/>
        <help-news-editor title="学生帮助" store-key="FOOTER_STUDENT_HELP" v-if="selectedMode === 'api-item' && selectedItemKey === 'FOOTER_STUDENT_HELP'"/>

        <message v-if="selectedMode === 'api-item' && selectedItemKey === 'message'"/>
        <feedback v-if="selectedMode === 'api-item' && selectedItemKey === 'feedback'"/>

      </div>
    </div>
  </div>
</template>

<script>
  import AdminIndex from '@/components/Admin/Index.vue'
  import AdminList from '@/components/Admin/AdminList.vue'
  import AdminNewsList from '@/components/Admin/NewsList.vue'
  import AgreementEditor from '@/components/Admin/AgreementEditor.vue'
  import EnterpriseList from '@/components/Admin/EnterpriseList.vue'
  import NotificationCenter from '@/components/Admin/NotificationCenter.vue'
  import PageFooter from '@/components/Parent/Footer.vue'
  import PageHeader from '@/components/Parent/Header.vue'
  import SalaryList from '@/components/Admin/SalaryList.vue'
  import StudentList from '@/components/Admin/StudentList.vue'
  import WithdrawList from '@/components/Admin/WithdrawList.vue'

  import HelpNewsEditor from '@/components/Admin/HelpNewsEditor.vue'

  import Message from '@/components/Mine/Message.vue'
  import Feedback from '@/components/Mine/Feedback.vue'

  import {
    AdminPageCategoryList,
    AdminItemHeader,
    MapCategory,
  } from '@/components/Admin/AdminPageEnum.js'
  import {
    TabbarResume,
  } from '@/components/Enterprise/Enum.js'

  import * as AdminDataProxy from '@/components/Admin/proxy.js'

  export default {
    name: 'AdminPage',
    data () {
      return {
        TabbarResume,
        AdminPageCategoryList,
        AdminItemHeader,

        selectedCategory: '',
        selectedItem: '',
        selectedItemKey: '',

        dataCopy: [],
        dataHeader: [],
        selectedMode: 'item',
      }
    },
    beforeRouteEnter (from, to, next) {
      next(that => {
        that.onRouteChange(from)
      })
    },
    beforeRouteUpdate (from, to, next) {
      this.onRouteChange(from)
      next()
    },
    methods: {
      onRouteChange (route) {
        let key = route.params.tabname

        if (route.name === 'AdminIndex-Item') {
          this.selectedMode = 'item'
          this.loadData(key)
          this.dataHeader = AdminItemHeader[key] || []
        } else if (route.name === 'AdminIndex-ApiItem') {
          this.selectedMode = 'api-item'
        }

        this.selectedItemKey = key
        this.selectedItem = route.params.title
        this.selectedCategory = MapCategory[this.selectedItem]
        // this.selectedCategory 处理
      },
      selectCategory (cat) {
        if (this.selectedCategory !== cat.title) {
          this.selectedItem = ''
          this.dataCopy = []
          this.dataHeader = []
        }
        this.selectedCategory = cat.title
      },
      selectItem (item) {
        this.selectedItem = item.title
        this.selectedItemKey = item.key

        if (item.type === 'item') {
          this.selectedMode = 'item'
          this.loadData(item.key)
          this.dataHeader = AdminItemHeader[item.key] || []

          this.$router.push({
            name: 'AdminIndex-Item',
            params: {
              tabname: item.key,
              title: item.title,
            },
          })
        } else {
          this.selectedMode = 'api-item'

          this.$router.push({
            name: 'AdminIndex-ApiItem',
            params: {
              tabname: item.key,
              title: item.title,
            },
          })
        }
      },
      loadData (key) {
        AdminDataProxy.Get(key, res => {
          this.dataCopy = res || []
        })
      },
      updateData (data) {
        let key = this.selectedItemKey

        AdminDataProxy.Set(key, data, res => {
          alert('保存成功')
        }, fail => {
          console.log(fail)
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
      newsListUpdate (item) {
        console.log(item)
      },
    },
    components: {
      PageHeader,
      PageFooter,
      AdminIndex,
      AdminNewsList,
      AgreementEditor,
      EnterpriseList,
      SalaryList,
      StudentList,
      WithdrawList,
      AdminList,
      Message,
      Feedback,
      NotificationCenter,
      HelpNewsEditor,
    }
  }
</script>

<style lang="less" scoped>
  @import "../less/common.less";
  .admin-page {
    // padding-top: 135px;
    padding-top: 70px;
    height: 100vh;
    overflow: auto;
  }
  .category-sidebar {
    width: 160px;
    height: 100%;
    flex-shrink: 0;

    .sidebar-title {
      font-size: 14px;
      padding: 10px 0;
      border-bottom: 10px solid black;
      letter-spacing: 6px;
    }

    .category-part {
      padding-left: 10px;
      padding-top: 10px;
      padding-bottom: 10px;
      text-align: left;
      background-color: #333;
      color: white;

      .cat-title {
        font-size: 14px;
        margin-bottom: 4px;
        padding: 5px 0;
        padding-left: 5px;
        user-select: none;

        &:before {
          content: '+';
          margin-right: 3px;
        }
      }
      .cat-list {
        padding-left: 15px;
        display: none;

        .cat-item {
          font-size: 12px;
          padding: 2px 0;
          user-select: none;
        }
      }

      .category.selected {
        background-color: rgba(255,255,255,0.8);
        color: #61affe;

        .cat-title {
          color: black;
        }
        .cat-list {
          display: block;
          background-color: white;
        }
        .cat-item.selected {
          color: black;

          &:before {
            content: '-';
          }
        }
      }
    }
  }

  .content {
    min-height: 80vh;
    height: 100%;
    overflow: hidden;

    .right {
      background-color: white;
      flex: 1;
      padding: 5px;
      height: 100%;
      overflow: auto;

      .header {
        font-size: 14px;
        text-align: left;
        margin-bottom: 10px;
        border-bottom: 1px solid black;
      }
    }
  }
</style>
