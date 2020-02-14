<template>
	<div class="index">
		<page-title title="Welcome to 暨阳Online Judge V1.2.0" description="如操作上有什么问题请联系：zjz236@qq.com"></page-title>
		<div class="userInfo">
			<el-calendar v-model="date">
			</el-calendar>
			<div class="info">
				<el-table
						:data="tableData"
						border
				>
					<el-table-column
							prop="value"
					></el-table-column>
					<el-table-column
							prop="label"
					></el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
  import {mapState} from 'vuex'
	import PageTitle from '@/components/PageTitle'
  import moment from 'moment'
  import {userKey, getSex} from "@/common/common";

  export default {
    name: "index",
    computed: {
      ...mapState(['userInfo'])
    },
		components: {
      PageTitle
		},
    watch: {
      userInfo(val) {
        this.getUserInfo(val)
      }
    },
    data() {
      return {
        date: new Date(),
        tableData: []
      }
    },
    methods: {
      getUserInfo(val) {
        let tableData = []
        for (let key in val) {
          switch (key) {
            case 'sex':
              tableData.push({
                value: userKey[key],
                label: getSex[val[key]]
              })
              break
            case 'isAdmin':
              tableData.push({
                value: userKey[key],
                label: val[key] ? '管理员' : '普通用户'
              })
              break
            case 'createTime':
              tableData.push({
                value: userKey[key],
                label: moment(val[key]).format('YYYY年MM月DD日')
              })
              break
            default:
              tableData.push({
                value: userKey[key],
                label: val[key]
              })
              break
          }
        }
        this.tableData = tableData
      }
    },
		mounted() {
      this.getUserInfo(this.userInfo)
		}
  }
</script>

<style scoped lang="scss">
	.index {
		.userInfo {
			width: 60%;
			margin: 0 auto;
			display: flex;

			.el-calendar {
				flex: 1 1 50%;
				padding: 20px;
			}
			.info{
				flex: 1 1 50%;
				padding-top: 72px;
				.el-table {
					/deep/.el-table__header-wrapper{
						display: none;
					}
				}
			}
		}
	}
</style>
