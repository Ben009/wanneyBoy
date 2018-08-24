<template>
  <div style="position:relative;">
      <div style="margin-top:10px;">
        <el-table  :data="tableData"
          :max-height="QJTableMaxHeight"
          border
          style="width: 100%">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="USER_NAME" label="操作人"></el-table-column>
          <el-table-column prop="ADD_TIME" label="操作时间" :formatter="formatterAddTime"></el-table-column>
          <el-table-column prop="CATEGORY" label="类别" ></el-table-column>
          <el-table-column prop="REMARK" label="说明" ></el-table-column>
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
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,formatDate} from '../../util/base';

  export default {
    name: "appliance-log-list",
    props:{
      applianceId:{
        type:Number,
        required:true
      },
      callback:{
        type:Function,
        required:true,
      }
    },
    data(){
      return{
        page:1,
        rows:10,
        total:0,
        orderProperty:'id',
        orderType:'desc',
        tableData:[],
      }
    },
    methods:{
      //获取列表事件
      getTableList(){
          ajaxRequest('get','back/appliance/getApplianceLogList',{
            page:this.page,
            rows:this.rows,
            orderProperty:this.orderProperty,
            orderType:this.orderType,
            total:0,
            applianceId:this.applianceId
          },(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
            }
          })
      },
      //分页事件
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      //分页事件
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getTableList();
      },
      //时间转换
      formatterAddTime:function(row, column){
        return formatDate(row.ADD_TIME,'YYYY-MM-DD hh:mm:ss');
      },
    },
    mounted() {
      this.getTableList();
    }
  }

</script>

<style scoped>
  .custom-input{
    width:200px;
    height:32px;
  }
  .custom-input .el-input__inner{
    height:32px;
    line-height:32px;
  }
  .custom-input .el-input-group__append{
    padding:0 10px;
  }
</style>
