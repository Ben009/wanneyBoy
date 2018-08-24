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
          <el-col :span="3">
            <el-form-item label="日期类型" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="开始日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="结束日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否转合同" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否现场" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否加急" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="执行计划" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="对比方式" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="汇总方式" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
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
              <el-select v-model="isContact" placeholder="请选择">
                <el-option
                  v-for="item in contactOptions"
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
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="plan" placeholder="请选择">
                <el-option
                  v-for="item in planOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
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
              <span v-if="sum=='1'">{{scope.row.businessGroup}}</span>
              <span v-if="sum=='2'">{{scope.row.userName}}</span>
              <span v-if="sum=='3'" @click="openOffer(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.companyName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="当期">
            <el-table-column prop="ts" label="报价套数"></el-table-column>
            <el-table-column prop="xczb" label="现场占比"></el-table-column>
            <el-table-column prop="jjzb" label="加急占比"></el-table-column>
            <el-table-column prop="js" label="报价件数"></el-table-column>
            <el-table-column prop="zje" label="报价总金额"></el-table-column>
            <el-table-column prop="jjf" label="加急费"></el-table-column>
            <el-table-column prop="ys" label="报价应收"></el-table-column>
            <el-table-column prop="zkl" label="平均折扣率"></el-table-column>
          </el-table-column>
          <el-table-column label="对比"v-if="contrast=='2'||contrast=='1'">
            <el-table-column prop="qts" label="报价套数" v-if="headObj.qts"></el-table-column>
            <el-table-column prop="qxczb" label="现场占比" v-if="headObj.qxczb"></el-table-column>
            <el-table-column prop="qjjzb" label="加急占比" v-if="headObj.qjjzb"></el-table-column>
            <el-table-column prop="qjs" label="报价件数" v-if="headObj.qjs"></el-table-column>
            <el-table-column prop="qzje" label="报价总金额" v-if="headObj.qzje"></el-table-column>
            <el-table-column prop="qjjf" label="加急费" v-if="headObj.qjjf"></el-table-column>
            <el-table-column prop="qbjys" label="报价应收" v-if="headObj.qbjys"></el-table-column>
            <el-table-column prop="qzkl" label="平均折扣率" v-if="headObj.qzkl"></el-table-column>
          </el-table-column>
          <el-table-column label="差值" v-if="contrast=='2'||contrast=='1'">
            <el-table-column prop="czts" label="报价套数" v-if="headObj.czts"></el-table-column>
            <el-table-column prop="czxczb" label="现场占比" v-if="headObj.czxczb"></el-table-column>
            <el-table-column prop="czjjzb" label="加急占比" v-if="headObj.czjjzb"></el-table-column>
            <el-table-column prop="czjs" label="报价件数" v-if="headObj.czjs"></el-table-column>
            <el-table-column prop="czzje" label="报价总金额" v-if="headObj.czzje"></el-table-column>
            <el-table-column prop="czjjf" label="加急费" v-if="headObj.czjf"></el-table-column>
            <el-table-column prop="czbjys" label="报价应收" v-if="headObj.czbjys"></el-table-column>
            <el-table-column prop="czzkl" label="平均折扣率" v-if="headObj.czzkl"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <el-row>
      <div style="margin-top:10px;text-align:center;float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
      </el-row>
      <offerForm v-if="offer" :callback="handleClose" :data="data"></offerForm>
      <offerChart :list="tableData" v-if="demo" :sum="sum" :height="chartHeight" :width="chartWidth"></offerChart>
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
  import paramJson from "./offerParam"; //同目录下json数据
  //引入报价弹层
  import offerForm from "./offerForm";
  import offerChart from "./offerChart";
  import ElRow from "../../../common-el/packages/row/src/row"; //图表
  export default {
    name:"offerStatistics",//报价统计
    components: {
      ElRow,
      WorkMould,
      TableColumnHeader,
      Retrieve,
      offerForm,
      offerChart
    },
    data() {
      return {
        page:1,//页码
        rows:50,//每页记录数
        fuzzySearch:0,//是否模糊查询，默认关闭模糊查询
        total:0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
        tableData:[],
        sceneOptions:[],//现场option
        contactOptions:[],//转合同option
        urgentOptions:[],//加急option
        planOptions:[],//执行计划option
        dateTypeOptions:[],//日期类型option
        summaryOptions:[],//汇总字段option
        contrastTypeOptions:[],//对比类型option
        isScene:"",//是否现场
        isContact:"",//是否转合同
        isUrgent:"",//是否加急
        plan:"",//执行计划
        dateType:"1",//日期类型
        startDate:"",//开始日期
        endDate:"",//结束日期
        contrastType:"0",//对比类型
        summary:"1",//汇总字段
        jurisdiction:"",//权限
        contrast:"0",//控制显示的对比类型
        sum:"1",//控制显示的汇总字段
        offer:false,//报价弹层
        data:{},//传到报价弹层的数据
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
        ajaxRequest('get','back/statistics/baojiaCount',{
          page:this.page,
          rows:this.rows,
          total:0,
          isScene:this.isScene,//是否现场
          isContact:this.isContact,//是否转合同
          isUrgent:this.isUrgent,//是否加急
          plan:this.plan,//执行计划
          dateType:this.dateType,//日期类型
          startDate:this.startDate,//开始日期
          endDate:this.endDate,//结束日期
          contrastType:this.contrastType,//对比类型
          summary:this.summary,//汇总字段
        },(res)=>{
          if(res.code===200){
            this.contrast=this.contrastType;
            this.sum=this.summary;
            this.tableData=res.rows;
            this.total=res.total;
            if(this.summary=="1"){
              this.chartWidth="500px";
              this.chartHeight="600px";
            }else if(this.summary=="2"){
              this.chartWidth="500px";
              this.chartHeight="600px";
            }else if(this.summary=="3"){
              this.chartWidth="500px";
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
        this.dateTypeOptions=[{"code":"1","remark":"报价日期"},{"code":"2","remark":"报价审核日期"},{"code":"3","remark":"委托日期"},{"code":"4","remark":"结算日期"},{"code":"5","remark":"结账日期"}];//日期类型option
        this.contactOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//转合同option
        this.sceneOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//现场option
        this.urgentOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//加急option
        this.planOptions=[{"code":"","remark":"全部"},{"code":"1","remark":"已转计划"},{"code":"2","remark":"已要号"},{"code":"3","remark":"已完成"},{"code":"4","remark":"已结账"}];//加急option
        this.contrastTypeOptions=[{"code":"0","remark":"无"},{"code":"1","remark":"同比上年"},{"code":"2","remark":"环比上月"}];//对比类型option
        this.summaryOptions=[{"code":"1","remark":"业务组"},{"code":"2","remark":"业务员"},{"code":"3","remark":"客户ID"}];//汇总字段option
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
      openOffer(row) {//点击客户名称打开人员报价弹层
        this.offer=true;
        this.data.companyId=row.companyId;
      },
      handleClose(){//关闭人员报价弹层
        this.offer=false;
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
