<template>
	<div class="program-test">
		<el-dialog :visible.sync="visible" v-loading="loading" :close-on-click-modal="false" :title="`测试样例（${count}/5）`">
			<el-table :data="testData">
				<el-table-column label="输入样例" align="center">
					<template slot-scope="scope">
						<el-upload
								v-if="!scope.row.inputFile" :show-file-list="false" :disabled="!scope.row.outputFile ||disabled"
								:headers="headers"
								name="inputFile"
								:on-success="uploadRes"
								accept=".in"
								:action="baseUrl+'/oj/testData/uploadProgramTest'"
								:data="{programId, programType, testId: scope.row._id}">
							<i class="el-icon-upload test-icon"></i>
						</el-upload>
						<i @click="downloadTest(scope.row.inputFile)" v-else class="el-icon-s-order test-icon"></i>
					</template>
				</el-table-column>
				<el-table-column label="输出样例" align="center">
					<template slot-scope="scope">
						<el-upload
								v-if="!scope.row.outputFile" :show-file-list="false" :headers="headers" name="outputFile"
								:action="baseUrl+'/oj/testData/uploadProgramTest'"
								accept=".out"
								:disabled="disabled"
								:on-success="uploadRes"
								:data="{programId, programType, testId: scope.row._id}">
							<i class="el-icon-upload test-icon"></i>
						</el-upload>
						<i @click="downloadTest(scope.row.outputFile)" v-else class="el-icon-s-order test-icon"></i>
					</template>
				</el-table-column>
				<el-table-column label="检测结果">
					<template slot-scope="scope">
						{{!scope.row.status ? '未检测' : scope.row.status}}
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<i
								v-if="(scope.row.inputFile || scope.row.outputFile) && !disabled" class="el-icon-delete test-icon"
								@click="deleteProgramTest(scope.row._id)"></i>
					</template>
				</el-table-column>
			</el-table>
			<div class="code">
				<el-select v-model="language" size="mini" class="select-language">
					<el-option value="c" label="C"></el-option>
					<el-option value="cpp" label="C++"></el-option>
					<el-option value="java" label="Java"></el-option>
					<el-option value="python" label="Python"></el-option>
				</el-select>
				<ace-editor :height="292" theme="tomorrow_night_bright" :lang="languageSet" v-model="code"></ace-editor>
			</div>
			<div class="tip">
				请先上传输出样例，再上传输入样例
			</div>
			<template slot="footer">
				<el-button type="primary" @click="programTest">样例测试</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
  import {getCookie} from '@/common/cookieUtil'
  import api from '@/api/testData'
  import AceEditor from '@/components/AceEditor'

  export default {
    name: 'ProgramTest',
    components: {AceEditor},
    props: {
      value: {
        type: Boolean,
        default: false
      },
      programId: {
        type: String,
        default: ''
      },
      programType: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      languageSet() {
        if (['c', 'cpp'].indexOf(this.language) >= 0) {
          return 'c_cpp'
        } else if (this.language === 'java') {
          return 'java'
        } else {
          return 'python'
        }
      },
    },
    data() {
      return {
        visible: this.value,
        baseUrl: process.env.VUE_APP_URL,
        headers: {
          cookies: `token=${getCookie('token') || ''}`
        },
        loading: true,
        code: '',
        count: 0,
        language: 'c',
        testData: [
          {
            _id: '',
            inputFile: null,
            outputFile: null,
            status: null
          },
          {
            _id: '',
            inputFile: null,
            outputFile: null,
            status: null
          },
          {
            _id: '',
            inputFile: null,
            outputFile: null,
            status: null
          },
          {
            _id: '',
            inputFile: null,
            outputFile: null,
            status: null
          },
          {
            _id: '',
            inputFile: null,
            outputFile: null,
            status: null
          }
        ]
      }
    },
    methods: {
      downloadTest(filename) {
        if (this.disabled) return
        window.location.href = this.baseUrl + '/public/' + filename
      },
      uploadRes(responce) {
        if (responce.code) {
          this.getProgramTest()
        } else {
          this.$message.error(responce.msg)
        }
      },
      async deleteProgramTest(testId) {
        try {
          const result = await api.deleteProgramTest({
            programType: this.programType,
            testId
          })
          if (result.code) {
            this.$message.success('删除成功')
            this.getProgramTest()
          }
        } catch (e) {
          console.error(e)
        }
      },
      async programTest() {
        if (!this.code) {
          return this.$message.error('请先输入代码')
        }
        this.loading = true
        try {
          await api.programTest({
            code: this.code,
            language: this.language,
            programId: this.programId,
            programType: this.programType
          })
          this.getProgramTest()
        } catch (e) {
          console.error(e)
        }
      },
      async getProgramTest() {
        try {
          const {data} = await api.getProgramTest({
            programId: this.programId,
            programType: this.programType
          })
          this.count = data.length
          const testData = []
          for (const index in this.testData) {
            if (data[index]) {
              testData.push({
								_id: data[index]._id || '',
                inputFile: data[index].inputFile || null,
                outputFile: data[index].outputFile || null,
                status: data[index].status || null
							})
            } else {
              testData.push({
                _id: '',
                inputFile: null,
                outputFile: null,
                status: null
              })
            }
          }
          this.testData = testData
          if (data.map(item => item.status)
            .indexOf('Queuing') >= 0 || data.map(item => item.status)
            .indexOf('Running') >= 0) {
            this.loading = true
            setTimeout(() => this.getProgramTest(), 500)
          } else {
            this.loading = false
          }
        } catch (e) {
          console.error(e)
        }
      }
    },
    watch: {
      visible(val) {
        this.$emit('input', val)
      },
      value(val) {
        if (val === true) {
          this.getProgramTest()
        }
        this.visible = val
      }
    }
  }
</script>

<style scoped lang="scss">
	.program-test {
		/deep/ .el-dialog__body {
			display: flex;
			flex-wrap: wrap;

			.code {
				flex: 1 1 50%;
				display: flex;
				position: relative;

				.select-language {
					position: absolute;
					right: 0;
					top: 0;
					z-index: 10;
					width: 100px;
				}
			}

			.el-table {
				flex: 1 1 50%;
			}
		}

		.test-icon {
			font-size: 20px;
			cursor: pointer;
		}

		.tip {
			color: #909399;
			font-size: 10px;
			line-height: 30px;
		}
	}
</style>
