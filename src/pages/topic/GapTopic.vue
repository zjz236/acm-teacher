<template>
	<div class="gap-topic">
		<el-card :header="`${common?'公共':'个人'}题库-程序填空题`" v-loading="tableLoading">
			<div class="add-search" v-if="!editDisable">
				<el-tooltip class="item" effect="dark" content="添加程序填空题" placement="top">
					<el-button
							type="primary" icon="el-icon-plus" circle
							@click="addTF"></el-button>
				</el-tooltip>
			</div>
			<el-table :data="tableData" @filter-change="filterData" max-height="400px">
				<el-table-column show-overflow-tooltip label="题目描述">
					<template slot-scope="scope">
						{{ matchReg(scope.row.description) }}
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
						<el-tooltip content="查看" placement="top" v-if="editDisable">
							<i class="el-icon-view el-icon" @click="editTF(scope.row._id)"></i>
						</el-tooltip>
						<el-tooltip content="修改" placement="top" v-else>
							<i class="el-icon-edit el-icon" @click="editTF(scope.row._id)"></i>
						</el-tooltip>
						<el-tooltip content="删除" placement="top" v-if="!editDisable">
							<i class="el-icon-delete el-icon" @click="deleteTF(scope.row._id)"></i>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="测试样例">
					<template slot-scope="scope">
						<el-tooltip content="操作" placement="top">
							<i
									class="el-icon-edit-outline el-icon"
									@click="testShow({code: scope.row.code, gaps: scope.row.gaps, topicId: scope.row._id})"></i>
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
		</el-card>
		<gap-modify :disabled="editDisable" :loading="formLoading" v-model="visible" :data="formData" :editable="editable"
								@save="topicModify"></gap-modify>
		<gap-test :disabled="editDisable" @delete-test="deleteGapTest" gap-type="gapTestData" :gap-id="topicId"
							:test-data="testDataInfo" @on-submit="handleTestSubmit" :code="allCode"
							v-model="testVisible"></gap-test>
	</div>
</template>

<script>
  import GapModify from '@/components/GapModify'
  import GapTest from '@/components/GapTest'
  import testData from '@/api/testData'
  import api from '@/api/topic'
  import {matchReg, section, gapCodeShow} from '@/common/common'
  import {mapState} from 'vuex'

  export default {
    name: 'GapTopic',
    components: {GapModify, GapTest},
    data() {
      return {
        visible: false,
        editable: false,
        tableData: [],
        section,
        pageSize: 20,
        pageNo: 1,
        total: 0,
        filters: [],
        topicId: '',
        testDataInfo: {},
        formData: {
          description: '',
          code: '',
          gaps: ['', ''],
          section: null,
          difficulty: 0,
          notes: ''
        },
        tableLoading: false,
        formLoading: false,
        testVisible: false,
        code: '',
        gaps: []
      }
    },
    computed: {
      common() {
        return this.$route.name === 'commonGap'
      },
      ...mapState([
        'userInfo'
      ]),
      editDisable() {
        return this.common && !this.userInfo.isAdmin
      },
      allCode() {
        return gapCodeShow(this.code, this.gaps)
      }
    },
    methods: {
      async deleteGapTest() {
        try {
          const result = await testData.deleteGapTest({gapId: this.topicId, topicType: 'gapTestData'})
          if (result.code) {
            this.testShow({code: this.code, gaps: this.gaps, topicId: this.topicId})
          }
        } catch (e) {
          console.error(e)
        }
      },
      async topicModify(formData) {
        this.formLoading = true
        try {
          const res = await api.topicModify({
            ...formData,
            editable: this.editable,
            mine: 1,
            common: this.common,
            topicId: this.topicId,
            topicType: 'gapTopic'
          })
          if (res.code) {
            this.$message.success(res.msg)
            this.visible = false
            this.getTopicList()
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.formLoading = false
        }
      },
      gapCodeShow,
      deleteTF(id) {
        this.$confirm('是否确认删除该题目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.deleteTopic(id)
        })
      },
      async deleteTopic(topicId) {
        try {
          const res = await api.deleteTopic({
            topicType: 'gapTopic',
            topicId
          })
          if (res.code) {
            this.$message.success(res.msg)
            this.getTopicList()
          }
        } catch (e) {
          console.error(e)
        }
      },
      filterData(filters) {
        this.filters = filters['el-table_1_column_2']
        this.getTopicList()
      },
      async testShow({code, gaps, topicId}) {
        try {
          const {data} = await testData.getGapTestInfo({gapId: topicId, topicType: 'gapTestData'})
          this.testDataInfo = data
          this.code = code
          this.gaps = gaps
          this.topicId = topicId
          this.testVisible = true
        } catch (e) {
          console.error(e)
        }

      },
      editTF(topicId) {
        this.topicId = topicId
        this.editable = true
        this.getTopicInfo()
      },
      currentChange(page) {
        this.pageNo = page
        this.getTopicList()
      },
      matchReg,
      addTF() {
        this.formData = {
          description: '',
          code: '',
          gaps: ['', ''],
          section: null,
          difficulty: 0,
          notes: ''
        }
        this.editable = false
        this.visible = true
      },
      async handleTestSubmit(value) {
        const formdata = value
        formdata.append('gapId', this.topicId)
        formdata.append('topicType', 'gapTestData')
        try {
          const res = await testData.gapTestSubmit(formdata)
          if (res.code) {
            this.$message.success(res.msg)
            this.testVisible = false
          }
        } catch (e) {
          console.error(e)
        }
      },
      async getTopicInfo() {
        try {
          const res = await api.getTopicInfo({
            topicId: this.topicId,
            topicType: 'gapTopic'
          })
          if (res.code) {
            for (const index in res.data) {
              this.formData[index] = res.data[index]
            }
            this.visible = true
          }
        } catch (e) {
          console.error(e)
        }
      },
      async getTopicList() {
        this.tableLoading = true
        try {
          const {data: {list, total}} = await api.getTopicList({
            common: this.common,
            topicType: 'gapTopic',
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
      }
    },
    mounted() {
      this.getTopicList()
    }
  }
</script>

<style scoped lang="scss">
	.gap-topic {
		.add-search {
			display: flex;
			width: 90%;
			align-items: center;

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
