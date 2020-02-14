<template>
	<div class="exam-analysis">
		<el-card header="试卷分析">
			<el-card header="基本信息" style="margin-top: 10px">
				<el-table :data="[{}]">
					<el-table-column label="考试名称">
						<template>{{examInfo.examName}}</template>
					</el-table-column>
					<el-table-column label="应考人数">
						<template>{{examinee.length}}</template>
					</el-table-column>
					<el-table-column label="实考人数">
						<template>{{isLoginExaminee.length}}</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card style="margin-top: 10px" header="各部分得分">
				<el-table :data="[{}, {}, {}]">
					<el-table-column label="题型">
						<template slot-scope="scope">
							<template v-if="scope.$index === 0">最高分</template>
							<template v-if="scope.$index === 1">最低分</template>
							<template v-if="scope.$index === 2">平均分</template>
						</template>
					</el-table-column>
					<el-table-column label="判断题">
						<template slot-scope="scope">
							<template v-if="scope.$index === 0">{{Math.max(isLoginExaminee.map(item=>item.tfScore))}}</template>
							<template v-if="scope.$index === 1">{{Math.min(isLoginExaminee.map(item=>item.tfScore))}}</template>
							<template v-if="scope.$index === 2">
								{{avg(isLoginExaminee.map(item=>item.tfScore))}}
							</template>
						</template>
					</el-table-column>
					<el-table-column label="选择题">
						<template slot-scope="scope">
							<template v-if="scope.$index === 0">{{Math.max(isLoginExaminee.map(item=>item.selectScore))}}</template>
							<template v-if="scope.$index === 1">{{Math.min(isLoginExaminee.map(item=>item.selectScore))}}</template>
							<template v-if="scope.$index === 2">
								{{avg(isLoginExaminee.map(item=>item.selectScore))}}
							</template>
						</template>
					</el-table-column>
					<el-table-column label="程序填空题">
						<template slot-scope="scope">
							<template v-if="scope.$index === 0">{{Math.max(isLoginExaminee.map(item=>item.gapScore))}}</template>
							<template v-if="scope.$index === 1">{{Math.min(isLoginExaminee.map(item=>item.gapScore))}}</template>
							<template v-if="scope.$index === 2">
								{{avg(isLoginExaminee.map(item=>item.gapScore))}}
							</template>
						</template>
					</el-table-column>
					<el-table-column label="程序设计题">
						<template slot-scope="scope">
							<template v-if="scope.$index === 0">{{Math.max(isLoginExaminee.map(item=>item.programScore))}}</template>
							<template v-if="scope.$index === 1">{{Math.min(isLoginExaminee.map(item=>item.programScore))}}</template>
							<template v-if="scope.$index === 2">
								{{avg(isLoginExaminee.map(item=>item.programScore))}}
							</template>
						</template>
					</el-table-column>
					<el-table-column label="总成绩">
						<template slot-scope="scope">
							<template v-if="scope.$index === 0">{{Math.max(isLoginExaminee.map(item=>(item.programScore + item.tfScore
								+item.selectScore + item.gapScore)))}}
							</template>
							<template v-if="scope.$index === 1">{{Math.min(isLoginExaminee.map(item=>(item.programScore + item.tfScore
								+item.selectScore + item.gapScore)))}}
							</template>
							<template v-if="scope.$index === 2">
								{{avg(isLoginExaminee.map(item=>(item.programScore + item.tfScore
								+item.selectScore + item.gapScore)))}}
							</template>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card header="各分数段人数" style="margin-top: 10px">
				<el-table :data="[{}]">
					<el-table-column label="分数段">
						<template>人数</template>
					</el-table-column>
					<el-table-column label="0~9">
						<template>{{scoreNum(0,9)}}
						</template>
					</el-table-column>
					<el-table-column label="10~19">
						<template>{{scoreNum(10,19)}}
						</template>
					</el-table-column>
					<el-table-column label="20~29">
						<template>{{scoreNum(20,29)}}
						</template>
					</el-table-column>
					<el-table-column label="30~39">
						<template>{{scoreNum(30,39)}}
						</template>
					</el-table-column>
					<el-table-column label="40~49">
						<template>{{scoreNum(40,49)}}
						</template>
					</el-table-column>
					<el-table-column label="50~59">
						<template>{{scoreNum(50,59)}}
						</template>
					</el-table-column>
					<el-table-column label="60~69">
						<template>{{scoreNum(60,69)}}
						</template>
					</el-table-column>
					<el-table-column label="70~79">
						<template>{{scoreNum(70,79)}}
						</template>
					</el-table-column>
					<el-table-column label="80~89">
						<template>{{scoreNum(80,89)}}
						</template>
					</el-table-column>
					<el-table-column label="90及以上">
						<template>{{scoreNum(90,1000000)}}
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card header="缺席人数" style="margin-top: 10px">
				<el-table :data="notLoginExaminee">
					<el-table-column label="账号" prop="username">
					</el-table-column>
					<el-table-column label="学号" prop="studentId">
					</el-table-column>
					<el-table-column label="姓名" prop="name">
					</el-table-column>
					<el-table-column label="性别" prop="sex">
						<template slot-scope="scope">
							{{scope.row.sex === 1 ? '男': '女'}}
						</template>
					</el-table-column>
					<el-table-column label="学校" prop="school">
					</el-table-column>
					<el-table-column label="学院" prop="college">
					</el-table-column>
					<el-table-column label="专业" prop="major">
					</el-table-column>
				</el-table>
			</el-card>
		</el-card>
	</div>
</template>

<script>
  import api from '@/api/exam'

  export default {
    name: 'ExamAnalysis',
    data() {
      return {
        examId: this.$route.params.examId,
        examInfo: {},
        examinee: [],
        notLoginExaminee: [],
        isLoginExaminee: []
      }
    },
    methods: {
      async examAnalysis() {
        try {
          const {data: {examInfo, examinee}} = await api.examAnalysis({examId: this.examId})
          this.examInfo = examInfo
          this.examinee = examinee
          this.notLoginExaminee = examinee.filter(item => !item.isLogin)
          this.isLoginExaminee = examinee.filter(item => item.isLogin)
        } catch (e) {
          console.error(e)
        }
      },
      avg(numArray) {
        let sum = 0
        for (const item of numArray) {
          sum += item
        }
        return sum / numArray.length
      },
      scoreNum(min, max) {
        return this.isLoginExaminee.filter(item => ((item.programScore + item.tfScore
          + item.selectScore + item.gapScore) >= min && ((item.programScore + item.tfScore
          + item.selectScore + item.gapScore) <= max))).length
      }
    },
    mounted() {
      this.examAnalysis()
    }
  }
</script>

<style scoped>

</style>
