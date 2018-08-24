<template>
  <div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="3">
            <el-form-item label="所属部门"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="证件名称"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="证件类别"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="取证日期"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label=" "></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="持证项目有效期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label=" " class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="汇总方式"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="3">
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
          <el-col :span="3">
            <el-form-item>
              <el-select
                placeholder="请选择"
                v-model="certificationName">
                <el-option
                  v-for="item in certificationNameOptions"
                  :label="item.certificationName"
                  :value="item.certificationName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
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
          <el-col :span="3">
            <el-form-item>
              <el-date-picker
                v-model="startDate1"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-date-picker
                v-model="endDate1"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-date-picker
                v-model="startDate2"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-date-picker
                v-model="endDate2"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
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
                  v-if="sum=='1'"
                  ref="table"
                  :data="tableData"
                  border
                  style="width: 100%"
                  :fit="true">
          <el-table-column label="项目名称" v-if="sum=='1'" prop="projectName">
            <template slot-scope="scope">
              <span @click="openProject(scope.row,1)" style="color:deepskyblue;cursor:pointer;">{{scope.row.projectName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="czyxrs" label="持证有效人员数"></el-table-column>
          <el-table-column prop="czzrs" label="持证总人数"></el-table-column>
          <el-table-column prop="jjgqrs" label="即将过期人数"></el-table-column>
          <el-table-column prop="ygqrs" label="已过期人数"></el-table-column>
        </el-table>
        <el-table :max-height="QJTableMaxHeight"
                  v-if="sum=='2'"
                  ref="table"
                  :data="tableData"
                  border
                  style="width: 100%"
                  :fit="true">
          <el-table-column label="人员名">
            <template slot-scope="scope">
              <span @click="openProject(scope.row,2)" style="color:deepskyblue;cursor:pointer;">{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="yxxms" label="持证有效项目"></el-table-column>
          <el-table-column prop="zczxms" label="总持证项目"></el-table-column>
          <el-table-column prop="jjgqxms" label="即将过期项目数"></el-table-column>
          <el-table-column prop="ygqxms" label="已过期项目数"></el-table-column>
        </el-table>
      </div>
      <projectForm v-if="project" :projectOrPerson="projectOrPerson" :callback="handleClose" :data="data"></projectForm>
      <projectStatisticsChart :list="tableData" v-if="demo" :sum="sum" :height="chartHeight" :width="chartWidth"></projectStatisticsChart>
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
  import projectForm from "./projectForm";
  import projectStatisticsChart from "./projectStatisticsChart"; //图表
  export default {
    name:"projectStatistics",//项目统计
    components: {
      projectStatisticsChart,
      projectForm
    },
    data() {
      return {
        tableData:[],
        departmentOptions:[],//所属部门option
        certificationNameOptions:[],//证件名称option
        certificationTypeOptions:[],//证件类别option
        summaryOptions:[],//汇总字段option
        departId:"",//所属部门id
        testDepartment:"",//所属部门名
        certificationId:"",//证件名称id
        certificationName:"",//证件名称
        certificationTypeId:"",//证件类别id
        certificationTypeName:"",//证件类别名
        startDate1:"",//取证日期开始日期，非必填
        endDate1:"",//取证日期结束日期，非必填
        startDate2:"",//持证项目有效期开始日期，非必填
        endDate2:"",//持证项目有效期结束日期，非必填
        summary:"1",//汇总字段
        sum:"1",//控制显示的汇总字段
        project:false,//项目统计弹层
        projectOrPerson:"",//项目统计弹层查看项目还是人员
        data:{},//传到项目统计弹层的数据
        demo:true,//图表
        chartWidth:"",//图表
        chartHeight:"",//图表
      }
    },
    methods:{
      getTableList(){
        ajaxRequest('get','back/statistics/perojectCount',{
          departId:this.departId,//所属部门id
          certificateName:this.certificationName,//证件名称
          certificateGategory:this.certificationTypeName,//证件类别名
          startProjectDate:this.startDate1,//取证日期开始日期
          endProjectDate:this.endDate1,//取证日期结束日期
          startProjectEfectiveDate:this.startDate2,//持证项目有效期开始日期
          endPrjectEfectiveDate:this.endDate2,//持证项目有效期结束日期
          summary:this.summary,//汇总字段
        },(res)=>{
          if(res.code===200){
            this.sum=this.summary;
            this.tableData=res.rows;
            if(this.summary=="1"){
              this.chartWidth="600px";
              this.chartHeight="600px";
            }else if(this.summary=="2"){
              this.chartWidth="600px";
              this.chartHeight="600px";
            }
            this.demo = false;
            this.$nextTick(val => {
              this.demo = true;
            });
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
        ajaxRequest('get','/back/certificationType/list',{},function (res) {//证件类别
          this.certificationTypeOptions = res.rows;
        }.bind(this));
        ajaxRequest("get","back/certificationName/retrieve",{isDelete: 0},res => {//证件名称
          if (res.code === 200) {
            this.certificationNameOptions = res.rows;
          }
        });
        this.summaryOptions=[{"code":"1","remark":"项目名称"},{"code":"2","remark":"人员列表"}];//汇总字段option
      },
      exportList(){//导出

      },
      openProject(row,type){//打开项目统计弹层
        this.project=true;
        this.data={};
        this.projectOrPerson=type;//1是项目，2是人员
        if(this.projectOrPerson==1){
          this.data.projectId=row.linkID;
        }else{
          this.data.userId=row.personId;
        }
        this.data.source=row.source;
      },
      handleClose(){//关闭登记号弹层
        this.project=false;
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
  .lbCenter .el-form-item__label{
    width:200px !important;
    text-align: center !important;
    padding-right: 0!important;
  }
</style>
