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
          <el-col :span="3">
            <el-form-item label="对比类型" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="产值区间" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="差值区间" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="汇总字段" class="lbCenter"></el-form-item>
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
              <el-select v-model="output" placeholder="请选择">
                <el-option
                  v-for="item in outputOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="difference" placeholder="请选择">
                <el-option
                  v-for="item in differenceOptions"
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
                  :fit="true" v-loading="loading">
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span v-if="sum=='1'" @click="openEntrust(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.companyName}}</span>
              <span v-if="sum=='2'">{{scope.row.PROVINCE}}</span>
              <span v-if="sum=='3'">{{scope.row.ywz}}</span>
              <span v-if="sum=='4'">{{scope.row.ywy}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bjcz" label="报价产值"></el-table-column>
          <el-table-column prop="bjzb" label="报价占比"></el-table-column>
          <el-table-column label="当期">
            <el-table-column prop="ts" label="套数"></el-table-column>
            <el-table-column prop="tts" label="套数（退）"></el-table-column>
            <el-table-column prop="certificateNumber" label="证书数量"></el-table-column>
            <el-table-column prop="yshj" label="应收合计"></el-table-column>
            <el-table-column prop="ysjcf" label="应收检测费" v-if="headObj.ysjcf"></el-table-column>
            <el-table-column prop="ysxlf" label="应收修理费" v-if="headObj.ysxlf"></el-table-column>
            <el-table-column prop="ysfwf" label="应收服务费" v-if="headObj.ysfwf"></el-table-column>
            <el-table-column prop="ysqtf" label="应收其他费" v-if="headObj.ysqtf"></el-table-column>
            <el-table-column prop="ysgzl" label="工作量" v-if="headObj.ysgzl"></el-table-column>
            <el-table-column prop="ssqjgzl" label="强检工作量" v-if="headObj.ssqjgzl"></el-table-column>
            <el-table-column prop="jcf" label="检测费" v-if="headObj.jcf"></el-table-column>
            <el-table-column prop="xlf" label="修理费" v-if="headObj.xlf"></el-table-column>
            <el-table-column prop="fwf" label="服务费" v-if="headObj.fwf"></el-table-column>
            <el-table-column prop="qtf" label="其他费" v-if="headObj.qtf"></el-table-column>
          </el-table-column>
          <el-table-column label="对比" v-if="contrast=='1'||contrast=='2'">
            <el-table-column prop="qts" label="套数" v-if="headObj.qts"></el-table-column>
            <el-table-column prop="qtts" label="套数（退）" v-if="headObj.qtts"></el-table-column>
            <el-table-column prop="qcertificateNumber" label="证书数量" v-if="headObj.qcertificateNumber"></el-table-column>
            <el-table-column prop="qyshj" label="应收合计" v-if="headObj.qyshj"></el-table-column>
            <el-table-column prop="qysjcf" label="应收检测费" v-if="headObj.qysjcf"></el-table-column>
            <el-table-column prop="qysxlf" label="应收修理费" v-if="headObj.qysxlf"></el-table-column>
            <el-table-column prop="qysfwf" label="应收服务费" v-if="headObj.qysfwf"></el-table-column>
            <el-table-column prop="qysqtf" label="应收其他费" v-if="headObj.qysqtf"></el-table-column>
            <el-table-column prop="qysgzl" label="工作量" v-if="headObj.qysgzl"></el-table-column>
            <el-table-column prop="qssqjgzl" label="强检工作量" v-if="headObj.qssqjgzl"></el-table-column>
            <el-table-column prop="qjcf" label="检测费" v-if="headObj.qjcf"></el-table-column>
            <el-table-column prop="qxlf" label="修理费" v-if="headObj.qxlf"></el-table-column>
            <el-table-column prop="qfwf" label="服务费" v-if="headObj.qfwf"></el-table-column>
            <el-table-column prop="qqtf" label="其他费" v-if="headObj.qqtf"></el-table-column>
          </el-table-column>
          <el-table-column label="差值"v-if="contrast=='1'||contrast=='2'">
            <el-table-column prop="czts" label="套数" v-if="headObj.czts"></el-table-column>
            <el-table-column prop="cztts" label="套数（退）" v-if="headObj.cztts"></el-table-column>
            <el-table-column prop="czcertificateNumber" label="证书数量" v-if="headObj.czcertificateNumber"></el-table-column>
            <el-table-column prop="czyshj" label="应收合计" v-if="headObj.czyshj"></el-table-column>
            <el-table-column prop="czysjcf" label="应收检测费" v-if="headObj.czysjcf"></el-table-column>
            <el-table-column prop="czysxlf" label="应收修理费" v-if="headObj.czysxlf"></el-table-column>
            <el-table-column prop="czysfwf" label="应收服务费" v-if="headObj.czysfwf"></el-table-column>
            <el-table-column prop="czysqtf" label="应收其他费" v-if="headObj.czysqtf"></el-table-column>
            <el-table-column prop="czysgzl" label="工作量" v-if="headObj.czysgzl"></el-table-column>
            <el-table-column prop="czssqjgzl" label="强检工作量" v-if="headObj.czssqjgzl"></el-table-column>
            <el-table-column prop="czjcf" label="检测费" v-if="headObj.czjcf"></el-table-column>
            <el-table-column prop="czxlf" label="修理费" v-if="headObj.czxlf"></el-table-column>
            <el-table-column prop="czfwf" label="服务费" v-if="headObj.czfwf"></el-table-column>
            <el-table-column prop="czqtf" label="其他费" v-if="headObj.czqtf"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <entrustForm v-if="entrust" :callback="handleClose" :data="data"></entrustForm>
      <outputChart :list="tableData" v-if="demo" :sum="sum" :height="chartHeight" :width="chartWidth"></outputChart>
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
  //引入客户委托信息弹层
  import entrustForm from "./entrustForm";
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
      entrustForm,
      outputChart
    },
    data() {
      return {
        tableData:[],
        dateTypeOptions:[],//日期类型option
        differenceOptions:[],//差值区间option
        outputOptions:[],//产值区间option
        summaryOptions:[],//汇总字段option
        contrastTypeOptions:[],//对比类型option
        dateType:"1",//日期类型
        startDate:"",//开始日期
        endDate:"",//结束日期
        difference:"",//差值
        output:"",//产值
        contrastType:"0",//对比类型
        summary:"1",//汇总字段
        contrast:"0",//控制显示的对比类型
        sum:"1",//控制显示的汇总字段
        entrust:false,//客户委托信息弹层
        data:{},//传到客户委托信息弹层的数据
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
        defaultOpen: true, //默认开启高级查询
        sc:'',
        userId: "",
        allModules: {}, //所有模板
        resultCondition: [],
        retrieveCondition: [],
        collectionInfo:[],
        loading:false,
      }
    },
    methods:{

      getTableList(){
        this.loading=true;
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
        ajaxRequest('get','back/statistics/yewuchanzhiCount',{
          dateType:this.dateType,//日期类型
          startDate:this.startDate,//开始日期
          endDate:this.endDate,//结束日期
          contrastType:this.contrastType,//对比类型
          summary:this.summary,//汇总方式
          output:this.output,//产值区间
          difference:this.difference,//差值区间
          sc:this.sc,
        },(res)=>{
          if(res.code===200){
            this.contrast=this.contrastType;
            this.sum=this.summary;
            this.tableData=res.rows;
            if(this.summary=="1"){
              this.chartWidth="1000px";
              this.chartHeight="600px";
            }else if(this.summary=="2"){
              this.chartWidth="1000px";
              this.chartHeight="600px";
            }
            this.demo = false;
            this.$nextTick(val => {
              this.demo = true;
            });
          }else{
            this.$message.error(res.msg);
          }
          this.loading=false;
        })
      },
      search(){
        this.getTableList();
      },
      setOptions(){
        this.dateTypeOptions=[{"code":"1","remark":"委托日期"},{"code":"2","remark":"结算日期"},{"code":"3","remark":"结账日期"}];//日期类型option
        this.contrastTypeOptions=[{"code":"0","remark":"无"},{"code":"1","remark":"同比上年"},{"code":"2","remark":"环比上月"}];//对比类型option
        this.summaryOptions=[{"code":"1","remark":"客户ID"},{"code":"2","remark":"行政区划"},{"code":"3","remark":"业务员ID"},{"code":"4","remark":"业务组ID"}];//汇总方式option
        this.outputOptions=[{"code":"1","remark":"0-10万"},{"code":"2","remark":"10万-50万"},{"code":"3","remark":"50万-100万"},{"code":"4","remark":"100万以上"},{"code":"","remark":"全部"}];//产值区间option
        this.differenceOptions=[{"code":"0","remark":"0-10%"},{"code":"1","remark":"10%-20%"},{"code":"2","remark":"20%-30%"},{"code":"3","remark":"30%-40%"}, {"code":"4","remark":"40%-50%"}, {"code":"5","remark":"50%-60%"},{"code":"6","remark":"60%-70%"},{"code":"7","remark":"70%-80%"},{"code":"8","remark":"80%-90%"},{"code":"9","remark":"90%-100%"},{"code":"","remark":"全部"}];//对比差值区间option
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
      openEntrust(row) {//点击岗位展开人员产值弹层
        this.entrust=true;
        this.data.companyId=row.companyId;
      },
      handleClose(){//关闭人员产值弹层
        this.entrust=false;
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
