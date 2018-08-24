<template>
  <mind-dialog
    :title="'报价单历史记录'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="large"
    @close="handleCancel">

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
                  :value="item.numbered">
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
              <el-input v-model="currentDate" disabled></el-input>
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
          <el-col :span="24">
            <el-form-item label="客户上门检测地址" prop="detectionAddress">
              <el-input v-model="form.detectionAddress" :disabled="forbidden"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item prop="certificateCompanyName">
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
            <el-form-item prop="isConclusion">
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
              <el-select
                placeholder="请选择"
                value-key="name"
                @change="businessEvt"
                v-model="form.businessGroup"
                :disabled="forbidden" style="width:100%;">
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
              <el-select style="width:100%;"
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
              <el-select
                placeholder="请选择" style="width:100%;"
                value-key="name"
                v-model="form.charge"
                :disabled="forbidden">
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
              <el-select
                placeholder="请选择"
                value-key="name"
                v-model="form.secondCharge"
                :disabled="forbidden">
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
              <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
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
                           :serverId="serverId"
                           :execType="execType"
                           :callBack="callBack" disabled>
              </mind-upload>
              <el-input v-model="form.attachment" v-show="show"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="是否加急" prop="urgentProportions">
              <el-select
                placeholder="请选择"
                value-key="name"
                v-model="form.urgentProportions" :disabled="forbidden" style="width:100%;">
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


        <div class="title-item"><span>开票信息</span></div>
        <el-row style="margin-top:10px;">
          <el-col :span="6">
            <el-form-item label="保存至单位库" prop="isSaveToCompany">
              <el-radio-group v-model="form.invoiceToCompany" :disabled="forbidden">
                <el-radio label="0">否</el-radio>
                <el-radio label="1" :disabled="this.invoiceToCompany!='1'">是</el-radio>
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

      <show-more-list v-if="visable" :data="companyMany" :callback="handleCallBack"></show-more-list>
      <br>
      <br>
      <slot name="footer">
      <span slot="footer" class="dialog-footer" style="display: block;  text-align: center;">
          <el-button @click="handleCancel">关 闭</el-button>
      </span>
      </slot>
    </div>


  </mind-dialog>

</template>

<script>
  import Vue from 'vue'

  var Big = require('big.js')


  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, formatDate, ajaxSyncRequest} from '../../util/base'
  // 引入jquery
  import $ from 'jquery'
  export default {
    name: "quotationHistoryDetail",
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        form: {},
        rules: {
          companyId: [{type: 'string', required: true, message: '单位不能为空'}],
          numbered: [{type: 'string', required: true, message: '编号抬头不能为空'}],
          customerContact: [{type: 'string', required: true, message: '客户联系人不能为空'}, {
            max: 20,
            message: '客户联系人不能超过20个字符',
            tigger: 'blur'
          }],
          customerTelephone: [{type: 'string', required: true, message: '客户电话不能为空'}, {
            max: 20,
            message: '客户电话不能超过20个字符',
            tigger: 'blur'
          }],
          customerMobilePhone: [{type: 'string', required: true, message: '客户手机不能为空'}, {
            max: 20,
            message: '客户手机不能超过20个字符',
            tigger: 'blur'
          }],
          customerAddress: [{type: 'string', required: true, message: '客户联系地址不能为空'}, {
            max: 100,
            message: '客户联系地址不能超过100个字符',
            tigger: 'blur'
          }],
          detectionAddress: [{type: 'string', required: true, message: '上门检测地址不能为空'}, {
            max: 200,
            message: '上门检测地址不能超过200个字符',
            tigger: 'blur'
          }],
          businessGroup: [{type: 'string', required: true, message: '业务组不能为空'}],
          businessStaff: [{type: 'string', required: true, message: '业务员不能为空'}],
          bankAccount: [{type: 'string', required: true, message: '银行账号不能为空'}],
          charge: [{required: true, message: '业务负责人不能为空'}],
          customerEmail: [{type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}],
          businessEmail: [{type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}]
        },
        multipleSelection: [],
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
        caseId: '', // 登记号       [非必填]  业务相关的登记号
        attachIds: '', // 初始化加载附件 [非必填]
        serverId: 'http5', // 服务id     [非必填]  分布式附件服务可以用默认不用配制
        flowId: '', // 流程id      [非必填]  流程相关
        execType: '签名', // 操作类型   [非必填]  业务相关
        up_url: '',// 自定义上传路径 [非必填]  默认不用修改


        //单位下拉
        loading: false,
        remoteOptions: [],
        institutionalNatures: [],
        visable: false,
        flag: false,
        companyMany: null,
      }
    },
    components: {},
    mounted() {
      // 页面渲染完成后，ajax请求加载数据
      this.getBusinessGroups()
      this.listUserByBD()
      this.listContractHead()
      this.listAccount()
      this.getIsUrgent()
      this.getData()


    },
    methods: {
      handleCancel() {
        this.callback();
      },
      //转过现场任务的不可勾选
      checkboxInit(row, index) {
        if (row.isPlanned == 0) {
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
        })
      },
      // 获取后台数据
      getData() {
        let backId = this.data.backId;//备份表ID
        if(backId){
            ajaxRequest('get', 'back/quotation/getQuotationBack', {backId:backId}, (res) => {
              Vue.set(this.form, 'businessGroup', res.daoResult.businessGroup)
              if (this.form.businessGroup) {
                this.businessEvt(this.form.businessGroup + '')
                Vue.set(this.form, 'businessStaff', res.daoResult.businessStaff)
              }
              this.form = res.daoResult
              this.$refs.upFiles.loadAttacheIds(res.daoResult.attachment)
            })
        }
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
    }
  }
</script>

<style scoped>

</style>
