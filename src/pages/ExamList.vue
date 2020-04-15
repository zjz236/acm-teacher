<template>
  <div class="exam-list">
    <page-title title="我的考试">
      <template slot="description">
        <div class="add-search">
          <el-input v-model="search" @keydown.enter.native="searchExam" clearable @clear="searchExam">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="searchExam"></i>
          </el-input>
          <el-tooltip class="item" effect="dark" content="添加考试" placement="top">
            <el-button type="primary" icon="el-icon-plus" circle @click="linkAdd"></el-button>
          </el-tooltip>
        </div>
      </template>
    </page-title>
    <el-table style="width: 90%" :data="tableData">
      <el-table-column label="考试名称" prop="examName"></el-table-column>
      <el-table-column label="开始时间">
        <template slot-scope="scope">
          {{moment(scope.row.startTime).format('YYYY年MM月DD日 HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          {{moment(scope.row.finishTime).format('YYYY年MM月DD日 HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column label="考试类型">
        <template slot-scope="scope">
          {{scope.row.isExam ? '考试' : '练习'}}
        </template>
      </el-table-column>
      <el-table-column label="考试语言">
        <template slot-scope="scope">
          {{languages[scope.row.language]}}
        </template>
      </el-table-column>
      <el-table-column label="考试状态">
        <template slot-scope="scope">
          <span :class="examStatus(scope.row.startTime,scope.row.finishTime)">{{examStatus(scope.row.startTime,scope.row.finishTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip content="考试管理" placement="top">
            <i class="el-icon-edit el-icon" @click="linkManage(scope.row._id)"></i>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <i class="el-icon-delete el-icon" @click="deleteExam(scope.row._id)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageNo"
        :page-size="pageSize"
        @current-change="currentChange"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle'
  import api from '@/api/exam'
  import moment from 'moment'
  import {languages, examStatus} from '@/common/common'

  export default {
    name: 'exam',
    components: {PageTitle},
    data() {
      return {
        search: '',
        tableData: [],
        pageNo: 1,
        pageSize: 20,
        languages,
        searchData: '',
        total: 0
      }
    },
    methods: {
      linkAdd() {
        this.$router.push({name: 'addExam'})
      },
      linkManage(examId) {
        this.$router.push({name: 'examManage', params: {examId}})
      },
      currentChange(page) {
        this.pageNo = page
        this.getExamList()
      },
      async deleteExam(examId) {
        try {
          await api.deleteExam({examId})
          this.$message.success('删除成功')
          this.getExamList()
        } catch (e) {
          console.error(e)
        }
      },
      moment,
      examStatus,
      searchExam() {
        this.searchData = this.search
        this.getExamList()
      },
      async getExamList() {
        try {
          const {data} = await api.getExamList({
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            search: this.searchData
          })
          this.tableData = data.list
          this.total = data.total
        } catch (e) {
          console.error(e)
        }
      }
    },
    mounted() {
      this.getExamList()
    }
  }
</script>

<style lang="scss" scoped>
  .exam-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .add-search {
      display: flex;
      width: 90%;
      align-items: center;

      .el-button {
        margin-left: 30px;
      }

      .el-input {
        width: 250px;
      }
    }

    .el-icon {
      font-size: 20px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
</style>
