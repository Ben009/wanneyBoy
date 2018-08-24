<template>
  <div>
    <el-Row>
      <el-row style="line-height: 40px" v-if="isShowBh!=1">缴费单编号：<span style="font-weight: bold;color: blue" @click="getBillDetail">{{billNo}}</span></el-row>
      <el-row>
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border
                  style="width: 100%">
          <el-table-column prop="REGISTRATION_NO" label="登记号"></el-table-column>
          <el-table-column prop="ORDER_NO" label="委托单号"></el-table-column>
          <el-table-column prop="COMPANY_NAME" label="委托单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="APPLIANCE_NAME" label="器具名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="IS_COMPULSORY_VERIFY" label="是否强检" :formatter="isCompulsoryVerifyFormat" ></el-table-column>
          <el-table-column prop="SET_NUMBER" label="套数/退">
            <template slot-scope="scope">
              <span v-if="scope.row.RETURN_NUMBER>0">{{scope.row.SET_NUMBER}}/<span style="color: red">{{scope.row.RETURN_NUMBER}}</span></span>
              <span v-else>{{scope.row.SET_NUMBER}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ENTRUST_DATE" label="委托日期">
            <template slot-scope="scope">
              {{scope.row.ENTRUST_DATE | myCurrency}}
            </template>
          </el-table-column>
          <el-table-column prop="TOTAL_ACTUAL" :label="defaultInfo.fee7"></el-table-column>
          <el-table-column prop="JDF_ACTUAL" :label="defaultInfo.fee1"></el-table-column>
          <el-table-column prop="FJF_ACTUAL" :label="defaultInfo.fee2"></el-table-column>
          <el-table-column prop="XLF_ACTUAL" :label="defaultInfo.fee4"></el-table-column>
          <el-table-column prop="JJF_ACTUAL" :label="defaultInfo.fee3"></el-table-column>
          <el-table-column prop="FWF_ACTUAL" :label="defaultInfo.fee5"></el-table-column>
          <el-table-column prop="QTF_ACTUAL" :label="defaultInfo.fee6"></el-table-column>
          <el-table-column prop="WORKLOAD_ACTUAL" :label="defaultInfo.fee8"></el-table-column>
          <el-table-column prop="INTENSIVE_WORKLOAD_ACTUAL" :label="defaultInfo.fee9"></el-table-column>
          <el-table-column prop="FINISH_DATE" label="完成日期">
            <template slot-scope="scope">
              {{scope.row.FINISH_DATE | myCurrency}}
            </template>
          </el-table-column>
          <el-table-column prop="COMMISSIONER_NAME" label="检测人员"></el-table-column>
          <el-table-column prop="DISCOUNT" label="折扣"></el-table-column>
        </el-table>
      </el-row>
    </el-Row>
   <!-- <div style="width: 90%;font-size: 16px;font-weight: bold;margin-top: 10px;margin-left: 10%">
      <div style="width: 10%;float: left">
        套数:{{totalFee.SET_NUMBER}}
        <span v-if="totalFee.RETURN_NUMBER>0">/<span style="color: red">{{totalFee.RETURN_NUMBER}}</span></span>
      </div>
      <div style="width: 10%;float: left">{{defaultInfo.fee1}}:{{totalFee.JDF_ACTUAL}}</div>
      <div style="width: 10%;float: left">{{defaultInfo.fee2}}:{{totalFee.FJF_ACTUAL}}</div>
      <div style="width: 10%;float: left">{{defaultInfo.fee4}}:{{totalFee.XLF_ACTUAL}}</div>
      <div style="width: 10%;float: left">{{defaultInfo.fee3}}:{{totalFee.JJF_ACTUAL}}</div>
      <div style="width: 10%;float: left">{{defaultInfo.fee5}}:{{totalFee.FWF_ACTUAL}}</div>
      <div style="width: 10%;float: left">{{defaultInfo.fee6}}:{{totalFee.QTF_ACTUAL}}</div>
      <div style="width: 10%;float: left">{{defaultInfo.fee8}}:{{totalFee.WORKLOAD_ACTUAL}}</div>
      <div style="width: 20%;float: left">{{defaultInfo.fee9}}:{{totalFee.INTENSIVE_WORKLOAD_ACTUAL}}</div>
    </div>
    <br>
    <br>
    <div style="width: 90%;font-size: 16px;font-weight: bold;margin-left: 10%;text-align: center">{{defaultInfo.fee7}}:{{totalFee.TOTAL_ACTUAL}}</div>-->
    <div style="font-size: 16px;font-weight: bold;margin-top: 10px;padding-left: 4%">
      <el-row>
        <el-col :span="4" style="font-size: 16px;">
          套数:{{totalFee.SET_NUMBER}}
          <span v-if="totalFee.RETURN_NUMBER>0">/<span style="color: red">{{totalFee.RETURN_NUMBER}}</span></span>
        </el-col>
        <el-col :span="5" style="font-size: 16px;">
          {{defaultInfo.fee1}}:{{totalFee.JDF_ACTUAL}}
        </el-col>
        <el-col :span="5" style="font-size: 16px;">
          {{defaultInfo.fee2}}:{{totalFee.FJF_ACTUAL}}
        </el-col>

        <el-col :span="5" style="font-size: 16px;">
          {{defaultInfo.fee3}}:{{totalFee.XLF_ACTUAL}}
        </el-col>
        <el-col :span="5" style="font-size: 16px;">
          {{defaultInfo.fee4}}:{{totalFee.JJF_ACTUAL}}
        </el-col>
        <el-col :span="4" style="font-size: 16px;">
          {{defaultInfo.fee5}}:{{totalFee.FWF_ACTUAL}}
        </el-col>
        <el-col :span="5" style="font-size: 16px;">
          {{defaultInfo.fee6}}:{{totalFee.QTF_ACTUAL}}
        </el-col>
        <el-col :span="5" style="font-size: 16px;">
          {{defaultInfo.fee8}}:{{totalFee.WORKLOAD_ACTUAL}}
        </el-col>
        <el-col :span="5" style="font-size: 16px;">
          {{defaultInfo.fee9}}:{{totalFee.INTENSIVE_WORKLOAD_ACTUAL}}
        </el-col>
        <el-col :span="5" style="font-size: 16px;">
          {{defaultInfo.fee7}}:{{totalFee.TOTAL_ACTUAL}}
        </el-col>
      </el-row>
    </div>
    <commonBillDetail v-if="!!edit" :data="edit" :callback="handleEditCallback"></commonBillDetail>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest,ajaxSyncProxyRequest,formatDate} from '../../util/base';
  import commonBillDetail from "../bill/commonBillDetail.vue";
  import $ from 'jquery';

  export default {
    name: 'bill-detail',
    props:{
      billId:{
        type:Number,
        required:true
      },
      isShowBh:{
        type:Number
      },
    },
    data() {
      return {
        defaultInfo:{},//初始化页面字段名称

        tableData: [],
        billNo:'',
        totalFee:{
          JDF_ACTUAL:0,
          FJF_ACTUAL:0,
          XLF_ACTUAL:0,
          JJF_ACTUAL:0,
          FWF_ACTUAL:0,
          QTF_ACTUAL:0,
          WORKLOAD_ACTUAL:0,
          INTENSIVE_WORKLOAD_ACTUAL:0,
          TOTAL_ACTUAL:0,
          SET_NUMBER:0,
          RETURN_NUMBER:0
        },
        edit : null,
        billInfo : null
      }
    },
    methods: {
      getTableList(billId) {
        let _this = this;
        ajaxRequest('get', 'back/bill/' + billId, {}, (res) => {
          if (res.code === 200) {
            _this.billNo = res.daoResult.billNo;
            _this.billInfo = res.daoResult;
            _this.tableData = res.daoResult.sjdList;

            this.totalFee.JDF_ACTUAL = 0;
            this.totalFee.FJF_ACTUAL = 0;
            this.totalFee.XLF_ACTUAL = 0;
            this.totalFee.JJF_ACTUAL = 0;
            this.totalFee.FWF_ACTUAL = 0;
            this.totalFee.QTF_ACTUAL = 0;
            this.totalFee.WORKLOAD_ACTUAL = 0;
            this.totalFee.INTENSIVE_WORKLOAD_ACTUAL = 0;
            this.totalFee.TOTAL_ACTUAL = 0;
            this.totalFee.SET_NUMBER = 0;
            this.totalFee.RETURN_NUMBER = 0;

            for(var m=0;m<_this.tableData.length;m++){
              this.totalFee.JDF_ACTUAL = parseFloat(parseFloat(this.totalFee.JDF_ACTUAL) + parseFloat(_this.tableData[m].JDF_ACTUAL)).toFixed(2);
              this.totalFee.FJF_ACTUAL = parseFloat(parseFloat(this.totalFee.FJF_ACTUAL) + parseFloat(_this.tableData[m].FJF_ACTUAL)).toFixed(2);
              this.totalFee.XLF_ACTUAL = parseFloat(parseFloat(this.totalFee.XLF_ACTUAL) + parseFloat(_this.tableData[m].XLF_ACTUAL)).toFixed(2);
              this.totalFee.JJF_ACTUAL = parseFloat(parseFloat(this.totalFee.JJF_ACTUAL) + parseFloat(_this.tableData[m].JJF_ACTUAL)).toFixed(2);
              this.totalFee.FWF_ACTUAL = parseFloat(parseFloat(this.totalFee.FWF_ACTUAL) + parseFloat(_this.tableData[m].FWF_ACTUAL)).toFixed(2);
              this.totalFee.QTF_ACTUAL = parseFloat(parseFloat(this.totalFee.QTF_ACTUAL) + parseFloat(_this.tableData[m].QTF_ACTUAL)).toFixed(2);
              this.totalFee.WORKLOAD_ACTUAL = parseFloat(parseFloat(this.totalFee.WORKLOAD_ACTUAL) + parseFloat(_this.tableData[m].WORKLOAD_ACTUAL)).toFixed(2);
              this.totalFee.INTENSIVE_WORKLOAD_ACTUAL = parseFloat(parseFloat(this.totalFee.INTENSIVE_WORKLOAD_ACTUAL) + parseFloat(_this.tableData[m].INTENSIVE_WORKLOAD_ACTUAL)).toFixed(2);
              this.totalFee.TOTAL_ACTUAL = parseFloat(parseFloat(this.totalFee.TOTAL_ACTUAL) + parseFloat(_this.tableData[m].TOTAL_ACTUAL)).toFixed(2);
              this.totalFee.SET_NUMBER = this.totalFee.SET_NUMBER+ _this.tableData[m].SET_NUMBER;
              this.totalFee.RETURN_NUMBER = this.totalFee.RETURN_NUMBER+ _this.tableData[m].RETURN_NUMBER;
            }
          }
        })
      },
      isCompulsoryVerifyFormat(row, column) {
        let controlled = {0: '否', 1: '是'}
        return controlled[row.IS_COMPULSORY_VERIFY]
      },
      isDiscoutFormat(row, column) {
        let controlled = {0: '否', 1: '是'}
        return controlled[row.IS_DISCOUNT]
      },
      //缴费单详情页面
      getBillDetail(){
        this.edit = this.billInfo;
      },
      handleEditCallback(){
        this.edit = null;
      }
    },
    components: {commonBillDetail},
    filters: {
      myCurrency(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      },
    },
    mounted() {
      this.getTableList(this.billId);
      ajaxSyncProxyRequest('get','/njmind/findParams/fee1$fee2$fee3$fee4$fee5$fee6$fee7$fee8$fee9',{},(res)=>{
        this.defaultInfo = {
          fee1:res.fee1.value,
          fee2:res.fee2.value,
          fee3:res.fee3.value,
          fee4:res.fee4.value,
          fee5:res.fee5.value,
          fee6:res.fee6.value,
          fee7:res.fee7.value,
          fee8:res.fee8.value,
          fee9:res.fee9.value
        }
      });
    }
  }
</script>

<style scoped>
  .custom-input {
    width: 200px;
    height: 32px;
  }

  .custom-input .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  .custom-input .el-input-group__append {
    padding: 0 10px;
  }
</style>
