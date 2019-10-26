<template>
    <div class="user-manage">
        <div class="title"><h2>用户管理</h2><a @click="getAdd">添加用户</a></div>
        <div class="page"><Page :current="currentPage" :page-size="pageSize" :total="total"></Page></div>
        <Table :columns="columns" :data="datas">
            <template slot="sex" slot-scope="{row,index}">{{row.sex?'男':'女'}}</template>
            <template slot="operation" slot-scope="{row,index}"><div v-if="!row.is_admin"><a @click="()=>getUpdate(row)">修改</a><a @click="()=>deleteTeacher(row.Id)">删除</a></div></template>
        </Table>
        <Modal @on-cancel="resetForm" class-name="add-user" :width="800" v-model="userShow">
            <Form ref="userForm" :label-width="100" :model="userForm" label-position="right">
                <FormItem label="用户ID"><Input v-model="userForm.username"/></FormItem>
                <FormItem label="姓名"><Input v-model="userForm.name"/></FormItem>
                <FormItem label="性别"><Select v-model="userForm.sex"><Option :value="1">男</Option><Option :value="0">女</Option></Select></FormItem>
                <FormItem label="密码"><Input v-model="userForm.password"/></FormItem>
                <FormItem label="邮箱"><Input v-model="userForm.email"/></FormItem>
                <FormItem label="学校"><Input v-model="userForm.school"/></FormItem>
            </Form>
            <div class="bottom" slot="footer"><Button type="primary" @click="()=>{add?addTeacher():updateTeacher()}">{{add?'添加':'修改'}}</Button></div>
        </Modal>
    </div>
</template>

<script>
    import ajaxService from "../../utils/ajaxService";

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
                        slot:'sex',
                        align:'center'
                    },
                    {
                        title:'学校',
                        key:'school',
                        align:'center'
                    },
                    {
                        title:'邮箱',
                        key:'email',
                        align:'center'
                    },
                    {
                        title:'操作',
                        slot:'operation',
                        align:'center'
                    }
                ],
                userForm:{
                    Id:'',
                    username:'',
                    name:'',
                    sex:1,
                    password:'',
                    email:'',
                    school:''
                },
                datas:[],
                currentPage:1,
                userShow:false,
                add:false,
                update:false,
                pageSize:20,
                total:0,
            }
        },
        methods:{
            getAllUser(){
                ajaxService.getAllUser({page:this.currentPage-1,limit:this.pageSize}).then(res=>{
                    this.total=res.total
                    this.datas=res.data
                })
            },
            updateTeacher(){
                ajaxService.updateTeacher(this.userForm).then(res=>{
                    if (res.code===1){
                        this.$Message.success('修改成功')
                        this.getAllUser()
                    }
                })
            },
            resetForm(){
                for (let key in this.userForm){
                    this.userForm[key]=''
                }
                this.userForm.sex=1
            },
            getUpdate(row){
                this.add=false
                for (let key in this.userForm){
                    this.userForm[key]=row[key]
                }
                this.userForm.password=''
                this.update=this.userShow=true
            },
            deleteTeacher(Id){
              ajaxService.deleteTeacher({Id}).then(res=>{
                  if (res.code===1){
                      this.$Message.success(res.msg)
                  }
              })
            },
            getAdd(){
                this.resetForm()
                this.update=false
                this.add=this.userShow=true
            },
            addTeacher(){
                let user=JSON.parse(JSON.stringify(this.userForm))
                delete user.Id
                const self=this
                ajaxService.addTeacher(user).then(res=>{
                    if (res.code===1){
                        self.$Message.success('添加成功')
                        this.getAllUser()
                    }
                })
            }
        },
        created() {
          this.getAllUser()
        },
        head(){
            return {
                title:'用户管理'
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
        a{
            margin: 0 10px;
        }
    }
    .page{
        height: 50px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
.add-user{
    .ivu-modal-body{
        display: flex;
        justify-content: center;
        align-items: center;
        .ivu-form{
            width: 500px;
        }
    }

}

</style>
