<template>
    <Modal v-model="show" :width="900" title="修改我的选择题" @on-cancel="cancelModal">
        <div class="ups-content">
            <Form ref="topicValidate" :model="topicValidate" label-position="right" :label-width="75"
                  :rules="topicRules">
                <FormItem label="题目编号">
                    <Input disabled v-model="topicValidate.Id"></Input>
                </FormItem>
                <FormItem label="题目描述" prop="description">
                    <quillEditor :disabled="!userInfo.is_admin&&publicc" v-bind:content.sync="topicValidate.description"
                                 :content="topicValidate.description"></quillEditor>
                </FormItem>
                <FormItem label="增删选项">
                    <Button :disabled="!userInfo.is_admin&&publicc" @click.native="optionPush"><Icon :size="15" type="ios-add-circle-outline" /></Button>
                    <Button :disabled="!userInfo.is_admin&&publicc" @click.native="optionPop"><Icon :size="15" type="ios-backspace-outline" /></Button>
                </FormItem>
                <div class="option">
                    <FormItem v-for="(item,index) in topicValidate.option" :key="index" :prop="`option${String.fromCharCode( index+65 )}`"
                              :label="`选项${String.fromCharCode( index+65 )}`"><Input
                            :disabled="!userInfo.is_admin&&publicc" v-model="topicValidate.option[index]"></Input></FormItem>
                </div>
                <FormItem label="答案">
                    <RadioGroup v-model="topicValidate.answer">
                        <Radio  :disabled="!userInfo.is_admin&&publicc" v-for="(item,index) in topicValidate.option" :key="index" :label="index">{{String.fromCharCode( index+65 )}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="章节">
                    <Select :disabled="!userInfo.is_admin&&publicc" v-model="topicValidate.section">
                        <Option v-for="item in module" :value="item.key" :key="item.key">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="难度">
                    <Select :disabled="!userInfo.is_admin&&publicc" v-model="topicValidate.difficulty">
                        <Option v-for="item in difficult" :value="item" :key="item">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注">
                    <Input :disabled="!userInfo.is_admin&&publicc" v-model="topicValidate.remarks" type="textarea"></Input>
                </FormItem>
            </Form>
        </div>
        <div class="submit-footer" slot="footer"><Button v-if="userInfo.is_admin||!publicc" type="primary" @click.native="updateSelectInfo('topicValidate')">提交</Button></div>
    </Modal>
</template>

<script>
    import quillEditor from '@/components/quillEditor'
    import sectionModule from '@/assets/Json/sectionModule'
    import ajaxService from "@/utils/ajaxService";
    export default {
        name: "updateSelect",
        props:['modalShow','Id','getList','userInfo','publicc'],
        components:{
            quillEditor
        },
        data(){
            return{
                show:this.modalShow,
                topicValidate: {
                    Id:'',
                    description: '',
                    option: ['', ''],
                    answer: 0,
                    section: 0,
                    difficulty: 70,
                    remarks: ''
                },
                topicRules: {
                    description: [{required: true, message: '请输入题目描述', trigger: 'blur'}],
                    answer: [{required: true, message: '请输入答案', trigger: 'blur'}],
                },
                difficult: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                module: sectionModule,
            }
        },
        watch:{
            modalShow(value){
                this.show=value
                if (value===true){
                    this.getSelectInfo()
                }
            }
        },
        methods:{
            optionPush() {
                this.topicValidate.option.length < 6 && this.topicValidate.option.push('')
            },
            optionPop() {
                this.topicValidate.option.length > 2 && this.topicValidate.option.pop()
                this.topicValidate.option.length<=this.topicValidate.answer&&(this.topicValidate.answer=0)
            },
            cancelModal(){
                this.$emit('update:show',false)
            },
            getSelectInfo(){
                ajaxService.getSelectInfo({selectId:this.Id,public:this.publicc?1:0}).then(res=>{
                    if (res.code==1){
                        this.topicValidate.Id=res.data.Id
                        this.topicValidate.description=res.data.description
                        this.topicValidate.option=res.data.options.split('<{>}')
                        this.topicValidate.answer=res.data.answer
                        this.topicValidate.section=res.data.section
                        this.topicValidate.difficulty=res.data.difficulty
                        this.topicValidate.remarks=res.data.remarks
                    }
                })
            },
            optionRead() {
                for (let i = 0; i < this.topicValidate.option.length; i++) {
                    if (this.topicValidate.option[i] == '') return {success: false, msg: '请输入选项' + String.fromCharCode( i+65 )}
                }
                return {success: true}
            },
            updateSelectInfo(name){
                if (!this.optionRead().success) {
                    this.$Message.error(this.optionRead().msg)
                    return
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data=this.topicValidate
                        data.options=data.option.join('<{>}')
                        ajaxService.updateSelectInfo(data).then(res=>{
                            if (res.code==1){
                                this.$Message.success(res.msg)
                                this.cancelModal()
                                this.getList()
                            }
                        })
                    } else {
                        this.$Message.error('请正确输入!');
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .ups-content {
        flex: 1;
        display: flex;
        justify-content: center;

        .ivu-form {
            width: 700px;
            margin-top: 20px;

            .ivu-form-item {
                .ivu-form-item-label {
                    font-weight: bold;
                }
                .ivu-form-item-label:before{
                    content: none;
                }
            }

            .option {
                display: flex;
                flex-wrap: wrap;

                .ivu-form-item {
                    width: 350px;
                }
            }
        }
    }
</style>
