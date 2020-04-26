<template>
	<div class="add-classes">
		<page-title>
			<template slot="description">
				<el-card class="class-card">
					<div slot="header" class="clearfix">
						<span>添加班级</span>
					</div>
					<el-form :model="classForm" label-position="right" label-width="100px" :rules="classRules" ref="classForm">
						<el-form-item label="学校" prop="school">
							<el-input v-model.trim="classForm.school"></el-input>
						</el-form-item>
						<el-form-item label="学院" prop="college">
							<el-input v-model.trim="classForm.college"></el-input>
						</el-form-item>
						<el-form-item label="专业" prop="major">
							<el-input v-model.trim="classForm.major"></el-input>
						</el-form-item>
						<el-form-item label="班级" prop="className">
							<el-input v-model.trim="classForm.className"></el-input>
						</el-form-item>
						<el-form-item label-width="0px">
							<el-tooltip class="item" effect="dark" content="添加学生" placement="top">
								<el-button icon="el-icon-plus" circle @click="addStudent"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="模板下载" placement="top">
								<el-button icon="el-icon-download" circle @click="templateDownload"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="学生上传" placement="top">
								<el-button icon="el-icon-upload2" circle @click="uploadStudent"></el-button>
							</el-tooltip>
							<input type="file" style="display: none" ref="inputFile" @change="fileChange">
							<el-table :data="tableData" max-height="250">
								<el-table-column :render-header="renderHeader" label="用户名" width="200">
									<template slot-scope="scope">
										<el-input :value="scope.row.username"
															@input="(e)=>inputChange(e,'username',scope.$index)"></el-input>
									</template>
								</el-table-column>
								<el-table-column :render-header="renderHeader" label="密码" width="200">
									<template slot-scope="scope">
										<el-input :value="scope.row.password"
															@input="(e)=>inputChange(e,'password',scope.$index)"></el-input>
									</template>
								</el-table-column>
								<el-table-column :render-header="renderHeader" label="姓名" width="200">
									<template slot-scope="scope">
										<el-input :value="scope.row.name" @input="(e)=>inputChange(e,'name',scope.$index)"></el-input>
									</template>
								</el-table-column>
								<el-table-column :render-header="renderHeader" label="性别" width="200">
									<template slot-scope="scope">
										<el-select :value="scope.row.sex" @change="(e)=>inputChange(e,'sex',scope.$index)">
											<el-option :value="1" label="男"></el-option>
											<el-option :value="0" label="女"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column :render-header="renderHeader" label="学号" width="200">
									<template slot-scope="scope">
										<el-input :value="scope.row.studentId"
															@input="(e)=>inputChange(e,'studentId',scope.$index)"></el-input>
									</template>
								</el-table-column>
								<el-table-column label="备注" width="200">
									<template slot-scope="scope">
										<el-input :value="scope.row.notes" @input="(e)=>inputChange(e,'notes',scope.$index)"></el-input>
									</template>
								</el-table-column>
								<el-table-column label="操作" fixed="right" width="80">
									<template slot-scope="scope">
										<el-tooltip class="item" effect="dark" content="删除" placement="top">
											<i class="el-icon-delete el-icon-pointer" @click="deleteStudent(scope.$index)"></i>
										</el-tooltip>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
						<el-form-item label-width="0px">
							<el-button type="primary" @click="submit">保存</el-button>
							<el-button @click="resetForm">重置</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</template>
		</page-title>
		<el-dialog :title="getProgress()" :visible.sync="dialogVisible" width="500px">
			<el-progress type="circle" v-if="progressVisible" :percentage="progress"></el-progress>
			<el-table v-if="warnVisible" :data="warnData" max-height="400px">
				<el-table-column label="编号">
					<template slot-scope="scope">
						{{scope.$index+1}}
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						{{scope.row.length ? scope.row.join(',') : '通过'}}
					</template>
				</el-table-column>
			</el-table>
			<i v-if="successVisible" class="el-icon-success" style="color: #67C23A;font-size: 150px;"></i>
			<i v-if="errorVisible" class="el-icon-error" style="color: #ff0000;font-size: 150px;"></i>
		</el-dialog>
	</div>
</template>

<script>
  import PageTitle from '@/components/PageTitle'
  import XLSX from 'xlsx'
  import api from '@/api/classes'

  export default {
    name: "AddClasses",
    components: {PageTitle},
    data() {
      return {
        tableData: [],
        classForm: {
          school: '',
          college: '',
          major: '',
          className: ''
        },
        classRules: {
          school: [
            {required: true, message: '请输入学校', trigger: 'blur'}
          ],
          college: [
            {required: true, message: '请输入学院', trigger: 'blur'}
          ],
          major: [
            {required: true, message: '请输入专业', trigger: 'blur'}
          ],
          className: [
            {required: true, message: '请输入班级', trigger: 'blur'}
          ]
        },
        file: [],
        dialogVisible: false,
        progress: 0,
        warnData: [],
        excelKey: ['用户名', '密码', '姓名', '性别(男或女)', '学号', '备注'],
        warnVisible: false,
        errorVisible: false,
        successVisible: false,
        add: this.$route.name === 'addClasses' ? 1 : 0,
        progressVisible: false,
				classId: this.$route.params.id || ''
      }
    },
    methods: {
      addStudent() {
        this.tableData.push({
          username: '',
          password: '',
          name: '',
          sex: 1,
          studentId: '',
          notes: ''
        })
      },
      submit() {
        this.tableDataClear()
        this.$refs.classForm.validate(valid => {
          const tableData = this.tableData.filter(item => {
            return !(item.username && item.password && item.name && [0, 1].indexOf(item.sex) && item.studentId)
          })
          const require = this.readTableData()
          if (tableData.length) {
            this.$message.error('请补充完表格！')
          } else if (require) {
            this.$message.error(`用户名'${require}'重复输入`)
          } else if (valid) {
            this.addClasses()
          }
        })
      },
      async getClassInfo() {
        try {
          const {data} = await api.getClassInfo({
            classId: this.classId
          })
          for (const key in this.classForm) {
            this.classForm[key] = data[key]
          }
          this.tableData = data.student
        } catch (e) {
          console.error(e)
        }
      },
      resetForm() {
        this.$refs.classForm.resetFields()
        this.tableData = []
      },
      async addClasses() {
        try {
          const res = await api.addClasses({
            ...this.classForm,
            students: this.tableData,
            add: this.add,
						classId: this.classId || ''
          })
          if (res.code) {
            this.$message.success(res.msg)
            this.$router.replace({name: 'classes'})
          }
        } catch (e) {
          console.error(e)
        }
      },
      inputChange(e, type, index) {
        this.tableData[index][type] = e.trim()
      },
      templateDownload() {
        window.location.href = '/oj/public/excel/classesTemplate.xlsx'
      },
      deleteStudent(index) {
        this.tableData.splice(index, 1)
      },
      renderHeader(h, {column}) {
        return [h(
          'span', {
            style: {
              color: '#ff0000',
              'margin-right': '5px'
            }
          },
          '*'
        ), column.label]
      },
      getProgress() {
        if (this.warnVisible) {
          return '部分校验失败，请查看具体原因'
        } else if (this.progressVisible) {
          return '文件校验中'
        } else if (this.errorVisible) {
          return '文件校验失败，请使用相应模板'
        } else if (this.successVisible) {
          return '文件校验通过'
        }
      },
      uploadStudent() {
        this.$refs.inputFile.click()
      },
      tableDataClear() {
        for (let i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].username && !this.tableData[i].password && !this.tableData[i].name && !this.tableData[i].studentId && !this.tableData[i].notes) {
            this.tableData.splice(i, 1)
            i--
          }
        }
      },
      tableDataAdd(data) {
        for (let item of data) {
          this.tableData.push({
            username: item['用户名'].trim(),
            password: item['密码'].trim(),
            name: item['姓名'].trim(),
            sex: item['性别(男或女)'] === '男' ? 1 : 0,
            studentId: item['学号'].trim(),
            notes: item['备注'] || '',
          })
        }
      },
      async fileChange() {
        this.file = this.$refs.inputFile.files[0]
        this.tableDataClear()
        this.progress = 0
        this.progressVisible = true
        this.warnVisible = false
        this.errorVisible = false
        this.successVisible = false
        this.dialogVisible = true
        try {
          let res = await this.readExcel(this.file)
          if (res.code) {
            if (this.warnData.filter(item => item.length > 0).length > 0) {
              this.warnVisible = true
              this.progressVisible = false
              this.errorVisible = false
              this.successVisible = false
            } else {
              this.warnVisible = false
              this.progressVisible = false
              this.errorVisible = false
              this.successVisible = true
            }
          } else {
            this.warnVisible = false
            this.progressVisible = false
            this.errorVisible = true
            this.successVisible = false
          }
          this.tableDataAdd(res.data)
        } catch (e) {
          console.error(e)
        }
        this.$refs.inputFile.value = ''
      },
      readTableData() {
        let table = new Set()
        for (let i = 0; i < this.tableData.length; i++) {
          for (let j = i + 1; j < this.tableData.length; j++) {
            if (this.tableData[i].username === this.tableData[j].username) {
              table.add(this.tableData[i].username)
            }
          }
        }
        return Array.from(table).join(',')
      },
      readExcel(file) {
        const self = this
        return new Promise(function (resolve, reject) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              let data = e.target.result, workbook = XLSX.read(data, {type: 'binary'})
              let batteryArr = []
              for (let item in workbook.SheetNames) {
                let SheetName = workbook.SheetNames[item]
                let sheetInfos = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[SheetName])
                for (let battery in sheetInfos) {
                  self.progress = battery / (sheetInfos.length - 1) * 100
                  if (battery != '!ref') {
                    batteryArr.push(sheetInfos[battery])
                  }
                }
              }
              let flag = 1
              let warn = new Array(batteryArr.length)
              let trueData = []
              for (let index in batteryArr) {
                warn[index] = []
                for (let key in batteryArr[index]) {
                  if (self.excelKey.indexOf(key) < 0) {
                    flag = 0
                    break
                  }
                }
                for (let key of self.excelKey) {
                  if (!batteryArr[index][key] && key !== '备注') {
                    warn[index].push(`请输入${key}`)
                  }
                  if (key === '性别(男或女)' && batteryArr[index][key] && !['男', '女'].indexOf(batteryArr[index][key]) < 0) {
                    warn[index].push(`请正确输入性别`)
                  }
                }
                if (flag === 0) {
                  break
                }
                warn[index].length === 0 && trueData.push(batteryArr[index])
              }
              self.warnData = warn
              if (flag === 0) {
                resolve({
                  code: 0,
                  data: []
                })
              } else {
                resolve({
                  code: 1,
                  data: trueData
                })
              }
            } catch (e) {
              reject(e.message)
            }
          }
          reader.readAsBinaryString(file)
        })
      }
    },
    mounted() {
      if (!this.add) {
        this.getClassInfo()
      }
    }
  }
</script>

<style scoped lang="scss">
	.class-card {
		width: 900px;

		.el-icon-delete {
			cursor: pointer;
		}
	}

	/deep/ .el-dialog__body {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
