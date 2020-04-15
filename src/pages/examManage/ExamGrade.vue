<template>
	<div class="exam-grade">
		<el-card :header="`考试评测（${examInfo.examName || ''}）`">
			<el-alert
				title="程序填空题、程序设计题评测较慢，请各位老师耐心等待~~"
				type="warning">
			</el-alert>
			<div class="grade-button" v-if="examInfo.finishTime && new Date(examInfo.finishTime) < new Date()">
				<el-button :loading="loading" @click="tfGrade">判断题评测</el-button>
				<el-button :loading="loading" @click="selectGrade">选择题评测</el-button>
				<el-button :loading="loading" @click="gapGrade">程序填空题评测</el-button>
				<el-button :loading="loading" @click="programGrade">程序设计题校验</el-button>
				<el-button :loading="loading" @click="gradeExport">学生成绩导出</el-button>
			</div>
			<el-alert
				v-else
				:closable="false"
				title="考试未结束前暂不支持评测!"
				type="error">
			</el-alert>
			<el-table v-loading="tableLoading || loading" :data="tableData" @sort-change="sortChange" max-height="300px">
				<el-table-column label="学号" sortable prop="studentId"></el-table-column>
				<el-table-column label="姓名" prop="name"></el-table-column>
				<el-table-column label="判断题分数" prop="tfScore"></el-table-column>
				<el-table-column label="选择题分数" prop="selectScore"></el-table-column>
				<el-table-column label="程序填空题分数" prop="gapScore"></el-table-column>
				<el-table-column label="程序设计题分数" prop="programScore"></el-table-column>
				<el-table-column label="总成绩" prop="score" sortable></el-table-column>
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
		</el-card>
	</div>
</template>

<script>
  import examinee from '@/api/examinee'
  import api from '@/api/exam'
  import grade from '@/api/grade'

  export default {
    name: 'ExamGrade',
    data() {
      return {
        examInfo: {},
        examId: this.$route.params.examId,
        tableData: [],
        tableLoading: false,
        sortedName: null,
        sortedType: null,
        pageNo: 1,
        pageSize: 10,
        total: 0,
        timer: null,
        loading: false
      }
    },
    beforeDestroy () {
      clearTimeout(this.timer)
    },
    methods: {
      async getExamInfo() {
        this.loading = true
        try {
          const {data} = await api.getExamInfo({
            examId: this.examId
          })
          this.examInfo = data
          if (data.tfStatus === 1 || data.selectStatus === 1 || data.gapStatus === 1 || data.programStatus === 1) {
            this.timer = setTimeout(() => this.getExamInfo(), 500)
          } else {
            clearTimeout(this.timer)
            this.loading = false
            this.getExamineeList()
          }
        } catch (e) {
          console.error(e)
          this.loading = false
        }
      },
      async gradeExport() {
        window.location.href = process.env.VUE_APP_URL + '/oj/grade/gradeExport/' + this.examId
      },
      async getExamineeList() {
        this.tableLoading = true
        try {
          const {data} = await examinee.getExamineeList({
            examId: this.examId,
            pageSize: this.pageSize,
            pageNo: this.pageNo,
            search: this.searchData,
            sortedName: this.sortedName,
            sortedType: this.sortedType
          })
          this.tableData = data.list
          this.total = data.total
        } catch (e) {
          console.error(e)
        } finally {
          this.tableLoading = false
        }
      },
      async tfGrade() {
        this.loading = true
        try {
          await grade.tfGrade({
            examId: this.examId
          })
          this.getExamInfo()
        } catch (e) {
          console.error(e)
          this.loading = false
        }
      },
      async selectGrade() {
        this.loading = true
        try {
          await grade.selectGrade({
            examId: this.examId
          })
          this.getExamInfo()
        } catch (e) {
          console.error(e)
          this.loading = false
        }
      },
      async programGrade() {
        this.loading = true
        try {
          await grade.programGrade({
            examId: this.examId
          })
          this.getExamInfo()
        } catch (e) {
          console.error(e)
          this.loading = false
        }
      },
      sortChange({prop, order}) {
        this.sortedName = prop
        this.sortedType = order
        this.getExamineeList()
      },
      currentChange(page) {
        this.pageNo = page
        this.getExamineeList()
      },
      async gapGrade() {
        this.loading = true
        try {
          await grade.gapGrade({
            examId: this.examId
          })
          this.getExamInfo()
        } catch (e) {
          console.error(e)
          this.loading = false
        }
      }
    },
    created() {
      this.getExamInfo()
      this.getExamineeList()
    }
  }
</script>

<style lang="scss" scoped>
	.exam-grade {
		.grade-button {
			margin: 10px 0;
		}
	}
</style>
