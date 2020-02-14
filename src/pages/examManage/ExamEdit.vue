<template>
	<div class="exam-edit">
		<el-card class="exam-form">
			<el-form label-width="100px" label-position="right" :model="examForm" ref="examForm" :rules="examRule">
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
		</el-card>
		<el-card class="exam-topic">
			<el-table :data="examTopic">
				<el-table-column label="题型" align="center">
					<template slot-scope="scope">
						<span
								style="cursor: pointer;color: cornflowerblue"
								@click="$router.push({name: scope.row.routeName, params: {examId}})">{{scope.row.topicName}}</span>
					</template>
				</el-table-column>
				<el-table-column label="数量" prop="num" align="center"></el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
  import api from '@/api/exam'
  import examTopic from '@/api/examTopic'
  import moment from 'moment'

  export default {
    name: 'ExamEdit',
    data() {
      return {
        examForm: {
          examName: '',
          isShow: false,
          startTime: new Date(),
          finishDate: 0,
          finishHour: 0,
          finishMinute: 0,
          language: 0,
          isExam: 0,
          isSort: 0,
          note: ''
        },
        examRule: {
          examName: [
            {required: true, message: '请填写考试名称', trigger: 'blur'}
          ]
        },
        examTopic: [
          {
            topicType: 'tfTopic',
            topicName: '判断题',
            routeName: 'examTFTopic',
            num: 0
          },
          {
            topicType: 'selectTopic',
            topicName: '选择题',
            routeName: 'examSelectTopic',
            num: 0
          },
          {
            topicType: 'gapTopic',
            topicName: '程序填空题',
            routeName: 'examGapTopic',
            num: 0
          },
          {
            topicType: 'programTopic',
            topicName: '程序设计题',
            routeName: 'examProgramTopic',
            num: 0
          }
        ],
        examId: this.$route.params.examId
      }
    },
    methods: {
      submit() {
        this.$refs.examForm.validate(valid => {
          if (valid) {
            this.examEdit()
          }
        })
      },
      resetForm() {
        this.getExamInfo()
      },
      async getExamTopicNum() {
        try {
          const {data} = await examTopic.getExamTopicNum({examId: this.examId})
          for (const item of this.examTopic) {
            item.num = data[item.topicType]
          }
        } catch (e) {
          console.error(e)
        }
      },
      async examEdit() {
        try {
          const finishTime = moment(this.examForm.startTime).add({
            days: this.examForm.finishDate,
            hours: this.examForm.finishHour,
            minutes: this.examForm.finishMinute
          })

          const res = await api.examEdit({
            ...this.examForm,
            finishTime,
            examId: this.examId
          })
          if (res.code) {
            this.$message.success(res.msg)
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.resetForm()
        }
      },
      async getExamInfo() {
        try {
          const {data} = await api.getExamInfo({
            examId: this.examId
          })
          for (const key in this.examForm) {
            if (data[key]) {
              this.examForm[key] = data[key]
            }
          }
          const dura = moment(data.finishTime).format('x') - moment(data.startTime).format('x')
          const tempTime = moment.duration(dura)
          this.examForm.finishDate = tempTime.days()
          this.examForm.finishHour = tempTime.hours()
          this.examForm.finishMinute = tempTime.minutes()
        } catch (e) {
          console.error(e)
        }
      }
    },
    mounted() {
      this.getExamInfo()
      this.getExamTopicNum()
    }
  }
</script>

<style scoped lang="scss">
	.exam-edit {
		display: flex;

		.exam-form {
			flex: 1 1 60%;
			margin-right: 50px;
		}

		.exam-topic {
			flex: 1 1 40%;
			margin: 0 50px;
			height: 400px;
		}
	}
</style>
