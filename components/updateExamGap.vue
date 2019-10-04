<template>
    <Modal v-model="show" :width="900" title="修改我的填空题" @on-cancel="cancelModal">
        <div class="upg-content">
            <Form ref="topicValidate" :model="topicValidate" label-position="right" :label-width="70" :rules="topicRules">
                <FormItem label="题目编号">
                    <Input v-model="topicValidate.Id" disabled></Input>
                </FormItem>
                <FormItem label="题目描述" prop="description">
                    <quillEditor v-bind:content.sync="topicValidate.description"
                                 :content="topicValidate.description"></quillEditor>
                </FormItem>
                <FormItem label="代码" prop="code">
                    <Input v-model="topicValidate.code" type="textarea" :autosize="{minRows: 5,maxRows: 7}"></Input>
                </FormItem>
                <FormItem label="增删选项">
                    <Button @click.native="gapPush">
                        <Icon :size="15" type="ios-add-circle-outline"/>
                    </Button>
                    <Button @click.native="gapPop">
                        <Icon :size="15" type="ios-backspace-outline"/>
                    </Button>
                </FormItem>
                <div class="option">
                    <FormItem v-for="(item,index) in topicValidate.gap" :key="index" :prop="'gap'+(index+1)"
                              :label="`填空${index+1}`"><Input
                            v-model="topicValidate.gap[index]"></Input></FormItem>
                </div>
                <FormItem label="章节">
                    <Select v-model="topicValidate.section">
                        <Option v-for="item in module" :value="item.key" :key="item.key">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="难度">
                    <Select v-model="topicValidate.difficulty">
                        <Option v-for="item in difficult" :value="item" :key="item">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="topicValidate.remarks" type="textarea"></Input>
                </FormItem>
            </Form>
        </div>
        <div class="submit-footer" slot="footer"><Button type="primary" @click.native="updateExamGapInfo('topicValidate')">提交</Button></div>
    </Modal>
</template>

<script>
    import quillEditor from '@/components/quillEditor'
    import sectionModule from '@/assets/Json/sectionModule'
    import ajaxService from "@/utils/ajaxService";
    export default {
        name: "updateExamGap",
        props:['modalShow','Id','getList'],
        components:{
            quillEditor
        },
        data(){
            return{
                show:this.modalShow,
                topicValidate: {
                    Id:'',
                    description: '',
                    gap: ['', ''],
                    section: 0,
                    code:'',
                    difficulty: 70,
                    remarks: ''
                },
                topicRules: {
                    description: [{required: true, message: '请输入题目描述', trigger: 'blur'}],
                    code: [{required: true, message: '请输入代码', trigger: 'blur'}],
                },
                difficult: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                module: sectionModule,
                examId:this.$route.query.id
            }
        },
        watch:{
            modalShow(value){
                this.show=value
                if (value===true){
                    this.getExamGapInfo()
                }
            }
        },
        methods:{
            cancelModal(){
                this.$emit('update:show',false)
            },
            getExamGapInfo(){
                ajaxService.getExamGapInfo({Id:this.Id,examId:this.examId}).then(res=>{
                    if (res.code==1){
                        this.topicValidate.Id=res.data.Id
                        this.topicValidate.description=res.data.description
                        this.topicValidate.code=res.data.code
                        this.topicValidate.gap=res.data.gaps.split('<{>}')
                        this.topicValidate.section=res.data.section
                        this.topicValidate.difficulty=res.data.difficulty
                        this.topicValidate.remarks=res.data.remarks
                    }
                })
            },
            gapPush() {
                this.topicValidate.gap.length < 6 && this.topicValidate.gap.push('')
            },
            gapPop() {
                this.topicValidate.gap.length > 2 && this.topicValidate.gap.pop()
            },
            gapRead() {
                for (let i = 0; i < this.topicValidate.gap.length; i++) {
                    if (this.topicValidate.gap[i] == '') return {success: false, msg: '请输入填空' + (i + 1)}
                }
                return {success: true}
            },
            updateExamGapInfo(name){
                const self = this
                if (!this.gapRead().success) {
                    this.$Message.error(this.gapRead().msg)
                    return
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data=self.topicValidate
                        data.examId=this.examId
                        data.gaps = data.gap.join('<{>}')
                        ajaxService.updateExamGapInfo(data).then(res=>{
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
    .upg-content {
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

                .ivu-form-item-label:before {
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
