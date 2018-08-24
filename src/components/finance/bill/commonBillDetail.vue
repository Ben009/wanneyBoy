<template>
  <mind-dialog
    :title="'缴费单详情'"
    :visible="true"
    center
    :appendToBody="true"
    v-dialogDrag
    dialogSize="large"
    @close="handleCancel">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="baseInfo">
        <div class="title-item" style="text-align: left;margin-bottom: 10px">
          <span style="width: 95%">基本信息</span>
          <!--<span style="width: 5%">
          <global-tootips :width="600">
            <p>1、在缴费单未申请预开票、结账、关联银行到款、挂账余额时，有进行缴费单修改、对该缴费单追加新的登记号，或删除部分登记号（若需删除所有登记号需通过删除缴费单进行）；</p>
           <p> 2、申请预开票指：使用该缴费单申请预开发票，预开发票的所有信息与缴费单一致；</p>
            <p>3、关联挂账指将该缴费单关联至预存款记录；</p>
            <p>4、检测费、所有费用、总收等打折操作仅针对可选中的打折登记号进行操作，总收时需排除不可打折费用；折扣时，系统基于应收费折扣；申请折扣时，若折扣在申请人权限范围内，系统直接通过，若超出权限范围，将发起折扣申请流程；</p>
          </global-tootips>
          </span>-->
        </div>
        <div>
          <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
          <el-form ref="form" :model="form" label-width="140px">
            <div style="padding-top: 10px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="缴费单编号">
                    <span style="font-weight: bold;color: blue">{{form.billNo}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-Row>
                <el-col :span="16">
                  <el-form-item label="缴费单名称" prop="billName">
                    <el-input v-model="form.billName" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="缴费单金额" prop="billMoney">
                    <span style="color: red">{{form.billMoney}}</span>
                  </el-form-item>
                </el-col>
              </el-Row>
              <el-Row>
                <el-col :span="8">
                  <el-form-item label="单位联系人" prop="companyContact">
                    <el-input v-model="form.companyContact" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单位地址" prop="companyAddress">
                    <el-input v-model="form.companyAddress" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系电话" prop="companyPhone">
                    <el-input v-model="form.companyPhone" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="业务员" prop="businessStaff">
                    <el-select v-model="form.businessStaff" disabled="disabled" placeholder="请选择" class="list-width">
                      <el-option
                        v-for="item in staffs"
                        :key="item.staff"
                        :label="item.staffName"
                        :value="item.staff">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-Row>
            </div>
            <div class="title-item"><span>开票信息</span></div>
            <div style="padding-top: 10px">
              <el-Row>
                <el-col :span="12">
                  <el-form-item label="开票单位" prop="ticketCompany">
                    <el-input v-model="form.ticketCompany" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="税号" prop="taxCode">
                    <el-input v-model="form.taxCode" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="地址/电话" prop="ticketAddressPhone">
                    <el-input v-model="form.ticketAddressPhone" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开户行/帐号" prop="ticketBankAccount">
                    <el-input v-model="form.ticketBankAccount" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
              </el-Row>
            </div>
          </el-form>
        </div>
        <div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openLog" class="el-button el-button--primary" v-has="'M32104'">操作日志</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>
        </div>
        <div style="padding-top: 5px;text-align: center">合计：<span
          style="color: red;font-weight: bold;font-size: 16px;">{{totalMoney_actual}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          可打折金额：<span style="font-size: 16px;color: red;font-weight: bold">{{discountSum}}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;不可打折金额：<span
            style="font-size: 16px;color: red;font-weight: bold">{{undiscountSum}}</span></div>
            </el-col>
          </el-row>
        </div>
        <div class="title-item"><span>登记号列表</span></div>
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%"
                  show-summary
                  :summary-method="getSummaries"
                  :span-method="arraySpanMethod"
                  ref="multipleTable">
          <el-table-column prop="ORDER_NO" label="委托单号"></el-table-column>
          <el-table-column prop="REGISTRATION_NO" label="登记号"></el-table-column>
          <el-table-column prop="COMPANY_NAME" label="委托单位"></el-table-column>
          <el-table-column prop="APPLIANCE_NAME" label="器具名称"></el-table-column>
          <el-table-column prop="SET_NUMBER" label="套数">
            <template slot-scope="scope">
              {{scope.row.SET_NUMBER}}<span v-if="scope.row.RETURN_NUMBER!=0"
                                            style="color:red">/{{scope.row.RETURN_NUMBER}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="TOTAL_ACTUAL" :label="defaultInfo.fee7">
            <template slot-scope="scope">
              <span>{{scope.row.TOTAL_FEE}}/{{scope.row.TOTAL_ACTUAL}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="EXECUTOR" label="检测人员"></el-table-column>
          <el-table-column prop="JDF_ACTUAL" :label="defaultInfo.fee1">
            <template slot-scope="scope">
              <span>{{scope.row.JDF}}/{{scope.row.JDF_ACTUAL}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="FJF_ACTUAL" :label="defaultInfo.fee2">
            <template slot-scope="scope">
              <span>{{scope.row.FJF}}/{{scope.row.FJF_ACTUAL}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="JJF_ACTUAL" :label="defaultInfo.fee3">
            <template slot-scope="scope">
              <span>{{scope.row.JJF}}/{{scope.row.JJF_ACTUAL}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="XLF_ACTUAL" :label="defaultInfo.fee4">
            <template slot-scope="scope">
              <span>{{scope.row.XLF}}/{{scope.row.XLF_ACTUAL}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="FWF_ACTUAL" :label="defaultInfo.fee5">
            <template slot-scope="scope">
              <span>{{scope.row.FWF}}/{{scope.row.FWF_ACTUAL}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="QTF_ACTUAL" :label="defaultInfo.fee6">
            <template slot-scope="scope">
              <span>{{scope.row.QTF}}/{{scope.row.QTF_ACTUAL}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="WORKLOAD_ACTUAL" :label="defaultInfo.fee8">
            <template slot-scope="scope">
              <span>{{scope.row.WORKLOAD}}/{{scope.row.WORKLOAD_ACTUAL}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="INTENSIVE_WORKLOAD_ACTUAL" :label="defaultInfo.fee9">
            <template slot-scope="scope">
              <span>{{scope.row.INTENSIVE_WORKLOAD}}/{{scope.row.INTENSIVE_WORKLOAD_ACTUAL}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="DISCOUNT" label="折扣"></el-table-column>
          <el-table-column prop="SUBCONTRACT_FEE" label="分包费用"></el-table-column>
        </el-table>
        <!--操作日志-->
        <billLog v-if="log" :billNo="form.billNo" :callback="handleLogCallback"></billLog>
      </el-tab-pane>
      <el-tab-pane label="关联信息" name="claimInfo" v-if="form.isLinkPayment==1||form.isLinkTicket==1">
        <div v-if="form.isLinkPayment==1">
          <div class="title-item"><span>到款记录</span></div>
          <el-table :max-height="QJTableMaxHeight"
                    :data="claimData"
                    border
                    style="width: 100%">
            <el-table-column prop="PAYMENT_COMPANY" label="付款单位" show-overflow-tooltip></el-table-column>
            <el-table-column prop="PAYMENT_ACCOUNT" label="付款账号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="PAY_TIME" label="付款时间" :formatter="formatterpayTime"></el-table-column>
            <el-table-column prop="RECEIVE_ACCOUNT" label="收款账号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="PAY_MONEY" label="金额" show-overflow-tooltip></el-table-column>
            <el-table-column prop="BALANCE" label="余额"></el-table-column>
            <el-table-column prop="CLAIM_MONEY" label="认领金额"></el-table-column>
          </el-table>
        </div>
        <div v-if="form.isLinkTicket==1">
          <div class="title-item"><span>挂账记录</span></div>
          <el-table :data="ticketData" :max-height="QJTableMaxHeight" border
                    style="width: 100%"
          >
            <el-table-column prop="ticketCompany" label="开票单位"></el-table-column>
            <el-table-column prop="ticketCode" label="发票号"></el-table-column>
            <el-table-column prop="ticketMoney" label="开票金额"></el-table-column>
            <el-table-column prop="money" label="使用金额"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest,ajaxSyncProxyRequest, formatDate} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  import ElCol from "@/common-el/packages/col/src/col";
  import billLog from "./billLog";

  const defaults = {
    hoho: ''
  };
  export default {
    name: 'bill-detail-form',
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        totalMoney:0,//缴费单合计
        totalMoney_actual: 0,//缴费单实收金额
        discountSum: 0,//可打折费用合计
        undiscountSum: 0,//不可打折费用合计
        activeName: 'baseInfo',
        form: $.extend({}, defaults, this.data || {}),
        loading: false,
        remoteOptions: [],
        //autoComplete 是否不输入值就可匹配
        flag: false,
        registration_no: "",//够选中的登记号
        tableData: [],//列表
        chosedNo: "",//选中的登记号
        multipleSelection: [],//用于存储勾选数据
        modify: null,   //控制修改弹窗是否展示
        ticket: null,   //控制关联发票弹窗是否展示
        ticketApply: null,   //控制申请预开票弹窗是否展示
        log: false,//控制操作日志弹窗是否展示
        staffs: [],//业务员
        //折扣参数
        total: this.data.billMoney,//总收
        applyShow: false,
        isNeedCheck: true,
        noSelection: [],//用于存储勾选可打折的数据
        defaultInfo: {},//费用名称
        claimData: [],//关联到款记录
        ticketData: [],//关联发票记录
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
      this.getTableList();
      this.getBusinessStaff();
      ajaxSyncProxyRequest('get', '/njmind/findParams/fee1$fee2$fee3$fee4$fee5$fee6$fee7$fee8$fee9', {}, (res) => {
        //获取关联到款记录
        this.defaultInfo = {
          fee1: res.fee1.value,
          fee2: res.fee2.value,
          fee3: res.fee3.value,
          fee4: res.fee4.value,
          fee5: res.fee5.value,
          fee6: res.fee6.value,
          fee7: res.fee7.value,
          fee8: res.fee8.value,
          fee9: res.fee9.value,
        }
      });
      this.getClaimData();
      this.getTicketData();
    },
    components: {
      ElCol,
      billLog
    },
    methods: {//方法定义
      // 是否可打折
      judgeCanZk: function(row, column){
        if(row.IS_DISCOUNT == 0){
          return false;
        }else{
          return true;
        }
      },
      //关联挂账记录
      getTicketData() {
        let _this = this;
        ajaxRequest('get', 'back/ticket/getBillTicketList', {
          billId: this.data.id,
        }, (res) => {
          if (res.code === 200) {
            _this.ticketData = res.rows;
          }
        })
      },
      //关联到款记录
      getClaimData() {
        ajaxRequest('get', 'back/accountRecord/getAccountInfoBySourceAndSourceId', {
          source: 1,
          sourceId: this.data.id,
        }, (res) => {
          if (res.code === 200) {
            this.claimData = res.rows;
          }
        })
      },
      //业务员
      getBusinessStaff() {
        ajaxRequest('get', 'back/businessStaff/getStaff', {showFlag: '1'}, (res) => {
          this.staffs = res;
        })
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      openLog() {
        this.log = true;
      },
      remoteMethod() {
        //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
      },

      //委托单位autoComplete
      querySearchEntrust(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        let params = queryString ? {
          companyName: queryString,
          fuzzySearch: 1
        } : ''
        ajaxRequest('get', 'back/company/matchCompanysByName', params, (res) => {
          if (res.code == 200) {
            this.handleResult(res.rows);
            cb(res.rows)
          }
        })
      },
      handleResult(res) {
        for (let key in res) {
          Vue.set(res[key], 'value', res[key].companyName)
        }
      },
      handleCancel() {
        this.callback();
      },
      getTableList() {
        let _this = this;
        ajaxRequest('get', 'back/bill/' + this.form.id, {}, (res) => {
          if (res.code === 200) {
            _this.form = res.daoResult;
            _this.tableData = res.daoResult.sjdList;
            this.$nextTick(_ => {
              this.getDiscountAndUnDiscountSum();
            })
          }
        })
      },
      getDiscountAndUnDiscountSum(){
        this.undiscountSum = 0;
        this.discountSum = 0;
        this.multipleSelection.forEach((e) => {
          this.totalMoney += e.TOTAL_FEE;
          if(e.IS_DISCOUNT == 1){
            this.discountSum+= e.TOTAL_ACTUAL;
          }else{
            this.undiscountSum+=e.TOTAL_ACTUAL;
          }
        })
        this.totalMoney_actual = this.discountSum+this.undiscountSum;
      },
      //挂账合计
      getTicketSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && index != 1 ) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
        });
        return sums;
      },
      //合计登记号
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {

          if (index === 1) {
            sums[index] = '合计';
            return;
          }

          if (column.property == 'ORDER_NO' || column.property == 'COMPANY_NAME' || column.property == 'REGISTRATION_NO'
            || column.property == 'APPLIANCE_NAME' || column.property == 'IS_DISCOUNT' || column.property == 'DISCOUNT' || column.property == 'EXECUTOR') {
            sums[index] = '';
            return;
          }

          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (rowIndex === this.tableData.length) {
          if (columnIndex === 0) {
            return [1, 2];
          } else if (columnIndex === 1) {
            return [0, 0];
          }
        }
      },
      formatterpayTime: function (row, column) {
        return formatDate(row.PAY_TIME, 'YYYY-MM-DD');
      },
      handleTicketApplyCallback(res) {
        this.ticketApply = null;
        this.getTableList();
      },
      handleLogCallback() {
        this.log = false;
      },

    }
  }
</script>

<style>
  <!--
  右键菜单样式设置

  -->
  .right-click-menu {
    position: fixed;
    border: 1px solid #ccc;
    padding: 2px 0;
    background: #fff;
    width: 100px;
    z-index: 9999;
  }

  .right-click-menu li {
    padding: 3px 10px;
    cursor: default;
    font-size: 14px;
    color: #606266;
  }

  .right-click-menu li:hover {
    color: #409eff;
  }

  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
