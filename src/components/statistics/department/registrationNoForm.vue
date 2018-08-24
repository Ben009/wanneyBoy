<template>
    <div>
      <mind-dialog
        :visible="true"
        title="登记号"
        dialogSize="mid"
        center
        v-dialogDrag
        append-to-body
        @close="closeDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-table  :max-height="QJTableMaxHeight"
                     ref="table"
                     :data="tableData"
                     border
                     style="width: 100%"
                     :fit="true">
            <el-table-column
              prop="OPERATION_TYPE"
              label="登记号"
            >
            </el-table-column>
          </el-table>
        </el-form>
        <div style="text-align: center;margin-top: 10px;">
          <el-button @click="closeDialog">关闭</el-button>
        </div>
      </mind-dialog>
    </div>
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
    export default {
      name:"registrationForm",//登记号弹层
      props:{
        callback:{
          type:Function,
          required: true
        },
        departmentOrPost: {//1部门，2岗位
          type: Number,
          required: true
        },
        data: {
          type: Object,
          required: true
        },
      },
        data() {
            return {
              tableData:[],
            }
        },
      methods:{
        getTableList(){
          /*获取table数据，维护data数据*/
          ajaxRequest('get','back/',{
            departId:this.data.departId,
            departmentOrPost:this.departmentOrPost,
          },(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
            }
          })
        },
        dealDate: function (row, column, cellValue) {
          if(cellValue===""||cellValue===null||cellValue===undefined){
            return "";
          }else{
            return new Date(cellValue).format('YYYY-MM-DD');
          }
        },
        closeDialog(){
          this.callback();
        },
      },
      mounted(){
        this.getTableList();
      }
    }
</script>
