<template>
  <el-row class="m-l-5" style="height: 100%;margin-bottom: 1%">
    <el-col :sm="6">
      <el-row>
      <el-form :inline="true">
        <el-form-item style="float: left;width:40%;margin-right: 4px">
          <el-select v-model="searchType">
            <el-option value="0" label="开票单位"></el-option>
            <el-option value="1" label="申请人"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: left;width:35%;margin-right: 4px">
          <el-input v-model="searchKey"></el-input>
        </el-form-item>
        <el-form-item style="float: left;width:20%;margin-right: 0px">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      </el-row>
      <el-row>
        <el-col :sm="22">
          <el-table ref="leftMenu" :show-header="false" :data="ticketApplyList" @row-click='refreshDetail'  :max-height="QJTableMaxHeight" >
            <el-table-column align='left'>
              <template slot-scope="scope" align="left">
                <div :class="{cursor:true,'current-row':ticketApplyData && ticketApplyData.id == scope.row.id }">
                  <p v-if="scope.row.source=='1'">开票单位：<font  style="color: blue">{{scope.row.ticketCompany}}</font></p>
                  <p v-else-if="scope.row.source=='0'">开票单位：{{scope.row.ticketCompany}}</p>
                  <p >申请人：{{scope.row.userName}}</p>
                 <p> 申请时间：{{scope.row.addTime | myCurrency}} </p>
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
      <financeBillInfo v-if="ticketApplyData"
                       :applyId="applyId"
                       :applySource ="applySource"
                       :billId="billId"
                       :ticketApplyData="ticketApplyData"
                       :callback="handelCallback"></financeBillInfo>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from "vue";
  import Vuex from "vuex";

  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
  import financeBillInfo from "./financeBillInfo.vue";

  /* import {
    Button,
    Table,
    TableColumn,
    Row,
    Col,
    Radio,
    RadioGroup
  } from "element--ui";
  Vue.use(Button);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Radio);
  Vue.use(RadioGroup); */

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
        applyId: 0,//预开票id
        applySource:0,//预开票来源
        billId:0,
        ticketApplyData:{},//预开票信息
      };
    },

    components: {financeBillInfo},

    methods: {
      search() {
        let paramters = {
          page: this.page,
          rows: this.rows,
          total: 0,
          orderProperty:"t.ADD_TIME",
          orderType:"",
          status:1,
        };
        if (this.searchType == "0") {//开票单位
          if (this.searchKey != '') {
            paramters["ticketCompany"] = this.searchKey;
          }
        }else if(this.searchType == "1"){
          if (this.searchKey != '') {
            paramters["userName"] = this.searchKey;
          }
        }
        this.getTableData(paramters)
      },
      //左侧列表查询
      getTableData(paramters) {
        paramters = paramters == null ? {page: this.page, rows: this.rows, total: 0 ,orderProperty:"t.ADD_TIME", orderType:"desc",status:1,} : paramters;
        ajaxRequest("get", "back/ticketApply/getTicketApplayHadExamine", paramters, res => {
          if (res.code === 200) {
            this.ticketApplyList = res.rows;
            if (this.ticketApplyList.length > 0) {
              this.total = res.total;
              this.ticketApplyData = this.ticketApplyList[0];
              this.applyId = this.ticketApplyData.id;
              this.applySource = this.ticketApplyData.source;
              this.billId = this.ticketApplyData.billId;
            } else {
              this.ticketApplyData = null;
              this.applyId = null;
              this.applySource = null;
              this.billId = null;
            }
          }
        });
      },
      //点击列表刷新右侧信息
      refreshDetail(rowInfo, event, column){
        ajaxRequest("get", "back/ticketApply/"+rowInfo.id, {}, res => {
          if (res.code === 200) {
            this.ticketApplyData = res.daoResult;
            this.applyId = this.ticketApplyData.id;
            this.applySource = this.ticketApplyData.source;
            this.billId = this.ticketApplyData.billId;
            console.log(this.billId,"缴费单id")
          }
        });
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
      dateFormatter(row, column) {
        return formatDate(row.addTime, "YYYY-MM-DD hh:mm:ss");
      },
      //开票
      handelCallback(ticketApplyData,ticketList) {
        let jsonObj={
          ticketApplyData:ticketApplyData,//预开票
          ticketList:ticketList,//开票信息
        };
        ajaxRequest('post', "back/ticketApply/financeBill",
          {
            json:JSON.stringify(jsonObj)
          },
          (res) => {
            //刷新查询列表
            if (res.code == 200) {
              this.search();
            }

          });
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
