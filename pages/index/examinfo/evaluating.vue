<template>
    <div class="evaluating">
        <div class="title"><h2>{{title}} 考试评测</h2>
            <div class="btn">
            </div>
        </div>
        <Alert type="error" closable>
            {{alertContent}}
        </Alert>
        <div class="eval" v-if="examStatus==='ending'">
            <Button type="warning" @click="tfEvaluating" :disabled="test">{{test?'':'评测判断题'}}
                <Spin v-if="test"></Spin>
            </Button>
            <Button type="warning" :disabled="test" @click="selectEvaluating">{{test?'':'评测选择题'}}
                <Spin v-if="test"></Spin>
            </Button>
            <Button type="warning" :disabled="test" @click="gapEvaluating">{{test?'':'评测程序填空题'}}
                <Spin v-if="test"></Spin>
            </Button>
        </div>
        <div class="condition">
            <div class="search-content">
                <Form inline :model="searchInfo">
                    <FormItem><Select v-model="searchInfo.content">
                        <Option value="studentId">学号</Option>
                        <Option value="name">姓名</Option>
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
        </div>
        <Table :loading="test" :columns="studentColumns" :data="studentData"></Table>
    </div>
</template>

<script>
    import ajaxService from "../../../utils/ajaxService";
    import {getExamStatus} from "../../../utils/commonUtil"
    export default {
        name: "evaluating",
        data() {
            return {
                examId: this.$route.query.id,
                searchInfo: {
                    content: 'studentId',
                    searchSort: 0,
                },
                title: '',
                tftimer: null,
                proStatus: 0,
                tfStatus: 0,
                selectStatus: 0,
                gapStatus: 0,
                test: false,
                alertContent: '填空题评测较慢，请各位老师耐心等待~~',
                examStatus: 0,
                studentColumns: [
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
                        title: '判断题',
                        key: 'tfScore',
                        align: 'center'
                    },
                    {
                        title: '选择题',
                        key: 'selectScore',
                        align: 'center'
                    },
                    {
                        title: '程序填空题',
                        key: 'gapScore',
                        align: 'center'
                    },
                    {
                        title: '程序设计题',
                        key: 'proScore',
                        align: 'center'
                    },
                    {
                        title: '总分',
                        key: 'score',
                        align: 'center'
                    }
                ],
                studentData: [],
                selecttimmer: null,
                gaptimmer: null
            }
        },
        watch: {
            tfStatus(value) {
                if (value === 1) {
                    this.tftimer = setInterval(this.getExamInfo, 500)
                    this.alertContent = "判断题正在评测中"
                } else {
                    clearInterval(this.tftimer)
                }
            },
            gapStatus(value) {
                if (value === 1) {
                    this.gaptimer = setInterval(this.getExamInfo, 500)
                    this.alertContent = "填空题正在评测中"
                } else {
                    clearInterval(this.gaptimer)
                }
            },
            selectStatus(value) {
                if (value === 1) {
                    this.selecttimer = setInterval(this.getExamInfo, 500)
                    this.alertContent = "选择题正在评测中"
                } else {
                    clearInterval(this.selecttimer)
                }
            },
            test(value) {
                if (!value) {
                    this.alertContent = "填空题评测较慢，请各位老师耐心等待~~"
                }
            }
        },
        methods: {
            getStudentList() {
                let {searchInfo, examId} = this
                ajaxService.getStudentList({
                    examId,
                    search: searchInfo.content,
                    order: searchInfo.searchSort,
                    limit: 10000,
                    page: 0
                }).then(res => {
                    if (res.code === 1) {
                        let data = res.data
                        for (let i = 0; i < data.length; i++) {
                            if (this.proStatus !== 2) {
                                data[i].proScore = '--'
                            }
                            if (this.tfStatus !== 2) {
                                data[i].tfScore = '--'
                            }
                            if (this.selectStatus !== 2) {
                                data[i].selectScore = '--'
                            }
                            if (this.gapStatus !== 2) {
                                data[i].gapScore = '--'
                            }
                        }
                        this.studentData = res.data
                    }
                })
            },
            getExamInfo() {
                return ajaxService.getExamInfo({examId: this.examId}).then(res => {
                    if (res.code === 1) {
                        this.title = res.data.name
                        this.examStatus=getExamStatus(res.data.finish)
                        this.tfStatus = res.data.tfstatus
                        this.selectStatus = res.data.selectstatus
                        this.gapStatus = res.data.gapstatus
                        if (res.data.tfstatus !== 1 && res.data.selectstatus !== 1 && res.data.gapstatus !== 1) {
                            this.getStudentList()
                            this.test = false
                        }
                        if (res.data.tfstatus === 1 || res.data.selectstatus === 1 || res.data.gapstatus === 1) {
                            this.test = true
                        }
                    }
                })
            },
            tfEvaluating() {
                this.test = true
                return ajaxService.tfEvaluating({examId: this.examId}).then(res => {
                    if (res.code === 1) {
                        this.getExamInfo()
                    }
                })
            },
            selectEvaluating() {
                this.test = true
                return ajaxService.selectEvaluating({examId: this.examId}).then(res => {
                    if (res.code === 1) {
                        this.getExamInfo()
                    }
                })
            },
            gapEvaluating() {
                this.test = true
                return ajaxService.gapEvaluating({examId: this.examId}).then(res => {
                    if (res.code === 1) {
                        this.getExamInfo()
                    }
                })
            },
            getProgramStatus() {
                return ajaxService.getProgramStatus({examId: this.examId}).then(res => {
                    if (res.code === 1) {
                        this.proStatus = res.data.status
                    }
                })
            },
        },
        mounted() {
            let getProgramStatus = this.getProgramStatus()
            Promise.all([getProgramStatus]).then(res => {
                let getExamInfo = this.getExamInfo()
                Promise.all([getExamInfo]).then(res => {
                    this.getStudentList()
                })
            })
        },
        head(){
            return {
                title:this.title+'考试评测'
            }
        }
    }
</script>

<style lang="scss">
    .evaluating {
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

        .ivu-alert {
            height: 50px;
            padding: 0 10px;
            margin-top: 20px;
            background: #f2dede;
            border-color: #ebccd1;

            span {
                color: #a94442;
                line-height: 50px;
            }
        }

        .eval {
            .ivu-btn {
                width: 120px;
                text-align: center;
                margin-right: 20px;
                background: #f90;
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
    }
</style>
