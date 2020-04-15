<template>
  <div class="exam-notice">
    <el-card header="发布通知">
      <el-alert
        title="请一条一条添加通知或修改通知"
        type="warning">
      </el-alert>
      <el-table :data="noticeList">
        <el-table-column label="编号" width="100">
          <template slot-scope="scope" v-if="scope.row !== ''">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope" v-if="scope.row !== ''">
            <template v-if="scope.row.type">
              {{scope.row.content}}
            </template>
            <template v-else>
              <el-input v-model="noticeList[scope.$index].content"></el-input>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <template v-if="scope.row === ''">
              <el-tooltip class="item" effect="dark" content="添加" placement="top">
                <el-button icon="el-icon-plus" circle @click="addNotice"></el-button>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip v-if="scope.row.type" class="item" effect="dark" content="修改" placement="top">
                <el-button icon="el-icon-edit" @click="changeContent(scope)" circle></el-button>
              </el-tooltip>
              <el-tooltip v-else class="item" effect="dark" content="确认" placement="top">
                <el-button icon="el-icon-check" circle
                           @click="examNoticeModify(scope.row.content, scope.row._id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button icon="el-icon-delete" circle @click="deleteExamNotice(scope.row._id)"></el-button>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import exam from '@/api/exam'

  export default {
    name: 'ExamNotice',
    data() {
      return {
        noticeList: [''],
        examId: this.$route.params.examId
      }
    },
    watch: {
      noticeList: {
        handler(val) {
          if (!val.includes('') && val.length < 5) {
            this.noticeList.push('')
          }
        },
        deep: true
      }
    },
    methods: {
      changeContent(scope) {
        this.noticeList[scope.$index].type = false
      },
      addNotice() {
        if (this.noticeList.length === 5) {
          this.noticeList.splice(this.noticeList.length - 1, 1, {
            type: false,
            content: ''
          })
        } else {
          this.noticeList.splice(this.noticeList.length - 1, 0, {
            type: false,
            content: ''
          })
        }
      },
      async getExamNotice() {
        try {
          const {data} = await exam.getExamNotice({
            examId: this.examId
          })

          this.noticeList = data.map(item => {
            item.type = true
            return item
          })
        } catch (e) {
          console.error(e)
        }
      },
      async deleteExamNotice(noticeId) {
        try {
          await exam.deleteExamNotice({
            examId: this.examId,
            noticeId
          })
          this.getExamNotice()
        } catch (e) {
          console.error(e)
        }
      },
      async examNoticeModify(content, noticeId) {
        try {
          await exam.examNoticeModify({
            examId: this.examId,
            content,
            noticeId
          })
          this.getExamNotice()
        } catch (e) {
          console.error(e)
        }
      },
      checkChange(scope) {
        this.noticeList[scope.$index].type = true
      }
    },
    mounted() {
      this.getExamNotice()
    }
  }
</script>

<style scoped>

</style>
