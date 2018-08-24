<template>
  <div  style="position:relative;">
    <Retrieve  ref="retrieve-wapper"
               :rowsCondition='rowsCondition'
               :sortBy="sortBy"
               :order="order"
               v-if="defaultOpen"
               :paramJson="paramJson"
               :retrieveCondition="retrieveCondition"
               :collectionInfo="collectionInfo"/>

    <div style="display: flex;justify-content: space-between; margin:10px 0px;">
      <div style="display: inline-block;text-align: center">
        <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search"  v-if="defaultOpen">查询</el-button>
        <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning"   v-if="defaultOpen">&nbsp;清空</el-button>
      </div>
      <span style="float: right">
          <el-select size="mini" v-if="resultCondition.length" v-model="templateValue"  placeholder="请选择" @change="QJHandleSelectTemplate">
              <el-option
                v-for="item in moduleList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
          </span>
    </div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="4">
            <el-form-item label="日期类型" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="开始日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="结束日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="行政区划" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="对比方式" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="汇总字段" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="4">
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
          <el-col :span="4">
            <el-form-item>
              <el-date-picker
                v-model="startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-date-picker
                v-model="endDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
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
          <el-col :span="4">
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
          <el-col :span="4">
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
          <el-table-column label="行业名称">
            <template slot-scope="scope">
              <span v-if="sum=='1'">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="当期">
            <el-table-column prop="ss" label="实收"></el-table-column>
            <el-table-column prop="ys" label="应收"></el-table-column>
            <el-table-column prop="ts" label="套数"></el-table-column>
            <el-table-column prop="js" label="件数"></el-table-column>
            <el-table-column prop="khs" label="客户数"></el-table-column>
            <el-table-column prop="wts" label="委托数"></el-table-column>
            <el-table-column prop="zs" label="计量器具种数"></el-table-column>
          </el-table-column>
          <el-table-column label="对比" v-if="contrast=='1'||contrast=='2'">
            <el-table-column prop="qss" label="实收" v-if="headObj.qss"></el-table-column>
            <el-table-column prop="qys" label="应收" v-if="headObj.qys"></el-table-column>
            <el-table-column prop="qts" label="套数" v-if="headObj.qts"></el-table-column>
            <el-table-column prop="qjs" label="件数" v-if="headObj.qjs"></el-table-column>
            <el-table-column prop="qkhs" label="客户数" v-if="headObj.qkhs"></el-table-column>
            <el-table-column prop="qwts" label="委托数" v-if="headObj.qwts"></el-table-column>
            <el-table-column prop="qzs" label="计量器具种数" v-if="headObj.qzs"></el-table-column>
          </el-table-column>
          <el-table-column label="差值"v-if="contrast=='1'||contrast=='2'">
            <el-table-column prop="czss" label="实收" v-if="headObj.czss"></el-table-column>
            <el-table-column prop="czys" label="应收" v-if="headObj.czys"></el-table-column>
            <el-table-column prop="czts" label="套数" v-if="headObj.czts"></el-table-column>
            <el-table-column prop="czjs" label="件数" v-if="headObj.czjs"></el-table-column>
            <el-table-column prop="czkhs" label="客户数" v-if="headObj.czkhs"></el-table-column>
            <el-table-column prop="czwts" label="委托数" v-if="headObj.czwts"></el-table-column>
            <el-table-column prop="czzs" label="计量器具种数" v-if="headObj.czzs"></el-table-column>
          </el-table-column>
          <el-table-column label="差值百分比"v-if="contrast=='1'||contrast=='2'">
            <el-table-column prop="dbss" label="实收" v-if="headObj.dbss"></el-table-column>
            <el-table-column prop="dbys" label="应收" v-if="headObj.dbys"></el-table-column>
            <el-table-column prop="dbts" label="套数" v-if="headObj.dbts"></el-table-column>
            <el-table-column prop="dbjs" label="件数" v-if="headObj.dbjs"></el-table-column>
            <el-table-column prop="dbkhs" label="客户数" v-if="headObj.dbkhs"></el-table-column>
            <el-table-column prop="dbwts" label="委托数" v-if="headObj.dbwts"></el-table-column>
            <el-table-column prop="dbzs" label="计量器具种数" v-if="headObj.dbzs"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <industryChart :list="tableData" v-if="demo" :sum="sum" :height="chartHeight" :width="chartWidth"></industryChart>
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
  import Retrieve from "../../Retrieve";
  import WorkMould from "../../mould/WorkMould";
  import TableColumnHeader from "../../Table/TableColumnHeader";
  import paramJson from "./industryParam"; //同目录下json数据
  import industryChart from "./industryChart"; //图表
  export default {
    name:"industryStatistics",//行业统计
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      industryChart
    },
    data() {
      return {
        tableData:[],
        dateTypeOptions:[],//日期类型option
        regionOptions:[],//行政区option
        summaryOptions:[],//汇总字段option
        contrastTypeOptions:[],//对比类型option
        dateType:"1",//日期类型
        startDate:"",//开始日期
        endDate:"",//结束日期
        region:"",//行政区
        contrastType:"0",//对比类型
        summary:"1",//汇总字段
        contrast:"0",//控制显示的对比类型
        sum:"1",//控制显示的汇总字段
        demo:true,//图表
        chartWidth:"",//图表
        chartHeight:"",//图表

        isSetting: 0, //控制个性化设置弹窗是否展示
        edit: null, //控制编辑弹窗是否展示
        isInner: 0,
        /*高级检索相关项*/
        rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
        paramJson: paramJson, //同目录下json数据 常量
        moduleList: [], //模板列表
        templateValue: "", //当前选择的模板id
        sortBy: "", //排序字段
        order: "", //desc降序 asc升序
        headObj: {}, //表头显示对象 {category:true}
        defaultOpen: false, //默认开启高级查询
        sc:'',
        userId: "",
        allModules: {}, //所有模板
        resultCondition: [],
        retrieveCondition: [],
        collectionInfo:[],
      }
    },
    methods:{
      getTableList(){
        if(this.dateType==""){
          this.$message.warning('日期类型没有选择');
          return;
        }
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
        ajaxRequest('get','back/statistics/hangyeCount',{
          dateType:this.dateType,//日期类型
          startDate:this.startDate,//开始日期
          endDate:this.endDate,//结束日期
          contrastType:this.contrastType,//对比类型
          summary:this.summary,//汇总方式
          province:this.region,//行政区
        },(res)=>{
          if(res.code===200){
            this.contrast=this.contrastType;
            this.sum=this.summary;
            this.tableData=res.rows;
            if(this.summary=="1"){
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
        this.dateTypeOptions=[{"code":"1","remark":"委托日期"},{"code":"2","remark":"结算日期"},{"code":"3","remark":"结账日期"}];//日期类型option
        this.contrastTypeOptions=[{"code":"0","remark":"无"},{"code":"1","remark":"同比上年"},{"code":"2","remark":"环比上月"}];//对比类型option
        this.summaryOptions=[{"code":"1","remark":"客户行业"}];//汇总方式option
        ajaxRequest("get", "back/company/getRegion?type=0", {isDelete:0}, function(res) {//行政区划
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
