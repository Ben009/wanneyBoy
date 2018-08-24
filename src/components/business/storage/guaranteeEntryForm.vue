<template>
  <mind-dialog
    :visible="true"
    title="权限验证"
    dialogSize="mid"
    center
    v-dialogDrag
    append-to-body
    @close="closeDialog">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row :gutter="20">
        <el-form-item label="系统登录号" prop="userNo">
          <el-input v-model="form.userNo"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="20">
        <el-form-item label="系统登录密码" prop="userPwd">
          <el-input v-model="form.userPwd"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="20">
        <el-form-item label="电子签名密码" prop="elePwd">
          <el-input v-model="form.elePwd" @keyup.enter.native="handleSubmit('form')"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit('form')">提交</el-button>
      <el-button @click="closeDialog">关闭</el-button>
    </span>
  </mind-dialog>
</template>

<style>

</style>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";

    export default {
      name:"guaranteeEntryForm",
      components: {ElRow},
      props:{
        callback:{
          type:Function,
          required: true
        },
        getPerson: {
          type: Function,
          required: true
        },
      },
      data() {
            return {
              form: {
                userNo:"",//系统登录号
                userPwd:"",//系统登录密码
                elePwd:"",//电子签名密码
              },
              rules: {
                userNo: [{type: 'string', required: true, message: '系统登录号不能为空', trigger: 'blur'}],
                userPwd: [{type: 'string', required: true, message: '系统登录密码不能为空', trigger: 'blur'}],
                elePwd: [{type: 'string', required: true, message: '电子签名密码不能为空', trigger: 'blur'}]
              },

            }
        },
      methods:{
        handleSubmit(formName){
          this.$refs[formName].validate((valid) => {
          if (valid) {
          ajaxRequest('get','back/guarantee/checkDbr',{
            userNo:this.form.userNo,
            password:this.form.userPwd,
            signnaturePassword:this.form.elePwd
          },(res)=>{
            if(res.code===200){
              this.getPerson(res.daoResult.userNo,res.daoResult.id);
              this.callback();
            }else{
              this.$message.error(res.msg);
              return;
            }
          })
            }
          });
        },
        closeDialog(){
          this.callback();
        },
      }
    }
</script>
