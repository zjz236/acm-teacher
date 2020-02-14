<template>
	<div class="program-topic">
		<el-card header="程序设计题" v-loading="tableLoading">
			<div class="topic-program">
				<el-button style="margin-bottom: 20px;" @click="programVisible = true">从题库选题</el-button>
				<el-table :data="tableData" @filter-change="filterData" max-height="400px">
					<el-table-column show-overflow-tooltip label="题目标题">
						<template slot-scope="scope">
							{{ matchReg(scope.row.title) }}
						</template>
					</el-table-column>
					<el-table-column show-overflow-tooltip label="题目章节" :filters="section" :filtered-value="filters">
						<template slot-scope="scope">
							{{section.filter(item=>item.value === scope.row.section).map(item=>item.text).join('')}}
						</template>
					</el-table-column>
					<el-table-column label="题目难度" prop="difficulty"></el-table-column>
					<el-table-column show-overflow-tooltip label="备注" prop="notes"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-tooltip content="修改" placement="top">
								<i class="el-icon-edit el-icon" @click="getExamTopicInfo(scope.row._id)"></i>
							</el-tooltip>
							<el-tooltip content="删除" placement="top">
								<i class="el-icon-delete el-icon" @click="deleteExamTopic(scope.row._id)"></i>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column label="测试样例">
						<template slot-scope="scope">
							<el-tooltip content="操作" placement="top">
								<i
										class="el-icon-edit-outline el-icon"
										@click="testShow({ topicId: scope.row._id})"></i>
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
		</el-card>
		<el-dialog :visible.sync="programVisible" title="从题库选题">
			<el-select style="margin-bottom: 20px" v-model="isCommon" @change="getExamTransferTopic">
				<el-option :value="false" label="从个人题库选题"></el-option>
				<el-option :value="true" label="从公共题库选题"></el-option>
			</el-select>
			<el-transfer
					filterable
					:titles="[isCommon ? '公共题库' : '个人题库', '已选题目']" :props="prop" :data="topicList"
					v-model="examTopicList">
				<span slot-scope="{ option }">{{matchReg(option.title)}}</span>
			</el-transfer>
			<template slot="footer">
				<el-button type="primary" @click="examTopicTransfer">添加</el-button>
			</template>
		</el-dialog>
		<program-modify @save="modifyExamTopic" editable :loading="modifyLoading" :data="formData"
										v-model="modifyVisible"></program-modify>
		<program-test program-type="examProgramTestData" :program-id="topicId" :test-data="testDataInfo"
									v-model="testVisible"></program-test>
	</div>
</template>

<script>
  import examTopic from '@/api/examTopic'
  import {matchReg, section} from '@/common/common'
  import ProgramModify from '@/components/ProgramModify'
  import ProgramTest from '@/components/ProgramTest'

  export default {
    name: 'ProgramTopic',
    components: {ProgramModify, ProgramTest},
    data() {
      return {
        programVisible: false,
        modifyVisible: false,
        isCommon: false,
        topicList: [],
        testDataInfo: {},
        testVisible: false,
        examTopicList: [],
        tableData: [],
        tableLoading: false,
        section,
        filters: [],
        modifyLoading: false,
        pageSize: 20,
        pageNo: 1,
        total: 0,
        formData: {
          title: '',
          description: '',
          inputDesc: '',
          outputDesc: '',
          simpleInput: '',
          simpleOutput: '',
          timeLimit: 1000,
          memoryLimit: 32768,
          section: 999,
          difficulty: 0,
          notes: ''
        },
        topicId: '',
        examId: this.$route.params.examId,
        prop: {
          key: '_id',
          label: 'description'
        }
      }
    },
    methods: {
      async getExamTransferTopic(val) {
        try {
          const {data} = await examTopic.getExamTransferTopic({
            examId: this.examId,
            common: val || this.isCommon,
            topicType: 'programTopic'
          })
          this.topicList = data.topicList
          this.examTopicList = data.examTopicList.map(item => item.topicId)
        } catch (e) {
          console.error(e)
        }
      },
      matchReg,
      currentChange(page) {
        this.pageNo = page
        this.getExamTopicList()
      },
      async modifyExamTopic(form) {
        this.modifyLoading = true
        try {
          await examTopic.modifyExamTopic({
            ...form,
            topicId: this.topicId,
            topicType: 'examProgramTopic'
          })
          this.$message.success('修改成功')
          this.getExamTopicList()
          this.modifyVisible = false
        } catch (e) {
          console.error(e)
        } finally {
          this.modifyLoading = false
        }
      },
      filterData(filters) {
        this.filters = filters['el-table_1_column_2']
        this.getExamTopicList()
      },
      async testShow({topicId}) {
        try {
          this.topicId = topicId
          this.testVisible = true
        } catch (e) {
          console.error(e)
        }
      },
      async deleteExamTopic(topicId) {
        try {
          await examTopic.deleteExamTopic({
            topicType: 'examProgramTopic',
            topicId
          })
          this.$message.success('删除成功!')
          this.getExamTopicList()
        } catch (e) {
          console.error(e)
        }
      },
      async getExamTopicList() {
        this.tableLoading = true
        try {
          const {data: {list, total}} = await examTopic.getExamTopicList({
            examId: this.examId,
            topicType: 'examProgramTopic',
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            filters: this.filters.join(',')
          })
          this.tableData = list
          this.total = total
        } catch (e) {
          console.error(e)
        } finally {
          this.tableLoading = false
        }
      },
      async examTopicTransfer() {
        try {
          await examTopic.examTopicTransfer({
            topicIdList: this.examTopicList,
            topicType: 'programTopic',
            examId: this.examId
          })
          this.$message.success('添加成功')
        } catch (e) {
          console.error(e)
        } finally {
          this.getExamTopicList()
        }
      },
      async getExamTopicInfo(topicId) {
        this.modifyLoading = true
        this.modifyVisible = true
        this.topicId = topicId
        try {
          const {data} = await examTopic.getExamTopicInfo({
            topicId,
            topicType: 'examProgramTopic'
          })
          for (const index in this.formData) {
            this.formData[index] = data[index]
          }
          this.modifyLoading = false
        } catch (e) {
          console.error(e)
        }
      }
    },
    mounted() {
      this.getExamTopicList()
    },
    watch: {
      programVisible(val) {
        if (val) {
          this.getExamTransferTopic()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
	.program-topic {
		.el-transfer {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		/deep/ .el-transfer-panel {
			width: 35%;
		}

		.el-icon {
			font-size: 20px;
			margin-right: 10px;
			cursor: pointer;
		}
	}
</style>
