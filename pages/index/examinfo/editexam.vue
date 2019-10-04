<template>
    <div class="edit-exam">
        <div class="title"><h2>编辑我的考试</h2></div>
        <div class="edit-content">
            <Form :model="formValidate" ref="examValidate" label-position="right" :label-width="100" :rules="examRules">
                <FormItem label="考试编号">
                    <Input v-model="formValidate.id" disabled></Input>
                </FormItem>
                <FormItem label="考试名称" prop="name">
                    <Input v-model="formValidate.name"></Input>
                </FormItem>
                <FormItem label="是否可见">
                    <Checkbox v-model="formValidate.isRead"></Checkbox>
                </FormItem>
                <FormItem label="考试开始时间">
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :value="formValidate.start"
                                @on-change="(date,datenow)=>{formValidate.start=date}"></DatePicker>
                </FormItem>
                <FormItem label="持续时间">
                    <Row>
                        <Col span="5">
                            <FormItem>
                                <Select v-model="formValidate.date">
                                    <Option v-for="index in 31" :key="index-1" :value="index-1">{{index-1}}</Option>
                                    <Icon type="ios-contact" slot="suffix"/>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="1">
                            <span>天</span>
                        </Col>
                        <Col span="5">
                            <FormItem>
                                <Select v-model="formValidate.hour">
                                    <Option v-for="index in 24" :key="index-1" :value="index-1">{{index-1}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="1">
                            <span>时</span>
                        </Col>
                        <Col span="5">
                            <FormItem>
                                <Select v-model="formValidate.min">
                                    <Option v-for="index in 60" :key="index-1" :value="index-1">{{index-1}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="1">
                            <span>分</span>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="语言设置">
                    <Select v-model="formValidate.language">
                        <Option :value="0">C</Option>
                        <Option :value="1">C++</Option>
                        <Option :value="2">JAVA</Option>
                    </Select>
                </FormItem>
                <FormItem label="排名公布">
                    <Select v-model="formValidate.sort">
                        <Option :value="0">公布全部排名</Option>
                        <Option :value="1">不公布排名</Option>
                        <Option :value="2">公布前50%学生排名</Option>
                    </Select>
                </FormItem>
                <FormItem label="类型">
                    <RadioGroup v-model="formValidate.isTest">
                        <Radio :label="1">
                            <span>考试</span>
                        </Radio>
                        <Radio :label="0">
                            <span>练习</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="显示备注">
                    <RadioGroup v-model="formValidate.show">
                        <Radio :label="1">
                            <span>是</span>
                        </Radio>
                        <Radio :label="0">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <Button @click.native="submit('examValidate')">提交</Button>
                </FormItem>
            </Form>
            <div class="topic">
                <Table :columns="columns" :data="topicData" @on-row-click="goToTopic">
                    <template slot-scope="{row,index}" slot="type">
                        <span style="color: #337ab7">{{row.type}}</span>
                    </template>
                    <template slot-scope="{row,index}" slot="num">
                        <span>{{row.num}}个</span>
                    </template>
                    <template slot-scope="{row,index}" slot="score">
                        <span>{{row.score}}分</span>
                    </template>
                </Table>
            </div>
        </div>
    </div>
</template>

<script>
    import ajaxService from '../../../utils/ajaxService';

    export default {
        name: "editexam",
        data() {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入考试名称'))
                } else {
                    callback()
                }
            };
            return {
                formValidate: {
                    id: '',
                    name: '',
                    isRead: true,
                    start: this.getDate(),
                    date: 0,
                    hour: 0,
                    min: 0,
                    language: 0,
                    sort: 0,
                    isTest: 0,
                    show: 0
                },
                examRules: {
                    name: [{validator: validateName, trigger: 'blur'}],
                },
                columns:[
                    {
                        title:'题目类型',
                        slot:'type',
                        align:'center'
                    },
                    {
                        title:'题目数量',
                        slot:'num',
                        align:'center'
                    },
                    {
                        title:'题目总分',
                        slot:'score',
                        align:'center'
                    }
                ],
                topicData:[
                    {
                        type:'判断题',
                        num:0,
                        score:0
                    },
                    {
                        type:'选择题',
                        num:0,
                        score:0
                    },
                    {
                        type:'填空题',
                        num:0,
                        score:0
                    },
                    {
                        type:'程序设计题',
                        num:0,
                        score:0
                    }
                ]
            }
        },
        methods: {
            getDate() {
                let date = new Date(Date.now())
                let y = date.getFullYear()
                let m = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
                let d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
                let h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
                let mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
                return `${y}-${m}-${d} ${h}:${mm}`
            },
            submit(name) {
                let self = this
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let examInfo = this.formValidate
                        ajaxService.updateExamInfo(this.formValidate).then(res => {
                            if (res.code == 1) {
                                this.$Message.success(res.msg);
                            }
                        })
                    } else {
                        this.$Message.error('请正确输入!');
                    }
                })
            },
            routerTo(path) {
                path = path + '?id=' + this.$route.query.id
                this.$router.replace(path)
            },
            goToTopic(row,index){
                switch (row.type) {
                    case '判断题':
                        this.routerTo('/examInfo/examyesno')
                        break
                    case '选择题':
                        this.routerTo('/examInfo/examselect')
                        break
                    case '填空题':
                        this.routerTo('/examInfo/examgap')
                        break
                    case '程序设计题':
                        this.routerTo('/examInfo/examprogram')
                        break
                }
            },
            statistics(){
                let examId = this.$route.query.id
                ajaxService.statistics({examId}).then(res=>{
                    if (res.code===1){
                        this.topicData[0].num=res.data.yesno.num
                        this.topicData[0].score=res.data.yesno.score
                        this.topicData[1].num=res.data.select.num
                        this.topicData[1].score=res.data.select.score
                        this.topicData[2].num=res.data.gap.num
                        this.topicData[2].score=res.data.gap.score
                        this.topicData[3].num=res.data.program.num
                        this.topicData[3].score=res.data.program.score
                    }
                })
            },
            getExamInfo() {
                let examId = this.$route.query.id
                ajaxService.getExamInfo({examId}).then(res => {
                    if (res.code == 1) {
                        let startTime = new Date(res.data.start)
                        let finishTime = new Date(res.data.finish)
                        let usedTime = finishTime - startTime
                        let days = Math.floor(usedTime / (24 * 3600 * 1000))
                        let leavel = usedTime % (24 * 3600 * 1000)
                        let hours = Math.floor(leavel / (3600 * 1000))
                        let leavel2 = leavel % (3600 * 1000)
                        let minutes = Math.floor(leavel2 / (60 * 1000))
                        this.formValidate.id = res.data.Id
                        this.formValidate.name = res.data.name
                        this.formValidate.isRead = (res.data.isRead == 1 ? true : false)
                        this.formValidate.type = res.data.type
                        this.formValidate.start = res.data.start
                        this.formValidate.date = days
                        this.formValidate.hour = hours
                        this.formValidate.min = minutes
                        this.formValidate.language = res.data.language
                        this.formValidate.sort = res.data.sort
                        this.formValidate.isTest = res.data.isTest
                        this.formValidate.show = res.data.show
                    }
                })
            },
        },
        created() {
            this.getExamInfo()
            this.statistics()
        }
    }
</script>

<style lang="scss">
    .exam-info {
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

        }

        .edit-content {
            display: flex;

            .ivu-form {
                margin-top: 20px;
                width: 400px;
                flex:0 0 auto;

                .ivu-form-item {
                    .ivu-form-item-label {
                        font-size: 12px;
                        font-weight: 700;
                    }

                    .ivu-btn {
                        color: #fff;
                        background-color: #337ab7;
                        border-color: #2e6da4
                    }
                }
            }
            .topic{
                flex: 1;
                display: flex;
                padding: 20px 0;
                flex-direction: column;
                align-items: center;
                .ivu-table-wrapper{
                    width: 400px;
                    .ivu-table{
                        .ivu-table-cell{
                            padding: 0;
                        }
                        .ivu-table-tbody{
                            .ivu-table-row{
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
