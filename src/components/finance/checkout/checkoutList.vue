<template>
  <div style="position:relative;">
    <div v-if="defaultOpen">
      <Retrieve ref="retrieve-wapper"
                :rowsCondition='rowsCondition'
                :sortBy="sortBy"
                :order="order"
                :paramJson="paramJson"
                :retrieveCondition="retrieveCondition"
                :collectionInfo="collectionInfo"/>
    </div>
    <div >
      <div style="display: flex;justify-content: space-between; margin:10px 0px;">
        <span></span>
        <div style="display: inline-block;text-align: center">
          <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
          <el-button type="primary" class="el-icon-download but-dc">导出</el-button>
          <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning">清空</el-button>
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
            <global-tootips>
              <p>1、	本功能供查询所有的结账记录；</p>
              <p>2、	有权限人员可取消相应的记录；</p>
            </global-tootips>
          </span>
      </div>
      <div >
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%" @sort-change="handleSort" v-loading="loading">
          <el-table-column v-if="headObj.companyName" prop="companyName" label="开票单位" show-overflow-tooltip></el-table-column>
          <el-table-column v-if="headObj.money" prop="money" label="开票金额"></el-table-column>
          <el-table-column v-if="headObj.ticketCode" prop="ticketCode" label="发票号"></el-table-column>
          <el-table-column v-if="headObj.checkoutTime" prop="checkoutTime" label="结账日期" :formatter="handleDate"></el-table-column>
          <el-table-column v-if="headObj.creatorName" prop="creatorName" label="操作人" ></el-table-column>
          <el-table-column v-if="headObj.createTime" prop="createTime" label="操作时间" :formatter="handleDate" ></el-table-column>
          <el-table-column v-if="headObj.source" prop="source" label="类型">
            <template slot-scope="scope">
              <span v-if="scope.row.source==0" >无业务预开票</span>
              <span v-if="scope.row.source==1" >缴费单预开票</span>
              <span v-if="scope.row.source==2" >缴费单结账</span>
              <span v-if="scope.row.source==3" >其他条件结账</span>
              <span v-if="scope.row.source==4" >结账确认</span>
            </template>
          </el-table-column>
          <el-table-column  label="操作" fixed="right"  width="80px" >
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-edit-outline" title="编辑"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:10px;text-align:center;float:right;">
        <!-- TODO 案例 分页控件 mind-pagination  -->
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
    </div>
    <checkoutDetail v-if="!!edit" :checkoutInfo="edit" :callback="handleEditCallback"></checkoutDetail>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import {ajaxRequest, ajaxProxyRequest} from '../../util/base';
  import Retrieve from '../../Retrieve';
  import WorkMould from '../../mould/WorkMould';
  import TableColumnHeader from '../../Table/TableColumnHeader';
  import checkoutDetail from './checkoutDetail.vue'
  import paramJson from './checkoutListJs.js';    //同目录下json数据

  export default {
    name: "checkout-list",
    data(){
      return{
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 'c.id',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,
        isSetting: 0,  //控制个性化设置弹窗是否展示

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
        collectionInfo: [],
        edit: null,
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
      //获取列表事件
      getTableList(){
        this.loading=true
          ajaxRequest('get','back/checkRecord/retrieve',{
            fuzzySearch:1,
            page:this.page,
            rows:this.rows,
            orderProperty:this.orderProperty,
            orderType:this.orderType,
            total:0,
            sc:this.sc,
            status:0
          },(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
              this.multipleSelection=[];
            }
            this.loading=false
          })
      },
      //分页事件
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
      handleEdit(rowInfo) {
        this.edit=rowInfo;
      },
      //详情页面回调方法
      handleEditCallback(){
        this.edit=null;
        this.getTableList();
      },
      handleDelete (data) {
        let ids = data.map(function (v) {
          return v.id
        }).join(',')
        ajaxRequest('post', 'back/ticketApply/list/' + ids, {_method: 'delete'}, function (res) {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getTableList();
          } else {
            this.$message.error('删除失败');
          }
        }.bind(this))
      },
      //日期转换
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
      checkoutDetail
    },
    mounted() {
      let userId = localStorage.getItem("userId");
      this.userId = userId;
      this.getTableList();
      this.QJGetMounted();
    },
    created(){
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
  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }
  .el-icon-setting:hover {
    color: #3094e0 !important;
  }
</style>
