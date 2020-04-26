<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo">
          <el-avatar :src="logo"></el-avatar>
          <div class="title">暨阳Online Judge</div>
          <!--					<el-button-->
          <!--						@click="runner" class="none-button" size="mini" v-if="runnerStatus" icon="el-icon-video-pause"-->
          <!--						type="info">暂停轮训-->
          <!--					</el-button>-->
          <!--					<el-button @click="runner" class="none-button" size="mini" v-else icon="el-icon-video-play" type="info">开始轮训-->
          <!--					</el-button>-->
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
          <el-menu-item index="userManage" v-if="userInfo.isAdmin">用户管理</el-menu-item>
          <el-menu-item index="ide">在线IDE</el-menu-item>
        </el-menu>
        <div class="setting">
          <div class="time">{{time}}</div>
          <el-dropdown>
            <el-avatar v-if="userInfo.trueName">{{userInfo.trueName.substr(0,1)}}</el-avatar>
            <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="visible = true">修改信息</el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
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
    <el-dialog :visible.sync="visible" title="信息修改">
      <el-form :model="userForm" label-position="right" label-width="100px" ref="userForm" :rules="userRules">
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="trueName">
          <el-input v-model="userForm.trueName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="userForm.sex">
            <el-option :value="0" label="女"></el-option>
            <el-option :value="1" label="男"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校" prop="school">
          <el-input v-model="userForm.school"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="userForm.confirmPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import logo from '@/assets/images/white-logo.png'
  import moment from 'moment'
  import api from '@/api/account'
  import run from '@/api/round'
  import {mapState} from 'vuex'
  import {delCookie} from '@/common/cookieUtil'
  import {routerMenu, routerActive} from '@/common/common'
  import { JSEncrypt } from 'jsencrypt'

  export default {
    name: 'home',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.userForm.confirmPassword !== '') {
            this.$refs.userForm.validateField('confirmPassword')
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.userForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        logo,
        name: '',
        time: moment().format('YYYY年MM月DD日 HH:mm:ss'),
        activeMenu: '',
        publicKey: '',
        runnerStatus: false,
        userForm: {
          username: '',
          trueName: '',
          sex: 1,
          school: '',
          email: '',
          password: '',
          confirmPassword: ''
        },
        userRules: {
          trueName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          school: [
            {required: true, message: '请输入学校', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请重新确认密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ]
        },
        visible: false
      }
    },
    watch: {
      userInfo: {
        handler(val) {
          for (const index in this.userForm) {
            this.userForm[index] = val[index]
          }
        },
        deep: true
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
      handleSubmit() {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            this.getPublicKey()
          }
        })
      },
      async addUser() {
        if (!this.publicKey) {
          return this.$message.error('系统异常')
        }
        try {
          const encrypt = new JSEncrypt()
          encrypt.setPublicKey(this.publicKey);
          await api.addUser({
            ...this.userForm,
            userId: this.userInfo._id,
            editable : true,
            password: encrypt.encrypt(this.userForm.password),
            confirmPassword : '',
            publicKey: this.publicKey
          })
          this.$message.success('修改成功')
          this.visible = false
        } catch (e) {
          console.error(e)
        }
      },
      async getPublicKey() {
        try {
          const {data} = await api.getPublicKey()
          this.publicKey = data
          this.addUser()
        } catch (e) {
          console.error(e)
        }
      },
      logout() {
        delCookie('token')
        this.$router.replace('login')
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
      }
    },
    mounted() {
      setInterval(() => {
        this.time = moment().format('YYYY年MM月DD日 HH:mm:ss')
      }, 1000)
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
