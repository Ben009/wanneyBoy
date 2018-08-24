<template>
  <div  style="position:relative;">
    <Retrieve  ref="retrieve-wapper"
               :rowsCondition='rowsCondition'
               :sortBy="sortBy"
               :order="order"
               v-if="defaultOpen"
               :paramJson="paramJson"
               :retrieveCondition="retrieveCondition"
               :collectionInfo="collectionInfo"/>

    <div style="display: flex;justify-content: space-between; margin:10px 0px;">
      <div style="display: inline-block;text-align: center">
        <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search"  v-if="defaultOpen">查询</el-button>
        <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning"   v-if="defaultOpen">&nbsp;清空</el-button>
      </div>
      <span style="float: right">
          <el-select size="mini" v-if="resultCondition.length" v-model="templateValue"  placeholder="请选择" @change="QJHandleSelectTemplate">
              <el-option
                v-for="item in moduleList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
          </span>
    </div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20" style="text-align: center;margin:20px 0;">
          <el-button class="el-button el-button--primary" @click="search">查询</el-button>
          <el-button class="el-button el-button--primary" @click="exportList">导出</el-button>
        </el-Row>
      </div>
      <div>
        <el-table :max-height="QJTableMaxHeight"
                  ref="table"
                  :data="tableData"
                  border
                  style="width: 100%"
                  :fit="true"
                  v-loading="loading">
          <el-table-column label="客户名称">
            <template slot-scope="scope">
              <span @click="openCertification(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.COMPANY_NAME}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="AREA" label="行政区（区）"></el-table-column>
          <el-table-column prop="ADDRESS" label="地址"></el-table-column>
          <el-table-column prop="CONTACTER" label="联系人"></el-table-column>
          <el-table-column prop="ZSSL" label="证书数量"></el-table-column>
          <el-table-column prop="YSQJGZL" label="强检工作量"></el-table-column>
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
    <certificationForm v-if="certification" :callback="handleClose" :data="data"></certificationForm>
    <charts :list="tableData"></charts>
  </div>
</template>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入强检证书弹层
  import certificationForm from "./certificationForm";
  import Retrieve from "../../Retrieve";
  import WorkMould from "../../mould/WorkMould";
  import TableColumnHeader from "../../Table/TableColumnHeader";
  import paramJson from "./curstomerParam"; //同目录下json数据
  import charts from "../department/charts"; //图表
  export default {
    name:"customerQuery",//强检客户查询
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      certificationForm,
      charts
    },
    data() {
      return {
        page:1,//页码
        rows:50,//每页记录数
        fuzzySearch:0,//是否模糊查询，默认关闭模糊查询
        total:0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
        tableData:[],
        certification:false,//强检证书弹层
        data:{},//传到强检证书的数据

        isSetting: 0, //控制个性化设置弹窗是否展示
        edit: null, //控制编辑弹窗是否展示
        isInner: 0,
        /*高级检索相关项*/
        rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
        paramJson: paramJson, //同目录下json数据 常量
        moduleList: [], //模板列表
        templateValue: "", //当前选择的模板id
        sortBy: "", //排序字段
        order: "", //desc降序 asc升序
        headObj: {}, //表头显示对象
        defaultOpen: true, //默认开启高级查询
        sc:'',
        userId: "",
        allModules: {}, //所有模板
        resultCondition: [],
        retrieveCondition: [],
        collectionInfo:[],
        loading:false,
      }
    },
    methods:{
      getTableList(){
        this.loading=true
        ajaxRequest('get','back/statistics/findQjkh',{
          page:this.page,
          rows:this.rows,
          total:0,
          sc:this.sc,
        },(res)=>{
          if(res.code===200){
            this.tableData=res.rows;
            this.total=res.total;
          }else{
            this.$message.error(res.msg);
          }
          this.loading=false
        })
      },
      search(){
        this.getTableList();
      },
      exportList(){//导出

      },
      openCertification(row) {//点客户名称展示客户相关强检证书弹层
        this.certification=true;
        this.data.companyId=row.ID;
      },
      handleClose(){//关闭强检证书弹层
        this.certification=false;
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
    },
    mounted(){
      this.getTableList();
    }
  }
</script>

<style scoped>
  .lbCenter>label{
    width:100% !important;
    text-align: center !important;
    padding-right: 0!important;
  }
</style>
