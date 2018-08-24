<template>
  <div class="auditListRecord">
    <!-- 表格 start -->
    <div class="auditListRecord-table">
      <el-table :max-height="QJTableMaxHeight"
        :data="aduitRecordList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="addUserName"
          show-overflow-tooltip
          label="发起人">
        </el-table-column>
        <el-table-column
          prop="addTime"
          show-overflow-tooltip
          :formatter="dealDate"
          label="发起时间">
        </el-table-column>
        <el-table-column
          prop="audiTorName"
          show-overflow-tooltip
          label="审核人">
        </el-table-column>
        <el-table-column
          prop="audiTingTime"
          show-overflow-tooltip
          :formatter="dealDate"
          label="审核时间">
        </el-table-column>
        <el-table-column
          prop="audiTingAdvice"
          show-overflow-tooltip
          label="审核意见">
        </el-table-column>
        <el-table-column
          prop="audTingResult"
          show-overflow-tooltip
          :formatter="formatAduit"
          label="审核结果">
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格 end -->
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
  import $ from 'jquery';
  export default {
    name: "auditListRecord",
    data(){
      return {
        /************************************* 表格字段开始 start *************************************/
        page: 1,
        rows: 10,
        total: 0,
        aduitRecordList:[],
      }
    },
    computed:{
      // 当前仪器标准的id
      currentStandardId(){
        return this.$store.state.Mstandard.currentStandardId
      },
    },
    watch:{
      // 获取到当前仪器标准的id时请求主/配套信息
      currentStandardId(){
        if(this.currentStandardId){
          this.getTableList()
        }
      }
    },
    methods: {
      /***********************************************  表格方法 start  *********************************************/
      /**
       * [getTableList 获取所有的计量标准列表]
       * @return {[type]} [description]
       */
      getTableList(){
        this.$store.dispatch('getStandardAduitList',{
          page: this.page,
          rows: this.rows,
          total:0,
          isDelete:0,
          stId:this.currentStandardId
        }).then(res => {
          this.total = res.total
          this.aduitRecordList = res.rows
        })
      },
      handlePageSizeChange (size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList()
      },
      handleCurrentPageChange (currentPage) {
        this.page = currentPage
        this.getTableList()
      },
      /***********************************************  表格方法 end  *********************************************/
      /*********************************************** 表格数据格式化集合 ********************************************/
      /**
       * [dealDate 格式化显示时间]
       * @param  {[type]} row       [description]
       * @param  {[type]} column    [description]
       * @param  {[type]} cellValue [description]
       * @return {[type]}           [description]
       */
      dealDate(row, column, cellValue){
        if(cellValue){
          return new Date(cellValue).format('YYYY-MM-DD hh:mm:ss')
        }
      },
      /**
       * [formatAduit 格式化显示审核状态]
       * @param  {[type]} row       [description]
       * @param  {[type]} column    [description]
       * @param  {[type]} cellValue [description]
       * @return {[type]}           [description]
       */
      formatAduit(row, column, cellValue){
        console.log(cellValue,'1111')
        if(row.isAuditing == 0 && row.auditingResult == 0){
          return '未送审'
        }else{
          let result = {0:'未审核',1:'通过',2:'未通过'}
          return result[cellValue]
        }
      },
      /*********************************************** 表格数据格式化集合 ********************************************/
    },
  }
</script>

<style scoped lang="scss">
  .MStandardList{
    .flex-one{
      flex:1
    }
    .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;cursor: pointer;}
    .shuoming::after{
      content: "";
      /*background: #fff;*/
      position: absolute;
      z-index: 999;
      /* top: 0; */
      /* left: -65px; */
      right:10;

    }

    .el-sm{
      background: #ffffff;
      position: absolute;
      z-index: 999;
      -webkit-box-shadow: 1px 7px 33px -9px #969696;
      box-shadow: 1px 7px 33px -9px #969696;
      border: 1px solid #56bc4e8c;
      border-radius: 5px;
      color: dimgrey;
      margin-left: -230px;
      margin-right: 0px;
      word-break: break-all;
      margin-top: 5px;
      padding: 4px 5px;
      font-size: 14px;
      opacity: 50;
      float: right;
      -webkit-transition: all 0.8s;
      transition: all 0.8s;
    }
  }
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
