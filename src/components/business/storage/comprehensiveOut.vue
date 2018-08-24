<template>
  <el-form ref="form" label-width="300px">
    <el-Row :gutter="20">
      <el-form-item label="出库类型">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="证书出库"></el-checkbox>
          <el-checkbox label="样品出库"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-Row>
    <el-Row :gutter="20">
      <el-col :span="12">
        <el-form-item label="扫描证书/样品条码/缴费单条码">
          <el-input v-model="searchKey" type="textarea" @keyup.enter.native="search" ref="focusInput"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="padding-top: 6px;">
        <el-button class="el-button el-button--primary" @click="search">提交</el-button>
      </el-col>
    </el-Row>
  </el-form>
</template>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
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
    name:"comprehensiveOut",
    data() {
      return {
        searchKey:"",
        checkList:["证书出库","样品出库"],//出库类型list
        cklx:"",//出库类型
      }
    },
    methods:{
      search(){
        if (this.checkList.length<=0) {
          this.$message.warning("请选择出库类型");
          return;
        }
        if(this.searchKey===null||this.searchKey===""||this.searchKey===undefined){
          this.$message.error('请输入单号');
          return;
        }

        if(this.checkList.length>1){
          this.cklx = 3;
        }else{
          if(this.checkList[0]=="样品出库"){
            this.cklx =1;
          }else if(this.checkList[0]=="证书出库"){
            this.cklx = 2;
          }
        }
          let string = this.searchKey;
          string = string.replace(/[\n\r]/g,",");

        /*获取table数据，维护data数据*/
        ajaxRequest('post','back/out/storage/validate',{
          registrations:string,
        },(res)=>{
          if(res.code===200){
            this.$router.push({
              path: '/admin/681',
              query:{
                registrations:string,
                companyId:res.t,
                cklx:this.cklx,
                checkList:this.checkList,
              }
            })
          }else{
            this.$message.error("单号不属于同一单位，请确认后重新提交");
          }
        })
      },
    },
    mounted(){
      this.$nextTick(()=>{
        this.$refs.focusInput.focus()
      })
    }
  }
</script>

