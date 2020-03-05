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
			<el-card header="一、判断题" style="margin-top: 10px">
				<el-table :data="examTFTopic">
					<el-table-column label="题目编号" width="100px">
						<template slot-scope="scope">
							判断题-{{scope.$index + 1}}
						</template>
					</el-table-column>
					<el-table-column label="正确率">
						<template slot-scope="scope">
							<div style="display: flex">
								<el-progress
									style="flex: 1"
									show-text
									:text-inside="true" :stroke-width="26"
									:percentage="tfTrueNum(scope.row.answer)">
								</el-progress>
								<span style="display: inline-block;width: 80px; flex: 0 0 auto; text-align: center">{{scope.row.answer.filter(item=>item.result).length}}/{{scope.row.answer.length}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="作答分布" width="100px">
						<template slot-scope="scope">
							未作答：{{examinee.length-scope.row.answer.length}}
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card header="二、选择题" style="margin-top: 10px">
				<el-table :data="examSelectTopic">
					<el-table-column label="题目编号" width="100px">
						<template slot-scope="scope">
							选择题-{{scope.$index + 1}}
						</template>
					</el-table-column>
					<el-table-column label="正确率">
						<template slot-scope="scope">
							<div style="display: flex">
								<el-progress
									style="flex: 1"
									show-text
									:text-inside="true" :stroke-width="26"
									:percentage="tfTrueNum(scope.row.answer)">
								</el-progress>
								<span style="display: inline-block;width: 80px; flex: 0 0 auto; text-align: center">{{scope.row.answer.filter(item=>item.result).length}}/{{scope.row.answer.length}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="作答分布" width="250px">
						<template slot-scope="scope">
							<span v-for="(item,index) in scope.row.options" :key="index">
								{{String.fromCharCode(index + 65)}}:{{scope.row.answer.filter(item=>item.answer === String.fromCharCode(index + 65)).length}}
							</span>
							未作答：{{examinee.length-scope.row.answer.length}}
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card header="三、程序填空题" style="margin-top: 10px">
				<el-table :data="examGapTopic">
					<el-table-column label="题目编号" width="120px">
						<template slot-scope="scope">
							程序填空题-{{scope.$index + 1}}
						</template>
					</el-table-column>
					<el-table-column label="空格编号" width="100px">
						<template slot-scope="scope">
							<div class="analysis-gap" v-for="(item,index) in scope.row.gaps" :key="index">
								空格{{index + 1}}
							</div>
						</template>
					</el-table-column>
					<el-table-column label="正确率">
						<template slot-scope="scope">
							<div class="analysis-gap" v-for="(item,index) in scope.row.gaps" :key="index" style="display: flex">
								<el-progress
									style="flex: 1"
									show-text
									:text-inside="true" :stroke-width="26"
									:percentage="gapTrueNum(scope.row.answer, index)">
								</el-progress>
								<span style="display: inline-block;width: 130px; flex: 0 0 auto; text-align: center">{{scope.row.answer.filter(item=> item.result[index]).length}}/{{scope.row.answer.length}}未作答：{{examinee.length-scope.row.answer.length}}</span>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card header="四、程序设计题" style="margin-top: 10px">
				<el-table :data="examProgramTopic">
					<el-table-column label="题目编号" width="120px">
						<template slot-scope="scope">
							程序设计题-{{scope.$index + 1}}
						</template>
					</el-table-column>
					<el-table-column label="空格编号" width="100px">
						<template slot-scope="scope">
							<div class="analysis-gap" v-for="(item,index) in scope.row.answer[0].status" :key="index">
								测试数据{{index + 1}}
							</div>
						</template>
					</el-table-column>
					<el-table-column label="正确率">
						<template slot-scope="scope">
							<div
								class="analysis-gap" v-for="(item,index) in scope.row.answer[0].status" :key="index"
								style="display: flex">
								<el-progress
									style="flex: 1"
									show-text
									:text-inside="true" :stroke-width="26"
									:percentage="programTrueNum(scope.row.answer, index)">
								</el-progress>
								<span style="display: inline-block;width: 130px; flex: 0 0 auto; text-align: center">{{scope.row.answer.filter(item => item.status[index].status === 'Accepted' || item.status[index].status === 'Presentation Error').length}}/{{scope.row.answer.length}}未作答：{{examinee.length-scope.row.answer.length}}</span>
							</div>
						</template>
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
        isLoginExaminee: [],
        examTFTopic: [],
        examSelectTopic: [],
        examGapTopic: [],
        examProgramTopic: []
      }
    },
    methods: {
      async examAnalysis() {
        try {
          const {data: {examInfo, examinee, examTFTopic, examSelectTopic, examGapTopic, examProgramTopic}} = await api.examAnalysis({examId: this.examId})
          this.examInfo = examInfo
          this.examinee = examinee
          this.notLoginExaminee = examinee.filter(item => !item.isLogin)
          this.isLoginExaminee = examinee.filter(item => item.isLogin)
          this.examTFTopic = examTFTopic
          this.examSelectTopic = examSelectTopic
          this.examGapTopic = examGapTopic
          this.examProgramTopic = examProgramTopic
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
      tfTrueNum(answer) {
        const num = answer.filter(item => item.result).length
        if (num === 0) return 0
        return num * 100 / answer.length
      },
      scoreNum(min, max) {
        return this.isLoginExaminee.filter(item => ((item.programScore + item.tfScore
          + item.selectScore + item.gapScore) >= min && ((item.programScore + item.tfScore
          + item.selectScore + item.gapScore) <= max))).length
      },
      gapTrueNum(answer, index) {
        const num = answer.filter(item => item.result[index]).length
        if (num === 0) return 0
        return num * 100 / answer.length
      },
      programTrueNum(answer, index) {
        const num = answer.filter(item => item.status[index].status === 'Accepted' || item.status[index].status === 'Presentation Error').length
        if (num === 0) return 0
        return num * 100 / answer.length
      }
    },
    mounted() {
      this.examAnalysis()
    }
  }
</script>

<style scoped lang="scss">
	.analysis-gap {
		height: 30px;
		align-items: center;
		display: flex;
	}
</style>
