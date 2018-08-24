<template>
  <mind-dialog
    :visible="true"
    title="操作日志"
    dialogSize="mid"
    center
    v-dialogDrag
    append-to-body
    @close="closeDialog">
    <div style="margin-top:10px;">
      <el-table :max-height="QJTableMaxHeight"
                :data="tableData"
                border
                style="width: 100%"
                :fit="true">
        <el-table-column
          prop="USER_NAME"
          label="操作人"
        >
        </el-table-column>
        <el-table-column
          prop="CREATE_TIME"
          label="操作时间"
          :formatter="function(row, column, cellValue, index){return new Date(row.CREATE_TIME).format('YYYY-MM-DD hh:mm:ss')}"
        >
        </el-table-column>
        <el-table-column
          prop="OPERATION_TYPE"
          label="操作类型"
        >
        </el-table-column>
        <el-table-column
          prop="REMARK"
          label="说明"
        >
        </el-table-column>
      </el-table>
    </div>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest} from '../../util/base';
  export default {
    name: "billLog",
    props: {
      callback: {
        type: Function
      },
      billNo: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        tableData: [],
      }
    },
    mounted() {
      this.getTableList();
    },
    methods: {
      getTableList() {
        ajaxRequest('get', 'back/bill/getBillLog', {
          billNo: this.billNo
        }, (res) => {
          if (res.code === 200) {
            console.log(res.rows)
            this.tableData = res.rows;

          }
        })
      },
      closeDialog() {
        this.callback();
      }
    }
  }
</script>
