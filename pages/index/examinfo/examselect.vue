<template>
    <div class="exam-select">
        <div class="title"><h2>选择题</h2>
            <div class="btn">
                <Button @click="userBank=true">从个人题库选题</Button>
                <Button @click="publicBank=true">从公共题库选题</Button>
            </div>
        </div>
        <div class="page">
            <Page :current="currentPage" :page-size="pageSize" :total="total" />
        </div>
        <Table :columns="selectColumns" :data="selectData">
            <template slot="section" slot-scope="{row,index}">
                {{getSection(row.section)}}
            </template>
            <template slot="operation" slot-scope="{row,index}">
                <a @click="updateSelect(row.Id)">修改</a>
                <a @click="deleteSelect(row.Id)">删除</a>
            </template>
        </Table>
        <userSelect :show="userBank" v-bind:show.sync="userBank" :getList="getExamSelectList"></userSelect>
        <publicSelect :show="publicBank" v-bind:show.sync="publicBank" :getList="getExamSelectList"></publicSelect>
        <updateExamSelect :modalShow="upShow" v-bind:show.sync="upShow" :getList="getExamSelectList" :Id="selectId"></updateExamSelect>
    </div>
</template>

<script>
    import userSelect from '@/components/userSelect'
    import publicSelect from '@/components/publicSelect'
    import updateExamSelect from '@/components/updateExamSelect'
    import ajaxService from "../../../utils/ajaxService";
    import sectionModule from '@/assets/Json/sectionModule'

    export default {
        name: "examselect",
        components: {
            userSelect,
            publicSelect,
            updateExamSelect
        },
        data() {
            return {
                userBank: false,
                publicBank: false,
                upShow:false,
                selectId:'',
                selectColumns: [
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
                            return h('div', {}, params.row.description.replace(/<[^>]+>/g, ""))
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
                        title:'分数',
                        width:60,
                        align:'center',
                        key:'score'
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
                        width: 60,
                        align:'center'
                    }
                ],
                selectData:[],
                currentPage:1,
                pageSize:20,
                total:0,
                section:sectionModule,
                examId:this.$route.query.id
            }
        },
        methods:{
            updateSelect(Id){
                this.selectId=Id
                this.upShow=true
            },
            getSection(section) {
                for (let i = 0; i < this.section.length; i++) {
                    if (this.section[i].key == section)
                        return this.section[i].name
                }
            },
            deleteSelect(Id){
                this.$Modal.confirm({
                    title:'确认删除该条数据？',
                    onOk:()=>this.deleteExamSelect(Id),
                    okText:'确认',
                    cancelText:'取消'
                })
            },
            deleteExamSelect(Id){
                ajaxService.deleteExamSelect({Id:Id,examId:this.examId}).then(res=>{
                    if (res.code==1){
                        this.$Message.success(res.msg)
                        this.getExamSelectList()
                    }
                })
            },
            getExamSelectList(){
                ajaxService.getExamSelectList({limit:this.pageSize,page:this.currentPage-1,examId: this.examId}).then(res=>{
                    if (res.code==1){
                        this.total=res.total
                        this.selectData=res.data
                    }
                })
            }
        },
        created() {
            this.getExamSelectList()
        }
    }
</script>

<style lang="scss">
    .exam-select {
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
