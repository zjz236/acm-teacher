<template>
	<div class="exam-reader">
		<el-card header="试卷预览">
			<el-card header="试卷信息">
				<el-table :data="[{}]">
					<el-table-column label="试卷名称">
						<template>
							{{examInfo.examName}}
						</template>
					</el-table-column>
					<el-table-column label="判断题">
						<template>
							{{tfTopic.length>0 ? tfTopic.length*2 :'--'}}
						</template>
					</el-table-column>
					<el-table-column label="选择题">
						<template>
							{{selectTopic.length>0 ? selectTopic.length*2 :'--'}}
						</template>
					</el-table-column>
					<el-table-column label="程序填空题">
						<template>
							{{gapTopic.length>0 ? gapScore :'--'}}
						</template>
					</el-table-column>
					<el-table-column label="程序设计题">
						<template>
							{{programTopic.length>0 ? programScore :'--'}}
						</template>
					</el-table-column>
					<el-table-column label="总分数">
						<template>
							{{tfTopic.length *2
							+selectTopic.length *2 +gapScore+programScore>0 ? tfTopic.length *2
							+selectTopic.length *2 +gapScore+programScore :'--'}}
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card header="一、判断题" style="margin-top: 10px">
				<el-table :data="tfTopic">
					<el-table-column label="答案" align="center" width="100px">
						<template slot-scope="scope">
							<i class="el-icon-success" style="color: #42b983" v-if="scope.row.answer"></i>
							<i class="el-icon-error" style="color: #F56C6C" v-else></i>
							（2分）
						</template>
					</el-table-column>
					<el-table-column label="题目">
						<template slot-scope="scope">
							<div v-html="scope.row.description"></div>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card header="二、选择题" style="margin-top: 10px">
				<el-table :data="selectTopic">
					<el-table-column label="答案" align="center" width="100px">
						<template slot-scope="scope">
							{{scope.row.answer}}
							（2分）
						</template>
					</el-table-column>
					<el-table-column label="选项" align="center">
						<template slot-scope="scope">
							{{getOptions(scope.row.options)}}
						</template>
					</el-table-column>
					<el-table-column label="题目">
						<template slot-scope="scope">
							<div v-html="scope.row.description"></div>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card header="三、程序填空题" style="margin-top: 10px">
				<section v-for="(item,i) in gapTopic" :key="item._id" style="margin-top: 10px">
					<el-divider content-position="left">第{{parseInt(i)+1}}题（{{item.gaps.length * 2}}分）</el-divider>
					<div v-html="item.description"></div>
					<el-table :data="[{}]">
						<el-table-column
							v-for="(tem,index) in item.gaps" :label="`填空${parseInt(index)+1}(2分)`"
							align="center"
							:key="index">
							<template>{{tem}}</template>
						</el-table-column>
					</el-table>
					<ace-editor :lang="languageSet(examInfo.language)" :value="item.code" readonly
											theme="tomorrow_night_bright"></ace-editor>
				</section>
			</el-card>
			<el-card header="四、程序设计题" style="margin-top: 10px">
				<section v-for="(item,i) in programTopic" :key="item._id" style="margin-top: 10px">
					<el-divider content-position="left">第{{parseInt(i)+1}}题（{{item.testData.length * 10}}分）</el-divider>
					<el-divider content-position="left">题目描述</el-divider>
					<div v-html="item.description"></div>
					<el-divider content-position="left">输入描述</el-divider>
					<div v-html="item.inputDesc"></div>
					<el-divider content-position="left">输出描述</el-divider>
					<div v-html="item.outputDesc"></div>
					<el-divider content-position="left">样例输入</el-divider>
					<div>{{item.simpleInput}}</div>
					<el-divider content-position="left">样例输出</el-divider>
					<div>{{item.simpleOutput}}</div>
				</section>
			</el-card>
		</el-card>
	</div>
</template>

<script>
  import examTopic from '@/api/examTopic'
  import api from '@/api/exam'
  import AceEditor from '@/components/AceEditor'

  export default {
    name: 'ExamReader',
    components: {AceEditor},
    data() {
      return {
        examId: this.$route.params.examId,
        tfTopic: [],
        selectTopic: [],
        gapTopic: [],
        programTopic: [],
        gapScore: 0,
        programScore: 0,
        examInfo: {}
      }
    },
    methods: {
      async getAllExamTopic() {
        try {
          const {data: {tfTopic, selectTopic, gapTopic, programTopic}} = await examTopic.getAllExamTopic({examId: this.examId})
          this.tfTopic = tfTopic
          this.selectTopic = selectTopic
          this.gapTopic = gapTopic
          this.programTopic = programTopic
          for (const item of gapTopic) {
            this.gapScore += item.gaps.length * 2
          }
          for (const item of programTopic) {
            this.programScore += item.testData.length * 10
          }
        } catch (e) {
          console.error(e)
        }
      },
      languageSet(language) {
        if (['c', 'cpp'].indexOf(language) >= 0) {
          return 'c_cpp'
        } else if (language === 'java') {
          return 'java'
        } else {
          return 'python'
        }
      },
      getOptions(options) {
        const option = [...options]
        for (const index in option) {
          option[index] = String.fromCharCode(65 + parseInt(index)) + '.' + option[index]
        }
        return option.join('、')
      },
      async getExamInfo() {
        try {
          const {data} = await api.getExamInfo({
            examId: this.examId
          })
          this.examInfo = data
        } catch (e) {
          console.error(e)
        }
      }
    },
    mounted() {
      this.getAllExamTopic()
      this.getExamInfo()
    }
  }
</script>

<style scoped>

</style>
