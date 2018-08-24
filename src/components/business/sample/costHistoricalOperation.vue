<template>
  <el-form ref="form" class="sampleForm" label-width="150px">
    <div>
      <el-Row :gutter="20">
        <el-col :span="8">
          <el-form-item label="登记号：">
            <el-input v-model="djh" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委托单位：">
            <el-input v-model="companyName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="器具名称：">
            <el-input v-model="applianceName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row :gutter="20">
        <el-col :span="8">
          <el-form-item label="套数/(件/套)：">
            <el-input v-model="setNum" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单价/检定点：">
            <el-input v-model="price" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="加急情况：">
            <el-input v-model="urgentSituation" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row :gutter="20">
        <el-col :span="8">
          <el-form-item label="委托日期：">
            <el-input v-model="entrustmentDate" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务来源：">
            <el-input v-model="taskSource" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检测部门：">
            <el-input v-model="testDepartment" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row :gutter="20">
        <el-col :span="8">
          <el-form-item label="收费时间：">
            <el-input v-model="chargeTime" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="费用录入人：">
            <el-input v-model="inputPerson" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="外送费：">
            <el-input v-model="outflowFee" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row :gutter="20">
        <el-col :span="8">
          <el-form-item label="到账日期：">
            <el-input v-model="accountDate" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票号：">
            <el-input v-model="invoiceNumber" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结账方式：">
            <el-input v-model="checkoutMethod" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
    </div>
    <div>
      <el-table  :max-height="QJTableMaxHeight"
        ref="table"
        :data="tableData"
        border
        style="width: 100%"
        :fit="true"
        show-summary
        :summary-method="getSummaries">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          label="部门"
          prop="deptName"
          >
        </el-table-column>
        <el-table-column
          prop="jdy"
          label="检定员"
          >
        </el-table-column>
        <el-table-column
          prop="jdf"
          label="检测费"
          >
        </el-table-column>
        <el-table-column
          prop="xlf"
          label="修理费"
          >
        </el-table-column>
        <el-table-column
          prop="fwf"
          label="服务费"
          >
        </el-table-column>
        <el-table-column
          prop="qtf"
          label="其他费"
          >
        </el-table-column>
        <el-table-column
          prop="hj"
          label="小计"
          >
        </el-table-column>
        <el-table-column
          prop="gzl"
          label="工作量"
          >
        </el-table-column>
      </el-table>
    </div>
    <div>历史操作：</div>
    <div>
      <el-table  :max-height="QJTableMaxHeight"
        ref="table2"
        :data="tableData2"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column
          label="操作人"
          prop="czr"
          >
        </el-table-column>
        <el-table-column
          prop="czType"
          label="操作类型"
          >
        </el-table-column>
        <el-table-column
          prop="czTime"
          label="操作时间"
          
        :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="jdy"
          label="检定员"
          >
        </el-table-column>
        <el-table-column
          prop="jdf"
          label="检测费"
          >
        </el-table-column>
        <el-table-column
          prop="xlf"
          label="修理费"
          >
        </el-table-column>
        <el-table-column
          prop="fjf"
          label="附加费"
          >
        </el-table-column>
        <el-table-column
          prop="jjf"
          label="加急费"
          >
        </el-table-column>
        <el-table-column
          prop="fwf"
          label="服务费"
          >
        </el-table-column>
        <el-table-column
          prop="qtf"
          label="其他费"
          >
        </el-table-column>
        <el-table-column
          prop="gzl"
          label="工作量"
          >
        </el-table-column>
        <el-table-column
          label="操作"
          
          width="80">
          <template slot-scope="scope">
            <el-button class="el-button el-button--primary" type="button" @click="openDetail(scope.row)" >
              明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-Row :gutter="20" style="text-align: center;margin-top:20px;">
      <el-button class="el-button el-button--primary" @click="close">关闭</el-button>
    </el-Row>
  </el-form>
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
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";
  
/*   import {
    Button,
    Checkbox,
    CheckboxGroup,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
  } from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox); */

  export default {
    components: {
      ElRow,
      ElCol},
    name:"costHistoryOperation",
    data() {
      return {
        tableData:[],
        tableData2:[],
        paramObj: this.$route.query,
        djh:"",//登记号
        companyName:"",//委托单位
        applianceName:"",//器具名称
        setNum:"",//套数
        price:"",//单价 检定点
        urgentSituation:"",//加急情况
        entrustmentDate:"",//委托日期
        taskSource:"",//任务来源
        testDepartment:"",//检测部门
        chargeTime:"",//收费时间
        inputPerson:"",//费用录入人
        outflowFee:"",//外送费
        accountDate:"",//到账日期
        invoiceNumber:"",//发票号
        checkoutMethod:"",//结账方式
        explain:"",//收费情况说明
      }
    },
    methods:{
      search(){
        ajaxRequest('get','back/exchange/getFyHistroy',{
          bh:this.paramObj.djh,
        },(res)=>{
          if(res.code===200){
            this.tableData=res.daoResult.infolist;
            this.tableData2=res.daoResult.fy_lishi;
              this.djh=res.daoResult.djh;
              this.companyName=res.daoResult.companyName;
              this.applianceName=res.daoResult.applianceName;
              this.setNum=res.daoResult.pieceNumber;
              this.price=res.daoResult.dj+"/"+res.daoResult.jdd;
              if(res.daoResult.sfjj==0){
                this.urgentSituation="未加急";
              }else{
                this.urgentSituation="加急";
              }
              this.entrustmentDate=this.dealDate("","",res.daoResult.entrustDate)
            if(res.daoResult.rwly=="0"){
              this.taskSource="委托录入";
            }else if(res.daoResult.rwly=="1"){
              this.taskSource="自检要号";
            }else if(res.daoResult.rwly=="3"){
              this.taskSource="带回要号";
            }else if(res.daoResult.rwly=="4"){
              this.taskSource="外网报检";
            }
              this.testDepartment=res.daoResult.bmmc;
              this.chargeTime=this.dealDate("","",res.daoResult.addTime);
              this.inputPerson=res.daoResult.fylrName;
              this.outflowFee=res.daoResult.wsf;
              this.accountDate=this.dealDate("","",res.daoResult.dzrq);
              this.invoiceNumber=res.daoResult.ticketCode;
            if(res.checkoutMethod===1){
              res.daoResult.checkWay="现金";
            }else if(res.checkoutMethod===2){
              res.daoResult.checkWay="转账";
            }else if(res.checkoutMethod===3){
              res.daoResult.checkWay="支票";
            }else if(res.checkoutMethod===4){
              res.daoResult.checkWay="其他";
            }
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      openDetail(rowInfo){

      },
      //合计行
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 1) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))&&index != 2) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      dealDate: function (row, column, cellValue) {
        if(cellValue===""||cellValue===null||cellValue===undefined){
          return "";
        }else{
          return new Date(cellValue).format('YYYY-MM-DD ');
        }
      },
      close(){
        this.$router.push({
          path: '/admin/570',
          query:{
          }
        })
      }
    },
    mounted(){
      this.search();
    },
  }
</script>

<style scoped>

</style>
