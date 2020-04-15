<template>
  <div class="login">
    <el-carousel height="100vh" direction="vertical" :autoplay="true" :interval="4000">
      <el-carousel-item v-for="item in 3" :key="item" :class="`carousel_${item}`">
      </el-carousel-item>
    </el-carousel>
    <div class="login-bg">
      <div class="logo">
        <el-avatar :size="60" :src="logo"></el-avatar>
      </div>
      <div class="title"><h1>暨阳学院Online Judge</h1></div>
      <div class="login-form">
        <el-card class="form-card">
          <el-form
            :model="loginForm" label-position="top" ref="loginForm" @keydown.enter.native="submit"
            :rules="loginRule">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="username" label="密码">
              <el-input v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="footer">技术支持：计算机162-
        <a target="_blank" rel="noopener noreferrer" href="https://zjz236.github.io/">朱锦泽</a>
      </div>
    </div>
  </div>
</template>

<script>
  import logo from '@/assets/images/blue_logo.png'
  import api from '@/api/account'
  import {JSEncrypt} from 'jsencrypt'

  export default {
    name: 'Login',
    data() {
      return {
        logo,
        loginForm: {
          username: '',
          password: ''
        },
        publicKey: '',
        loginRule: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.login()
          }
        })
      },
      async getPublicKey() {
        try {
          const {data} = await api.getPublicKey()
          this.publicKey = data
        } catch (e) {
          console.error(e)
        }
      },
      async login() {
        if (!this.publicKey) {
          return this.$message.error('系统异常')
        }
        try {
          const encrypt = new JSEncrypt()
          encrypt.setPublicKey(this.publicKey)
          const res = await api.login({
            ...this.loginForm,
            password: encrypt.encrypt(this.loginForm.password),
            publicKey: this.publicKey
          })
          if (res.code === 1) {
            this.$router.push('/')
          }
        } catch (e) {
          console.error(e)
        }
      }
    },
    created() {
      this.getPublicKey()
    }
  }
</script>

<style scoped lang="scss">
  .login {
    width: 100%;
    background: #f9f9f9;
    height: 100%;
    position: relative;

    /deep/ .el-carousel__indicators {
      z-index: 9999999;
    }

    .carousel_1 {
      background-image: url('../assets/images/bg1.jpg');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .carousel_2 {
      background-image: url('../assets/images/bg2.jpg');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .carousel_3 {
      background-image: url('../assets/images/bg3.jpg');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .login-bg {
      width: 100%;
      background: rgba(255, 255, 255, 0.5);
      height: 100%;
      z-index: 99999;
      position: absolute;
      top: 0;
      left: 0;

      .logo {
        width: 100%;
        display: flex;
        justify-content: center;

        .el-avatar {
          margin: 30px 0;
          background: #fff;
        }
      }

      .title {
        width: 100%;
        display: flex;
        justify-content: center;

        h1 {
          font-size: 24px;
          color: #333;
          font-weight: 300;
          letter-spacing: -.5px;
        }
      }

      .login-form {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 20px;

        .form-card {
          padding: 18px;
          width: 300px;

          .el-button {
            width: 100%;
          }
        }
      }

      .footer {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 20px;
        color: #666;
      }
    }
  }
</style>
