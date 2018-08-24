<template>
  <div>
    <mind-dialog
      :title="'合同修改历史'"
      :visible="true"
      center
      v-dialogDrag
      dialogSize="large"
      @close="handleCancel">

      <div>
        <div class="title-item"><span>基本信息</span></div>
        <el-form ref="form" :model="form" :rules="rules" label-width="140px" disabled>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="contractNo">
                <template slot="label">
                  <span>合同编号</span>
                  <el-tooltip class="item" effect="dark" content="保存合同时自动生成">
                    <i class="el-icon-info ft12"></i>
                  </el-tooltip>
                </template>
                <el-input v-model="form.contractNo"></el-input>
                <span v-show="showFlag"></span>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="报价单编号">
                <el-input v-model="form.quotationNo"></el-input>
                <el-input v-model="form.businessGroup" disabled v-show="showFlag"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="录入人">
                <el-input v-model="form.addUserName"></el-input>
                <el-input v-model="form.addUser" v-show="showFlag"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="合同时间">
                <el-input v-model="currentDate" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="合同类别" prop="contractType">
                <!--单选 -->
                <el-radio-group v-model="form.contractType">
                  <el-radio label="0">普通合同</el-radio>
                  <el-radio label="1">年度合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="检测周期(工作日)" prop="detectionCycle">
                <el-input v-model="form.detectionCycle"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="上门检测日期" prop="checkDate">
                <el-date-picker
                  v-model="form.checkDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="结帐方式" prop="checkoutMethod">
                <el-radio-group v-model="form.checkoutMethod">
                  <el-radio label="0">现结</el-radio>
                  <el-radio label="1">月结(30天)</el-radio>
                  <el-radio label="2">月结(60天)</el-radio>
                  <el-radio label="3">其他结帐方式</el-radio>
                </el-radio-group>
                <el-input v-model="form.otherCheckoutMethod"
                          placeholder="请输入其他结账方式"
                          v-if="form.checkoutMethod==3"
                          v-show="form.checkoutMethod==3"
                          style="width: 50%;margin-left: 10px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="合同有效期" prop="typeOfValidity">
                <el-radio-group v-model="form.typeOfValidity">
                  <el-radio label="0">器具检测完毕失效</el-radio>
                  <el-radio label="1">指定日期</el-radio>
                </el-radio-group>

                <el-date-picker
                  v-model="form.validityPeriod"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-if="form.typeOfValidity==1"
                  style="margin-left: 10px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="修理信息" prop="repairInformation">
                <el-radio-group v-model="form.repairInformation">
                  <el-radio label="0">修理前需征得委托方同意</el-radio>
                  <el-radio label="1">全权委托修理(在乙方修理能力范围内)</el-radio>
                  <el-radio label="2">不修理</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="补充条款" prop="additionalTerms">
                <el-input v-model="form.additionalTerms" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :span="8">
              <el-form-item  prop="attachment">
                <template slot="label">
                  <span>附件</span>
                  <el-tooltip class="item" effect="dark" content="只可上传一个文件，大小格式不限">
                    <i class="el-icon-info ft12"></i>
                  </el-tooltip>
                </template>
                <mind-upload ref="upFiles"
                             :limitNumb="limitNumb"
                             :data="fdata"
                             disabled
                             :callBack="callBack"
                >
                </mind-upload>
                <el-input v-model="form.attachment" v-show="showFlag"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <slot name="footer">
       <span slot="footer" class="dialog-footer" style="display: block;  text-align: center;">
            <el-button type="warning" @click="handleCancel">关 闭</el-button>
     </span>
        </slot>


        <div class="title-item"><span>报价单信息<span style="font-size: 12px">(如需修改请修改报价单)</span></span></div>
        <el-form ref="quotationForm" :model="quotationForm" label-width="140px" disabled>
          <el-row>

            <el-col :span="6">
              <el-form-item label="报价单编号">
                <el-input v-model="form.quotationNo" disabled></el-input>
                <el-input v-model="form.businessGroup" disabled v-show="showFlag"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="编号抬头" prop="numbered">
                <el-input v-model="quotationForm.numbered" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="录入人" prop="addUser">
                <el-input v-model="quotationForm.addUserName" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="报价日期" prop="currentDate">
                <el-input v-model="quotationForm.addTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>

            <el-col :span="16">
              <el-form-item label="委托单位" prop="companyName">
                <el-input v-model="quotationForm.companyName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :span="6">
              <el-form-item label="客户联系人" prop="customerContact">
                <el-input v-model="quotationForm.customerContact" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="客户电话" prop="customerTelephone">
                <el-input v-model="quotationForm.customerTelephone" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="客户手机" prop="customerMobilePhone">
                <el-input v-model="quotationForm.customerMobilePhone" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="客户邮箱" prop="customerEmail">
                <el-input v-model="quotationForm.customerEmail" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :span="18">
              <el-form-item label="客户联系地址" prop="customerAddress">
                <el-input v-model="quotationForm.customerAddress" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="客户传真" prop="customerFox">
                <el-input v-model="quotationForm.customerFox" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="客户上门检测地址" prop="detectionAddress">
                <el-input v-model="quotationForm.detectionAddress" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item label="证书单位名称" prop="certificateCompanyName">
                <el-input v-model="quotationForm.certificateCompanyName" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="是否出具结论" prop="isConclusion">
                <el-radio-group v-model="quotationForm.isConclusion" disabled>
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item label="证书单位地址" prop="certificateCompanyAddress">
                <el-input v-model="quotationForm.certificateCompanyAddress" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="是否复校" prop="isRecheck">
                <el-radio-group v-model="quotationForm.isRecheck" disabled>
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="业务组" prop="businessArea">
                <el-input v-model="quotationForm.businessArea" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务员" prop="businessStaffName">
                <el-input v-model="quotationForm.businessStaffName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务负责人" prop="chargeName">
                <el-input v-model="quotationForm.chargeName" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="第二负责人" prop="secondChargeName">
                <el-input v-model="quotationForm.secondChargeName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="本单位名称" prop="businessCompanyName">
                <el-input v-model="quotationForm.businessCompanyName" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="本单位地址" prop="businessAddress">
                <el-input v-model="quotationForm.businessAddress" disabled></el-input>
              </el-form-item>
            </el-col>


            <el-col :span="6">
              <el-form-item label="银行账号" prop="bankAccount">
                <el-select
                  placeholder="请选择"
                  value-key="name"
                  v-model="quotationForm.bankAccount" style="width: 100%" disabled >
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
                <el-input v-model="quotationForm.businessTelephone" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务员手机" prop="businessMobilePhone">
                <el-input v-model="quotationForm.businessMobilePhone" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务员邮箱" prop="businessEmail">
                <el-input v-model="quotationForm.businessEmail" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="报价单备注" prop="remark">
                <el-input v-model="quotationForm.remark" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="附件">
                <mind-upload ref="quotationFiles"
                             :limitNumb="limitNumb"
                             :data="fdata"
                             :callBack="callBack"
                             disabled
                >
                </mind-upload>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :span="6">
              <el-form-item label="是否加急" prop="businessStaff">
                <el-select
                  placeholder="请选择"
                  v-model="quotationForm.urgentProportions"
                  disabled
                >
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
                <el-input v-model="quotationForm.postage" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="交通费" prop="carFare">
                <el-input v-model="quotationForm.carFare" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="现场服务费" prop="serviceCharge">
                <el-select
                  placeholder="请选择"
                  value-key="name"
                  v-model="quotationForm.serviceCharge"
                  disabled>
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
                <span>{{quotationForm.totalCost}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="title-item" v-if="!!this.formType"><span>器具信息</span></div>
          <QuotationApplianceList ref="basicInfo" :quotationId="this.quotationId" :contractFlag="1"
                                  v-if="!!this.formType"></QuotationApplianceList>
        </el-form>


      </div>
    </mind-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest} from '../../util/base'
  import QuotationApplianceList from '../quotation/QuotationApplianceList'
  // 引入jquery
  import $ from 'jquery'
  // 引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck'
  import rightClick from '../../../mixins/FormRightClick'

  const defaults = {
    contractType: '0',//合同类别
    checkoutMethod: '0',//结帐方式
    typeOfValidity: '0',//合同有效期
    repairInformation: '0',//修理信息
  };

  export default {
    name: "contractForm",
    props: {//用于接收从父组件中传来的数据
      callback: {
        type: Function
      },
      backId: {
        type: String
      }
    },
    components: {QuotationApplianceList},
    data() {
      return {
        currentDate: new Date().format('YYYY-MM-DD'),
        form: $.extend({}, defaults, this.data || {}),
        quotationForm: {},
        rules: {},
        loading: false,
        showFlag: false,

        /*****附件上传需要的参数********/
        fileList: [], //
        limitNumb: 1, // 附件上传个数限制
        attachIds: '', // 初始化加载附件 [非必填]
        up_url: '',// 自定义上传路径 [非必填]  默认不用修改
        fdata: {
          caseId: '', // 登记号       [非必填]  业务相关的登记号
          serverId: 'http5', // 服务id     [非必填]  分布式附件服务可以用默认不用配制
          flowId: '', // 流程id      [非必填]  流程相关
          execType: '签名', // 操作类型   [非必填]  业务相关
        },

        businessGroups: [],
        businessStaffs: [],
        charges: [],
        urgentDays: [],
        serviceCharges: [], //
        bankAccounts: []//// 银行账号下拉
      }
    },
    mounted() {
      this.getIsUrgent();
      this.listAccount();
      this.initData();
      this.getContractDetail();
    },
    directives: {rightclick},
    mixins: [rightClick],
    methods: {
      remoteMethod() {
        //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
      },
      //文件上传回调
      callBack(file, list) {
        this.fileList = list;
        this.form.attachment = this.fileList[0].id;
      },
      //关闭
      handleCancel() {
        this.callback();
      },
      // 获取加急点(数据字典维护)
      getIsUrgent() {
        ajaxProxyRequest('get', '/njmind/findParams/urgentDays$serviceCharge', {}, (res) => {
          this.urgentDays = res.urgentDays.list
          this.serviceCharges = res.serviceCharge.list

        })
      },
      // 查询银行账号
      listAccount() {
        ajaxRequest('get', 'back/quotation/listAccount', {}, (res) => {
          this.bankAccounts = res.rows
        })
      },
      //获取报价单详情
      getQuotationDetail(quotationId) {
        if (quotationId) {
          ajaxRequest('get', 'back/quotation/' + quotationId, {}, (res) => {
            this.quotationForm = res.daoResult;
            this.form.quotationNo = res.daoResult.quotationNo;
            this.form.businessGroup = res.daoResult.businessGroup;
            if (res.daoResult.attachment) {
              this.$refs.quotationFiles.loadAttacheIds(res.daoResult.attachment)
            }
          })
        }
      },
      getContractDetail() {
        //获取合同详情
        let id = this.backId;
        if (id) {
          ajaxRequest('get', 'back/contract/getContractByBackId', {backId: id}, (res) => {
            console.log(res);
            this.form = res.daoResult;
            if (res.daoResult.quotationId) {
              this.getQuotationDetail(res.daoResult.quotationId);
            }
            if (res.daoResult.attachment) {
              this.$refs.upFiles.loadAttacheIds(res.daoResult.attachment)
            }
          })
        }


      },
      //初始化参数
      initData() {
        this.form.addUserName = localStorage.getItem('userName')
        this.form.addUser = localStorage.getItem('userId')
      }
    },
  }


</script>


<style scoped>


</style>
