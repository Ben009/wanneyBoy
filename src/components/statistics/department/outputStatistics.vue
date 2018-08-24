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
          <el-col :span="2">
            <el-form-item label="是否现场" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否强检" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否加急" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="检测部门" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="日期类型" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="开始日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="结束日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="对比类型" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="汇总字段" class="lbCenter"></el-form-item>
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
                  :fit="true"
                  @expand-change="expandDepartment">
          <el-table-column type="expand"  v-show="sum=='2'" v-if="sum=='2'">
            <template slot-scope="props">
              <el-table :data="tableData2" border style="width: 100%" :fit="true">
                <el-table-column prop="postName" label="人员名称"></el-table-column>
                <el-table-column prop="zts" label="总套数"></el-table-column>
                <el-table-column prop="tts" label="套数（退）"></el-table-column>
                <el-table-column prop="ss" label="实收"></el-table-column>
                <el-table-column prop="ys" label="应收合计"></el-table-column>
                <el-table-column prop="ysjcf" label="应收检测费" v-if="headObj.ysjcf"></el-table-column>
                <el-table-column prop="ysxlf" label="应收修理费" v-if="headObj.ysxlf"></el-table-column>
                <el-table-column prop="ysfwf" label="应收服务费" v-if="headObj.ysfwf"></el-table-column>
                <el-table-column prop="ysqtf" label="应收其他费" v-if="headObj.ysqtf"></el-table-column>
                <el-table-column prop="ssjcf" label="检测费" v-if="headObj.ssjcf"></el-table-column>
                <el-table-column prop="ssxlf" label="修理费" v-if="headObj.ssxlf"></el-table-column>
                <el-table-column prop="ssfwf" label="服务费" v-if="headObj.ssfwf"></el-table-column>
                <el-table-column prop="ssqtf" label="其他费" v-if="headObj.ssqtf"></el-table-column>
                <el-table-column prop="ssgzl" label="工作量" v-if="headObj.ssgzl"></el-table-column>
                <el-table-column prop="ysqjgzl" label="强检工作量" v-if="headObj.ssgzl"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span v-if="sum=='1'">{{scope.row.userName}}</span>
              <span v-if="sum=='2'">{{scope.row.departName}}</span>
              <span v-if="sum=='3'" @click="openPost(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.postName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="当期">
             <el-table-column prop="zts" label="总套数"></el-table-column>
             <el-table-column prop="tts" label="套数（退）"></el-table-column>
             <el-table-column prop="ss" label="实收"></el-table-column>
             <el-table-column prop="ys" label="应收合计"></el-table-column>
             <el-table-column prop="ysjcf" label="应收检测费" v-if="headObj.ysjcf"></el-table-column>
             <el-table-column prop="ysxlf" label="应收修理费" v-if="headObj.ysxlf"></el-table-column>
             <el-table-column prop="ysfwf" label="应收服务费" v-if="headObj.ysfwf"></el-table-column>
             <el-table-column prop="ysqtf" label="应收其他费" v-if="headObj.ysqtf"></el-table-column>
             <el-table-column prop="ssjcf" label="检测费" v-if="headObj.ssjcf"></el-table-column>
             <el-table-column prop="ssxlf" label="修理费" v-if="headObj.ssxlf"></el-table-column>
             <el-table-column prop="ssfwf" label="服务费" v-if="headObj.ssfwf"></el-table-column>
             <el-table-column prop="ssqtf" label="其他费" v-if="headObj.ssqtf"></el-table-column>
             <el-table-column prop="ssgzl" label="工作量" v-if="headObj.ssgzl"></el-table-column>
             <el-table-column prop="ysqjgzl" label="强检工作量" v-if="headObj.ssgzl"></el-table-column>
          </el-table-column>
          <el-table-column label="对比"v-if="contrast=='2'||contrast=='1'">
            <el-table-column prop="qzts" label="总套数" v-if="headObj.qzts"></el-table-column>
            <el-table-column prop="qtts" label="套数（退）" v-if="headObj.qtts"></el-table-column>
            <el-table-column prop="qss" label="实收" v-if="headObj.qss"></el-table-column>
            <el-table-column prop="qys" label="应收合计" v-if="headObj.qys"></el-table-column>
            <el-table-column prop="qysjcf" label="应收检测费" v-if="headObj.qysjcf"></el-table-column>
            <el-table-column prop="qysxlf" label="应收修理费" v-if="headObj.qysxlf"></el-table-column>
            <el-table-column prop="qysfwf" label="应收服务费" v-if="headObj.qysfwf"></el-table-column>
            <el-table-column prop="qysqtf" label="应收其他费" v-if="headObj.qysqtf"></el-table-column>
            <el-table-column prop="qssjcf" label="检测费" v-if="headObj.qssjcf"></el-table-column>
            <el-table-column prop="qssxlf" label="修理费" v-if="headObj.qssxlf"></el-table-column>
            <el-table-column prop="qssfwf" label="服务费" v-if="headObj.qssfwf"></el-table-column>
            <el-table-column prop="qssqtf" label="其他费" v-if="headObj.qssqtf"></el-table-column>
            <el-table-column prop="qssgzl" label="工作量" v-if="headObj.qssgzl"></el-table-column>
            <el-table-column prop="dbysqjgzl" label="强检工作量" v-if="headObj.dbssgzl"></el-table-column>
           </el-table-column>
          <el-table-column label="差值" v-if="contrast=='2'||contrast=='1'">
            <el-table-column prop="czzts" label="总套数" v-if="headObj.czzts"></el-table-column>
            <el-table-column prop="cztts" label="套数（退）" v-if="headObj.cztts"></el-table-column>
            <el-table-column prop="czys" label="实收" v-if="headObj.czys"></el-table-column>
            <el-table-column prop="czys" label="应收合计" v-if="headObj.czys"></el-table-column>
            <el-table-column prop="czysjcf" label="应收检测费" v-if="headObj.czysjcf"></el-table-column>
            <el-table-column prop="czysxlf" label="应收修理费" v-if="headObj.czysxlf"></el-table-column>
            <el-table-column prop="czysfwf" label="应收服务费" v-if="headObj.czysfwf"></el-table-column>
            <el-table-column prop="czysqtf" label="应收其他费" v-if="headObj.czysqtf"></el-table-column>
            <el-table-column prop="czssjcf" label="检测费" v-if="headObj.czssjcf"></el-table-column>
            <el-table-column prop="czssxlf" label="修理费" v-if="headObj.czssxlf"></el-table-column>
            <el-table-column prop="czssfwf" label="服务费" v-if="headObj.czssfwf"></el-table-column>
            <el-table-column prop="czssqtf" label="其他费" v-if="headObj.czssqtf"></el-table-column>
            <el-table-column prop="czssgzl" label="工作量" v-if="headObj.czssgzl"></el-table-column>
            <el-table-column prop="czysqjgzl" label="强检工作量" v-if="headObj.czssgzl"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <postForm v-if="post" :callback="handleClose" :data="data"></postForm>
      <outputChart :list="tableData" v-if="(sum=='2'||sum=='3')&&demo" :sum="sum" :height="chartHeight" :width="chartWidth"></outputChart>
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
  //引入岗位弹层
  import postForm from "./postForm";
  import Retrieve from "../../Retrieve";
  import WorkMould from "../../mould/WorkMould";
  import TableColumnHeader from "../../Table/TableColumnHeader";
  import paramJson from "./outputParam"; //同目录下json数据
  import outputChart from "./outputChart"; //图表
  export default {
    name:"outputStatistics",//产值统计
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      postForm,
      outputChart
    },
    data() {
      return {
        tableData:[],
        tableData2:[],//展开部门人员产值
        sceneOptions:[],//现场option
        strongInspectionOptions:[],//强检option
        urgentOptions:[],//加急option
        departmentOptions:[],//检测部门option
        dateTypeOptions:[],//日期类型option
        summaryOptions:[],//汇总字段option
        contrastTypeOptions:[],//对比类型option
        isScene:"",//是否现场
        isStrongInspection:"",//是否强检
        isUrgent:"",//是否加急
        testDepartment:"",//检测部门名
        departId:"",//检测部门id
        dateType:"1",//日期类型
        startDate:"",//开始日期
        endDate:"",//结束日期
        contrastType:"0",//对比类型
        summary:"1",//汇总字段
        contrast:"0",//控制显示的对比类型
        sum:"1",//控制显示的汇总字段
        post:false,//岗位弹层
        data:{},//传到岗位弹层的数据
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
      expandDepartment(row, expandedRows){//展开部门人员产值
        ajaxRequest('get','back/statistics/chanzhiCount',{
          isScene:this.isScene,//是否现场
          isStrongInspection:this.isStrongInspection,//是否强检
          isUrgent:this.isUrgent,//是否加急
          departId:row.departId,//检测部门id
          dateType:this.dateType,//日期类型
          startDate:this.startDate,//开始日期
          endDate:this.endDate,//结束日期
          contrastType:this.contrastType,//对比类型
          summary:3,//汇总字段
        },(res)=>{
          if(res.code===200){
            this.tableData2=res.rows;
          }else{
            this.$message.error(res.msg);
          }
        })
      },
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
        ajaxRequest('get','back/statistics/chanzhiCount',{
          isScene:this.isScene,//是否现场
          isStrongInspection:this.isStrongInspection,//是否强检
          isUrgent:this.isUrgent,//是否加急
          departId:this.departId,//检测部门id
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
            if(this.summary=="2"){
              this.chartWidth="500px";
              this.chartHeight="500px";
            }else if(this.summary=="3"){
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
        this.dateTypeOptions=[{"code":"1","remark":"委托日期"},{"code":"2","remark":"结算日期"},{"code":"3","remark":"结账日期"}];//日期类型option
        this.contrastTypeOptions=[{"code":"0","remark":"无"},{"code":"1","remark":"同比上年"},{"code":"2","remark":"环比上月"}];//对比类型option
        this.summaryOptions=[{"code":"1","remark":"检定员"},{"code":"2","remark":"检测部门"},{"code":"3","remark":"检测岗位"}];//汇总字段option
        ajaxRequest("get","back/statistics/getDepartList",{isDelete: 0},res => {//检测部门
            if (res.code === 200) {
              this.departmentOptions = res.rows;
            }
          }
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
      openPost(row) {//点击岗位展开人员产值弹层
        this.post=true;
        this.data.postId=row.postId;
        this.data.isScene=this.isScene;//是否现场
        this.data.isStrongInspection=this.isStrongInspection;//是否强检
        this.data.isUrgent=this.isUrgent;//是否加急
        this.data.departId=this.departId;//检测部门id
        this.data.dateType=this.dateType;//日期类型
        this.data.startDate=this.startDate;//开始日期
        this.data.endDate=this.endDate;//结束日期
        this.data.contrastType=this.contrastType;//对比类型
        this.data.summary=this.summary;//汇总字段
        console.log(this.data)
      },
      handleClose(){//关闭人员产值弹层
        this.post=false;
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
