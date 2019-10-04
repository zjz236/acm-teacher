<template>
    <Modal v-model="show" :width="900" title="修改测试数据" @on-cancel="cancelModal">
        <div class="show-content">
            <Form :loading="formLoad" ref="testValidate" label-position="right" :model="testValidate"
                  :label-width="110">
                <FormItem label="填空题编号"><Input disabled v-model="testValidate.gapId"></Input></FormItem>
                <FormItem label="测试数据编号"><Input disabled v-model="testValidate.testId"></Input></FormItem>
                <FormItem label="添加输入测试数据" v-if="submitShow"><input ref="inputGap" :value="testValidate.inputData"
                                                                    type="file"
                                                                    @change="changeInputFile"></FormItem>
                <FormItem label="添加输出测试数据" v-if="submitShow"><input ref="outputGap" :value="testValidate.outputData"
                                                                    @change="changeOutputFile" type="file"></FormItem>
                <FormItem v-if="submitShow">
                    <Button type="primary" @click="isSubmit?submitData():updateData()">提交</Button>
                </FormItem>
            </Form>
            <Table :loading="tableLoad" border :columns="testColumns" :data="testData">
                <template slot-scope="{row,index}" slot="inputData">
                    <a :href="'http://127.0.0.1:2236/download/template?file='+gapTestData[index].inputData"
                       v-if="gapTestData.length>index&&gapTestData[index].inputData!==''">
                        <Icon type="ios-paper" color="#337ab7"/>
                    </a>
                    <Icon type="md-help-circle" v-else/>
                </template>
                <template slot-scope="{row,index}" slot="outputData">
                    <a :href="'http://127.0.0.1:2236/download/template?file='+gapTestData[index].outputData"
                       v-if="gapTestData.length>index">
                        <Icon type="ios-paper" color="#337ab7" v-if="gapTestData.length>index"/>
                    </a>
                    <Icon type="md-help-circle" v-else/>
                </template>
                <template slot-scope="{row,index}" slot="operation">
                    <div v-if="gapTestData.length>index"><a @click="getData(index)">修改</a><a @click="deleteGapData(index)">删除</a></div>
                    <div v-else><a @click="getData(index)">添加</a></div>
                </template>
            </Table>
        </div>
        <div slot="footer" style="display: none"></div>
    </Modal>
</template>

<script>
    import ajaxService from "../utils/ajaxService";

    export default {
        name: "gapTest",
        props: ['modalShow', 'Id', 'getList'],
        data() {
            return {
                show: this.modalShow,
                formLoad: false,
                tableLoad: false,
                isSubmit:false,
                testValidate: {
                    Id:'',
                    gapId: this.Id,
                    testId: '',
                    inputData: '',
                    outputData: ''
                },
                testData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                gapTestData: [],
                submitShow: false,
                testColumns: [
                    {
                        title: '测试数据编号',
                        align: 'center',
                        render(h, params) {
                            return h('span', {}, 'Case #' + params.index)
                        }
                    },
                    {
                        title: '输入数据',
                        slot: 'inputData',
                        align: 'center'
                    },
                    {
                        title: '输出数据',
                        slot: 'outputData',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'operation',
                        align: 'center'
                    }
                ]
            }
        },
        watch: {
            modalShow(value) {
                this.show = value
                this.testValidate.gapId = ''
                this.testValidate.testId = ''
                this.testValidate.inputData = ''
                this.testValidate.outputData = ''
                this.submitShow = false
                if (value === true) {
                    this.testValidate.gapId = this.Id
                    this.getGapData()
                    this.submitShow = false
                }
            }
        },
        methods: {
            changeInputFile() {
                this.testValidate.inputData = this.$refs.inputGap.value
            },
            changeOutputFile() {
                this.testValidate.outputData = this.$refs.outputGap.value
            },
            cancelModal() {
                this.$emit('update:show', false)
            },
            getData(index) {
                this.testValidate.testId = ('Case #' + index)
                this.submitShow = true
                this.testValidate.inputData = ''
                this.testValidate.outputData = ''
                if (this.gapTestData.length > index) {
                    this.isSubmit=false
                    this.testValidate.Id=this.gapTestData[index].Id
                } else {
                    this.isSubmit=true
                }
            },
            deleteGapData(index){
                let Id=this.gapTestData[index].Id
                let gapId=this.testValidate.gapId
                ajaxService.deleteGapData({Id,gapId}).then(res=>{
                    if (res.code==1){
                        this.$Message.success(res.msg)
                        this.getGapData()
                        this.getList()
                    }
                })
            },
            updateData(){
                this.formLoad = true
                if (this.testValidate.outputData == '' || !this.$refs.outputGap.files[0]) {
                    this.$Message.error('添加输出数据不能为空')
                    return
                }
                let inputData = this.$refs.inputGap.files[0] ? this.$refs.inputGap.files[0] : ''
                let outputData = this.$refs.outputGap.files[0]
                let formdata = new FormData()
                formdata.append("Id", this.testValidate.Id)
                formdata.append("gapId", this.testValidate.gapId)
                formdata.append("inputData", inputData)
                formdata.append("outputData", outputData)
                ajaxService.updateGapData(formdata).then(res => {
                    if (res.code == 1) {
                        this.formLoad = false
                        this.$Message.success(res.msg)
                        this.getGapData()
                    }
                })
            },
            submitData() {
                this.formLoad = true
                if (this.testValidate.outputData == '' || !this.$refs.outputGap.files[0]) {
                    this.$Message.error('添加输出数据不能为空')
                    return
                }
                let inputData = this.$refs.inputGap.files[0] ? this.$refs.inputGap.files[0] : ''
                let outputData = this.$refs.outputGap.files[0]
                let formdata = new FormData()
                formdata.append("gapId", this.testValidate.gapId)
                formdata.append("inputData", inputData)
                formdata.append("outputData", outputData)
                ajaxService.addGapData(formdata).then(res => {
                    if (res.code == 1) {
                        this.formLoad = false
                        this.$Message.success(res.msg)
                        this.getGapData()
                        this.getList()
                    }
                })
            },
            getGapData() {
                this.tableLoad = true
                ajaxService.getGapData({gapId: this.Id}).then(res => {
                    if (res.code == 1) {
                        this.tableLoad = false
                        this.gapTestData = res.data
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .show-content {
        width: 100%;
        display: flex;

        .ivu-form {
            flex: 1 1 40%;
            padding-right: 20px;
        }

        .ivu-table-wrapper {
            flex: 1 1 60%;

            .ivu-table {
                .ivu-table-cell {
                    padding: 0;
                }

                th, td {
                    height: 30px;
                }
            }
        }
        .ivu-modal-footer{
            display: none;
        }
    }
</style>
