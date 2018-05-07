<template lang="html">
  <div class="enterprise-searcher xsx-form-theme">
    <div class="align-left">
      <a :href="outputExcelUrl()" target="_blank">
        <div class="output-box btn col plain">
          导出所有学生信息
        </div>
      </a>
    </div>
    <div class="list align-center">
      <table v-show="!isRichTextEditing">
        <tr>
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
            <td class="id">{{newsItem.phone}}</td>
            <td class="title">{{newsItem.name}}</td>
            <td class="author">{{mapReqGender[newsItem.gender]}}</td>
            <td class="author">{{mapReqEdu[newsItem.education]}}</td>
            <td class="author">{{newsItem.school}}</td>
            <td class="author">{{newsItem.major}}</td>
            <td class="author">{{newsItem.grade}}</td>
            <td class="author">{{newsItem.createTime}}</td>
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

  export default {
    name: 'StudentList',
    data () {
      return {
        searchParams: []
      }
    },
    methods: {
      getData () {
        let data = this.searchParams
        let url = ReqUrl.StudentSubUrl.getList()
        Req.Get(
          url,
          data,
          res => {
            console.log(res)
          }
        )
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../less/common.less";
  @import "../../less/form.less";

  .enterprise-searcher {
    display: block;

  }
</style>
