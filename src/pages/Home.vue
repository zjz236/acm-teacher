<template>
	<div class="home">
		<el-container>
			<el-header>
				<div class="logo">
					<el-avatar :src="logo"></el-avatar>
					<div class="title">暨阳Online Judge</div>
					<el-button
						@click="runner" class="none-button" size="mini" v-if="runnerStatus" icon="el-icon-video-pause"
						type="info">暂停轮训
					</el-button>
					<el-button @click="runner" class="none-button" size="mini" v-else icon="el-icon-video-play" type="info">开始轮训
					</el-button>
				</div>
				<el-menu
					:default-active="defaultActive" @select="handleSelect" mode="horizontal" background-color="#24292e"
					text-color="#fff" active-text-color="#409EFF">
					<el-menu-item index="index">首页</el-menu-item>
					<el-menu-item index="examList">考试管理</el-menu-item>
					<el-submenu index="topic">
						<template slot="title">题库管理</template>
						<el-menu-item index="common">公共题库</el-menu-item>
						<el-menu-item index="mine">个人题库</el-menu-item>
					</el-submenu>
					<el-menu-item index="classes">班级管理</el-menu-item>
					<el-menu-item index="userManage" v-if="isAdmin">用户管理</el-menu-item>
					<el-menu-item index="ide">在线IDE</el-menu-item>
				</el-menu>
				<div class="setting">
					<div class="time">{{time}}</div>
					<el-dropdown>
						<el-avatar v-if="name">{{name}}</el-avatar>
						<el-avatar v-else icon="el-icon-user-solid"></el-avatar>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>修改信息</el-dropdown-item>
							<el-dropdown-item divided>退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</el-header>
			<el-container>
				<el-main>
					<router-view :key="defaultActive"></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
  import logo from '@/assets/images/white-logo.png'
  import moment from 'moment'
  import api from '@/api/account'
  import run from '@/api/round'
  import {mapState, mapActions} from 'vuex'
  import {routerMenu, routerActive} from '@/common/common'

  export default {
    name: 'home',
    data() {
      return {
        logo,
        name: '',
        time: moment().format('YYYY年MM月DD日 HH:mm:ss'),
        isAdmin: false,
        activeMenu: '',
        runnerStatus: false
      }
    },
    computed: {
      ...mapState([
        'userInfo'
      ]),
      defaultActive() {
        const routeName = this.$route.name
        let active = ''
        for (const key in routerMenu) {
          if (routerActive[key].indexOf(routeName) > -1) {
            active = key
          }
        }
        if (routeName === 'userManage') {
          active = 'userManage'
        }
        return active
      }
    },
    methods: {
      async getUserInfo() {
        try {
          const res = await api.getUserInfo()
          if (res.code === 1) {
            this.updateUser({
              ...res.data
            })
          }
          this.updateUser(res.data)
          this.isAdmin = res.data.isAdmin
          this.name = res.data.trueName.substr(0, 1)
        } catch (e) {
          console.error(e)
        }
      },
      async runner() {
        try {
          await run.runner({
            status: !this.runnerStatus
          })
        } catch (e) {
          console.error(e)
        } finally {
          this.getRunnerStatus()
        }
      },
      async getRunnerStatus() {
        try {
          const {data} = await run.getRunnerStatus()
          this.runnerStatus = data.status
        } catch (e) {
          console.error(e)
        }
      },
      handleSelect(key) {
        if (key === 'userManage') {
          this.$router.replace({name: 'userManage'}).catch(err => {
            err
          })
          return
        }
        this.$router.replace({name: routerMenu[key]}).catch(err => {
          err
        })
      },
      ...mapActions(['updateUser'])
    },
    watch: {
      isAdmin(val) {
        if (val) {
          this.getRunnerStatus()
        }
      }
    },
    mounted() {
      setInterval(() => {
        this.time = moment().format('YYYY年MM月DD日 HH:mm:ss')
      }, 1000)
      this.getUserInfo()
    }
  }
</script>

<style lang="scss" scoped>
	.home {
		height: 100%;
		display: flex;
		width: 100%;

		.el-header {
			background: #24292e;
			display: flex;

			.logo {
				height: 100%;
				display: flex;
				flex: 1 1 25%;
				align-items: center;

				.el-avatar {
					background: none;
					cursor: pointer;
				}

				.title {
					color: #fff;
					margin-left: 20px;
				}
			}

			.el-menu {
				flex: 1 1 50%;
				border-bottom: none;
			}

			.setting {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				flex: 1 1 25%;

				.time {
					color: #fff;
					margin-right: 20px;
				}
			}
		}

		.none-button {
			background: none;
			margin-left: 10px;
		}

		.el-main {
			padding: 0;
		}
	}
</style>
