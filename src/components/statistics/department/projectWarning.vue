<template>
  <div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="6">
            <el-form-item label="维护部门" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="证件类别" class="lbCenter"></el-form-item>
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
              <el-select
                placeholder="请选择"
                v-model="certificationTypeName">
                <el-option
                  v-for="item in certificationTypeOptions"
                  :label="item.certificationType"
                  :value="item.certificationType"
                >
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
          <el-table-column prop="setNumber" label="人员名称"></el-table-column>
          <el-table-column prop="setNumber" label="项目名称"></el-table-column>
          <el-table-column prop="setNumber" label="部门名称"></el-table-column>
          <el-table-column prop="setNumber" label="发证单位"></el-table-column>
          <el-table-column prop="setNumber" label="证件名称"></el-table-column>
          <el-table-column prop="setNumber" label="证件类别"></el-table-column>
          <el-table-column prop="setNumber" label="证件编号"></el-table-column>
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
    name:"projectWarning",//持证项目预警
    components: {
      charts
    },
    data() {
      return {
        tableData:[],
        departmentOptions:[],//维护部门option
        certificationTypeOptions:[],//证件类别option
        departId:"",//维护部门id
        testDepartment:"",//维护部门名
        certificationTypeId:"",//证件类别id
        certificationTypeName:"",//证件类别名
      }
    },
    methods:{
      getTableList(){
        ajaxRequest('get','back/index/getAllUnCheckMission',{
          departId:this.departId,//维护部门id
          certificationTypeName:this.certificationTypeName,//证件类别名
        },(res)=>{
          if(res.code===200){
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
        ajaxRequest("get","back/statistics/getDepartList",{isDelete: 0},res => {//维护部门
            if (res.code === 200) {
              this.departmentOptions = res.rows;
            }
          }
        );
        ajaxRequest('get','/back/certificationType/list',{},function (res) {//证件类别
          this.certificationTypeOptions = res.rows;
        }.bind(this));
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
