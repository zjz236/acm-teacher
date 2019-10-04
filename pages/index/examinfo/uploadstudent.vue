<template>
    <div class="upload-student">
        <div class="title"><h2>上传考生信息</h2>
            <div class="bnt">
                <Button @click.native="routerTo('/examinfo/studentlist')">返回</Button>
            </div>
        </div>
        <div class="content">
            <div class="explain">
                <p>说明：</p>
                <p>(1) 请下载模板, 向文件中添加相应学生信息;</p>
                <p>(2) 上传数据后请仔细确认信息，并点击"学生名单确认"数据按钮添加到数据库中;</p>
                <p>(3) 已经存在的这场考试的学生信息会被覆盖</p>
            </div>
            <div class="upload"><p>学生信息上传(xlsx) </p><input ref="upload" type="file"
                                                           style="outline: none;margin-left: 20px;" @change="fileChange"
                                                           accept=".xls,.xlsx">
                <Button @click.native="uploadData">上传</Button>
                <Button @click.native="download">模板下载</Button>
                <Button v-if="loadData.length>0" @click.native="submit">学生名单确认</Button>
            </div>
            <Table :columns="columns" :data="loadData">

            </Table>
        </div>
    </div>
</template>

<script>
    import XLSX from 'xlsx'
    import ajaxService from '../../../utils/ajaxService';

    export default {
        name: "uploadstudent",
        data() {
            return {
                file: '',
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '登录账号',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '登录密码',
                        key: 'password',
                        align: 'center'
                    },
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
                        title: '性别',
                        key: 'sex',
                        align: 'center'
                    },
                    {
                        title: '学校',
                        key: 'school',
                        align: 'center'
                    },
                    {
                        title: '学院',
                        key: 'college',
                        align: 'center'
                    },
                    {
                        title: '专业',
                        key: 'major',
                        align: 'center'
                    }
                ],
                loadData: []
            }
        },
        methods: {
            download() {
                if (process.client) {
                    window.location.href = 'http://127.0.0.1:2236/download/template?file=/public/download/templet.xlsx'
                }
            },
            submit() {
                for(let i=0;i<this.loadData.length;i++){
                    this.loadData[i].sex=this.loadData[i].sex=='男'?1:0
                }
                ajaxService.addStudent({examId: this.$route.query.id, student: this.loadData}).then(res => {
                    if (res.code===1){
                        this.$Message.success="上传成功"
                        this.routerTo('/examinfo/studentlist')
                    }
                })
            },
            routerTo(path) {
                path = path + '?id=' + this.$route.query.id
                this.$router.replace(path)
            },
            fileChange(e) {
                this.file = this.$refs.upload.files[0]
            },
            uploadData() {
                this.readExcel(this.file).then(res => {
                    let data = []
                    if (res.code == 1) {
                        for (let i = 0; i < res.data.length; i++) {
                            let d = {}
                            d.username = res.data[i].登录账号
                            d.password = res.data[i].登录密码
                            d.studentId = res.data[i].学号
                            d.name = res.data[i].姓名
                            d.sex = res.data[i].性别
                            d.school = res.data[i].学校
                            d.college = res.data[i].学院
                            d.major = res.data[i].专业
                            data.push(d)
                        }
                        this.loadData = data
                    }
                })

            },
            readExcel(file) {
                let _this = this;
                return new Promise(function (resolve, reject) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            let data = e.target.result, workbook = XLSX.read(data, {type: 'binary'});
                            let batteryArr = [];
                            for (let item in workbook.SheetNames) {
                                let SheetName = workbook.SheetNames[item]
                                let sheetInfos = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[SheetName]);
                                for (let battery in sheetInfos) {
                                    if (battery != '!ref') {
                                        batteryArr.push(sheetInfos[battery])
                                    }
                                }
                            }
                            let flag = 1
                            for (let i = 0; i < batteryArr.length; i++) {
                                if (!batteryArr[i].专业 || !batteryArr[i].学号 || !batteryArr[i].学校 || !batteryArr[i].性别 || !batteryArr[i].登录账号 || !batteryArr[i].登录密码) {
                                    flag=0
                                }
                            }
                            if (flag == 0) {
                                resolve({
                                    code: 0,
                                    data: []
                                })
                            } else {
                                resolve({
                                    code: 1,
                                    data: batteryArr
                                })
                            }
                        } catch (e) {
                            reject(e.message);
                        }
                    };
                    reader.readAsBinaryString(file);
                });
            },
        }
    }
</script>

<style lang="scss">
    .upload-student {
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
                flex: 1 1 50%;
                line-height: 52px;
                font-size: 30px;
                color: rgb(51, 51, 51);
            }

            .bnt {
                display: flex;
                justify-content: flex-end;
                flex: 1 1 50%;
            }
        }

        .content {
            flex: 1;

            .explain {
                color: #8a6d3b;
                margin-top: 20px;
                background-color: #fcf8e3;
                padding: 15px;
                margin-bottom: 20px;
                border: 1px solid #faebcc;
                border-radius: 4px
            }

            .upload {
                display: flex;
                align-items: center;
            }

            .ivu-table-wrapper {
                margin-top: 20px;

                .ivu-table {
                    .ivu-table-cell {
                        padding: 0;
                    }
                }
            }

        }
    }
</style>
