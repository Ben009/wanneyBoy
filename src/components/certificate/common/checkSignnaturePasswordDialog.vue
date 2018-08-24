<template>
  <mind-dialog
    title="请输入电子签名"
    :visible="true"
    width="400"
    height="250"
    center
    v-dialogDrag
    @close="handleCancel">
    <el-form ref="form" :model="form" >
      <el-col :span="22">
        <el-form-item label="用户名：" prop="userName">{{form.userName}}</el-form-item>
      </el-col>
      <el-col :span="22" >
        <el-form-item prop="mlName" class="signNaturePasswordClass">
          <template slot="label">密　码：</template>
          <div style="display: flex">
            <el-input v-model="signNaturePassword" ref="password" type="password" placeholder="请输入电子签名密码"></el-input>
          </div>
        </el-form-item>
      </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">确 认</el-button>
            <el-button @click="handleCancel">取 消</el-button>
          </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../util/base';
  import $ from 'jquery';

  export default {
    name: "CheckSignnaturePasswordDialog",
    props: {
//      userId: {
//        required:true,
//        default: 0
//      },
      callback: {
        type:Function,
        required:true
      }
    },
    data() {
      return {
        form: {},
        auditRyId:0 ,
        signNaturePassword:"",
        auditCertificateInex:null,
        certificateId:0,
        successTip:"",
        auditUserChangeFlag:"",
        auditCertificateFlag:"",
      }
    },
    mounted() {
//      this.getUserInfo();
    },
    methods: {
      handleSubmit() {
        if(this.signNaturePassword != this.form.signNaturePassword){
          this.$message.error('密码错误');
        }else {
          this.callback(true,this.auditUserChangeFlag,this.auditCertificateFlag,this.auditCertificateInex,this.auditRyId,this.certificateId,this.successTip);
        }
      },
      handleCancel(){
        this.callback(false);
      },
      getUserInfo(auditUserChangeFlag,auditCertificateFlag,auditCertificateInex,auditRyId,certificateId,successTip){
        this.auditUserChangeFlag = auditUserChangeFlag ,
        this.auditCertificateFlag = auditCertificateFlag ,
        this.auditCertificateInex = auditCertificateInex ,
        this.auditRyId = auditRyId ,
        this.certificateId = certificateId ,
        this.successTip = successTip ,
        ajaxRequest('get',"back/user/"+this.auditRyId,null,res =>{
          if(res.code == 200){
            this.form = res.daoResult ;
          }else {
            this.$message.error('获取用户信息失败');
          }
        });
      }
    },
  }
</script>

<style>
</style>
