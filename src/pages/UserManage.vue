<template>
	<div class="user-manage">
		<page-title title="用户管理">
			<template slot="description">
				<div class="add-search">
					<el-input clearable @clear="searchUser" placeholder="搜索用户" v-model="search"
										@keydown.enter.native="searchUser">
						<i slot="prefix" @click="searchUser" class="el-input__icon el-icon-search"></i>
					</el-input>
					<el-tooltip class="item" effect="dark" content="添加用户" placement="top">
						<el-button type="primary" icon="el-icon-plus" circle @click="linkAdd"></el-button>
					</el-tooltip>
				</div>
			</template>
		</page-title>
		<el-table style="width: 90%;margin-top: 30px;" :data="tableData" max-height="400px">
			<el-table-column label="用户名" prop="username"></el-table-column>
			<el-table-column label="姓名" prop="trueName"></el-table-column>
			<el-table-column label="学校" prop="school"></el-table-column>
			<el-table-column label="性别" prop="sex">
				<template slot-scope="scope">{{scope.row.sex===1 ? '男': '女'}}</template>
			</el-table-column>
			<el-table-column label="邮箱" prop="email"></el-table-column>
			<el-table-column label="创建时间" prop="createTime">
				<template slot-scope="scope">{{moment(new Date(scope.row.createTime)).format('YYYY年MM月DD日 HH:mm:ss')}}
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope" v-if="!scope.row.isAdmin">
					<el-tooltip content="修改" placement="top">
						<i class="el-icon-edit el-icon" @click="modifyUser(scope.row._id)"></i>
					</el-tooltip>
					<el-tooltip content="删除" placement="top">
						<i class="el-icon-delete el-icon" @click="deleteUser(scope.row._id)"></i>
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
		<el-dialog :title="`${editable? '修改':'添加'}用户`" :visible.sync="visible">
			<el-form :model="form" ref="form" label-width="100px" :rules="rules">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="form.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="trueName">
					<el-input v-model="form.trueName"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="form.sex">
						<el-option label="男" :value="1"></el-option>
						<el-option label="女" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学校" prop="school">
					<el-input v-model="form.school"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email"></el-input>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button type="primary" @click="submit">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
  import PageTitle from '@/components/PageTitle'
  import api from '@/api/account'
  import moment from 'moment'
  import { JSEncrypt } from 'jsencrypt'

  export default {
    name: 'user-manage',
    components: {PageTitle},
    data() {
      return {
        search: '',
        tableData: [],
        total: 0,
        pageNo: 1,
        pageSize: 20,
        searchData: '',
        visible: false,
        editable: false,
        userId: '',
				publicKey: '',
        form: {
          username: '',
          password: '',
          trueName: '',
          sex: 1,
          school: '',
          email: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          trueName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请输入性别', trigger: 'blur'}
          ],
          school: [
            {required: true, message: '请输入学校', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
          ],
        }
      }
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      linkAdd() {
        for (const index in this.form) {
          this.form[index] = ''
        }
        this.form.sex = 1
        this.visible = true
        this.editable = false
      },
			async getPublicKey() {
				try {
					const {data} = await api.getPublicKey()
					this.publicKey = data
					this.addUser()
				} catch (e) {
					console.error(e)
					this.loading = false
				}
			},
      async modifyUser(id) {
        try {
          for (const index in this.form) {
            this.form[index] = ''
          }
          this.form.sex = 1
          const {data} = await api.getUserInfo({userId: id})
          for (const index in this.form) {
            this.form[index] = data[index]
          }
          this.userId = id
          this.editable = true
          this.visible = true
        } catch (e) {
          console.error(e)
        }
      },
      moment,
      currentChange(page) {
        this.pageNo = page
        this.getUserList()
      },
      async addUser() {
        if (!this.publicKey) {
          return this.$message.error('系统异常')
        }
        try {
          const encrypt = new JSEncrypt()
          encrypt.setPublicKey(this.publicKey);
          const res = await api.addUser({
            ...this.form,
            editable: this.editable,
            password: encrypt.encrypt(this.form.password),
            userId: this.userId,
						publicKey: this.publicKey
          })
          this.$message.success(res.msg)
          this.getUserList()
          this.visible = false
        } catch (e) {
          console.error(e)
        }
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.getPublicKey()
          }
        })
      },
      async deleteUser(id) {
        try {
          const res = await api.deleteUser({
            userId: id
          })
          if (res.code) {
            this.$message.success('删除成功')
            this.search = ''
            this.getUserList()
          }
        } catch (e) {
          console.error(e)
        }
      },
      searchUser() {
        this.searchData = this.search
        this.getUserList()
      },
      async getUserList() {
        try {
          const {data} = await api.getUserList({
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
	.user-manage {
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
