<template>
	<div class="classes">
		<page-title title="我的班级">
			<template slot="description">
				<div class="add-search">
					<el-input clearable @clear="searchClass" placeholder="搜索班级" v-model="search"
										@keydown.enter.native="searchClass">
						<i slot="prefix" @click="searchClass" class="el-input__icon el-icon-search"></i>
					</el-input>
					<el-tooltip class="item" effect="dark" content="添加班级" placement="top">
						<el-button type="primary" icon="el-icon-plus" circle @click="linkAdd"></el-button>
					</el-tooltip>
				</div>
			</template>
		</page-title>
		<el-table style="width: 90%;margin-top: 30px;" :data="tableData">
			<el-table-column label="学校" prop="school"></el-table-column>
			<el-table-column label="学院" prop="college"></el-table-column>
			<el-table-column label="专业" prop="major"></el-table-column>
			<el-table-column label="班级" prop="className"></el-table-column>
			<el-table-column label="学生人数" prop="studentNum"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-tooltip content="修改" placement="top">
						<i class="el-icon-edit el-icon" @click="modifyClass(scope.row._id)"></i>
					</el-tooltip>
					<el-tooltip content="删除" placement="top">
						<i class="el-icon-delete el-icon" @click="deleteClass(scope.row._id)"></i>
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
					:total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
  import PageTitle from '@/components/PageTitle'
  import api from '@/api/classes'

  export default {
    name: "classes",
    components: {PageTitle},
    data() {
      return {
        search: '',
        tableData: [],
        total: 0,
        pageNo: 1,
        pageSize: 20,
        searchData: ''
      }
    },
    mounted() {
      this.getClassList()
    },
    methods: {
      linkAdd() {
        this.$router.push({name: 'addClasses'})
      },
      modifyClass(id) {
        this.$router.push({name: 'editClasses', params: {id}})
      },
      currentChange(page) {
        this.pageNo = page
        this.getClassList()
      },
      async deleteClass(id) {
        try {
          const res = await api.deleteClass({
            classId: id
          })
          if (res.code) {
            this.$message.success(res.msg)
            this.search = ''
            this.getClassList()
          }
        } catch (e) {
          console.error(e)
        }
      },
      searchClass() {
        this.searchData = this.search
				this.getClassList()
      },
      async getClassList() {
        try {
          const {data} = await api.getClassList({
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            search: this.searchData
          })
          this.tableData = data.list
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
	.classes {
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
