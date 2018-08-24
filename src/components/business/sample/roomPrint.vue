<template>
  <el-form ref="form" label-width="150px" style="width:100%;text-align:center;" :model="form" :rules="rules" >
    <el-row>
      <div style="float: right">
        <global-tootips style="text-align: left">
          <p>1、条形码只支持字母和数字</p>
          <p>2、二维码扫描需扫码枪硬件支持</p>
        </global-tootips>
      </div>
    </el-row>
    <el-Row :gutter="20"  style="width:90%;">
      <el-col :span="12" style="width:90%;">
      <el-form-item>
        <el-radio-group v-model="code">
          <el-radio :label="1">条形码</el-radio>
          <el-radio :label="2">二维码</el-radio>
        </el-radio-group>
      </el-form-item>
      </el-col>
    </el-Row>
    <el-Row :gutter="20" style="width:50%;display: inline-block" >
      <el-col :span="12" style="width:90%;">
        <el-form-item label="请输入房间号：" prop="room">
          <el-input v-model="form.room" @keyup.enter.native="handleSubmit" ref="focusInput"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="padding-top: 6px; width:10%;">
        <el-button class="el-button el-button--primary" @click="handleSubmit">提交</el-button>
      </el-col>
    </el-Row>
  </el-form>
</template>

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
    components: {
      ElRow,
      ElCol},
    name:"roomPrint",
    data() {
      var checkRoom = (rule, value, callback) => {
        if(this.form.room!=""){
          if(this.code==1) {
            var reg = /^[0-9a-zA-Z]+$/;
            if (!reg.test(this.form.room)) {
              return callback(new Error('条形码只支持字母和数字，请重新输入或选择二维码'));
            }else{
              if(this.form.room.replace("[^\x00-\xff]/g","aa").length>13){
                return callback(new Error("条形码长度不超过13位"));
              }else{
                callback();
              }
            }

          }else if(this.code==2){
            if(this.form.room.replace("[^\x00-\xff]/g","aa").length>30){
              return callback(new Error("二维码长度不超过30位"));
            }else{
              callback();
            }
          }
        }
      };
      return {
        code:1,//默认条形码
        rules: {
          room: [{ validator: checkRoom, trigger: 'blur' }],
        },
        form: {
          room:"",//房间号
        },
      }
    },
    methods:{
      handleSubmit(){
        this.$refs.form.validate((valid) => {
          if (valid) {
        if(this.form.room===null||this.form.room===""||this.form.room===undefined){
          this.$message.error('请输入房间号');
          return;
        }
        this.printHtml("roomPrint",{ room:this.form.room,code:this.code});
        }
        });
      },
    },
    mounted(){
      this.$nextTick(()=>{
        this.$refs.focusInput.focus()
      })
    }
  }
</script>

