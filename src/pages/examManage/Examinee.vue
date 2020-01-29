<template>
	<div class="examinee">
		<el-card title="考生管理">
			<div class="search">
				<el-input v-model="search" clearable @clear="searchExaminee">
					<i slot="prefix" class="el-input__icon el-icon-search" @click="searchExaminee"></i>
				</el-input>
				<el-tooltip class="item" effect="dark" content="批量修改" placement="top">
					<el-button type="primary" icon="el-icon-edit-outline" circle @click="linkAdd('examineeAdd')"></el-button>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" content="单个添加" placement="top">
					<el-button type="primary" icon="el-icon-plus" circle @click="linkAdd('examineeModifyAdd')"></el-button>
				</el-tooltip>
			</div>
			<el-table :data="tableData" @sort-change="sortChange">
				<el-table-column label="学校" prop="school" width="200"></el-table-column>
				<el-table-column label="学院" prop="college"></el-table-column>
				<el-table-column label="专业" prop="major"></el-table-column>
				<el-table-column label="班级" prop="className"></el-table-column>
				<el-table-column label="用户名" prop="username"></el-table-column>
				<el-table-column label="密码" prop="password"></el-table-column>
				<el-table-column label="姓名" prop="name"></el-table-column>
				<el-table-column label="性别" width="80">
					<template slot-scope="scope">
						{{getSex[scope.row.sex]}}
					</template>
				</el-table-column>
				<el-table-column label="学号" sortable prop="studentId"></el-table-column>
				<el-table-column label="成绩" prop="score" sortable>
					<template slot-scope="scope">
						{{getScore(scope.row)}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-tooltip content="修改" placement="top">
							<i
									class="el-icon-edit el-icon"
									@click="$router.push({name: 'examineeModifyEdit', params: {examineeId: scope.row._id}})"></i>
						</el-tooltip>
						<el-tooltip content="删除" placement="top">
							<i class="el-icon-delete el-icon" @click="deleteExaminee(scope.row._id)"></i>
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
	</div>
</template>

<script>
  import api from '@/api/examinee'
  import {getSex} from "@/common/common"

  export default {
    name: "Examinee",
    data() {
      return {
        tableData: [],
        examId: this.$route.params.examId,
        getSex,
        sortedName: null,
        sortedType: null,
        pageNo: 1,
        pageSize: 10,
        total: 0,
        searchData: '',
        search: ''
      }
    },
    methods: {
      linkAdd(name) {
        this.$router.push({name})
      },
      async deleteExaminee(examineeId) {
        try {
          const res = await api.deleteExaminee({
            examineeId,
            examId: this.examId
          })
          if (res.code) {
            this.$message.success(res.msg)
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.getExamineeList()
        }
      },
      currentChange(page) {
        this.pageNo = page
        this.getExamineeList()
      },
      searchExaminee() {
        this.searchData = this.search
        this.getExamineeList()
      },
      sortChange({prop, order}) {
        this.sortedName = prop
        this.sortedType = order
        this.getExamineeList()
      },
      getScore(row) {
        const {score, isLogin} = row
        return isLogin ? score : '未登录'
      },
      async getExamineeList() {
        try {
          const {data} = await api.getExamineeList({
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
        }
      }
    },
    mounted() {
      this.getExamineeList()
    }
  }
</script>

<style scoped lang="scss">
	.examinee {
		display: flex;
		flex-direction: column;

		.search {
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
