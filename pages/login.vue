<template>
    <div class="login">
        <div class="title">
            <img src="../assets/images/blue_logo.png" alt="">
            C/C++/Java 考试教师端入口
        </div>
        <Form ref="loginValidate" :model="loginValidate" label-position="left" :label-width="0" :rules="ruleValidate">
            <FormItem prop="username">
                <Input v-model="loginValidate.username" placeholder="用户名"
                       @keyup.enter.native="submit('loginValidate')"></Input>
            </FormItem>
            <FormItem prop="password">
                <Input :type="pwdshow?'text':'password'" v-model="loginValidate.password" placeholder="密码"
                       @keyup.enter.native="submit('loginValidate')">
                    <Icon slot="suffix" :type="pwdshow?'md-eye-off':'md-eye'" @click.native="pwdshow=!pwdshow"/>
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click.native="submit('loginValidate')"
                        @keyup.enter.native="submit('loginValidate')">登录
                </Button>
            </FormItem>
        </Form>
        <div class="version">JYOJ 考试管理 v1.0</div>
        <div class="copyright">Copyright © 2019 <a href="http://zjz236@qq.com">zjz</a></div>
    </div>
</template>

<script>
    import ajaxService from '../utils/ajaxService'
    import {delCookie} from '../utils/cookieUtil'

    export default {
        name: "login",
        data() {
            return {
                loginValidate: {
                    username: '',
                    password: ''
                },
                ruleValidate: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
                },
                pwdshow: false
            }
        },
        methods: {
            submit: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        ajaxService.teacherlogin({
                            username: this.loginValidate.username,
                            password: this.loginValidate.password
                        }).then(res => {
                            if (res.code == 1) {
                                this.$router.replace('/')
                            }
                        })
                    } else {
                        this.$Message.error('请正确输入!');
                    }
                })
            }
        },
        components: {},
        created() {
            delCookie('token')
        }
    }
</script>

<style lang="scss">
    .login {
        width: 100vw;
        height: 100vh;
        background: rgb(238, 238, 238);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .title {
            display: flex;
            line-height: 50px;
            font-weight: 700;
            font-size: 36px;
            color: #000;

            img {
                width: 50px;
                height: 50px;
                margin-right: 20px;
            }
        }

        .ivu-form {
            width: 300px;
            margin-top: 10px;

            .ivu-form-item {
                margin: 0;

                .ivu-form-item-content {
                    margin: 0;

                    input {
                        height: 44px;
                        border: 1px solid #ccc;
                    }

                    button {
                        margin-top: 20px;
                        width: 300px;
                        height: 44px;
                        background: #337ab7;
                        border: 1px solid #2e6da4;

                        span {
                            font-size: 14px;
                            color: #fff;
                        }
                    }

                    .ivu-form-item-error-tip {
                        top: 50%;
                        margin-top: -9px;
                        left: 100%;
                        width: 100px;
                    }
                }
            }
        }

        .version {
            margin-top: 20px;
            font-size: 0.87vw;
            line-height: 1.43;
        }

        .copyright {
            font-size: 0.87vw;
            line-height: 1.43;
        }
    }
</style>
