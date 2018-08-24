<template>
  <div>
    <!-- 查询页面 start -->
    <div style="position:relative;" v-show="!registrationNo">
      <div style="margin-bottom:10px;"  v-if="defaultOpen">
        <Retrieve  ref="retrieve-wapper"
                   :rowsCondition='rowsCondition'
                   :sortBy="sortBy"
                   :order="order"
                   :paramJson="paramJson"
                   :retrieveCondition="retrieveCondition"
                   :collectionInfo="collectionInfo"/>
      </div>
      <div>
        <div style="display: flex;justify-content: space-between;">
          <div style="display: inline-block;text-align: center;margin:auto">
            <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
            <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning" >&nbsp;清空</el-button>
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
          <div class="el-icon-info shuoming" >
            <el-row class="el-sm">
              <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">事项说明</p>
                <dl style="padding:6px 10px; ">
              <p>1、此节点用于查询历史结账数据；</p>
              <p>2、本系统暂不提供历史数据解除结账，如需操作请联系系统管理员。</p>
                </dl>
            </el-row>
          </div>
          </span>
        </div>
        <div>
          <div style="margin-top:10px;">
            <el-table :data="tableData" :max-height="QJTableMaxHeight" :max-row="true" border style="width: 100%;" @sort-change="handleSort" @selection-change="handleSelectionChange" v-loading="loading">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="registrationNo" label="登记号" :render-header="QJrenderHeader">
                 <template slot-scope="scope">
                   <!-- 未录费，红色 -->
                  <span v-if="scope.row.feeStatus == 0" style="color:red">{{scope.row.registrationNo}}</span>
                  <span v-else>{{scope.row.registrationNo}}</span>
              </template>
              </el-table-column>
              <el-table-column  prop="companyName" label="委托单位" :render-header="QJrenderHeader" >
                <template slot-scope="scope">
                   <!-- 未到账，红色 -->
                  <companyPopover :rowInfo="scope.row" showContent="companyName">

                  </companyPopover>
                </template>
              </el-table-column>
              <el-table-column  prop="applianceName" label="器具名称" :render-header="QJrenderHeader">
                 <template slot-scope="scope">
                  <span v-if="scope.row.applianceWarehouseFlag >= 3 &&  scope.row.certificateWarehouseFlag >= 3" style="color:black">{{scope.row.applianceName}}</span>
                  <span v-else-if="scope.row.applianceWarehouseFlag < 3 &&  scope.row.certificateWarehouseFlag < 3" style="color:red">{{scope.row.applianceName}}</span>
                  <span v-else-if="scope.row.applianceWarehouseFlag >= 3" style="color:blue">{{scope.row.applianceName}}</span>
                  <span v-else-if="scope.row.certificateWarehouseFlag >= 3" style="color:purple">{{scope.row.applianceName}}</span>
              </template>
              </el-table-column>
              <el-table-column  prop="departName" label="检测部门" :render-header="QJrenderHeader">

                 <template slot-scope="scope">
                  <span v-if="scope.row.returnFlag == 1" style="color:red">{{scope.row.departName}}</span>
                  <span v-else>{{scope.row.departName}}</span>
              </template>
              </el-table-column>
              <el-table-column  prop="postName" label="检测岗位" :render-header="QJrenderHeader">

                <template slot-scope="scope">
                  <span v-if="scope.row.delayFlag == 1" style="color:red">{{scope.row.postName}}</span>
                  <span v-else>{{scope.row.postName}}</span>
              </template>
              </el-table-column>
              <el-table-column prop="setNumber" label="套数" :render-header="QJrenderHeader">
                <template slot-scope="scope">
                  {{scope.row.setNumber}}<span v-if="scope.row.returnNumber > 0" style="color:red">/{{scope.row.returnNumber}}</span>
              </template>
              </el-table-column>
              <el-table-column v-if="headObj.pieceNumber" prop="pieceNumber" label="件/套" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.certificateNumber" prop="certificateNumber" label="证书数量" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.serviceDate" prop="serviceDate" label="受理日期" :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
              <el-table-column v-if="headObj.entrustDate" prop="entrustDate" label="委托日期" :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
              <el-table-column v-if="headObj.detectionDeadline" prop="detectionDeadline" label="检测期限" :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
              <el-table-column v-if="headObj.settlementDate" prop="settlementDate" label="结算日期" :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
              <el-table-column v-if="headObj.settleAccountsDate" prop="settleAccountsDate" label="结账日期" :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
              <el-table-column v-if="headObj.totalActual" prop="totalActual" label="费用合计" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.jdfActual" prop="jdfActual" label="检测费" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.isUrgents" prop="isUrgents" label="是否加急" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.certificateType" prop="certificateType" label="服务类型" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.fjfActual" prop="fjfActual" label="附加费" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.xlfActual" prop="xlfActual" label="修理费" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.jjfActual" prop="jjfActual" label="加急费" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.fwfActual" prop="fwfActual" label="服务费" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.qtfActual" prop="qtfActual" label="其他费" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.workloadActual" prop="workloadActual" label="工作量" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.intensiveWorkloadActual" prop="intensiveWorkloadActual" label="强检工作量" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.orderNo" prop="orderNo" label="委托单编号" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.orderSingleNo" prop="orderSingleNo" label="流转单号" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.finishDate" prop="finishDate" label="完成日期" :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
              <el-table-column v-if="headObj.discount" prop="discount" label="折扣" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.detectionMethod" prop="detectionMethod" label="检测方式" :render-header="QJrenderHeader" :formatter="detectionMethod"></el-table-column>
              <el-table-column v-if="headObj.taskSource" prop="taskSource" label="任务来源" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.institutionalNature" prop="institutionalNature" label="机构性质" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.creditCode" prop="creditCode" label="统一社会信用代码" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.address" prop="contractNo" label="合同号" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.address" prop="contractSignatory" label="合同签署人" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.certificateFirstPrintTime" prop="certificateFirstPrintTime" label="证书打印日期" :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
              <el-table-column v-if="headObj.address" prop="address" label="委托单位地址" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.contacter" prop="administrativeArea" label="行政区划" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.contacter" prop="contacter" label="联系人" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.telephone" prop="telephone" label="联系电话" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.mobilePhone" prop="mobilePhone" label="手机号码" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.specialRequirement" prop="specialRequirement" label="整单备注" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.model" prop="model" label="型号规格" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.detectionParameter" prop="detectionParameter" label="检测参数" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.factoryNo" prop="factoryNo" label="出厂编号" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.equipmentNo" prop="equipmentNo" label="设备编号" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.manufacturer" prop="manufacturer" label="制造厂商" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.accessory" prop="accessory" label="器具附件" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.powerTypess" prop="powerTypess" label="电源类型" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.isRepairs" prop="isRepairs" label="是否调修" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.isDoubleNumbers" prop="isDoubleNumbers" label="是否双编号" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.subcontractAreaName" prop="subcontractAreaName" label="分包区域" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.remark" prop="remark" label="备注" :render-header="QJrenderHeader"></el-table-column>
              <el-table-column v-if="headObj.isCompulsoryVerifys" prop="isCompulsoryVerifys" label="是否强检" :render-header="QJrenderHeader" :formatter="yesOrNo"></el-table-column>
              <el-table-column v-if="headObj.applianceUse" prop="applianceUse" label="器具用途" :render-header="QJrenderHeader"></el-table-column>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import {ajaxRequest} from '../../util/base'
  import Retrieve from '../../Retrieve'
  import $ from 'jquery'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import entrustQueryParam from './js/historyCheckEntrustQueryParam'
  import companyPopover from '../../business/plan/companyPopover'

  export default {
    name: 'historyCheckentrustQuery',
    data () {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 'trunc(wtd.service_date)',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,
        isSetting: 0,//控制个性化设置弹窗是否展示
        edit: null,//控制编辑弹窗是否展示
        rowsCondition: entrustQueryParam, // 默认同目录下json数据 会依据模板改变
        paramJson: entrustQueryParam, // 同目录下json数据 常量
        moduleList: [], // 模板列表
        templateValue: '', // 当前选择的模板id
        sortBy: '', // 排序字段
        order: '', // desc降序 asc升序
        headObj: {}, // 表头显示对象 {category:true}
        defaultOpen: true,//默认开启高级查询

        allModules: {}, //所有模板
        resultCondition: [],
        retrieveCondition: [],
        collectionInfo:[],
        loading:false,
        registrationNo:'', // 登记号
      }
    },
    methods: {
      companyTypeName: function(row, column) {
      return '('+row.companyType+')'+row.companyName;
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
        this.loading=true
        // if (this.searchKey || this.fuzzySearch === 1) {
          ajaxRequest('get', 'back/entrustSjd/historyCheckEntrustQuery', {
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            orderType: this.orderType,
            total: 0,
            sc: this.sc
          }, (res) => {
            if (res.code === 200) {
              this.tableData = res.rows
              this.total = res.total
              this.multipleSelection = []
            }
            this.loading=false
          })
        // }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handlePageSizeChange (size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList()
      },
      handleCurrentPageChange (currentPage) {
        this.page = currentPage
        this.getTableList()
      },
      dealDate: function (row, column, cellValue) {
        if(cellValue){
        return new Date(cellValue).format('YYYY-MM-DD')
        }else{
          return '';
        }
      },
    },
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      companyPopover
    },
    mounted () {
      this.getTableList();
      this.QJGetMounted();
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
  .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;}
  .shuoming::after{
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

  .el-sm{background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 1px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -302px;
    word-break: break-all;
    margin-top: 18px;
    padding: 4px 5px;width:320px;
    font-size: 14px;
    opacity: 50;
    float: right; -webkit-transition: all 0.8s;transition: all 0.8s;}

  .shuoming .el-sm{
    display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
  }
  .el-button--warning:hover{
    background:#ff9c9c!important; border:1px solid #ff9c9c!important;

  }
</style>
