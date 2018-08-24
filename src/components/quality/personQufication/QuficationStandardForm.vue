<template>
  <mind-dialog
    :visible="true"
    title="计量标准"
    dialogSize="mid"
    center
    v-dialogDrag
    append-to-body
    @close="closeDialog">
    <el-form ref="form" label-width="150px">
      <el-row :gutter="20">
        <el-col :span="12">
          <!--<el-form-item label="计量标准">-->
            <!--&lt;!&ndash;单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 &ndash;&gt;-->
            <!--<el-input v-model="searchKey"></el-input>-->
          <!--</el-form-item>-->
        </el-col>
        <div style="padding-left:400px">
          <el-button class="el-button el-button--primary" @click="AdvanceSearch">查询</el-button>
          <el-button class="el-button el-button--danger" @click="closeDialog">关闭</el-button>
        </div>
      </el-row>
      <el-row>
        <div style="margin-top:10px;">
          <el-table :max-height="QJTableMaxHeight"
                  :data="tableData"
                  border
                  :key="tableKey"
                  @sort-change="handleSort"
                  :fit="true"
                  @selection-change="handleSelectionChange"
                  @row-click="checkThisQui">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column  prop="standardName"  label="计量标准名称" :render-header="renderHeader"> </el-table-column>
            <el-table-column prop="standardCerNo"  label="计量标准证书号"  :render-header="renderHeader"> min-width="236"</el-table-column>
            <el-table-column  prop="classAccuracy"  label="扩展/不确定度"  :render-header="renderHeader">min-width="260"</el-table-column>
            <el-table-column   prop="measuringRange"  label="测量范围"  :render-header="renderHeader"> min-width="300"</el-table-column>
            <el-table-column prop="standardValidDate"  label="计量标准有效期" :formatter="dealDate"  :render-header="renderHeader">min-width="236"</el-table-column>
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
      </el-row>
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
  import {ajaxRequest} from '../../util/base';
  //引入高级检索
  import Retrieve from '../../Retrieve';
  //引入个性化设置模版
  import WorkMould from '../../mould/WorkMould';
  //引入自定义表头
  import MiniTableHeader  from '../tecBas/TableHeader.vue'
  //引入对应的表单编辑页

  //引入对应的json文件 当前目录下quficationProjectParam.js文件
  import paramJson from './quficationStandard';
  //引入jquery
  import $ from 'jquery';
  import ElRow from "@/common-el/packages/row/src/row";

  export default {
    components: {ElRow},
    props:{
      callback:{
        type:Function
      },
      checkRow1: {
        type: Function,
        required: true
      },
      index1: {
        type: Number,
        required: true
      }
    },
    name:"quficationSpecificationForm",
    data() {
      return {
        page:1,//页码
        rows:10,//每页记录数
        fuzzySearch:0,//是否模糊查询，默认关闭模糊查询
        total:0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
        searchKey:'',//搜索词
        orderProperty:'id',//排序字段
        orderType:'desc',//排序方式
        tableData:[],//表格中的数据
        multipleSelection:[],//多选，选中的数据
        isSetting:0,//是否是设置
        paramJson: paramJson,
        headObj:{},
        sc:{},
        search:{},
        setEmpty:{},
        tableKey:0,
        rowsCondition: paramJson, // 默认同目录下json数据 会依据模板改变v
      }
    },
    methods:{
      dealDate: function (row, column, cellValue) {
        console.log(cellValue);
        if(cellValue==null){
          return "";
        }
        return new Date(cellValue).format('YYYY-MM-DD')
      },
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
//        renderHeader:function(h, { column, $index }){
//          return <TableColumnHeader column={column} handleSearch={this.handleSearch.bind(this)}></TableColumnHeader>
//        },
//        renderHeader(h, {column, $index}) {
//          /*表格头部自定义渲染  key值必加 隐藏列时需重新渲染头部*/
//          let property = column.property;
//          let currentInfo = paramJson.filter((v)=>{return v.nameCode==property});
//          return (
//            <TableColumnHeader key={$index+property} column={column}  handleSearch={this.handleSearch.bind(this)} currentInfo={currentInfo}/>
//        )
//
//        },
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
      getTableList() {
        /*获取table数据，维护data数据*/
        ajaxRequest('get','back/quficationProject/getMStandardList',{
          page:this.page,
          rows:this.rows,
          orderProperty:this.orderProperty,
          orderType:this.orderType,
          total:0,
          sc:this.sc,
          isDelete:0
        },(res)=>{
          if(res.code===200){console.log(res.rows)
            this.tableData=res.rows;
            this.total=res.total;
            this.multipleSelection=[];
          }
        })
      },
      checkThisQui(row){
        this.checkRow1(row,this.index1)
        this.callback()
      },
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage){
        /*分页组件每页显示条数change 重新计算页码，控制信息在当前表格中*/
        this.page=currentPage;
        this.getTableList();
      },
      defaultShowAllCol(){//默认显示列
        let param = [].concat(this.paramJson), headObj = {}
        console.log(param)
        param.forEach(v => v.isDefault == 1 ? headObj[v.nameCode] = true : null)
        this.headObj = headObj
        console.log(this.headObj,this.paramJson)
      },
      search(){
        console.log(this.searchKey);
      },
      closeDialog(){
        this.callback();
      },
    },
    mounted() {
      this.getTableList();
      this.defaultShowAllCol()
    }
  }
</script>
