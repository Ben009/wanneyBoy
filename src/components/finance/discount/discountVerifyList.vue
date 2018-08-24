<template>
  <el-row class="m-l-5">
    <el-col :sm="6">
      <el-row>
      <el-form :inline="true">
        <el-form-item style="float: left;width:40%;margin-right: 4px">
          <el-select v-model="searchType" >
            <el-option value="0" label="编号"></el-option>
            <el-option value="1" label="名称"></el-option>
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
          <el-table ref="leftMenu" :show-header="false" :data="chargeApplyList" @row-click='queryApplyDetail'  :max-height="QJTableMaxHeight" >
            <el-table-column align='left'>
              <template slot-scope="scope" align="left">
                <div :class="{cursor:true,'current-row':applyInfo && applyInfo.id == scope.row.id }">
                  <p>编号： {{scope.row.businessNo}}</p>
                  <p>名称：{{scope.row.companyName}}</p>
                  <p>折扣：{{getZkInfo(scope.row)}}</p>
                  <p>申请人信息：{{scope.row.creatorName }} | {{ formatteraddTime(scope.row)}}</p>
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
      <discountVerify v-if="!!edit" :data="edit" :sourceId="sourceId" :callback="handleEditCallback"></discountVerify>
      <billDiscountVerify v-if="!!billEdit" :data="billEdit" :applyId="applyId" :callback="handleEditCallback"></billDiscountVerify>
    </el-col>
  </el-row>

</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,formatDate} from '../../util/base';
  import discountVerify from './discountVerify';
  import billDiscountVerify from './billDiscountVerify';

    export default {
        name: "discount-verify-list",
        data(){
          return{
            searchType: "0",
            searchKey: "",
            page: 1,
            rows: 10,
            total: 0,
            orderProperty:"",
            orderType:"",
            edit:null,
            billEdit:null,
            chargeApplyList:[],
            chargeApplyData:{},
            applyId: 0,
            sourceId:"",
            applyInfo: {},
          }
        },
      methods:{
        search() {
          let paramters = {
            page: this.page,
            rows: this.rows,
            total: 0,
            orderProperty:"c.ADD_TIME",
            orderType:"",
            status:0,
          };
          if (this.searchType == "0") {//编号
            if (this.searchKey != '') {
              paramters["BUSINESSNO"] = this.searchKey;
            }
          }
          this.getTableList(paramters)
        },
        //左侧列表查询
        getTableList(paramters) {
          paramters = paramters == null ? {page: this.page, rows: this.rows, total: 0 ,orderProperty:"c.ADD_TIME", orderType:"",status:0,} : paramters;
          ajaxRequest("get", "back/chargeApply/retrieve", paramters, res => {
            if (res.code === 200) {
              this.chargeApplyList = res.rows;
              if (this.chargeApplyList.length > 0) {
                this.total = res.total;
                this.chargeApplyData = this.chargeApplyList[0];
                console.log(this.chargeApplyData)
                this.applyId = this.chargeApplyData.id;
                this.sourceId = this.chargeApplyData.sourceId;
                if(this.chargeApplyData.source == 1){
                  this.edit =  this.chargeApplyData;
                  this.billEdit = null;
                }else{
                  this.billEdit =  this.chargeApplyData;
                  this.edit = null;
                }
              } else {
                this.chargeApplyData = null;
                this.applyId = null;
                this.sourceId = null;
                this.billEdit = null;
                this.edit = null;
              }
            }
          });
        },
        getZkInfo:function(row){
          if(row.type===1){//类型：1折扣2检测费折扣3总收
            return "【折扣】"+row.zk;
          }else if(row.type===2){
            return "【检测费折扣】"+row.zk;
          }else{
            return "【总收】"+row.totalCollection;
          }
        },
        formatteraddTime:function(row){
          return formatDate(row.addTime,'YYYY-MM-DD');
        },
        handleEditCallback(){
          this.edit = null;
          this.billEdit = null;
          this.search();
        },
        handleEdit(rowInfo){
          if(rowInfo.source == 1) {
            this.edit = rowInfo;
          }else if(rowInfo.source == 2){
            this.billEdit = rowInfo;
          }
        },
        queryApplyDetail(rowInfo){
          this.applyInfo = rowInfo;
          if(rowInfo.source==1){
            this.sourceId = rowInfo.sourceId;
            this.edit = rowInfo;
            this.billEdit = null;
          }else{
            this.applyId = rowInfo.id;
            this.billEdit = rowInfo;
            this.edit = null;
          }
        },
        handleSizeChange(size) {
          this.page = 1;//Math.floor(this.page * this.rows / size);
          this.rows = size;
          this.getTableList(null);
        },
        handleCurrentChange(currentPage) {
          this.page = currentPage;
          this.getTableList(null);
        },
      },
      components:{
        discountVerify,
        billDiscountVerify
      },
      mounted() {
        this.getTableList(null);
      }
    }
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

