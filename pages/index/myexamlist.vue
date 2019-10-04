<template>
    <div class="exam-list">
        <div class="title"><h2>我的考试</h2>
            <nuxt-link to="/addexam">添加我的考试</nuxt-link>
        </div>
        <div class="search-bar">
            <div class="search"><Input v-model="searchData" search placeholder="考试名称" @on-search="search()"></Input>
            </div>
            <div class="page">
                <Page :current="page" :total="total" :page-size="pageSize" @on-change="(page)=>pageChange(page)"/>
            </div>
        </div>
        <div class="content">
            <Table :loading="loading" :height="500" border :columns="columns" :data="datas" size="small">
                <template slot="start" slot-scope="{row,index}">
                    <span>{{getAllTime(row.start)}}</span>
                </template>
                <template slot="finish" slot-scope="{row,index}">
                    <span>{{getAllTime(row.finish)}}</span>
                </template>
                <template slot="operation" slot-scope="{row,index}">
                    <a @click="routerTo(`/examinfo/editexam?id=${row.Id}`)" replace class="manage">管理</a>
                    <a class="feedback">难度反馈</a>
                </template>
            </Table>
        </div>
    </div>
</template>

<script>

    import ajaxService from '../../utils/ajaxService';

    export default {
        name: "myExamList",
        data() {
            return {
                pageSize: 10,
                total: 0,
                page: 1,
                searchData: '',
                isSearch: false,
                loading: false,
                columns: [
                    {
                        title: '考试编号',
                        key: 'Id',
                        className: 'id',
                        width: 60
                    },
                    {
                        title: '考试名称',
                        key: 'name',
                        className: 'name',
                        minWidth: 200
                    },
                    {
                        title: '开始时间',
                        slot: 'start',
                        className: 'start',
                        width: 110
                    },
                    {
                        title: '结束时间',
                        slot: 'finish',
                        className: 'end',
                        width: 110
                    },
                    {
                        title: '考试状态',
                        key: 'status',
                        className: 'status',
                        width: 100,
                        render(h, props) {
                            return h('div', {}, [h('span', {}, props.row.status === 0 ? '未开始' : (props.row.status === 1 ? '进行中' : '已结束'))]);
                        }
                    },
                    {
                        title: '考试类型',
                        key: 'type',
                        className: 'type',
                        width: 80,
                        render(h, props) {
                            return h('div', {},   props.row.isread === 1 ? '可见' : '隐藏');
                        }
                    },
                    {
                        title: '操作',
                        slot: 'operation',
                        width: 100,
                        className: 'operation'
                    }
                ],
                datas: []
            }
        },
        methods: {
            search() {
                this.page = 1;
                this.loadData(this.searchData)
                this.isSearch = true
            },
            routerTo(path) {
                this.$router.replace(path)
            },
            pageChange(p) {
                this.page = p
                this.isSearch ? this.loadData(this.searchData) : this.loadData()
            },
            loadData(search) {
                this.loading = true
                ajaxService.getExam({
                    limit: this.pageSize,
                    page: this.page - 1,
                    search: search ? search : ''
                }).then(res => {
                    if (res.code == 1) {
                        this.datas = res.data
                        this.total = res.total
                        this.loading = false
                    }
                })
            },
            getAllTime(time) {
                time=new Date(time)
                let y = time.getFullYear(),m = time.getMonth()+1,d = time.getDate(),h = time.getHours(),mm = time.getMinutes(),s = time.getSeconds()
                m<10&&(m='0'+m)
                d<10&&(d='0'+d)
                h<10&&(h='0'+h)
                mm<10&&(mm='0'+mm)
                s<10&&(s='0'+s)
                return y+'-'+m+'-'+d+' '+h+':'+mm+':'+s
            }
        },
        components: {},
        created() {
            this.loadData()
        }
    }
</script>

<style lang="scss">
    .exam-list {
        width: 100%;
        height: 100%;
        padding: 20px 40px;

        .title {
            display: flex;
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

        .search-bar {
            display: flex;
            margin-top: 20px;

            .search {
                flex: 1 1 50%;

                .ivu-input-wrapper {
                    width: 230px;
                    height: 32px;
                }
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

        .content {
            margin-top: 20px;

            .ivu-table-wrapper {
                .ivu-table {
                    font-size: 10px;

                    .ivu-table-header {
                        .ivu-table-cell {
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }

                    .ivu-table-body {
                        .ivu-table-row {
                            .ivu-table-cell {
                                padding: 0;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        }

                        .operation {
                            .manage {
                                display: inline-block;
                                color: #fff;
                                background-color: #5cb85c;
                                border-color: #4cae4c;
                                height: 18px;
                                line-height: 18px;
                                width: 32px;
                                border-radius: 2px;
                                text-align: center;
                            }

                            .feedback {
                                display: inline-block;
                                color: #fff;
                                background-color: #f0ad4e;
                                border-color: #eea236;
                                height: 18px;
                                line-height: 18px;
                                width: 50px;
                                border-radius: 2px;
                                text-align: center;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
