<template>
  <el-row class="m-l-5">
    <el-col :sm="6" style="height: 100%">
      <div class="el-row">
        <el-form :inline="true">
          <el-form-item>
            <el-radio-group v-model="searchAll">
              <el-radio @change="getTableData" :label="0">全部</el-radio>
              <el-radio @change="getTableData" :label="1">已关联</el-radio>
              <el-radio @change="getTableData" :label="2">未关联</el-radio>
            </el-radio-group>
            <el-tooltip class="item" effect="dark" content="缴费单是否关联银行到款记录；">
              <i class="el-icon-info ft12"></i>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item style="float: left;width:40%;margin-right: 4px">
            <el-select v-model="searchType">
              <el-option value="b.bill_no" label="缴费单编号"></el-option>
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
      <el-row>
        <el-col :sm="22">
          <el-table ref="leftMenu" :show-header="false" :data="billList" @row-click='queryBillDetail'  :max-height="QJTableMaxHeight" >
            <el-table-column align='left'>
              <template slot-scope="scope" align="left">
                <div :class="{cursor:true,'current-row':edit && edit.id == scope.row.id }">
                  <p>
                    <span>缴费单编号：</span>
                    <span style="color: blue" v-if="scope.row.isLinkPayment===1">{{scope.row.billNo}}</span>
                    <span v-if="scope.row.isLinkPayment===0">{{scope.row.billNo}}</span>
                  </p>
                  <p>缴费单名称：{{scope.row.billName}}</p>
                  <p>缴费单金额：{{scope.row.billMoney}}</p>
                  <p>添加人/时间：{{scope.row.userName}}/{{scope.row.addTime | myCurrency}}</p>
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
      <!--缴费单结账详情页面-->
      <billCheckoutDetail v-if="!!edit" :data="edit" :sourceId="sourceId" :totalMoney="totalMoney" :callback="handleEditCallback"></billCheckoutDetail>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from "vue";
  import {ajaxRequest,formatDate} from "../../util/base";
  import billCheckoutDetail from "./billCheckoutDetail";
  //引入jquery
  import $ from 'jquery';

  export default {
    name: "bill-checkout",
    data() {
      return {
        searchType: "b.bill_no",
        searchAll: 0,
        searchValue: "",
        page: 1,
        rows: 10,
        total: 0,
        orderProperty:"b.add_time",
        orderType:"desc",
        billList:[],//左侧列表数据
        edit:null,
        sourceId:'',
        totalMoney:0,//结账金额
      };
    },
    components: {
      billCheckoutDetail
    },

    methods: {
      //左侧列表查询
      getTableData() {
        ajaxRequest("get", "back/bill/getCanCheckOutBill",
          {
            page: this.page, rows: this.rows, total: 0 ,orderProperty:this.orderProperty, orderType:this.orderType,
            searchAll:this.searchAll,searchValue:this.searchValue
          }
          , res => {
          if (res.code === 200) {
            this.billList = res.rows;
            this.total = res.total;

            if(res.rows.length>0){
              this.queryBillDetail(res.rows[0]);
            }
          }
        });
      },
      //分页事件
      handleSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableData();
      },
      //分页事件
      handleCurrentChange(currentPage) {
        this.page = currentPage;
        this.getTableData();
      },

      //点击列表刷新右侧页面
      queryBillDetail(info){
        this.edit = null;
        this.$nextTick(() => (this.edit = info));
        this.sourceId=info.id;
        this.totalMoney=info.billMoney;
      },
      //详情页面回调事件
      handleEditCallback(){
        this.getTableData();
      }
    },
    mounted() {
      this.getTableData();
      $(".el-radio__label").css("padding-left","0px");
    },
    filters: {
      myCurrency(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      },
    },
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
  .el-radio>.el-radio__label{
    padding-left: 0px !important;
  }
</style>
