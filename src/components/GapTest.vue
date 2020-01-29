<template>
	<div class="gap-test">
		<el-dialog
				v-loading="loading" :close-on-click-modal="false" :visible.sync="visible"
				:title="`测试样例 (${testDataNum ? 1 : 0}/1)`">
			<el-row>
				<el-col class="icon center" :span="24">
					<el-popover title="编译错误" placement="top" trigger="hover" v-if="result === 'error'">
						<div v-html="errMsg"></div>
						<i class="el-icon-error" style="color: #ff0000" slot="reference"></i>
					</el-popover>
					<i class="el-icon-question" v-else-if="result === 'quit'"></i>
					<i class="el-icon-success" style="color: #67C23A" v-else-if="result === 'accept'"></i>
					<i class="el-icon-info" style="color: #67C23A" v-else-if="result === 'wrong'"></i>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="center">
					<p>{{information}}</p>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="center" :span="12">
					<el-tooltip :content="inputTip" placement="top">
						<el-button @click="uploadInTest" icon="el-icon-upload" :disabled="disabled">输入样例</el-button>
					</el-tooltip>
					<el-tooltip content="下载输入样例" placement="top">
						<el-button
								@click="downloadInTest('inputFile')" icon="el-icon-download"
								:disabled="!(testData&&testData.inputFile) || disabled" circle size="mini"></el-button>
					</el-tooltip>
					<input ref="inputFile" @change="inputFile" accept=".in" type="file" style="display: none;"/></el-col>
				<el-col class="center" :span="12">
					<el-tooltip :content="outputTip" placement="top">
						<el-button @click="uploadOutTest" icon="el-icon-upload" :disabled="disabled">输出样例</el-button>
					</el-tooltip>
					<el-tooltip content="下载输出样例" placement="top">
						<el-button
								@click="downloadInTest('outputFile')" icon="el-icon-download"
								:disabled="!(testData&&testData.outputFile) || disabled" circle size="mini"></el-button>
					</el-tooltip>
					<input ref="outputFile" @change="outputFile" accept=".out" type="file" style="display: none;"/></el-col>
			</el-row>
			<el-row :gutter="20" style="margin-top: 20px">
				<el-col :span="12" class="right">
					<el-popover :disabled="disabled" title="请选择测试语言" trigger="hover" :close-delay="1000">
						<el-select v-model="language">
							<el-option value="c" label="C"></el-option>
							<el-option value="cpp" label="C++"></el-option>
							<el-option value="java" label="Java"></el-option>
							<el-option value="python" label="Python"></el-option>
						</el-select>
						<el-button :disabled="disabled" type="primary" @click="gapTest" plain slot="reference">在线检测</el-button>
					</el-popover>
				</el-col>
				<el-col :span="12" class="left">
					<el-tooltip content="提交前建议先在线检测" placement="top">
						<el-button :disabled="disabled" type="primary" @click="handleSubmit">直接提交</el-button>
					</el-tooltip>
					<el-tooltip content="删除测试样例" placement="top">
						<el-button
								icon="el-icon-delete" @click="handleDelete" :disabled="!testData || disabled" circle
								size="mini"></el-button>
					</el-tooltip>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
  import api from '@/api/testData'

  export default {
    name: 'GapTest',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      code: {
        type: String,
        default: '',
        required: true
      },
      testData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      gapId: {
        type: String,
        default: ''
      },
      gapType: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      inputTip() {
        return this.input === null ? '请上传.in文件' : '已上传'
      },
      outputTip() {
        return this.output === null ? '请上传.out文件' : '已上传'
      },
      testDataNum() {
        return this.testData && this.testData._id
      },
      information() {
        switch (this.result) {
          case 'quit':
            return '等待检测。'
          case 'wrong':
            return '样例错误。'
          case 'accept':
            return '样例正确'
          case 'error':
            return '编译错误'
        }
        return ''
      }
    },
    data() {
      return {
        visible: this.value,
        input: null,
        output: null,
        language: 'c',
        result: 'quit',
        errMsg: '',
        loading: false
      }
    },
    methods: {
      uploadInTest() {
        this.$refs.inputFile.click()
      },
      handleDelete() {
        this.$emit('delete-test')
      },
      async gapTest() {
        this.loading = true
        try {
          const formdata = new FormData()
          formdata.append('gapType', this.gapType)
          formdata.append('gapId', this.gapId)
          formdata.append('code', this.code)
          formdata.append('inputFile', this.input)
          formdata.append('outputFile', this.output)
          formdata.append('language', this.language)
          const res = await api.gapTest(formdata)
          if (res.code) {
            this.gapTestStatus(res.data.id)
          }
        } catch (e) {
          console.error(e)
          this.loading = false
        }
      },
      async gapTestStatus(id) {
        this.loading = true
        try {
          const result = await new Promise(async (resolve, reject) => {
            let time = null
            time = setInterval(async () => {
              try {
                const {data} = await api.gapTestStatus({id})
                if (data.status === 1) {
                  resolve(data)
                  clearInterval(time)
                }
              } catch (e) {
                reject(e)
                clearInterval(time)
              }
            }, 500)
          })
          if (result.err) {
            this.result = 'error'
            this.errMsg = result.err
          } else {
            if (result.result === 0) {
              this.result = 'wrong'
            } else {
              this.result = 'accept'
            }
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }

      },
      handleSubmit() {
        try {
          const formdata = new FormData()
          formdata.append('inputFile', this.input)
          formdata.append('outputFile', this.output)
          formdata.append('status', this.result)
          formdata.append('errMsg', this.errMsg)
          this.$emit('on-submit', formdata)
        } catch (e) {
          console.error(e)
        }

      },
      inputFile() {
        this.result = 'quit'
        if (!this.$refs.inputFile.files[0]) {
          return
        }
        const file = this.$refs.inputFile.files[0]
        const fileName = file.name.split('.')
        if (fileName[fileName.length - 1] !== 'in') {
          this.$message.error('请上传.in文件')
          this.$refs.inputFile.value = ''
          return
        }
        this.input = file
      },
      uploadOutTest() {
        this.$refs.outputFile.click()
      },
      outputFile() {
        this.result = 'quit'
        if (!this.$refs.outputFile.files[0]) {
          return
        }
        const file = this.$refs.outputFile.files[0]
        const fileName = file.name.split('.')
        if (fileName[fileName.length - 1] !== 'out') {
          this.$message.error('请上传.in文件')
          this.$refs.outputFile.value = ''
          return
        }
        this.output = file
      },
      downloadInTest(file) {
        window.location.href = this.ossUrl + this.testData[file]
      }
    },
    watch: {
      visible(val) {
        this.$emit('input', val)
      },
      value(val) {
        this.visible = val
      },
      testData: {
        deep: true,
        handler(val) {
          if (val && val._id) {
            this.result = val.status
            this.errMsg = val.errMsg
          } else {
            this.result = 'quit'
            this.errMsg = ''
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
	.gap-test {
		.center {
			display: flex;
			justify-content: center;
			align-items: center;

			i {
				font-size: 150px;
				color: #909399;
			}

			p {
				line-height: 50px;
				font-size: 20px;
			}
		}

		.right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}

		.left {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
	}
</style>
