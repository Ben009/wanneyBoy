<template>
    <div>
      <mind-dialog
        :visible="true"
        title="报价信息"
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
            <el-table-column prop="quotationNo" label="报价单编号"></el-table-column>
            <el-table-column prop="companyName" label="委托单位">
              <template slot-scope="scope">
                <span v-if="scope.row.auditFlag==0 && scope.row.companyName" style="color: red">({{scope.row.companyType}}){{scope.row.companyName}}</span>
                <span v-else>
                  <span style="color: red;" v-if="scope.row.companyName">({{scope.row.companyType}})</span>
                  {{scope.row.companyName}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="businessArea" label="业务组"></el-table-column>
            <el-table-column prop="businessStaff" label="业务员"></el-table-column>
            <el-table-column prop="charge" label="业务负责人"></el-table-column>
            <el-table-column prop="taxNo" label="税号"></el-table-column>
            <el-table-column prop="afterDiscountsTotal" label="报价金额"></el-table-column>
            <el-table-column prop="auditDate" label="审核时间" :formatter="dealDate"></el-table-column>
            <el-table-column prop="contractNo" label="合同编号">
              <template slot-scope="scope">
                <span v-if="!scope.row.contractNo">未生成合同</span>
                <span v-else>{{scope.row.contractNo}}</span>
              </template>
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
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
    export default {
      name:"offerForm",//报价弹层
      props:{
        callback:{
          type:Function,
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
          ajaxRequest('get','back/statistics/baojiaCountDetail',this.data,(res)=>{
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
