<template>
  <el-row class="m-l-5">
    <el-col :sm="6" style="height: 100%">
      <el-row>
      <div class="el-row">
        <el-form :inline="true">
          <el-form-item>
            <el-radio-group v-model="searchAll">
              <el-radio @change="getTableData" :label="0">全部</el-radio>
              <el-radio @change="getTableData" :label="1">已关联</el-radio>
              <el-radio @change="getTableData" :label="2">未关联</el-radio>
            </el-radio-group>
            <el-tooltip class="item" effect="dark" content="预开票是否关联银行到款记录；">
              <i class="el-icon-info ft12"></i>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item style="float: left;width:40%;margin-right: 4px">
            <el-select v-model="searchType">
              <el-option value="t.TICKET_COMPANY" label="开票单位"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float: left;width:35%;margin-right: 4px">
            <el-input clearable v-model="searchValue"></el-input>
          </el-form-item>
          <el-form-item style="float: left;width:20%;margin-right: 0px">
            <el-button type="primary" size="mini" @click="getTableData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      </el-row>
      <el-row>
        <el-col :sm="22">
          <el-table ref="leftMenu" :show-header="false" :data="ticketApplyList" @row-click='queryTicketDetail'  :max-height="QJTableMaxHeight" >
            <el-table-column align='left'>
              <template slot-scope="scope" align="left">
                <div :class="{cursor:true,'current-row':ticketApplyData && ticketApplyData.id == scope.row.id }">
                  <p>
                    <span>开票单位：</span>
                    <span style="color: blue" v-if="scope.row.isLinkPayment===1">{{scope.row.ticketCompany}}</span>
                    <span v-if="scope.row.isLinkPayment===0">{{scope.row.ticketCompany}}</span>
                  </p>
                  <p>开票金额：{{scope.row.ticketMoney}}</p>
                  <p>开票人：{{scope.row.drawerName }}</p>
                  <p>开票时间：{{scope.row.ticketDate | myCurrency}}</p>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <mind-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            layout="prev,next,countpage,total"
            :page-size="rows"
            :total="total"
            style="margin-left: 80px;margin-top:10px;"
          >
          </mind-pagination>
        </el-col>
      </el-row>
    </el-col>
    <el-col :sm="18" style="padding-left: 1%;height: 100%">
      <ticketCheckoutDetail v-if="ticketApplyData"
                       :applyId="applyId"
                       :applySource ="applySource"
                       :billId="billId"
                       :ticketApplyData="ticketApplyData"
                       :callback="handelCallback"
                       :sourceId="sourceId"
                       :totalMoney="totalMoney">
      </ticketCheckoutDetail>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from "vue";
  import $ from 'jquery';
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
  import ticketCheckoutDetail from './ticketCheckoutDetail';

  export default {
    data() {
      return {
        searchType: "t.TICKET_COMPANY",
        searchValue: "",
        searchAll: 0,
        page: 1,
        rows: 10,
        total: 0,
        orderProperty:"t.ADD_TIME",
        orderType:"desc",
        ticketApplyList:[],//左侧列表数据

        applyId: 0,//预开票id
        applySource:0,//预开票来源
        billId:0,
        ticketApplyData:null,//预开票信息
        sourceId:'',
        totalMoney:0,//结账金额
      };
    },
    components: {
      ticketCheckoutDetail
    },

    methods: {
      //左侧列表查询
      getTableData() {
        let paramters = {
          page: this.page, rows: this.rows, total: 0 ,
          orderProperty:this.orderProperty, orderType:this.orderType ,searchAll:this.searchAll,searchValue:this.searchValue};
        ajaxRequest("get", "back/ticketApply/getCanCheckOutTicketApplys", paramters, res => {
          if (res.code === 200) {
            this.ticketApplyList = res.rows;
            this.total = res.total;
            if(this.ticketApplyList.length>0){
              this.queryTicketDetail(this.ticketApplyList[0]);
            }
          }
        });
      },
      //分页事件
      handleSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableData(null);
      },
      //分页事件
      handleCurrentChange(currentPage) {
        this.page = currentPage;
        this.getTableData(null);
      },
      //点击列表刷新右侧信息
      queryTicketDetail(row){
        ajaxSyncRequest("get", "back/ticketApply/"+row.id, {}, res => {
          if (res.code === 200) {
            this.applyId = res.daoResult.id;
            this.applySource = res.daoResult.source;
            this.billId = res.daoResult.billId;
            this.ticketApplyData = null;
            this.sourceId=res.daoResult.id;
            this.totalMoney=res.daoResult.ticketMoney;
            this.$nextTick(() => (this.ticketApplyData = res.daoResult));
          }
        });
      },
      //组件回调方法
      handelCallback(){
        this.getTableData();
      }
    },
    filters: {
      myCurrency(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      },
    },
    mounted() {
      this.getTableData();
      $(".el-radio__label").css("padding-left","0px");
    }
  };
</script>

<style scoped>
  .m-b-10 {
    margin-bottom: 10px;
  }

  .m-b-20 {
    margin-bottom: 20px;
  }

  .inline {
    display: inline;
  }

  .m-r-10 {
    margin-right: 661px;
  }

  .m-f-10 {
    margin-left: 10px;
  }

  .m-t-10 {
    margin-top: 10px;
  }

  .m-l-10 {
    margin-left: 10px;
  }

  .m-l-5 {
    margin-left: 5px;
  }

  .font-blod {
    font-weight: bold;
  }
  .bg-red{
    background: #c9d6de;
  }
  .bg-white{
    background: white;
  }
  .custom-1d74b7 .el-radio+.el-radio {
    margin-left: 15px !important;
  }
</style>
