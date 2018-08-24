<template>
  <mind-dialog
    :visible="true"
    title="计量标准"
    dialogSize="mid"
    center
    v-dialogDrag
    :appendToBody="true"
    @close="closeDialog">
    <el-form ref="form" label-width="150px">
      <el-row :gutter="20">
        <el-col :span="24" style="text-align: center">
          <el-button type="primary" class="el-icon-search" @click="AdvanceSearch">查询</el-button>
          <el-button type="warning"  round @click="EmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
          <el-button class="el-button el-button--danger" @click="resetAll">清空所选行</el-button>
          <el-button class="el-button el-button--danger" @click="closeDialog">关闭</el-button>
        </el-col>
      </el-row>
        <div style="margin-top:10px;">
          <el-table :max-height="QJTableMaxHeight"
            :data="tableData"
            border
            style="width: 100%"
            @sort-change="handleSort"
            :fit="true"
            @row-click="checkThisQui">
            <el-table-column type="index" fixed label="序号" width="80" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jlbzName" fixed label="名称" :render-header="renderHeader" show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="jlbzNameEng" label="计量标准英文名称"></el-table-column>-->
            <el-table-column prop="jlbzClfw" fixed label="测量范围" :render-header="renderHeader" show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="jlbzClfwEng" label="测量范围英文名称"></el-table-column>-->
            <el-table-column prop="jlbzZqddj" fixed label="扩展/不确定度" :render-header="renderHeader" show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="jlbzZqddjEng"  label="准确度等级英文"></el-table-column>-->
            <el-table-column prop="jlbzZsbh" fixed label="计量标准证书编号" :render-header="renderHeader" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jlbzYxrq" fixed label="证书有效日期" :formatter="dateFormat" :render-header="renderHeader" show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="jlbzZsbhSocial"  label="计量标准社会公用证书编号"></el-table-column>-->
            <!--<el-table-column prop="jlbzYxrqSocial" label="计量标准社会公用有效日期" :formatter="dateFormat"></el-table-column>-->
          </el-table>
        </div>
      <div style="margin-top:10px;text-align:center;float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
    </el-form>
  </mind-dialog>
</template>

<style>

</style>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,formatDate} from '../../../util/base';
  //引入高级检索
  import Retrieve from '../../../Retrieve';
  //引入个性化设置模版
  import WorkMould from '../../../mould/WorkMould';
  //引入自定义表头
  import TableColumnHeader from '../../../Table/TableColumnHeader';
  //引入对应的表单编辑页
  import MiniTableHeader  from '../TableHeader.vue'
  import paramJson from './certificateJLBZDialog.js' // 同目录下json数据
  //引入对应的表单编辑页

  //引入对应的json文件 当前目录下quficationProjectParam.js文件
//  import paramJson from '../../quality/personQufication/quficationProjectParam.js';
  //引入jquery
  import $ from 'jquery';
  import ElRow from "@/common-el/packages/row/src/row";

    export default {
      components: {ElRow},
      props:{
        callback:{
          type:Function
        },
        thlogyRules:{
          required:true
        },
      },
      name:"CertificateJLBZDialog",
        data() {
            return {
              page:1,//页码
              rows:10,//每页记录数
              fuzzySearch:0,//是否模糊查询，默认关闭模糊查询
              total:0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
              searchKey:'',//搜索词
              orderProperty:'c.id',//排序字段
              orderType:'desc',//排序方式
              tableData:[],//表格中的数据
//              multipleSelection:[],//多选，选中的数据
              isSetting:0,//是否是设置
//              paramJson: paramJson,
//              headObj:{},

              /* 高级检索相关项 */
              rowsCondition: paramJson, // 默认同目录下json数据 会依据模板改变
              paramJson: paramJson, // 同目录下json数据 常量
              moduleList: [], // 模板列表
              templateValue: '', // 当前选择的模板id
              sortBy: '', // 排序字段
              order: '', // desc降序 asc升序
              headObj: {}, // 表头显示对象 {category:true}
              userId: '',
              //allModules: {}, // 所有模板
              resultCondition: [],
              sc:{},
              search:{},
              setEmpty:{},
              //collectionInfo: [],
              setHeightForRet: null,
              tableKey: 0,
              basisTypeList: [],
              departmentList: [],
              controlledList: [{code: 0, remark: '否'}, {code: 1, remark: '是'}]
            }
        },
      methods:{
        handleSort: function(column, prop, order){
          /*用ui组件提供的排序接口,维护实例data数据*/
          this.orderProperty = column['prop'];
          if(column['order'] == 'descending'){
            this.orderType='desc';
          }else{
            this.orderType = 'asc';
          }
          this.getTableList();
        },
        handleToggleTheme(color) {
          this.$store.commit('toggleTheme', color)
        },
        getTableList() {
          /*获取table数据，维护data数据*/
          ajaxRequest('post','back/certificateQuality/queryJlbz',{
            page:this.page,
            rows:this.rows,
            orderProperty:this.orderProperty,
            orderType:this.orderType,
            total:0,
            sc:this.sc,
            jlbzName:this.searchKey==''?null:this.searchKey
          },(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
            }
          })
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
        },
        checkThisQui(row){
          this.callback(this.thlogyRules,row)
        },
//        search(){
//          console.log(this.searchKey);
//          this.getTableList();
//        },
        closeDialog(){
          this.callback();
        },
        resetAll(){
          this.callback(this.thlogyRules,'reset');
        },
        dateFormat(row, column, cellValue, index) {
          return formatDate(cellValue, "YYYY-MM-DD");
        },
      },
      mounted() {
        this.getTableList();
//        this.defaultShowAllCol()
      },
      created(){

      }
    }
</script>
