<!-- 报价信息通用组件，使用插槽添加具体功能 -->
<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" size="mini">
      <div class="title-item"><span>基本信息</span></div>
      <el-Row style="margin-top:10px;">
        <el-col :span="6">
          <el-form-item  prop="quotationNo">
            <template slot="label">
              <span>报价单编号</span>
              <el-tooltip class="item" effect="dark" content="保存报价单时自动生成">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.quotationNo" readonly :disabled="forbidden"></el-input>
            <el-input v-model="form.id" v-show="show"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="编号抬头" prop="numbered">
            <el-select
              placeholder="请选择"
              value-key="numbered"
              :disabled="forbidden"
              v-model="form.numbered" style="width:100%;">
              <el-option
                v-for="item in numbereds"
                :label="item.numbered"
                :value="item.numbered" >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="录入人" prop="addUser">
            <el-input v-model="form.addUser" readonly :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="报价日期" prop="addUser">
            <el-input v-model="form.addTime" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-Row>

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
                             :disabled="forbidden"
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


      <el-Row>
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
      </el-Row>

      <el-row>
        <el-col :span="24" style="width:100%;">
          <el-form-item label="客户上门检测地址" prop="detectionAddress">
            <el-input v-model="form.detectionAddress" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18">
          <el-form-item label="证书单位名称" prop="certificateCompanyName">
            <el-input v-model="form.certificateCompanyName" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="是否出具结论" prop="isConclusion">
            <el-radio-group v-model="form.isConclusion" :disabled="forbidden">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="18">
          <el-form-item label="证书单位地址" prop="certificateCompanyAddress">
            <el-input v-model="form.certificateCompanyAddress" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="是否复检" prop="isRecheck">
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
            <el-select
              placeholder="请选择"
              value-key="name"
              @change="businessEvt"
              v-model="form.businessGroup"
              :disabled="forbidden"  style="width:100%;">
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
            <el-select  style="width:100%;"
                        placeholder="请选择"
                        value-key="name"
                        @change="handleChange"
                        v-model="form.businessStaff"
                        :disabled="forbidden"
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
              placeholder="请选择" style="width:100%;"
              value-key="name"
              v-model="form.charge"
              :disabled="forbidden">
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
              :disabled="forbidden">
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
        <el-col :span="8">
          <el-form-item label="业务员电话" prop="businessTelephone">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.businessTelephone" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务员手机" prop="businessMobilePhone">
            <el-input v-model="form.businessMobilePhone" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务员邮箱" prop="businessEmail">
            <el-input v-model="form.businessEmail" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="报价单备注" prop="remark">
            <el-input v-model="form.remark" :disabled="forbidden"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="附件" prop="attachment">
            <mind-upload ref="upFiles"
                         :limitNumb="limitNumb"
                         :data="fdata"
                         :callBack="callBack" disabled>
            </mind-upload>
            <el-input v-model="form.attachment" v-show="show"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="是否加急" prop="urgentProportionsTemp">
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.urgentProportionsTemp"  style="width:100%;"
              :disabled="forbidden" >
              <el-option
                v-for="item in urgentDays"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
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
              placeholder="请选择" style="width:100%;"
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
        <el-col :span="6">
          <el-form-item label="合计" prop="decimals">
            <span>{{form.totalCost}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="title-item">
        <span>开票信息</span>
      </div>

      <el-row>
        <el-col :span="6">
          <el-form-item label="保存至单位库" prop="isSaveToCompany">
            <el-radio-group v-model="form.invoiceToCompany" :disabled="forbidden">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="18" >
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
    <el-table :data="tableData" :max-height="QJTableMaxHeight" style="width: 100%;"  :summary-method="getSummaries" show-summary  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" :selectable='checkboxInit' v-if="rightType==3"></el-table-column>
      <el-table-column label="序号" type="index" width="60"></el-table-column>
      <el-table-column prop="applianceName" label="器具名称" width="180"></el-table-column>
      <el-table-column prop="model" label="型号规格" width="120"></el-table-column>
      <el-table-column prop="equipmentNo" label="设备编号"></el-table-column>
      <el-table-column prop="setNumber" label="套数"></el-table-column>
      <el-table-column prop="pieceNumber" label="件/套"></el-table-column>
      <el-table-column prop="manufacturer" label="制造厂商"></el-table-column>
      <el-table-column prop="certificateNumber" label="证书数量"></el-table-column>
      <el-table-column prop="unitPrice" label="检测单价"></el-table-column>
      <el-table-column prop="afterDiscountPrice" label="折后单价"></el-table-column>
      <el-table-column prop="afterDiscountTotal" label="校准费"></el-table-column>
      <el-table-column prop="detectionMethod" label="检测方式" :formatter="detectionMethod"></el-table-column>
      <el-table-column prop="subcontractArea" label="是否分包" :formatter="subcontractAreaFormat"></el-table-column>
      <el-table-column prop="departName" label=" 校准部门 "></el-table-column>
    </el-table>

    <additionalAppliance :quotationId="this.quotationId || this.$route.query.quotationId "></additionalAppliance>


    <!-- rightType:1 报价审核   2折扣审核  -->
    <template v-if="rightType ==2 || detailType==2" v-show="rightType ==2 || detailType==2">
      <div class="title-item"><span>报价单申请折扣信息</span></div>
      <el-form ref="auditForm" :model="auditForm" :rules="auditFormRules" label-width="140px" size="mini">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请人">{{auditForm.applyPersonName}}</el-form-item>
          </el-col>

          <el-col :span="8">

            <el-form-item label="申请时间">{{ auditForm.addTime|formatDateFifter}}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="申请折扣">{{auditForm.applyDiscount}}</el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="报价金额">{{auditForm.beforeDiscountsTotal}}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="折后金额">{{auditForm.afterDiscountsTotal}}</el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="审核状态">{{auditForm.handleFlag|handleFlagFifter }}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="审核人">{{auditForm.handlePersonName}}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="审核时间">{{auditForm.handleDate|formatDateFifter}}</el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="24">
            <el-form-item label="申请原因">
              <el-input type="textarea" :readonly="true" v-model="auditForm.applyRerson"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="审核意见" prop="handleResult">
              <el-input type="textarea" v-model="auditForm.handleResult" :disabled="detailType==2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>

    <show-more-list v-if="visable" :data="companyMany" :callback="handleCallBack"></show-more-list>
    <br>
    <br>
    <slot name="footer">
      <span slot="footer" class="dialog-footer" style="display: block;  text-align: center;">
           <el-button type="warning" @click="handleBack">返 回</el-button>
      </span>
    </slot>
  </div>
</template>

<script>
  import Vue from 'vue'
  import  additionalAppliance from './additionalAppliance'
  var Big = require('big.js')
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, formatDate,ajaxSyncRequest} from '../../util/base'
  // 引入jquery
  import $ from 'jquery'
  // 引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck'
  import rightClick from '../../../mixins/FormRightClick'
  import ElRow from "@/common-el/packages/row/src/row";

  export default {
    name: 'quotationForm',
    props: {// 用于接收从父组件中传来的数据
      //报价单ID
      quotationId: {
        type: Number
      },
      //右边展示的模式 1 报价审核  2 折扣审核
      rightType: {
        type: Number
      },
      //折扣申请表ID
      applyId: {
        type: Number
      },
      callback: {
        type: Function
      },
      search: {
        type: Function
      }
    },
    components: {ElRow,additionalAppliance},
    data() {
      return {
        form: {},
        auditForm: {},
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
        auditFormRules: {
          // handleResult: [{required: true, message: '审核意见不能为空'}]
        },
        multipleSelection: [],
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
        attachment: '', // 报检单中的附件字段
        forbidden: true, // 表单disabled
        urgentDays: [], // 加急点
        serviceCharges: [], // 现场服务费

        fileList: [], //
        limitNumb: 1, // 附件上传个数限制
        attachIds: '', // 初始化加载附件 [非必填]
        up_url: '',// 自定义上传路径 [非必填]  默认不用修改
        fdata:{//附件上传额外参数
          caseId: "", //登记号       [非必填]  业务相关的登记号
          serverId: "http5", //服务id     [非必填]  分布式附件服务可以用默认不用配制
          flowId: "", //流程id      [非必填]  流程相关
          execType: "签名", //操作类型   [非必填]  业务相关
        },

        //单位下拉
        loading: false,
        remoteOptions: [],
        institutionalNatures: [],
        visable: false,
        flag: false,
        companyMany: null,

        //路由参数 明细类型(组件内，不能修改由外层传来的props数据)
        detailType: null

      }
    },
    mounted() {
      // 页面渲染完成后，ajax请求加载数据
      this.getBusinessGroups()
      this.listUserByBD()
      this.listContractHead()
      this.listAccount()
      this.getIsUrgent()
      this.initDiscount()
    },
    watch: {
      quotationId(val, oldVal) {
        this.rules = {};
        if (val != null) {
          this.getData()
        }else{
          this.form = [];
          this.tableData = [];
        }
      },
      applyId(val, oldVal) {
        if (val != null) {
          this.getDiscountInfo();
        }
      }
    },
    filters: {
      //审核状态格式化
      handleFlagFifter(val) {
        if (val == 0) {
          return '未处理'
        } else if (val == 1) {
          return '已审核'
        } else if (val == 2) {
          return '已退回'
        } else if (val == 3) {
          return '已撤销'
        }
      },
      formatDateFifter(val) {
        return formatDate(val, 'YYYY-MM-DD')
      }
    },
    directives: {rightclick},
    mixins: [rightClick],
    methods: {
      //转过现场任务的不可勾选
      checkboxInit (row, index) {
        if (row.isPlanned == 0) {
          return 1
        } else {
          return 0
        }
      },
      //折扣明细，路由跳转进入
      initDiscount() {
        if (this.$route.query.id) {
          this.getDiscountInfo();
          this.getData()
          this.detailType = 2;
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
        ajaxRequest('get', 'back/businessStaff/StaffByBusinessGroupId?businessGroup=' + businessGroupId, {}, (res) => {
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
        ajaxProxyRequest('get', '/njmind/findParams/urgentDays$serviceCharge', {}, (res) => {
          this.urgentDays = res.urgentDays.list
          this.serviceCharges = res.serviceCharge.list
          Vue.set(this.form, 'serviceCharge', res.serviceCharge.list[0].code)
        })
      },
      // 获取后台数据
      getData() {
        let _this = this
        let quotationId = _this.quotationId || _this.$route.query.quotationId;
        if (quotationId) {
          ajaxSyncRequest('get', 'back/quotation/' + quotationId, {}, (res) => {
            Vue.set(this.form, 'businessGroup', res.daoResult.businessGroup)
            if (this.form.businessGroup) {
              this.businessEvt(this.form.businessGroup + '')
              Vue.set(this.form, 'businessStaff', res.daoResult.businessStaff)
            }
            this.form = res.daoResult;
            this.form.urgentProportionsTemp = res.daoResult.isUrgent + "@@" + res.daoResult.urgentProportions;
            //Vue.set(this.form, 'urgentProportionsTemp', res.daoResult.isUrgent + "@@" + res.daoResult.urgentProportions);
            Vue.set(this.form, 'serviceCharge', res.daoResult.serviceCharge+'');
            this.form.addUser = res.daoResult.addUserName;
            if(res.daoResult.attachment){
              this.$refs.upFiles.loadAttacheIds(res.daoResult.attachment)
            }
            this.serviceCharge = res.daoResult.serviceCharge + "";
          })

          ajaxRequest('get', 'back/quotationAppliance/retrieve', {quotationId: quotationId}, (res) => {
            this.tableData = res.rows
          })
        }
      },
      // 审核
      setAudit() {
        if(!this.quotationId){
          this.$message({type: 'error', message: '没有可操作的报价单!'})
          return ;
        }
        let _this = this
        let userId = localStorage.getItem('userId')
        this.$confirm('确认审核报价单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxRequest('put', 'back/quotation/quotationAudit', {
            id: this.quotationId,
            userId: userId
          }, (res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '审核成功!'})
              this.$emit('search')
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },
      // 是否分包格式化
      subcontractAreaFormat(row, column) {
        if (row.subcontractArea != '1') {
          return '否'
        } else {
          return '是'
        }
      },
      // 检测方式格式化
      detectionMethod(row, column) {
        if (row.detectionMethod == '0') {
          return '现场'
        } else if (row.detectionMethod == '1') {
          return '送检'
        } else if (row.detectionMethod == '2') {
          return '带回'
        }
      },
      // 合计行
      getSummaries(param) {
        let {columns, data} = param
        let sums = []
        columns.forEach((column, index) => {
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

        let index = 0;
        if(this.rightType==3){
          index = 1;
          sums[2] = '合计'
        }else{
          sums[1] = '合计'
        }
        // sums[1+index] = ''

        sums[3+index] = ''
        sums[6+index] = ''
        sums[11+index] = ''
        sums[12+index] = ''
        sums[13+index] = ''
        return sums
      },
      //获取折扣申请信息
      getDiscountInfo() {
        let applyId = this.applyId || this.$route.query.id;
        if (applyId) {
          ajaxRequest('get', 'back/quotationDiscountApply/' + applyId, {}, (res) => {
            this.auditForm = res.daoResult;
          })
        }
      },
      //审核折扣
      auditDiscount() {
        if(!this.quotationId){
          this.$message({type: 'error', message: '没有可操作的报价单!'})
          return ;
        }
        this.$refs.auditForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认审核报价单折扣申请?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              ajaxSyncRequest('post', 'back/quotation/agreeDiscount', {
                id: this.applyId,
                handleResult: this.auditForm.handleResult,
                quotationId: this.quotationId
              }, (res) => {
                if (res.code === 200) {
                  this.$message({type: 'success', message: '审核成功!'})
                  this.$emit('search')
                } else {
                  this.$message({type: 'error', message: '审核失败!'})
                }
              })
            }).catch(() => {
              // 取消操作
            })
          }
        })
      },
      //折扣审核退回
      toBack() {
        if(!this.quotationId){
          this.$message({type: 'error', message: '没有可操作的报价单!'})
          return ;
        }
        this.$refs.auditForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认退回报价单折扣申请?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              ajaxSyncRequest('post', 'back/quotation/toBackDiscount', {
                id: this.applyId,
                quotationId:this.quotationId,
                handleResult: this.auditForm.handleResult
              }, (res) => {
                if (res.code === 200) {
                  this.$message({type: 'success', message: '退回成功!'})
                  this.$emit('search')
                } else {
                  this.$message({type: 'error', message: '退回失败!'})
                }
              })
            }).catch(() => {
              // 取消操作
            })
          }
        })
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
      handleSelect(item) {
        this.visable = false
        this.form.companyId = judgeNull(item.id)
        this.form.companyName = judgeNull(item.companyName)// 委托单位
        Vue.set(this.form, 'numbered', judgeNull(item.contractHead))// 编号抬头
        this.form.customerMobilePhone = judgeNull(item.mobilePhone)// 客户手机
        this.form.customerAddress = judgeNull(item.address)// 客户联系地址
        this.form.customerEmail = judgeNull(item.email)// 客户邮箱
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
      // checkbox选中时候赋值
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      //返回
      handleBack() {
        this.$router.push({
          path: '/admin/346',
          query: {}
        })
      },
      //转现场任务
      toPlan(){
        //查询报价单是否已审核
        let quotationId = this.quotationId || this.$route.query.quotationId;
        if(!quotationId){
          this.$message({type: 'error', message: '没有可操作的报价单!'})
          return ;
        }
        let auditFlag = 0;
        ajaxSyncRequest('get', 'back/quotation/' + quotationId, {}, (res) => {
          auditFlag = res.daoResult.auditFlag
        })

        if(auditFlag==0){
          this.$message({type: 'error', message: '报价单未审核，不可转现场任务!'})
          return;
        }
        if(this.multipleSelection.length==0){
          this.$message({type: 'error', message: '请至少选择一条记录!'})
          return;
        }
        //转排单的器具
        let applianceIds = ""
        this.multipleSelection.forEach((e)=>{
          applianceIds =  applianceIds + e.id+ ','
        })
        if(applianceIds!=""){
          applianceIds = applianceIds.substr(0, applianceIds.length - 1);
        }
        this.$confirm('确认转现场任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxSyncRequest('post', 'back/quotation/toPlan' ,{quotationId:quotationId,applianceIds: applianceIds}, (res) => {
            if(res.code===200){
              //生成计划成功,重新获取数据
              this.$message({type: 'success', message: '生成计划成功'})
              this.getData();
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },
      //删除报价单所有已转任务
      deletePlan(){
        let quotationId = this.quotationId || this.$route.query.quotationId;
        if(!quotationId){
          this.$message({type: 'error', message: '没有可操作的报价单!'})
          return ;
        }
        this.$confirm('确认删除全部已转的现场任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxSyncRequest('post', 'back/quotation/deletePlan', {quotationId: quotationId+''}, (res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '删除计划成功'})
              this.getData();
            }else if (res.code===300){
              this.$message({type: 'warning', message: res.msg});
            }else {
              this.$message({type: 'error', message: '系统错误,删除失败'})
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
