<template>
    <Modal v-model="show" :width="900" title="修改我的程序设计题" @on-cancel="cancelModal">
        <div class="upp-content">
            <Form ref="topicValidate" :model="topicValidate" label-position="right" :label-width="70" :rules="topicRules">
                <FormItem label="题目编号">
                    <Input disabled v-model="topicValidate.Id"></Input>
                </FormItem>
                <FormItem label="题目标题"><Input :disabled="!userInfo.is_admin&&publicc" v-model="topicValidate.title"></Input></FormItem>
                <FormItem label="时间限制"><Select :disabled="!userInfo.is_admin&&publicc" v-model="topicValidate.timeLimit">
                    <Option v-for="(item,index) in timeLimit" :key="index" :value="index+1">{{item}}</Option>
                </Select></FormItem>
                <FormItem label="空间限制"><Select :disabled="!userInfo.is_admin&&publicc" v-model="topicValidate.spaceLimit">
                    <Option :value="32768">32768KB</Option>
                    <Option :value="65536">65536KB</Option>
                </Select></FormItem>
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
                <FormItem label="题目描述" prop="description">
                    <quillEditor :disabled="!userInfo.is_admin&&publicc" v-bind:content.sync="topicValidate.description"
                                 :content="topicValidate.description"></quillEditor>
                </FormItem>
                <FormItem label="输入描述" prop="inputDes">
                    <quillEditor :disabled="!userInfo.is_admin&&publicc" v-bind:content.sync="topicValidate.inputDes"
                                 :content="topicValidate.inputDes"></quillEditor>
                </FormItem>
                <FormItem label="输出描述" prop="outpitDes">
                    <quillEditor :disabled="!userInfo.is_admin&&publicc" v-bind:content.sync="topicValidate.outputDes"
                                 :content="topicValidate.outputDes"></quillEditor>
                </FormItem>
                <FormItem label="样例输入"><Input :disabled="!userInfo.is_admin&&publicc" type="textarea" v-model="topicValidate.sampleInput" :autosize="{minRows: 5,maxRows: 7}"></Input></FormItem>
                <FormItem label="样例输出"><Input :disabled="!userInfo.is_admin&&publicc" type="textarea" v-model="topicValidate.sampleOutput" :autosize="{minRows: 5,maxRows: 7}"></Input></FormItem>
                <FormItem label="备注">
                    <Input :disabled="!userInfo.is_admin&&publicc" v-model="topicValidate.remarks" type="textarea" :autosize="{minRows: 5,maxRows: 7}"></Input>
                </FormItem>
            </Form>
        </div>
        <div class="submit-footer" slot="footer"><Button v-if="userInfo.is_admin||!publicc" type="primary" @click.native="updateProgramInfo('topicValidate')">提交</Button></div>
    </Modal>
</template>

<script>
    import quillEditor from '@/components/quillEditor'
    import sectionModule from '@/assets/Json/sectionModule'
    import ajaxService from "@/utils/ajaxService";
    export default {
        name: "updateProgram",
        props:['modalShow','Id','getList','userInfo','publicc'],
        components:{
            quillEditor
        },
        data(){
            return{
                show:this.modalShow,
                topicValidate: {
                    title: '',
                    timeLimit: 1,
                    spaceLimit: 32768,
                    description: '',
                    section: 0,
                    difficulty: 70,
                    inputDes:'',
                    outputDes:'',
                    remarks: '',
                    sampleInput:'',
                    sampleOutput:''
                },
                topicRules: {
                    description: [{required: true, message: '请输入题目描述', trigger: 'blur'}],
                    title: [{required: true, message: '请输入题目标题', trigger: 'blur'}],
                    inputDes:[{required: true, message: '请输入输入描述', trigger: 'blur'}],
                    outputDes:[{required: true, message: '请输入输出描述', trigger: 'blur'}],
                    sampleInput:[{required: true, message: '请输入样例输入', trigger: 'blur'}],
                    sampleOutput:[{required: true, message: '请输入样例输出', trigger: 'blur'}]
                },
                difficult: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                timeLimit: ['1000MS', '2000MS', '3000MS', '4000MS', '5000MS', '6000MS', '7000MS', '8000MS', '9000MS', '10000MS'],
                module: sectionModule,
            }
        },
        watch:{
            modalShow(value){
                this.show=value
                if (value===true){
                    this.getProgramInfo()
                }
            }
        },
        methods:{
            cancelModal(){
                this.$emit('update:show',false)
            },
            getProgramInfo(){
                ajaxService.getProgramInfo({programId:this.Id,public:this.publicc?1:0}).then(res=>{
                    if (res.code==1){
                        this.topicValidate.Id=res.data.Id
                        this.topicValidate.title=res.data.title
                        this.topicValidate.description=res.data.description
                        this.topicValidate.inputDes=res.data.inputDes
                        this.topicValidate.outputDes=res.data.outputDes
                        this.topicValidate.sampleInput=res.data.sampleInput
                        this.topicValidate.sampleOutput=res.data.sampleOutput
                        this.topicValidate.section=res.data.section
                        this.topicValidate.difficulty=res.data.difficulty
                        this.topicValidate.remarks=res.data.remarks
                    }
                })
            },
            updateProgramInfo(name){

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data=this.topicValidate
                        ajaxService.updateProgramInfo(data).then(res=>{
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

    .upp-content {
        flex: 1;
        display: flex;
        justify-content: center;

        .ivu-form {
            width: 800px;
            margin-top: 20px;
            height: 900px;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            .ivu-form-item {
                width: 400px;
                .ivu-form-item-label {
                    font-weight: bold;
                }

                .ivu-form-item-label:before {
                    content: none;
                }

            }
        }
    }
</style>
