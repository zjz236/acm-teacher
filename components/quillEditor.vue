<template>
    <section class="quill-editor-container">
        <div class="quill-editor"
             :content="qcontent"
             @change="onEditorChange($event)"
             @blur="onEditorBlur($event)"
             @focus="onEditorFocus($event)"
             @ready="onEditorReady($event)"
             v-quill:myQuillEditor="editorOption">
        </div>
    </section>
</template>

<script>
    import Vue from 'vue'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    export default {
        props: {
            content: {
                type: String,
                required: true
            },
            disabled:{
                type:Boolean
            }
        },
        data() {
            return {
                qcontent: this.content,
                editorOption: null
            }
        },
        watch:{
            content(value){
                this.qcontent=value
            }
        },
        // 在Nuxt.js框架中因为是后端渲染，所以为了使用image上传插件，在此处初始化和引入vue-quill-editor和quill-image-extend-module插件
        beforeMount() {
            const VueQuillEditor = require('vue-quill-editor/dist/ssr');
            const Quill = require('quill');
            const {ImageExtend, QuillWatch} = require('quill-image-extend-module');
            let baseURL='http://127.0.0.1:1236'
            if (process.env.PATH_TYPE==='pro') {
                baseURL='https://zjyc.zjzhmx.xyz'
            }
            console.log(baseURL)
            this.editorOption = {
                bounds: 'app',
                placeholder: '',
                modules: {
                    ImageExtend: {
                        loading: true,
                        name: 'img',              // 后端接收的文件名称
                        action: baseURL+'/api/upload', // 后端接收文件api
                        response: (res) => {
                            return baseURL + res.url[0] // 此处返回的值一定要直接是后端回馈的图片在服务器的存储路径如：/images/xxx.jpg
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
                            ['image', 'video']    //上传图片、上传视频
                        ]
                    }
                }
            }
            Quill.register('modules/ImageExtend', ImageExtend);
            Vue.use(VueQuillEditor)
        },

        methods: {
            onEditorBlur(editor) {
                this.$emit('update:number', editor.getText().trim().length)
            },
            onEditorFocus(editor) {
                if(this.disabled){
                    editor.enable(false)
                }
            },
            onEditorReady(editor) {
                this.$emit('update:number', editor.getText().trim().length)
            },
            onEditorChange({editor, html, text}) {
                this.qcontent = html
                this.$emit('update:content', this.qcontent)
            }
        }
    }
</script>

<style lang="scss">
    .quill-editor {

    }

    .ql-container {
        height: 100px;
    }
</style>
