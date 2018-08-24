<template>
  <div>


    <!-- TODO 案例 form 组件 验证 label统一宽度 等 ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-Row>
      <el-col :span="6"  style="text-align:center">
          <el-form-item label="委托单编号" prop="orderNo">
            <!--单行文本 v-model 绑定数据  -->
            <!-- <a href="" style="font-size: 18px">{{form.orderNo}}</a> -->
            {{form.orderNo}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="printOrderTxm" size="mini">委托单条码打印</el-button>
          <el-button type="success" @click="printOrderList" size="mini">打印委托单</el-button>
          <el-button type="success" size="mini">打印所有流转单</el-button>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="detectionMethod">
            <!--单选 -->
            <el-radio-group v-model="form.detectionMethod">
              <el-radio :label="'1'">送检</el-radio>
              <el-radio :label="'0'">现场</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-show="form.detectionMethod === '0'" prop="executor">
            <template slot = "label">
              <span>执行人</span>
              <el-tooltip class="item" effect="dark" content="现场检测需输入现场检测人员">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <span v-if="!!form.executor && form.executor.indexOf(',') != -1">{{form.executor}}</span>
            <el-autocomplete v-else style="width: 100%"
                             v-model="form.executor"
                             :fetch-suggestions="querySearchPerson"
                             @select="handleExecutorSelect"
                             placeholder="请输入执行人"
                             :trigger-on-focus="flag"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
      </el-Row>

      <div class="title-item" style="margin-top:10px;"><span>客户信息</span>&nbsp;&nbsp;&nbsp;(受理人：{{userName}})
      <!--<div class="el-icon-info  shuoming">
        <el-row class="el-sm">
           <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">事项说明</p>
                <dl style="padding:6px 10px; ">
          <p>1、	若有权限，可在本页面添加新的委托单位信息；</p>
          <p>2、	委托单位：（单位类别），红色：未审核，[客户对接部门]；</p>
                </dl>
        </el-row>
      </div>-->
       <div class="el-icon-info shuoming" >
            <el-row class="el-sm">
              <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">事项说明</p>
                <dl style="padding:6px 10px; ">
              <p>1、	若有权限，可在本页面添加新的委托单位信息；</p>
              <p>2、	委托单位：（单位类别），红色：未审核，[客户对接部门]；</p>
              <p>3、	若有权限，可对报检的器具信息进行修改或追加器具；</p>
              <p>4、	若有权限，可删除报检的器具信息；</p>
              <p>5、	若有权限，可对未完成且已录入费用的报检器具进行手工完成操作。</p>
                </dl>
            </el-row>
          </div>
      </div>

      <div v-show="specialDwRemark" style="margin-left:10px;margin-bottom: 10px;color:red;font-size:14px">
      <p>
        <!--上门特殊要求：-->
        {{visitSpecialRequirement}}
      </p>
      <p>
        <!--其他特殊要求：-->
        {{otherSpecialRequirement}}
      </p>
      <p>
        {{contractRequireNo}}
      </p>

    </div>
      <el-row>
        <el-col :span="hasAddCompanyPower?16:18">
          <el-form-item label="委托单位" prop="companyName">
            <template slot = "label">
              <span v-notHas="'M16704'">委托单位</span>
          <el-checkbox v-has="'M16704'" v-model="form.isSaveCompanyInfo">委托单位</el-checkbox>
              <el-tooltip v-has="'M16704'" class="item" effect="dark" content="若需将单位信息保存到委托单位库中，请勾中前方复选框">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-autocomplete style="width: 100%"
                             v-model="form.companyName"
                             :fetch-suggestions="querySearchEntrust"
                             placeholder="请输入委托单位"
                             @select="handleSelect"
                             :trigger-on-focus="flag"
                             :disabled="!(form.source == 0)"
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
        <el-col :span="hasAddCompanyPower?2:0" style="text-align: center">
            <el-button type="primary" @click="addCompany" size="mini" class="but-tjdw">添加单位</el-button>

        </el-col>
        <el-col :span="5">
          <el-form-item prop="contractNo">
            <template slot = "label">
              <span>合同号</span>
              <el-tooltip class="item" effect="dark" content="若该客户有有效的合同信息，系统自动合同号，费用录入时系统将自动打折；若本笔页面无需打折，可清空合同号">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.contractNo" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1" style="text-align: center">
          <el-button type="primary" @click="clearHtbh" size="mini"  class="but-qk">清空</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="单位地址" prop="address">
            <!--单行文本 v-model 绑定数据  -->
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
<el-col :span="6">
          <el-form-item label="统一社会信用代码" prop="creditCode">
            <!--单行文本 v-model 绑定数据   -->
            <el-input v-model="form.creditCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="证书单位名称" prop="certificateCompanyName">
            <!--单行文本 v-model 绑定数据  -->
            <el-input v-model="form.certificateCompanyName" placeholder="不录入默认委托单位名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邮编" prop="postCode">
            <!--单行文本 v-model 绑定数据  -->
            <el-input v-model="form.postCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="证书单位地址" prop="certificateCompanyAddress">
            <!--单行文本 v-model 绑定数据  -->
            <el-input v-model="form.certificateCompanyAddress" placeholder="不录入默认委托单位地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="机构性质" prop="institutionalNature" >
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.institutionalNature" style="width:100%;">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in institutionalNatures"
                :key="item.value"
                :label="item.value"
                :value="item.value" >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="联系人" prop="contacter">
            <!--单行文本 v-model 绑定数据  -->
            <el-input v-model="form.contacter"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话" prop="telephone">
            <!--单行文本 v-model 绑定数据  -->
            <el-input v-model="form.telephone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邮箱" prop="email">
            <!--单行文本 v-model 绑定数据  -->
            <el-input v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="省/市/区" prop="administrativeArea">
            <!--单行文本 v-model 绑定数据  -->
            <el-input v-model="form.administrativeArea" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="entrustDate">
            <template slot = "label">
              <span>客户委托日期</span>
              <el-tooltip class="item" effect="dark" content="当检测方式为送检时，为客户送样日期，若为现场时，该日期为客户与本单位联系需现场检测的日期">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>            <el-date-picker
              v-model="form.entrustDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" style="width:100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>

          <el-col :span="6" v-if="form.source != 1">
          <el-form-item label="证书日期" prop="certificatePrintTime">
            <template slot = "label">
              <span>证书日期</span>
              <el-tooltip class="item" effect="dark" content="客户要求出具证书的校检日期">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>            <el-date-picker
              v-model="form.certificatePrintTime"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" style="width:100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="isConclusion">
            <template slot = "label">
              <span>是否出具结论</span>
              <el-tooltip class="item" effect="dark" content="若服务类型为检测或校准时，是否出具结论">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-radio-group style="display:inline-block; line-height:1;" v-model="form.isConclusion">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

           <el-col :span="6">
          <el-form-item prop="isRecheck">
             <template slot = "label">
              <span>是否复校</span>
              <el-tooltip class="item" effect="dark" content="若服务类型为检测或校准时，是否出具复校日期">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-radio-group style="display:inline-block; line-height:1;" v-model="form.isRecheck">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="mobilePhone">
             <template slot = "label">
              <span>短信号码</span>
              <el-tooltip class="item" effect="dark" content="用于通过短信通知客户检测进展">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.mobilePhone" placeholder="输入短信号码用于发送短消息"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-form-item label="整单备注" prop="specialRequirement">
            <!--单行文本 v-model 绑定数据  -->
            <el-input v-model="form.specialRequirement"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>




        <el-col :span="6">
          <el-form-item v-show="form.detectionMethod === '0'" prop="serviceDate">
<template slot = "label">
              <span>业务受理日期</span>
              <el-tooltip class="item" effect="dark" content="现场检测后的配号时间；通常为现场检测时间加一天核算">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>            <el-date-picker
              v-model="form.serviceDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="6" style="text-align: center">
          <el-checkbox v-model="form.isMessage">若需系统发送短消息，请勾选</el-checkbox>
        </el-col> -->
         <el-col :span="6">
          <el-form-item label="是否免费检测" prop="freeCheck">
            <el-radio-group style="display:inline-block; line-height:1;" v-model="form.freeCheck">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>


        <el-col :span="6">
          <el-form-item prop="taskSource">
<template slot = "label">
              <span>任务来源</span>
              <el-tooltip class="item" effect="dark" content="按任务组与业务员组合">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>            <el-input v-model="form.taskSource"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="attachment">
            <template slot = "label">
              <span>附件</span>
              <el-tooltip class="item" effect="dark" content="仅可上传一个附件">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <mind-upload ref="upFiles" :limitNumb="limitNumb" :callBack="fileUploadCallBack" class="but-djsc"></mind-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 添加委托单位 -->
    <addCompanyCommon v-if="showCompanyForm" :callback="setCompanyInfo"></addCompanyCommon>

    <show-more-list v-if="visable" :callback="handleCallBack"></show-more-list>
    <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
      <el-button type="primary" v-show="submitHidden" @click="handleSubmit">修 改</el-button>
      <el-button type="warning" v-has="'M16716'" v-mindPopover="{message:'确认删除?',success:deleteAllInfo.bind(this)}" v-show="submitHidden">整单删除</el-button>
       <el-button type="danger" v-show="submitHidden" @click="backToEntrust">返 回</el-button>
    </span>

    <div class="title-item"><span>器具信息</span>
    </div>
    <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
      <el-button type="primary" v-has="'M16712'" v-if="form.source != 1" @click="addEntrustSjd">追加器具</el-button>
      <!--<el-button type="primary" v-show="submitHidden" @click="addToDraftBox">添加到草稿箱</el-button>-->
      <!--<el-button type="warning" v-show="submitHidden" @click="queryDraftBox">查看草稿箱</el-button>-->

      <el-button type="success"  @click="printDetailCode">打印明细条码</el-button>
      <el-button type="success" v-show="!submitHidden" @click="printDetailCode">打印委托条码</el-button>
      <el-button type="success" v-show="!submitHidden" @click="printDetailCode">打印附件条码</el-button>
      <el-button type="success" v-if="form.detectionMethod === '0'"  @click="printXcDetailCode">打印现场检测条码</el-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-checkbox v-model="form.detailCodeZsdw">明细条码使用证书单位名称</el-checkbox>

    </span>


    <br/>

    <!-- 明细列表 明细时显示 -->
    <EntrustSjdList
      ref="entrustSjdList"
      :wtdId="wtdId"
      :serviceDate="form.serviceDate"
      @getFormData="getFormData"
      >
    </EntrustSjdList>


    <!--器具详细页-->
    <EntrustSjdForm v-if="!!editSjdInfo"
                   ref="entrustSjdForm"
                   :data="{
                   'wtdId':wtdId,
                   'detectionMethod':form.detectionMethod,
                   'serviceDate':form.serviceDate,
                   'wtdSource':form.source,
                   'registrationNoSource':registrationNoSource,
                   'registrationNoQuotationNo':registrationNoQuotationNo,
                   'isCompulsoryVerify':0,
                   'companyId':form.companyId
                   }"
                   :callback="handleSjdEditCallback"

    >
    </EntrustSjdForm>
      <div id="wtdTxmDy"></div>
  </div>
</template>

<script>
  import Vue from 'vue';

  // 引入封装的ajax控件
  import {ajaxRequest,ajaxProxyRequest, formatDate} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import showMoreList from '../plan/showMoreList'
  import EntrustSjdList from './EntrustSjdList'
  import EntrustSjdForm from './EntrustSjdForm'
  import addCompanyCommon from "../quotation/addCompanyCommon";
  import VueBarcode from 'vue-barcode';


/*   import {
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
  } from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox); */

  const defaults = {
    // isMessage: true,
    detectionMethod: '1',
    //-- 是否免费检测，0否，1是的数据配置，注意要修改上面的配置项
    freeCheck: 0,
    //-- 是否出具结论，0否，1是的数据配置，注意要修改上面的配置项
    isConclusion: 0,
    //-- 是否复检，0否，1是的数据配置，注意要修改上面的配置项
    isRecheck: 0,
    institutionalNature: "系统外",
    entrustDate: new Date(),
    isAutoWtdh: false,
  };
  export default {
    name: "entrustWtdForm",
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      //input框中不输入字符，value为undefined
      var validateExecutor = (rule, value, callback) => {
        if (this.form.detectionMethod === '0' && (!value)) {
          callback(new Error("请输入执行人"))
        } else {
          callback();
        }
      };
      var validateMobilePhone = (rule, value, callback) => {
      if(!!!value) {
        callback();
      } else {
        let ruleRex = /^\d{11}$/;
        if (ruleRex.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      }
    };
    let telephoneCheck = (rule, value, callback) => {
      let reg = /([0-9]{3,4}-)?[0-9]{7,8}/
      if (value && !reg.test(value)) {
        callback(new Error('请输入正确的办公电话'));
      } else {
        callback();
      }
    };
    let emailCheck = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (value && !reg.test(value)) {
        callback(new Error('请输入正确的邮箱格式'));
      } else {
        callback();
      }
    };
      var validateServiceDate = (rule, value, callback) => {
        if (this.form.detectionMethod === '0' && (!value)) {
          callback(new Error("请选择业务受理日期"))
        } else {
          callback();
        }
      };
      let hasAddCompanyPower = false;
      //按钮权限判断
      let buttonpermsStr=window.localStorage.getItem("btnPower");
      if(buttonpermsStr==null || buttonpermsStr==undefined) {//没有权限，所有涉及权限的按钮都不展示
        hasAddCompanyPower = false;
      }else if(buttonpermsStr.indexOf("@M16701@") != -1){//有该按钮权限
        hasAddCompanyPower = true;
      }

      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          companyName: [{type: 'string', required: true, message: '单位名称不能为空'}],
          address: [{type: 'string', required: true, message: '单位地址不能为空'}],
          entrustDate: [{type: 'date', required: true, message: '请选择客户委托日期'}],
          mobilePhone: [{validator: validateMobilePhone, trigger: 'blur'}],
        telephone: [{ validator: telephoneCheck, trigger: "blur" }],
        email: [{ validator: emailCheck, trigger: "blur" }],
          executor: [{validator: validateExecutor, trigger: 'blur'}],
          serviceDate: [{validator: validateServiceDate, trigger: 'blur'}],
        },
        loading: false,
        remoteOptions: [],
        institutionalNatures: [{"value": "系统外"}, {"value": "系统内"}, {"value": "内传"}],
        userName: window.localStorage.userName,
        hasAddCompanyPower: hasAddCompanyPower,
        submitHidden:true,

        //文件上传参数
        fileList: [],
        limitNumb: 1,//附件上传个数限制
        up_url: '',//自定义上传路径 [非必填]  默认不用修改
        fdata:{
          caseId: '', // 登记号       [非必填]  业务相关的登记号
          serverId: '', // 服务id     [非必填]  分布式附件服务可以用默认不用配制
          flowId: '', // 流程id      [非必填]  流程相关
          execType: '', // 操作类型   [非必填]  业务相关
        },
        //autoComplete 是否不输入值就可匹配
        flag: false,
        //单位更多信息弹出框是否显示
        visable: false,

        specialDwRemark:false,
        visitSpecialRequirement:'',
        otherSpecialRequirement:'',
        contractRequireNo:'',

        editSjdInfo:false,
        wtdId:this.$route.params.wtdId,
        registrationNoSource:this.$route.params.registrationNoSource,
        registrationNoQuotationNo:this.$route.params.registrationNoQuotationNo,
      //添加委托单位
      showCompanyForm: false,
      }
    },
    mounted() {

      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
      this.getFormData();
    },
    directives: {rightclick},
    mixins: [rightClick],
    components: {
      showMoreList,
      EntrustSjdList,
      EntrustSjdForm,
      addCompanyCommon
    },
    methods: {//方法定义
      getFormData(){
          let _this = this
          Vue.set(this.form,'wtdId',_this.$route.params.wtdId);
          ajaxRequest('get', 'back/entrustWtd/' + _this.$route.params.wtdId, {}, (res) => {
          // if(res.daoResult.isMessage === 1){
          //   res.daoResult.isMessage = true
          // }
          this.form = res.daoResult
          this.userName = res.daoResult.addPersonName;
          this.form.serviceDate = formatDate(this.form.serviceDate,'YYYY-MM-DD');
          this.form.entrustDate = formatDate(this.form.entrustDate,'YYYY-MM-DD');
          this.form.certificatePrintTime = formatDate(this.form.certificatePrintTime,'YYYY-MM-DD');

          //判断是否加载特殊需求备注
          if(!!res.daoResult.visitSpecialRequirement){
          this.visitSpecialRequirement = "上门特殊要求："+res.daoResult.visitSpecialRequirement;
          this.specialDwRemark = true;
        }
        if(!!res.daoResult.otherSpecialRequirement){
          this.otherSpecialRequirement = "其他特殊要求："+res.daoResult.otherSpecialRequirement;
          this.specialDwRemark = true;
        }
          // 加载附件
          this.$refs.upFiles.loadAttacheIds(res.daoResult.attachment)
        })
      },
      addCompany() {
      this.showCompanyForm = true;
    },
    //回写单位信息
    setCompanyInfo(data){
        console.log(data);
         //带入单位信息到表单中
        this.showCompanyForm = false;

      this.$set(this.form, "companyId", data.id);
      this.$set(this.form, "companyName", data.companyName);
      this.$set(this.form, "contractNo", data.contractNo);
      //省市区
      let administrativeArea = "";
      if (!!data.province) {
        administrativeArea += data.province;
      }
      if (!!data.city) {
        administrativeArea += "/" + data.city;
      }
      if (!!data.area) {
        administrativeArea += "/" + data.area;
      }
      this.$set(this.form, "administrativeArea", administrativeArea);
      this.$set(this.form, "postCode", data.postCode);
      this.$set(this.form, "creditCode", data.creditCode);
      this.$set(this.form, "mobilePhone", data.mobilePhone);


      this.$set(this.form, "address", data.address);
      this.$set(this.form, "contacter", data.contacter);
      this.$set(this.form, "telephone", data.telephone);

      //任务来源
      let taskSource = "";
      if (!!data.businessGroupName) {
        taskSource += data.businessGroupName;
      }
      if (!!data.businessStaffName) {
        taskSource += data.businessStaffName;
      }
      this.$set(this.form, "taskSource", taskSource);

      this.specialDwRemark = false;
      if (!!data.visitSpecialRequirement) {
        this.visitSpecialRequirement =
          "上门特殊要求：" + data.visitSpecialRequirement;
        this.specialDwRemark = true;
      }
      if (!!data.otherSpecialRequirement) {
        this.otherSpecialRequirement =
          "其他特殊要求：" + data.otherSpecialRequirement;
        this.specialDwRemark = true;
      }
    },
      addEntrustSjd(){
        this.editSjdInfo = true
      },
      handleSjdEditCallback(rowInfo){
              this.editSjdInfo = false
              if(rowInfo){
                this.$refs.entrustSjdList.getTableData();
                this.getFormData();
              }
      },
      //执行人autoComplete
      querySearchPerson(queryString, cb){
        // 调用 callback 返回建议列表的数据
        let params = queryString ? {
          userName: queryString,
          isDelete: '0',
          fuzzySearch: 1
        } : ''
        ajaxRequest('get', 'back/user/retrieve', params, (res) => {
          if (res.code == 200) {
            this.handleExecutorResult(res.rows);
            cb(res.rows)
          }
        })

      },
      handleExecutorResult(res){
        console.log(res,'userInfo')
        for (let key in res) {
          Vue.set(res[key], 'value', res[key].userName)
        }
      },
      handleExecutorSelect(item){
        this.$set(this.form, "executor", item.userName)
        this.$set(this.form, "executorId", item.userId)
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
      handleSelect(item) {
        this.visable = true;

        // Object.assign({},this.form,{
        //   contractNo: 123
        // })
        console.log(item,'companyInfo')
        this.$set(this.form, "companyId", item.id)
        this.$set(this.form, "companyName", item.companyName)
        this.$set(this.form, "contractNo", item.contractNo)
        //省市区
        let administrativeArea = "";
        if(!!item.province){
          administrativeArea += item.province;
        }
        if(!!item.city){
          administrativeArea += "/" + item.city;
        }
        if(!!item.area){
          administrativeArea += "/" + item.area;
        }
      this.$set(this.form, "administrativeArea", administrativeArea);
      this.$set(this.form, "postCode", item.postCode);
      this.$set(this.form, "creditCode", item.creditCode);
      this.$set(this.form, "mobilePhone", item.mobilePhone);
      this.$set(this.form, "email", item.email);

       if (item.many == "1") {
        this.companyMany = item.id;
        this.visable = true;
      } else {
        this.$set(this.form, "address", item.address);
        this.$set(this.form, "contacter", item.contacter);
        this.$set(this.form, "telephone", item.telephone);
        this.$set(
          this.form,
          "certificateCompanyName",
          item.certificateCompanyName
        );
      }
      //任务来源
      let taskSource = "";
      if (!!item.businessGroupName) {
        taskSource += item.businessGroupName;
      }
      if (!!item.businessStaffName) {
        taskSource += item.businessStaffName;
      }
      this.$set(this.form, "taskSource", taskSource);

        this.specialDwRemark = false;
        if(item.visitSpecialRequirement){
          this.visitSpecialRequirement = "上门特殊要求："+item.visitSpecialRequirement;
          this.specialDwRemark = true;
        }
        if(item.otherSpecialRequirement){
          this.otherSpecialRequirement = "其他特殊要求："+item.otherSpecialRequirement;
          this.specialDwRemark = true;
        }
        if(false){
          this.contractRequireNo = "该客户为协议单位，请优先从合同送检要号中进行配号从而跟踪合同！";
          this.specialDwRemark = true;
        }


      },
      handleCallBack(val) {
        console.log('22222')
        if (val) {
          if(val.contactSource == 2){
          this.$set(this.form,"companyContactId",val.id);
        }else{
          this.$set(this.form,"companyContactId",null);
        }
        this.$set(this.form, "address", val.address);
        this.$set(this.form, "contacter", val.contacter);
        this.$set(this.form, "telephone", val.telephone);
        this.$set(
          this.form,
          "certificateCompanyName",
          val.certificateCompanyName
        );
        }
        this.visable = false;
      },
      //清空合同编号
      clearHtbh() {
        Vue.set(this.form, "contractNo", "");
      },
      //callBack上传组件数据发生变化回调
      fileUploadCallBack(file, list) {
        this.fileList = list;
        this.form.attachment = this.fileList[0].id;
        // console.log(this.fileList[0].id);
        // console.log("调用上传页面收到的 附件列表", this.fileList);
      },
      deleteAllInfo(){
          ajaxRequest('post', 'back/entrustWtd/list/' + this.form.wtdId, {_method: 'delete'}, function (res) {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.backToEntrust()
            } else {
              this.$message.error('删除失败')
            }
          }.bind(this))
      },
      handleSubmit() {
        //-- 表单提交处理 --
              console.log(this.form, 'wtdInfo')
              delete this.form['addTime'];
              if(this.form.serviceDate){
              this.form.serviceDate = new Date(this.form.serviceDate);
              }
              if(this.form.entrustDate){
          this.form.entrustDate = new Date(this.form.entrustDate);
              }
              if(this.form.certificatePrintTime){
          this.form.certificatePrintTime = new Date(this.form.certificatePrintTime);
              }
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
              console.log(this.form, 'wtdInfo')

          if (valid) {
            this.form.entrustDate = formatDate(this.form.entrustDate,'YYYY-MM-DD');
            this.form.serviceDate = formatDate(this.form.serviceDate,'YYYY-MM-DD');
            this.form.certificatePrintTime = formatDate(this.form.certificatePrintTime,'YYYY-MM-DD');
              // var httpMethod;//http请求方式
              // if(!this.form.id||this.form.id==''){//新增 注意:通过id是否存在来判断是新增还是编辑
              //     httpMethod = 'post';
              // }else {//更新
              //     httpMethod = 'put';
              // }
              console.log(this.form, 'wtdInfo')
              // this.form.isMessage = this.form.isMessage ? 1 : 0;
              this.form.source = this.form.source ? this.form.source : 0;
              delete this.form['entrustSjdList']
              for (var key in this.form) {
                if (this.form[key] == null) {
                  delete this.form[key]
                }
              }
              console.log(this.form, 'wtdInfo')
              ajaxRequest('put', "back/entrustWtd/", this.form, (res) => {
                if (res.code == 200) {
                  this.$message.success('修改成功');
                  // this.form.isMessage = (this.form.isMessage == 1 || this.form.isMessage);
                this.$refs.entrustSjdList.getTableData();

                }
              });
          } else {
            return false;
          }
        })
      },
      printOrderTxm(){
      if(!!this.form.orderNo){
          var newstr = '';
          let MyComponent = Vue.extend({
             template: `<vue-barcode style="display:none" id="wtdTxmDy" value="${this.form.orderNo}" :width="2" :height="40" :displayValue="true" tag="canvas"></vue-barcode>`,
             components:{
              VueBarcode
             }
          })
          new MyComponent().$mount('#wtdTxmDy')
          newstr += document.getElementById('wtdTxmDy').innerHTML
        // sessionStorage.setItem('printHtml',newstr)
        this.printHtml("wtdTxmPrint",{key1:newstr},1);
      }else{
        this.$message.error('请先输入委托单编号！')
      }
      
    },
      printOrderList() {
    //       ajaxRequest('get','back/entrustWtd/getWtdCompany',{orderNo:3000484},res=>{
    //   console.log(res)
    // })
    var newstr = '';
          let MyComponent = Vue.extend({
             template: `<vue-barcode style="display:none" id="wtdTxmDy" value="${this.form.orderNo}" :width="1.6" :height="36" :displayValue="false" tag="canvas"></vue-barcode>`,
             components:{
              VueBarcode
             }
          })
          new MyComponent().$mount('#wtdTxmDy')
          newstr += document.getElementById('wtdTxmDy').innerHTML
        // sessionStorage.setItem('printHtml',newstr)
        this.printHtml("wtdPrint",{key1:newstr,wtdId:this.form.wtdId},1);
      // window.open('/admin.html#/admin/M1111?id=129323')
    },
      printDetailCode(){},
      printXcDetailCode(){},
      backToEntrust(){
        this.$router.push({
          path:'/admin/266',
        })
      },
      remoteMethod() {
        //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
        ajaxRequest('get', "back/", null, (res) => {
          if (res.code == 200) {
            this.institutionalNatures = res.rows
          }
        });
      },

    },
  }
</script>

<style>
  /*
  右键菜单样式设置
*/
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

ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}


.but-yywtd {
  border: 1px solid #3094e0 !important;
  background: none !important;
  color: #3094e0 !important;
}
/*.but-yywtd:hover{background:#3094e0!important;color:#fff!important;}*/
.but-tmdy {
  border: 1px solid #67c23a !important;
  background: none !important;
  color: #67c23a !important;
}
.but-tmdy:hover {
  background: #67c23a !important;
  color: #fff !important;
}
.but-qk {
  background: none !important;
  color: #f56c6c !important;
  border-color: #f56c6c !important;
}
/*.but-qk:hover{background: #f56c6c!important; color:#fff!important;}*/

 .title-item .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;float: right;margin-right: 10px;}
  .title-item .shuoming::after{
    content: "";
    width: 35px;
    height: 40px;
    /*background: #fff;*/
    position: absolute;
    z-index: 999;
    /* top: 0; */
    /* left: -65px; */
    margin-left: -16px;

  }

 .title-item .el-sm{background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 1px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -302px;
    word-break: break-all;
    margin-top: 18px;
    padding: 4px 5px;width:320px;
    font-size: 14px;
    opacity: 50;
    float: right; -webkit-transition: all 0.8s;transition: all 0.8s;}

 .title-item .shuoming .el-sm{
    display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
  }


</style>
