<!-- 合同操作记录 -->
<template>
  <div>
    <el-table :data="tableData" :max-height="QJTableMaxHeight">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="userName" label="操作人"></el-table-column>
      <el-table-column prop="addTime" label="操作时间"  :formatter="formatterTime"></el-table-column>
      <el-table-column prop="operationDetail" label="操作类型"></el-table-column>
      <el-table-column label="操作" max-width="180">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"
                     v-if="scope.row.operationDetail=='合同修改' ">
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
    <ContractLogDetail
      v-if="backId"
      :callback="callback"
      :backId="backId"
    ></ContractLogDetail>

  </div>


</template>

<script>
  import Vue from 'vue'
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest, formatDate} from '../../util/base'
  import ContractLogDetail from './ContractLogDetail';

  export default {
    name: "quotationHistoryLog",
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 'L.id',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        edit: null,
        backId: null,
      }
    },
    components: {ContractLogDetail},
    mounted() {
      this.getTableList()
    },
    methods: {
      //查看明细
      handleEdit(rowInfo) {
        this.backId = rowInfo.backId;
      },
      callback() {
        this.backId = null;
      },
      getTableList() {
        ajaxRequest('get', 'back/contract/contractHistoryLog', {
          id: this.$route.query.id,
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
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
