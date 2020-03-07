<template>
	<quill-editor :disabled="disabled" :value="value" :options="editorOption" @change="onEditorChange($event)">
	</quill-editor>
</template>

<script>
  import {QuillWatch} from 'quill-image-extend-module'

  export default {
    name: "ZhuQuillEditor",
    props: {
      value: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        editorOption: {
          bounds: 'app',
          placeholder: '',
          modules: {
            ImageExtend: {
              loading: true,
              name: 'img',              // 后端接收的文件名称
              action: '/oj/upload', // 后端接收文件api
              response: (res) => {
                return '/oj/' + res.url // 此处返回的值一定要直接是后端回馈的图片在服务器的存储路径如：/images/xxx.jpg
              }
            },
            toolbar: {
              handlers: {
                'image': function () {
                  QuillWatch.emit(this.quill.id)
                }
              },
              container: [
                ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                ['blockquote', 'code-block'],     //引用，代码块
                [{'header': 1}, {'header': 2}],        // 标题，键值对的形式；1、2表示字体大小
                [{'list': 'ordered'}, {'list': 'bullet'}],     //列表
                [{'script': 'sub'}, {'script': 'super'}],   // 上下标
                [{'indent': '-1'}, {'indent': '+1'}],     // 缩进
                [{'direction': 'rtl'}],             // 文本方向
                [{'size': ['small', false, 'large', 'huge']}], // 字体大小
                [{'header': [1, 2, 3, 4, 5, 6, false]}],     //几级标题
                [{'color': []}, {'background': []}],     // 字体颜色，字体背景颜色
                [{'font': []}],     //字体
                [{'align': []}],    //对齐方式
                ['clean'],    //清除字体样式
                ['image']    //上传图片、上传视频
              ]
            }
          }
        }
      }
    },
    methods: {
      onEditorChange({html}) {
        this.$emit('input', html)
      }
    }
  }
</script>

<style scoped>
	/deep/ .ql-container {
		height: 100px;
	}
</style>
