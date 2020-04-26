<template>
	<div class="examinee-add" v-loading="allLoading">
		<el-card header="导入班级">
			<el-transfer
					@change="transferChange" :titles="['待添加班级', '已添加班级']" :props="defaultProps" v-model="classData"
					:data="transferData"></el-transfer>
		</el-card>
		<el-card header="学生信息">
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
			<el-table v-loading="loading" :data="tableData" max-height="300">
				<el-table-column
						:render-header="renderHeader" v-for="item in examineeTable" :key="item.value"
						:label="item.label" :prop="item.label" width="200">
					<template slot-scope="scope">
						<el-input
								v-if="item.type === 'input'" :value="scope.row[item.value]"
								@input="(e)=>inputChange(e,item.value,scope.$index)"></el-input>
						<el-select
								v-if="item.type === 'select'" :value="scope.row[item.value]"
								@change="(e)=>inputChange(e,item.value,scope.$index)">
							<el-option
									v-for="value in item.options" :key="value.key" :value="value.key"
									:label="value.value"></el-option>
						</el-select>
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
			<el-button style="margin-top: 20px;" type="primary" @click="submit">保存</el-button>
		</el-card>
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
  import classApi from '@/api/classes'
  import examineeApi from '@/api/examinee'
  import {examineeTable} from "@/common/common"
  import XLSX from 'xlsx'

  export default {
    name: "ExamineeAdd",
    data() {
      return {
        tableData: [],
        classData: [],
        transferData: [],
        defaultProps: {
          key: '_id',
          label: 'className'
        },
        allLoading: false,
        examineeTable,
        loading: false,
        progressVisible: false,
        warnData: [],
        dialogVisible: false,
        progress: 0,
        examId: this.$route.params.examId,
        warnVisible: false,
        errorVisible: false,
        successVisible: false,
        excelKey: ['用户名', '密码', '学校', '学院', '专业', '班级', '姓名', '性别(男或女)', '学号', '备注']
      }
    },
    methods: {
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
      addStudent() {
        this.tableData.push({
          username: '',
          password: '',
          school: '',
          college: '',
          major: '',
          className: '',
          name: '',
          sex: 1,
          studentId: '',
          notes: '',
          classId: '',
          tfScore: 0,
          selectScore: 0,
          gapScore: 0,
          programScore: 0,
          isLogin: false
        })
      },
      submit() {
        this.tableDataClear()
        const tableData = this.tableData.filter(item => {
          return !(item.school && item.college && item.major && item.className && item.username && item.password && item.name && [0, 1].indexOf(item.sex) && item.studentId)
        })
        const require = this.readTableData()
        if (tableData.length) {
          this.$message.error('请补充完表格！')
        } else if (require) {
          this.$message.error(`用户名'${require}'重复输入`)
        } else {
          this.examineeAdd()
        }
      },
      async examineeAdd() {
        try {
          const res = await examineeApi.examineeAdd({
            classList: this.classData,
            studentList: this.tableData,
            examId: this.examId
          })
          if (res.code) {
            this.$message.success(res.msg)
            this.$router.push({name: 'examinee'}).catch(e => e)
          }
        } catch (e) {
          console.error(e)
        }
      },
      getClassList() {
        return new Promise(async resolve => {
          try {
            const {data} = await classApi.getClassList()
            this.transferData = data.list
          } catch (e) {
            console.error(e)
          }
          resolve(true)
        })
      },
      transferChange(val, direction, key) {
        val
        this.tableDataClear()
        if (direction === 'right') {
          this.getClassesStudent(key)
        } else {
          this.deleteClassesStudent(key)
        }
      },
      templateDownload() {
        window.location.href = '/oj/excel/examineeTemplate.xlsx'
      },
      uploadStudent() {
        this.$refs.inputFile.click()
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
      getExamineeAddInfo() {
        return new Promise(async resolve => {
          try {
            const {data} = await examineeApi.getExamineeAddInfo({
              examId: this.examId
            })
            this.tableData = data.examinee
            this.classData = data.classes
          } catch (e) {
            console.error(e)
          }
          resolve(true)
        })

      },
      tableDataAdd(data) {
        for (let item of data) {
          this.tableData.push({
            username: item['用户名'].trim(),
            password: item['密码'].trim(),
            school: item['学校'].trim(),
            college: item['学院'].trim(),
            major: item['专业'].trim(),
            className: item['班级'].trim(),
            name: item['姓名'].trim(),
            sex: item['性别(男或女)'] === '男' ? 1 : 0,
            studentId: item['学号'].trim(),
            notes: item['备注'] || '',
            classId: '',
            tfScore: 0,
            selectScore: 0,
            gapScore: 0,
            programScore: 0,
            isLogin: false
          })
        }
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
      },
      tableDataClear() {
        for (let i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].username && !this.tableData[i].password && !this.tableData[i].school && !this.tableData[i].college && !this.tableData[i].major && !this.tableData[i].className && !this.tableData[i].name && !this.tableData[i].studentId && !this.tableData[i].notes) {
            this.tableData.splice(i, 1)
            i--
          }
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
      deleteClassesStudent(classId) {
        this.tableData = this.tableData.filter(item => {
          return !item.classId || classId.indexOf(item.classId) < 0
        })
      },
      async getClassesStudent(classId) {
        this.loading = true
        try {
          let {data} = await classApi.getClassesStudent({
            classId: classId.join(',')
          })
          for (const item of data) {
            item.school = this.transferData.filter(tem => tem._id === item.classId).map(tem => tem.school).join()
            item.className = this.transferData.filter(tem => tem._id === item.classId).map(tem => tem.className).join()
            item.college = this.transferData.filter(tem => tem._id === item.classId).map(tem => tem.college).join()
            item.major = this.transferData.filter(tem => tem._id === item.classId).map(tem => tem.major).join()
            item.tfScore = 0
            item.selectScore = 0
            item.gapScore = 0
            item.programScore = 0
            item.isLogin = false
          }
          this.tableData = this.tableData.concat(data)
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      },
      renderHeader(h, {column}) {
        if (column.label === '备注') {
          return column.label
        }
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
      deleteStudent(index) {
        this.tableData.splice(index, 1)
      },
      inputChange(e, type, index) {
        this.tableData[index][type] = e.trim()
      },
      getData() {
        this.allLoading = true
        const getClassList = this.getClassList()
        const getExamineeAddInfo = this.getExamineeAddInfo()
        Promise.all([getClassList, getExamineeAddInfo]).then(() => {
          this.allLoading = false
        })
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>

<style scoped lang="scss">
	.examinee-add {
		display: flex;
		flex-direction: column;

		.el-transfer {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		/deep/ .el-transfer-panel {
			width: 30%;
		}

		/deep/ .el-dialog__body {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
