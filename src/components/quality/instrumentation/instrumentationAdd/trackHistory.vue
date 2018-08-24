<template>
    <!-- 痕迹标签 -->
<div>
    <div>
        <el-table :data="tableData" :max-height="QJTableMaxHeight">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="操作类别" prop="code" :formatter="formatterCode"></el-table-column>
            <el-table-column label="操作明细" prop="remark"></el-table-column>
            <el-table-column label="操作人" prop="userName"></el-table-column>
            <el-table-column label="操作时间" prop="addTime"></el-table-column>
            <el-table-column label="操作" width="60px">
              <template slot-scope="scope">
                  <el-button v-if="scope.row.code == 1" @click="handleWatch(scope.row)" type="text"><i class="el-icon-view" style="font-size:16px;" title="查看详细"></i></el-button>
              </template>
            </el-table-column>
        </el-table>
    </div>
    <div style="margin-top:10px;text-align:center; float:right;">
       <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">
      </mind-pagination>
    </div>
    <history-dialog v-if="detailInfo" :info="detailInfo" :cb="handleBack"></history-dialog>
</div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import { ajaxRequest } from "../../../util/base";
import historyDialog from './instrumentationTabDialog/trackHistoryDialog.vue'
export default {
  name: "trackHistory",
  props: {
    type: {
      type: String
    },
    standardId: {}
  },
  components:{historyDialog},
  data() {
    return {
      tableData: [],
      page: 1,
      rows: 10,
      total: 0,
      codeType :{
        1:"仪器设备基本信息修改",  2:"溯源信息修改",  3:"周检溯源送审核",
        4:"核查信息修改", 5:"加入自检台账",  6:"周检溯源信息审核",  7:"仪器设备单独自检",
        8:"仪器设备自行外送", 9:"仪器设备取消自行外送",  10:"仪器设备取消单独自检"
      },
      detailInfo:undefined,//查看详情的id
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    formatterCode(row, column, cellValue){
      return this.codeType[cellValue];
    },
    getTableList() {
      ajaxRequest("get", "back/instLog/retrieve", {InstrumentationId:this.standardId}, res => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
          }
        }
      );
    },
    handlePageSizeChange(size) {
      this.page = 1;
      this.rows = size;
      this.getTableList();
    },
    handleCurrentPageChange(currentPage) {
      this.page = currentPage;
      this.getTableList();
    },
    // 查看详情
    handleWatch(info){
      this.detailInfo = info;
      // this.detailInfo = info
    },
    //传入回调 
    handleBack(){
      this.detailInfo = undefined;
    }
  }
};
</script>
<style scoped>
</style>

