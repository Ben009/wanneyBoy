<template>
  <div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="2">
            <el-form-item label="是否强检" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否加急" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="状态" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="单位类别" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="日期类别" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="开始日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="结束日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="汇总字段" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="检测部门" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="2">
            <el-form-item>
              <el-select v-model="isStrongInspection" placeholder="请选择">
                <el-option
                  v-for="item in strongInspectionOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-select v-model="isUrgent" placeholder="请选择">
                <el-option
                  v-for="item in urgentOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-select v-model="state" placeholder="请选择">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="companyTypes" placeholder="请选择" multiple filterable>
                <el-option
                  v-for="item in companyTypeOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="dateType" placeholder="请选择">
                <el-option
                  v-for="item in dateTypeOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-date-picker
                v-model="startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-date-picker
                v-model="endDate"
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
              <span v-if="sum=='1'" @click="openTask(scope.row,1)" style="color:deepskyblue;cursor:pointer;">{{scope.row.departName}}</span>
              <span v-if="sum=='2'" @click="openTask(scope.row,2)" style="color:deepskyblue;cursor:pointer;">{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="days" label="下厂次数"></el-table-column>
          <el-table-column prop="wts" label="委托数"></el-table-column>
          <el-table-column prop="js" label="台件数"></el-table-column>
        </el-table>
      </div>
      <taskForm v-if="task" :departmentOrPerson="departmentOrPerson" :callback="handleClose" :data="data"></taskForm>
      <sceneChart :list="tableData" v-if="demo" :sum="sum" :height="chartHeight" :width="chartWidth"></sceneChart>
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
  //引入下厂任务列表弹层
  import taskForm from "./taskForm";
  import sceneChart from "./sceneChart"; //图表
  export default {
    name:"sceneStatistics",//现场统计
    components: {
      taskForm,
      sceneChart
    },
    data() {
      return {
        tableData:[],
        strongInspectionOptions:[],//强检option
        urgentOptions:[],//加急option
        stateOptions:[],//状态option
        companyTypeOptions:[],//单位类别option
        summaryOptions:[],//汇总字段option
        dateTypeOptions:[],//日期类型option
        departmentOptions:[],//检测部门option
        isStrongInspection:"",//是否强检
        isUrgent:"",//是否加急
        state:"",//状态
        companyTypes:[],//单位类别
        summary:"1",//汇总字段
        dateType:"1",//日期类型
        startDate:"",//开始日期
        endDate:"",//结束日期
        testDepartment:"",//检测部门名
        departId:"",//检测部门id
        sum:"1",//控制显示的汇总字段
        task:false,//下厂任务列表弹层
        departmentOrPerson:"",//下厂任务列表弹层查看部门还是人员
        data:{},//传到下厂任务列表弹层的数据
        demo:true,//图表
        chartWidth:"",//图表
        chartHeight:"",//图表
      }
    },
    methods:{
      getTableList(){
        if(this.summary==""){
          this.$message.warning('汇总字段没有选择');
          return;
        }
        if(this.startDate==""){
          this.$message.warning('开始日期没有选择');
          return;
        }
        if(this.endDate==""){
          this.$message.warning('结束日期没有选择');
          return;
        }
        ajaxRequest('get','back/statistics/xianchangCount',{
          isStrongInspection:this.isStrongInspection,//是否强检
          isUrgent:this.isUrgent,//是否加急
          state:this.state,//状态
          companyTypes:JSON.stringify(this.companyTypes),//单位类别
          summary:this.summary,//汇总字段
          dateType:this.dateType,//日期类型
          startDate:this.startDate,//开始日期
          endDate:this.endDate,//结束日期
          departId:this.departId,//检测部门id
        },(res)=>{
          if(res.code===200){
            this.sum=this.summary;
            this.tableData=res.rows;
            if(this.summary=="1"){
              this.chartWidth="1000px";
              this.chartHeight="1000px";
            }else if(this.summary=="2"){
              this.chartWidth="1000px";
              this.chartHeight="1000px";
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
        this.strongInspectionOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//强检option
        this.urgentOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//加急option
        this.stateOptions=[{"code":"","remark":"全部"},{"code":"1","remark":"未要号"},{"code":"2","remark":"已要号"},{"code":"3","remark":"已结算"},{"code":"4","remark":"已结账"}];//状态option
        this.companyTypeOptions=[{"code":"1","remark":"第一类别"},{"code":"2","remark":"第二类别"},{"code":"3","remark":"第三类别"},{"code":"4","remark":"第四类别"},{"code":"5","remark":"第五类别"},{"code":"6","remark":"第六类别"},];//单位类别option
        this.dateTypeOptions=[{"code":"1","remark":"委托日期"},{"code":"2","remark":"下厂日期"},{"code":"3","remark":"结算日期"},{"code":"4","remark":"结账日期"}];//日期类别option
        this.summaryOptions=[{"code":"1","remark":"检测部门"},{"code":"2","remark":"下厂人员"}];//汇总字段option
        ajaxRequest("get","back/statistics/getDepartList",{isDelete: 0},res => {//检测部门
            if (res.code === 200) {
              this.departmentOptions = res.rows;
            }
          }
        );
      },
      exportList(){//导出

      },
      openTask(row,type){//打开登记号弹层
        this.task=true;
        this.departmentOrPerson=type;//1是部门，2是人员
        if(this.departmentOrPerson==1){
          this.data.departId=row.departId;
          this.data.postId="";
        }else{
          this.data.userId=row.userId;
          this.data.departId="";
        }
      },
      handleClose(){//关闭登记号弹层
        this.task=false;
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
