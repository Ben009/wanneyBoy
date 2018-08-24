<template>
  <mind-dialog
    title="技术依据选择"
    v-dialogDrag
    :visible="true"
    width="75%"
    center
    ref="dialog"
    v-dialogDrag
    @close="handleCancel">
    <div style="position:relative;" ref="totalHeight">
      <div style="margin-bottom:5px;" ref="topButton">
        <div>
          <div style="text-align: center">
            <el-button type="primary"  round @click="AdvanceSearch" class="el-icon-search">查询</el-button>
            <el-button type="warning"  round @click="EmptyCondition" class="el-icon-info">清空</el-button>
            <el-button type="warning"  round @click="clearCheck" class="el-icon-info">清空所选</el-button>
          </div>
        </div>
      </div>
      <div>
        <div style="margin-top:10px;">
          <el-table :data="tableData" v-if="tableVisable" :height="singleTableHeight" :key="tableKey" border ref="tecBasList" @sort-change="handleSort" @row-click="checkThisTec">
            <el-table-column type="index" fixed="left" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="basisNo" fixed="left" label="技术依据编号" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="name" label="技术依据名称" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="basisType" label="依据类型" :formatter="dealBasisTypeName" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="department" label="所属部门" :formatter="dealDepartment" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="controlled" label="是否受控" :formatter="dealControlled" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="controlledNo" label="受控编号" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="implementationDate" label="实施日期" :formatter="dealDate" :render-header="renderHeader"></el-table-column>
          </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right;" ref="pagination">
          <mind-pagination
            :current-page="page"
            :page-size="rows"
            :total="total"
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentPageChange">
          </mind-pagination>
        </div>
      </div>
    </div>
  </mind-dialog>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'

import {ajaxRequest, formatDate, ajaxProxyRequest,ajaxSyncProxyRequest} from '../../util/base'
/* import Retrieve from '../../Retrieve'
import WorkMould from '../../mould/WorkMould'
*/
import MiniTableHeader  from './TableHeader.vue'
import paramJson from './tecBasListParamForSelect' // 同目录下json数据
//import tableRetrieve from './tableRerieve'

/* import {Table, TableColumn} from 'element--ui'
Vue.use(Table)
Vue.use(TableColumn) */

// Vue.mixin(tableRetrieve)
export default {
  name: 'tecBasListSelect',
  //mixins:[tableRetrieve],
  props: {
    tecBasIds: {
      type: Array,
      required: false
    },
    callback: {
      type: Function,
      required: true
    },
    recheckTecBas: {
      type: Function,
      required: true
    },
    checkRow: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      form: {},
      value: null,
      page: 1,
      rows: 10,
      total: 0,
      searchKey: '',
      orderProperty: 't.id',
      orderType: 'desc',
      tableData: [],
      multipleSelection: [],
      fuzzySearch: 0,
      isSetting: 0, // 控制个性化设置弹窗是否展示

      /* 高级检索相关项 */
      rowsCondition: paramJson, // 默认同目录下json数据 会依据模板改变
      paramJson: paramJson, // 同目录下json数据 常量
      moduleList: [], // 模板列表
      templateValue: '', // 当前选择的模板id
      sortBy: '', // 排序字段
      order: '', // desc降序 asc升序
      headObj: {}, // 表头显示对象 {category:true}
      userId: '',
      resultCondition: [],
      sc:{},
      search:{},
      setEmpty:{},
      //collectionInfo: [],
      setHeightForRet: null,
      tableKey: 0,
      basisTypeList: [],
      departmentList: [],
      tempIds: this.tecBasIds,
      controlledList: [{code: 0, remark: '否'}, {code: 1, remark: '是'}],
      singleTableHeight:200,
      tableVisable:true,
    }
  },
  watch:{
    innerHeight(){
      this.calcTableHeight()
    }
  },
  methods: {
    calcTableHeight(){
      this.$nextTick(val => {
        this.tableVisable=false;
        this.$nextTick(val => {
          this.tableVisable=true;
        })
        let dialog = this.$refs.dialog.$el.querySelector('.el-dialog');
        let dialogBodyHeight = $(dialog).height() - $(dialog.querySelector('.el-dialog__header')).height();
        this.singleTableHeight = dialogBodyHeight - ($(this.$refs.topButton).height() + $(this.$refs.pagination).height() + 65)
      })
    },
    handleCancel () {
      this.callback()
    },
    clearCheck () {
      this.tempIds = this.recheckTecBas()
      this.AdvanceSearch()
    },
    checkThisTec (row) {
      this.checkRow(row, this.index)
      this.callback()
    },
    handleSort: function (column, prop, order) {
      this.orderProperty = column['prop']
      if (column['order'] === 'descending') {
        this.orderType = 'desc'
      } else {
        this.orderType = 'asc'
      }
      this.getTableList()
    },
    getTableList () {
      ajaxRequest(
        'get',
        'back/tecBas/retrieveForSelect',
        {
          fuzzySearch: 1,
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          // 进行升序降序排列的标志
          orderType: this.orderType,
          total: 0,
          sc: this.sc,
          ids: this.tempIds.join(',')
        },
        res => {
          if (res.code === 200) {
            this.tableData = res.rows
            this.total = res.total
            this.multipleSelection = []
          }
        }
      )
    },
    dealControlled (row, column) {
      let controlled = {0: '否', 1: '是'}
      return controlled[row.controlled]
    },
    dealBasisTypeName (row) {
      return row.basisTypeName
    },
    dealDepartment (row) {
      return row.departName
    },
    dealDate: function (row, column, cellValue) {
      // console.log(cellValue+"==="+formatDate(cellValue,'YYYY-MM-DD'))
      return formatDate(cellValue, 'YYYY-MM-DD')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handlePageSizeChange (size) {
      this.page = 1
      this.rows = size
      this.getTableList()
    },
    handleCurrentPageChange (currentPage) {
      this.page = currentPage
      this.getTableList()
    },
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
        //console.log('aaaa',currentInfo,'序号',$index)
        return (
          <MiniTableHeader key={$index + property} onEnterInput={this.AdvanceSearch} column={column} handleSearch={this.handleSearch.bind(this)} index={$index}
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
      let comparison = this.getComparison(column.property);
      let sqlSeg = this.getSqlSeg(column.property);
      let columnParam = this.getColumnParam(column.property);
      /*表格标题检索回调 插入一条检索项*/ 
      this.search[column.property]={
                    logicalValue: 0,
                    nameCode: column.property,
                    comparison: comparison,
                    value: columnParam['component']=="date"? ( " to_date('"+value+"','"+columnParam['dateFormat']+"') " ):value,
                    sqlSeg: sqlSeg,
      };

      this.setEmpty[column.property]=empty;
      console.log("新增检索项",JSON.stringify(this.search));
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
    getColumnParam(property) {
      /*通过列属性，找到当前列json配置中sqlSeg信息*/
      let temp = this.paramJson.filter((v) => {return v.nameCode == property})
      let sqlParam = temp.length > 0 ? temp[0] : {}
      return sqlParam
    },
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
    EmptyCondition(){
      for(let p in  this.setEmpty){
          this.setEmpty[p]();
          this.search[p].value="";
      }
    }
  },
  components: {
  },
  created(){
    this.userId = localStorage.getItem('userId')
    this.paramJson.forEach((v)=>{
        v.isQueryResult == 1?this.resultCondition.push(v):null;
    })
    let param = [].concat(this.paramJson), headObj = {};
    param.forEach(v => v.isTableDefault == 1 ? headObj[v.nameCode] = true : null);
    this.headObj = headObj;
    ajaxSyncProxyRequest('get', '/njmind/findParams/basisType$departmentList', {}, function (res) {
      // debugger;
      this.basisTypeList = res['basisType'].list;
      this.departmentList = res['departmentList'].list;
    }.bind(this))
  },
  mounted () {
    this.getTableList()
    this.calcTableHeight()
  }
}
</script>

<style scoped>
  .flex-one {
    flex: 1;
  }

  .flex {
    display: flex;
  }

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

  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }

  .el-icon-setting:hover {
    color: #3094e0 !important;
  }

  .shuoming {
    border: none !important;
    color: #56BC4E !important;
    font-size: 16px !important;
  }

  .shuoming::after {
    content: "";
    width: 35px;
    height: 40px;
    /*background: #fff;*/
    position: absolute;
    z-index: 999;
    /* top: 0; */
    /* left: -65px; */
    margin-left: -16px;

  }

  .el-sm {
    background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 1px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -361px;
    word-break: break-all;
    margin-top: 18px;
    padding: 4px 5px;
    font-size: 14px;
    opacity: 50;
    float: right;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }

  .shuoming .el-sm {
    display: none;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }

  .el-button--warning:hover {
    background: #ff9c9c !important;
    border: 1px solid #ff9c9c !important;

  }

</style>
