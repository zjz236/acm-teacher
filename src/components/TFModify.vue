<template>
	<el-dialog :close-on-click-modal="false" :title="title" :visible.sync="visible" top="5vh">
		<el-form v-loading="loading" ref="form" :model="form" label-position="right" label-width="80px">
			<el-form-item label="题目描述" prop="description">
				<zhu-quill-editor :disabled="disabled" v-model="form.description"></zhu-quill-editor>
			</el-form-item>
			<el-form-item label="答案" prop="answer">
				<el-radio-group :disabled="disabled" v-model="form.answer">
					<el-radio :label="true">正确</el-radio>
					<el-radio :label="false">错误</el-radio>
				</el-radio-group>
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
    name: "TFModify",
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
            answer: true,
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
          answer: true,
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
        this.$emit('save', this.form)
      }
    },
    computed: {
      title() {
        if (this.disabled) {
          return '查看判断题'
        } else if (this.editable) {
          return '修改判断题'
        } else {
          return '添加判断题'
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

<style scoped>

</style>
