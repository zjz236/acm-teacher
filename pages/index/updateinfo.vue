<template>
    <div class="update-info">
        <div class="title"><h2>修改我的个人信息</h2></div>
        <div class="update-content">
            <Form ref="infoValidate" :model="infoValidate" :rules="ruleValidate" label-position="right" :label-width="100">
                <FormItem label="管理员ID" prop="username">
                    <Input v-model="infoValidate.username" disabled></Input>
                </FormItem>
                <FormItem label="姓名" prop="name">
                    <Input v-model="infoValidate.name" disabled></Input>
                </FormItem>
                <FormItem label="原密码" prop="oldPassword">
                    <Input :type="oldshow?'text':'password'" v-model="infoValidate.oldPassword">
                        <Icon slot="suffix" :type="oldshow?'md-eye':'md-eye-off'" @click.native="oldshow=!oldshow"/>
                    </Input>
                </FormItem>
                <FormItem label="新密码" prop="newPassword">
                    <Input :type="pwdshow?'text':'password'" v-model="infoValidate.newPassword">
                        <Icon slot="suffix" :type="pwdshow?'md-eye':'md-eye-off'" @click.native="pwdshow=!pwdshow"/>
                    </Input>
                </FormItem>
                <FormItem label="确认新密码" prop="againPassword">
                    <Input :type="pwdshow2?'text':'password'" v-model="infoValidate.againPassword">
                        <Icon slot="suffix" :type="pwdshow2?'md-eye':'md-eye-off'" @click.native="pwdshow2=!pwdshow2"/>
                    </Input>
                </FormItem>
                <FormItem label="学校" prop="school">
                    <Input v-model="infoValidate.school" disabled></Input>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                    <Input v-model="infoValidate.email" disabled></Input>
                </FormItem>
                <FormItem>
                    <Button @click="isSubmit('infoValidate')">提交</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import ajaxService from '../../utils/ajaxService';

    export default {
        name: "updateinfo",
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else if (value.length < 6 || value.length > 12) {
                    callback(new Error('请输入6-12位密码'))
                } else {
                    if (this.infoValidate.againPassword !== '') {
                        this.$refs.infoValidate.validateField('againPassword');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.infoValidate.newPassword) {
                    console.log(value, ' ', this.infoValidate.newPassword)
                    callback(new Error('两次密码不同，请重新输入'));
                } else {
                    callback();
                }
            };
            return {
                userInfo: {},
                infoValidate: {
                    username: '',
                    name: '',
                    oldPassword: '',
                    newPassword: '',
                    againPassword: '',
                    school: '',
                    email: ''
                },
                ruleValidate: {
                    oldPassword: [{required: true, message: '请输入原密码', trigger: 'blur'},],
                    newPassword: [
                        {validator: validatePass,  trigger: 'blur'},],
                    againPassword: [
                        {validator: validatePassCheck, trigger: 'blur'},],
                },
                oldshow: false,
                pwdshow: false,
                pwdshow2: false,
            }
        },
        methods: {
            isSubmit(name) {
                let self = this
                self.$refs[name].validate((valid) => {
                    if (valid) {
                        ajaxService.updateUserInfo({
                            oldPassword: self.infoValidate.oldPassword,
                            newPassword: self.infoValidate.newPassword,
                            againPassword: self.infoValidate.againPassword
                        }).then(res => {
                            if (res.code == 1) {
                                self.infoValidate.oldPassword = ''
                                self.infoValidate.newPassword = ''
                                self.infoValidate.againPassword = ''
                                self.$Message.success(res.msg)
                            }
                        })
                    } else {
                        self.$Message.error('请正确输入!');
                    }
                })
            }
        },
        created() {
            ajaxService.getUserInfo({}).then(res => {
                if (res.code === 1) {
                    let userInfo = res.data
                    this.userInfo = userInfo
                    userInfo.newPassword = ''
                    userInfo.againPassword = ''
                    userInfo.oldPassword = ''
                    this.infoValidate = userInfo
                }
            })
        },
        head(){
            return {
                title:'修改我的个人信息'
            }
        }
    }
</script>

<style lang="scss">
    .update-info {
        width: 100%;
        height: 100%;
        padding: 20px 40px;
        display: flex;
        flex-direction: column;

        .title {
            display: flex;
            flex: 0 0 auto;
            height: 52px;
            align-items: center;
            border-bottom: 1px solid #eee;

            h2 {
                flex: 1;
                line-height: 52px;
                font-size: 30px;
                color: rgb(51, 51, 51);
            }

        }

        .update-content {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;

            .ivu-form {
                width: 500px;

                .ivu-btn {
                    color: #fff;
                    background-color: #337ab7;
                    border-color: #2e6da4
                }

                .ivu-form-item-label:before {
                    content: none;
                }
            }
        }
    }
</style>
