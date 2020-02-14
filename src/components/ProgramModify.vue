<template>
	<el-dialog :close-on-click-modal="false" :title="title" :visible.sync="visible" top="5vh">
		<el-form v-loading="loading" ref="form" :model="form" label-position="right" label-width="80px">
			<el-form-item label="题目标题" prop="title">
				<el-input :disabled="disabled" v-model="form.title"></el-input>
			</el-form-item>
			<el-form-item label="题目描述" prop="description">
				<zhu-quill-editor :disabled="disabled" v-model="form.description"></zhu-quill-editor>
			</el-form-item>
			<el-form-item label="输入描述" prop="inputDesc">
				<zhu-quill-editor :disabled="disabled" v-model="form.inputDesc"></zhu-quill-editor>
			</el-form-item>
			<el-form-item label="输出描述" prop="outputDesc">
				<zhu-quill-editor :disabled="disabled" v-model="form.outputDesc"></zhu-quill-editor>
			</el-form-item>
			<el-form-item label="样例输入" prop="simpleInput">
				<el-input type="textarea" :disabled="disabled" v-model="form.simpleInput"></el-input>
			</el-form-item>
			<el-form-item label="样例输出" prop="simpleOutput">
				<el-input type="textarea" :disabled="disabled" v-model="form.simpleOutput"></el-input>
			</el-form-item>
			<el-form-item label="时间限制" prop="timeLimit">
				<el-select v-model="form.timeLimit" :disabled="disabled">
					<el-option v-for="item in timeLimit" :key="item" :value="item" :label="item+'MS'"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="空间限制" prop="timeLimit">
				<el-select v-model="form.memoryLimit" :disabled="disabled">
					<el-option v-for="item in memoryLimit" :key="item" :value="item" :label="item+'KB'"></el-option>
				</el-select>
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
	</el-dialog>
</template>

<script>
  import ZhuQuillEditor from '@/components/ZhuQuillEditor'
  import {section, difficulty} from '@/common/common'

  export default {
    name: 'SelectModify',
    components: {
      ZhuQuillEditor
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
            title: '',
            description: '',
            inputDesc: '',
            outputDesc: '',
            simpleInput: '',
            simpleOutput: '',
            memoryLimit: 32768,
            timeLimit: 1000,
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
          title: '',
          description: '',
          inputDesc: '',
          outputDesc: '',
          simpleInput: '',
          simpleOutput: '',
          timeLimit: 1000,
          memoryLimit: 32768,
          section: 999,
          difficulty: 0,
          notes: ''
        },
        timeLimit: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
        memoryLimit: [32768, 65536],
        section,
        difficulty
      }
    },
    methods: {
      save() {
        const empty = []
        for (const index in this.form.options) {
          if (!this.form.options[index]) {
            empty.push(`选项${String.fromCharCode(parseInt(index) + 65)}`)
          }
        }
        if (empty.length > 0) {
          return this.$message.error(`请输入${empty.join('、')}`)
        }
        this.$emit('save', this.form)
      },
      addOption() {
        if (this.form.options.length === 6) {
          return this.$message.error('选项最多6个')
        }
        this.form.options.push('')
      },
      removeOption() {
        if (this.form.options.length === 2) {
          return this.$message.error('选项至少2个')
        }
        this.form.options.pop()
      }
    },
    computed: {
      title() {
        if (this.disabled) {
          return '查看程序设计题'
        } else if (this.editable) {
          return '修改程序设计题'
        } else {
          return '添加程序设计题'
        }
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
      }
    }
  }
</script>

<style scoped lang="scss">
	.option {
		width: 100%;
		display: flex;
		flex-wrap: wrap;

		.el-form-item {
			width: 33%;
		}
	}
</style>
