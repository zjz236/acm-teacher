<template>
	<div class="ide" v-loading="loading">
		<div class="code-editor">
			<ace-editor theme="tomorrow_night_bright" :lang="languageSet" v-model="code" style="width: 95%; height: 95%;">
			</ace-editor>
			<el-select v-model="language" size="mini" class="select-language">
				<el-option value="c" label="C"></el-option>
				<el-option value="cpp" label="C++"></el-option>
				<el-option value="java" label="Java"></el-option>
				<el-option value="python" label="Python"></el-option>
			</el-select>
		</div>
		<div class="simple-editor">
			<div class="editor">
				<ace-editor v-model="inputData" theme="tomorrow_night_bright" lang="powershell"
										style="width: 95%; height: 95%;"></ace-editor>
			</div>
			<div class="editor-bt">
				<el-button type="info" @click="addIDEData">运行</el-button>
			</div>
			<div class="editor">
				<ace-editor v-model="outputData" theme="tomorrow_night_bright" lang="powershell"
										style="width: 95%; height: 95%;"></ace-editor>
			</div>
		</div>
	</div>
</template>

<script>
  import AceEditor from '@/components/AceEditor'
  import api from '@/api/common'

  export default {
    name: 'IDE',
    components: {
      AceEditor
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
        code: '',
        language: 'c',
        inputData: '',
        outputData: '',
        loading: false
      }
    },
    methods: {
      async addIDEData() {
        try {
          this.loading = true
          const {data} = await api.addIDEData({
            code: this.code,
            language: this.language,
            inputData: this.inputData,
          })
          this.getIDEData(data.insertedId)
          console.log(data)
        } catch (e) {
          console.error(e)
          this.loading = false
        }
      },
      async getIDEData(id) {
        try {
          const result = await new Promise((resolve, reject) => {
            const timer = setInterval(async () => {
              try {
                const {data} = await api.getIDEData({id})
                if (['Queuing', 'Running'].indexOf(data.status) < 0) {
                  resolve(data)
                  clearInterval(timer)
                }
              } catch (e) {
                console.error(e)
                reject(e)
                clearInterval(timer)
              }
            }, 500)
          })
          if (result.status === 'Compile') {
            this.outputData = result.outputData
          } else {
            this.outputData = result.errMsg
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style scoped lang="scss">
	.ide {
		width: 100%;
		height: 100%;
		display: flex;

		.code-editor {
			flex: 1 1 70%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			.select-language {
				position: absolute;
				right: 5%;
				z-index: 999;
				top: 5%;
			}
		}

		.simple-editor {
			flex: 1 1 30%;
			display: flex;
			flex-direction: column;

			.editor-bt {
				flex: 1 1 10%;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.editor {
				flex: 1 1 45%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
