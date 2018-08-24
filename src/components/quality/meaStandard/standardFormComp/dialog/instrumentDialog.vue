<template>
<div>
  <mind-dialog
    title="仪器设备查询"
    v-dialogDrag
    :visible="!!dialogVisable"
    dialogSize="large"
    center
    v-dialogDrag
    @open="handleOpen"
    @close="handleCancel">
      <div style="margin-bottom:5px;">
        <div>
          <div style="text-align: center">
            <el-button type="primary"  round @click="AdvanceSearch" class="el-icon-search">查询</el-button>
            <el-button type="warning"  round @click="EmptyCondition" class="el-icon-info">清空</el-button>
            <!-- <el-button type="warning"  round @click="clearCheck" class="el-icon-info">清空所选</el-button> -->
          </div>
        </div>
      </div>
    <div style="position:relative;">
      <div>
        <div style="margin-top:10px;">
          <!-- <global-tootips style="float:right;">
            <p>1.鼠标移动到表格头部可查询！</p>
          </global-tootips> -->
          <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%" >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="instrumentationName" show-overflow-tooltip label="设备名称" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="model" label="型号规格" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
            <el-table-column prop="manufacturingCode" label="出厂编号" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
            <el-table-column prop="deviceNumber" label="设备编号" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
            <el-table-column prop="accuracyClass" label="准确度等级" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
            <el-table-column prop="mearsuringRange" label="测量范围" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
            <el-table-column prop="manufacturer" label="制造厂商" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
            <el-table-column prop="calibrationDate" label="检定日期" show-overflow-tooltip :render-header="renderHeader" :formatter="dealDate"></el-table-column>
            <el-table-column prop="effectiveDate" label="有效日期" show-overflow-tooltip :render-header="renderHeader" :formatter="dealDate"></el-table-column>
            <el-table-column prop="certificateNo" label="证书编号" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
            <el-table-column prop="department" label="部门" show-overflow-tooltip :formatter="formatDepart" :render-header="renderHeader"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button type="primary" @click="checkThisTec(scope.row)">选择</el-button>
              </template>
            </el-table-column>
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
</div>
</template>

<script>
import {ajaxRequest} from '@/components/util/base'
import $ from 'jquery'
import paramJson from './instrumentDialogJson'
import MiniTableHeader  from '../../../tecBas/TableHeader.vue'
export default {
  name: 'tecBas-dialog',
  props: {
    instrumentIds: {
      type: Array,
      required: false,
      default(){
      	return []
      }
    },
    callback: {
    	type: Function,
    }
  },
  data () {
    return {
      page: 1,
      rows: 10,
      total: 0,
      tableData:[],
      tempDepartList:[],
      rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
      paramJson: paramJson, //同目录下json数据 常量
      search:{},//搜索的paramJson值
      setEmpty:{},//清空搜索条件
    }
  },
  computed:{
    dialogVisable(){
				return this.$store.state.Mstandard.instrumentDialog
		}
  },
  mounted(){
    this.handleOpen();
  },
  methods: {
    handleCancel () {
      this.$store.commit('INSTRUMENT_DIALOG',false)
    },
    handleOpen(){
      this.sc = JSON.stringify([{}])
      this.getTableList()
    },
    checkThisTec (row) {
      this.callback(row)
    },
    getTableList () {
      let ids = this.instrumentIds.join(',')
      ajaxRequest('get', 'back/instrumentation/retrieve', {
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
    formatDepart(row){
      return this.tempDepartList[row.departId]
    },
    dealDate: function (row, column, cellValue) {
    	if(cellValue){
    		return new Date(cellValue).format('YYYY-MM-DD')
    	}
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
    QJhandleSearch(column,value){
      var comparison = this.getComparison(column.property);
      var sqlSeg = this.getSqlSeg(column.property);
      this.sc = JSON.stringify([{"nameCode":column.property,"sqlSeg":sqlSeg,"comparison":comparison,"value":value}])
      this.getTableList()
    },
    created() {
      this.getDepartList();
    },
    // 查询
    AdvanceSearch() {
      let sc=[];
        this.paramJson.forEach(item=>{
          if(this.search[item.nameCode]){
            item.isSpecial?this.search[item.nameCode]['isSpecial']=item.isSpecial:null;
            if(this.search[item.nameCode].value!=""){
              sc.push(this.search[item.nameCode]);
            }
          }
        })
      this.page=1;
      this.sc = JSON.stringify(sc);
      //this.orderProperty = data.sortBy;
      //this.orderType = data.order;
      this.fuzzySearch = 1;
      this.getTableList();
    },
    // 清空
  EmptyCondition(){
      for(let p in  this.setEmpty){
          this.setEmpty[p]();
          this.search[p].value="";
      }
    },
    // 清空所选
  // clearCheck () {
  //     this.tempIds = this.recheckTecBas()
  //     this.AdvanceSearch()
  //   },
    // 表头渲染
  renderHeader (h, {column, $index}) {
      /*表格头部自定义渲染  key值必加 隐藏列时需重新渲染头部*/
      let property = column.property,flag=false;
      this.rowsCondition.forEach(v=>{
        if(property==v.nameCode){
          flag=true;
        }
      });
      if(flag){
        let currentInfo = this.paramJson.filter((v) => {return v.nameCode == property});
        return (
          <MiniTableHeader key={$index + property} column={column} handleSearch={this.handleSearch.bind(this)} index={$index}
        currentInfo={currentInfo}/>
      )
      }else{
        return column.label
      }
    },
    handleSearch (column, value,index,empty) {
      /*表格头部检索回调 获取当前列检索信息回显高级搜索组件
      * comparison 默认显示第一条比较项
      * column.property 列英文名称
      * value 检索值
      * sqlSeg 列sqlSeg信息*/
      var comparison = this.getComparison(column.property);
      var sqlSeg = this.getSqlSeg(column.property);
      /*表格标题检索回调 插入一条检索项*/
        this.search[column.property]={
                    logicalValue: 0,
                    nameCode: column.property,
                    comparison: comparison,
                    value: value,
                    sqlSeg: sqlSeg,
        };

        this.setEmpty[column.property]=empty;
    },
    getComparison (property) {
      /*通过列属性，找到当前列json配置中第一个比较项*/
      let temp = this.paramJson.filter((v) => {return v.nameCode == property})
      let comparison = temp.length > 0 ? temp[0].comparison : ''
      if (Object.prototype.toString.call(comparison) === '[object String]') {
        comparison = comparison.split(',')[0]
      } else {
        comparison = comparison[0]
      }
      return comparison
    },
    getSqlSeg (property) {
      /*通过列属性，找到当前列json配置中sqlSeg信息*/
      let temp = this.paramJson.filter((v) => {return v.nameCode == property})
      let sqlSeg = temp.length > 0 ? temp[0].sqlSeg : ''
      return sqlSeg
    },
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

</style>
