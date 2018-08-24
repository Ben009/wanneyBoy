<template>
  <div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="6">
            <el-form-item label="所属部门" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发证单位" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="汇总方式" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="6">
            <el-form-item>
              <el-select v-model="departId" placeholder="请选择">
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select placeholder="请选择" v-model="certificateDepartName">
                <el-option
                  v-for="item in certificateDepartOptions"
                  :key="item.unit"
                  :label="item.unit"
                  :value="item.unit">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select v-model="summary" placeholder="请选择">
                <el-option
                  v-for="item in summaryOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20" style="text-align: center;margin:20px 0;">
          <el-button class="el-button el-button--primary" @click="search">查询</el-button>
          <el-button class="el-button el-button--primary" @click="exportList">导出</el-button>
        </el-Row>
      </div>
      <div>
        <el-table :max-height="QJTableMaxHeight"
                  ref="table"
                  :data="tableData"
                  border
                  style="width: 100%"
                  :fit="true">
          <el-table-column prop="certificateName" label="证件名称"></el-table-column>
          <el-table-column prop="czrs" label="持证人数" v-if="sum=='1'"></el-table-column>
          <el-table-column prop="personName" label="持证人员" v-if="sum=='1'"></el-table-column>
          <el-table-column prop="userName" label="人员名称" v-if="sum=='2'"></el-table-column>
          <el-table-column prop="czs" label="持证数" v-if="sum=='2'"></el-table-column>
        </el-table>
      </div>
      <charts :list="tableData"></charts>
    </el-form>
  </div>
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
  import charts from "./charts"; //图表
  export default {
    name:"cnasWarning",//cnas预警
    components: {
      charts
    },
    data() {
      return {
        tableData:[],
        departmentOptions:[],//所属部门option
        certificateDepartOptions:[],//发证单位option
        summaryOptions:[],//汇总字段option
        testDepartment:"",//所属部门名
        departId:"",//所属部门id
        certificateDepartName:"",//发证单位名
        summary:"1",//汇总字段
        sum:"1",//控制显示的汇总字段
      }
    },
    methods:{
      getTableList(){
        ajaxRequest('get','back/statistics/certificateCount',{
          departId:this.departId,//所属部门id
          certificateDepart:this.certificateDepartName,//发证单位名
          summary:this.summary,//汇总字段
        },(res)=>{
          if(res.code===200){
            this.sum=this.summary;
            this.tableData=res.rows;
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      search(){
        this.getTableList();
      },
      setOptions(){
        ajaxRequest("get","back/statistics/getDepartList",{isDelete: 0},res => {//所属部门
            if (res.code === 200) {
              this.departmentOptions = res.rows;
            }
          });
        ajaxRequest('get','/back/certificationUnit/list',{},function (res) {//发证单位
          this.certificateDepartOptions = res.rows;
        }.bind(this));
        this.summaryOptions=[{"code":"1","remark":"证件名称"},{"code":"2","remark":"人员"}];//汇总字段option
      },
      exportList(){//导出

      },
      dealDate: function (row, column, cellValue) {
        if(cellValue===""||cellValue===null||cellValue===undefined){
          return "";
        }else{
          return new Date(cellValue).format('YYYY-MM-DD');
        }
      },
    },
    mounted(){
      this.setOptions();
      this.getTableList();
    }
  }
</script>

<style scoped>
  .lbCenter>label{
    width:100% !important;
    text-align: center !important;
    padding-right: 0!important;
  }
</style>
