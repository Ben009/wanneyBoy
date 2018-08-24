<template>
  <div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="3">
            <el-form-item label="是否现场" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="行政区划" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="汇总方式" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="isScene" placeholder="请选择">
                <el-option
                  v-for="item in sceneOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select class="list-width"
                         placeholder="请选择"
                         value-key="name"
                         v-model="region"
              >
                <el-option
                  v-for="item in regionOptions"
                  :key="item.provinceIds"
                  :label="item.provinceName"
                  :value="item.provinceIds">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
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
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span v-if="sum=='1'">{{scope.row.departName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ts" label="套数"></el-table-column>
          <el-table-column prop="tts" label="套数（退）"></el-table-column>
          <el-table-column prop="wts" label="委托数"></el-table-column>
          <el-table-column prop="khs" label="客户数"></el-table-column>
          <el-table-column prop="qjgzl" label="费用（强检工作量）"></el-table-column>
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
  import charts from "../department/charts"; //图表
  export default {
    name:"valueStatistics",//强检产值统计
    components: {
      charts
    },
    data() {
      return {
        tableData:[],
        sceneOptions:[],//现场option
        regionOptions:[],//行政区option
        summaryOptions:[],//汇总字段option
        isScene:"",//是否现场
        region:"",//行政区
        summary:"1",//汇总字段
        sum:"1",//控制显示的汇总字段
      }
    },
    methods:{
      getTableList(){
        if(this.summary==""){
          this.$message.warning('汇总字段没有选择');
          return;
        }
        ajaxRequest('get','back/statistics/qjczCount',{
          summary:this.summary,//汇总方式
          province:this.region,//行政区
          isScene:this.isScene,//是否现场
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
        this.sceneOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//现场option
        this.summaryOptions=[{"code":"1","remark":"行政区划（区）"}];//汇总方式option
        ajaxRequest("get", "back/company/getRegion?type=0", {isDelete:0}, function(res) {//行政区划option
            this.regionOptions = res;
          }.bind(this)
        );
      },
      initDate(){//默认日期从上个月第一天到上个月最后一天
        var nowdays = new Date();
        var year = nowdays.getFullYear();
        var month = nowdays.getMonth();
        if(month==0)
        {
          month=12;
          year=year-1;
        }
        if (month < 10) {
          month = "0" + month;
        }
        this.startDate = year + "-" + month + "-" + "1";//上个月的第一天
        var myDate = new Date(year, month, 0);
        this.endDate = year + "-" + month + "-" + myDate.getDate();//上个月的最后一天
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
      this.initDate();
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
