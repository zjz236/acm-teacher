<template>
    <div class="admin">
        <div class="admin-header">
            <div class="title">
                <nuxt-link to="/" replace>暨阳考试后台管理系统</nuxt-link>
            </div>
            <div class="setting"><span>当前管理员：{{userInfo.name?userInfo.name:''}}</span><span
                    @click="routerTo('/updateinfo')">修改我的信息</span><span @click="routerTo('/login')">退出系统</span></div>
        </div>
        <div class="admin-content">
            <div class="menu">
                <Menu active-name="1">
                    <MenuItem name="1" @click.native="routerTo('/myexamlist')">
                        <Icon type="md-create" color="#fff"/>
                        我的考试
                    </MenuItem>
                    <MenuItem name="2" @click.native="routerTo('/publicbank')">
                        <Icon type="ios-photos" color="#fff"/>
                        公共题库
                    </MenuItem>
                    <MenuItem name="3" @click.native="routerTo('/userbank')">
                        <Icon type="ios-paper" color="#fff"/>
                        个人题库
                    </MenuItem>
                    <MenuItem v-if="is_admin" name="4" @click.native="routerTo('/usermanage')">
                        <Icon type="ios-contacts" color="#fff"/>
                        用户管理
                    </MenuItem>
                </Menu>
            </div>
            <div class="admin-context">
                <nuxt-child :userInfo="userInfo"/>
            </div>
        </div>

    </div>
</template>

<script>
    import {Drawer, Icon, Menu} from 'iview'
    import {isLogin} from '../utils/commonUtil';
    import ajaxService from '../utils/ajaxService'

    export default {
        name: "index",
        data() {
            return {
                userInfo: {},
                is_admin:0
            }
        },
        methods: {
            routerTo(path) {
                this.$router.replace(path)
            },
            getUserInfo() {
                ajaxService.getUserInfo({}).then(res => {
                    if (res.code === 1) {
                        this.userInfo = res.data
                        this.is_admin=res.data.is_admin
                    }
                })
            }
        },
        watch: {
            $route(now, old) {
                if (now.path != old.path) {
                    this.getUserInfo()
                }
            }
        },
        components: {
            Drawer,
            Icon,
            Menu
        },
        mounted() {
            this.getUserInfo()
        },
        created() {
            console.log('aaa')
            isLogin()
        }
    }
</script>

<style lang="scss">
    .admin {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;

        .admin-header {
            width: 100vw;
            height: 50px;
            flex: 0 0 auto;
            background: #101010;
            display: flex;
            min-width: 940px;

            .title {
                color: #9d9d9d;
                flex: 1 1 50%;
                float: left;
                height: 50px;
                padding: 15px 15px;
                font-size: 18px;
                line-height: 20px;

                a {
                    color: #9d9d9d;
                }

                a:hover {
                    color: #fff;
                }

                .ivu-icon {
                    margin-left: 30px;
                }

                .ivu-icon:hover {
                    color: #fff;
                }
            }

            .setting {
                color: #9d9d9d;
                flex: 1 1 50%;
                height: 50px;
                padding: 15px 15px;
                font-size: 18px;
                line-height: 20px;
                text-align: right;

                span {
                    margin: 0 15px;
                    cursor: pointer;
                }

                span:hover {
                    color: #fff;
                }
            }

        }

        .admin-content {
            flex: 1;
            display: flex;

            .menu {
                .ivu-menu {
                    flex: 0 0 auto;
                    height: 100%;
                    background: rgb(238, 238, 238);

                    .ivu-menu-item {
                        background: #428bca;
                        font-size: 14px;
                        font-weight: 700;
                        margin-top: 20px;
                        color: #fff;
                    }
                }
            }


            .admin-context {
                min-width: 700px;
                flex: 1;
            }
        }
    }
</style>
