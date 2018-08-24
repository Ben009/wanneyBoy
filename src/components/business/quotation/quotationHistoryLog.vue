<!-- 报价单操作记录 -->
<template>
  <div>
    <el-table :data="tableData" :max-height="QJTableMaxHeight">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="userName" label="操作人" ></el-table-column>
      <el-table-column prop="addTime" label="操作时间" :formatter="formatterTime"></el-table-column>
      <el-table-column prop="operationDetail" label="操作类型"></el-table-column>
      <el-table-column label="操作"  fixed="right"  max-width="180">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;" v-if="scope.row.operationDetail=='报价单修改' || scope.row.operationDetail=='报价器具修改'">
            <i class="el-icon-edit-outline" title="查看"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;text-align:center; float:right;">
      <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">
      </mind-pagination>
    </div>

    <!-- 报价单基本信息 -->
    <quotationHistoryDetail
      v-if="!!edit"
      :callback="handleBack"
      :data="edit"/>

    <!-- 报价器具信息 -->
    <QuotationApplianceLog
    v-if="!!backId"
    :callback="handleBack2"
    :backId="backId"
    ></QuotationApplianceLog>

  </div>

</template>

<script>
  import Vue from 'vue'
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest,formatDate} from '../../util/base'
  import quotationHistoryDetail from './quotationHistoryDetail';
  import QuotationApplianceLog from './QuotationApplianceLog';
  export default {
    name: "quotationHistoryLog",
    data() {
      return {
        page:1,
        rows:10,
        total:0,
        searchKey:'',
        orderProperty:'l.id',
        orderType:'desc',
        tableData:[],
        multipleSelection:[],
        edit:null,
        backId:null,
      }
    },
    components: {quotationHistoryDetail,QuotationApplianceLog},
    mounted() {
      this.getTableList()
    },
    methods: {
      //查看明细
      handleEdit(rowInfo) {
        if(rowInfo.operationType==2){
          this.edit = rowInfo;
        }else if(rowInfo.operationType==3){
          this.backId = rowInfo.backId;
        }
      },
      handleBack(){
        this.edit = null;
      },
      handleBack2(){
        this.backId = null;
      },
      getTableList() {
        ajaxRequest('get', 'back/quotation/quotaionHistoryLog', {
          quotationId: this.$route.query.id,
          page: this.page,
          rows: this.rows,
          orderProperty: 'L.id',
          orderType: this.orderType,
          total: 0
        }, function (res) {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
            this.multipleSelection = [];
          }
        }.bind(this))
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      formatterTime: function (row, column) {
        return formatDate(row.addTime, 'YYYY-MM-DD hh:mm:ss');
      }
    }

  }
</script>

<style scoped>


</style>
