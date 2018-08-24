<!-- 设置状态 -->
<template>
  <el-row style="height:100%">
    <el-col :sm="5">
      <div style="width:95%;">
        <el-form :inline="true">
          <el-select v-model="searchType" style="width:120px">
            <el-option value="0" label="报价单编号"></el-option>
            <el-option value="1" label="单位名称"></el-option>
            <el-option value="2" label="业务员"></el-option>
          </el-select>
          <el-input v-model="searchKey" style="width:120px"></el-input>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </el-form>

        <el-row>
          <el-col >
            <el-table ref="leftMenu" :show-header="false" :data="tableData" @row-click='refreshDetail'  :max-height="QJTableMaxHeight">
              <el-table-column align='left'>
                <template slot-scope="scope" align="left">
                  <div :class="{cursor:true,'current-row':quotationData && quotationData.id == scope.row.id }">
                    <p style="color: blue">{{scope.row.quotationNo}}</p>
                    <p style="font-weight: bold">{{scope.row.companyName}}</p>
                    <p>{{scope.row.businessStaffName}}&nbsp;&nbsp;&nbsp;&nbsp;{{scope.row.totalCost}}</p>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <div style="margin-top:10px;text-align:center;float:left;">
              <mind-pagination
                :current-page="page"
                :page-size="rows"
                :total="total"
                layout="prev,next,countpage,total"
                style="margin-left:80px;"
                @size-change="handlePageSizeChange"
                @current-change="handleCurrentPageChange">
              </mind-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>

    <el-col class="right  el-col el-col-24 el-col-sm-19">
      <QuotationState ref="commonQuotation"
                      :quotationIds="quotationId"
                      @search="search"
                      style="max-height: 800px;overflow-y: scroll;">
      </QuotationState>
    </el-col>

  </el-row>

</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import QuotationState from './QuotationState'
  import {ajaxRequest, formatDate, ajaxSyncRequest} from '../../util/base'

  export default {
    data() {
      return {
        searchType: '0',
        searchKey: '',
        page: 1,
        rows: 10,
        total: 0,
        tableData: [],
        quotationId: null,
        rightType: 1,
        quotationData:{}
      }
    },
    components: {QuotationState},
    mounted() {
      this.getTableList()
    },
    methods: {
      //行点击事件
      refreshDetail(rowInfo, event, column) {
        this.quotationId = rowInfo.id;
        this.quotationData = rowInfo;
        this.applyId = rowInfo.applyId;
      },
      // 获取左侧查询数据
      getTableList() {
        ajaxSyncRequest('get', 'back/quotation/retrieve', {
          fuzzySearch: 1,
          page: this.page,
          rows: this.rows,
          searchType: this.searchType,
          searchKey: this.searchKey,
          orderProperty: 'q.status asc ,q.id',
          orderType: 'desc',
          total: 0,
          sum:false
        }, res => {
          if (res.code === 200) {
            this.tableData = res.rows
            if (this.tableData.length > 0) {
              this.total = res.total;
              this.quotationData = this.tableData[0];
              this.quotationId = this.quotationData.id;
              Vue.nextTick(function () {
                //选中第一行
                this.$refs.leftMenu.setCurrentRow(this.tableData[0]);
              })
            }else{
              this.quotationId = null;
            }
          }
        })
      },
      handlePageSizeChange(size){
        this.page = 1;
        this.rows = size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      //转现场任务
      toPlan() {
        this.$refs.commonQuotation.toPlan()
      },
      search(){
        this.page = 1;
        this.getTableList();
      }
    }
  }
</script>

<style scoped>
  .cursor{
    cursor: pointer !important;
  }

  .right{
    display: inline-block;
    vertical-align: top;
  }
  .current-row{
    background-color: #f0f9eb;
  }
</style>
