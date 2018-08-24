<template>
  <mind-dialog
    title="技术依据选择"
    v-dialogDrag
    :visible="true"
    dialogSize="large"
    center
    v-dialogDrag
    @open="handleOpen"
    @close="handleCancel">
    <div style="position:relative;">
      <div style="margin-bottom:5px;">
        <!-- <Retrieve ref="retrieve-wapper" :rowsCondition='rowsCondition' :sortBy="sortBy" :order="order" @toparentevent="advanceSearch"/> -->
      </div>
      <div>
        <div style="margin-top:10px;">
          <div class="el-icon-info  shuoming" >
            <el-row class="el-sm">
              <p>1.鼠标移动到表格头部可查询！</p>
            </el-row>
          </div>
          <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%"  >
            <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
            <el-table-column prop="basisNo" label="技术依据编号" ></el-table-column>
            <el-table-column prop="name" label="技术依据名称" ></el-table-column>
            <!-- <el-table-column prop="basisTypeName" label="依据类型" :render-header="QJrenderHeader"></el-table-column> -->
            <el-table-column prop="department" label="所属部门" :formatter="formatDepart" ></el-table-column>
            <el-table-column prop="controlled" label="是否受控"  :formatter="dealControlled"></el-table-column>
            <el-table-column prop="controlledNo" label="受控编号" ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button type="primary" @click="checkThisTec(scope.row)">选择</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="implementationDate" label="实施日期" :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
            <el-table-column prop="addTime" label="添加日期" :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
            <el-table-column prop="updateTime" label="更新日期" :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column> -->
          </el-table>
        </div>
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
    <div slot="footer"></div>
  </mind-dialog>
</template>

<script>
import {ajaxRequest} from '@/components/util/base'
import Retrieve from '@/components/Retrieve'
import $ from 'jquery'
import TableColumnHeader from '@/components/Table/TableColumnHeader'
import techBasListParam from './tecbasJson'
export default {
  name: 'tecBas-dialog',
  props: {
    tecBasIds: {
      type: Array,
      required: false
    },
    callback: {
      type: Function,
      required: true
    },
  },
  data () {
    return {
      page: 1,
      rows: 10,
      total: 0,
      tableData: [],
      fuzzySearch: 1,
      isSetting: 0,
      edit: null,
      rowsCondition: techBasListParam, // 默认同目录下json数据 会依据模板改变
      paramJson: techBasListParam, // 同目录下json数据 常量
      sortBy: '', // 排序字段
      order: '', // desc降序 asc升序
      headObj: {}, // 表头显示对象 {category:true}
      tempDepartList:[],
    }
  },
  computed:{
    // dialogVisable(){
    //     return this.$store.state.Mstandard.tecbasDialog
    // }
  },
  mounted(){
    this.handleOpen()
  },
//  updated() {
//    this.handleOpen()
//  },
  methods: {
    handleCancel () {
      this.$store.commit('TECBAS_DIALOG',false)
      this.$emit('close')
    },
    handleOpen(){
      this.sc = JSON.stringify([{}])
      this.getTableList()
    },
    checkThisTec (row) {
      this.callback(row)
    },
    getTableList () {
      let ids = this.tecBasIds.join(',')
      ajaxRequest('get', 'back/tecBas/retrieveForSelect', {
        fuzzySearch: 1,
        page: this.page,
        rows: this.rows,
        orderProperty: this.orderProperty,
        orderType: this.orderType,
        total: 0,
        sc: this.sc,
        ids: ids
      }, (res) => {
        if (res.code === 200) {
          this.tableData = res.rows
          this.total = res.total
          this.multipleSelection = []
        }
      })
    },
    handlePageSizeChange (size) {
      this.page = 1;//Math.floor(this.page * this.rows / size);
      this.rows = size
      this.getTableList()
    },
    handleCurrentPageChange (currentPage) {
      this.page = currentPage
      this.getTableList()
    },
    dealControlled (row, column) {
      let controlled = {0: '否', 1: '是'}
      return controlled[row.controlled]
    },
    dealDate: function (row, column, cellValue) {
      if(cellValue){
        return new Date(cellValue).format('YYYY-MM-DD')
      }
    },
    formatDepart(row){
      return this.tempDepartList[row.department]
    },
    QJhandleSearch(column,value){
      var comparison = this.getComparison(column.property);
      var sqlSeg = this.getSqlSeg(column.property);
      this.sc = JSON.stringify([{"nameCode":column.property,"sqlSeg":sqlSeg,"comparison":comparison,"value":value}])
      this.getTableList()
    },
    getDepartList(){
      ajaxRequest('get','back/depart/list',{
        isDelete: 0
      },(val) => {
        if (val.code === 200) {
          this.departList = val.rows;
          this.departList.forEach(val => {
            this.tempDepartList[val.id] = val.departName
          })
        }else{
          this.$message.error(val.message)
        }
      })
    },
  },
  components: {
    TableColumnHeader,
    Retrieve
  },
  created() {
    this.getDepartList();
  },
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
  .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;margin-bottom: 5px;float: right;cursor: pointer;}
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
    margin-left: -190px;
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
</style>
