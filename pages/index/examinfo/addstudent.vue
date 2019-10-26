<template>
    <div class="add-student">
        <div class="title"><h2>上传考生信息</h2>
            <div class="bnt">
                <Button @click.native="routerTo('/examinfo/studentlist')">返回</Button>
            </div>
        </div>
        <div class="content">
            <Form ref="studentValidate" :model="studentValidate" label-position="right" :label-width="50"
                  :rules="studentRule">
                <FormItem label="账号" prop="username"><Input v-model="studentValidate.username"></Input></FormItem>
                <FormItem label="密码" prop="password"><Input v-model="studentValidate.password"></Input></FormItem>
                <FormItem label="姓名" prop="name"><Input v-model="studentValidate.name"></Input></FormItem>
                <FormItem label="学号" prop="studentId"><Input v-model="studentValidate.studentId"></Input></FormItem>
                <FormItem label="性别" prop="sex"><Select v-model="studentValidate.sex">
                    <Option :value="1">男</Option>
                    <Option :value="0">女</Option>
                </Select></FormItem>
                <FormItem label="学校" prop="school"><Input v-model="studentValidate.school"></Input></FormItem>
                <FormItem label="学院" prop="college"><Input v-model="studentValidate.college"></Input></FormItem>
                <FormItem label="专业" prop="major"><Input v-model="studentValidate.major"></Input></FormItem>
                <FormItem>
                    <Button @click.native="submit('studentValidate')">提交</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import ajaxService from '../../../utils/ajaxService';

    export default {
        name: "addstudent",
        data() {
            return {
                studentValidate: {
                    username: '',
                    password: '',
                    name: '',
                    studentId: '',
                    sex: 1,
                    school: '',
                    college: '',
                    major: ''
                },
                studentRule: {
                    username: [{required: true, message: '请输入账号', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    studentId: [{required: true, message: '请输入学号', trigger: 'blur'}],
                    school: [{required: true, message: '请输入学校', trigger: 'blur'}],
                    college: [{required: true, message: '请输入学院', trigger: 'blur'}],
                    major: [{required: true, message: '请输入专业', trigger: 'blur'}]
                }
            }
        },
        methods: {
            routerTo(path) {
                path = path + '?id=' + this.$route.query.id
                this.$router.replace(path)
            },
            submit(name) {
                const self = this
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let student = []
                        student.push(this.studentValidate)
                        ajaxService.addStudent({examId: self.$route.query.id, student}).then(res => {
                           if (res.code==1){
                               this.routerTo('/examinfo/studentlist')
                           }
                        })
                    } else {
                        this.$Message.error('请正确输入!');
                    }
                })
            }
        },
        head(){
            return {
                title:'上传考生信息'
            }
        }
    }
</script>

<style lang="scss">
    .add-student {
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
                width: 300px;
                margin-top: 50px;
            }
        }
    }
</style>
