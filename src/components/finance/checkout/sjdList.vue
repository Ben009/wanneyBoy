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
    <div>
      <div style="display: flex;justify-content: space-between; margin:10px 0px;">
        <span></span>
        <div style="display: inline-block;text-align: center">
          <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
          <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning">&nbsp;清空</el-button>
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
            <global-tootips>
              <p>1、	本功能适用于不制造缴费单进行结账操作的功能；需结账的登记号需满足：已完成、未结账、未制作缴费单、未处于异常审核或折扣审核状态中；未完成需结账的记录可通过委托查询进行手工完成后结账；</p>
              <p>2、	若无需结账的记录，可去掉勾中的复选框；单次结账最多支持500个登记号；</p>
              <p>3、	套数出现A/B时，B表示退件数量；</p>
              <p>4、	系统默认第一个登记号的信息填入开票信息，可修改；</p>
              <p>5、	本批次结账若需开具多张发票，可点击“+－”按钮进行；</p>
              <p>6、	若客户通过银行转账，可使用：关联到款按钮关联转账记录；</p>
              <p>7、	读取功能为：系统以本台计算机上一次的发票号码加1默认为本次发票号码，若不正确可修改；</p>
            </global-tootips>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                       :handleMouldBack="QJHandleMouldBack"/>
          </span>
      </div>
      <div>
        <el-table :data="tableData" :max-height="QJTableMaxHeight" ref="table" border style="width: 100%;table-layout: fixed;" @sort-change="handleSort"
                  @select-all='checkAll'>
          <el-table-column type="selection" width="40">
            <template slot-scope="scope">
              <el-tooltip :disabled="!(scope.row.PROCESSNUM>0||scope.row.CHARGEAPPLYNUM>0)"
                          :content="scope.row.CHARGEAPPLYNUM>0?'折扣申请流程中':'异常申请流程中'"
                          placement="bottom" effect="light">
                <el-checkbox-group v-model="multipleSelection">
                  <el-checkbox :label="scope.row" :disabled="scope.row.PROCESSNUM>0||scope.row.CHARGEAPPLYNUM>0">&nbsp;</el-checkbox>
                </el-checkbox-group>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="headObj.ORDER_NO" prop="ORDER_NO" label="委托单号" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.COMPANY_NAME" prop="COMPANY_NAME" label="委托单位" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.CONTRACT_NO" prop="CONTRACT_NO" label="合同号" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.REGISTRATION_NO" prop="REGISTRATION_NO" label="登记号" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.ORDER_SINGLE_NO" prop="ORDER_SINGLE_NO" label="流转单号" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.APPLIANCE_NAME" prop="APPLIANCE_NAME" label="器具名称" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.SET_NUMBER" prop="SET_NUMBER" label="套数" :render-header="QJrenderHeader">
            <template slot-scope="scope">
              <span v-if="scope.row.RETURN_NUMBER>0">{{scope.row.SET_NUMBER}}/<span style="color: red">{{scope.row.RETURN_NUMBER}}</span></span>
              <span v-else>{{scope.row.SET_NUMBER}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="headObj.ENTRUST_DATE" prop="ENTRUST_DATE" label="委托日期" :render-header="QJrenderHeader">
            <template slot-scope="scope">
              {{scope.row.ENTRUST_DATE | dateyymmdd}}
            </template>
          </el-table-column>
          <el-table-column v-if="headObj.FINISH_DATE" prop="FINISH_DATE" label="完成日期" :render-header="QJrenderHeader">
            <template slot-scope="scope">
              {{scope.row.FINISH_DATE | dateyymmdd}}
            </template>
          </el-table-column>
          <el-table-column v-if="headObj.IS_COMPULSORY_VERIFY" prop="IS_COMPULSORY_VERIFY" label="是否强检" :render-header="QJrenderHeader">
            <template slot-scope="scope">
              <span v-if="scope.row.IS_COMPULSORY_VERIFY=='0'">否</span>
              <span v-if="scope.row.IS_COMPULSORY_VERIFY=='1'">是</span>
            </template>
          </el-table-column>
          <el-table-column v-if="headObj.DEPART_NAME" prop="DEPART_NAME" label="检测部门" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.POST_NAME" prop="POST_NAME" label="检测岗位" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.COMMISSIONER_NAME" prop="COMMISSIONER_NAME" label="检测人员" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.TASK_SOURCE" prop="TASK_SOURCE" label="任务来源" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.BUSINESS_STAFF" prop="BUSINESS_STAFF" label="业务员" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.APPLIANCE_WAREHOUSE_FLAG" prop="APPLIANCE_WAREHOUSE_FLAG" label="样品库房状态" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.CERTIFICATE_WAREHOUSE_FLAG" prop="CERTIFICATE_WAREHOUSE_FLAG" label="证书库房状态" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.IS_DISCOUNT" prop="IS_DISCOUNT" label="是否允许打折" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.JDF_ACTUAL" prop="JDF_ACTUAL" :label="getLabel.JDF_ACTUAL" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.FJF_ACTUAL" prop="FJF_ACTUAL" :label="getLabel.FJF_ACTUAL" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.XLF_ACTUAL" prop="XLF_ACTUAL" :label="getLabel.XLF_ACTUAL" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.JJF_ACTUAL" prop="JJF_ACTUAL" :label="getLabel.JJF_ACTUAL" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.FWF_ACTUAL" prop="FWF_ACTUAL" :label="getLabel.FWF_ACTUAL" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.QTF_ACTUAL" prop="QTF_ACTUAL" :label="getLabel.QTF_ACTUAL" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.WORKLOAD_ACTUAL" prop="WORKLOAD_ACTUAL" :label="getLabel.WORKLOAD_ACTUAL" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.INTENSIVE_WORKLOAD_ACTUAL" prop="INTENSIVE_WORKLOAD_ACTUAL" :label="getLabel.INTENSIVE_WORKLOAD_ACTUAL" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.TOTAL_ACTUAL" prop="TOTAL_ACTUAL" :label="getLabel.TOTAL_ACTUAL" :render-header="QJrenderHeader"></el-table-column>
          <el-table-column v-if="headObj.DISCOUNT" prop="DISCOUNT" label="折扣" :render-header="QJrenderHeader"></el-table-column>
        </el-table>
      </div>
      <div style="font-size: 16px;font-weight: bold;margin-top: 10px;padding-left: 4%">
        <el-row>
          <el-col :span="4" style="font-size: 16px;">
            套数:{{totalFee.SET_NUMBER}}
            <span v-if="totalFee.RETURN_NUMBER>0">/<span style="color: red">{{totalFee.RETURN_NUMBER}}</span></span>
          </el-col>
          <el-col :span="5" style="font-size: 16px;">
            {{getLabel.JDF_ACTUAL}}:{{totalFee.JDF_ACTUAL}}
          </el-col>
          <el-col :span="5" style="font-size: 16px;">
            {{getLabel.FJF_ACTUAL}}:{{totalFee.FJF_ACTUAL}}
          </el-col>

          <el-col :span="5" style="font-size: 16px;">
            {{getLabel.XLF_ACTUAL}}:{{totalFee.XLF_ACTUAL}}
          </el-col>
          <el-col :span="5" style="font-size: 16px;">
            {{getLabel.JJF_ACTUAL}}:{{totalFee.JJF_ACTUAL}}
          </el-col>
          <el-col :span="4" style="font-size: 16px;">
            {{getLabel.FWF_ACTUAL}}:{{totalFee.FWF_ACTUAL}}
          </el-col>
          <el-col :span="5" style="font-size: 16px;">
            {{getLabel.QTF_ACTUAL}}:{{totalFee.QTF_ACTUAL}}
          </el-col>
          <el-col :span="5" style="font-size: 16px;">
            {{getLabel.WORKLOAD_ACTUAL}}:{{totalFee.WORKLOAD_ACTUAL}}
          </el-col>
          <el-col :span="5" style="font-size: 16px;">
            {{getLabel.INTENSIVE_WORKLOAD_ACTUAL}}:{{totalFee.INTENSIVE_WORKLOAD_ACTUAL}}
          </el-col>
          <el-col :span="5" style="font-size: 16px;">
            {{getLabel.TOTAL_ACTUAL}}:{{totalFee.TOTAL_ACTUAL}}
          </el-col>
        </el-row>
      </div>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import {ajaxRequest,formatDate} from '../../util/base'
  import Retrieve from '../../Retrieve'
  import $ from 'jquery'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import paramJson from './sjdList.js'
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    name: 'entrustWtd-list',
    props: {
      getTotalBalance: {
        type: Function,
        require: true
      },
    },
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 'e.REGISTRATION_NO',
        orderType: '',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 1,
        isSetting: 0,
        edit: null,
        money: 0,//结账金额

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
        totalFee:{
          JDF_ACTUAL:0,
          FJF_ACTUAL:0,
          XLF_ACTUAL:0,
          JJF_ACTUAL:0,
          FWF_ACTUAL:0,
          QTF_ACTUAL:0,
          WORKLOAD_ACTUAL:0,
          INTENSIVE_WORKLOAD_ACTUAL:0,
          TOTAL_ACTUAL:0,
          SET_NUMBER:0,
          RETURN_NUMBER:0
        }
      }
    },
    methods: {
      //全选事件
      checkAll: function (selection) {
        this.multipleSelection = [];
        selection.forEach((e) => {
          if (e.PROCESSNUM > 0 || e.CHARGEAPPLYNUM > 0) {
          } else {
            this.multipleSelection.push(e)
          }
        });
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

      //获取列表方法
      getTableList() {
        if (this.searchKey || this.fuzzySearch === 1) {
          ajaxRequest('get', 'back/bill/getSjdListForOtherCheckout', {
            fuzzySearch: 1,
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
              this.multipleSelection = [];
              this.$nextTick(_ => {
                this.tableData.forEach(row => {
                  this.$refs.table.toggleRowSelection(row, true)
                })
                this.checkAll(this.tableData);
              });

            }
          })
        }
      },
      //分页事件
      handleSelectionChange() {
        let ticketCompany = '', djh = '', totalActual = Number(0);
        if (this.multipleSelection.length > 0) {
          ticketCompany = this.multipleSelection[0].COMPANY_NAME;
          for (let i = 0; i < this.multipleSelection.length; i++) {
            djh += this.multipleSelection[i].REGISTRATION_NO + ";";
            totalActual += Number(this.multipleSelection[i].TOTAL_ACTUAL);
          }
        }
        this.$emit('change-ticket-name', this.multipleSelection[0], djh, totalActual);

        this.money=0;
        for(var i=0;i<this.multipleSelection.length;i++){
          var rowMoney=this.multipleSelection[i].TOTAL_ACTUAL;
          if(rowMoney!=null||rowMoney!=""){
            this.money+=Number(rowMoney);
          }
        }
        this.getTotalBalance(this.money);

        this.totalFee.JDF_ACTUAL = 0;
        this.totalFee.FJF_ACTUAL = 0;
        this.totalFee.XLF_ACTUAL = 0;
        this.totalFee.JJF_ACTUAL = 0;
        this.totalFee.FWF_ACTUAL = 0;
        this.totalFee.QTF_ACTUAL = 0;
        this.totalFee.WORKLOAD_ACTUAL = 0;
        this.totalFee.INTENSIVE_WORKLOAD_ACTUAL = 0;
        this.totalFee.TOTAL_ACTUAL = 0;
        this.totalFee.SET_NUMBER = 0;
        this.totalFee.RETURN_NUMBER = 0;

        for(var m=0;m<this.multipleSelection.length;m++){
          this.totalFee.JDF_ACTUAL = parseFloat(parseFloat(this.totalFee.JDF_ACTUAL) + parseFloat(this.multipleSelection[m].JDF_ACTUAL)).toFixed(2);
          this.totalFee.FJF_ACTUAL = parseFloat(parseFloat(this.totalFee.FJF_ACTUAL) + parseFloat(this.multipleSelection[m].FJF_ACTUAL)).toFixed(2);
          this.totalFee.XLF_ACTUAL = parseFloat(parseFloat(this.totalFee.XLF_ACTUAL) + parseFloat(this.multipleSelection[m].XLF_ACTUAL)).toFixed(2);
          this.totalFee.JJF_ACTUAL = parseFloat(parseFloat(this.totalFee.JJF_ACTUAL) + parseFloat(this.multipleSelection[m].JJF_ACTUAL)).toFixed(2);
          this.totalFee.FWF_ACTUAL = parseFloat(parseFloat(this.totalFee.FWF_ACTUAL) + parseFloat(this.multipleSelection[m].FWF_ACTUAL)).toFixed(2);
          this.totalFee.QTF_ACTUAL = parseFloat(parseFloat(this.totalFee.QTF_ACTUAL) + parseFloat(this.multipleSelection[m].QTF_ACTUAL)).toFixed(2);
          this.totalFee.WORKLOAD_ACTUAL = parseFloat(parseFloat(this.totalFee.WORKLOAD_ACTUAL) + parseFloat(this.multipleSelection[m].WORKLOAD_ACTUAL)).toFixed(2);
          this.totalFee.INTENSIVE_WORKLOAD_ACTUAL = parseFloat(parseFloat(this.totalFee.INTENSIVE_WORKLOAD_ACTUAL) + parseFloat(this.multipleSelection[m].INTENSIVE_WORKLOAD_ACTUAL)).toFixed(2);
          this.totalFee.TOTAL_ACTUAL = parseFloat(parseFloat(this.totalFee.TOTAL_ACTUAL) + parseFloat(this.multipleSelection[m].TOTAL_ACTUAL)).toFixed(2);
          this.totalFee.SET_NUMBER = this.totalFee.SET_NUMBER+ this.multipleSelection[m].SET_NUMBER;
          this.totalFee.RETURN_NUMBER = this.totalFee.RETURN_NUMBER+ this.multipleSelection[m].RETURN_NUMBER;
        }
      },
      //分页事件
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size
        this.getTableList()
      },
      //分页事件
      handleCurrentPageChange(currentPage) {
        this.page = currentPage
        this.getTableList()
      },
      //是否强检
      isCompulsoryVerifyFormat(row, column) {
        let controlled = {0: '否', 1: '是'}
        return controlled[row.IS_COMPULSORY_VERIFY]
      },
      //是否打折
      isDiscoutFormat(row, column) {
        let controlled = {0: '否', 1: '是'}
        return controlled[row.IS_DISCOUNT]
      },
      chooseAll(){//全选
        for(let i=0;i<this.tableData.length;i++){
          this.$refs.table.toggleRowSelection(this.tableData[i],true);
        }
      },
    },
    watch: {
      multipleSelection() {
        this.handleSelectionChange();
      },
    },
    components: {
      ElRow,
      WorkMould,
      TableColumnHeader,
      Retrieve
    },
    filters: {
      datehhmmss(myInput) {
        return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
      },
      dateyymmdd(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      }
    },
    mounted() {
      let userId = localStorage.getItem("userId");
      this.userId = userId;
      this.QJGetMounted();
    },
    computed:{
      getLabel(){
        var obj={};
        this.paramJson.forEach(v=>{
          obj[v.nameCode]=v.name;
        });
        return obj;
      }
    }
  }
</script>

<style scoped>
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
</style>
