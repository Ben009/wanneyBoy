<!-- 人员任务明细查看 -->
<template>
  <div>
    <mind-dialog :title="title" :visible="true" v-dialogDrag  dialog-size="large" @close="handleCancel">
      <el-table :data="tableData" :max-height="QJTableMaxHeight"  @sort-change="handleSort"  border>

        <el-table-column
          label="序号"
          type="index"
          width="60">
        </el-table-column>

        <el-table-column
          prop="registrationNo"
          label="登记号"
          key="registrationNo"
        >
        </el-table-column>

        <el-table-column
          prop="orderNo"
          label="委托单号"
          key="orderNo"
        >
        </el-table-column>

        <el-table-column
          prop="companyName"
          label="委托单位"
          key="companyName"
          show-overflow-tooltip
        >
        </el-table-column>


        <el-table-column
          prop="certificateCompanyName"
          label="证书单位名称"
          key="certificateCompanyName"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="applianceName"
          label="器具名称"
          key="applianceName"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="setNumber"
          label="套数/退"
          key="setNumber"
        >
          <template slot-scope="scope">
           {{scope.row.setNumber}}
            <span v-if="scope.row.returnNumber>0" style="color: red">/{{scope.row.returnNumber}}</span>
          </template>
        </el-table-column>


        <el-table-column
          prop="isUrgent"
          label="是否加急"
          key="isUrgent"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isUrgent==0">否</span>
            <span v-else style="color: red;">是</span>
          </template>
        </el-table-column>


        <el-table-column
          prop="postName"
          label="检测岗位"
          key="postName"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="executor"
          label="人员"
          key="executor"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="entrustDate"
          label="委托日期"
          key="entrustDate"
          :formatter="formatterDate"
          sortable="custom"
        >
        </el-table-column>

        <el-table-column
          prop="detectionDeadline"
          label="检测期限"
          key="detectionDeadline"
          :formatter="formatterDate"
        >
        </el-table-column>

        <el-table-column
          prop="returnFlag"
          label="是否退件"
          key="returnFlag"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.returnFlag==1">是</span>
            <span v-else >否</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="delayFlag"
          label="是否延期"
          key="delayFlag"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.delayFlag==1">是</span>
            <span v-else >否</span>
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


    </mind-dialog>
  </div>

</template>

<script>

  import Vue from 'vue'
  // 引入jquery
  import $ from 'jquery'
  import {ajaxRequest, ajaxSyncProxyRequest, ajaxSyncRequest} from "../../util/base";

  export default {
    props: {
      callback: {
        type: Function,
        required: true
      },
      // type 1 当天 2所有 3所有未完成  4预警（提前两天）任务  5 超期任务
      detailType: {
        type: String,
        required: true
      },
      userId: {
        type: String
      },
      departId: {
        type: Number
      }
    },
    data() {
      return {
        tableData: [],
        page: 1,
        rows: 10,
        total: 0,
        title:'任务查看',
        orderProperty:'d.ENTRUST_DATE',
        orderType:'desc'
      }
    },
    mounted() {
      this.titleHeader();
      this.getTableList();
    },

    methods: {
      handleSort: function (column, prop, order) {
        this.orderProperty = 'd.ENTRUST_DATE'
        if (column['order'] == 'descending') {
          this.orderType = 'desc'
        } else {
          this.orderType = 'asc'
        }
        this.getTableList()
      },
      titleHeader(){
        //获取到单位名称
        let name = "";
        if(this.departId!=null){
          ajaxSyncRequest("get", "back/depart/"+this.departId, {}, res => {
              name = res.daoResult.departName
          })
        }

        if(this.userId!=null){
          ajaxSyncRequest("get", "back/user/"+this.userId, {}, res => {
              name = res.daoResult.userName
          })
        }

        let title = "";
        if(this.detailType==1){
          title = '当天任务'
        }else if(this.detailType==2){
          title = '加急任务';
        }else if(this.detailType==3){
          title = '所有任务';
        }else if(this.detailType==4){
          title = '预警（提前两天）任务';
        }else if(this.detailType==5){
          title = '超期任务';
        }

        if(name!=''){
          title = name +"-"+title;
        }
        this.title = title;
      },
      getTableList() {
        ajaxRequest("get", "back/secondAllot/sjdForUserDetail", {
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total: 0,
          userId:this.userId,
          departId:this.departId,
          type:this.detailType
        }, res => {
          if (res.code === 200) {
            this.tableData = res.rows
            this.total = res.total
          }
        })
      }
      ,
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size
        this.getTableList()
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage
        this.getTableList()
      },
      formatterDate: function (row, column, cellValue) {
        if(cellValue){
          return new Date(cellValue).format('YYYY-MM-DD')
        }else{
          return '';
        }
      },
      handleCancel: function () {
        this.callback(null);
      },
    }
  }
</script>

<style scoped>

</style>
