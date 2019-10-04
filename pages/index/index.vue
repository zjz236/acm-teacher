<template>
    <div class="index">
        <div class="content">
            <div class="title">暨阳考试后台管理系统</div>
            <div class="time">发布日期-2019年10月</div>
            <div class="copyright">Copyright © 2014-2019 HDU ACM Team</div>
            <div class="row">
                <div class="col-l">
                    <table class="table">
                        <tbody>
                        <tr>
                            <td class="l"><b>管理员ID</b></td>
                            <td class="r">{{userInfo.username?userInfo.username:''}}</td>
                        </tr>
                        <tr>
                            <td class="l"><b>姓名</b></td>
                            <td class="r">{{userInfo.name?userInfo.name:''}}</td>
                        </tr>
                        <tr>
                            <td class="l"><b>性别</b></td>
                            <td class="r">{{userInfo.sex?userInfo.sex:''}}</td>
                        </tr>
                        <tr>
                            <td class="l"><b>学校</b></td>
                            <td class="r">{{userInfo.school?userInfo.school:''}}</td>
                        </tr>
                        <tr>
                            <td class="l"><b>邮箱</b></td>
                            <td class="r">{{userInfo.email?userInfo.email:''}}</td>
                        </tr>
                        <tr style="border: none">
                            <td class="l"><b>其他信息</b></td>
                            <td class="r">{{userInfo.is_admin&&userInfo.is_admin===1?'后台管理员':''}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        props: ['userInfo'],

    }
</script>

<style lang="scss">
    .index {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;

        .content {
            display: flex;
            margin-top: 20px;
            margin-bottom: 20px;
            width: 90%;
            flex-direction: column;
            align-items: center;
            background: rgb(238, 238, 238);

            .title {
                font-weight: bold;
                color: #008CBA;
                text-align: center;
                font-size: 45px;
                margin-top: 50px;
            }

            .time {
                font-size: 21px;
                margin-top: 10px;
                font-weight: 200;
            }

            .copyright {
                font-size: 21px;
                font-weight: 200;
            }

            .row {
                width: 100%;
                display: flex;
                margin-top: 20px;
                align-items: center;
                justify-content: center;

                .col-l {
                    width: 80%;

                    .table {
                        border: 1px solid #ddd;
                        width: 100%;
                        max-width: 100%;
                        margin-bottom: 20px;

                        tbody {
                            display: table-row-group;
                            vertical-align: middle;
                            border-color: inherit;

                            tr {
                                display: flex;
                                vertical-align: inherit;
                                border-bottom: 1px solid #ddd;

                                td {
                                    flex: 1 1 50%;
                                    padding: 8px;
                                    display: table-cell;
                                    line-height: 1.42857143;
                                    vertical-align: top;
                                    color: rgb(51, 51, 51);
                                    font-size: 14px;
                                }

                                .l {
                                    border-right: 1px solid #ddd;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
