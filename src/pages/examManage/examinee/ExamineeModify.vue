<template>
	<div class="examinee-modify">
		<el-card :header="`单个考生${isAdd?'添加': '修改'}`">
			<el-form
					v-loading="loading" ref="form" :model="form" style="width: 500px;" label-position="right"
					label-width="100px" :rules="rules">
				<el-form-item label="学校" prop="school">
					<el-input v-model="form.school"></el-input>
				</el-form-item>
				<el-form-item label="学院" prop="college">
					<el-input v-model="form.college"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="major">
					<el-input v-model="form.major"></el-input>
				</el-form-item>
				<el-form-item label="班级" prop="className">
					<el-input v-model="form.className"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="username">
					<el-input v-model="form.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="form.sex" style="width: 100%;">
						<el-option :value="1" label="男"></el-option>
						<el-option :value="0" label="女"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学号" prop="studentId">
					<el-input v-model="form.studentId"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="notes">
					<el-input type="textarea" v-model="form.notes"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submit">保存</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
  import api from '@/api/examinee'

  export default {
    name: "ExamineeModify",
    data() {
      return {
        form: {
          school: '',
          college: '',
          major: '',
          className: '',
          username: '',
          password: '',
          name: '',
          sex: 1,
          studentId: '',
          notes: '',
          classId: ''
        },
        isAdd: this.$route.name === 'examineeModifyAdd',
        rules: {
          school: [
            {required: true, message: '请添加学校', trigger: 'blur'}
          ],
          college: [
            {required: true, message: '请添加学院', trigger: 'blur'}
          ],
          major: [
            {required: true, message: '请添加专业', trigger: 'blur'}
          ],
          className: [
            {required: true, message: '请添加班级', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请添加用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请添加密码', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请添加姓名', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请添加性别', trigger: 'blur'}
          ],
          studentId: [
            {required: true, message: '请添加学号', trigger: 'blur'}
          ]
        },
        loading: false,
        examId: this.$route.params.examId,
        examineeId: this.$route.params.examineeId || ''
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.examineeModify()
          }
        })
      },
      async getExamineeInfo() {
        try {
          const {data} = await api.getExamineeInfo({
            examId: this.examId,
            examineeId: this.examineeId
          })
          for (const key in this.form) {
            this.form[key] = data[key]
          }
        } catch (e) {
          console.error(e)
        }
      },
      async examineeModify() {
        this.loading = true;
        try {
          const res = await api.examineeModify({
            ...this.form,
            examId: this.examId,
            isAdd: this.isAdd,
            examineeId: this.examineeId
          })
          if (res.code) {
            this.$message.success(res.msg)
            this.$router.push({name: 'examinee'}).catch(e => e)
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    },
    mounted() {
      !this.isAdd && this.getExamineeInfo()
    }
  }
</script>

<style scoped lang="scss">
	.examinee-modify {
		/deep/ .el-card__body {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
