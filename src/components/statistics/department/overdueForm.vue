<template>
    <div>
      <mind-dialog
        :visible="true"
        title="登记号"
        dialogSize="large"
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
            <el-table-column prop="registrationNo" label="登记号"></el-table-column>
            <el-table-column prop="orderNo" label="委托单号"></el-table-column>
            <el-table-column prop="companyName" label="委托单位"></el-table-column>
            <el-table-column prop="applianceActualName" label="器具名称"></el-table-column>
            <el-table-column prop="departName" label="部门"></el-table-column>
            <el-table-column prop="postName" label="岗位"></el-table-column>
            <el-table-column prop="setNumber" label="套数"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.certificateCount==scope.row.certificateNumber">已全出</span>
                <span v-if="scope.row.certificateCount==0">未出证</span>
                <span v-if="scope.row.certificateCount<scope.row.certificateNumber&&scope.row.certificateCount>0">已全部分</span>
              </template>
            </el-table-column>
            <el-table-column prop="entrustDate" label="委托日期" :formatter="dealDate"></el-table-column>
            <el-table-column prop="detectionDeadline" label="检测期限" :formatter="dealDate"></el-table-column>
            <el-table-column label="库房状态">
              <template slot-scope="scope">
                <span v-if="scope.row.applianceFlag=='0'&&scope.row.registrationNo.toString().substring(0,1)=='8'">送检在收发</span>
                <span v-if="scope.row.applianceFlag=='0'&&scope.row.registrationNo.toString().substring(0,1)=='9'">&nbsp;</span>
                <span v-if="scope.row.applianceFlag=='1'">未检在实验室</span>
                <span v-if="scope.row.applianceFlag=='2'">已检在实验室</span>
                <span v-if="scope.row.applianceFlag=='3'">已入库</span>
                <span v-if="scope.row.applianceFlag=='4'">已出库</span>
                /
                <span v-if="scope.row.certificateFlag=='3'">已入库</span>
                <span v-if="scope.row.certificateFlag=='4'">已出库</span>
                <span v-else>未入库</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:10px;text-align:center;float:right;">
            <mind-pagination
              :current-page="page"
              :page-size="rows"
              :total="total"
              @size-change="handlePageSizeChange"
              @current-change="handleCurrentPageChange">
            </mind-pagination>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">关闭</el-button>
        </span>
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
      name:"overdueForm",//登记号弹层
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
              page:1,//页码
              rows:50,//每页记录数
              fuzzySearch:0,//是否模糊查询，默认关闭模糊查询
              total:0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
            }
        },
      methods:{
        getTableList(){
          this.data.page=this.page;
          this.data.rows=this.rows;
          this.data.total=0;
          /*获取table数据，维护data数据*/
          ajaxRequest('get','back/statistics/chaoqiCountDetail',this.data,(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
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
