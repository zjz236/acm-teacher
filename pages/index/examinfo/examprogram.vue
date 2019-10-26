<template>
    <div class="exam-gap">
        <div class="title"><h2>程序设计题</h2>
            <div class="btn">
                <Button @click="userBank=true">从个人题库选题</Button>
                <Button @click="publicBank=true">从公共题库选题</Button>
            </div>
        </div>
        <div class="page">
            <Page :current="currentPage" :page-size="pageSize" :total="total" />
        </div>
        <Table :columns="gapColumns" :data="gapData">
            <template slot="section" slot-scope="{row,index}">
                {{getSection(row.section)}}
            </template>
            <template slot="test" slot-scope="{row,index}">
                <span>{{row.test}}个</span>
                <a @click="showTest(row.Id)">修改</a>
            </template>
            <template slot="operation" slot-scope="{row,index}">
                <a @click="updateProgram(row.Id)">修改</a>
                <a @click="deleteExamProgram(row.Id)">删除</a>
            </template>
        </Table>
        <userProgram :show="userBank" v-bind:show.sync="userBank" :getList="getExamProgramList"></userProgram>
        <publicProgram :show="publicBank" v-bind:show.sync="publicBank" :getList="getExamProgramList"></publicProgram>
        <updateExamProgram :modalShow="upShow" v-bind:show.sync="upShow" :getList="getExamProgramList" :Id="programId"></updateExamProgram>
        <examProgramTest :modalShow="testShow" v-bind:show.sync="testShow" :getList="getExamProgramList" :Id="programId"></examProgramTest>
    </div>
</template>

<script>
    import userProgram from '@/components/userProgram'
    import publicProgram from '@/components/publicProgram'
    import updateExamProgram from '@/components/updateExamProgram'
    import examProgramTest from '@/components/examProgramTest'
    import ajaxService from "../../../utils/ajaxService";
    import sectionModule from '@/assets/Json/sectionModule'

    export default {
        name: "examgap",
        components: {
            userProgram,
            publicProgram,
            updateExamProgram,
            examProgramTest
        },
        data() {
            return {
                userBank: false,
                publicBank: false,
                upShow:false,
                testShow:false,
                programId:'',
                gapColumns: [
                    {
                        title: '题目编号',
                        key: 'Id',
                        width: 80,
                        align:'center'
                    },
                    {
                        title: '题目描述',
                        minWidth: 220,
                        render(h, params) {
                            return h('div', {}, params.row.title)
                        },
                        align:'center'
                    },
                    {
                        title: '题目难度',
                        width: 80,
                        key: 'difficulty',
                        align:'center'
                    },
                    {
                        title: '分数',
                        key: 'score',
                        width: 60,
                        align:'center'
                    },
                    {
                        title: '所属章节',
                        slot: 'section',
                        width: 140,
                        align:'center'
                    },
                    {
                        title: '操作',
                        slot: 'operation',
                        width: 100,
                        align:'center'
                    },
                    {
                        title: '测试数据',
                        slot: 'test',
                        width: 100,
                        align:'center'
                    }
                ],
                gapData:[],
                currentPage:1,
                pageSize:20,
                total:0,
                section:sectionModule,
                examId:this.$route.query.id
            }
        },
        methods:{
            showTest(Id){
                this.programId=Id
                this.testShow=true
            },
            updateProgram(Id){
                this.programId=Id
                this.upShow=true
            },
            getSection(section) {
                for (let i = 0; i < this.section.length; i++) {
                    if (this.section[i].key == section)
                        return this.section[i].name
                }
            },
            deleteGap(Id){
                this.$Modal.confirm({
                    title:'确认删除该条数据？',
                    onOk:()=>this.deleteExamGap(Id),
                    okText:'确认',
                    cancelText:'取消'
                })
            },
            deleteExamProgram(Id){
                ajaxService.deleteExamProgram({Id:Id,examId:this.examId}).then(res=>{
                    if (res.code==1){
                        this.$Message.success(res.msg)
                        this.getExamProgramList()
                    }
                })
            },
            getExamProgramList(){
                ajaxService.getExamProgramList({limit:this.pageSize,page:this.currentPage-1,examId: this.examId}).then(res=>{
                    if (res.code==1){
                        this.total=res.total
                        this.gapData=res.data
                        console.log(this.gapData)
                    }
                })
            }
        },
        created() {
            this.getExamProgramList()
        },
        head(){
            return {
                title:'程序设计题'
            }
        }
    }
</script>

<style lang="scss">
    .exam-gap {
        display: flex;
        padding: 20px 0;
        flex-direction: column;

        .title {
            display: flex;
            flex: 0 0 auto;
            height: 52px;
            align-items: center;
            border-bottom: 1px solid #eee;

            h2 {
                flex: 1;
                line-height: 52px;
                font-size: 30px;
                color: rgb(51, 51, 51);
            }

        }
        .page{
            height: 50px;
            display: flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: flex-end;
        }
        .ivu-table-cell{
            padding: 0;
        }
    }
</style>
