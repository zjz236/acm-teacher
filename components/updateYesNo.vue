<template>
    <Modal v-model="show" :width="900" title="修改我的判断题" @on-cancel="cancelModal">
        <div class="upt-content">
            <Form ref="topicValidate" :model="topicValidate" label-position="right" :label-width="70" :rules="topicRules">
                <FormItem label="题目编号">
                    <Input disabled v-model="topicValidate.Id"></Input>
                </FormItem>
                <FormItem label="题目描述" prop="description"><quillEditor :disabled="!userInfo.is_admin&&publicc" v-bind:content.sync="topicValidate.description" :content="topicValidate.description"></quillEditor></FormItem>
                <FormItem label="答案"><RadioGroup v-model="topicValidate.answer"><Radio :disabled="!userInfo.is_admin&&publicc" :label="1">是</Radio><Radio :disabled="!userInfo.is_admin&&publicc" :label="0">否</Radio></RadioGroup></FormItem>
                <FormItem label="章节">
                    <Select v-model="topicValidate.section" :disabled="!userInfo.is_admin&&publicc">
                        <Option v-for="item in module" :value="item.key" :key="item.key">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="难度">
                    <Select v-model="topicValidate.difficulty" :disabled="!userInfo.is_admin&&publicc">
                        <Option v-for="item in difficult" :value="item" :key="item">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="topicValidate.remarks" :disabled="!userInfo.is_admin&&publicc" type="textarea"></Input>
                </FormItem>
            </Form>
        </div>
        <div class="submit-footer" slot="footer"><Button v-if="userInfo.is_admin||!publicc" type="primary" @click.native="updateTFInfo('topicValidate')">提交</Button></div>
    </Modal>
</template>

<script>
    import quillEditor from '@/components/quillEditor'
    import sectionModule from '@/assets/Json/sectionModule'
    import ajaxService from "@/utils/ajaxService";
    export default {
        name: "updateYesNo",
        props:['modalShow','Id','getList','userInfo','publicc'],
        components:{
            quillEditor
        },
        data(){
            return{
                show:this.modalShow,
                topicValidate:{
                    Id:'',
                    description:'',
                    answer:1,
                    section:0,
                    difficulty:70,
                    remarks:''
                },
                topicRules:{
                    description:[{required: true, message: '请输入题目描述', trigger: 'blur'}],
                    answer:[{required: true, message: '请输入答案', trigger: 'blur'}]

                },
                difficult:[0,10,20,30,40,50,60,70,80,90,100],
                module:sectionModule,
            }
        },
        watch:{
          modalShow(value){
              this.show=value
              if (value===true){
                  this.getTFInfo()
              }
          }
        },
        methods:{
            cancelModal(){
                this.$emit('update:show',false)
            },
            getTFInfo(){
                ajaxService.getTFInfo({tfId:this.Id,public:this.publicc?1:0}).then(res=>{
                    if (res.code==1){
                        this.topicValidate.Id=res.data.Id
                        this.topicValidate.description=res.data.description
                        this.topicValidate.answer=res.data.answer
                        this.topicValidate.section=res.data.section
                        this.topicValidate.difficulty=res.data.difficulty
                        this.topicValidate.remarks=res.data.remarks
                    }
                })
            },
            updateTFInfo(name){

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data=this.topicValidate
                        ajaxService.updateTFInfo(data).then(res=>{
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

    .upt-content{
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
</style>
