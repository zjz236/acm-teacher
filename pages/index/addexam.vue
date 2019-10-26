<template>
    <div class="add-exam">
        <div class="title"><h2>添加我的考试</h2></div>
        <div class="content">
            <Form :model="formValidate" ref="examValidate" label-position="right" :label-width="100" :rules="examRules">
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
        </div>
    </div>
</template>

<script>
    import ajaxService from '../../utils/ajaxService';

    export default {
        name: "addexam",
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
                    name: [{validator: validateName, trigger: 'blur'}]
                }
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
                        ajaxService.addExam(this.formValidate).then(res => {
                            if (res.code == 1) self.$router.replace('/myexamlist')
                        })
                    } else {
                        this.$Message.error('请正确输入!');
                    }
                })
            }
        },
        head(){
            return {
                title:'添加我的考试'
            }
        }
    }
</script>

<style lang="scss">
    .add-exam {
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

        .content {
            flex: 1;
            display: flex;
            justify-content: center;

            .ivu-form {
                margin-top: 20px;
                width: 400px;

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
        }
    }
</style>
