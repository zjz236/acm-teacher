<template>
    <div class="student-list">
        <div class="title"><h2>考生列表</h2>
            <div class="bnt">
                <Button @click.native="routerTo('/examinfo/addstudent')">添加考生</Button>
                <Button>导出学生信息</Button>
                <Button @click.native="routerTo('/examinfo/uploadstudent')">导入学生信息</Button>
                <Button>下载所有学生试卷</Button>
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
        </Table>
    </div>
</template>

<script>
    import ajaxService from '../../../utils/ajaxService';

    export default {
        name: "studentlist",
        data() {
            return {
                examInfo: {},
                currentPage: 1,
                pageSize: 20,
                total:0,
                searchInfo: {
                    content: 'username',
                    searchSort: 0
                },
                columns:[
                    {
                        title:'登录账号',
                        key:'username',
                        align:'center'
                    },
                    {
                        title:'登录密码',
                        key:'password',
                        align:'center'
                    },
                    {
                        title:'学号',
                        key:'studentId',
                        align:'center'
                    },
                    {
                        title:'姓名',
                        key:'name',
                        align:'center'
                    },
                    {
                        title:'性别',
                        slot:'sex',
                        align:'center'
                    },
                    {
                        title:'学校',
                        key:'school',
                        align:'center'
                    },
                    {
                        title:'学院',
                        key:'college',
                        align:'center'
                    },
                    {
                        title:'专业',
                        key:'major',
                        align:'center'
                    },
                    {
                        title:'分数',
                        slot:'score',
                        align:'center'
                    },
                    {
                        title:'操作',
                        key:'operation',
                        align:'center'
                    },
                    {
                        title:'考卷',
                        key:'read',
                        align:'center'
                    }
                ],
                stuData:[]
            }
        },
        methods: {
            routerTo(path) {
                path = path + '?id=' + this.$route.query.id
                this.$router.replace(path)
            },
            pageChange(e){
                this.currentPage=e
                this.getStudentList()
            },
            getExamInfo() {
                let examId = this.$route.query.id
                ajaxService.getExamInfo({examId}).then(res => {
                    if (res.code == 1) {
                        this.examInfo = res.data
                    }
                })
            },
            getStudentList() {
                ajaxService.getStudentList({
                    examId: this.$route.query.id,
                    page: this.currentPage - 1,
                    limit: this.pageSize,
                    order: this.searchInfo.searchSort,
                    search: this.searchInfo.content
                }).then(res => {
                    if (res.code==1){
                        this.stuData=res.data
                        this.total=res.total
                    }
                })
            }
        },
        created() {
            this.getStudentList()
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
        .condition{
            display: flex;
            height: 60px;
            .search-content{
                flex: 1 1 50%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .ivu-form{
                    .ivu-form-item{
                        margin: 0;
                    }
                }
            }
            .page-content{
                flex:1 1 50%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
        }
        .ivu-table-wrapper{
            .ivu-table{
                .ivu-table-cell{
                    padding: 0;
                }
            }
        }
    }
</style>
