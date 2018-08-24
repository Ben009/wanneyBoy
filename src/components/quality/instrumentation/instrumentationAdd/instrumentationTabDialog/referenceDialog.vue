<template>
  <div>
    <mind-dialog :visible="true" dialogSize="mid" v-dialogDrag center title="查看引用标准" @close="back">
      <el-table :data="tableData">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="计量标准证书号" prop="standardCerNo"></el-table-column>
        <el-table-column label="计量标准名称" prop="standardName"></el-table-column>
        <el-table-column label="标准性质" prop="standardProp" :formatter="formatterProp"></el-table-column>
        <el-table-column label="有效期" prop="standardValidDate"></el-table-column>
        <el-table-column label="维护部门" prop="departName"></el-table-column>
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
      <el-row class="dialog-footer" slot="footer">
        <el-button @click="back">取消</el-button>
      </el-row>
    </mind-dialog>
  </div>
</template>
<script>
  import {ajaxRequest} from '../../../../util/base.js';

  export default {
    name: 'referenceDialog',
    props: {
      id: {
        required: true,
      }
    },
    data() {
      return {
        // 分页相关
        page: 1,
        rows: 10,
        total: 0,
        orderProperty: "d.id",
        orderType: "desc",
        tableData: []
      }
    },
    mounted() {
      this.getTableList();
    },
    methods: {
      handlePageSizeChange(size) {
        this.page = 1;
        this.rows = size;
        this.getTableList();
      },
      getTableList() {
        ajaxRequest( "get",  "back/instrumentation/retrieveInstStand", {
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            // 进行升序降序排列的标志
            orderType: this.orderType,
            total: 0,
            instId:this.id,
            sc: this.sc
          },
          res => {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
            }
            this.loading=false
          }
        );
      },
      formatterProp(row, column, cellValue){
        //0高标 1：次标
        if(cellValue==0){
          return '高标'
        }else if(cellValue==1){
          return '次标'
        }
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      back() {
        this.$emit('back')
      }
    }
  }
</script>
<style scoped>

</style>


