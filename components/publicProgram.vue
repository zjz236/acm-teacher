<template>
    <Modal :width="900" v-model="modalShow" title="从公共题库选题"  @on-cancel="cancelModal">
        <div class="user-gap">
            <div class="search-bar">
                <Select placeholder="按章节选择" v-model="search" @on-change="searchData"><Option v-for="item in section" :key="item.key" :value="item.key">{{item.name}}</Option></Select>
                <div class="page">
                    <Page :current="currentPage" :total="total" :page-size="pageSize" @on-change="pageChange"/>
                </div>
            </div>
            <Table :columns="SelectColumns" :data="SelectDatas" @on-selection-change="selectChange" :loading="load">
                <template slot-scope="{row,index}" slot="section">
                    <span>{{getSection(row.section)}}</span>
                </template>
                <template slot-scope="{row,index}" slot="operation">
                    <a @click="addExamProgram([row.Id])" v-if="!row._disabled">添加</a>
                    <span v-else>已添加</span>
                </template>
            </Table>
        </div>
        <div slot="footer"><Button type="primary" @click.native="addExamProgram(selectId)">添加</Button></div>
    </Modal>
</template>

<script>
    import sectionModule from '@/assets/Json/sectionModule'
    import ajaxService from "../utils/ajaxService";
    export default {
        name: "publicProgram",
        props: ['show','getList'],
        watch: {
            show(value) {
                this.modalShow = value
                this.currentPage=1
                this.search=''
                if (value==true){
                    this.getUserProgram()
                }
            }
        },
        data() {
            return {
                load:false,
                modalShow: this.show,
                search:'',
                section:sectionModule,
                SelectColumns: [
                    {
                        width:30,
                        type: 'selection',
                        align:'center',
                    },
                    {
                        title: '题目编号',
                        key: 'Id',
                        align:'center',
                        width: 80,
                    },
                    {
                        title: '题目描述',
                        minWidth: 200,
                        align:'center',
                        render(h, params) {
                            return h('div', {}, params.row.description.replace(/<[^>]+>/g, ""))
                        }
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
                SelectDatas:[],
                selectId:[],
                menuSelect: 1,
                currentPage: 1,
                pageSize: 20,
                total: 0,
                examId:this.$route.query.id
            }
        },
        methods:{
            getSection(section) {
                for (let i = 0; i < this.section.length; i++) {
                    if (this.section[i].key == section)
                        return this.section[i].name
                }
            },
            selectChange(select){
                this.selectId=select.map(v=>v.Id)
            },
            cancelModal(){
                this.$emit('update:show',false)
            },
            pageChange(page) {
                this.currentPage = page
                this.getUserProgram()
            },
            addExamProgram(data){
                if (data.length==0){
                    this.$Message.error('请先勾选题目')
                    return
                }
                ajaxService.addExamProgram({public:1,examId:this.examId,data}).then(res=>{
                    if (res.code==1){
                        this.getUserProgram()
                        this.getList()
                    }
                })
            },
            searchData(e) {
                this.currentPage=1
                this.search=e
                this.getUserProgram()
            },
            getUserProgram(){
                this.load=true
                ajaxService.getUserProgram({examId:this.examId,section:this.search,limit:this.pageSize,page:this.currentPage-1,public:1}).then(res=>{
                    if (res.code==1){
                        for (let i=0;i<res.data.length;i++){
                            if (res.data[i].option==1){
                                res.data[i]._disabled=true
                            }
                        }
                        this.SelectDatas=res.data
                        this.total=res.total
                        this.load=false
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .user-gap {
        .search-bar {
            display: flex;
            margin-top: 10px;
            .ivu-select{
                flex: 0 0 auto;
                width: 200px;
            }

            .page {
                flex: 1;
                display: flex;
                justify-content: flex-end;

                .ivu-page {
                    li {
                        margin: 0;
                    }
                }
            }

        }
        .ivu-table-wrapper{
            margin-top: 20px;
        }
        .ivu-table-cell{
            padding: 0;
        }
    }
</style>
