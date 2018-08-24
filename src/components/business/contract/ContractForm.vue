<template>

  <div>
    <div class="title-item"><span>基本信息</span></div>
    <el-form ref="form" :model="form" :rules="rules" size="large" label-width="140px" style="margin-top:10px;">
      <el-row>
        <el-col :span="6">
          <el-form-item prop="contractNo">
            <template slot="label">
              <span>合同编号</span>
              <el-tooltip class="item" effect="dark" content="保存合同时自动生成">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.contractNo" disabled></el-input>
            <span v-show="showFlag">{{form.id}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="报价单编号">
            <el-input v-model="form.quotationNo" disabled></el-input>
            <el-input v-model="form.businessGroup" disabled v-show="showFlag"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="录入人">
            <el-input v-model="form.addUserName" disabled></el-input>
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
            <el-radio-group v-model="form.contractType" :disabled="!!formType">
              <el-radio label="0">普通合同</el-radio>
              <el-radio label="1">年度合同</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="检测周期(工作日)" prop="detectionCycle">
            <el-input v-model="form.detectionCycle" :disabled="!!formType"></el-input>
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
              :disabled="!!formType"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="结帐方式" prop="checkoutMethod">
            <el-radio-group v-model="form.checkoutMethod" :disabled="!!formType">
              <el-radio label="0">现结</el-radio>
              <el-radio label="1">月结(30天)</el-radio>
              <el-radio label="2">月结(60天)</el-radio>
              <el-radio label="3">其他结帐方式</el-radio>
            </el-radio-group>
            <el-input v-model="form.otherCheckoutMethod"
                      placeholder="请输入其他结账方式"
                      :disabled="!!formType"
                      v-if="form.checkoutMethod==3"
                      v-show="form.checkoutMethod==3"
                      style="width: 50%;margin-left: 10px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="合同有效期" prop="typeOfValidity">
            <el-radio-group v-model="form.typeOfValidity" :disabled="!!formType">
              <el-radio label="0">器具检测完毕失效</el-radio>
              <el-radio label="1">指定日期</el-radio>
            </el-radio-group>

            <el-date-picker
              v-model="form.validityPeriod"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled="!!formType"
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
            <el-radio-group v-model="form.repairInformation" :disabled="!!formType">
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
            <el-input v-model="form.additionalTerms" type="textarea" :disabled="!!formType"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="8">
          <el-form-item prop="attachment">
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
                         :disabled="!!formType">
            </mind-upload>
            <el-input v-model="form.attachment" v-show="showFlag"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <slot name="footer">
       <span slot="footer" class="dialog-footer" style="display: block;  text-align: center;">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button @click="resetForm" v-if="!form.id">清 空</el-button>
            <el-button type="success mini" v-if="form.id" @click="toPrint">打 印</el-button>
            <el-button type="primary mini" v-has="'M37110'"
                       v-if="form.id && form.auditFlag==0" @click="setAudit">审 核</el-button>
            <el-button type="warning mini" v-has="'M37110'"
                       v-if="form.id && form.auditFlag==1"
                       @click="cancelAudit">取消审核</el-button>
            <el-button type="warning mini" v-if="form.id"
                       @click="exportContract" v-has="'M37120'">导 出</el-button>
            <el-button type="warning" @click="toBack">返 回</el-button>
     </span>
    </slot>


    <div class="title-item"><span>报价单信息<span style="font-size: 12px">(如需修改请修改报价单)</span></span></div>
    <el-form ref="quotationForm" :model="quotationForm" label-width="140px">
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
              v-model="quotationForm.urgentProportionsTemp"
              disabled>
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
      data: {
        type: Object
      },
      callback: {
        type: Function
      },
      quotationId: {
        type: Number
      },
      id: {
        type: Number
      },
      formType: {
        type: Number
      },
      search: {
        type: Function
      }
    },
    components: {QuotationApplianceList},
    data() {
      return {
        currentDate: new Date().format('YYYY-MM-DD'),
        form: $.extend({}, defaults, this.data || {}),
        quotationForm: {},
        rules: {
          detectionCycle: [{max: 5, message: '检测周期不能超过5个字符', tigger: 'blur'}],
          otherCheckoutMethod: [{max: 70, message: '其他结账方式不能超过70个字符', tigger: 'blur'}],
          additionalTerms: [{max: 600, message: '补充条款不能超过600个字符', tigger: 'blur'}],
        },
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
        serviceCharges: [], // 现场服务费
        bankAccounts: []//// 银行账号下拉
      }
    },
    watch: {
      id: function (val, old) {
        if (val) {
          this.getQuotationDetail()
        } else {
          this.quotationForm = [];
          this.form = [];
          this.$refs.quotationFiles.loadAttacheIds('')
          this.$refs.upFiles.loadAttacheIds('')
        }
      }
    },
    mounted() {
      this.getIsUrgent();
      this.listAccount();
      this.getQuotationDetail();
      this.initData();
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
      // 查询银行账号
      listAccount() {
        ajaxRequest('get', 'back/quotation/listAccount', {}, (res) => {
          this.bankAccounts = res.rows
        })
      },
      //保存
      handleSubmit() {
        let form = this.form;
        if(form.auditFlag==1){
          this.$message.error('已审核，不可修改');
          return;
        }
        delete form.updateTime;
        delete form.updateTime;
        delete form.addTime;
        if (form.checkDate) {
          form.checkDate = new Date(form.checkDate).format("YYYY-MM-DD");
        }
        if (form.validityPeriod) {
          form.validityPeriod = new Date(form.validityPeriod).format("YYYY-MM-DD");
        }
        if (form.typeOfValidity == 0) {
          form.validityPeriod = null;
        }
        if (form.checkoutMethod != 3) {
          form.otherCheckoutMethod = "";
        }
        form.quotationId = this.$route.query.quotationId;
        if (!form.id) {
          //添加
          ajaxSyncRequest('post', "back/contract/", form, (res) => {
            if (res.code == 200) {
              Vue.set(this.form, 'contractNo', res.daoResult.contractNo)
              Vue.set(this.form, 'id', res.daoResult.id)
              Vue.set(this.form, 'auditFlag', res.daoResult.auditFlag)
              this.$message.success('提交成功');
            }
          })
        } else {
          let userId = localStorage.getItem('userId');
          //编辑
          var btnPower = localStorage.getItem("btnPower");
          if (userId!=this.form.addUser && btnPower.indexOf('M37105') == -1) {
            this.$message.warning('无权限修改');
            return;
          }
          form.type = 1;
          ajaxSyncRequest('put', "back/contract/", form, (res) => {
            if (res.code == 200) {
              this.$message.success('修改成功');
            }
          })
        }
      },
      //清空表单
      resetForm() {
        this.$refs['form'].resetFields()
      },
      //返回
      toBack() {
        if (this.$route.query.type == 2) {
          this.$router.push({path: '/admin/372', query: {}})
        } else {
          this.$router.push({path: '/admin/72', query: {}})
        }
      },
      // 获取加急点(数据字典维护)
      getIsUrgent() {
        ajaxProxyRequest('get', '/njmind/findParams/urgentDays$serviceCharge', {}, (res) => {
          this.urgentDays = res.urgentDays.list
          this.serviceCharges = res.serviceCharge.list

        })
      },
      //获取报价单详情
      getQuotationDetail() {
        let quotationId = this.quotationId || this.$route.query.quotationId
        if (quotationId) {
          ajaxRequest('get', 'back/quotation/' + quotationId, {}, (res) => {
            this.quotationForm = res.daoResult;
            this.form.quotationNo = res.daoResult.quotationNo;
            this.form.businessGroup = res.daoResult.businessGroup;
            this.quotationForm.addTime = new Date(res.daoResult.businessGroup).format('YYYY-MM-DD');
            Vue.set(this.quotationForm, 'serviceCharge', res.daoResult.serviceCharge+'');
            this.quotationForm.urgentProportionsTemp = res.daoResult.isUrgent + "@@" + res.daoResult.urgentProportions;
            if (res.daoResult.attachment) {
              this.$refs.quotationFiles.loadAttacheIds(res.daoResult.attachment)
            }
          })
        }
        //获取合同详情
        let id = this.$route.query.id || this.id;
        if (id) {
          ajaxRequest('get', 'back/contract/' + id, {}, (res) => {
            this.form = res.daoResult;
            this.currentDate = new Date(res.daoResult.addTime).format('YYYY-MM-DD');
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
      },
      //合同审核
      setAudit() {
        let id = this.$route.query.id || this.id || this.form.id;
        if (!id) {
          this.$message.warning('没有可审核的合同');
          return;
        }
        this.$confirm('确认审核合同?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = new Object();
          obj.id = id;
          obj.auditFlag = 1;
          obj.type = 2
          ajaxSyncRequest('put', 'back/contract/', obj, (res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '审核成功'});
              if (!!this.formType) {
                //刷新审核列表
                this.$emit('search')
              } else {
                this.form.auditFlag = 1;
              }
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },
      //取消审核
      cancelAudit() {
        let id = this.$route.query.id || this.id || this.form.id;
        this.$confirm('确认取消审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = new Object();
          obj.id = id;
          obj.auditFlag = 0;
          obj.type = 3
          ajaxSyncRequest('put', 'back/contract/', obj, (res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '取消成功'});
              this.form.auditFlag = 0;
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },
      //导出合同清单
      exportContract() {
        //查看是否审核,审核后才可导出清单
        let auditFlag = this.form.auditFlag;
        if (auditFlag == 1) {
          let id = this.$route.query.id || this.id || this.form.id;
          let form = $("<form></form>").attr("action", "/back/contract/contractExport").attr("method", "post");
          form.append($("<input></input>").attr("type", "hidden").attr("name", "isDown").attr("value", "true"));
          form.append($("<input></input>").attr("type", "hidden").attr("name", 'contractId').attr("value", id));
          form.appendTo('body').submit().remove();
        } else {
          this.$message.warning('未审核，不可导出合同清单');
        }
      },
      //打印
      toPrint(){
        let auditFlag = this.form.auditFlag;
        let quotationId = this.quotationId || this.$route.query.quotationId
        if (auditFlag == 1) {
          let id = this.$route.query.id || this.id || this.form.id;
          this.printHtml("contractPrint",{id:id,quotationId:quotationId});
        }else{
          this.$message.warning('未审核，不可打印');
        }
      }
    }
  }


</script>


<style scoped>

.custom-1d74b7 .el-textarea {
    display: inline-block;
    width: 100%;
    vertical-align:text-bottom!important;
    font-size: 14px;
}
</style>
