<template>
    <div class="student-list">
        <div class="title"><h2>考生列表</h2>
            <div class="bnt">
                <Button @click.native="routerTo('/examinfo/addstudent')">添加考生</Button>
<!--                <Button @click="exportStudent">导出学生信息</Button>-->
                <Button @click.native="routerTo('/examinfo/uploadstudent')">导入学生信息</Button>
                <!--                <Button>下载所有学生试卷</Button>-->
            </div>
        </div>
        <div class="condition">
            <div class="search-content">
                <Form inline :model="searchInfo">
                    <FormItem><Select v-model="searchInfo.content">
                        <Option value="username">登录账号</Option>
                        <Option value="studentId">学号</Option>
                        <Option value="name">姓名</Option>
                        <Option value="school">学校</Option>
                        <Option value="college">学院</Option>
                        <Option value="major">专业</Option>
                        <Option value="score">成绩</Option>
                    </Select></FormItem>
                    <FormItem><Select v-model="searchInfo.searchSort">
                        <Option :value="0">降序</Option>
                        <Option :value="1">升序</Option>
                    </Select></FormItem>
                    <FormItem>
                        <Button @click.native="getStudentList">查询</Button>
                    </FormItem>
                </Form>
            </div>
            <div class="page-content">
                <Page :total="total" :page-size="pageSize" @on-change="pageChange" :current="currentPage"></Page>
            </div>
        </div>
        <Table :columns="columns" :data="stuData">
            <template slot="sex" slot-scope="{row,index}">
                <span>{{row.sex==1?'男':'女'}}</span>
            </template>
            <template slot="score" slot-scope="{row,index}">
                <span>{{row.isLogin==0?'未登录':row.score}}</span>
            </template>
            <template slot="operation" slot-scope="{row,index}"><a @click="()=>update(row)">修改</a><a @click="()=>deleteStudent(row.Id)">删除</a></template>
        </Table>
        <Modal v-model="show" :width="800">
            <template slot="footer">
                <Form ref="studentValidate" :model="studentValidate" label-position="right" :label-width="50"
                      :rules="studentRule">
                    <FormItem label="账号" prop="username"><Input disabled v-model="studentValidate.username"></Input></FormItem>
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
                </Form>
                <Button @click.native="submit('studentValidate')" type="primary">修改</Button>
            </template>
        </Modal>
    </div>
</template>

<script>
    import ajaxService from '../../../utils/ajaxService';
    import {setCookie, getCookie} from '@/utils/cookieUtil';
    import axios from 'axios'
    export default {
        name: "studentlist",
        data() {
            return {
                examInfo: {},
                currentPage: 1,
                pageSize: 20,
                total: 0,
                examId:this.$route.query.id,
                searchInfo: {
                    content: 'username',
                    searchSort: 0
                },
                show: false,
                columns: [
                    {
                        title: '登录账号',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '登录密码',
                        key: 'password',
                        align: 'center'
                    },
                    {
                        title: '学号',
                        key: 'studentId',
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '性别',
                        slot: 'sex',
                        align: 'center'
                    },
                    {
                        title: '学校',
                        key: 'school',
                        align: 'center'
                    },
                    {
                        title: '学院',
                        key: 'college',
                        align: 'center'
                    },
                    {
                        title: '专业',
                        key: 'major',
                        align: 'center'
                    },
                    {
                        title: '分数',
                        slot: 'score',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'operation',
                        align: 'center'
                    },
                    // {
                    //     title:'考卷',
                    //     key:'read',
                    //     align:'center'
                    // }
                ],
                stuData: [],
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
            pageChange(e) {
                this.currentPage = e
                this.getStudentList()
            },
            exportStudent(){
                let baseURL='http://127.0.0.1:1236'
                if (process.env.PATH_TYPE==='pro') {
                    baseURL='https://zjyc.zjzhmx.xyz'
                }
                axios({ // 用axios发送post请求
                    method: 'post',
                    url: baseURL+'/api/student/exportStudent', // 请求地址
                    data: {examId:this.examId}, // 参数
                    responseType: 'blob', // 表明返回服务器返回的数据类型
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': getCookie('token') || ''
                    }
                }).then(res=>{
                    const blob = new Blob([res]);
                    const fileName = '统计.xlsx';
                    const elink = document.createElement('a');
                    elink.download = fileName;
                    elink.style.display = 'none';
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                })
            },
            getExamInfo() {
                let examId = this.$route.query.id
                ajaxService.getExamInfo({examId}).then(res => {
                    if (res.code == 1) {
                        this.examInfo = res.data
                    }
                })
            },
            update(row){
                for (let key in this.studentValidate){
                    this.studentValidate[key]=row[key]
                }
                this.show=true
            },
            getStudentList() {
                ajaxService.getStudentList({
                    examId: this.$route.query.id,
                    page: this.currentPage - 1,
                    limit: this.pageSize,
                    order: this.searchInfo.searchSort,
                    search: this.searchInfo.content
                }).then(res => {
                    if (res.code == 1) {
                        this.stuData = res.data
                        this.total = res.total
                    }
                })
            },
            deleteStudent(Id){
                ajaxService.deleteStudent({studentId:Id,examId:this.examId}).then(res=>{
                    if (res.code===1){
                        this.getStudentList()
                        this.$Message.success(res.msg)
                    }
                })
            },
            submit(name){
                this.$refs[name].validate(valid=>{
                    if (valid){
                        let student=JSON.parse(JSON.stringify(this.studentValidate))
                        student.examId=this.examId
                        ajaxService.updateStudent(student).then(res=>{
                            if(res.code===1){
                                this.show=false
                                this.$Message.success(res.msg)
                                this.getStudentList()
                            }
                        })
                    } else {
                        this.$Message.error('请正确输入!');
                    }
                })
            }
        },
        created() {
            this.getStudentList()
        },
        head(){
            return {
                title:'考生列表'
            }
        }
    }
</script>

<style lang="scss">
    .student-list {
        width: 100%;
        height: 100%;
        padding: 20px 0;
        display: flex;
        flex-direction: column;

        .title {
            display: flex;
            flex: 0 0 auto;
            height: 52px;
            align-items: center;
            border-bottom: 1px solid #eee;

            h2 {
                flex: 1 1 40%;
                line-height: 52px;
                font-size: 30px;
                color: rgb(51, 51, 51);
            }

            .bnt {
                display: flex;
                justify-content: flex-end;
                flex: 1 1 60%;
            }
        }

        .condition {
            display: flex;
            height: 60px;

            .search-content {
                flex: 1 1 50%;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .ivu-form {
                    .ivu-form-item {
                        margin: 0;
                    }
                }
            }

            .page-content {
                flex: 1 1 50%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
        }

        .ivu-table-wrapper {
            .ivu-table {
                .ivu-table-cell {
                    padding: 0;
                }
            }
        }
    }
</style>
