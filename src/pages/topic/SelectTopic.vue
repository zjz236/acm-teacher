<template>
	<div class="select-topic">
		<el-card :header="`${common?'公共':'个人'}题库-选择题`" v-loading="tableLoading">
			<div class="add-search" v-if="!editDisable">
				<el-tooltip class="item" effect="dark" content="添加选择题" placement="top">
					<el-button
							type="primary" icon="el-icon-plus" circle
							@click="addSelect"></el-button>
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
							<i class="el-icon-view el-icon" @click="editSelect(scope.row._id)"></i>
						</el-tooltip>
						<el-tooltip content="修改" placement="top" v-else>
							<i class="el-icon-edit el-icon" @click="editSelect(scope.row._id)"></i>
						</el-tooltip>
						<el-tooltip content="删除" placement="top" v-if="!editDisable">
							<i class="el-icon-delete el-icon" @click="deleteSelect(scope.row._id)"></i>
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
		<select-modify
				:disabled="editDisable" :loading="formLoading" v-model="visible" :data="formData"
				:editable="editable"
				@save="topicModify"></select-modify>
	</div>
</template>

<script>
  import SelectModify from "@/components/SelectModify"
  import api from "@/api/topic"
  import {gapCodeShow, matchReg, section} from '@/common/common'
  import {mapState} from "vuex";

  export default {
    name: "selectTopic",
    components: {SelectModify},
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
        formData: {
          description: '',
          options: ['', ''],
          answer: 'A',
          section: null,
          difficulty: 0,
          notes: ''
        },
        tableLoading: false,
        formLoading: false
      }
    },
    computed: {
      common() {
        return this.$route.name === 'commonSelect'
      },
      ...mapState([
        'userInfo'
      ]),
      editDisable() {
        return this.common && this.userInfo.isAdmin
      }
    },
    methods: {
      async topicModify(formData) {
        this.formLoading = true
        try {
          const res = await api.topicModify({
            ...formData,
            editable: this.editable,
            mine: 1,
            common: this.common,
            topicId: this.topicId,
            topicType: 'selectTopic'
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
      deleteSelect(id) {
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
            topicType: 'selectTopic',
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
      editSelect(topicId) {
        this.topicId = topicId
        this.editable = true
        this.getTopicInfo()
      },
      currentChange(page) {
        this.pageNo = page
        this.getTopicList()
      },
      matchReg,
      addSelect() {
        this.formData = {
          description: '',
          options: ['', ''],
          answer: 'A',
          section: null,
          difficulty: 0,
          notes: ''
        }
        this.editable = false
        this.visible = true
      },
      allCode() {
        return gapCodeShow(this.code, this.gaps)
      },
      async getTopicInfo() {
        try {
          const res = await api.getTopicInfo({
            topicId: this.topicId,
            topicType: 'selectTopic'
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
          const {data:{list,total}} = await api.getTopicList({
            common: this.common,
            topicType: 'selectTopic',
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
	.select-topic {
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
