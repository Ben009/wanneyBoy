<template>
    <div class="instrumentation-item" :class="{'readonly':readonly || info == 'traceabilityConfirm'}">
      <div style="float:right;" class="special">
        <global-tootips>
          <p>1、加入自检任务表示将该设备加入自检任务，需通过委托－自检要号节点进行配号后检测；</p>
          <p>2、加入外送计划表示该设备需外送校检，可将该设备加入外送计划任务；</p>
        </global-tootips>
      </div>
      <div class="title-item mb20"><span>基本信息</span></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-Row>
          <el-col :span="12" >
            <el-form-item label="设备名称" prop="instrumentationName">
              <el-input v-model="form.instrumentationName" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="设备名称(英)" prop="instrumentationNameE">
              <template slot="label">
                  <span>设备名称(英)</span>
                  <el-tooltip class="item special" effect="dark" content="本字段用于中英文对照证，若无此需求可不维护">
                  <i class="el-icon-info ft12"></i>
                  </el-tooltip>
              </template>
              <el-input v-model="form.instrumentationNameE" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-Row>
        <el-Row>
          <el-col :span="12" >
            <el-form-item label="型号规格" prop="model">
              <el-input v-model="form.model" v-if="!form.model" clearable :readonly="readonly"></el-input>
              <el-popover
              v-if="form.model"
              popper-class="baseDetaildark"
              placement="bottom-start"
              :visible-arrow="false"
              trigger="hover">
              <div v-html="form.model"></div>
              <el-input ref="model" slot="reference" v-model="form.model" clearable :readonly="readonly"></el-input>
            </el-popover>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="mearsuringRange">
              <template slot = "label">
                  <span>测量范围</span>
              </template>
              <el-input v-model="form.mearsuringRange" v-if="!form.mearsuringRange" clearable :readonly="readonly" v-rightclick="handleRightClick.bind(this,form,'mearsuringRange')"></el-input>
              <el-popover
              v-if="form.mearsuringRange"
              popper-class="baseDetaildark"
              placement="bottom-start"
              :visible-arrow="false"
              trigger="hover">
              <div v-html="form.mearsuringRange"></div>
              <el-input ref="mearsuringRange" slot="reference" v-model="form.mearsuringRange" clearable :readonly="readonly"></el-input>
            </el-popover>
            </el-form-item>
          </el-col>
        </el-Row>

        <el-Row>
          <el-col :span="6" >
            <el-form-item label="出厂编号" prop="manufacturingCode">
              <el-input v-model="form.manufacturingCode" clearable :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="制造厂家" prop="manufacturer">
              <el-input v-model="form.manufacturer" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="设备编号" prop="deviceNumber">
              <el-input v-model="form.deviceNumber" :readonly="readonly">
                <template slot="append">
                  <span  @click="bulid" class="cursor" >自动生成</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="1" style="margin-top: 8px; margin-left: 1%; margin-right: 3.1%;">
              <el-button type="primary" :disabled="readonly">自动生成</el-button>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="使用条件" prop="servicesCondition">
              <el-input v-model="form.servicesCondition" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-Row>
         <el-Row>
          <el-col :span="12">
            <el-form-item prop="accuracyClass">
              <template slot = "label">
                  <span>准确度等级</span>
              </template>
              <el-input v-model="form.accuracyClass" v-if="!form.accuracyClass" clearable :readonly="readonly" v-rightclick="handleRightClick.bind(this,form,'mearsuringRange')"></el-input>
              <el-popover
              v-if="form.accuracyClass"
              popper-class="baseDetaildark"
              placement="bottom-start"
              :visible-arrow="false"
              trigger="hover">
              <div v-html="form.accuracyClass"></div>
              <el-input ref="accuracyClass" slot="reference" v-model="form.accuracyClass" clearable :readonly="readonly"></el-input>
            </el-popover>
            </el-form-item>
          </el-col>

         <el-col :span="6" >
            <el-form-item label="所属部门" prop="department">
              <mind-select :options="depart" :extraConfig="{disabled:readonly}"
                               :optionsConfig="{label:'departName',value:'id'}"
                               v-model="form.department"
                               :changeCallback="changeDepartEvt"
                               class="selectFull"></mind-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="保管人" prop="keeper">
              <mind-select :options="departs" :extraConfig="{disabled:readonly}"
                               :optionsConfig="{label:'userName',value:'id'}"
                               v-model="form.keeper"
                               class="selectFull" style="display:inline-block"></mind-select>
              <template>
              <el-tooltip  content="仅可保存保管人；通常情况是部门自己维护保管人" placement="bottom" effect="light">
                <el-button v-if="standardId" type="primary" @click="singleSave" style="position: relative;top: -1px;" v-has="'M25715'">保存</el-button>
              </el-tooltip>
              </template>
            </el-form-item>
          </el-col>
        </el-Row>
        <el-row>
          <el-col :span="24" >
            <el-form-item prop="accuracyClassE">
              <template slot = "label">
                  <span>准确度等级(英)</span>
                  <el-tooltip class="item special" effect="dark" content="本字段用于中英文对照证，若无此需求可不维护">
                  <i class="el-icon-info ft12"></i>
                  </el-tooltip>
              </template>
              <el-input v-model="form.accuracyClassE" v-if="!form.accuracyClassE" :readonly="readonly" v-rightclick="handleRightClick.bind(this,form,'mearsuringRange')"></el-input>
              <el-popover
              v-if="form.accuracyClassE"
              popper-class="baseDetaildark"
              placement="bottom-start"
              :visible-arrow="false"
              trigger="hover">
              <div v-html="form.accuracyClassE"></div>
              <el-input ref="accuracyClassE" slot="reference" v-model="form.accuracyClassE" clearable :readonly="readonly"></el-input>
            </el-popover>
            </el-form-item>
          </el-col>
        </el-row>

        <el-Row>
          <el-col :span="8" style="width:50%;">
            <el-form-item label="购入单位" prop="supplier">
              <el-input v-model="form.supplier" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="8" style="width:50%;">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="购入日期" prop="purchaseDate">
              <el-date-picker
                :disabled="readonly"
                v-model="form.purchaseDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="数量" prop="quantity">
              <el-input v-model="form.quantity" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="25">
            <el-form-item label="金额" prop="money">
              <el-input v-model="form.money" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="发票号" prop="invoice">
              <el-input v-model="form.invoice" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-Row>

        <el-Row>
          <el-col :span="25">
            <el-form-item label="存放地点" prop="location">
              <el-input v-model="form.location" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="25">
            <el-form-item label="产权单位" prop="propertyUnit">
              <el-input v-model="form.propertyUnit" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="25">
            <el-form-item label="经办人" prop="operator">
              <el-input v-model="form.operator" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="25">
            <el-form-item label="验收人" prop="accepter">
              <el-input v-model="form.accepter" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-Row>

        <el-Row>
             <el-col :span="25">
            <el-form-item label="设备类别" prop="type">
              <template slot = "label">
                <span>设备类别</span>
              </template>
              <el-select v-model="form.type" placeholder="请选择" :disabled="readonly">
                <el-option
                  v-for="item in type"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code*1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="25">
            <el-form-item label="设备类型" prop="modelType">
              <template slot = "label">
                <span>设备类型</span>
              </template>
              <el-select v-model="form.modelType" placeholder="请选择" :disabled="readonly">
                <el-option
                  v-for="item in modeltype"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code*1">
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item  prop="status">
              <template slot = "label">
                <span>设备状态</span>
                <el-tooltip class="item special" effect="dark" content="可在数据字典中进行维护">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-select v-model="form.status" placeholder="请选择" :disabled="readonly">
                <el-option
                  v-for="item in deviceStatus"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code*1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>


            <el-col :span="25">
            <el-form-item label="是否固定资产" prop="isAssets">
              <el-radio-group v-model="form.isAssets" :disabled="readonly">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
            </el-form-item>
          </el-col>
        </el-Row>

        <el-Row>
           <el-col :span="25">
            <el-form-item label="资产编号" prop="assetsNo">
              <el-input v-model="form.assetsNo" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="25">
            <el-form-item label="确认方式" prop="confirmedWay">
              <template slot="label">
                  <span>确认方式</span>
              </template>
              <el-select v-model="form.confirmedWay" placeholder="请选择" :disabled="readonly">
                <el-option
                  v-for="item in confirmedWays"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code*1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="25">
            <el-form-item label="设备能力确认" prop="isCapacityConfirme">
                <el-radio-group v-model="form.isCapacityConfirme" :disabled="readonly">
                  <el-radio label="0">否</el-radio>
                  <el-radio label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
          </el-col>
            <el-col :span="25">
            <el-form-item label="是否标物/标样" prop="isSubjectMatter">
            <el-radio-group v-model="form.isSubjectMatter" :disabled="readonly">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
            </el-form-item>
          </el-col>
        </el-Row>

        <el-Row>

          <el-col :span="25">
            <el-form-item label="所属认可项目号" prop="itemNo">
              <el-input v-model="form.itemNo" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="25">
            <el-form-item label="所属认可项目名称" prop="itemName">
              <el-input v-model="form.itemName" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
             <el-col :span="25">
            <el-form-item label="溯源方式" prop="traceWay">
              <template slot="label">
                  <span>溯源方式</span>
                  <el-tooltip class="item special" effect="dark" content="可在数据字典进行维护">
                    <i class="el-icon-info ft12"></i>
                  </el-tooltip>
              </template>
                <el-select v-model="form.traceWay" placeholder="请选择" :disabled="readonly">
                  <el-option
                    v-for="item in traceWays"
                    :key="item.code"
                    :label="item.remark"
                    :value="item.code*1">
                  </el-option>
                </el-select>

            </el-form-item>
          </el-col>

          <el-col :span="25">
            <el-form-item label="是否授权使用" prop="isAuthorization">
             <el-radio-group v-model="form.isAuthorization" :disabled="readonly">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
            </el-form-item>
          </el-col>
        </el-Row>

        <el-Row>
          <el-col :span="25">
            <el-form-item label="仪器说明书编号" prop="instructionsNo">
              <el-input v-model="form.instructionsNo" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

        <el-col :span="25">
            <el-form-item label="维护项目" prop="maintenanceItem">
              <el-input v-model="form.maintenanceItem" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="25">
            <el-form-item label="维护周期(月)" prop="maintenanceCycle">
              <el-input v-model.number="form.maintenanceCycle" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

           <el-col :span="25">
            <el-form-item label="是否监控使用记录" prop="isMonitorUse">
              <el-radio-group v-model="form.isMonitorUse" :disabled="readonly">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="25" style="width:50%;">
            <el-form-item label="控制措施" prop="controlMeasures">
              <el-input v-model="form.controlMeasures" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-Row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop="bz">
              <template slot = "label">
                  <span>备注</span>
              </template>
              <el-input v-model="form.bz" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

            <el-col :span="8" >
             <el-form-item label="说明书" prop="instrumentationDescs">
            <mind-upload ref="upload" :multiple="false" :limitNumb="limitNumb" :callBack="callBack" :fileLists="fileList" :before-upload='handleFileUploading' :disabled="readonly"></mind-upload>
          </el-form-item>
     </el-col>
        </el-row>
      </el-form>

      <reference-dialog v-if="dialogId" :id="dialogId" @back="handleCancel"></reference-dialog>
       <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
      <el-row>
        <template>
        <el-tooltip  content="查看该设备被计量标准或CNAS引用记录" placement="bottom" effect="light">
          <el-button type="primary" @click="watchReference" v-if="standardId">查看引用标准</el-button>
        </el-tooltip>
        </template>
        <el-button type="primary"  @click="save" :disabled="readonly"> 保存 </el-button>
        <el-button type="primary"   v-if="standardId" @click="selfCheck">自检</el-button>
        <el-button type="primary"   v-if="standardId" @click="outGoing">外送</el-button>
        <el-button  @click="empty" :disabled="readonly" type="danger">{{standardId?'返回':'清空'}}</el-button>
      </el-row>
    </span>
    <delivery-dialog v-if="deliveryFlag" @cancel="deliveryBack" :standardId="standardId"></delivery-dialog>
  </div>

</template>

<script>
import Vue from "vue";
// 引入封装的ajax控件
import {
  ajaxRequest,
  ajaxSyncRequest,
  ajaxProxyRequest,
  formatDate
} from "../../../util/base";

import $ from "jquery";
import rightclick from "../../../../directives/rightcilck.js";
import rightClick from "../../../../mixins/FormRightClick.js";
import referenceDialog from './instrumentationTabDialog/referenceDialog.vue'
import deliveryDialog from './instrumentationTabDialog/deliveryDialog.vue'
const defaults = {
  isAssets: "0",
  isSubjectMatter: "0",
  isAuthorization: "0",
  isMonitorUse: "1",
  isCapacityConfirme: "0",
  maintenanceItem: "常规维护",
  controlMeasures: "流动使用"
};
export default {
  name: "instrumentation-form",
  components: {
    referenceDialog,
    deliveryDialog},
  props: {
    checkId: {
      default: ""
    },
    replayInstid: {
      default: ""
    },
    reviewInstid: {
      // type:Number,
      default: ""
    },
    standardId: {
      // type:Number,
      default: ""
    },
    data: {
      type: Object
    },
    callback: {
      type: Function
    },
    info:{
      type:String,
      default:'',
    }
  },
  data() {
    let quantityCheck = (r, v, cb) => {
      if (!v) {
        cb();
      }
      let regx = /^\d*$/g;
      if (regx.test(v)) {
        cb();
      } else {
        cb(new Error("请输入整数"));
      }
    };
    let en200Check = (rule, value, cb) => {
      let reg = /^([a-zA-z]|\s|[,.?!@#$%{}""'':;]|[0-9])*$/;
      if (!!value) {
        if (reg.test(value)) {
          if (value.length > 200) {
            cb(new Error("最多输入200个字符"));
          }else{
            cb()
          }
        } else {
          cb(new Error('请输入英文格式'));
        }
      } else {
        cb();
      }
    };
    return {
      limitNumb: 3,
      rules: {
        instrumentationName: [
          { required: true, message: "设备名称不能为空" },
          { max: 200, message: "最多输入200个字符", triggle: "blur" }
        ],
        instrumentationNameE:[
          {validator:en200Check,trigger:'blur'}
        ],
        model: [
          { required: true, message: "型号规格不能为空" },
          { max: 200, message: "最多输入200个字符", triggle: "blur" }
        ],
        mearsuringRange: [
          { required: true, message: "测量范围不能为空" },
          { max: 200, message: "最多输入200个字符", triggle: "blur" }
        ],
        manufacturingCode: [
          { required: true, message: "出厂编号不能为空" },
          { max: 200, message: "最多输入200个字符", triggle: "blur" }
        ],
        deviceNumber: [
          { required: true, message: "设备编号不能为空" },
          { max: 200, message: "最多输入200个字符", triggle: "blur" }
        ],
        accuracyClass: [
          { required: true, message: "准确等级不能为空" },
          { max: 200, message: "最多输入200个字符", triggle: "blur" }
        ],
        accuracyClassE:[
          {validator:en200Check,trigger:'blur'}
        ],
        manufacturer: [
          { max: 200, message: "最多输入200个字符", triggle: "blur" }
        ],
        servicesCondition: [
          { max: 200, message: "最多输入200个字符", triggle: "blur" }
        ],
        supplier: [
          { max: 200, message: "最多的输入200个字符", triggle: "blur" }
        ],
        department: [{ required: true, message: "所属部门不能为空" }],
        keeper: [{ required: true, message: "保管人不能为空" }],
        quantity: [{ validator: quantityCheck, triggle: "blur" }],
        maintenanceCycle: [
          {
            validator: (rule, value, callback) => {
              if (!!value) {
                if (!/^[0-9]*$/.test(value)) {
                  callback(new Error("只能输入数字"));
                } else if (value.toString().length > 2) {
                  callback(new Error("最大为两位数"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        unit: [{ max: 10, message: "最多只能输入10个字符", trigger: "blur" }],
        // 金额的验证规则只确定了长度，没有确定类型，待确认
        money: [{ max: 20, message: "最多只能输入20个字符", trigger: "blur" }],
        invoice: [
          { max: 50, message: "最多只能输入50个字符", trigger: "blur" }
        ],
        propertyUnit: [
          { max: 200, message: "最多只能输入200个字符", trigger: "blur" }
        ],
        operator: [
          { max: 100, message: "最多只能输入100个字符", trigger: "blur" }
        ],
        accepter: [
          { max: 100, message: "最多只能输入100个字符", trigger: "blur" }
        ],
        location: [
          { max: 200, message: "最多只能输入200个字符", trigger: "blur" }
        ],
        assetsNo: [
          { max: 200, message: "最多只能输入200个字符", trigger: "blur" }
        ],
        itemNo: [
          { max: 200, message: "最多只能输入200个字符", trigger: "blur" }
        ],
        itemName: [
          { max: 300, message: "最多只能输入300个字符", trigger: "blur" }
        ],
        instructionsNo: [
          { max: 200, message: "最多只能输入200个字符", trigger: "blur" }
        ],
        controlMeasures: [
          { max: 200, message: "最多只能输入200个字符", trigger: "blur" }
        ],
        maintenanceItem: [
          { max: 200, message: "最多只能输入200个字符", trigger: "blur" }
        ],
        maintenanceCycle:[
          {type:'number',max:1000,message:'最大输入1000',trigger:'blur'}
        ],
        bz:[
          {max:200,message:'最多只能输入200个字符',trigger:'blur'}
        ]
      },
      confirmedWays: [], //确认方式
      instrumentation: [], //上传文件内容
      fileList: [],
      departs: [], //保管人
      depart: [], //所属部门
      traceWays: [], //溯源方式
      deviceStatus: [], //设备状态
      type: [], //设备类别
      modeltype: [], //设备类型
      form: $.extend({}, defaults, this.data || {}),
      readonly: false, //表单只可读
      dialogId:undefined,//查看引用数据的id

      outGoingOptions:[],//外送选项
      centerDialogVisible:false,//弹窗的显示

      deliveryFlag:false,//外送弹框标志
    };
  },
  directives: { rightclick },
  mixins: [rightClick],
  mounted() {
    this.$nextTick(() => {
      if (!this.form.propertyUnit) {
        this.$set(
          this.form,
          "propertyUnit",
          window.localStorage.getItem("defaultCompanyName")
        );
      }
    });
    if (this.replayInstid) {
      this.readonly = true;
    }
    if (this.reviewInstid) {
      this.readonly = true;
    }
    if (this.standardId) {
      this.getlist(this.standardId);
    }
    if (this.reviewInstid) {
      this.getlist(this.reviewInstid);
    }
    if (this.replayInstid) {
      this.getlist(this.replayInstid);
    }
    if (this.checkId) {
      this.getlist(this.checkId);
      this.readonly = true;
    }
    this.initData();

    // // 部门列表
    ajaxRequest("get", "back/depart/list/", { isDelete: 0 }, res => {
      this.depart = res.rows;
    });
      this.form.status = 0;
      this.form.traceWay = 1;
      this.form.confirmedWay = 0;
  },
  computed: {},
  methods: {
    // 初始化加载数据
    initData() {
      //确认方式
      ajaxProxyRequest("get", "/njmind/findParam/confirmedWay", {}, res => {
        this.confirmedWays = res.list;
      });
      //获取设备状态
      ajaxProxyRequest(
        "get",
        "/njmind/findParam/instrumentationStatus",
        {},
        res => {
          this.deviceStatus = res.list;
        }
      );
      //获取溯源方式
      ajaxProxyRequest(
        "get",
        "/njmind/findParam/instrumentationtraceWay",
        {},
        res => {
          this.traceWays = res.list;
        }
      );
      // //获取设备类别
      ajaxProxyRequest(
        "get",
        "/njmind/findParam/instrumentationtype",
        {},
        res => {
          this.type = res.list;
        }
      );
      // //获取设备类型
      ajaxProxyRequest(
        "get",
        "/njmind/findParam/instrumentationmodelType",
        {},
        res => {
          this.modeltype = res.list;
        }
      );
    },
    getlist(data) {
      ajaxRequest("get", "back/instrumentation/" + data, {}, res => {
        if (res.code === 200) {
          this.form = res.daoResult;
          if (this.form.department) {
            ajaxRequest(
              "get",
              "back/user/listUserByDeptId/" + this.form.department,
              {},
              res => {
                this.departs = res.rows;
              }
            );
          }
          if (res.daoResult.instrumentationDescs) {
            this.$refs.upload.loadAttacheIds(
              res.daoResult.instrumentationDescs
            );
          }
          // if (res.daoResult.picPath) {
          //   this.$refs.upImage.loadAttacheIds(res.daoResult.picPath);
          // }
        }
      });
    },

    bulid() {
      //自动生成设备编号
      ajaxRequest(
        "get",
        "back/instrumentation/getInstrumentationNum",
        {},
        res => {
          Vue.set(this.form, "deviceNumber", res);
        }
      );
    },
    //callBack上传组件数据发生变化回调
    callBack(file, list) {
      this.fileList = list;
      this.instrumentation = [];
      for (var i = 0; i < list.length; i++) {
        this.instrumentation.push({
          fileName: list[i].name,
          fileUrl: list[i].url,
          fileId: list[i].id
        });
      }
      this.form.instrumentationDescs = JSON.stringify(this.instrumentation);
    },

    //上传头像回调
    callBackP(file, list) {
      if (file) {
        this.form.picPath = file.id;
      }
    },
    //保存
    save() {
      let annexs = "";
      if (this.fileList.length > 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          annexs = this.fileList[i].id + "," + annexs;
        }
      }
      if (annexs != "") {
        annexs = annexs.substring(0, annexs.length - 1);
        this.form.instrumentationDescs = annexs;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.standardId) {
            this.$confirm("确认保存?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              center: true,
              type: "warning"
            }).then(() => {
              ajaxRequest("post", "back/instrumentation/", this.form, res => {
                if (res.code === 200) {
                  this.$message.success("保存成功");
                  // this.standardId = res.daoResult.id;
                  this.$emit("headCallBack", {
                    id: res.daoResult.id,
                    data: this.form
                  });
                }
              });
            });
          } else {
            this.$confirm("确认保存?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              center: true,
              type: "warning"
            }).then(() => {
              delete this.form["addTime"];
              delete this.form["updateTime"];
              delete this.form["auditingTime"];
              this.form.id = this.standardId;
              ajaxRequest("PUT", "back/instrumentation/", this.form, res => {
                if (res.code === 200) {
                  this.$message.success("保存成功");
                  this.$emit("headCallBack", {
                    id: res.daoResult.id,
                    data: this.form
                  });
                }
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    //清空/返回
    empty() {
      this.$refs.upload.deleteFile();
      if (!this.standardId) {
        this.form = Object.assign({}, defaults);
      } else {
        this.form = Object.assign({}, defaults, { id: this.form.id });
        this.$emit('back')
      }
    },

    //获取所属部门
    changeDepartEvt() {
      ajaxRequest("get","back/user/listUserByDeptId/" + this.form.department, {},res => {
          this.departs = res.rows;
        }
      );
      this.$set(this.form, "keeper", "");
    },
    //上传文件前进行去重处理
    handleFileUploading(file) {
      if (!!file.name) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (file.uid != this.fileList[i].uid) {
            if (file.name == this.fileList[i].name) {
              return new Promise((resolve, reject) => {
                this.$confirm("文件名已存在，是否覆盖？")
                  .then(() => {
                    this.$refs.upFiles.setDeleteIds(this.fileList[i].id);
                    resolve(true);
                  })
                  .catch(() => {
                    reject(false);
                  });
              });
            }
          }
        }
      } else {
        return true;
      }
    },
      //自检
    selfCheck(){
      ajaxRequest('get','back/instrmentationAud/getCountInstrAudNum?instId='+this.standardId,{},res=>{
        if(res.isFinshedCount>0){
            this.$message.error('该设备已安排计划自检,当前周检未完成请至“周检计划”节点设置')
          }else{
              this.$confirm("确认自检?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              center: true,
              type: "warning"
            }).then(() => {
              ajaxRequest("post", "back/instrmentationAud/insertInstrumentationTraDetail?instId="+this.standardId, {source:4}, res => {
                if (res.code === 200) {
                  this.$message.success("自检成功");
                }
              });
            });
          }
      })
    },
        //外送
    outGoing(){
      ajaxRequest('get','back/instrmentationAud/getCountInstrAudNum?instId='+this.standardId,{},res=>{
        if(res.statusCount>0){
          this.$message.error('状态非（正常）禁止外送')
        }else if(res.JhWsCount>0){
          this.$message.error('已在外检计划中，该计划未结束')
        }else if(res.DdWsCount>0){
          this.$message.error('该设备已于外检计划时自行外送当前溯源信息未更新')
        }else{
          this.deliveryFlag=true
        }
      })

    },
    // 打开弹窗
    watchReference(){
      this.dialogId = this.standardId;
    },
    // 取消查看引用
    handleCancel(){
      this.dialogId = undefined;
    },
    // 针对保存人的保存 ******************************
    singleSave(){
      let form = new Object();
      form.id = this.standardId;
      form.keeper = this.form.keeper;
      ajaxRequest("post", "back/instrumentation/", form, res => {
        if (res.code === 200) {
          this.$message.success("保存成功");
        }
      });
    },
    // 外送弹框关闭
    deliveryBack(){
      this.deliveryFlag = false;
    }
  },
  updated() {}
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 220px;
  height: 150px;
  line-height: 130px !important;
  text-align: center;
}
.avatar-uploader .el-upload img {
  width: 220px;
  height: 150px;
  display: block;
}
.mb20 {
  margin-bottom: 20px !important;
}
.big-width {
  width: 100%;
}
.custom-1d74b7 .el-col-25 {
  width: 25%;
}
.custom-1d74b7 .el-button--medium.is-round {
  padding: 7px 15px;
  border-radius: 4px;
}
.baseDetaildark {
  border: 1px solid #14a7fb !important;
}
.readonly {
  pointer-events: none !important;
}
.cursor{
  cursor: pointer;
}
.special{
  pointer-events: all;
}
</style>
