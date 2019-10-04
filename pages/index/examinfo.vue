<template>
    <div class="exam-info">
        <Menu mode="horizontal" theme="light" :active-name="activeName">
            <MenuItem name="/examinfo/editexam" @click.native="routerTo('/examinfo/editexam')">基本信息</MenuItem>
            <MenuItem name="/examinfo/studentlist" @click.native="routerTo('/examinfo/studentlist')">考生列表</MenuItem>
            <MenuItem name="3">预览考卷</MenuItem>
            <MenuItem name="4">发布通知</MenuItem>
            <MenuItem name="5">试卷分析</MenuItem>
            <MenuItem name="6">考试评测</MenuItem>
            <MenuItem name="7">作弊检测</MenuItem>
            <MenuItem name="8">IP查看</MenuItem>
        </Menu>
        <div class="info-content">
            <nuxt-child/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "examinfo",
        data() {
            return {
                activeName: this.$route.path
            }
        },
        methods: {
            routerTo(path) {
                path = path + '?id=' + this.$route.query.id
                this.$router.replace(path)
            },
        },
        created() {
        }
    }
</script>

<style lang="scss">
    .exam-info {
        width: 100%;
        height: 100%;
        padding: 20px 40px;
        display: flex;
        flex-direction: column;

        .ivu-menu {
            display: flex;
            height: 30px;
            flex: 0 0 auto;

            .ivu-menu-item {
                flex: 1 1 25%;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .info-content {
            flex: 1;
        }
    }
</style>
