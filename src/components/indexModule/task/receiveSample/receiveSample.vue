<template>
  <div>
    <div>
      <el-table :max-height="QJTableMaxHeight"
                ref="table"
                :data="tableData"
                border
                style="width: 100%"
                :fit="true">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="registrationNo"
          label="登记号"
        >
        </el-table-column>
        <el-table-column
          prop="orderSingleNo"
          label="流转单号"
        >
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="委托单位"
        >
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
        >
        </el-table-column>
        <el-table-column
          prop="setNumber"
          label="套数"
        >
        </el-table-column>
        <el-table-column
          prop="certificateNumber"
          label="应出证书"
        >
        </el-table-column>
        <el-table-column
          prop="entrustDate"
          label="委托日期"
          :formatter="dealDate"
        >
        </el-table-column>
        <el-table-column
          prop="detectionDeadline"
          label="检测期限"
          :formatter="dealDate"
        >
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:10px;text-align:center;float:right;">
      <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">
      </mind-pagination>
    </div>
  </div>
</template>

<style scoped>

</style>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../../util/base';
  //引入jquery
  import $ from 'jquery';
  export default {
    name:"receiveSample",//待领样
    data() {
      return {
        tableData:[],
        page:1,//页码
        rows:50,//每页记录数
        total:0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
      }
    },
    methods:{
      getTableList(){
        ajaxRequest('get','back/index/getPendingSample',{
          page:this.page,
          rows:this.rows,
          total:0,
        },(res)=>{
          if(res.code===200){
            this.tableData=res.rows;
            this.total=res.total;
          }else{
            this.$message.error(res.msg);
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
      handlePageSizeChange (size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size
        this.getTableList()
      },
      handleCurrentPageChange (currentPage) {
        this.page = currentPage
        this.getTableList()
      },
    },
    mounted(){
      this.getTableList();
    }
  }
</script>
