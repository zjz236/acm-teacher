<template>
	<div class="add-exam">
		<page-title title="添加考试"></page-title>
		<div class="exam-form">
			<el-form :model="examForm" ref="examForm" label-position="right" label-width="100px" :rules="examRule">
				<el-form-item label="考试名称">
					<el-col :span="21">
						<el-form-item prop="examName">
							<el-input v-model="examForm.examName"></el-input>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="是否可见">
					<el-col :span="21">
						<el-form-item prop="isShow">
							<el-switch
									v-model="examForm.isShow">
							</el-switch>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="开始时间">
					<el-col :span="21">
						<el-form-item prop="startTime">
							<el-date-picker
									v-model="examForm.startTime"
									type="datetime"
									placeholder="选择日期时间">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="结束时间">
					<el-col :span="6">
						<el-form-item prop="finishDate">
							<el-select v-model="examForm.finishDate">
								<el-option v-for="item in 30" :key="item" :value="item" :label="item"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="line" :span="1.5">天</el-col>
					<el-col :span="6">
						<el-form-item prop="finishHour">
							<el-select v-model="examForm.finishHour">
								<el-option v-for="item in 23" :key="item" :value="item" :label="item"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="line" :span="1.5">时</el-col>
					<el-col :span="6">
						<el-form-item prop="finishMinute">
							<el-select v-model="examForm.finishMinute">
								<el-option v-for="item in 59" :key="item" :value="item" :label="item"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="line" :span="1.5">分</el-col>
				</el-form-item>
				<el-form-item label="语言">
					<el-col :span="21">
						<el-form-item prop="language">
							<el-select v-model="examForm.language">
								<el-option value="c" label="C语言"></el-option>
								<el-option value="cpp" label="C++"></el-option>
								<el-option value="java" label="Java"></el-option>
								<el-option value="python" label="Python"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="类型">
					<el-col :span="21">
						<el-form-item prop="isExam">
							<el-select v-model="examForm.isExam">
								<el-option :value="0" label="练习"></el-option>
								<el-option :value="1" label="考试"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="排名类型">
					<el-col :span="21">
						<el-form-item prop="isSort">
							<el-select v-model="examForm.isSort">
								<el-option :value="0" label="排名不可见"></el-option>
								<el-option :value="1" label="可见前50%排名"></el-option>
								<el-option :value="2" label="排名可见"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="备注">
					<el-col :span="21">
						<el-form-item prop="note">
							<el-input
									v-model="examForm.note"
									type="textarea"
									:autosize="{ minRows: 2, maxRows: 4}"></el-input>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item>
					<el-col :span="11">
						<el-button @click="resetForm">重置</el-button>
					</el-col>
					<el-col :span="11">
						<el-button type="primary" @click="submit">提交</el-button>
					</el-col>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
  import PageTitle from '@/components/PageTitle'
  import api from '@/api/exam'
  import moment from 'moment'

  export default {
    name: "AddExam",
    components: {PageTitle},
    data() {
      return {
        examForm: {
          examName: '',
          isShow: false,
          startTime: new Date(),
          finishDate: 0,
          finishHour: 0,
          finishMinute: 0,
          language: 'c',
          isExam: 0,
          isSort: 0,
          note: ''
        },
        examRule: {
          examName: [
            {required: true, message: '请填写考试名称', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs.examForm.validate(valid => {
          if (valid) {
            this.addExam()
          }
        })
      },
      async addExam() {
        try {
          const finishTime = moment(this.examForm.startTime).add({
            days: this.examForm.finishDate,
            hours: this.examForm.finishHour,
            minutes: this.examForm.finishMinute
          })
          const res = await api.addExam({
            ...this.examForm,
						finishTime
          })
          if (res.code === 1) {
            this.$message.success('添加成功')
          }
        } catch (e) {
          console.error(e)
        } finally {
					this.resetForm()
        }
      },
			resetForm () {
        this.$refs.examForm.resetFields()
			}
    }
  }
</script>

<style lang="scss" scoped>
	.add-exam {
		.exam-form {
			width: 500px;
			margin: 0 auto;

			.el-select {
				width: 100%;
			}

			.el-input {
				width: 100%;
			}
		}
	}
</style>
