<template>
    <div>
      <mind-dialog
        :visible="true"
        title="其他设备"
        dialogSize="mid"
        center
        v-dialogDrag
        append-to-body
        @close="closeDialog">
        <el-form ref="form" :rules="rules" label-width="150px">
          <el-table  :max-height="QJTableMaxHeight"
                     ref="table"
                     :data="tableData"
                     border
                     style="width: 100%"
                     :fit="true">
            <el-table-column label="设备名称">
              <template slot-scope="scope">
                <span @click="goDevice(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.instrumentationName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="departName" label="所属部门"></el-table-column>
            <el-table-column prop="deviceNumber" label="设备编号"></el-table-column>
            <el-table-column prop="manufacturingCode" label="出厂编号"></el-table-column>
            <el-table-column prop="effectiveDate" label="有效期" :formatter="dealDate"></el-table-column>
            <el-table-column prop="model" label="型号规格"></el-table-column>
            <el-table-column prop="calibrationInstitutiOn" label="检定单位"></el-table-column>
            <el-table-column prop="mearsuringRange" label="测量范围"></el-table-column>
            <el-table-column prop="accuracyClass" label="准确度等级"></el-table-column>
            <el-table-column prop="scheduleDate" label="计划检校日期" :formatter="dealDate"></el-table-column>
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
      name:"otherApplianceForm",//其他设备弹层
      props:{
        callback:{
          type:Function,
          required: true
        },
        data: {
          type:Object,
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
          ajaxRequest('get','back/statistics/getOtherDevice',{
            id:this.data.id,
          },(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
            }
          })
        },
        goDevice(row){//跳转查询仪器设备页面
          this.$router.push({
            path: '/admin/343',
            query:{
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
