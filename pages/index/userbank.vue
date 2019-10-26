<template>
    <div class="user-bank">
        <div class="title"><h2>查看我的个人题库</h2><a
                @click="routerTo(menuSelect==1?'/addyesno':menuSelect==2?'/addselect':menuSelect==3?'/addgap':'/addprogram')">{{menuSelect==1?'添加判断题':menuSelect==2?'添加选择题':menuSelect==3?'添加程序填空题':'添加程序设计题'}}</a>
        </div>
        <div class="bank-content">
            <Menu mode="horizontal" theme="light" :active-name="1" @on-select="select">
                <MenuItem :name="1">判断题</MenuItem>
                <MenuItem :name="2">选择题</MenuItem>
                <MenuItem :name="3">程序填空题</MenuItem>
                <MenuItem :name="4">程序设计题</MenuItem>
            </Menu>
            <div class="search-bar">
                <Form inline v-model="search" :loading="loading">
                    <FormItem>
                        <Select v-model="search.id">
                            <Option value="Id">题目编号</Option>
                            <Option value="difficulty">题目难度</Option>
                            <Option value="section">所属章节</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Select v-model="search.sort">
                            <Option :value="0">降序</Option>
                            <Option :value="1">升序</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button @click.native="searchData">查询</Button>
                    </FormItem>
                </Form>
                <div class="page">
                    <Page :current="currentPage" :total="total" :page-size="pageSize" @on-change="pageChange"/>
                </div>
            </div>
            <Table :columns="columns" :data="datas" border>
                <template slot-scope="{row,index}" slot="operation">
                    <a class="read" @click="deleteCorfirm(row.Id)">删除</a>
                    <a class="read" @click="updateSome(row.Id)">修改</a>
                </template>
                <template slot-scope="{row,index}" slot="section">
                    <span>{{getSection(row.section)}}</span>
                </template>
                <template slot-scope="{row,index}" slot="test">
                    <span>{{row.testcount}}个</span>
                    <a @click="testShow(row.Id)">修改</a>
                </template>
            </Table>
        </div>
        <yes-no :userInfo="teacherInfo" :publicc="false" :modalShow="tfshow" v-bind:show.sync="tfshow" :getList="getYesNOList" :Id="tfId"></yes-no>
        <up-select :userInfo="teacherInfo" :publicc="false" :modalShow="selectshow" v-bind:show.sync="selectshow" :getList="getSelectList"
                   :Id="selectId"></up-select>
        <up-gap :userInfo="teacherInfo" :publicc="false" :modalShow="gapshow" v-bind:show.sync="gapshow" :getList="getGapList" :Id="gapId"></up-gap>
        <up-pro :userInfo="teacherInfo" :publicc="false" :modalShow="proshow" v-bind:show.sync="proshow" :getList="getProgramList" :Id="proId"></up-pro>
        <gap-test :modalShow="gapTestShow" v-bind:show.sync="gapTestShow" :Id="gapId" :getList="getGapList"></gap-test>
        <pro-test :modalShow="proTestShow" v-bind:show.sync="proTestShow" :Id="proId" :getList="getProgramList"></pro-test>
    </div>
</template>

<script>
    import ajaxService from "@/utils/ajaxService";
    import sectionModule from "@/assets/Json/sectionModule"
    import updateYesNo from "@/components/updateYesNo"
    import updateSelect from "@/components/updateSelect"
    import updateGap from "@/components/updateGap"
    import updateProgram from "@/components/updateProgram"
    import gapTest from "@/components/gapTest"
    import programTest from "@/components/programTest"

    export default {
        name: "userbank",
        props:['userInfo'],
        components: {
            "yes-no": updateYesNo,
            "up-select": updateSelect,
            "up-gap": updateGap,
            "up-pro": updateProgram,
            "gap-test": gapTest,
            "pro-test": programTest
        },
        data() {
            return {
                search: {
                    id: 'Id',
                    sort: 0
                },
                loading: false,
                tfshow: false,
                teacherInfo:this.userInfo,
                selectshow: false,
                gapshow: false,
                proshow: false,
                tfId: '',
                selectId: '',
                gapId: '',
                proId: '',
                gapTestShow: false,
                proTestShow:false,
                section: sectionModule,
                columns: [],
                TFColumns: [
                    {
                        title: '题目编号',
                        key: 'Id',
                        width: 80
                    },
                    {
                        title: '题目描述',
                        minWidth: 220,
                        render(h, params) {
                            return h('div', {}, params.row.description.replace(/<[^>]+>/g, ""))
                        }
                    },
                    {
                        title: '题目难度',
                        width: 80,
                        key: 'difficulty'
                    },
                    {
                        title: '所属章节',
                        slot: 'section',
                        width: 140
                    },
                    {
                        title: '操作',
                        slot: 'operation',
                        width: 60
                    }
                ],
                gapColumns: [
                    {
                        title: '题目编号',
                        key: 'Id',
                        width: 80
                    },
                    {
                        title: '题目描述',
                        minWidth: 220,
                        render(h, params) {
                            return h('div', {}, params.row.description.replace(/<[^>]+>/g, ""))
                        }
                    },
                    {
                        title: '题目难度',
                        width: 80,
                        key: 'difficulty'
                    },
                    {
                        title: '所属章节',
                        slot: 'section',
                        width: 140
                    },
                    {
                        title: '操作',
                        slot: 'operation',
                        width: 100
                    },
                    {
                        title: '测试数据',
                        slot: 'test',
                        width: 100
                    }
                ],
                SelectColumns: [
                    {
                        title: '题目编号',
                        key: 'Id',
                        width: 80
                    },
                    {
                        title: '题目描述',
                        minWidth: 220,
                        render(h, params) {
                            return h('div', {}, params.row.description.replace(/<[^>]+>/g, ""))
                        }
                    },
                    {
                        title: '题目难度',
                        width: 80,
                        key: 'difficulty'
                    },
                    {
                        title: '所属章节',
                        slot: 'section',
                        width: 140
                    },
                    {
                        title: '操作',
                        slot: 'operation',
                        width: 60
                    }
                ],
                programColumns: [
                    {
                        title: '题目编号',
                        key: 'Id',
                        width: 80
                    },
                    {
                        title: '题目标题',
                        minWidth: 220,
                        key: 'title'
                    },
                    {
                        title: '题目难度',
                        width: 80,
                        key: 'difficulty'
                    },
                    {
                        title: '所属章节',
                        slot: 'section',
                        width: 140
                    },
                    {
                        title: '操作',
                        slot: 'operation',
                        width: 100
                    },
                    {
                        title: '测试数据',
                        slot: 'test',
                        width: 100
                    }
                ],
                datas: [],
                menuSelect: 1,
                currentPage: 1,
                pageSize: 10,
                total: 0,
            }
        },
        watch: {
            menuSelect(value) {
                this.dataFocus(value)
            },
            userInfo(value){
                this.teacherInfo=value
            }
        },
        methods: {
            getSection(section) {
                for (let i = 0; i < this.section.length; i++) {
                    if (this.section[i].key == section)
                        return this.section[i].name
                }
            },
            testShow(Id) {
                if (this.menuSelect === 3) {
                    this.gapTestShow = true
                    this.gapId = Id
                }else if(this.menuSelect === 4) {
                    this.proTestShow = true
                    this.proId = Id
                }
            },
            select(name) {
                this.menuSelect = name
            },
            routerTo(path) {
                this.$router.replace(path)
            },
            updateSome(Id) {
                switch (this.menuSelect) {
                    case 1:
                        this.tfshow = true
                        this.tfId = Id
                        break
                    case 2:
                        this.selectshow = true
                        this.selectId = Id
                        break
                    case 3:
                        this.gapshow = true
                        this.gapId = Id
                        break
                    case 4:
                        this.proshow = true
                        this.proId = Id
                        break
                }
            },
            deleteCorfirm(dataId) {
                this.$Modal.confirm({
                    title: '是否删除该数据',
                    okText: '删除',
                    cancelText: '取消',
                    onOk: () => this.deleteData(dataId)
                })

            },
            deleteData(dataId) {
                switch (this.menuSelect) {
                    case 1:
                        this.deleteTF(dataId)
                        break
                    case 2:
                        this.deleteSelect(dataId)
                        break
                    case 3:
                        this.deleteGap(dataId)
                        break
                    case 4:
                        this.deleteProgram(dataId)
                        break
                }
            },
            deleteTF(tfId) {
                ajaxService.deleteTF({Id: tfId}).then(res => {
                    if (res.code == 1) {
                        this.$Message.success(res.msg)
                    }
                    this.getYesNOList()
                })
            },
            deleteSelect(selectId) {
                ajaxService.deleteSelect({Id: selectId}).then(res => {
                    if (res.code == 1) {
                        this.$Message.success(res.msg)
                    }
                    this.getSelectList()
                })
            },
            deleteGap(gapId) {
                ajaxService.deleteGap({Id: gapId}).then(res => {
                    if (res.code == 1) {
                        this.$Message.success(res.msg)
                    }
                    this.getGapList()
                })
            },
            deleteProgram(proId) {
                ajaxService.deleteProgram({Id: proId}).then(res => {
                    if (res.code == 1) {
                        this.$Message.success(res.msg)
                    }
                    this.getProgramList()
                })
            },
            getYesNOList() {
                this.loading = true
                ajaxService.getTFList({
                    limit: this.pageSize,
                    page: this.currentPage - 1,
                    search: this.search.id,
                    order: this.search.sort,
                    public: 0
                }).then(res => {
                    if (res.code == 1) {
                        this.loading = false
                        this.total = res.total
                        this.datas = res.data
                    }
                })
            },
            getSelectList() {
                this.loading = true
                ajaxService.getSelectList({
                    limit: this.pageSize,
                    page: this.currentPage - 1,
                    search: this.search.id,
                    order: this.search.sort,
                    public: 0
                }).then(res => {
                    if (res.code == 1) {
                        this.loading = false
                        this.total = res.total
                        this.datas = res.data
                    }
                })
            },
            getGapList() {
                this.loading = true
                ajaxService.getGapList({
                    limit: this.pageSize,
                    page: this.currentPage - 1,
                    search: this.search.id,
                    order: this.search.sort,
                    public: 0
                }).then(res => {
                    if (res.code == 1) {
                        this.loading = false
                        this.total = res.total
                        this.datas = res.data
                    }
                })
            },
            getProgramList() {
                this.loading = true
                ajaxService.getProgramList({
                    limit: this.pageSize,
                    page: this.currentPage - 1,
                    search: this.search.id,
                    order: this.search.sort,
                    public: 0
                }).then(res => {
                    if (res.code == 1) {
                        this.loading = false
                        this.total = res.total
                        this.datas = res.data
                    }
                })
            },
            getData() {
                switch (this.menuSelect) {
                    case 1:
                        this.getYesNOList()
                        break
                    case 2:
                        this.getSelectList()
                        break
                    case 3:
                        this.getGapList()
                        break
                    case 4:
                        this.getProgramList()
                        break
                }
            },
            searchData() {
                this.currentPage = 1
                this.getData()
            },
            pageChange(page) {
                this.currentPage = page
                this.getData()
            },
            dataFocus(value) {
                switch (value) {
                    case 1:
                        this.columns = this.TFColumns
                        this.currentPage = 1
                        this.search.id = 'Id'
                        this.search.sort = 0
                        this.getYesNOList()
                        break
                    case 2:
                        this.columns = this.SelectColumns
                        this.currentPage = 1
                        this.search.id = 'Id'
                        this.search.sort = 0
                        this.getSelectList()
                        break
                    case 3:
                        this.columns = this.gapColumns
                        this.currentPage = 1
                        this.search.id = 'Id'
                        this.search.sort = 0
                        this.getGapList()
                        break
                    case 4:
                        this.columns = this.programColumns
                        this.currentPage = 1
                        this.search.id = 'Id'
                        this.search.sort = 0
                        this.getProgramList()
                        break
                }
            },
            delHtmlTag(str) {
                return str.replace(/<[^>]+>/g, "");
            }
        },
        created() {
            this.dataFocus(this.menuSelect)
        },
        head(){
            return {
                title:'个人题库'
            }
        }
    }
</script>

<style lang="scss">
    .user-bank {
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
                flex: 1;
                line-height: 52px;
                font-size: 30px;
                color: rgb(51, 51, 51);
            }

            a {
                flex: 0 0 auto;
                color: #fff;
                background-color: #f0ad4e;
                border-radius: 4px;
                border-color: #eea236;
                font-size: 14px;
                font-weight: 400;
                cursor: pointer;
                width: 110px;
                line-height: 34px;
                text-align: center;
                height: 34px;

            }
        }

        .bank-content {
            flex: 1;

            .ivu-menu {
                display: flex;
                height: 50px;

                .ivu-menu-item {
                    flex: 1 1 25%;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }

        .search-bar {
            display: flex;
            margin-top: 20px;

            .ivu-form {
                flex: 1 50%;
            }

            .page {
                flex: 1 1 50%;
                display: flex;
                justify-content: flex-end;

                .ivu-page {
                    li {
                        margin: 0;
                    }
                }
            }

        }

        .ivu-table-wrapper {
            .ivu-table {
                .ivu-table-header {
                    th {
                        .ivu-table-cell {
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                }

                .ivu-table-body {
                    td {
                        .ivu-table-cell {
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                        }
                    }
                }
            }
        }
    }
</style>
