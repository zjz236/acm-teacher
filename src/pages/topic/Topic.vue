<template>
	<div class="topic">
		<el-container>
			<el-aside width="300px">
				<el-menu
						:default-active="defaultActive"
				>
					<el-menu-item index="tfTopic" @click="$router.push({path: 'tfTopic'}).catch(e=>e)">
						<i class="el-icon-check"></i>
						<span slot="title">判断题</span>
					</el-menu-item>
					<el-menu-item index="selectTopic" @click="$router.push({path: 'selectTopic'}).catch(e=>e)">
						<i class="el-icon-thumb"></i>
						<span slot="title">选择题</span>
					</el-menu-item>
					<el-menu-item index="gapTopic" @click="$router.push({path: 'gapTopic'}).catch(e=>e)">
						<i class="el-icon-c-scale-to-original"></i>
						<span slot="title">程序填空题</span>
					</el-menu-item>
					<el-menu-item index="programTopic" @click="$router.push({path: 'programTopic'}).catch(e=>e)">
						<i class="el-icon-monitor"></i>
						<span slot="title">程序设计题</span>
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
  import {topicMenu} from "@/common/common"

  export default {
    name: "topic",
    data() {
      return {}
    },
    computed: {
      defaultActive() {
        const routeName = this.$route.name
        let active = ''
        for (const key in topicMenu) {
          if (topicMenu[key].indexOf(routeName) > -1) {
            active = key
          }
        }
        return active
      }
    }
  }
</script>

<style scoped lang="scss">
	.topic {
		width: 100%;
		height: 100%;

		.el-container {
			width: 100%;
			height: 100%;
		}
	}
</style>
