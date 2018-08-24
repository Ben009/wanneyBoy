<template>
  <div>
    <el-Row>
      <el-row>
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border
                  style="width: 100%"
                  show-summary
                  :summary-method="getSummaries">
          <el-table-column prop="ticketCompany" label="开票单位"></el-table-column>
          <el-table-column prop="ticketCode" label="发票号"></el-table-column>
          <el-table-column prop="ticketMoney" label="开票金额"></el-table-column>
          <el-table-column prop="money" label="使用金额" ></el-table-column>
        </el-table>
      </el-row>
    </el-Row>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import {ajaxRequest} from '../../util/base'
  import $ from 'jquery'


  export default {
    name: 'bill-claim-ticket-list',
    props:{
      billId:{
        type:Number,
        required:true
      },
    },
    data() {
      return {
        tableData: [],
      }
    },
 /*   watch: {
      billId() {
        this.getTableList(this.billId);
      },
    },*/
    methods: {
      getTableList(billId) {
        let _this = this;
        ajaxRequest('get', 'back/ticket/getBillTicketList', {
          billId:billId
        }, (res) => {
          if (res.code === 200) {
            _this.tableData = res.rows;
          }
        })
      },
      //合计
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && index != 1 ) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
        });
        return sums;
      },
    },
    components: {},
    mounted() {
      this.getTableList(this.billId);
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
