<template>
    <div class="test-paper">
        <div class="title"><h2>预览考卷</h2>
            <div class="btn">
                <Button @click="userBank=true">从个人题库选题</Button>
                <Button @click="publicBank=true">从公共题库选题</Button>
            </div>
        </div>
        <div class="paper-content">
            <div class="exam exam-border">
                <div class="test-title">
                    考卷信息
                </div>
                <Table size="small" :columns="examColumns" :data="examData"></Table>
            </div>
            <div class="tf exam-border">
                <div class="test-title">
                    一、判断题
                </div>
                <Table size="small" :columns="tfColumns" :data="tfData">
                    <template slot-scope="{row,index}" slot="answer">{{row.answer===1?'正确':'错误'}}(2分)</template>
                    <template slot-scope="{row,index}" slot="name">
                        <div class="description" v-html="row.description"></div>
                    </template>
                </Table>
            </div>
            <div class="select exam-border">
                <div class="test-title">
                    二、选择题
                </div>
                <Table size="small" :columns="selectColumns" :data="selectData">
                    <template slot-scope="{row,index}" slot="answer">{{String.fromCharCode(row.answer+65)}}(2分)
                    </template>
                    <template slot-scope="{row,index}" slot="option">
                        <div class="option"><span v-for="(item,index) in row.options.split('<{>}')" :key="index">{{String.fromCharCode(index+65)+'.'+item}}<br/></span>
                        </div>
                    </template>
                    <template slot-scope="{row,index}" slot="name">
                        <div class="description" v-html="row.description"></div>
                    </template>
                </Table>
            </div>
            <div class="gap exam-border">
                <div class="test-title">
                    三、程序填空题
                </div>
                <div class="gap-list">
                    <div class="gap-content" v-for="(item,index) in gapData" :key="item.Id">
                        <h3>{{index+1}}.({{item.gaps.split('<{>}').length*2}}分)</h3>
                        <div class="gaps">
                            <div class="gaps-li" v-for="(it,i) in item.gaps.split('<{>}')" :key="i" :style="`flex:1 1 ${(1/item.gaps.split('<{>}').length)*100}%;`">
                                <div class="gap-id">
                                    空格{{i+1}}正确答案(2分)
                                </div>
                                <div class="gap-con">
                                    {{it}}
                                </div>
                            </div>
                        </div>
                        <div class="description" v-html="item.description">
                        </div>
                        <pre class="code">
                            {{item.code}}
                        </pre>
                    </div>
                </div>
            </div>
            <div class="program exam-border">
                <div class="test-title">
                    四、程序设计题
                </div>
                <div class="pro-list">
                    <div class="pro-content" v-for="(item,index) in proData" :key="item.Id">
                        <h3>{{`${index+1}.${item.title}(${item.score*10}分)`}}</h3>
                        <span class="des">题目描述</span>
                        <div class="description" v-html="item.description"></div>
                        <span class="des">输入描述</span>
                        <div class="description" v-html="item.inputDes"></div>
                        <span class="des">输出描述</span>
                        <div class="description" v-html="item.outputDes"></div>
                        <span class="des">样例输入</span>
                        <div class="description">{{item.sampleInput}}</div>
                        <span class="des">样例输出</span>
                        <div class="description">{{item.sampleOutput}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ajaxService from "../../../utils/ajaxService";

    export default {
        name: "testpaper",
        data() {
            return {
                examId: this.$route.query.id,
                examColumns: [
                    {
                        title: '考试编号',
                        key: 'Id',
                        align: 'center'
                    },
                    {
                        title: '考卷名称',
                        key: 'name',
                        width: 500,
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
                examData: [],
                tfColumns: [
                    {
                        title: '答案',
                        slot: 'answer',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '题目',
                        slot: 'name',
                        align: 'center'
                    }

                ],
                tfData: [],
                selectColumns: [
                    {
                        title: '答案',
                        slot: 'answer',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '选项',
                        slot: 'option',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '题目',
                        slot: 'name',
                        align: 'center'
                    }

                ],
                selectData: [],
                gapData: [],
                proData:[]
            }
        },
        methods: {
            getTestPaper() {
                ajaxService.getTestPaper({examId: this.examId}).then(res => {
                    if (res.code === 1) {
                        let {exam, tf, select, gaps, program} = res.data
                        let tfScore = exam.tf = tf.length * 2
                        let selectScore = exam.select = select.length * 2
                        let gapScore = 0
                        gaps.forEach(gap => {
                            gapScore += (gap.gaps.split('<{>}').length * 2)
                        })
                        exam.gap = gapScore
                        let proScore = 0
                        program.forEach(pro => {
                            proScore += (pro.score * 10)
                        })
                        exam.program = proScore
                        exam.score = tfScore + selectScore + gapScore + proScore
                        this.examData = []
                        this.examData.push(exam)
                        this.tfData = tf
                        this.selectData = select
                        this.gapData = gaps
                        this.proData=program
                    }
                })
            }
        },
        created() {
            this.getTestPaper()
        }
    }
</script>

<style lang="scss">
    .test-paper {
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

        .paper-content {
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

            .description {
                padding: 10px;
            }

            .option {
                padding: 10px;
            }
            .gap{
                .gap-list{
                    width: 100%;
                    .gaps {
                        display: flex;

                        .gaps-li {
                            display: flex;
                            flex-direction: column;

                            .gap-id {
                                width: 100%;
                                flex: 0 0 auto;
                                justify-content: center;
                                align-items: center;
                                display: flex;
                                font-weight: bold;
                                height: 30px;
                                background: #f8f8f9;
                                border-bottom: 1px solid #e8eaec;
                            }

                            .gap-con {
                                flex: 1;
                                display: flex;
                                min-height: 30px;
                                border-bottom: 1px solid #e8eaec;
                                justify-content: center;
                                align-items: center;
                            }
                        }
                    }
                    h3{
                        margin-left: 20px;
                    }
                    .description{
                        margin: 5px 20px;
                        padding: 10px;
                        background: #f8f8f9;
                        border: 1px solid #e8eaec;
                    }
                    .code{
                        margin: 10px 20px;
                        padding: 5px;
                        background: #f8f8f9;
                        border: 1px solid #e8eaec;
                    }
                }
            }
            .program{
                padding: 10px;
                .pro-list{
                    .pro-content{
                        margin-top: 20px;
                        display: flex;
                        flex-direction: column;
                        span{
                            font-weight: bold;
                            line-height: 30px;
                        }
                        .description{
                            background: #f8f8f9;
                            border: 1px solid #e8eaec;
                        }
                    }
                }
            }
        }
    }
</style>
