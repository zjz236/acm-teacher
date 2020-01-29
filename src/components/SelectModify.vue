<template>
	<el-dialog :close-on-click-modal="false" :title="title" :visible.sync="visible" top="5vh">
		<el-form v-loading="loading" ref="form" :model="form" label-position="right" label-width="80px">
			<el-form-item label="题目描述" prop="description">
				<zhu-quill-editor :disabled="disabled" v-model="form.description"></zhu-quill-editor>
			</el-form-item>
			<el-form-item label="操作选项">
				<el-tooltip class="item" effect="dark" content="添加选项" placement="top">
					<el-button icon="el-icon-plus" @click="addOption"></el-button>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" content="删除选项" placement="top">
					<el-button icon="el-icon-minus" @click="removeOption"></el-button>
				</el-tooltip>
			</el-form-item>
			<el-form-item label-width="0px">
				<div class="option">
					<el-form-item
							v-for="(item,index) in form.options" :label="`选项${String.fromCharCode(index+65)}`" :key="index"
							label-width="80px" :style="index>2?'margin-top:20px':''">
						<el-input v-model="form.options[index]"></el-input>
					</el-form-item>
				</div>
			</el-form-item>
			<el-form-item label="答案">
				<el-select v-model="form.answer">
					<el-option
							v-for="(item,index) in form.options" :key="index" :value="String.fromCharCode(index+65)"
							:label="String.fromCharCode(index+65)"></el-option>
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
  import ZhuQuillEditor from "@/components/ZhuQuillEditor"
  import {section, difficulty} from "@/common/common"

  export default {
    name: "SelectModify",
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
            description: '',
            options: ['', ''],
            answer: 'A',
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
          options: ['', ''],
          answer: 'A',
          section: 999,
          difficulty: 0,
          notes: ''
        },
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
          return '查看选择题'
        } else if (this.editable) {
          return '修改选择题'
        } else {
          return '添加选择题'
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
