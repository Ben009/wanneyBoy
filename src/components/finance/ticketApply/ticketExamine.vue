
<template>
  <el-row class="m-l-5" style="height: 100%">
    <el-col :sm="6">
      <el-row>
      <el-form :inline="true">
        <el-form-item style="float: left;width:40%;margin-right: 4px">
          <el-select v-model="searchType">
            <el-option value="0" label="开票单位"></el-option>
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
      <el-row >
        <el-col :sm="22">
          <el-table ref="leftMenu" :show-header="false" :data="ticketApplyList" @row-click='queryTicketDetail'  :max-height="QJTableMaxHeight" >
            <el-table-column align='left'>
              <template slot-scope="scope" align="left">
                <div :class="{cursor:true,'current-row':applyInfo && applyInfo.id == scope.row.id }">
                  <p>开票单位： {{scope.row.ticketCompany}}</p>
                  <p>开票金额：{{scope.row.ticketMoney}}</p>
                  <p>申请人：{{scope.row.userName }}</p>
                  <p>申请时间：{{scope.row.addTime | myCurrency}}</p>
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
      <ticketExamineForm  :applyInfo="applyInfo" :applyId="applyId" :callback="handelCallback"></ticketExamineForm>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from "vue";
  import Vuex from "vuex";

  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
  import ticketExamineForm from "./ticketExamineForm.vue";

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
        ticketApplyList:[],//左侧列表数据
        billId: 0,
        applyId: 0,
        ticketApplyData:{},
        applyInfo:{},//预开票信息
      };
    },

    components: {ticketExamineForm},

    methods: {
      //查询按钮事件
      search() {
        let paramters = {
          page: this.page,
          rows: this.rows,
          total: 0,
          orderProperty:"t.ADD_TIME",
          orderType:"",
          status:0,
        };
        if (this.searchType == "0") {//开票单位
          if (this.searchKey != '') {
            paramters["ticketCompany"] = this.searchKey;
          }
        }
        this.getTableData(paramters)
      },
      //左侧列表查询
      getTableData(paramters) {
        paramters = paramters == null ? {page: this.page, rows: this.rows, total: 0 ,orderProperty:"t.ADD_TIME", orderType:"",status:0,} : paramters;
        ajaxRequest("get", "back/ticketApply/retrieveUnCheck", paramters, res => {
          if (res.code === 200) {
            this.ticketApplyList = res.rows;
            if (this.ticketApplyList.length > 0) {
              this.total = res.total;
              this.ticketApplyData = this.ticketApplyList[0];
              this.applyInfo = this.ticketApplyList[0];
              this.applyId = this.ticketApplyData.id;
              this.billId = this.ticketApplyData.billId;
            } else {
              this.ticketApplyData = null;
              this.applyId = null;
              this.billId = null;
            }
          }
        });
      },
      //点击列表刷新右侧信息
      queryTicketDetail(rowInfo){
        this.applyId = rowInfo.id;
        let _this = this;
        ajaxRequest('get', 'back/ticketApply/'+rowInfo.id,{}, (res) => {
          if (res.code == 200) {
            _this.applyInfo = res.daoResult;
          }
        })

      },
      handleSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableData(null);
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage;
        this.getTableData(null);
      },
      //日期处理
      dateFormatter(row, column) {
        return formatDate(row.addTime, "YYYY-MM-DD hh:mm:ss");
      },
      //审核回调方法
      handelCallback(){
        this.search();
      },
    },
    filters: {
      myCurrency(myInput) {
        return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
      },
    },
    created() {
    },
    mounted() {
      this.getTableData();
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
</style>
