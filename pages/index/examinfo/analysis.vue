<template>
    <div class="analysis">
        <div class="title"><h2>试卷分析</h2>
        </div>
        <div class="analysis-content">
            <div class="exam exam-border">
                <div class="test-title">
                    基本信息
                </div>
                <Table size="small" :columns="examColumns" border :data="examData"></Table>
            </div>
            <div class="part exam-border">
                <div class="test-title">
                    各部分得分
                </div>
                <Table size="small" :columns="partColumns" border :data="partData"></Table>
            </div>
            <div class="score exam-border">
                <div class="test-title">
                    各分数段人数
                </div>
                <Table size="small" :columns="scoreColumns" border :data="scoreData"></Table>
            </div>
            <div class="notlogin exam-border">
                <div class="test-title">
                    缺席人数
                </div>
                <Table size="small" :columns="loginColumns" border :data="loginData">
                    <template slot-scope="{row,index}" slot="sex">
                        <span>{{row.sex===1?'男':'女'}}</span>
                    </template>
                </Table>
            </div>
            <div class="tf exam-border">
                <div class="test-title">
                    一、判断题
                </div>
                <Table size="small" :columns="tfColumns" border :data="tfData">
                    <template slot-scope="{row,index}" slot="Id"><span>{{index+1}}</span></template>
                    <template slot-scope="{row,index}" slot="correct"><i-circle :size="90" :percent="(row.correct/row.submit)*100"><span class="demo-Circle-inner">{{(row.correct/row.submit)*100}}%({{`${row.correct}/${row.submit}`}})</span></i-circle></template>
                    <template slot-scope="{row,index}" slot="distribute"><span v-if="row.submit!==studentLength">未作答人数:{{studentLength-row.submit}}</span></template>
                </Table>
            </div>
            <div class="select exam-border">
                <div class="test-title">
                    二、选择题
                </div>
                <Table size="small" :columns="selectColumns" border :data="selectData">
                    <template slot-scope="{row,index}" slot="Id"><span>{{index+1}}</span></template>
                    <template slot-scope="{row,index}" slot="correct"><i-circle :size="90" :percent="(row.correct/row.submit)*100"><span class="demo-Circle-inner">{{(row.correct/row.submit)*100}}%({{`${row.correct}/${row.submit}`}})</span></i-circle></template>
                    <template slot-scope="{row,index}" slot="distribute"><span v-for="(item,key) in row.options" :key="key" v-if="/^[A-Z]*$/.test(key)">{{key}}:{{item}},</span><span>未作答:{{studentLength-row.submit}}</span></template>
                </Table>
            </div>
            <div class="gap exam-border">
                <div class="test-title">
                    三、程序填空题
                </div>
                <Table size="small" :columns="gapColumns" border :data="gapData">
                    <template slot-scope="{row,index}" slot="Id"><span>程序填空题 - {{index+1}}</span></template>
                    <template slot-scope="{row,index}" slot="correct"><div class="correct"><div class="correct-li" v-for="(item,key,index) in row" v-if="/^[0-9]*$/.test(key)" :key="key" :style="index!=0?'border-top:1px solid #e8eaec;':''"><i-circle :size="90" :percent="(item.correct/item.submit)*100"><span class="demo-Circle-inner">{{(item.correct/item.submit)*100}}%<br/>({{`${item.correct}/${item.submit},未提交:${studentLength-item.submit}`}})</span></i-circle></div></div></template>
                    <template slot-scope="{row,index}" slot="empty"><div class="empty"><div class="empty-li" v-for="(item,key,index) in row" v-if="/^[0-9]*$/.test(key)" :key="key" :style="index!=0?'border-top:1px solid #e8eaec;':''">空格 - {{parseInt(key)+1}}</div></div></template>
                </Table>
            </div>
            <div class="program exam-border">
                <div class="test-title">
                    四、程序设计题
                </div>
                <Table size="small" :columns="programColumns" border :data="programData">
                    <template slot-scope="{row,index}" slot="Id"><span>程序设计题 - {{index+1}}</span></template>
                    <template slot-scope="{row,index}" slot="correct"><div class="correct"><div class="correct-li" v-for="(item,key,index) in row" v-if="/^[0-9]*$/.test(key)" :key="key" :style="index!=0?'border-top:1px solid #e8eaec;':''"><i-circle :size="90" :percent="(item.correct/item.submit)*100"><span class="demo-Circle-inner">{{(item.correct/item.submit)*100}}%<br/>({{`${item.correct}/${item.submit},未提交:${studentLength-item.submit}`}})</span></i-circle></div></div></template>
                    <template slot-scope="{row,index}" slot="empty"><div class="empty"><div class="empty-li" v-for="(item,key,index) in row" v-if="/^[0-9]*$/.test(key)" :key="key" :style="index!=0?'border-top:1px solid #e8eaec;':''">测试数据 - {{parseInt(key)+1}}</div></div></template>
                </Table>
            </div>
        </div>
    </div>
</template>

<script>
    import ajaxService from "../../../utils/ajaxService";

    export default {
        name: "analysis",
        data() {
            return {
                examColumns: [
                    {
                        title: '考试编号',
                        key: 'Id',
                        align: 'center'
                    },
                    {
                        title: '考试名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '应考人数',
                        key: 'all',
                        align: 'center'
                    },
                    {
                        title: '实考人数',
                        key: 'practical',
                        align: 'center'
                    }
                ],
                examData: [],
                partColumns: [
                    {
                        title: '题型',
                        key: 'types',
                        align: 'center'
                    },
                    {
                        title: '判断题',
                        key: 'tf',
                        align: 'center'
                    },
                    {
                        title: '选择题',
                        key: 'select',
                        align: 'center'
                    },
                    {
                        title: '程序填空题',
                        key: 'gap',
                        align: 'center'
                    },
                    {
                        title: '程序设计题',
                        key: 'program',
                        align: 'center'
                    },
                    {
                        title: '总分',
                        key: 'score',
                        align: 'center'
                    }
                ],
                partData: [],
                scoreColumns:[
                    {
                        title:'分数段',
                        key:'title',
                        align:'center'
                    },
                    {
                        title:'0~9',
                        key:'zero',
                        align:'center'
                    },
                    {
                        title:'10~19',
                        key:'ten',
                        align:'center'
                    },
                    {
                        title:'20~29',
                        key:'twenty',
                        align:'center'
                    },
                    {
                        title:'30~39',
                        key:'thirty',
                        align:'center'
                    },
                    {
                        title:'40~49',
                        key:'forty',
                        align:'center'
                    },
                    {
                        title:'50~59',
                        key:'fifty',
                        align:'center'
                    },
                    {
                        title:'60~69',
                        key:'sixty',
                        align:'center'
                    },
                    {
                        title:'70~79',
                        key:'seventy',
                        align:'center'
                    },
                    {
                        title:'80~89',
                        key:'eighty',
                        align:'center'
                    },
                    {
                        title:'90及以上',
                        key:'ninety',
                        align:'center'
                    }

                ],
                scoreData:[],
                loginColumns:[
                    {
                        title:'登录账号',
                        key:'username',
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
                    }
                ],
                loginData:[],
                studentLength:0,
                tfColumns:[
                    {
                        title:'题目编号',
                        slot:'Id',
                        width:80,
                        align:'center'
                    },
                    {
                        title:'正确率',
                        slot:'correct',
                        align:'center'
                    },
                    {
                        title:'作答分布',
                        slot:'distribute',
                        align:'center'
                    }
                ],
                tfData:[],
                selectColumns:[
                    {
                        title:'题目编号',
                        slot:'Id',
                        width:80,
                        align:'center'
                    },
                    {
                        title:'正确率',
                        slot:'correct',
                        align:'center'
                    },
                    {
                        title:'作答分布',
                        slot:'distribute',
                        align:'center'
                    }
                ],
                selectData:[],
                gapColumns:[
                    {
                        title:'题目编号',
                        slot:'Id',
                        width:80,
                        align:'center'
                    },
                    {
                        title:'空格编号',
                        slot:'empty',
                        className:'empty-id',
                        align:'center',
                    },
                    {
                        title:'正确率',
                        slot:'correct',
                        align:'center'
                    }
                ],
                gapData:[],
                programColumns:[
                    {
                        title:'题目编号',
                        slot:'Id',
                        width:80,
                        align:'center'
                    },
                    {
                        title:'测试编号',
                        slot:'empty',
                        className:'empty-id',
                        align:'center',
                    },
                    {
                        title:'正确率',
                        slot:'correct',
                        align:'center'
                    }
                ],
                programData:[],
                examId: this.$route.query.id
            }
        },
        methods: {
            examAnalysis() {
                ajaxService.examAnalysis({examId: this.examId}).then(res => {
                    if (res.code === 1) {
                        this.examData=[{
                            Id: res.data.examId,
                            name: res.data.examName,
                            all: res.data.studentNum,
                            practical: res.data.loginNum
                        }]
                        this.studentLength=res.data.studentNum
                        this.partData = [
                            {
                                types: '最高分',
                                tf: res.data.truefalse.max,
                                select: res.data.select.max,
                                gap: res.data.gap.max,
                                program: res.data.program.max,
                                score: res.data.allScore.max,
                            },
                            {
                                types: '最低分',
                                tf: res.data.truefalse.min,
                                select: res.data.select.min,
                                gap: res.data.gap.min,
                                program: res.data.program.min,
                                score: res.data.allScore.min,
                            },
                            {
                                types: '平均分',
                                tf: res.data.truefalse.ave,
                                select: res.data.select.ave,
                                gap: res.data.gap.ave,
                                program: res.data.program.ave,
                                score: res.data.allScore.ave,
                            },
                        ]
                        this.scoreData=[res.data.score]
                        this.scoreData[0].title='人数'
                        this.loginData=res.data.notLogin
                        this.tfData=res.data.truefalse.answer
                        this.selectData=res.data.select.answer
                        this.gapData=res.data.gap.answer
                        this.programData=res.data.program.answer
                    }
                })
            },
        },
        created() {
            this.examAnalysis()
        }
    }
</script>

<style lang="scss">
    .analysis {
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

        .analysis-content {

            .exam-border {
                border: 1px solid #337ab7;
                display: flex;
                border-radius: 5px;
                margin-top: 20px;
                flex-direction: column;
            }

            .test-title {
                background: #337ab7;
                color: #fff;
                padding: 5px;
                flex: 0 0 auto;
                line-height: 30px;
            }

            .ivu-table-cell {
                padding: 0;
            }
            .gap{
                .empty-li{
                    height: 95px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .correct-li{
                    height: 95px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            .program{
                .empty-li{
                    height: 95px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .correct-li{
                    height: 95px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }

    }
</style>
