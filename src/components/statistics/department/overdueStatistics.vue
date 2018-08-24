<template>
  <div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="2">
            <el-form-item label="是否现场" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否强检" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否加急" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否完成" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否延期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="对比类型" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="汇总字段" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="委托开始日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="委托结束日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="检测部门" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="2">
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
              <el-select v-model="isComplete" placeholder="请选择">
                <el-option
                  v-for="item in completeOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-select v-model="isDelay" placeholder="请选择">
                <el-option
                  v-for="item in delayOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-select v-model="contrastType" placeholder="请选择">
                <el-option
                  v-for="item in contrastTypeOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
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
              <span v-if="sum=='1'" @click="openRegistration(scope.row,1)" style="color:deepskyblue;cursor:pointer;">{{scope.row.departName}}</span>
              <span v-if="sum=='2'" @click="openRegistration(scope.row,2)" style="color:deepskyblue;cursor:pointer;">{{scope.row.postName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="当期">
            <el-table-column prop="wts" label="委托数"></el-table-column>
            <el-table-column prop="djhs" label="登记号数"></el-table-column>
            <el-table-column prop="ts" label="套数"></el-table-column>
            <el-table-column prop="zjs" label="件数"></el-table-column>
          </el-table-column>
          <el-table-column label="对比" v-if="contrast=='1'||contrast=='2'">
            <el-table-column prop="qwts" label="委托数"></el-table-column>
            <el-table-column prop="qdjhs" label="登记号数"></el-table-column>
            <el-table-column prop="qts" label="套数"></el-table-column>
            <el-table-column prop="qzjs" label="件数"></el-table-column>
          </el-table-column>
          <el-table-column label="超期比例" v-if="contrast=='1'||contrast=='2'">
            <el-table-column prop="dbdjhs" label="登记号"></el-table-column>
            <el-table-column prop="dbts" label="套数"></el-table-column>
            <el-table-column prop="dbzjs" label="件数"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <overdueForm v-if="registrationNo" :departmentOrPost="departmentOrPost" :callback="handleClose" :data="data"></overdueForm>
      <overdueChart :list="tableData" v-if="demo" :sum="sum" :height="chartHeight" :width="chartWidth"></overdueChart>
    </el-form>
  </div>
</template>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入登记号弹层
  import overdueForm from "./overdueForm";
  import overdueChart from "./overdueChart"; //图表
  export default {
    name:"overdueStatistics",//超期统计
    components: {
      overdueForm,
      overdueChart
    },
    data() {
      return {
        tableData:[],
        sceneOptions:[],//现场option
        strongInspectionOptions:[],//强检option
        urgentOptions:[],//加急option
        completeOptions:[],//完成option
        delayOptions:[],//延期option
        summaryOptions:[],//汇总字段option
        contrastTypeOptions:[],//对比类型option
        departmentOptions:[],//检测部门option
        isScene:"",//是否现场
        isStrongInspection:"",//是否强检
        isUrgent:"",//是否加急
        isComplete:"",//是否完成
        isDelay:"",//是否延期
        summary:"1",//汇总字段
        contrastType:"0",//对比类型
        startDate:"",//委托开始日期
        endDate:"",//委托结束日期
        testDepartment:"",//检测部门名
        departId:"",//检测部门id
        contrast:"0",//控制显示的对比类型
        sum:"1",//控制显示的汇总字段
        registrationNo:false,//登记号弹层
        departmentOrPost:"",//登记号弹层查看部门还是岗位
        data:{},//传到登记号弹层的数据
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
          this.$message.warning('委托开始日期没有选择');
          return;
        }
        if(this.endDate==""){
          this.$message.warning('委托结束日期没有选择');
          return;
        }
        ajaxRequest('get','back/statistics/chaoqiCount',{
          isScene:this.isScene,//是否现场
          isStrongInspection:this.isStrongInspection,//是否强检
          isUrgent:this.isUrgent,//是否加急
          finishFlag:this.isComplete,//是否完成
          delayFlag:this.isDelay,//是否延期
          summary:this.summary,//汇总字段
          contrastType:this.contrastType,//对比类型
          dateType:"1",//日期类型:委托日期
          startDate:this.startDate,//委托开始日期
          endDate:this.endDate,//委托结束日期
          departId:this.departId,//检测部门id
        },(res)=>{
          if(res.code===200){
            this.contrast=this.contrastType;
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
        this.sceneOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//现场option
        this.strongInspectionOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//强检option
        this.urgentOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//加急option
        this.completeOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//完成option
        this.delayOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//延期option
        this.contrastTypeOptions=[{"code":"0","remark":"无"},{"code":"1","remark":"同比上年"},{"code":"2","remark":"环比上月"}];//对比类型option
        this.summaryOptions=[{"code":"1","remark":"检测部门"},{"code":"2","remark":"检测岗位"}];//汇总字段option
        ajaxRequest("get","back/statistics/getDepartList",{isDelete: 0},res => {//检测部门
            if (res.code === 200) {
              this.departmentOptions = res.rows;
            }
          }
        );
      },
      exportList(){//导出

      },
      openRegistration(row,type){//打开登记号弹层
        this.registrationNo=true;
        this.departmentOrPost=type;//1是部门，2是岗位
        if(this.departmentOrPost==1){
          this.data.departId=row.departId;
          this.data.postId="";
        }else{
          this.data.postId=row.postId;
          this.data.departId="";
        }
      },
      handleClose(){//关闭登记号弹层
        this.registrationNo=false;
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
