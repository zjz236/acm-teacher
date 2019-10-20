<template>
    <div class="user-manage">
        <div class="title"><h2>用户管理</h2><a>添加用户</a></div>
        <Table :columns="this.columns" :data="this.datas"></Table>
    </div>
</template>

<script>
    export default {
        name: "usermanage",
        data(){
            return {
                columns:[
                    {
                        title:'用户ID',
                        key:'username',
                        align:'center'
                    },
                    {
                        title:'姓名',
                        key:'name',
                        align:'center'
                    },
                    {
                        title:'性别',
                        key:'sex',
                        align:'center'
                    },
                    {
                        title:'邮箱',
                        key:'email',
                        align:'center'
                    }
                ],
                datas:[]
            }
        }
    }
</script>

<style lang="scss">
.user-manage{
    width: 100%;
    height: 100%;
    padding: 20px 40px;

    .title {
        display: flex;
        height: 52px;
        align-items: center;
        border-bottom: 1px solid #eee;

        h2 {
            flex: 1;
            line-height: 52px;
            font-size: 30px;
            color: rgb(51, 51, 51);
        }

        a {
            flex: 0 0 auto;
            color: #fff;
            background-color: #f0ad4e;
            border-radius: 4px;
            border-color: #eea236;
            font-size: 14px;
            font-weight: 400;
            cursor: pointer;
            width: 110px;
            line-height: 34px;
            text-align: center;
            height: 34px;

        }
    }
    .ivu-table-cell{
        padding: 0;
    }
}
</style>
