<template>
  <el-row class="m-l-5">
    <el-col :sm="6">
      <el-row>
      <el-form :inline="true">
        <el-form-item style="float: left;width:40%;margin-right: 4px">
          <el-select v-model="searchType">
            <el-option value="0" label="缴费单编号"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: left;width:35%;margin-right: 4px">
          <el-input clearable v-model="searchKey"></el-input>
        </el-form-item>
        <el-form-item style="float: left;width:20%;margin-right: 0px">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      </el-row>
      <el-row>
        <el-col :sm="22">
          <el-table ref="leftMenu" :show-header="false" :data="billList" @row-click='queryBillDetail'  :max-height="QJTableMaxHeight" >
            <el-table-column align='left'>
              <template slot-scope="scope" align="left">
                <div :class="{cursor:true,'current-row':billData && billData.id == scope.row.id }">
                  <p>缴费单编号：{{scope.row.billNo}}</p>
                  <p>缴费单名称：{{scope.row.billName}}</p>
                  <p>缴费单金额：{{scope.row.billMoney}}</p>
                  <p>关联信息：{{scope.row.userName}}/{{scope.row.addTime | myCurrency}}</p>
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
    <el-col :sm="18">
    <confirmDetail v-if="!!billData" :billId="billId" :billNo ="billNo" :billData="billData" :callback="handelCallback"></confirmDetail>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
  import confirmDetail from "./confirmDetail.vue";


  export default {
    data() {
      return {
        searchType: "0",
        searchKey: "",
        page: 1,
        rows: 10,
        total: 0,
        orderProperty:"",
        orderType:"",
        billList:[],//左侧列表数据
        billId: 0,//缴费单id
        billNo:'',
        billData:null,//缴费单信息
      };
    },
    components: {confirmDetail},

    methods: {
      search() {
        let paramters = {
          page: this.page,
          rows: this.rows,
          total: 0,
          orderProperty:"b.ADD_TIME",
          orderType:"",
          source:0,
        };
        if (this.searchType == "0") {
          if (this.searchKey != '') {
            paramters["billName"] = this.searchKey;
          }
        }
        this.getTableData(paramters)
      },
      //左侧列表查询
      getTableData(paramters) {
        paramters = paramters == null ? {page: this.page, rows: this.rows, total: 0 ,orderProperty:"b.ADD_TIME", orderType:"",source:0,} : paramters;
        ajaxRequest("get", "back/bill/getBillClaimTicket", paramters, res => {
          if (res.code === 200) {
            this.billList = res.rows;
            this.total = res.total;
            if (this.billList.length > 0) {
              this.queryBillDetail(this.billList[0])
            } else {
              this.billData = null;
              this.billId = null;
              this.billNo = null;
            }
          }
        });
      },
      //点击列表刷新右侧信息
      queryBillDetail(bill){
        this.billData = null;
        this.$nextTick(() => (this.billData = bill));
        this.billId = bill.id;
        this.billNo = bill.billNo;
        console.log(this.billData,this.billId,this.billNo);
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
      //右侧详情页面回调
      handelCallback() {
        this.search();
      },
    },
    filters: {
      myCurrency(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      },
    },
    created() {
    },
    mounted() {
      this.getTableData();
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
</style>
