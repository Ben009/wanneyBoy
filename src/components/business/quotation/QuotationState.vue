<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" size="mini">
      <div class="title-item"><span>基本信息</span></div>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="quotationNo">
            <template slot="label">
              <span>报价单编号</span>
              <el-tooltip class="item" effect="dark" content="保存报价单时自动生成">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.quotationNo" readonly :disabled="forbidden" style="width: 100%"></el-input>
            <el-input v-model="form.id" v-show="show"></el-input>
          </el-form-item>
        </el-col>

          <el-col :span="6">
            <el-form-item label="编号抬头" prop="numbered">
              <el-select
                placeholder="请选择"
                value-key="numbered"
                :disabled="forbidden"
                v-model="form.numbered"
                style="width: 100%">
                <el-option
                  v-for="item in numbereds"
                  :label="item.numbered"
                  :value="item.numbered">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="录入人" prop="addUser">
              <el-input v-model="form.addUserName" readonly :disabled="forbidden"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="报价日期" prop="addUser">
              <el-input v-model="form.addTime" disabled></el-input>
            </el-form-item>
          </el-col>
      </el-row>

      <el-row>
        <el-col :span="16">
          <el-input v-model="form.companyName" v-show="show"></el-input>
          <el-form-item label="委托单位" prop="companyName">
            <el-autocomplete style="width:100%"
                             v-model="form.companyName"
                             :fetch-suggestions="querySearchEntrust"
                             placeholder="请输入内容"
                             @select="handleSelect"
                             :trigger-on-focus="flag"
                             disabled
            ></el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="客户联系人" prop="customerContact">
            <el-input v-model="form.customerContact" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="客户电话" prop="customerTelephone">
            <el-input v-model="form.customerTelephone" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="客户手机" prop="customerMobilePhone">
            <el-input v-model="form.customerMobilePhone" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="客户邮箱" prop="customerEmail">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.customerEmail" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18">
          <el-form-item label="客户联系地址" prop="customerAddress">
            <el-input v-model="form.customerAddress" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="客户传真" prop="customerFox">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.customerFox" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" style="width:100%;">
          <el-form-item label="客户上门检测地址" prop="detectionAddress">
            <el-input v-model="form.detectionAddress" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18">
          <el-form-item  prop="certificateCompanyName">
            <template slot="label">
              <span>证书单位名称</span>
              <el-tooltip class="item" effect="dark" content="如无默认为委托单位">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.certificateCompanyName" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item  prop="isConclusion">
            <template slot="label">
              <span>是否出具结论</span>
              <el-tooltip class="item" effect="dark" content="若服务类型为校准/检测时，是否需出具结论">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-radio-group v-model="form.isConclusion" :disabled="forbidden">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18">
          <el-form-item prop="certificateCompanyAddress">
            <template slot="label">
              <span>证书单位地址</span>
              <el-tooltip class="item" effect="dark" content="如无默认为联系地址">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.certificateCompanyAddress" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="isRecheck">
            <template slot="label">
              <span>是否复检</span>
              <el-tooltip class="item" effect="dark" content="若服务类型为校准/检测时，是否需出具复校日期">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-radio-group v-model="form.isRecheck" :disabled="forbidden">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="业务组" prop="businessGroup">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              @change="businessEvt"
              v-model="form.businessGroup"
              :disabled="forbidden" style="width: 100%">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in businessGroups"
                :key="item.businessGroup"
                :label="item.businessGroupName"
                :value="item.businessGroup+''"
                :disabled="forbidden">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务员" prop="businessStaff">
            <el-select
              placeholder="请选择"
              value-key="name"
              @change="handleChange"
              v-model="form.businessStaff"
              :disabled="forbidden" style="width: 100%"
            >
              <el-option
                v-for="item in businessStaffs"
                :key="item.staff"
                :label="item.staffName"
                :value="item.staff+''">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务负责人" prop="charge">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.charge"
              :disabled="forbidden" style="width: 100%">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in charges"
                :key="item.id"
                :label="item.userName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="第二负责人" prop="secondCharge">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.secondCharge"
              :disabled="forbidden" style="width: 100%">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in secondCharges"
                :key="item.id"
                :label="item.userName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="本单位名称" prop="businessCompanyName">
            <el-input v-model="form.businessCompanyName" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="本单位地址" prop="businessAddress">
            <el-input v-model="form.businessAddress" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="银行账号" prop="bankAccount">
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.bankAccount" style="width: 100%" :disabled="forbidden">
              <el-option
                v-for="item in bankAccounts"
                :key="item.accountId"
                :label="item.accountName"
                :value="item.accountId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="业务员电话" prop="businessTelephone">
            <el-input v-model="form.businessTelephone" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务员手机" prop="businessMobilePhone">
            <el-input v-model="form.businessMobilePhone" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务员邮箱" prop="businessEmail">
            <el-input v-model="form.businessEmail" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-Row>
        <el-col :span="24">
          <el-form-item label="报价单备注" prop="remark">
            <el-input v-model="form.remark" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-Row>
        <el-col :span="8">
          <el-form-item label="附件" prop="attachment">
            <mind-upload ref="upFiles"
                         :limitNumb="limitNumb"
                         :data="fdata"
                         :callBack="callBack"
                         disabled>
            </mind-upload>
            <el-input v-model="form.attachment" v-show="show"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>


      <el-row>
        <el-col :span="6">
          <el-form-item label="是否加急" prop="urgentProportions">
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.urgentProportions" :disabled="forbidden">
              <el-option
                v-for="item in urgentDays"
                :key="item.pcode"
                :label="item.remark"
                :value="item.pcode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="邮寄费" prop="postage">
            <el-input v-model="form.postage" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="交通费" prop="carFare">
            <el-input v-model="form.carFare" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="现场服务费" prop="serviceCharge">
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.serviceCharge"
              :disabled="forbidden">
              <el-option
                v-for="item in serviceCharges"
                :key="item.pcode"
                :label="item.remark"
                :value="item.pcode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="合计" prop="decimals">
            <span>{{form.totalCost}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="title-item"><span>开票信息</span></div>
      <el-row>
        <el-col :span="6">
          <el-form-item label="保存至单位库" prop="isSaveToCompany">
            <el-radio-group v-model="form.invoiceToCompany" :disabled="forbidden">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-form-item label="名称" prop="invoiceCompany">
            <el-input v-model="form.invoiceCompany" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="纳税人识别号" prop="taxNo">
            <el-input v-model="form.taxNo" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9">
          <el-form-item label="地址、电话" prop="invoiceAddressTel">
            <el-input v-model="form.invoiceAddressTel" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9">
          <el-form-item label="开户行及账号" prop="accountBankNo">
            <el-input v-model="form.accountBankNo" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div class="title-item"><span>器具信息</span></div>
    <el-table :data="tableData" :max-height="QJTableMaxHeight" style="width: 100%"  :summary-method="getSummaries"
              @selection-change="handleSelectionChange" show-summary>
      <el-table-column type="selection" width="40" :selectable='checkboxInit'></el-table-column>
      <el-table-column label="序号" type="index" width="60"></el-table-column>
      <el-table-column prop="APPLIANCE_NAME" label="报价器具" width="180"></el-table-column>
      <el-table-column prop="SET_NUMBER" label="套数"></el-table-column>
      <el-table-column prop="AFTER_DISCOUNT_TOTAL" label="费用合计"></el-table-column>
      <el-table-column prop="IS_PLAN" label="是否已转" :formatter="isPlanFormatter"></el-table-column>
      <el-table-column prop="PLAN_TIME" label="是否安排">
        <template slot-scope="scope">
          <span v-if="scope.row.ORDER_NO"><p>{{scope.row.ORDER_NO}}</p> <p>{{scope.row.PLAN_TIME}}</p></span>
          <span v-else>未安排</span>
        </template>
      </el-table-column>
      <el-table-column prop="USER_NAME" label="分配状态" :formatter="executorFormatter"></el-table-column>
      <el-table-column prop="IS_HAVE_NUMBER" label="配号状态">
        <template slot-scope="scope">
          <span v-if="scope.row.IS_HAVE_NUMBER==0 || !scope.row.IS_HAVE_NUMBER">未配号</span>
          <span v-else-if="scope.row.IS_RETURN==1">
            <el-tooltip content="scope.row.RETURN_REASON" placement="bottom" effect="light">
             已退号
            </el-tooltip>
            </span>
          <span v-else-if="scope.row.IS_HAVE_NUMBER==1">{{scope.row.REGISTRATION_NO}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="APPLIANCE_ACTUAL_NAME" label="实际器具名称"></el-table-column>
      <el-table-column prop="SET_NUMBERS" label="实际套数"></el-table-column>
      <el-table-column prop="FINISH_FLAG" label="完成状态" :formatter="finishFormatter"></el-table-column>
      <el-table-column prop="APPLIANCE_WAREHOUSE_FLAG" label="库房状态" :formatter="warehouseFormatter"></el-table-column>
    </el-table>

    <additionalAppliance :quotationId="this.quotationIds"></additionalAppliance>

    <show-more-list v-if="visable" :data="companyMany" :callback="handleCallBack"></show-more-list>

    <!-- 询价的不能转 -->
    <span slot="footer" class="dialog-footer" v-if="form.isInquiry==0">
      <el-button type="warning" @click="deletePlan">删除全部已转任务</el-button>
      <el-button type="primary" @click="toPlan">转现场任务</el-button>
    </span>

    <span slot="footer" class="dialog-footer" style="display: block;  text-align: center;">
            <el-button type="warning" @click="unAudit" v-has="'M7101'" v-if="form.auditFlag==1">取消审核</el-button>
            <el-button type="primary" @click="setAudit" v-has="'M7101'" v-else>审核</el-button>
            <el-button type="primary" @click="setStatus">设置状态</el-button>
     </span>
  </div>
</template>

<script>
  import Vue from 'vue'
  import additionalAppliance from './additionalAppliance'

  var Big = require('big.js')

  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest} from '../../util/base'
  // 引入jquery
  import $ from 'jquery'
  // 引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck'
  import rightClick from '../../../mixins/FormRightClick'
  import ElRow from "@/common-el/packages/row/src/row";

/*
  import {
    Button,
    Checkbox,
    CheckboxGroup,
    Col,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
    Row,
    Select
  } from 'element--ui'
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  Vue.use(Button)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(RadioGroup)
  Vue.use(Radio)
  Vue.use(CheckboxGroup)
  Vue.use(Checkbox) */

  export default {
    name: 'quotationForm',
    props: {// 用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      callback: {
        type: Function
      },
      quotationIds: {//设置状态节点传入
        type: Number
      },
      search: {
        type: Function
      }
    },
    components: {ElRow,additionalAppliance},
    data() {
      return {
        form: {},
        rules: {
          companyId: [{type: 'string', required: true, message: '单位不能为空'}],
          numbered: [{type: 'string', required: true, message: '编号抬头不能为空'}],
          customerContact: [{type: 'string', required: true, message: '客户联系人不能为空'}],
          customerTelephone: [{type: 'string', required: true, message: '客户电话不能为空'}],
          customerMobilePhone: [{type: 'string', required: true, message: '客户手机不能为空'}],
          customerAddress: [{type: 'string', required: true, message: '客户联系地址不能为空'}],
          detectionAddress: [{type: 'string', required: true, message: '上门检测地址不能为空'}],
          businessGroup: [{type: 'string', required: true, message: '业务组不能为空'}],
          businessStaff: [{type: 'string', required: true, message: '业务员不能为空'}],
          bankAccount: [{type: 'string', required: true, message: '银行账号不能为空'}],
          charge: [{type: 'string', required: true, message: '业务负责人不能为空'}]
        },
        tableData: [],
        loading: false,
        businessGroups: [], // 业务组
        businessStaffs: [], // 业务员
        charges: [], // 负责人
        secondCharges: [], // 第二负责人
        companyIds: [], // 单位下拉
        numbereds: [], // 编号抬头
        bankAccounts: [], // 银行账号下拉
        show: false, // 控制隐藏域是否显示
        quotationId: '',
        attachment: '', // 报检单中的附件字段
        forbidden: true, // 表单disabled
        urgentDays: [], // 加急点
        serviceCharges: [], // 现场服务费
        auditFlag: 0, // 审核标记

        fileList: [], //
        limitNumb: 1, // 附件上传个数限制

        attachIds: '', // 初始化加载附件 [非必填]
        up_url: '',// 自定义上传路径 [非必填]  默认不用修改

        fdata: {//附件额外参数
          serverId: 'http5',//服务id     [非必填]  分布式附件服务可以用默认不用配制
          flowId: '', //流程id      [非必填]  流程相关
          execType: '签名',//操作类型   [非必填]  业务相关
          caseId: '',//登记号       [非必填]  业务相关的登记号
        },

        //单位下拉
        loading: false,
        remoteOptions: [],
        institutionalNatures: [],
        visable: false,
        flag: false,
        companyMany: null,
        multipleSelection: [],//转排单选择的器具
      }
    },
    watch:{
      quotationIds:function(param1,param2){
        this.rules = {};
        if(param1){
          this.getData();
        }else{
          this.form = [];
          this.tableData = [];
        }
      }
    },
    mounted() {
      // 页面渲染完成后，ajax请求加载数据
      this.getBusinessGroups()
      this.listUserByBD()
      this.listContractHead()
      this.listAccount()
      this.getIsUrgent()
      this.getServiceCharges()
      this.getData()
    },
    directives: {rightclick},
    mixins: [rightClick],
    methods: {
      //分配状态
      executorFormatter(row,column){
        if(row.USER_NAME){
          return row.USER_NAME;
        }else {
          return '未分配';
        }
      },
      //是否完成
      finishFormatter(row, column){
        if(row.FINISH_FLAG==0){
          return '未完成';
        }else if (row.FINISH_FLAG==1){
          return '已完成';
        }
      },
      //样品库房状态
      warehouseFormatter(row, column){
        if(row.APPLIANCE_WAREHOUSE_FLAG==0){
          return '送检在收发（现场的无样品）';
        }else if(row.APPLIANCE_WAREHOUSE_FLAG==1){
          return '未检在实验室';
        }else if(row.APPLIANCE_WAREHOUSE_FLAG==2){
          return '已检在实验室';
        }else if(row.APPLIANCE_WAREHOUSE_FLAG==3){
          return '已入库';
        }else if(row.APPLIANCE_WAREHOUSE_FLAG==4){
          return '已出库';
        }
      },
      //是否转现场任务
      isPlanFormatter(row, column){
        if(row.IS_PLAN==0){
          return '否';
        }else {
          return '是';
        }
      },
      //转过现场任务的不可勾选
      checkboxInit(row, index) {
        if (row.IS_PLANNED == '0') {
          return 1
        } else {
          return 0
        }
      },
      handleChange(v) {
        // 业务员
        Vue.set(this.form, 'businessStaff', v)
      },
      // 清空表单
      resetForm() {
        this.$refs['form'].resetFields()
      },
      callBack(file, list) {
        let fileId = ''
        this.fileList = list
      },
      // 获取业务组
      getBusinessGroups() {
        ajaxRequest('get', 'back/businessStaff/getBusinessGroupName', {}, (res) => {
          this.businessGroups = res
        })
      },
      // 根据业务组ID查询业务员
      businessEvt(businessGroupId) {
        ajaxSyncRequest('get', 'back/businessStaff/StaffByBusinessGroupId?businessGroup=' + businessGroupId, {}, (res) => {
          this.businessStaffs = res
        })
      },
      // 获取部门类型为业务拓展的用户
      listUserByBD() {
        ajaxRequest('get', 'back/user/listUserByCharge', {}, (res) => {
          this.charges = res.rows
          this.secondCharges = res.rows
        })
      },
      // 获取报价单编号抬头
      listContractHead() {
        ajaxRequest('get', 'back/quotation/listContractHead', {}, (res) => {
          this.numbereds = res.rows
        })
      },
      // 查询银行账号
      listAccount() {
        ajaxRequest('get', 'back/quotation/listAccount', {}, (res) => {
          this.bankAccounts = res.rows
        })
      },

      // 获取加急点(数据字典维护)
      getIsUrgent() {
        ajaxProxyRequest('get', '/njmind/findParam/urgentDays', {}, (res) => {
          this.urgentDays = res.list
        })
      },
      // 获取现场服务费
      getServiceCharges() {
        ajaxProxyRequest('get', '/njmind/findParam/serviceCharge', {}, (res) => {
          this.serviceCharges = res.list
        })
      },
      // 获取后台数据
      getData() {
        let id = this.$route.query.id || this.quotationIds;
        if (id) {
          ajaxSyncRequest('get', 'back/quotation/' + id, {}, (res) => {
            Vue.set(this.form, 'businessGroup', res.daoResult.businessGroup)
            if (this.form.businessGroup) {
              this.businessEvt(this.form.businessGroup + '')
              Vue.set(this.form, 'businessStaff', res.daoResult.businessStaff + '')
            }
            this.form = res.daoResult
            // 加载附件
            this.$refs.upFiles.loadAttacheIds(res.daoResult.attachment)
          })

          ajaxSyncRequest('get', 'back/quotationAppliance/getApplianceState', {quotationId: id}, (res) => {
            this.tableData = res.rows
          })
        }
      },
      // 审核
      setAudit() {
        let id = this.$route.query.id || this.quotationIds;
        if(!id){
          this.$message({type: 'error', message: '没有可审核的报价单!'})
          return;
        }
        this.$confirm('确认审核报价单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxSyncRequest('put', 'back/quotation/quotationAudit', {
            id: id
          }, (res) => {
            if (res.code === 200) {
              this.form.auditFlag = 1
              this.$message({type: 'success', message: '审核成功!'})
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },
      // 取消审核
      unAudit() {
        let id = this.$route.query.id || this.quotationIds;
        if(!id){
          this.$message({type: 'error', message: '没有可取消审核的报价单!'})
          return;
        }
        this.$confirm('确认取消报价单审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxSyncRequest('put', 'back/quotation/cancelQuotationAudit', {
            id: id
          }, (res) => {
            if (res.code === 200) {
              this.form.auditFlag = 0
              this.$message({type: 'success', message: '取消成功!'})
            } else if (res.code === 300) {
              this.$message({type: 'error', message: res.msg})
            } else {
              this.$message({type: 'error', message: '系统错误'})
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },
      setStatus() {
        let status = 0;
        let id = this.$route.query.id || this.quotationIds;
        if(!id){
          this.$message({type: 'error', message: '没有可设置的报价单!'})
          return;
        }
        ajaxSyncRequest('get', 'back/quotation/' + id, {}, (res) => {
          status = res.daoResult.status
        })

        if (status == "1") {
          this.$message({type: 'error', message: '该报价单已完工，系统不允许重复设置！'})
          return;
        }
        this.$confirm('确认设置该报价单状态为已完成？此操作不可逆!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxSyncRequest('put', 'back/quotation/setFinish', {id: id}, (res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '设置成功'})
              this.getData();
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },

      //器具合计行
      getSummaries(param) {
        let {columns, data} = param
        let sums = []
        columns.forEach((column, index) => {
          if (index === 2) {
            sums[index] = '合计'
            return
          }
          let values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr)
              if (!isNaN(value)) {
                return new Big(prev).add(curr)
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' '
          } else {
            sums[index] = ' '
          }
        })
        sums[5] = ''
        sums[6] = ''
        sums[7] = ''
        sums[8] = ''
        sums[9] = ''
        sums[10] = ''
        sums[11] = ''
        sums[12] = ''
        return sums
      },
      // 委托单位远程搜索
      querySearchEntrust(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        let params = queryString ? {
          companyName: queryString,
          fuzzySearch: 1,
          source: 1
        } : ''
        ajaxRequest('get', 'back/company/matchCompanysByName', params, (res) => {
          if (res.code == 200) {
            this.handleResult(res.rows)
            cb(res.rows)
          }
        })
      },
      handleSelect(item) {
        this.visable = false
        this.form.companyId = judgeNull(item.id)
        this.form.companyName = judgeNull(item.companyName)// 委托单位
        Vue.set(this.form, 'numbered', judgeNull(item.contractHead))// 编号抬头
        this.form.customerMobilePhone = judgeNull(item.mobilePhone)// 客户手机
        this.form.customerAddress = judgeNull(item.address)// 客户联系地址
        this.form.customerEmail = judgeNull(item.email)// 客户邮箱el-tooltip
        Vue.set(this.form, 'businessGroup', judgeNull(item.businessGroup) + '')// 业务组
        this.businessEvt(judgeNull(item.businessGroup) + '')// 业务组改变事件
        Vue.set(this.form, 'businessStaff', judgeNull(item.businessStaff) + '')// 业务员
        this.form.businessCompanyName = judgeNull(item.staffCompanyName)// 本单位名称
        this.form.businessAddress = judgeNull(item.staffAddress)// 本单位地址
        this.form.businessTelephone = judgeNull(item.staffTelephone)// 业务员电话
        this.form.businessMobilePhone = judgeNull(item.staffMobilePhone)// 业务员手机
        this.form.businessEmail = judgeNull(item.staffEmail)// 业务员邮箱
        Vue.set(this.form, 'bankAccount', judgeNull(item.bankId) + '')// 银行账号
        this.form.invoiceCompany = judgeNull(item.invoiceCompany)// 开票单位
        this.form.taxNo = judgeNull(item.taxNo)// 税号
        this.form.invoiceAddressTel = judgeNull(item.invoiceAddressTel)// 开票电话,开票地址
        this.form.accountBankNo = judgeNull(item.accountBankNo) // 开户行,银行账号

        // 多地址选择
        if (item.many == '1') {
          this.companyMany = item.id
          this.visable = true
        } else {
          this.form.customerContact = judgeNull(item.contacter)// 客户联系人
          this.form.customerTelephone = judgeNull(item.telephone)// 客户电话
          this.form.customerFox = judgeNull(item.fax)// 客户传真
          this.form.certificateCompanyName = judgeNull(item.companyName)// 证书单位名称
          this.form.detectionAddress = judgeNull(item.address)// 客户地址
          this.form.certificateCompanyAddress = judgeNull(item.address)// 证书单位地址
        }
      },
      handleCallBack(val) {
        if (val) {
          this.form.customerContact = judgeNull(val.contacter)// 客户联系人
          this.form.customerTelephone = judgeNull(val.telephone)// 客户电话
          this.form.customerFox = judgeNull(val.fax)// 客户传真
          this.form.certificateCompanyName = judgeNull(val.companyName)// 证书单位名称
          this.form.detectionAddress = judgeNull(val.address)// 客户地址
          this.form.certificateCompanyAddress = judgeNull(val.address)// 证书单位地址
        }
        this.visable = false
      },
      remoteMethod() {
        // -- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true
        ajaxProxyRequest('get', '/njmind/findParam/institutionalNatures', {},
          (res) => {
            this.institutionalNatures = res.list
          })
      },
      // checkbox选中时候赋值
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      //删除全部已转的计划任务
      deletePlan() {
        let quotationId = this.$route.query.id || this.quotationIds;
        this.$confirm('确认删除全部已转的现场任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxRequest('post', 'back/quotation/deletePlan', {quotationId: quotationId + ''}, (res) => {
            console.log('删除已转任务', res);
            if (res.code === 200) {base/user/UserTable
              this.$message({type: 'success', message: '删除计划成功'})
              this.getData();
            } else if (res.code === 300) {
              this.$message({type: 'warning', message: res.msg})
            } else {
              this.$message({type: 'error', message: '系统错误,删除失败'})
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },
      //转计划任务
      toPlan() {
        //查询报价单是否已审核
        let quotationId = this.$route.query.id || this.quotationIds;
        let auditFlag = 0;
        ajaxSyncRequest('get', 'back/quotation/' + quotationId, {}, (res) => {
          auditFlag = res.daoResult.auditFlag
        })

        if (auditFlag == 0) {
          this.$message({type: 'error', message: '报价单未审核，不可转现场计划!'})
          return;
        }
        if (this.multipleSelection.length == 0) {
          this.$message({type: 'error', message: '请至少选择一条记录!'})
          return;
        }
        //转排单的器具
        let applianceIds = ""
        this.multipleSelection.forEach((e) => {
          applianceIds = applianceIds + e.ID + ','
        })
        if (applianceIds != "") {
          applianceIds = applianceIds.substr(0, applianceIds.length - 1);
        }
        this.$confirm('确认转现场任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxSyncRequest('post', 'back/quotation/toPlan', {
            quotationId: quotationId,
            applianceIds: applianceIds
          }, (res) => {
            if (res.code === 200) {
              //生成计划成功,重新获取数据
              this.$message({type: 'success', message: '生成计划成功'})
              this.getData();
            }
          })
        }).catch(() => {
          // 取消操作
        })
      }
    }
  }
</script>

<style scoped>

</style>
