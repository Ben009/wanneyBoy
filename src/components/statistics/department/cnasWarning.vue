<template>
  <div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="6">
            <el-form-item label="维护部门" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目类别" class="lbCenter"></el-form-item>
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
                v-model="projectTypeId">
                <el-option
                  v-for="item in projectTypeOptions"
                  :label="item.remark"
                  :value="item.code"
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
          <el-table-column prop="cnasName" label="项目名称"></el-table-column>
          <el-table-column prop="type" label="项目类别" :formatter="function(row, column, cellValue, index){return cellValue==200?'校准':cellValue==199?'检测':cellValue==204?'计量认证':''}"></el-table-column>
          <el-table-column prop="launchDate" label="项目开展日期" :formatter="dealDate"></el-table-column>
          <el-table-column prop="effectiveDate" label="有效期" :formatter="dealDate"></el-table-column>
          <el-table-column prop="departName" label="维护部门"></el-table-column>
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
        departmentOptions:[],//维护部门option
        projectTypeOptions:[],//项目类别option
        departId:"",//维护部门id
        projectTypeId:"",//项目类别id
      }
    },
    methods:{
      getTableList(){
        ajaxRequest('get','back/statistics/cnasWarning',{
          departId:this.departId,//维护部门id
          projectType:this.projectTypeId,//项目类别id
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
        ajaxProxyRequest('get','/njmind/findParam/standardType',{},function (res) {
          this.projectTypeOptions = res.list;
        }.bind(this))
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
