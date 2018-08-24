<!--
  进行中的任务(岗位)
  2018-7-31 10:59:39
 -->
<template>
  <div style="position:relative;" class="conductPost">
    <div style="margin-bottom:10px;" v-if="defaultOpen">
      <Retrieve ref="retrieve-wapper"
                :rowsCondition='rowsCondition'
                :sortBy="sortBy"
                :order="order"
                :paramJson="paramJson"
                :retrieveCondition="retrieveCondition"
                :collectionInfo="collectionInfo"
                logic="or"
      />
    </div>

    <div style="display: flex;justify-content: space-between;">
      <div style="width: 150px"></div>
      <div style="display: inline-block;text-align: center">
        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
        <el-button type="warning" class="el-icon-warning">导出</el-button>
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

             <div style="float:right;margin-top: 5px">
              <global-tootips>
                <p>1、	本功能列出分配给当前登录人的所有未完成任务，使用该节点通常需使用送检任务模块对送检任务进行分配，使用现场任务模块将现场检测任务进行分配，若未使用该两项功能本功能节点无法展现数据；</p>
                <p>2、	若您需要该功能但仍然不希望使用送检与现场模块进行任务分配，您可使用未完成任务（岗位）节点进行；</p>
                <p>3、本节点列出所有和当前登录人相关的未完成任务，可通过该节点快速申请异常、转入证书、记录添加界面、录入费用等操作；</p>
                <p>4、<span style="color: red">检测期限红色</span>：已超期；证书状态（A/B/C）A表示应出证书份数、Ｂ表未已出证书份数，C表示已批准证书份数；库房状态（D/E）D表示证书库房，E表示器具库房。</p>
              </global-tootips>
            </div>

          </span>
    </div>


    <div style="margin-top:10px;">
      <el-table :max-height="QJTableMaxHeight"
                :data="tableData"
                border
                style="width: 100%"
                @sort-change="handleSort"
                :max-row="true"
                @selection-change="handleSelectionChange">

        <el-table-column
          label="序号"
          type="index"
          width="60">
        </el-table-column>

        <el-table-column
          prop="registrationNo"
          label="登记号"
          :render-header="QJrenderHeader"
          show-overflow-tooltip
          key="registrationNo"
        >
        </el-table-column>

        <el-table-column
          prop="orderNo"
          label="委托单号"
          :render-header="QJrenderHeader"
          v-if="headObj.orderNo"
          show-overflow-tooltip
          key="orderNo"
        >
        </el-table-column>

        <el-table-column
          prop="companyName"
          label="委托单位"
          :render-header="QJrenderHeader"
          v-if="headObj.companyName"
          show-overflow-tooltip
          key="companyName"
        >
        </el-table-column>

        <el-table-column
          prop="certificateCompanyName"
          label="证书单位"
          :render-header="QJrenderHeader"
          v-if="headObj.certificateCompanyName"
          show-overflow-tooltip
          key="certificateCompanyName"
        >
        </el-table-column>

        <el-table-column
          prop="applianceName"
          label="器具名称"
          :render-header="QJrenderHeader"
          v-if="headObj.applianceName"
          show-overflow-tooltip
          key="applianceName"
        >
        </el-table-column>

        <el-table-column
          prop="postName"
          label="检测岗位"
          :render-header="QJrenderHeader"
          v-if="headObj.postName"
          show-overflow-tooltip
          key="postName"
        >
        </el-table-column>


        <el-table-column
          prop="orderSingleNo"
          label="流转单号"
          :render-header="QJrenderHeader"
          v-if="headObj.orderSingleNo"
          key="orderSingleNo"
        >
        </el-table-column>


        <el-table-column
          prop="setNumber"
          label="套数/退"
          :render-header="QJrenderHeader"
          v-if="headObj.setNumber"
          key="setNumber"
        >
          <template slot-scope="scope">
            {{scope.row.setNumber}}
            <span v-if="scope.row.returnNumber>0" style="color: red">/{{scope.row.returnNumber}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="pieceNumber"
          label="件/套"
          :render-header="QJrenderHeader"
          v-if="headObj.pieceNumber"
          key="pieceNumber"
        >
        </el-table-column>

        <el-table-column
          prop="certificateNumber"
          label="证书数量"
          :render-header="QJrenderHeader"
          v-if="headObj.certificateNumber"
          key="certificateNumber"
        >
        </el-table-column>

        <el-table-column
          prop="isUrgent"
          label="是否加急"
          :render-header="QJrenderHeader"
          v-if="headObj.isUrgent"
          key="isUrgent"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isUrgent==0">否</span>
            <span v-else-if="scope.row.isUrgent>0" style="color: red;">是</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="certificateType"
          label="服务类型"
          :render-header="QJrenderHeader"
          v-if="headObj.certificateType"
          key="certificateType"
        >
        </el-table-column>


        <el-table-column
          prop="serviceDate"
          label="受理日期"
          :render-header="QJrenderHeader"
          v-if="headObj.serviceDate"
          :formatter="dealDate"
          key="serviceDate"
        >
        </el-table-column>

        <el-table-column
          prop="entrustDate"
          label="委托日期"
          :render-header="QJrenderHeader"
          :formatter="dealDate"
          v-if="headObj.entrustDate"
          key="entrustDate"
        >
        </el-table-column>

        <el-table-column
          prop="detectionDeadline"
          label="检测期限"
          :render-header="QJrenderHeader"
          v-if="headObj.detectionDeadline"
          key="detectionDeadline"
        >
          <template slot-scope="scope">
            <span v-if="new Date(scope.row.detectionDeadline) > new Date()" style="color: red;">{{scope.row.detectionDeadline | formatterDate}}</span>
            <span v-else>{{scope.row.detectionDeadline | formatterDate}}</span>
          </template>
        </el-table-column>


        <el-table-column
          prop="totalActual"
          label="合计费用"
          :render-header="QJrenderHeader"
          v-if="headObj.totalActual"
          key="totalActual"
        >
        </el-table-column>

        <el-table-column
          prop="certificateNumber"
          label="证书状态"
          :render-header="QJrenderHeader"
          key="certificateNumber1"
        >
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.registrationNo!='合计'"
              placement="top-start"
              width="200"
              trigger="hover">
              <span slot="reference">A/B/C</span>
              <div>
                A应出:{{scope.row.certificateNumber}}<br>
                B已出:{{scope.row.certificateCount}}<br>
                C已批准:{{scope.row.approveCertificateCount}}
              </div>
            </el-popover>
          </template>
        </el-table-column>


        <el-table-column
          prop="certificateNumber"
          label="库房状态"
          :render-header="QJrenderHeader"
          key="certificateNumber2"
        >
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.registrationNo!='合计'"
              placement="top-start"
              width="200"
              trigger="hover">
              <span slot="reference">D/E</span>
              <div>
                <div>
                  D证书:{{scope.row|certificateStatus}}<br>
                  E器具:{{scope.row|applianceStatus}}<br>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>


        <el-table-column
          prop="returnFlag"
          label="异常状态"
          :render-header="QJrenderHeader"
          :formatter="dealDate"
          v-if="headObj.returnFlag"
          key="returnFlag"
        >
          <template slot-scope="scope"  v-if="scope.row.registrationNo!='合计'">
            <span v-if="scope.row.returnFlag==1" style="color: red">退检</span>
            <span v-else-if="scope.row.delayFlag==1" style="color: red">延期</span>
            <span v-else-if="scope.row.delayFlag==1 && scope.row.returnFlag==1" style="color: red">退检、延期</span>
            <span v-else></span>
          </template>
        </el-table-column>

        <el-table-column
          prop="totalActual"
          label="检测方式"
          :render-header="QJrenderHeader"
          v-if="headObj.totalActual"
          key="totalActual"
        >
        </el-table-column>

        <el-table-column
          prop="detectionMethod"
          label="检测方式"
          v-if="headObj.detectionMethod"
          :render-header="QJrenderHeader"
          :formatter="detectionMethodFormatter"
          key="detectionMethod"
        >
        </el-table-column>

        <el-table-column
          prop="taskSource"
          label="任务来源"
          v-if="headObj.taskSource"
          :render-header="QJrenderHeader"
          key="taskSource"
        >
        </el-table-column>

        <el-table-column
          prop="institutionalNature"
          label="机构性质"
          v-if="headObj.institutionalNature"
          :render-header="QJrenderHeader"
          key="institutionalNature"
        >
        </el-table-column>

        <el-table-column
          prop="creditCode"
          label="统一社会信用代码"
          v-if="headObj.creditCode"
          :render-header="QJrenderHeader"
          key="creditCode"
        >
        </el-table-column>

        <el-table-column
          prop="contractNo"
          label="合同号"
          :render-header="QJrenderHeader"
          v-if="headObj.contractNo"
          show-overflow-tooltip
          key="contractNo"
        >
        </el-table-column>

        <el-table-column
          prop="contractSignatory"
          label="合同签署人"
          v-if="headObj.contractSignatory"
          :render-header="QJrenderHeader"
          key="contractSignatory"
        >
        </el-table-column>

        <el-table-column
          prop="certificateFirstPrintTime"
          label="证书打印日期"
          :formatter="dealDate"
          v-if="headObj.certificateFirstPrintTime"
          :render-header="QJrenderHeader"
          key="certificateFirstPrintTime"
        >
        </el-table-column>

        <el-table-column
          prop="address"
          label="委托单位地址"
          v-if="headObj.address"
          :render-header="QJrenderHeader"
          key="address"
        >
        </el-table-column>

        <el-table-column
          prop="administrativeArea"
          label="行政区划"
          v-if="headObj.administrativeArea"
          :render-header="QJrenderHeader"
          key="administrativeArea"
        >
        </el-table-column>

        <el-table-column
          prop="contacter"
          label="联系人"
          v-if="headObj.contacter"
          :render-header="QJrenderHeader"
          key="contacter"
        >
        </el-table-column>

        <el-table-column
          prop="telephone"
          label="联系电话"
          v-if="headObj.telephone"
          :render-header="QJrenderHeader"
          key="telephone"
        >
        </el-table-column>

        <el-table-column
          prop="mobilePhone"
          label="手机号码"
          v-if="headObj.mobilePhone"
          :render-header="QJrenderHeader"
          key="mobilePhone"
        >
        </el-table-column>

        <el-table-column
          prop="specialRequirement"
          label="整单备注"
          v-if="headObj.specialRequirement"
          :render-header="QJrenderHeader"
          key="specialRequirement"
        >
        </el-table-column>

        <el-table-column
          prop="model"
          label="型号规格"
          v-if="headObj.model"
          :render-header="QJrenderHeader"
          key="model"
        >
        </el-table-column>

        <el-table-column
          prop="detectionParameter"
          label="检测参数"
          v-if="headObj.detectionParameter"
          :render-header="QJrenderHeader"
          key="detectionParameter"
        >
        </el-table-column>

        <el-table-column
          prop="factoryNo"
          label="出厂编号"
          v-if="headObj.factoryNo"
          :render-header="QJrenderHeader"
          key="factoryNo"
        >
        </el-table-column>

        <el-table-column
          prop="equipmentNo"
          label="设备编号"
          v-if="headObj.equipmentNo"
          :render-header="QJrenderHeader"
          key="equipmentNo"
        >
        </el-table-column>

        <el-table-column
          prop="manufacturer"
          label="制造厂商"
          v-if="headObj.manufacturer"
          :render-header="QJrenderHeader"
          key="manufacturer"
        >
        </el-table-column>

        <el-table-column
          prop="accessory"
          label="器具附件"
          v-if="headObj.accessory"
          :render-header="QJrenderHeader"
          key="accessory"
        >
        </el-table-column>

        <el-table-column
          prop="powerTypes"
          label="电源类型"
          v-if="headObj.powerTypes"
          :render-header="QJrenderHeader"
          key="powerTypes"
        >
        </el-table-column>

        <el-table-column
          prop="isRepair"
          label="是否调修"
          v-if="headObj.isRepair"
          :render-header="QJrenderHeader"
          key="isRepair"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isRepair==1">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="isDoubleNumber"
          label="是否双编号"
          v-if="headObj.isDoubleNumber"
          :render-header="QJrenderHeader"
          :formatter="formatterYesOrNo"
          key="isDoubleNumber"
        >
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注"
          v-if="headObj.remark"
          :render-header="QJrenderHeader"
          key="remark"
        >
        </el-table-column>

        <el-table-column
          prop="isCompulsoryVerify"
          label="是否强检"
          v-if="headObj.isCompulsoryVerify"
          :render-header="QJrenderHeader"
          :formatter="formatterYesOrNo"
          key="isCompulsoryVerify"
        >
        </el-table-column>

        <el-table-column
          prop="applianceUe"
          label="器具用途"
          v-if="headObj.applianceUe"
          :render-header="QJrenderHeader"
          key="applianceUe"
        >
        </el-table-column>


        <el-table-column
          label="操作"
          fixed="right"
          width="80px">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.registrationNo!='合计'"
              placement="top-start"
              trigger="hover">
              <el-button type="info" plain slot="reference">操作</el-button>
              <div>
                <el-button type="info" plain :disabled="scope.row.feeStatus==1" @click="toChargeAdd(scope.row.registrationNo)">费用录入</el-button><br>
                <el-button type="info" plain>编制记录</el-button><br>
                <el-button type="info" plain @click="toAddCertificate(scope.row.registrationNo)">编制证书</el-button><br>
                <el-button type="info" plain  @click="toAbnormal(scope.row.registrationNo)">申请异常</el-button>
              </div>
            </el-popover>
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
    <chargeAdd v-if="!!edit" :data="edit" :callback="handleEditCallback"></chargeAdd>
  </div>

</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import {ajaxRequest} from '../../util/base'
  import Retrieve from '../../Retrieve'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import paramJson from './paramPost'
  import chargeAdd from '../charge/chargeAdd';


  export default {
    name: 'parameter-table',
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: '',
        orderType: '',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,
        edit: null,


        /*高级检索相关项*/
        isSetting: 0,
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
      }
    },
    filters: {
      //证书库房状态
      certificateStatus: function (row) {
        //0默认状态  1.预留  2. 预留 3.已入库  4.已出库
        if(row.certificateWarehouseFlag==0){
          return '默认状态'
        }else if(row.certificateWarehouseFlag==3){
          return '已入库'
        }else if(row.certificateWarehouseFlag==4){
          return '已出库'
        }
      },
      //样品库房状态
      applianceStatus:function(row){
        if(row.detectionMethod==0){
          return 'No'
        }else if(row.detectionMethod==1){
          //器具库房状态 0.送检在收发（现场的无样品）  1.未检在实验室 2.已检在实验室  3.已入库    4.已出库
          if(row.applianceWarehouseFlag==0){
            return '送检在收发'
          }else if(row.applianceWarehouseFlag==1){
            return '未检在实验室'
          }else if(row.applianceWarehouseFlag==2){
            return '已检在实验室'
          }else if(row.applianceWarehouseFlag==3){
            return '已入库'
          }else if(row.applianceWarehouseFlag=4){
            return '已出库';
          }else{
            return '';
          }
        }
      },
      //时间 过滤器
      formatterDate:function(date){
        if(date){
          return new Date(date).format('YYYY-MM-DD')
        }else{
          return ''
        }
      }
    },
    methods: {
      //添加证书
      toAddCertificate(registrationNo){
        if(registrationNo){
          this.$router.push({
            path: '/admin/500',
            query: {
              registrationNo: registrationNo
            }
          })
        }
      },
      //异常申请
      toAbnormal(registrationNo){
        if(registrationNo){
          this.$router.push({
            path: '/admin/625',
            query: {
              registrationNo: registrationNo
            }
          })
        }
      },
      //费用录入
      toChargeAdd(registrationNo){
        if(registrationNo){
          ajaxRequest("get", "back/entrustSjd/getEntrustSjdDetails",{registrationNo:registrationNo,feeStatus:0,type:"1"}, res => {
            if (res.code === 200) {
              if(res.rows.length > 0){
                this.edit=res.rows[0];
              }else{
                this.$message.error("此登记号不允许录入费用！");
                $('input').eq(0).focus();
              }
            }else{
              this.$message.error("此登记号不允许录入费用！");
              $('input').eq(0).focus();
            }
          });
        }
      },
      //费用回调
      handleEditCallback(){
        this.edit=null;
        this.getTableList()
      },

      //列格式化  0 否  1 是
      formatterYesOrNo:function(row,column,cellValue){
        if(cellValue==1){
          return '是'
        }else if(cellValue==0){
          return '否'
        }else {
          return '';
        }
      },
      //检测方式格式化
      detectionMethodFormatter: function (row, column) {
        if (row.detectionMethod == 1) {
          return '送检'
        } else if (row.detectionMethod == 0) {
          return '上门'
        }
      },
      //时间格式化
      dealDate: function (row, column, cellValue) {
        if(cellValue){
          return new Date(cellValue).format('YYYY-MM-DD')
        }else{
          return '';
        }
      },
      handleSort: function (column, prop, order) {
        this.orderProperty = column['prop']
        if (column['order'] == 'descending') {
          this.orderType = 'desc'
        } else {
          this.orderType = 'asc'
        }
        this.getTableList()
      },
      personalSetting(flag) {
        /* 控制显示个性化设置的弹窗 isSetting 默认false */
        this.isSetting = flag
        !flag ? this.getTemplate() : null
      },
      getTableList() {
        ajaxRequest('get', 'back/secondAllot/getConductPost', {
          fuzzySearch: 1,
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
        })
      },
      handleToggleTheme(color) {
        this.$store.commit('toggleTheme', color)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size
        this.getTableList()
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage
        this.getTableList()
      },
      handleEdit(rowInfo) {
        this.$router.push({
          path: '/admin/252',
          query: {
            id: rowInfo.id
          }
        })
      },
    },
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      chargeAdd
    },
    mounted() {
      this.getTableList();
      this.QJGetMounted();
    }
  }
</script>

<style type="text/css" lang="scss">
  .conductPost{
    .el-icon-setting {
      background: none !important;
      border: none !important;
      color: #3094e0 !important;
    }

    .el-icon-setting:hover {
      color: #3094e0 !important;
    }
  }
</style>
