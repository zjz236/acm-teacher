<template>
	<el-dialog width="70%" :close-on-click-modal="false" :title="title" :visible.sync="visible" top="5vh">
		<el-form style="width: 50%" v-loading="loading" ref="form" :model="form" label-position="right" label-width="80px">
			<el-form-item label="题目描述" prop="description">
				<zhu-quill-editor :disabled="disabled" v-model="form.description"></zhu-quill-editor>
			</el-form-item>
			<el-form-item label="操作填空">
				<el-tooltip class="item" effect="dark" content="添加填空" placement="top">
					<el-button icon="el-icon-plus" @click="addGap"></el-button>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" content="删除填空" placement="top">
					<el-button icon="el-icon-minus" @click="removeGap"></el-button>
				</el-tooltip>
			</el-form-item>
			<el-form-item label-width="0px">
				<div class="gaps">
					<el-form-item
							v-for="(item,index) in form.gaps" :label="`填空${index+1}`" :key="index"
							label-width="80px" :style="index>2?'margin-top:20px':''">
						<el-input v-model="form.gaps[index]"></el-input>
					</el-form-item>
				</div>
			</el-form-item>
			<el-form-item label="章节" prop="section">
				<el-select :disabled="disabled" v-model="form.section">
					<el-option v-for="item in section" :label="item.text" :key="item.value" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="难度" prop="difficulty">
				<el-select :disabled="disabled" v-model="form.difficulty">
					<el-option v-for="item in difficulty" :label="item" :key="item" :value="item"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="备注" prop="notes">
				<el-input :disabled="disabled" v-model="form.notes" type="textarea"></el-input>
			</el-form-item>
			<el-form-item v-if="!disabled">
				<el-button @click="save" type="primary">保存</el-button>
			</el-form-item>
		</el-form>
		<el-form style="width: 50%" :model="form" label-position="right" label-width="80px" v-loading="loading">
			<el-form-item label="编译语言">
				<el-select v-model="language">
					<el-option label="C语言" :value="0"></el-option>
					<el-option label="C++" :value="1"></el-option>
					<el-option label="java" :value="2"></el-option>
					<el-option label="python" :value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="输入代码">
				<ace-editor theme="tomorrow_night_bright" @input="codeChange" :lang="languageSet"
										v-model="form.code"></ace-editor>
				<p style="font-size: 10px;">请在代码中输入相应填空，如_(1)_、_(2)_等标识代表空格</p>
			</el-form-item>
			<el-form-item label="代码展示">
				<ace-editor theme="tomorrow_night_bright" readonly :lang="languageSet"
										:value="code"></ace-editor>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
  import ZhuQuillEditor from "@/components/ZhuQuillEditor"
  import {section, difficulty, languageModel} from "@/common/common"
  import AceEditor from "@/components/AceEditor"

  export default {
    name: "GapModify",
    components: {
      ZhuQuillEditor,
      AceEditor
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: () => {
          return {
            description: '',
            code: '',
            gaps: ['', ''],
            section: 999,
            difficulty: 0,
            notes: ''
          }
        }
      },
      editable: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        visible: this.value,
        form: {
          description: '',
          code: '',
          gaps: ['', ''],
          section: 999,
          difficulty: 0,
          notes: ''
        },
        section,
        difficulty,
        language: 0,
        code: ''
      }
    },
    methods: {
      save() {
        this.gapValidate().then(() => {
          this.$emit('save', this.form)
        }).catch((err) => {
          this.$message.error(err)
        })
      },
      gapValidate() {
        return new Promise((resolve, reject) => {
          const empty = []
          const codeEmpty = []
          const code = this.form.code
          for (const index in this.form.gaps) {
            if (!this.form.gaps[index]) {
              empty.push(`填空${index}`)
            }
            if (code.indexOf(`_(${parseInt(index) + 1})_`) < 0) {
              codeEmpty.push(`_(${parseInt(index) + 1})_`)
            }
          }
          if (empty.length) {
            return reject(`请输入${empty.join('，')}`)
          }
          if (codeEmpty.length) {
            return reject(`请在代码中添加${codeEmpty.join('，')}`)
          }
          resolve('success')
        })

      },
      addGap() {
        if (this.form.gaps.length === 6) {
          return this.$message.error('填空最多6个')
        }
        this.form.gaps.push('')
      },
      codeChange(value) {
        this.codeShow(value)
      },
      languageModelSet() {
        if (this.language === 0 && (!this.form.code || Object.values(languageModel).indexOf(this.form.code) >= 0)) {
          this.form.code = languageModel.c
        }
        if (this.language === 1 && (!this.form.code || Object.values(languageModel).indexOf(this.form.code) >= 0)) {
          this.form.code = languageModel.cpp
        }
        if (this.language === 2 && (!this.form.code || Object.values(languageModel).indexOf(this.form.code) >= 0)) {
          this.form.code = languageModel.java
        }
        if (this.language === 3 && (!this.form.code || Object.values(languageModel).indexOf(this.form.code) >= 0)) {
          this.form.code = languageModel.python
        }
        this.codeShow(this.form.code)
      },
      codeShow(value) {
        for (const index in this.gaps) {
          const gap = this.gaps[parseInt(index)]
          if (gap && value.indexOf(`_(${parseInt(index) + 1})_`) >= 0) {
            value = value.replace(`_(${parseInt(index) + 1})_`, gap)
          }
        }
        this.code = value
      },
      removeGap() {
        if (this.form.gaps.length === 2) {
          return this.$message.error('填空至少2个')
        }
        this.form.gaps.pop()
      }
    },
    computed: {
      title() {
        if (this.disabled) {
          return '查看程序填空题'
        } else if (this.editable) {
          return '修改程序填空题'
        } else {
          return '添加程序填空题'
        }
      },
      languageSet() {
        if ([0, 1].indexOf(this.language) >= 0) {
          return 'c_cpp'
        } else if (this.language === 2) {
          return 'java'
        } else {
          return 'python'
        }
      },
      gaps() {
        return this.form.gaps
      }
    },
    watch: {
      value(val) {
        this.visible = val
      },
      visible(val) {
        this.$emit('input', val)
      },
      data: {
        handler(val) {
          this.form = val
        },
        deep: true
      },
      language() {
        this.languageModelSet()
      },
      gaps: {
        handler() {
          this.codeShow(this.form.code)
        },
        deep: true
      }
    },
    mounted() {
      this.languageModelSet()
    }
  }
</script>

<style scoped lang="scss">
	/deep/ .el-dialog__body {
		display: flex;
	}

	.gaps {
		width: 100%;
		display: flex;
		flex-wrap: wrap;

		.el-form-item {
			width: 33%;
		}
	}
</style>
