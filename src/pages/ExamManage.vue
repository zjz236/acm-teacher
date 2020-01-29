<template>
	<div class="exam-manage">
		<el-container>
			<el-aside width="300px">
				<el-menu
						:default-active="defaultActive"
				>
					<el-menu-item index="examEdit" @click="linkGo('examEdit')">
						<i class="el-icon-edit"></i>
						<span slot="title">考试修改</span>
					</el-menu-item>
					<el-menu-item index="examinee" @click="linkGo('examinee')">
						<i class="el-icon-user"></i>
						<span slot="title">考生管理</span>
					</el-menu-item>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</div>
</template>

<script>
  import {examMenu} from "@/common/common"

  export default {
    name: "examManage",
    data() {
      return {}
    },
    computed: {
      defaultActive() {
        const routeName = this.$route.name
        let active = ''
        for (const key in examMenu) {
          if (examMenu[key].indexOf(routeName) > -1) {
            active = key
          }
        }
        return active
      }
    },
    methods: {
      linkGo(routeName) {
        this.$router.push({name: routeName}).catch(err=>{err})
      }
    }
  }
</script>

<style scoped lang="scss">
	.exam-manage {
		width: 100%;
		height: 100%;

		.el-container {
			width: 100%;
			height: 100%;
		}
	}
</style>
