<template>
	<editor
			ref="myEditor" :value="value" @input="inputChange" @init="editorInit" :lang="lang"
			:theme="theme" :height="height"></editor>
</template>

<script>
  import Editor from 'vue2-ace-editor'

  export default {
    name: "AceEditor",
    components: {Editor},
    props: {
      readonly: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
        default: ''
      },
      height: {
        type: Number,
        default: 200
      },
      lang: {
        type: String,
        default: ''
      },
      theme: {
        type: String,
        default: 'clouds'
      }
    },
    methods: {
      inputChange(val) {
        this.$emit('input', val)
      },
      editorInit() {
        require('brace/ext/language_tools') //language extension prerequsite...
        require('brace/mode/c_cpp')
        require('brace/mode/powershell')
        require('brace/mode/java')    //language
        require('brace/mode/python')
        require('brace/theme/tomorrow_night_bright')
        require('brace/theme/solarized_light')
        require('brace/theme/clouds')
        require('brace/theme/chrome')
        require('brace/snippets/javascript') //snippet
      }
    },
    mounted() {
      this.$refs.myEditor.editor.setReadOnly(this.readonly)
    }
  }
</script>

<style scoped lang="scss">

</style>
