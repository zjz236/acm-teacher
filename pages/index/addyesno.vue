<template>
    <div class="add-yes-no">
        <div class="title"><h2>添加我的判断题</h2>
            <div class="bnt">
                <Button @click.native="routerTo('/userbank')">返回</Button>
            </div>
        </div>
        <div class="content">
            <Form ref="topicValidate" :model="topicValidate" label-position="right" :label-width="70" :rules="topicRules">
                <FormItem label="题目描述" prop="description"><quillEditor v-bind:content.sync="topicValidate.description" :content="topicValidate.description"></quillEditor></FormItem>
                <FormItem label="答案"><RadioGroup v-model="topicValidate.answer"><Radio :label="1">是</Radio><Radio :label="0">否</Radio></RadioGroup></FormItem>
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
        name: "addyesno",
        props:['userInfo'],
        components:{
            quillEditor
        },
        data(){
            return {
                topicValidate:{
                    description:'',
                    answer:1,
                    section:0,
                    difficulty:70,
                    remarks:'',
                    public:0,
                },
                topicRules:{
                    description:[{required: true, message: '请输入题目描述', trigger: 'blur'}],
                    answer:[{required: true, message: '请输入答案', trigger: 'blur'}]

                },
                difficult:[0,10,20,30,40,50,60,70,80,90,100],
                module:sectionModule,
            }
        },
        methods:{
            submit(name){
                const self = this
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data=this.topicValidate
                        ajaxService.addTF(data).then(res=>{
                            if (res.code==1){
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
        mounted(){
        },
        created() {
        },
        head(){
            return {
                title:'添加我的判断题'
            }
        }
    }
</script>

<style lang="scss">
    .add-yes-no{
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
        .content{
            flex:1;
            display: flex;
            justify-content: center;
            .ivu-form{
                width: 700px;
                margin-top: 20px;
                .ivu-form-item{
                    .ivu-form-item-label{
                        font-weight: bold;
                    }
                    .ivu-form-item-label:before{
                        content: none;
                    }

                }
            }
        }
    }
</style>
