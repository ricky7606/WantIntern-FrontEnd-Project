<template lang="html">
  <div class="page-interns-backgrounds xsx-form-theme">
    <div class="header row">
      <div class="center-content">
        <div class="col">
          <div class="col input-label">姓名</div>
          <div class="col">
            <input type="text" placeholder="请输入" v-model="searchName"/>
          </div>
        </div>
        <div class="col">
          <div class="col input-label">手机号</div>
          <div class="col">
            <input type="text" placeholder="请输入" v-model="searchPhone"/>
          </div>
        </div>
        <div class="col">
          <div class="col input-label">毕业院校</div>
          <div class="col">
            <input type="text" placeholder="请输入" v-model="searchSchool"/>
          </div>
        </div>
        <div class="col">
          <div class="btn" @click="getData">查询</div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="center-content">
        <stu-info-list :list="studentList"/>

        <page-index v-if="studentList.length"
                    :total="pagination.total"
                    :current="pagination.current"
                    @change="pageIndexChange"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { TabbarResume } from '@/components/Enterprise/Enum.js'
  import StuInfoList from '@/components/Resume/StuInfoList.vue'

  import * as Req from '@/api/index.js'
  import * as ReqUrl from '@/api/url.js'
  import { ParsePagination } from '@/utils/helper-functions.js'
  import PageIndex from '@/components/Utils/PageIndex.vue'

  export default {
    name: 'Page-Matters',
    data () {
      return {
        TabbarResume,
        studentList: [],

        searchName: '',
        searchPhone: '',
        searchSchool: '',

        pagination: {},
      }
    },
    mounted () {
      this.getData()
    },
    components: {
      StuInfoList,
      PageIndex,
    },
    methods: {
      getRatesListOfStudentId (stuId, cbfn = x => x) {
        let url = ReqUrl.StudentSubUrl.getRatesList(stuId)
        Req.Get(
          url,
          null,
          res => {
            console.log(res)
            cbfn(res)
          }
        )
      },
      getData (params = {}) {
        let url = ReqUrl.Company.getStuInfo()
        let name = this.searchName || null
        let phone = this.searchPhone || null
        let school = this.searchSchool || null

        // 不可以通过学校定位到学生
        if (!name && !phone) return

        Req.Get(url, {
          name,
          school,
          phone,
          pageSize: params.pageSize || 20,
          pageIndex: params.pageIndex || 1,
        }, res => {
          // console.log(res.items)
          this.studentList = res.items.map(item => {
            item.rates = []
            item.ratesShow = false
            return item
          })
          this.studentList.forEach(item => {
            let id = item.id
            this.getRatesListOfStudentId(id, res => {
              // console.log(res)
              item.rates = res && res.items
              item.ratesShow = false
            })
          })
          this.pagination = ParsePagination(res.pagination)
        }, fail => {
          if (fail.response.data && (fail.response.data.status === 401 || fail.response.data.status === 404)) {
            this.$router.push({
              name: 'Login'
            })
          }
        })
      },
      // 页面切换
      pageIndexChange (index) {
        this.pagination.current = index
        this.getData({pageIndex: index})
      },
    },
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .page-interns-backgrounds {
    // padding-top: 30px;
    // background-color: white;

    .center-content {
      width: @MIN-WIDTH;
      min-width: @MIN-WIDTH;
      margin: 0 auto;
    }
    .header {
      padding-top: 30px;
      padding-bottom: 30px;
      text-align: left;
      margin-bottom: 20px;
      background-color: white;

      .input-label {
        margin-left: 24px;
        margin-right: 16px;
      }

      input {
        width: 220px;
        margin-right: 16px;
      }
    }
    .content {
      background-color: white;
      padding: 20px 0;
    }
  }
</style>
