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
        <div style="display: inline-block;text-align: center" v-if="defaultOpen">
          <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询 </el-button>
          <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info"> &nbsp;清空 </el-button>
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
          <global-tootips style="float: right;margin: 5px;">
            <p>１、无权限用户仅可查询本部门或包括本部门的现场检测任务；若包含有多个部门检测任务，详情页会展示所有的任务；</p>
            <p>２、总套数指该上门检测任务下所有的器具的总数量；</p>
            <p>３、委托单位带有*表示该任务有特殊说明，您可将鼠标移至委托单位查询名称上查看；如有附件可在此下载；</p>
            <p>４、报价单/合同号<span style="color: red">红</span>,表示您尚未查看过该报价单；您可点击该编号进行查看；</p>
            <p>５、您可将鼠标移至检测部门查看该单所有的器具明细；可将鼠标移至委托单号查看该委托单下器具信息；</p>
            <p>６、您可点击委托单号打印现场委托单；</p>
           <!-- <p> 7、是否通知表示您是否已通知客户安排的信息，若开通短信功能您也可点击发送上门安排短信至客户。</p>-->
          </global-tootips>
        </span>
      </div>
      <el-table :max-height="QJTableMaxHeight" :data="tableData" border :span-method="objectSpanMethod"
                style="width: 100%" size="small" @cell-mouse-enter="handleMouseEnter" v-loading="loading"
                @cell-mouse-leave="handleMouseOut">
        <el-table-column fixed type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="companyName" label="委托单位" width="200"
                         :render-header="QJrenderHeader">
          <template slot-scope="scope">
            <companyPopover :rowInfo="scope.row" showContent="companyName"></companyPopover>
          </template>
        </el-table-column>
        <el-table-column prop="contractNumber" label="合同/报价单号" :render-header="QJrenderHeader">
          <template slot-scope="scope">
            <span v-if="scope.row.contractNo&&scope.row.quotationIsPrint=='0'" style="color: red"
                  @click='toViewContract(scope.row)'>{{scope.row.contractNo}}</span>
            <span v-else-if="scope.row.contractNo&&scope.row.quotationIsPrint=='1'"
                  @click='toViewContract(scope.row)'>{{scope.row.contractNo}}</span>
            <span v-else-if="!scope.row.contractNo&&scope.row.quotationIsPrint=='0'" style="color: red"
                  @click='toViewQuotation(scope.row)'>{{scope.row.quotationNo}}</span>
            <span v-else-if="!scope.row.contractNo&&scope.row.quotationIsPrint=='1'"
                  @click='toViewQuotation(scope.row)'>{{scope.row.quotationNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalSetNumber" label="总套数" width="80"
                         :render-header="QJrenderHeader"></el-table-column>
        <el-table-column prop="departName" label="检测部门" :render-header="QJrenderHeader">
          <template slot-scope="scope">
            <popover :rowInfo="scope.row" :columnsInfo="columnsInfo" :tableData="popverData"
                     showContent="departName"></popover>
          </template>
        </el-table-column>
        <el-table-column prop="detectionMethod" label="检测方式" :render-header="QJrenderHeader"></el-table-column>
        <el-table-column prop="orderNo" label="委托单号" :render-header="QJrenderHeader">
          <template slot-scope="scope">
            <popover :rowInfo="scope.row" :columnsInfo="columnsInfo" :tableData="popverData"
                     showContent="orderNo" @doSomethingElse="printOrder"></popover>
          </template>
        </el-table-column>
        <el-table-column prop="allPlanTime" label="计划日期" :render-header="QJrenderHeader"></el-table-column>
        <el-table-column prop="inspector" label="执行人" :render-header="QJrenderHeader"></el-table-column>
        <el-table-column prop="addTime" label="添加时间" :formatter="formatterTime"
                         :render-header="QJrenderHeader"></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-edit-outline" title="编辑"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:10px;text-align:center; float:right;">
      <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        :pageSizes="[10,20,30,40,50]"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">
      </mind-pagination>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';

  import Retrieve from '../../Retrieve'
  import WorkMould from '../../mould/WorkMould'
  import {ajaxRequest, ajaxSyncRequest, formatDate} from '../../util/base';
  import planDetail from './planDetail';
  import paramJson from './plan.js'    //同目录下json数据
  import popover from './popover.vue'    //器具列表tooltips
  import companyPopover from './companyPopover.vue';  //委托单位查看备注信息

  Vue.use(planDetail);

  export default {
    name: "plan-table-list",
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: '',
        orderType: '',
        tableData: [],
        fuzzySearch: 0,
        isSetting: 0,

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
        //器具tootips表头
        columnsInfo: [{nameCode: 'applianceActualName', title: '器具名称'},
          {nameCode: 'certificateType', title: '服务类型'},
          {nameCode: 'setNumber', title: '套数'},
          {nameCode: 'departName', title: '检测部门'},
          {nameCode: 'postName', title: '检测岗位'},
          {nameCode: 'model', title: '规格型号'},
          {nameCode: 'detectionMethod', title: '检测方式'},
          {nameCode: 'inspector', title: '执行人'},
          {nameCode: 'estimatedWorkload', title: '工作量'},
          {nameCode: 'status', title: '状态'}],
        //器具tooltips数据
        popverData: [],
        loading: false,
      }
    },
    methods: {
      handleSort: function (column, prop, order) {
        this.orderProperty = column['prop']
        if (column['order'] == 'descending') {
          this.orderType = 'desc'
        } else {
          this.orderType = 'asc'
        }
        this.getTableList()
      },
      //查询列表数据
      getTableList() {
        this.loading = true;
        ajaxRequest('get', 'back/plan/retrieve', {
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total: 0,
          sc: this.sc
        }, (res) => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
          }
          this.loading = false;
        })
      },
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      formatterTime: function (row, column) {
        return formatDate(row.addTime, 'YYYY-MM-DD');
      },
      //合并单元格
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
          var num = 0;
          var max = 0;
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].id === row.id && i >= rowIndex) {
              num++;
            }
            if (this.tableData[i].id === row.id) {
              max++;
            }
          }
          if (num > 1) {
            if (max === num) {
              return {
                rowspan: num, colspan: 1
              };
            } else {
              return {
                rowspan: 0, colspan: 0
              };
            }
          } else {
            if (max > 1) {
              return {
                rowspan: 0, colspan: 0
              };
            }
          }
        }
      },
      //跳转详情页面
      handleEdit(rowInfo) {
        this.$router.push({
          path: '/admin/213',
          query: {
            id: rowInfo.id,
          }
        })
      },
      //委托单打印
      printOrder(rowInfo) {
        this.printHtml("planOrderPrint", {planId: rowInfo.id, orderNo: rowInfo.orderNo});
      },
      //查看报价单
      toViewQuotation(data) {
        this.printHtml("quotationPrint", {quotationId: data.quotationId});
        if (data) {
          if ((data.id || data.id != '') && data.quotationIsPrint != '1') {
            ajaxRequest('put', 'back/plan/', {id: data.id, quotationIsPrint: '1'}, (res) => {
              if (res.code == 200) {
                this.getTableList();
              }
            })
          }
        }
      },
      //查看合同
      toViewContract(data) {
        console.log(data.contractId, data.quotationId, '打印合同')
        this.printHtml("contractPrint", {id: data.contractId, quotationId: data.quotationId});
        if (data) {
          if ((data.id || data.id != '') && data.quotationIsPrint != '1') {
            ajaxRequest('put', 'back/plan/', {id: data.id, quotationIsPrint: "1"}, (res) => {
              if (res.code == 200) {
                this.getTableList();
              }
            })
          }
        }
      },
      //单元格移入事件
      handleMouseEnter: function (row, column, cell, event) {
        //检测部门
        if (column.property == "departName") {
          ajaxRequest('get', 'back/plan/getApplianceListByPlanId', {planId: row.id}, (res) => {
            if (res.code == 200) {
              this.popverData = res.rows;
            }
          })
        }
        //委托单号
        if (column.property == "orderNo" && row.orderNo != null) {
          ajaxRequest('get', 'back/plan/getApplianceListByOrderNo', {orderNo: row.orderNo}, (res) => {
            if (res.code == 200) {
              this.popverData = res.rows;
            }
          })
        }
      },
      //单元格移出事件
      handleMouseOut: function (row, column, cell, event) {
        this.popverData = [];
      }
    },
    components: {
      planDetail,
      Retrieve,
      WorkMould,
      popover,
      companyPopover,
    },
    mounted() {
      let userId = localStorage.getItem("userId");
      this.userId = userId;
      this.getTableList();
      this.QJGetMounted();
    },
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
