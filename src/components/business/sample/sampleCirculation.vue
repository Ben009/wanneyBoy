<template>
  <el-form ref="form" class="sampleForm" label-width="150px">
    <el-Row :gutter="20">
      <el-col :span="12">
        <el-form-item>
          <template slot="label">
            <span>请输入单号：</span>
            <el-tooltip content="登记号、流转单号、委托单号、缴费单编号">
              <i class="el-icon-info" style="font-size: 12px !important;"></i>
            </el-tooltip>
          </template>
          <el-input v-model="searchKey" @keyup.enter.native="search" ref="focusInput"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2" style="padding-top: 6px;">
        <el-button class="el-button el-button--primary" @click="search">查询</el-button>
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
    name:"sampleCirculation",
    data() {
      return {
        searchKey:"",//查询单号
      }
    },
    methods:{
      search(){
        if(this.searchKey===null||this.searchKey===""||this.searchKey===undefined){
          this.$message.error('请输入单号');
          return;
        }
        /*获取table数据，维护data数据*/
        ajaxRequest('get','back/exchange/getInfo',{
          bh:$.trim(this.searchKey),
        },(res)=>{
          if(res.code===200){
            this.$router.push({
              path: '/admin/748',
              query:{
                searchKey:this.searchKey,
                tableData:res.daoResult.bhlist,
                tableData2:res.daoResult.wtdlist,
              }
            })
          }else{
            this.$message.error(res.msg);
          }
        })
      },
    },
    mounted(){
      this.$nextTick(()=>{
        this.$refs.focusInput.focus()
      })
    },
  }
</script>

<style lang="scss">
  .sampleForm{
  .centerForm {
    border: 1px solid #ddd;
    margin: 10px 0;
    padding: 10px 10px ;
  .demo {
  .el-input{
  .el-input__inner{
    height:28px !important;
  }
  }
  }
  }
  }

</style>
