<template>
  <mind-dialog
    :title="'缴费单详情'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="large"
    @close="handleCancel">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="baseInfo">
        <div class="title-item" style="text-align: left;margin-bottom: 10px">
          <span style="width: 95%">基本信息</span>
          <span style="width: 5%">
          <global-tootips :width="600">
            <p>1、在缴费单未申请预开票、结账、关联银行到款、挂账余额时，有进行缴费单修改、对该缴费单追加新的登记号，或删除部分登记号（若需删除所有登记号需通过删除缴费单进行）；</p>
           <p> 2、申请预开票指：使用该缴费单申请预开发票，预开发票的所有信息与缴费单一致；</p>
            <p>3、关联挂账指将该缴费单关联至预存款记录；</p>
            <p>4、检测费、所有费用、总收等打折操作仅针对可选中的打折登记号进行操作，总收时需排除不可打折费用；折扣时，系统基于应收费折扣；申请折扣时，若折扣在申请人权限范围内，系统直接通过，若超出权限范围，将发起折扣申请流程；</p>
          </global-tootips>
          </span>
        </div>
        <div>
          <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
          <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <div style="padding-top: 10px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="缴费单编号">
                    <span style="font-weight: bold;color: blue">{{form.billNo}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="缴费单名称" prop="billName">
                    <el-input v-model="form.billName"></el-input>
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
                  <el-form-item label="缴费单单位" prop="companyName">
                    <el-autocomplete style="width: 100%"
                                     v-model="form.companyName"
                                     :fetch-suggestions="querySearchEntrust"
                                     @select="handleSelect"
                                     :trigger-on-focus="flag"
                    >
                      <template slot-scope='scope'>
                        <div>
                          <span style="margin-left:0">({{scope.item.companyType}}) {{scope.item.companyName}}
                             (<span :style="{color:scope.item.status == 0 ? 'red' : 'green'}">{{scope.item.status == 0 ? '未审核' : '已审核'}}</span>)
                             {{!!scope.item.companyDepart ? '[' + scope.item.companyDepart + ']' : ''}}
                             {{!!scope.item.contacter ? '[' + scope.item.contacter + ']' : ''}}
                             {{!!scope.item.mobilePhone ? '[' + scope.item.mobilePhone + ']' : ''}}
                          </span>
                        </div>
                      </template>
                    </el-autocomplete>
                    <el-input v-model="form.companyId" v-show="false"></el-input>
                    <el-input v-model="form.companyName" v-show="false"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="业务员" prop="businessStaff">
                    <el-select v-model="form.businessStaff" placeholder="请选择" style="width: 100%">
                      <el-option
                        v-for="item in staffs"
                        :key="item.staff"
                        :label="item.staffName"
                        :value="item.staff">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单位联系人" prop="companyContact">
                    <el-input v-model="form.companyContact"
                              v-rightclick="handleRightClick.bind(this,form,'companyContact')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单位地址" prop="companyAddress">
                    <el-input v-model="form.companyAddress"
                              v-rightclick="handleRightClick.bind(this,form,'companyAddress')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系电话" prop="companyPhone">
                    <el-input v-model="form.companyPhone"
                              v-rightclick="handleRightClick.bind(this,form,'companyPhone')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" v-rightclick="handleRightClick.bind(this,form,'remark')"></el-input>
                  </el-form-item>
                </el-col>

              </el-Row>
            </div>
            <div class="title-item"><span>开票信息</span></div>
            <div style="padding-top: 10px">
              <el-Row>
                <el-col :span="12">
                  <el-form-item label="开票单位" prop="ticketCompany">
                    <el-input v-model="form.ticketCompany"
                              v-rightclick="handleRightClick.bind(this,form,'ticketCompany')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="税号" prop="taxCode">
                    <el-input v-model="form.taxCode"
                              v-rightclick="handleRightClick.bind(this,form,'taxCode')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="地址/电话" prop="ticketAddressPhone">
                    <el-input v-model="form.ticketAddressPhone"
                              v-rightclick="handleRightClick.bind(this,form,'ticketAddressPhone')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开户行/帐号" prop="ticketBankAccount">
                    <el-input v-model="form.ticketBankAccount"
                              v-rightclick="handleRightClick.bind(this,form,'ticketBankAccount')"></el-input>
                  </el-form-item>
                </el-col>
              </el-Row>
            </div>
          </el-form>
        </div>
        <div>
          <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit"
                   v-show="form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0 && (form.isDiscount === 0 || form.isDiscount === 2)">保 存</el-button>
        <el-button type="primary" @click="toExportBillDialog"
                   v-show="(form.isDiscount === 0 || form.isDiscount === 2)">导出</el-button>
        <el-button type="primary" @click="toPrintBillDialog"
                   v-show="(form.isDiscount === 0 || form.isDiscount === 2)">打印</el-button>
        <el-button type="primary" @click="applyTicket"
                   v-show="form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0 && (form.isDiscount === 0 || form.isDiscount === 2)">申请预开票</el-button>
        <el-button type="primary" @click="linkTicket"
                   v-show="form.isTicket === 0 && form.isLinkTicket === 0  && form.isTicketApply === 0 && form.isLinkPayment === 0 && (form.isDiscount === 0 || form.isDiscount === 2)">关联挂账</el-button>
        <el-button @click="openLog" class="el-button el-button--primary" v-has="'M32104'">操作日志</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>
        </div>
        <div style="padding-top: 5px;text-align: center">合计：<span
          style="color: red;font-weight: bold;font-size: 16px;">{{totalMoney_actual}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          可打折金额：<span style="font-size: 16px;color: red;font-weight: bold">{{discountSum}}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;不可打折金额：<span
            style="font-size: 16px;color: red;font-weight: bold">{{undiscountSum}}</span></div>
        <div class="title-item"><span>折扣</span></div>
        <div style="padding-top: 10px;padding-bottom:10px;">
          <el-row>
            <el-col :span="8">
              <div class="el-form-item el-form-item__content">
                检测费折扣：
                <el-input-number v-model="jcf_zk" :controls="false" style=" width: 130px;" :min="0" :max="1"></el-input-number>
                <el-button size="mini" type='primary'
                           v-mindPopover="{message:'',placement:'right',isOpen:handleOpen.bind(this,2),success:setJfdZk.bind(this,2)}"
                           v-show="form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0 && (form.isDiscount === 0 || form.isDiscount === 2)">
                  检测费折扣
                </el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="el-form-item el-form-item__content">
                所有费折扣：
                <el-input-number v-model="total_zk" :controls="false" style=" width: 130px;" :min="0" :max="1"></el-input-number>
                <el-button size="mini" type='primary'
                           v-mindPopover="{message:'',isOpen:handleOpen.bind(this,1),success:setJfdZk.bind(this,1)}"
                           v-show="form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0 && (form.isDiscount === 0 || form.isDiscount === 2)">
                  所有费折扣
                </el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="el-form-item el-form-item__content">
                总收
                <el-tooltip class="item" effect="dark" :content="'此处指的是缴费单内可打折费用总收'">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
                ：
                <el-input v-model="total" type="number" style=" width: 130px;"></el-input>
                <el-button size="mini" type='primary'
                           v-mindPopover="{message:'',placement:'left',isOpen:handleOpen.bind(this,3),success:setJfdZk.bind(this,3)}"
                           v-show="form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0 && (form.isDiscount === 0 || form.isDiscount === 2)">
                  总收
                </el-button>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="el-form-item el-form-item__content">
                &nbsp;&nbsp;&nbsp;申请原因：
                <el-input v-model="apply_reason" style="width:70%"></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="display: none;">
          <!--<el-button size="mini" type='primary' @click='chooseAll'
                     v-show="form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0">
            全 选
          </el-button>-->
          <el-button size="mini" type='primary' @click='toggleSelection(tableData)'
                     v-show="form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0">
            反 选
          </el-button>
         <!-- <el-button size="mini" type='primary' @click='toggleSelection()'
                     v-show="form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0">
            清 空
          </el-button>-->
          <el-button size="mini" type='primary' @click='handleAdd'
                     v-show="form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0 && (form.isDiscount === 0 || form.isDiscount === 2)">
            追 加
          </el-button>
        </div>
        <div class="title-item">
          <span>登记号列表</span>
          <i class="el-icon-circle-plus"  title="追加登记号"  @click='handleAdd' style="float: right;padding-right: 1%"
                     v-show="form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0 && (form.isDiscount === 0 || form.isDiscount === 2)">
          </i>
        </div>
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%"
                  @selection-change="handleSelectionChange"
                  show-summary
                  :summary-method="getSummaries"
                  :span-method="arraySpanMethod"
                  ref="multipleTable">
          <el-table-column type="selection" width="40"></el-table-column>
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
          <el-table-column label="操作" min-width="60" fixed="right"
                           v-if="form.isCheck == 0&& form.isTicket === 0 && form.isTicketApply === 0 && form.isLinkTicket === 0 && form.isLinkPayment === 0 && (form.isDiscount === 0 || form.isDiscount === 2)">
            >
            <template slot-scope="scope">
              <el-button type="text" style="padding:0;font-size:18px;"
                         v-mindPopover="{message:'确定删除该登记号?',success:handleDel.bind(this,scope.row),isOpen:handleDelOpen.bind(this,scope.row)}"><i
                class="el-icon-delete" title="删除"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--追加登记号-->
        <billAddSjd v-if="!!modify" :data="modify" :callback="handleEditCallback"></billAddSjd>
        <!--关联发票-->
        <ticketList v-if="!!ticket" :data="ticket" :callback="handleTicketCallback"></ticketList>
        <!--申请预开票-->
        <ticketApply v-if="!!ticketApply" :data="ticketApply" :callback="handleTicketApplyCallback"></ticketApply>
        <!--操作日志-->
        <billLog v-if="log" :billNo="form.billNo" :callback="handleLogCallback"></billLog>
        <!--缴费单打印类型选择-->
        <printBillTypeDialog v-if="!!bill" :data="bill" :appData="tableData" :feeName="defaultInfo" :callback="handlePrintCallback"></printBillTypeDialog>
        <!--缴费单导出类型选择-->
        <exportBillTypeDialog v-if="!!billInfo" :data="billInfo" :callback="handleExportCallback"></exportBillTypeDialog>
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
  //引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import billAddSjd from './billAddSjd';
  import ticketList from './usableTicketList.vue';
  import ticketApply from './../ticketApply/ticketApplyForm';
  import ElCol from "@/common-el/packages/col/src/col";
  import billLog from "./billLog";
  import printBillTypeDialog from "./printBillTypeDialog.vue";
  import exportBillTypeDialog from "./exportBillTypeDialog.vue";

  const defaults = {
    hoho: ''
  };
  export default {
    name: 'billDetailForm',
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
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          billName: [{type: 'string', required: true, message: '缴费单名称不能为空'}]
        },
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
        jcf_zk: 1,//检测费折扣
        total_zk: 1,//所有费折扣
        total: this.data.billMoney,//总收
        apply_reason: '',//申请原因
        applyShow: false,
        isNeedCheck: true,
        noSelection: [],//用于存储勾选可打折的数据
        defaultInfo: {},//费用名称
        claimData: [],//关联到款记录
        ticketData: [],//关联发票记录
        bill:null,//控制缴费单打印类型选择弹窗
        billInfo:null,//控制缴费单导出类型选择弹窗
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
      this.getBusinessStaff();
      this.getTableList();
      ajaxSyncProxyRequest('get', '/njmind/findParams/fee1$fee2$fee3$fee4$fee5$fee6$fee7$fee8$fee9$dcCountLevel1$dcCountLevel2', {}, (res) => {
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
          dcCountLevel1:res.dcCountLevel1.value,
          dcCountLevel2:res.dcCountLevel2.value,
        }
      });
      this.getClaimData();
      this.getTicketData();
    },
    directives: {rightclick},
    mixins: [rightClick],
    components: {
      ElCol,
      billAddSjd,
      ticketList,
      ticketApply,
      billLog,
      printBillTypeDialog,
      exportBillTypeDialog
    },
    methods: {//方法定义
      //导出
      toExportBillDialog(){
        this.billInfo = this.form;
      },
      //缴费单打印
      toPrintBillDialog(){
        this.bill = this.form;
      },
      handlePrintCallback(){
          this.bill = false;
      },
      handleExportCallback(){
        this.billInfo = false;
      },
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
        ajaxRequest('get', 'back/businessStaff/getStaffList', {showFlag: '1'}, (res) => {
          this.staffs = res;
        })
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      openLog() {
        this.log = true;
      },
      handleSubmit() {
        let _this = this;
        //-- 表单提交处理 --
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
          if (valid) {
            var httpMethod;//http请求方式
            if (!this.form.id || this.form.id == '') {//新增 注意:通过id是否存在来判断是新增还是编辑
              httpMethod = 'post';
            } else {//更新
              httpMethod = 'put';
            }
            this.form.updateTime = new Date();
            delete this.form.addTime;
            delete this.form.updateTime;
            delete this.form.checkDate;
            delete this.form.checkOperateDate;
            delete this.form.ticketDate;
            delete this.form.ticketOperateDate;
            delete this.form.sjdList;
            delete this.form.checker;
            delete this.form.drawer;
            delete this.form.printCount;
            delete this.form.registrationNo;


            if (this.form.remark == "" || this.form.remark == null) {
              delete this.form.remark;
            }
            if (this.form.taxCode == "" || this.form.taxCode == null) {
              delete this.form.taxCode;
            }
            if (this.form.ticketAddressPhone == "" || this.form.ticketAddressPhone == null) {
              delete this.form.ticketAddressPhone;
            }
            if (this.form.ticketBankAccount == "" || this.form.ticketBankAccount == null) {
              delete this.form.ticketBankAccount;
            }
            if (this.form.ticketCompany == "" || this.form.ticketCompany == null) {
              delete this.form.ticketCompany;
            }
            if (this.form.userName == "" || this.form.userName == null) {
              delete this.form.userName;
            }
            ajaxRequest(httpMethod, "back/bill/", this.form, (res) => {
              _this.callback(res);
            });
          } else {
            return false;
          }
        })
      },
      remoteMethod() {
        //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
      },
      handleSelect(item) {
        this.visable = true;
        this.$set(this.form, "companyId", item.id);
        this.$set(this.form, "companyName", item.companyName);
        this.$set(this.form, "companyAddress", item.address);
        this.$set(this.form, "companyContact", item.contacter);
        this.$set(this.form, "companyPhone", item.telephone);
        //开票信息
        this.$set(this.form, "ticketCompany", item.invoiceCompany);
        this.$set(this.form, "taxCode", item.taxNo);
        this.$set(this.form, "ticketAddressPhone", item.invoiceAddressTel);
        this.$set(this.form, "ticketBankAccount", item.accountBankNo)
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
      handelCompany(obj, djh) {
        this.$set(this.form, "companyId", obj.COMPANY_ID);
        this.$set(this.form, "companyName", obj.COMPANY_NAME);
        this.$set(this.form, "billName", obj.COMPANY_NAME);
        this.$set(this.form, "companyAddress", obj.ADDRESS);
        this.$set(this.form, "companyContact", obj.CONTACTER);
        this.$set(this.form, "companyPhone", obj.TELEPHONE);
        //开票信息
        this.$set(this.form, "ticketCompany", obj.INVOICE_COMPANY);
        this.$set(this.form, "taxCode", obj.TAX_NO)
        this.$set(this.form, "ticketAddressPhone", obj.INVOICE_ADDRESS_TEL);
        this.$set(this.form, "ticketBankAccount", obj.ACCOUNT_BANK_NO);
        this.registration_no = djh;
      },
      getTableList() {
        let _this = this;
        ajaxRequest('get', 'back/bill/' + this.form.id, {}, (res) => {
          if (res.code === 200) {
            console.log(res.daoResult)
            _this.form = res.daoResult;
            _this.tableData = res.daoResult.sjdList;
            this.$nextTick(_ => {
              this.chooseAll();
              this.getDiscountAndUnDiscountSum();
            })
          }
        })
      },
      getDiscountAndUnDiscountSum(){
        this.undiscountSum = 0;
        this.discountSum = 0;
        this.totalMoney = 0;
        this.multipleSelection.forEach((e) => {
          this.totalMoney += e.TOTAL_ACTUAL;
          if(e.IS_DISCOUNT == 1){
            this.discountSum+= e.TOTAL_FEE;
          }else{
            this.undiscountSum+=e.TOTAL_FEE;
          }
        })
        this.totalMoney_actual = Number(this.totalMoney).toFixed(2);
      },
      chooseAll() {//全选
        for (let i = 0; i < this.tableData.length; i++) {
          if(this.tableData[i].IS_DISCOUNT == 1) {
            this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true);
          }
        }
      },
      //反选
      toggleSelection(rows) {
        if (rows) {
          for (let i = 0; i < this.tableData.length; i++) {
            if(this.tableData[i].IS_DISCOUNT == 1) {
              this.$refs.multipleTable.toggleRowSelection(this.tableData[i]);
            }
          }
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      //登记号勾选事件
      handleSelectionChange(val) {
        this.multipleSelection = val;
        let _this = this;
        //清空之前选中的
        _this.chosedNo = "";
        if (val.length > 0) {
          if (val.length == 1) {
            _this.chosedNo = val[0].REGISTRATION_NO;
          } else {
            for (var i = 0; i < val.length - 1; i++) {
              _this.chosedNo += val[i].REGISTRATION_NO + ",";
            }
            _this.chosedNo += val[val.length - 1].REGISTRATION_NO
          }
        }
        this.getDiscountAndUnDiscountSum();
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
                return (prev*1 + curr*1).toFixed(2);
              } else {
                return (prev*1).toFixed(2);
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
      //缴费单追加登记号
      handleAdd() {
        //追加页面
        this.modify = this.form || {}
      },
      handleDelOpen(data) {
        if (this.tableData.length == 1) {
          return "删除此登记号将同时删除缴费单！确认删除？";
        } else{
          return true;
        }
      },
      //删除缴费单内登记号
      handleDel(row) {
        let _this = this;
        if(this.tableData.length == 1){
          ajaxRequest('post', 'back/bill/list/' + _this.form.id, {_method: 'delete'}, function (res) {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.handleCancel();
            }
            else {
              this.$message.error('删除失败');
            }
          }.bind(this))
        }else{
          ajaxRequest('post', 'back/bill/delBillSjd', {
            /* registrationNo: _this.chosedNo,*/
            registrationNo: row.REGISTRATION_NO,
            billId: _this.form.id
          }, function (res) {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.getTableList();
            }
            else {
              this.$message.error('删除失败');
            }
          }.bind(this))
        }

      },
      //刷新缴费单页面
      handleEditCallback(res) {
        this.modify = null;
        if(res){
          if (res.code === 200) {
            this.$message.success('追加成功');
            this.getTableList();
          }
          else {
            this.$message.error('删除失败');
          }
        }
      },
      handleTicketCallback(res) {
        this.ticket = null;
        if (res) {
          if (res.code === 200) {
            this.$message.success('关联成功');
            this.getTableList();
            this.getClaimData();
            this.getTicketData();
          }
          else {
            this.$message.error('关联失败');
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
      //申请预开票
      applyTicket() {
        this.ticketApply = {
          billId: this.data.id,
          companyId: this.data.companyId,
          ticketMoney: this.data.billMoney,
          ticketHead:this.form.ticketCompany,
          ticketCompany:this.form.companyName,
          taxCode:this.form.taxCode,
          ticketAddressPhone:this.form.ticketAddressPhone,
          ticketBankAccount:this.form.ticketBankAccount,
        };
      },
      //关联发票
      linkTicket() {
        this.ticket = this.data;
      },
      //设置折扣
      handleOpen(val) {
        let discount;
        let _this = this;

        if (this.multipleSelection.length == 0) {
          this.$message.error('请选择需要操作的登记号');
          return false;
        }
        this.isNeedCheck = true;
        this.noSelection = [];
        this.multipleSelection.forEach(val => {
          if (val.IS_DISCOUNT == '1') {
            _this.noSelection.push(val);
          }
        });


        if (this.noSelection.length == 0) {
          this.$message.error('请选择可打折的登记号');
          return false;
        }


        if (val == 2) {//检测费折扣
          discount = this.jcf_zk;
          if (this.jcf_zk > 1 || this.jcf_zk < 0) {
            this.$message.error('检测费折扣必须介于0~1之间');
            return false;
          }
        } else if (val == 1) {//所有费折扣
          discount = this.total_zk;
          if (this.total_zk > 1 || this.total_zk < 0) {
            this.$message.error('所有费折扣必须介于0~1之间');
            return false;
          }
        } else {//总收
          discount = parseFloat(parseFloat(this.total) / this.discountSum).toFixed(2);
          if (this.total < 0) {
            this.$message.error('总收必须大于等于0');
            return false;
          }
        }
        let btnPower = localStorage.getItem('btnPower');

        if (parseFloat(discount) < parseFloat(this.defaultInfo.dcCountLevel2)) {
          if (btnPower.indexOf("@M7115@") != -1) {//折扣申请高级权限0.7折一下
            this.isNeedCheck = false;//需要申请打折
          }
        } else if (parseFloat(this.defaultInfo.dcCountLevel2) < parseFloat(discount) < parseFloat(this.defaultInfo.dcCountLevel1) || parseFloat(discount) == parseFloat(this.defaultInfo.dcCountLevel2)) {
          if (btnPower.indexOf("@M7110@") != -1) {//折扣申请中级权限0.7折以上
            this.isNeedCheck = false;//需要申请打折
          }
        } else if (1 > parseFloat(discount) > parseFloat(this.defaultInfo.dcCountLevel1) || parseFloat(discount) == parseFloat(this.defaultInfo.dcCountLevel1)) {
          if (btnPower.indexOf("@M7105@") != -1) {//折扣申请低级权限0.9折以上
            this.isNeedCheck = false;//需要申请打折
          }
        }
        //计算打折后合计金额
        let zkJdf = 0,zkTotal=0,discountedMoney=0;
        let zkJdf_actual = 0,zkTotal_actual=0;
        this.noSelection.forEach((v, i) => {
          zkJdf +=v.JDF_ACTUAL;
          zkJdf_actual += Number(v.JDF_ACTUAL) - Number(Number(v.JDF_ACTUAL/Number(v.JDF_DISCOUNT)) * Number(this.jcf_zk));
          zkTotal_actual += Number(v.TOTAL_ACTUAL) - Number(Number(v.TOTAL_ACTUAL/Number(v.DISCOUNT)) * Number(this.total_zk));
          zkTotal +=v.TOTAL_ACTUAL;
        });
        if(val == 1){
          discountedMoney = (Number(this.form.billMoney)  - Number(zkTotal_actual)).toFixed(2);
        }else if(val ==2){
          discountedMoney = (Number(this.form.billMoney)  - Number(zkJdf_actual)).toFixed(2) ;
        }else if(val ==3){
          discountedMoney = (Number(this.form.billMoney) - zkTotal + Number(this.total)).toFixed(2) ;
        }

        if(this.isNeedCheck && this.apply_reason==""){
          this.$message.error('该折扣超出您权限范围，请填写申请原因');
          return false;
        }



        if (this.isNeedCheck) {
          if (val == 1 ) {
            return "您对所有费用进行"+this.total_zk+"折扣操作，生效后该缴费单：合计金额为："+discountedMoney+"，该折扣超出您权限范围，系统将发起折扣审核流程，是否提交？";
          } else if(val ==2){
            return "您对检测费进行"+this.jcf_zk+"折扣操作，生效后该缴费单：合计金额为："+discountedMoney+"，该折扣超出您权限范围，系统将发起折扣审核流程，是否提交？";
          }else if(val==3){
            return "您进行总共"+this.totalMoney_actual+"元操作，不可打折金额为："+this.undiscountSum
              +"，实际操作为：针对"+this.discountSum+"费用进行"+this.total+"总收操作，生效后该缴费单：合计金额为："+discountedMoney+"\n"+
              "该折扣超出您权限范围，系统将发起折扣审核流程，是否提交？"
            }
        } else {
          if (val == 1) {
            return "您对所有费用进行"+this.total_zk+"折扣操作，生效后该缴费单：合计金额为："+discountedMoney+"，该折扣在您权限范围内，是否提交？";
          } else if (val == 2) {
            return "您对检测费进行"+this.jcf_zk+"折扣操作，生效后该缴费单：合计金额为："+discountedMoney+"，该折扣在您权限范围内，是否提交？";
          } else {
            return "您进行总共"+this.totalMoney_actual+"元操作，不可打折金额为："+this.undiscountSum
              +"，实际操作为：针对"+this.discountSum+"费用进行"+this.total+"总收操作，生效后该缴费单：合计金额为："+discountedMoney+"\n"+
              "该折扣在您权限范围内，是否提交？";
          }
        }
      },
      setJfdZk(val) {
        let zk;
        let total = 0;
        let balance = 0;
        if (val == 1) {
          zk = this.total_zk;
        } else if (val == 2) {
          zk = this.jcf_zk;
        } else {
          total = this.total;
          zk = (parseFloat(this.total) / this.discountSum).toFixed(2);
          balance = parseFloat(this.total) - zk * this.discountSum;
        }
        let obj = {
          type: val,
          sourceId: this.data.id,
          applyReason: this.apply_reason,
          zk: zk,
          total : this.total,
          registrationNo: this.noSelection,
          balance: balance
        };

        let _this = this;
        if (_this.isNeedCheck) {
          ajaxRequest('post', 'back/bill/billZkApply/', {
            json: JSON.stringify(obj)
          }, function (res) {
            if (res.code === 200) {
              _this.$message.success('提交成功！');
              this.getTableList();
            } else {
              _this.$message.error('提交失败！');
            }
          }.bind(this));
        } else {
          ajaxRequest('post', 'back/bill/setBillZk/', {
            json: JSON.stringify(obj)
          }, function (res) {
            if (res.code === 200) {
              _this.$message.success('提交成功！');
              this.getTableList();
            } else {
              _this.$message.error('提交失败！');
            }
          }.bind(this));
        }
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
