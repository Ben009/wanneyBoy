<template>
  <mind-dialog
    :visible="true"
    title="仪器设备历史溯源有效期查询"
    dialogSize="mid"
    center
    v-dialogDrag
    :appendToBody="true"
    @close="closeDialog">
    <el-form ref="form" label-width="150px">
      <!--<el-row :gutter="20">-->
        <!--<el-col :span="12">-->
        <!--<el-form-item label="仪器设备证书查询">-->
          <!--&lt;!&ndash;单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 &ndash;&gt;-->
          <!--<el-input v-model="searchKey"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-button class="el-button el-button&#45;&#45;primary" @click="search">查询</el-button>-->
          <!--<el-button class="el-button el-button&#45;&#45;danger" @click="closeDialog">关闭</el-button>-->
        <!--</el-col>-->
      <!--</el-row>-->
        <div style="margin-top:10px;">
          <el-table :max-height="QJTableMaxHeight"
            :data="tableData"
            border
            style="width: 100%"
            @sort-change="handleSort"
            :fit="true"
            @row-click="checkThisQui">
            <el-table-column prop="jlbzqZsbh" label="证书编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jlbzqZsType" label="证书类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jlbzqJddw" label="检校机构" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jlbzqJjry" label="检校员" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jlbzqYxrq" label="证书有效期" :formatter="dateFormat" show-overflow-tooltip></el-table-column>

          </el-table>
        </div>
      <!--<div style="margin-top:10px;text-align:center;float:right;">-->
        <!--<mind-pagination-->
          <!--:current-page="page"-->
          <!--:page-size="rows"-->
          <!--:total="total"-->
          <!--@size-change="handlePageSizeChange"-->
          <!--@current-change="handleCurrentPageChange">-->
        <!--</mind-pagination>-->
      <!--</div>-->
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
        jlbzqId:{
          default: 0
        },
        thlogyRules:{
          required:true
        },
      },
      name:"CertificateJLBZQDialog",
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
              headObj:{},
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
          ajaxRequest('get','back/certificateQuality/getJlbzqHistory/'+this.jlbzqId,{
            page:this.page,
            rows:this.rows,
            orderProperty:this.orderProperty,
            orderType:this.orderType,
            total:0,
            sc:this.sc
          },(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
            }
          })
        },
        handlePageSizeChange(size){
          this.page=Math.floor(this.page*this.rows/size);
          if(this.page == 0){
            this.page = 1 ;
          }
          this.rows=size;
          this.getTableList();
        },
        handleCurrentPageChange(currentPage){
          /*分页组件每页显示条数change 重新计算页码，控制信息在当前表格中*/
          this.page=currentPage;
          this.getTableList();
        },
        checkThisQui(row){
          this.callback(this.thlogyRules,row)
        },
        search(){
          console.log(this.searchKey);
        },
        closeDialog(){
          this.callback();
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
