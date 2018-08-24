<template>
  <div>
    <div v-show="specialDwRemark" style="margin-left:10px;margin-bottom: 10px;color:red;font-size:14px">
      <p>
        <!--上门特殊要求：-->
        {{visitSpecialRequirement}}
      </p>

      <p>
        <!--证书特别要求：-->
        {{certificateRequirement}}
      </p>

      <p>
        <!--其他特殊要求：-->
        {{otherSpecialRequirement}}
      </p>
    </div>

    <div class="baseDetail title-item flex mb20">
      <span class="flex-one">基本信息</span>
      <div>
        <global-tootips>
          <p>1、 若有权限，可在本页面添加新的委托单位信息；</p>
          <p>2、若有权限，可在本页面添加新的计量器具信息；</p>
          <p>3、 当器具实际名称、型号规格有值时，重新输入器具名称系统将不重新带入；</p>
          <p>4、若该登记号无需出具证书报告，可点击证书数量后方无需出证按钮；</p>
          <p>5、系统依据器具岗位自动按工作量计算检测期限，若计算有误，通常为节假日未维护；</p>
          <p>6、 委托单位：（单位类别），红色：未审核，[客户对接部门]；</p>
          <p>7、 器具名称：Y为资质项目，J：价格，B：检测部门，F：服务类型，X：型号规格，C：测量范围；</p>
          <p>8、 当通过EXCEL导入时，系统依据器具名称与计量器具库中器具名称、别名进行匹配，若匹配中系统自动带入相应信息，匹配不中时需手动输入器具名称；</p>
          <p>9、 若计量器具库信息维护完善，录入器具名称后，系统自动带入器具实际名称、检测部门、检测岗位、型号规格、检测参数、是否强检、器具用途等信息；</p>
          <p>10、有权限人员可将该开票信息同步至委托单位库中</p>
        </global-tootips>
      </div>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" style="margin-top:10px;">
      <el-Row>
        <el-col :span="6">
          <el-form-item prop="quotationNo">
            <template slot="label">
              <span>报价单编号</span>
              <el-tooltip class="item" effect="dark" content="保存报价单时自动生成。规则B+编号抬头+YY(年)+MM(月)+DD(日)+流水号">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.quotationNo" disabled></el-input>
            <el-input v-model="form.id" v-show="show"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="编号抬头" prop="numbered">
            <el-select style="width:100%;"
                       placeholder="请选择"
                       value-key="numbered"
                       :disabled="!!form.id"
                       v-model="form.numbered">
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
            <el-input v-model="form.addUserName" disabled></el-input>
            <el-input v-model="form.addUser" v-show="show"></el-input>
            <el-input v-model="form.isInquiry" v-show="show"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="报价日期" prop="currentDate">
            <el-input v-model="currentDate" disabled></el-input>
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
            >
              <template slot-scope='scope'>
                <div>
                  <span style="margin-left:0">({{scope.item.companyType}}) {{scope.item.companyName}}
                     (<span :style="{color:scope.item.status == 0 ? 'red' : 'green'}">{{scope.item.status == 0 ? '未审核' : '已审核'}}</span>)
                     {{!!scope.item.companyDepart ? '['+scope.item.companyDepart+']' : ''}}
                     {{!!scope.item.contacter ? '['+scope.item.contacter+']' : ''}}
                     {{!!scope.item.mobilePhone ? '['+scope.item.mobilePhone+']' : ''}}
                  </span>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>

        <el-col :span="2" v-has="'M7130'" style="text-align: center;padding:6px;">
          <el-button type="primary" @click="addCompany" size="mini" class="but-tjdw">添加单位</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="客户联系人" prop="customerContact">
            <el-input v-model="form.customerContact" :disabled="forbidden" style="width: 100%"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="客户电话" prop="customerTelephone">
            <el-input v-model="form.customerTelephone" :disabled="forbidden" style="width: 100%"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="客户手机" prop="customerMobilePhone">
            <el-input v-model="form.customerMobilePhone" :disabled="forbidden" style="width: 100%"></el-input>
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
          <el-form-item prop="certificateCompanyName">
            <template slot="label">
              <span>证书单位名称</span>
              <el-tooltip class="item" effect="dark" content="如无默认为委托单位名称">
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
              <el-tooltip class="item" effect="dark" content="如无默认为客户联系地址">
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
            <el-select class="bigwidth"
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
                :value="item.businessGroup+''">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="业务员" prop="businessStaff">
            <el-select class="bigwidth"
                       placeholder="请选择"
                       value-key="name"
                       @change="handleChange"
                       v-model="form.businessStaff"
                       :disabled="forbidden" style="width: 100%">
              <el-option
                v-for="item in businessStaffs"
                :key="item.staff"
                :label="item.staffName"
                :value="item.staff+''"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="业务负责人" prop="charge">
            <el-select class="bigwidth"
                       placeholder="请选择"
                       value-key="name"
                       v-model="form.charge"
                       :disabled="forbidden" style="width: 100%">
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
            <el-select class="bigwidth"
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

      <el-row>
        <el-col :span="24">
          <el-form-item label="报价单备注" prop="remark">
            <el-input v-model="form.remark" :disabled="forbidden"></el-input>
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
                         :callBack="callBack">
            </mind-upload>
            <el-input v-model="form.attachment" v-show="show"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <div class="baseDetail title-item flex mb20">
        <span class="flex-one">开票信息</span>
      </div>
      <el-row>
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

      <show-more-list v-if="visable" :data="companyMany" :callback="handleCallBack"></show-more-list>
    </el-form>
    <br>
    <br>
    <span slot="footer" class="dialog-footer" style="display: block;  text-align: center;">
            <el-button type="success" plain v-if="form.id" @click="printQuotation">报价单打印</el-button>
            <el-button type="warning" v-if="form.id" @click="exportQuotation" v-has="'M7145'">导出</el-button>
            <el-button type="warning" @click="updateNewFlag" v-if="newFlag" v-show="newFlag">完成修改</el-button>
            <el-button type="primary" @click="toNew" v-if="form.id" v-has="'M7165'">生成新报价单</el-button>
            <el-button type="warning" @click="unAudit" v-has="'M7101'" v-if="auditFlag==1">取消审核</el-button>
            <el-button type="primary" @click="setAudit" v-has="'M7101'" v-else-if="form.id">审核</el-button>
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button class="but-qk" @click="resetForm" v-if="!form.id">清 空</el-button>
            <el-button  @click="toBack" v-if="this.$route.query.id">返 回</el-button>
         </span>
    <!-- 添加单位 -->
    <addCompanyCommon v-if="addCompanyFlag" :callback="setCompanyInfo"></addCompanyCommon>
  </div>


</template>

<script>
  import Vue from 'vue'
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest} from '../../util/base'
  // 引入jquery
  import $ from 'jquery'
  // 引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck'
  import rightClick from '../../../mixins/FormRightClick'
  import showMoreList from '../plan/showMoreList'
  import addCompanyCommon from './addCompanyCommon';

  const defaults = {}

  export default {
    name: 'quotationForm',
    props: {// 用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      callback: {
        type: Function
      },
      setCompanyId: {
        type: Function
      }
    },
    components: {showMoreList, addCompanyCommon},
    data() {
      let nameCheck = (rule, value, cb) => {
        if (!value) {
          cb(new Error('单位名称不能为空！'))
        }
        if (!!this.form.companyId) {
          if (this.companyName != this.form.companyName) {
            cb(new Error('必须选用给定的数据！'))
          } else {
            cb()
          }
        } else {
          cb(new Error('必须选用给定的数据！'))
        }
      }

      let numberCheck = (rule, value, callback) => {
        let reg = /^[0-9]*$/;
        if (value) {
          if (!reg.test(value)) {
            callback(new Error('请输入纯数字'));
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      return {
        form: $.extend({}, defaults, this.data || {}),
        addUserName: '',
        isInquiry: 0,
        companyName: null,
        currentDate: new Date().format('YYYY-MM-DD'),
        rules: {
          companyName: [{type: "string", required: true, validator: nameCheck, trigger: 'change'}],
          //companyId: [{type: 'string', required: true, message: '单位不能为空'}],
          numbered: [{type: 'string', required: true, message: '编号抬头不能为空', tigger: 'blur'}],
          customerContact: [{type: 'string', required: true, message: '客户联系人不能为空', tigger: 'blur'}, {
            max: 20,
            message: '客户联系人不能超过20个字符',
            tigger: 'blur'
          }],
          customerTelephone: [
            {type: "string", required: true, message: '客户电话不能为空'},
            {max: 20, message: '客户电话不能超过20个字符'},
            {validator: numberCheck},
          ],
          customerMobilePhone: [
            {type: 'string', required: true, message: '客户手机不能为空'},
            {max: 20, message: '客户手机不能超过20个字符', tigger: 'blur'},
            {validator: numberCheck}
          ],

          businessMobilePhone: [
            {max: 20, message: '业务员手机不能超过20个字符', tigger: 'blur'},
            {validator: numberCheck}
          ],

          businessTelephone: [
            {max: 20, message: '业务员电话不能超过20个字符', tigger: 'blur'}
          ],

          customerAddress: [
            {type: 'string', required: true, message: '客户联系地址不能为空'},
            {max: 200, message: '客户联系地址不能超过200个字符', tigger: 'blur'}
          ],
          detectionAddress: [
            {type: 'string', required: true, message: '上门检测地址不能为空'},
            {max: 200, message: '上门检测地址不能超过200个字符', tigger: 'blur'}
          ],
          customerFox: [
            {max: 20, message: '客户传真不能超过20个字符', tigger: 'blur'}
          ],
          remark: [
            {max: 200, message: '备注不能超过200个字符', tigger: 'blur'}
          ],
          certificateCompanyAddress: [
            {max: 100, message: '证书单位地址不能超过100个字符', tigger: 'blur'}
          ],

          certificateCompanyName: [{
            max: 100,
            message: '证书单位名称不能超过100个字符',
            tigger: 'blur'
          }],

          businessGroup: [{type: 'string', required: true, message: '业务组不能为空', tigger: 'input'}],
          businessStaff: [{type: 'string', required: true, message: '业务员不能为空', tigger: 'input'}],
          bankAccount: [{type: 'string', required: true, message: '银行账号不能为空', tigger: 'input'}],
          charge: [{required: true, message: '业务负责人不能为空'}],

          businessCompanyName: [{max: 100, message: '本单位名称不能超过100个字符', tigger: 'blur'}],
          businessAddress: [{max: 100, message: '本单位地址不能超过100个字符', tigger: 'blur'}],
          customerEmail: [
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'},
            {max: 50, message: '邮箱不能超过50个字符', tigger: 'blur'}
          ],
          businessEmail: [
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'},
            {max: 50, message: '邮箱不能超过50个字符', tigger: 'blur'}
          ],
          //开票信息验证
          invoiceCompany: [{type: 'string', max: 100, message: '名称不能超过100个字符', tigger: 'blur'}],
          taxNo: [{type: 'string', max: 100, message: '纳税人识别号不能超过100个字符', tigger: 'blur'}],
          invoiceAddressTel: [{type: 'string', max: 100, message: '地址、电话不能超过100个字符', tigger: 'blur'}],
          accountBankNo: [{type: 'string', max: 100, message: '开户行及账号不能超过100个字符', tigger: 'blur'}],
        },
        remoteOptions: [],
        visable: false,
        flag: false,
        companyMany: null,

        businessGroups: [], // 业务组
        businessStaffs: [], // 业务员
        businessStaffsTemp: [],
        charges: [], // 负责人
        secondCharges: [], // 第二负责人
        numbereds: [], // 编号抬头
        bankAccounts: [], // 银行账号下拉
        show: false, // 控制隐藏域是否显示
        quotationId: '',
        attachment: '', // 报检单中的附件字段
        forbidden: false, // 表单disabled

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
        auditFlag: 0,

        /** 单位特殊要求***/
        specialDwRemark: false,
        visitSpecialRequirement: "",//上门特殊要求
        otherSpecialRequirement: "",//其他特殊要求
        certificateRequirement: "",//证书特别要求
        addCompanyFlag: false,
        /**  生成的报价单标记  ***/
        newFlag: false

      }
    },
    computed: {
      //保存开票信息到单位库权限
      invoiceToCompany: function () {
        let btnPower = localStorage.getItem('btnPower');
        if (btnPower.indexOf('M7150') != -1) {
          return '1';//有权限，默认选中
        } else {
          return '0';
        }
      }
    },
    mounted() {
      // 页面渲染完成后，ajax请求加载数据
      this.getBusinessGroups()
      this.listUserByBD()
      this.listContractHead()
      this.listAccount()
      this.getFormData()
    },
    directives: {rightclick},
    mixins: [rightClick],
    methods: {
      // 业务员改变事件
      handleChange(v) {
        Vue.set(this.form, 'businessStaff', v);
        if (v != "") {
          let staffId = "";
          //遍历获取到业务员的ID
          this.businessStaffs.forEach(s => {
            if (v == s.staff) {
              staffId = s.id
            }
          })
          if (staffId) {
            ajaxSyncRequest('get', 'back/quotation/getBusinessStaffInfo', {
              id: this.form.businessStaff,
              groupId: this.form.businessGroup
            }, (res) => {
              let obj = res.map;
              Vue.set(this.form, 'numbered', judgeNull(obj.CONTRACTHEAD))// 编号抬头
              this.form.businessAddress = judgeNull(obj.STAFFADDRESS)// 本单位地址
              this.form.businessCompanyName = judgeNull(obj.STAFFCOMPANYNAME)// 本单位名称
              this.form.businessEmail = judgeNull(obj.STAFFEMAIL)// 业务员邮箱
              this.form.businessMobilePhone = judgeNull(obj.STAFFMOBILEPHONE)// 业务员手机
              this.form.businessTelephone = judgeNull(obj.STAFFTELEPHONE)// 业务员电话
            })
          }
        }
      },
      // 清空表单
      resetForm() {
        this.$refs['form'].resetFields()
        this.getFormData()
      },
      callBack(file, list) {
        this.fileList = list;
        this.form.attachment = this.fileList[0].id;
      },
      // 获取业务组
      getBusinessGroups() {
        ajaxRequest('get', 'back/businessStaff/getBusinessGroupName', {}, (res) => {
          this.businessGroups = res
        })
      },
      // 根据业务组ID查询业务员
      businessEvt(businessGroupId) {
        if (businessGroupId) {
          ajaxSyncRequest('get', 'back/businessStaff/StaffByBusinessGroupId?businessGroup=' + businessGroupId, {}, (res) => {
            this.businessStaffs = res
            Vue.set(this.form, 'businessStaff', '')
          })
        }
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
        this.companyName = judgeNull(item.companyName)// 委托单位
        console.log(item.contractHead, 'contractHead');
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
        //上门,证书，其他 特殊要求
        if (judgeNull(item.visitSpecialRequirement) || judgeNull(item.otherSpecialRequirement) || judgeNull(item.certificateRequirement)) {
          this.visitSpecialRequirement = '上门特殊要求:' + item.visitSpecialRequirement;
          this.otherSpecialRequirement = '其它特殊要求:' + item.otherSpecialRequirement;
          this.certificateRequirement = '证书特殊要求:' + item.certificateRequirement;
          this.specialDwRemark = true;
        } else {
          this.specialDwRemark = false;
        }
        // 多地址选择
        if (item.many == '1') {
          this.companyMany = item.id
          this.visable = true
        } else {
          this.form.customerContact = judgeNull(item.contacter)// 客户联系人
          this.form.customerTelephone = judgeNull(item.telephone)// 客户电话
          this.form.customerFox = judgeNull(item.fax)// 客户传真
          let zsName = judgeNull(item.certificateCompanyname);
          if(zsName){
            this.form.certificateCompanyName = judgeNull(item.certificateCompanyname);
          }else{
            this.form.certificateCompanyName = this.form.companyName;
          }
          this.form.detectionAddress = judgeNull(item.scenetestingAddress);// 上门检测地址
          this.form.certificateCompanyAddress = judgeNull(item.address)// 证书单位地址
        }
        this.$refs.form.validate()
      },
      handleResult(res) {
        for (let key in res) {
          Vue.set(res[key], 'value', res[key].companyName)
        }
      },

      /* 多单位信息选择后赋值 **/
      handleCallBack(val) {
        if (val) {
          this.form.customerContact = judgeNull(val.contacter)// 客户联系人
          this.form.customerTelephone = judgeNull(val.telephone)// 客户电话
          this.form.customerFox = judgeNull(val.fax)// 客户传真
          this.form.detectionAddress = judgeNull(val.visitTestAddress)// 上门检测地址
          this.form.certificateCompanyAddress = judgeNull(val.address)// 证书单位地址
          this.form.certificateCompanyName = judgeNull(val.certificateCompanyName) // 证书单位名称
        }
        this.visable = false
      },
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.form.id) {
              // 新增
              ajaxRequest('post', 'back/quotation/', {
                quotation: JSON.stringify(this.form)
              }, res => {
                if (res.code === 200) {
                  this.$message.success('新增成功')
                  // 保存成功后，传递ID值
                  this.form.id = res.daoResult.id
                  this.callback(res.daoResult.id)
                  this.setCompanyId(res.daoResult.companyId)
                  this.form.auditFlag = 0;
                  this.auditFlag = 0;
                  Vue.set(this.form, 'quotationNo', res.daoResult.quotationNo)
                } else {
                  this.$message.error('新增失败')
                }
              })
            } else {
              let userId = localStorage.getItem('userId');
              let btnPower = localStorage.getItem('btnPower');
              let businessStaff = null;
              //审核后，如果没有 按纽_报价单审核后可改权限  不可修改,
              let auditFlag = this.auditFlag;
              if (auditFlag == 1 && btnPower.indexOf('M7170')==-1) {
                this.$message.error('报价已审核,不可进行修改！');
                return;
              }
              //判断是否有权限修改，无权限只能修改当前业务员的报价单
              ajaxSyncRequest('get', 'back/quotation/' + this.$route.query.id, {}, (res) => {
                businessStaff = res.daoResult.businessStaff
              })
              if (userId != businessStaff && btnPower.indexOf('M7125') == -1) {
                this.$message.warning('无权限操作！');
                return;
              }
              //修改
              ajaxSyncRequest('put', 'back/quotation/', {
                quotation: JSON.stringify(this.form)
              }, res => {
                if (res.code === 200) {
                  this.$message.success('修改成功')
                  this.setCompanyId(res.daoResult.companyId);
                } else {
                  this.$message.error('修改失败')
                }
              })
            }
          } else {
            return false
          }
        })
      },
      // 获取表单明细
      getFormData() {
        let userName = localStorage.getItem('userName')
        let userId = localStorage.getItem('userId')
        if (this.$route.query.id) {
          //查看明细
          this.callback(this.$route.query.id)
          ajaxRequest('get', 'back/quotation/' + this.$route.query.id, {}, (res) => {
            Vue.set(this.form, 'businessGroup', res.daoResult.businessGroup)
            if (this.form.businessGroup) {
              this.businessEvt(this.form.businessGroup + '')
              Vue.set(this.form, 'businessStaff', res.daoResult.businessStaff + '')
            }
            this.form.addUserName = res.daoResult.addUserName
            this.form.addUser = res.daoResult.addUser
            this.form = res.daoResult;
            this.companyName = res.daoResult.companyName;
            this.auditFlag = res.daoResult.auditFlag;
            this.newFlag = res.daoResult.newFlag == 1;
            // 加载附件
            if (res.daoResult.attachment) {
              this.$refs.upFiles.loadAttacheIds(res.daoResult.attachment)
            }
            if (res.daoResult.visitSpecialRequirement || res.daoResult.otherSpecialRequirement || res.daoResult.certificateRequirement) {
              this.visitSpecialRequirement = '上门特殊要求:' + res.daoResult.visitSpecialRequirement;
              this.otherSpecialRequirement = '其它特殊要求:' + res.daoResult.otherSpecialRequirement;
              this.certificateRequirement = '证书特殊要求:' + res.daoResult.certificateRequirement;
              this.specialDwRemark = true;
            }
          })
        } else if (this.$route.params.obj && this.$route.params.obj.mergeXh) {
          this.form.addUserName = userName
          this.form.addUser = userId
          //外送报检转报价单
          ajaxRequest('get', 'back/olBooking/findMergeInfo', {xh: this.$route.params.obj.mergeXh, source: 2}, (res) => {
            let item = res.map.olBookingTotal;
            Vue.set(this.form, 'customerContact', item.lxr)//联系人
            this.form.customerTelephone = item.lxdh;//联系电话
            this.form.customerFox = item.cz;//传真
            this.form.certificateCompanyName = item.zsdw;//证书单位
            this.form.certificateCompanyAddress = item.zsdz;//证书地址
            this.form.detectionAddress = item.dz;//上门检测地址
            this.form.customerAddress = item.dz;//客户联系地址
            this.form.remark = item.bz;//备注
            //单位库信息
            let company = res.map.company;
            //上门,证书，其他 特殊要求
            if (company.visitSpecialRequirement || company.otherSpecialRequirement || company.certificateRequirement) {
              this.visitSpecialRequirement = '上门特殊要求:' + company.visitSpecialRequirement;
              this.otherSpecialRequirement = '其它特殊要求:' + company.otherSpecialRequirement;
              this.certificateRequirement = '证书特殊要求:' + company.certificateRequirement;
              this.specialDwRemark = true;
            }
            this.companyName = company.companyName;
            this.form.companyName = company.companyName;//单位名称
            this.form.companyId = item.erpDwId;
            this.form.businessGroup = company.businessGroup + '';//业务组
            if (this.form.businessGroup) {
              this.businessEvt(this.form.businessGroup + '')
              this.form.businessStaff = company.businessStaff + '';//业务员
            }
            this.form.invoiceToCompany = this.invoiceToCompany;
            this.form.isConclusion = '1';
            this.form.isRecheck = '1';
            if (item.bjType == 2) {
              //客户询价，增加标记,在报价受理后，业务流程结束，控制其流程。
              this.form.isInquiry = 1;
            }
            //业务员业务组信息
            if (this.form.businessStaff) {
              ajaxSyncRequest('get', 'back/quotation/getBusinessStaffInfo', {
                id: this.form.businessStaff,
                groupId: this.form.businessGroup
              }, (res) => {
                let obj = res.map;
                if (judgeNull(obj.BANKID)) {
                  Vue.set(this.form, 'bankAccount', judgeNull(obj.BANKID) + '')// 银行账号
                }
                this.form.numbered = judgeNull(obj.CONTRACTHEAD);// 编号抬头
                this.form.businessAddress = judgeNull(obj.STAFFADDRESS)// 本单位地址
                this.form.businessCompanyName = judgeNull(obj.STAFFCOMPANYNAME)// 本单位名称
                this.form.businessEmail = judgeNull(obj.staffEmail)// 业务员邮箱
                this.form.businessMobilePhone = judgeNull(obj.staffMobilePhone)// 业务员手机
                this.form.businessTelephone = judgeNull(obj.staffTelephone)// 业务员电话
              })
            }
            //开票信息
            this.form.invoiceCompany = company.invoiceCompany// 开票单位
            this.form.taxNo = company.taxNo// 税号
            this.form.invoiceAddressTel = company.invoiceAddressTel// 开票电话,开票地址
            this.form.accountBankNo = company.accountBankNo // 开户行,银行账号
          });
        } else {
          // 一些初始化参数
          Vue.set(this.form, 'invoiceToCompany', this.invoiceToCompany)
          Vue.set(this.form, 'isConclusion', '1')
          Vue.set(this.form, 'isRecheck', '1')
          let userName = localStorage.getItem('userName')
          let userId = localStorage.getItem('userId')
          this.form.addUserName = userName
          this.form.addUser = userId
        }
      },
      //返回
      toBack() {
        let path = '/admin/72';
        if (this.$route.query.isBack == 1) {
          //异常报价
          path = '/admin/462'
        }
        this.$router.push({path: path, query: {}})
      },
      //审核
      setAudit() {
        let id = this.form.id || this.$route.query.id;
        this.$confirm('确认审核报价单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxSyncRequest('put', 'back/quotation/quotationAudit', {
            id: id
          }, (res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '审核成功!'})
              this.auditFlag = 1;
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },
      // 取消审核
      unAudit() {
        let id = this.form.id || this.$route.query.id;
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
              this.auditFlag = 0;
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
      /* 报价单导出 **/
      exportQuotation() {
        let id = this.form.id || this.$route.query.id;
        if (this.auditFlag == 0) {
          this.$message.error('报价未审核，不可导出！')
          return;
        } else {
          let form = $("<form></form>").attr("action", "/back/quotation/quotationExport").attr("method", "post");
          form.append($("<input></input>").attr("type", "hidden").attr("name", "isDown").attr("value", "true"));
          form.append($("<input></input>").attr("type", "hidden").attr("name", 'quotationId').attr("value", id));
          form.appendTo('body').submit().remove();
        }

      },
      //添加单位
      addCompany() {
        this.addCompanyFlag = true;
      },
      //回写单位信息
      setCompanyInfo(data) {
        this.addCompanyFlag = false;
        //使用单位ID再次进行查询，查询出业务员的信息
        if (data.id) {
          let params = {
            id: data.id,
            fuzzySearch: 1,
            source: 1
          }
          ajaxSyncRequest('get', 'back/company/matchCompanysByName', params, (res) => {
            if (res.code == 200) {
              // this.$nextTick(() => {
                this.handleSelect(res.rows[0]);
              // });

            }
          })
        }
      },

      //修改新报价单标记位
      updateNewFlag() {
        let id = this.quotationId || this.$route.query.id;
        ajaxSyncRequest('post', 'back/quotation/updateNewFlag', {quotationId: id}, (res) => {
          if (res.code === 200) {
            this.$message.success('完成修改');
            this.$nextTick(() => {
              this.newFlag = false;
            });
          }
        })

      },
      //生成新的报价单
      toNew() {
        let id = this.form.id || this.$route.query.id;
        this.$confirm('确认生成新报价单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxSyncRequest('post', 'back/quotation/forNew', {quotationId: id}, (res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '生成新报价单成功,报价单号：' + res.msg});
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },
      //打印报价单
      printQuotation(){
        let id = this.form.id || this.$route.query.id;
        let auditFlag = 0;
        ajaxSyncRequest('get', 'back/quotation/' + id, {}, (res) => {
          auditFlag = res.daoResult.auditFlag;
        })
        if (auditFlag == 0) {
          this.$message.error('报价未审核，不可打印！')
          return;
        } else {
          this.printHtml("quotationPrint",{quotationId:id});
        }
      }
    }
  }

  // 判断对象是否为空
  function judgeNull(obj) {
    if (!obj) {
      return ''
    } else {
      return obj
    }
  }
</script>

<style type="text/css" lang="scss">

  .baseDetail {
    .flex-one {
      flex: 1;
    }
    .mb20 {
      margin-bottom: 20px;
    }
  }

  /*.custom-1d74b7 .el-col-25{width:25%;}*/
  .bigwidth {
    width: 100%;
  }

  .but-qk {
    background: #ff8585 !important;
    border-color: #ff8585 !important;
    color: #fff !important;
  }

  .but-qk:hover {
    background: #ff9c9c !important;
    border-color: #ff9c9c !important;
  }

  .but-tjdw{border:1px solid #3094e0!important; background:none!important;color:#3094e0!important;}
  .but-tjdw:hover{background:#3094e0!important;color:#fff!important;}


</style>
