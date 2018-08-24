<template>
  <div style="position:relative;">
    <div style="margin-bottom:10px;">
      <Retrieve ref="retrieve-wapper"
                :rowsCondition='rowsCondition'
                :sortBy="sortBy"
                :order="order"
                v-if="defaultOpen"
                :paramJson="paramJson"
                :retrieveCondition="retrieveCondition"
                :collectionInfo="collectionInfo"
      />
    </div>
    <div>
      <div style="display: flex;justify-content: space-between; margin:10px 0px;">
        <span></span>
        <div style="display: inline-block;text-align: center">
          <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询</el-button>
          <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info" v-if="defaultOpen">&nbsp;清空
          </el-button>
        </div>
        <span style="float: right">
            <el-select size="mini" v-if="resultCondition.length" v-model="templateValue" placeholder="请选择"
                       @change="QJHandleSelectTemplate">
              <el-option
                v-for="item in moduleList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)"
                       class="el-icon-setting">个性化设置</el-button>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                       :handleMouldBack="QJHandleMouldBack"/>
          <global-tootips :width="600">
             <p> 1、有查询所有权限人员查询所有记录，有部门查询权限人员查询部门记录，无权限人员查询添加人为本人的记录。</p>
          </global-tootips>
          </span>
      </div>
      <el-table :max-height="QJTableMaxHeight"
                :data="tableData"
                border
                style="width: 100%"
                @sort-change="handleSort"
                v-loading="loading">
        <el-table-column v-if="headObj.ticketCompany" prop="ticketCompany" label="开票单位"></el-table-column>
        <el-table-column v-if="headObj.ticketMoney" prop="ticketMoney" label="开票金额"></el-table-column>
        <el-table-column v-if="headObj.ticketTypeName" prop="ticketTypeName" label="票种"></el-table-column>
        <el-table-column v-if="headObj.ticketCode" prop="ticketCode" label="发票号"></el-table-column>
        <el-table-column v-if="headObj.checkWayName"prop="checkWayName" label="结账方式"></el-table-column>
        <el-table-column v-if="headObj.departName" prop="departName" label="开票部门"></el-table-column>
        <el-table-column v-if="headObj.applyPerson" prop="applyPerson" label="申请人" ></el-table-column>
        <el-table-column v-if="headObj.applyTime" prop="applyTime" label="申请时间" ></el-table-column>
        <el-table-column v-if="headObj.checkDate" prop="checkDate" label="到款日期" :formatter="handleDate"></el-table-column>
        <el-table-column v-if="headObj.ticketBalance" prop="ticketBalance" label="余额"></el-table-column>
        <el-table-column
          label="详情"
          min-width="60">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-search" title="发票使用去向"></i></el-button>
          </template>
        </el-table-column>
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
      <billListOfTicket v-if="!!edit" :data="edit" :callback="handleEditCallback"></billListOfTicket>
  </div>

</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import {ajaxRequest, formatArrayToTree, ajaxProxyRequest} from '../../util/base';
  import Retrieve from '../../Retrieve';
  import WorkMould from '../../mould/WorkMould';
  import TableColumnHeader from '../../Table/TableColumnHeader';
  import billListOfTicket from '../bill/billListOfTicket';
  import paramJson from './ticketList.js'    //同目录下json数据

/*   import { Table, TableColumn, Pagination} from 'element--ui';
  Vue.use(Table);
  Vue.use(TableColumn); */

  export default {
    name: "ticket-list",
    data(){
      return{
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 't.check_date',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,

        isSetting: 0,  //控制个性化设置弹窗是否展示
        edit: null,   //控制编辑弹窗是否展示
        isInner: 0,

        /*高级检索相关项*/
        rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
        paramJson: paramJson, //同目录下json数据 常量
        moduleList: [], //模板列表
        templateValue: "", //当前选择的模板id
        sortBy: "", //排序字段
        order: "", //desc降序 asc升序
        headObj: {}, //表头显示对象 {category:true}
        defaultOpen: true, //默认开启高级查询

        userId: "",
        allModules: {}, //所有模板
        resultCondition: [],
        retrieveCondition: [],
        collectionInfo:[],
        loading:false,
      }
    },
    methods:{
      handleSort: function(column, prop, order){
        this.orderProperty = column['prop'];
        if(column['order'] == 'descending'){
          this.orderType='desc';
        }else{
          this.orderType = 'asc';
        }
        this.getTableList();
      },
      getTableList(){
        this.loading=true
          ajaxRequest('get','back/ticket/retrieveTicketsOfKpApply',{
            fuzzySearch:1,
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
              this.multipleSelection=[];
            }
            this.loading=false
          })
      },
      //每页显示条数切换加载数据
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      //页码切换加载数据
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getTableList();
      },
      //详情页面
      handleEdit(rowInfo){
        this.edit = rowInfo || {}
      },
      handleEditCallback(){
        this.edit=null;
        this.getTableList();
      },
      handleDate: function (row, column, cellValue) {
        if(cellValue != null && cellValue != "") {
          return new Date(cellValue).format('YYYY-MM-DD');
        }
      },
    },
    components:{
      WorkMould,
      TableColumnHeader,
      Retrieve,
      billListOfTicket
    },
    mounted() {
      let userId = localStorage.getItem("userId");
      this.userId = userId;
      this.getTableList();
      this.QJGetMounted();
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
