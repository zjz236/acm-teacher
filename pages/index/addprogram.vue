<template>
    <div class="add-program">
        <div class="title"><h2>添加我的程序设计题</h2>
            <div class="bnt">
                <Button @click.native="routerTo('/userbank')">返回</Button>
            </div>
        </div>
        <div class="content">
            <Form ref="topicValidate" :model="topicValidate" label-position="right" :label-width="70"
                  :rules="topicRules">
                <FormItem label="题目标题"><Input v-model="topicValidate.title"></Input></FormItem>
                <FormItem label="时间限制"><Select v-model="topicValidate.timeLimit">
                    <Option v-for="(item,index) in timeLimit" :key="index" :value="index+1">{{item}}</Option>
                </Select></FormItem>
                <FormItem label="空间限制"><Select v-model="topicValidate.spaceLimit">
                    <Option :value="32768">32768KB</Option>
                    <Option :value="65536">65536KB</Option>
                </Select></FormItem>
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
                <FormItem label="题目描述" prop="description">
                    <quillEditor v-bind:content.sync="topicValidate.description"
                                 :content="topicValidate.description"></quillEditor>
                </FormItem>
                <FormItem label="输入描述" prop="inputDes">
                    <quillEditor v-bind:content.sync="topicValidate.inputDes"
                                 :content="topicValidate.inputDes"></quillEditor>
                </FormItem>
                <FormItem label="输出描述" prop="outpitDes">
                    <quillEditor v-bind:content.sync="topicValidate.outputDes"
                                 :content="topicValidate.outputDes"></quillEditor>
                </FormItem>
                <FormItem label="样例输入"><Input type="textarea" v-model="topicValidate.sampleInput" :autosize="{minRows: 5,maxRows: 7}"></Input></FormItem>
                <FormItem label="样例输出"><Input type="textarea" v-model="topicValidate.sampleOutput" :autosize="{minRows: 5,maxRows: 7}"></Input></FormItem>
                <FormItem label="备注">
                    <Input v-model="topicValidate.remarks" type="textarea" :autosize="{minRows: 5,maxRows: 7}"></Input>
                </FormItem>
                <FormItem label="是否公共" v-if="userInfo.is_admin">
                    <RadioGroup v-model="topicValidate.public"><Radio :label="0">否</Radio><Radio :label="1">是</Radio></RadioGroup>
                </FormItem>
                <FormItem>
                    <Button @click="submit('topicValidate')">提交</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import quillEditor from '@/components/quillEditor'
    import sectionModule from '../../assets/Json/sectionModule'
    import ajaxService from "../../utils/ajaxService";

    export default {
        name: "addprogram",
        props:['userInfo'],
        components: {
            quillEditor
        },
        data() {
            return {
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
                    sampleOutput:'',
                    public:0
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
        methods: {
            submit(name) {
                const self = this
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = this.topicValidate
                        ajaxService.addProgram(data).then(res => {
                            if (res.code == 1) {
                                self.$Message.success(res.msg)
                                self.topicValidate.public===0?self.routerTo('/userbank'):self.routerTo('/publicbank')

                            }
                        })
                    } else {
                        this.$Message.error('请正确输入!');
                    }
                })
            },
            routerTo(path) {
                this.$router.replace(path)
            },
        },
        mounted() {
        },
        created() {
        }
    }
</script>

<style lang="scss">
    .add-program {
        width: 100%;
        height: 100%;
        padding: 20px 40px;
        display: flex;
        flex-direction: column;

        .title {
            display: flex;
            flex: 0 0 auto;
            height: 52px;
            align-items: center;
            border-bottom: 1px solid #eee;

            h2 {
                flex: 1 1 50%;
                line-height: 52px;
                font-size: 30px;
                color: rgb(51, 51, 51);
            }

            .bnt {
                display: flex;
                justify-content: flex-end;
                flex: 1 1 50%;
            }
        }

        .content {
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
    }
</style>
