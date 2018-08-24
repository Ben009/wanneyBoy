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
            <el-form-item label="检测部门" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="检测岗位" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否现场" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="日期类型" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="开始日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="结束日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="对比方式" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="实收区间" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="汇总方式" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="departId" placeholder="请选择" @change="getPost">
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
              <el-select v-model="testPost" placeholder="请选择" @change="getPostId">
                <el-option
                  v-for="item in postOptions"
                  :key="item.id"
                  :label="item.postName"
                  :value="item.postName">
                </el-option>
              </el-select>
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
          <el-col :span="2">
            <el-form-item>
              <el-date-picker
                v-model="startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
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
              <el-select v-model="section" placeholder="请选择">
                <el-option
                  v-for="item in sectionOptions"
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
              <span v-if="sum=='1'">{{scope.row.applianceName}}</span>
              <span v-if="sum=='2'">{{scope.row.categoryName}}</span>
              <span v-if="sum=='3'">{{scope.row.realName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="当期">
            <el-table-column prop="xlf" label="修理费" v-if="headObj.xlf"></el-table-column>
            <el-table-column prop="fwf" label="服务费" v-if="headObj.fwf"></el-table-column>
            <el-table-column prop="qtf" label="其他费" v-if="headObj.qtf"></el-table-column>
            <el-table-column prop="ts" label="套数"></el-table-column>
            <el-table-column prop="xczb" label="现场占比"></el-table-column>
            <el-table-column prop="jcf" label="检测费"></el-table-column>
            <el-table-column prop="ss" label="实收"></el-table-column>
            <el-table-column prop="ys" label="应收"></el-table-column>
            <el-table-column prop="gzl" label="工作量"></el-table-column>
            <el-table-column prop="ysqjgzl" label="强检工作量"></el-table-column>
            <el-table-column prop="djjz" label="单价均值"></el-table-column>
          </el-table-column>
          <el-table-column label="对比" v-if="contrast=='1'||contrast=='2'">
            <el-table-column prop="qts" label="套数" v-if="headObj.qts"></el-table-column>
            <el-table-column prop="qxczb" label="现场占比" v-if="headObj.qxczb"></el-table-column>
            <el-table-column prop="qjcf" label="检测费" v-if="headObj.qjcf"></el-table-column>
            <el-table-column prop="qss" label="实收" v-if="headObj.qss"></el-table-column>
            <el-table-column prop="qys" label="应收" v-if="headObj.qys"></el-table-column>
            <el-table-column prop="qgzl" label="工作量" v-if="headObj.qgzl"></el-table-column>
            <el-table-column prop="qysqjgzl" label="强检工作量" v-if="headObj.qysqjgzl"></el-table-column>
            <el-table-column prop="qdjjz" label="单价均值" v-if="headObj.qdjjz"></el-table-column>
          </el-table-column>
          <el-table-column label="差值" v-if="contrast=='2'||contrast=='1'">
            <el-table-column prop="czts" label="套数" v-if="headObj.czts"></el-table-column>
            <el-table-column prop="czxczb" label="现场占比" v-if="headObj.czxczb"></el-table-column>
            <el-table-column prop="czjcf" label="检测费" v-if="headObj.czjcf"></el-table-column>
            <el-table-column prop="czss" label="实收" v-if="headObj.czss"></el-table-column>
            <el-table-column prop="czys" label="应收" v-if="headObj.czys"></el-table-column>
            <el-table-column prop="czgzl" label="工作量" v-if="headObj.czgzl"></el-table-column>
            <el-table-column prop="czysqjgzl" label="强检工作量" v-if="headObj.czysqjgzl"></el-table-column>
            <el-table-column prop="czdjjz" label="单价均值" v-if="headObj.czdjjz"></el-table-column>
          </el-table-column>
          <el-table-column label="差值（百分比）" v-if="contrast=='2'||contrast=='1'">
            <el-table-column prop="dbts" label="套数" v-if="headObj.dbts"></el-table-column>
            <el-table-column prop="dbxczb" label="现场占比" v-if="headObj.dbxczb"></el-table-column>
            <el-table-column prop="dbjcf" label="检测费" v-if="headObj.dbjcf"></el-table-column>
            <el-table-column prop="dbss" label="实收" v-if="headObj.dbss"></el-table-column>
            <el-table-column prop="dbys" label="应收" v-if="headObj.dbys"></el-table-column>
            <el-table-column prop="dbgzl" label="工作量" v-if="headObj.dbgzl"></el-table-column>
            <el-table-column prop="dbysqjgzl" label="强检工作量" v-if="headObj.dbysqjgzl"></el-table-column>
            <el-table-column prop="dbdjjz" label="单价均值" v-if="headObj.dbdjjz"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <applianceChart :list="tableData" v-if="demo" :sum="sum" :height="chartHeight" :width="chartWidth"></applianceChart>
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
  import Retrieve from "../../Retrieve";
  import WorkMould from "../../mould/WorkMould";
  import TableColumnHeader from "../../Table/TableColumnHeader";
  import paramJson from "./applianceParam"; //同目录下json数据
  import applianceChart from "./applianceChart"; //图表
  export default {
    name:"applianceStatistics",//计量器具统计
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      applianceChart
    },
    data() {
      return {
        tableData:[],
        departmentOptions:[],//检测部门option
        postOptions:[],//检测岗位option
        sceneOptions:[],//现场option
        dateTypeOptions:[],//日期类型option
        summaryOptions:[],//汇总方式option
        contrastTypeOptions:[],//对比方式option
        sectionOptions:[],//实收区间option
        testDepartment:"",//检测部门名
        departId:"",//检测部门id
        testPost:"",//检测岗位名
        postId:"",//检测岗位id
        isScene:"",//是否现场
        dateType:"1",//日期类型
        startDate:"",//开始日期
        endDate:"",//结束日期
        summary:"1",//汇总方式
        contrastType:"0",//对比方式
        section:"",//实收区间
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
        if(this.startDate==""){
          this.$message.warning('开始日期没有选择');
          return;
        }
        if(this.endDate==""){
          this.$message.warning('结束日期没有选择');
          return;
        }
        if(this.summary==""){
          this.$message.warning('汇总方式没有选择');
          return;
        }
        ajaxRequest('get','back/statistics/applianceCount',{
          dateType:this.dateType,//日期类型
          isScene:this.isScene,//是否现场
          section:this.section,//实收区间
          summary:this.summary,//汇总方式
          contrast:this.contrast,//对比方式
          startDate:this.startDate,//开始日期
          endDate:this.endDate,//结束日期
          departId:this.departId,//检测部门id
          postId:this.postId,//检测岗位id
        },(res)=>{
          if(res.code===200){
            this.contrast=this.contrastType;
            this.sum=this.summary;
            this.tableData=res.rows;
            if(this.summary=="1"){
              this.chartWidth="1000px";
              this.chartHeight="700px";
            }else if(this.summary=="2"){
              this.chartWidth="1000px";
              this.chartHeight="700px";
            }else if(this.summary=="3"){
              this.chartWidth="1000px";
              this.chartHeight="700px";
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
        ajaxRequest("get","back/statistics/getDepartList",{isDelete: 0},res => {//检测部门
            if (res.code === 200) {
              this.departmentOptions = res.rows;
            }
          }
        );
        this.sceneOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//现场option
        this.dateTypeOptions=[{"code":"1","remark":"委托日期"},{"code":"2","remark":"结算日期"},{"code":"3","remark":"结账日期"}];//日期类型option
        this.contrastTypeOptions=[{"code":"0","remark":"无"},{"code":"1","remark":"同比上年"},{"code":"2","remark":"环比上月"}];//对比类型option
        this.summaryOptions=[{"code":"1","remark":"器具名称"},{"code":"2","remark":"器具类别"},{"code":"3","remark":"器具实际名称"}];//汇总方式option
        this.sectionOptions=[{"code":"1","remark":"10万以下"},{"code":"2","remark":"10万-50万"},{"code":"3","remark":"50-100万"},{"code":"4","remark":"100万以下"},{"code":"5","remark":"100万以上"},{"code":"","remark":"全部"}];//实收区间option
      },
      getPost(value) {
        this.testPost="";
        this.postId="";
        ajaxRequest( "get","back/user/retrieve",{isDelete: 0,departId:value},res => {
          if (res.code === 200) {
            this.postOptions = res.rows;
          }
        });
      },
      getPostId(value) {
        for(let i=0;i<this.postOptions.length;i++){
          if(this.postOptions[i].postName===value){
            this.postId=this.postOptions[i].id;
          }
        }
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
