<template>
    <div class="applianceFormTotal">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <div class="title-item"><span>基本信息</span></div>
        <el-row>
          <el-col :span="6">
            <el-form-item label="类别代码" prop="categoryId">
              <el-select class="big-width"
                         placeholder="请选择"
                         v-model="form.categoryId">
                <el-option
                  v-for="item in categoryIds"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="器具名称" prop="applianceName">
              <el-input v-model="form.applianceName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="large">
            <el-form-item prop="applianceRealname">
              <template slot = "label">
                <span>器具别名</span>
                <el-tooltip class="item" effect="dark" content="若存在多个别名，请用;隔开">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-input v-model="form.applianceRealname"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="型号规格" prop="model">
              <el-input v-model="form.model" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测量范围" prop="measureRange">
              <el-input v-model="form.measureRange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="准确度等级" prop="accuracyDegree">
              <el-input v-model="form.accuracyDegree"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型" prop="applianceType">
              <el-select placeholder="请选择"  v-model="form.applianceType" class="big-width">
                <el-option value="1" label="标准器具">标准器具</el-option>
                <el-option value="2" label="非标准器具">非标准器具</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="检测部门" prop="departId">
              <el-select placeholder="请选择" v-model="form.departId" @change="getPostList(form.departId)"  class="big-width" :disabled="isUseOtherDep">
                <el-option
                  v-for="item in departNameData"
                  :label="item.departName"
                  :value="item.departId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检测岗位" prop="postId">
              <el-select placeholder="请选择" v-model="form.postId" class="big-width">
                <el-option
                  v-for="item in postNameData"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="detectionMethod">
              <template slot = "label">
                <span>检测方式</span>
                <el-tooltip class="item" effect="dark" content="用于报价时默认检测方式">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-select placeholder="请选择" v-model="form.detectionMethod" class="big-width">
                <el-option value="1" label="送检">送检</el-option>
                <el-option value="0" label="现场">现场</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检测参数" prop="detectionParameter">
              <el-input v-model="form.detectionParameter"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="detectionDuration">
              <template slot = "label">
                <span>检测耗时</span>
                <el-tooltip class="item" effect="dark" content="检测该器具需所需要的时间，单位（小时），仅可以为数字">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-input v-model="form.detectionDuration"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="status">
              <template slot = "label">
                <span>状态</span>
                <el-tooltip class="item" effect="dark" content="若为暂停，需选择项目的暂停时间，若长期暂停，需选择一个较长的时间段；暂时器具业务受理时将进行提示；">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-select :disabled="!data" placeholder="请选择" v-model="form.status" class="big-width">
                <el-option :value="1" label="启用">启用</el-option>
                <el-option :value="2" label="暂停">暂停</el-option>
              </el-select>
            </el-form-item>
          </el-col>
         <!-- <el-col :span="6">
            <el-form-item label="暂停开始时间" prop="suspendBeginTime" >
              <el-date-picker
                v-model="form.suspendBeginTime"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd" style="width:100%;"
                :disabled="isUse">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="暂停结束时间" prop="suspendEndTime" class="big-width">
              <el-date-picker
                v-model="form.suspendEndTime"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"  style="width:100%;"
                :disabled="isUse">
              </el-date-picker>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="status">
              <template slot = "label">
                <span>检测周期</span>
                <el-tooltip class="item" effect="dark" content="该样品的校检周期；">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-select size="mini" v-model="form.certificateJdzq" class="big-width">
                <el-option  ref="certificateJdzqSel"
                            v-for="certificateJdzq in certificateJdzqArr" :key="certificateJdzq.code"
                            :label="certificateJdzq.remark" :value="certificateJdzq.code">
                  {{certificateJdzq.remark}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="18" class="large">
            <el-form-item label="备注" prop="remark" >
              <el-input v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="title-item"><span>费用信息</span></div>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="detectionFee">
              <template slot = "label">
                <span>检测费</span>
                <el-tooltip class="item" effect="dark" content="仅可以为数字">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-input v-model="form.detectionFee" @change="verificateDetectionFee"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="detectionPoint">
              <template slot = "label">
                <span>检测点</span>
                <el-tooltip class="item" effect="dark" content="仅供费用录入时，检测费*套数*件数*检测点，检测点通常为1">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-input v-model="form.detectionPoint" @change="verificateDetectionPoint"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargeUnit">
              <template slot = "label">
                <span>收费单位</span>
                <el-tooltip class="item" effect="dark" content="器具的单位，如台、套等，用于报价时默认带入单位">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-input v-model="form.chargeUnit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="isDiscount">
              <template slot = "label">
                <span>是否可打折</span>
                <el-tooltip class="item" effect="dark" content="当不可打折时，有报价、费用折扣时均禁止打折，仅对受理时该器具的打折状态生效">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-select placeholder="请选择" v-model="form.isDiscount" class="big-width">
                <el-option :value="0" label="不可打折">不可打折</el-option>
                <el-option :value="1" label="可打折">可打折</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
          <el-form-item label="收费说明" prop="detectionFeeExplain">
            <el-input v-model="form.detectionFeeExplain"></el-input>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
          <el-form-item prop="attachedFee">
            <template slot = "label">
              <span>附加费</span>
              <el-tooltip class="item" effect="dark" content="若器具存在每增加一个通道、探头加收费用等情况时，需维护附加费收费标准；仅可以为数字">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.attachedFee" @change="verificateAttachedFee"></el-input>
          </el-form-item>
        </el-col>
          <el-col :span="18" style="width:75%;" class="mid">
          <el-form-item label="附加费说明" prop="attachedFeeExplain">
            <el-input v-model="form.attachedFeeExplain"></el-input>
          </el-form-item>
        </el-col>
        </el-row>

        <div class="title-item"><span>授权信息</span></div>
        <el-row>
          <el-col :span="6">
            <el-form-item label="授权检定" prop="isVerifyAuth">
              <el-select placeholder="请选择" v-model="form.isVerifyAuth" style="width: 100%">
                <el-option :value="0" label="未授权">未授权</el-option>
                <el-option :value="1" label="已授权">已授权</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="授权校准" prop="isCalibrationAuth">
              <el-select placeholder="请选择" v-model="form.isCalibrationAuth" style="width: 100%">
                <el-option :value="0" label="未授权">未授权</el-option>
                <el-option :value="1" label="已授权">已授权</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="授权cnas" prop="isCnasAuth">
              <el-select placeholder="请选择" v-model="form.isCnasAuth" class="big-width">
                <el-option :value="0" label="未授权">未授权</el-option>
                <el-option :value="1" label="已授权">已授权</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="certificateType">
              <template slot = "label">
                <span>服务类型</span>
                <el-tooltip class="item" effect="dark" content="用于受理或报价时默认的服务类型">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-select class="big-width"
                         placeholder="请选择"
                         v-model="form.certificateType">
                <el-option
                  v-for="item in certificateTypes"
                  :label="item.remark"
                  :value="item.remark">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="title-item"><span>强检信息</span></div>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否强检" prop="isCompulsoryVerify">
              <el-select placeholder="请选择" v-model="form.isCompulsoryVerify" class="big-width" >
                <el-option :value="0" label="否">否</el-option>
                <el-option :value="1" label="是">是</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="器具用途" prop="applianceUse">
              <el-select v-model="form.applianceUse" multiple collapse-tags :disabled="isDisable" class="big-width" size="mini">
                <el-option
                  v-for="item in applianceUses"
                  :key="item.remark"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="强检目录" prop="compulsoryVerifyCatalog">
              <el-select class="big-width" placeholder="请选择" v-model="form.compulsoryVerifyCatalog" :disabled="isDisable" size="mini">
                <el-option
                  v-for="item in compulsoryVerifyCatalogs"
                  :key="item.id"
                  :label="item.itemName"
                  :value="item.id+''">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--<el-col :span="6">
            <el-form-item label="强检类别" prop="compulsoryVerifyCategory" >
              <el-select class="big-width"
                         placeholder="请选择"
                         v-model="form.compulsoryVerifyCategory" :disabled="isDisable" size="mini">
                <el-option
                  v-for=" (item,index) in compulsoryVerifyCategorys"
                  :label="item.remark"
                  :value="item.code"
                  :key="index"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
        </el-row>
    </el-form>
      <span class="footButton">
          <el-button v-if="!data" type="primary" @click="handleSubmit">保 存</el-button>
          <el-button v-else-if="isModifyPower" type="primary" @click="handleSubmit">保 存</el-button>
          <el-button v-if="!data" type="warning" class="el-icon-warning" @click="handleClear">&nbsp;清空</el-button>
          <template v-if="otherAdd">
            <el-button  @click="callbackAdd">关 闭</el-button>
          </template>
          <el-button v-if="data" @click="handleCancel">返回</el-button>
      </span>
    </div>
</template>

<script>
let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
import Vue from "vue";
import { ajaxRequest, ajaxProxyRequest } from "../../util/base";
import $ from "jquery";


const defaults = {
  isDiscount: 1, //可打折
  applianceType: "1", //类型
  status: 1, //状态:启用
  isCompulsoryVerify: 0,//非强检
  applianceUse:[],
  detectionPoint:1,
  detectionFee:0,
  attachedFee:"0",
  isVerifyAuth:0,
  isCalibrationAuth:0,
  isCnasAuth:0,

};
export default {
  name: "appliance-form",
  props: {
    data: {
      type: Object,
      require: true
    },
    callback: {
      type: Function,
      require: true
    },
    callbackAdd: {
      type: Function,
      require: true
    },
    otherAdd:{
      type: Boolean
    }
  },
  data() {
    var detectionDurationCheck = function(rule, value, callback) {
      let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/g;//正数
      if (value) {
        if(value.length>20){
          callback(new Error('最多输入20个字符'))
        }else{
          if (!regu.test(value)) {
            callback(new Error("请输入正数"));
          }else{
            callback();
          }
        }
      }else{
        callback();
      }
    };
    var checkPinYin = function(rule, value, callback) {
      let ruleRex = /^[a-zA-Z]{0,}$/g;
      if (ruleRex.test(value)) {
        callback();
      } else {
        callback(new Error("请输入拼音"));
      }
    };
    var checkDate = (rule,value,cb)=>{
      if (this.form.status===2 && value==="") {
        cb(new Error("禁用状态请选择日期"));
      } else {
        cb();
      }
    };
    var checkApplianceUse = (rule,value,cb)=>{
      if (this.form.isCompulsoryVerify===1 && value.length===0) {
        cb(new Error("强检请选择器具用途"));
      } else {
        cb();
      }
    };
    let applianceNameCheck = (rule,value,cb)=>{
      if(!!value){
        if(value.length>100){
          cb(new Error('最多输入100个字符'))
        }else{
          if(this.form.categoryId ){
            let name = ''
            this.categoryIds.forEach((item,index,arr)=>{
              if(item.id == this.form.categoryId){
                name = item.name
                name = name.split('(')[0].toString();
              }
            })
            console.log(name,value)
            if(name == value){
              cb(new Error('器具名称不能和类别代码重复！'))
            }else{
              cb()
            }
          }else{
            cb();
          }
        }
      }else{
        cb(new Error('器具名称不能为空！'))
      }
    }
    let detectionFeeCheck =(rule,value,cb)=>{
      if(typeof value != 'string'){
        value = value + ''
      }
      if(value){
        if(value.length>12){
          cb(new Error('最多输入12个字符'))
        }else{
          cb()
        }
      }else{
        cb()
      }
    }
    let detectionPointCheck =(rule,value,cb)=>{
      if(typeof value != 'string'){
        value = value + ''
      }
      if(value){
        if(value.length>12){
          cb(new Error('最多输入12个字符'))
        }else{
          cb()
        }
      }else{
        cb()
      }
    }
    let attachedFeeCheck =(rule,value,cb)=>{
      if(typeof value != 'string'){
        value = value + ''
      }
      if(value){
        if(value.length>12){
          cb(new Error('最多输入12个字符'))
        }else{
          cb()
        }
      }else{
        cb()
      }
    }
    return {
      form: $.extend({}, defaults, this.data || {}),
      rules: {
        applianceName: [{ type: "string", required: true, validator:applianceNameCheck,trigger:'blur'}],
        applianceRealname:[{type:'string',max:100,message:'最多输入100个字符'}],
        model:[{type:'string',max:200,message:'最多输入200个字符'}],
        measureRange:[{type:'string',max:200,message:'最多输入200个字符'}],
        accuracyDegree:[{type:'string',max:200,message:'最多输入200个字符'}],
        detectionParameter:[{type:'string',max:200,message:'最多输入200个字符'}],
        detectionDuration:[{validator:detectionDurationCheck,trigger:'blur'}],
        remark:[{type:'string',max:200,message:'最多输入200个字符'}],
        // detectionFee:[{type:'string',max:12,message:'最多输入12个字符'}],
        detectionFee:[{validator:detectionFeeCheck,trigger:'blur'}],
        // detectionPoint:[{type:'string',max:12,message:'最多输入12个字符'}],
        detectionPoint:[{validator:detectionPointCheck,trigger:'blur'}],
        chargeUnit:[{type:'string',max:20,message:'最多输入20个字符'}],
        detectionFeeExplain:[{type:'string',max:200,message:'最多输入200个字符'}],
        // attachedFee:[{type:'string',max:12,message:'最多输入12个字符'}],
        attachedFee:[{validator:attachedFeeCheck,trigger:'blur'}],
        attachedFeeExplain:[{type:'string',max:100,message:'最多输入100个字符'}],
        // departId与postId一定要是数字类型的吗
        departId: [{ type: "number", required: true, message: "检测部门不能为空" }],
        postId: [{ type: "number", required: true, message: "检测岗位不能为空" }],
        pinYin: [{ validator: checkPinYin, trigger: "blur" }],
        suspendBeginTime: [{ validator: checkDate,trigger:'blur'}],
        suspendEndTime: [{ validator: checkDate,trigger:'blur'}],
        applianceUse: [{ validator: checkApplianceUse,trigger:'blur'}],
      },
      loading: false,
      applianceUses: [],
      compulsoryVerifyCatalogs: [], //强检目录
      compulsoryVerifyCategorys: [], //强检类别
      categoryIds: [], //类别代码
      postIds: [], //岗位
      departNameData: [], //部门
      postNameData: [], //岗位
      certificateTypes: [], //服务类型
      certificateJdzqArr: [], //证书检定周期
      loading2: true,
      categoryIdFlag:false,
      isUseOtherDep : false,
      isModifyPower : false,
    };
  },
  watch:{
    isDisable(value,oldvalue){
      Vue.set(this.form,'applianceUse',[]);
      Vue.set(this.form,'compulsoryVerifyCatalog','');
      Vue.set(this.form,'compulsoryVerifyCategory','');
    },
    isUse(value,oldvalue){
      Vue.set(this.form,'suspendBeginTime','');
      Vue.set(this.form,'suspendEndTime','');
    },
  },
  computed: {
    // 根据是否需要对选中的强检进行数据操作做保留空间
    isDisable: function() {
      return this.form.isCompulsoryVerify==1 ? false : true;
    },
    isUse: function() {
      return this.form.status == 1 ? true : false;
    }
  },
  mounted() {
    if(this.data){
      if (this.data.applianceUse) {
        if(this.form && this.form.id){
          this.form.applianceUse = this.data.applianceUse.split(',')
        }
      }
    }
    if (this.form.suspendEndTime) {
      this.form.suspendEndTime = new Date(this.form.suspendEndTime).format(
        "YYYY-MM-DD"
      );
    }
    if (this.form.suspendBeginTime) {
      this.form.suspendBeginTime = new Date(this.form.suspendBeginTime).format(
        "YYYY-MM-DD"
      );
    }
    if(!!this.form.categoryId){
      this.categoryIdFlag = true;
    }
    //this.adsf();
  },
  created() {
    this.ajaxDepartNameObj();
    this.getCategoryList();
    this.getServiceType();
    this.getCompulsoryVerifyCategory();
    this.getApplianceUses();
    this.getCompulsoryVerifyCatalogs();
    this.getCertificateJdzqArr();
    this.checkPower();
  },
  methods: {
    //清空按钮事件
    handleClear() {
      this.form=$.extend({}, defaults, this.data || {});
      console.log(this.form,'temptemptemp')
      if(this.data) {
        if (this.data.applianceUse) {
          if (this.form && this.form.id) {
            this.form.applianceUse = this.data.applianceUse.split(',')
          }
        }
      }
    },
    removeHandle(tagname) {
      this.$emit("closeChildPage");
    },
    //保存按钮事件
    handleSubmit() {
      let _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          if(this.form.applianceUse &&　this.form.applianceUse.length>0){
            this.form.applianceUse = this.form.applianceUse.toString();
          }else{
            this.form.applianceUse="";
          }
          let rowInfo = this.form;
          delete rowInfo.updateTime;
          delete rowInfo.addTime;
          if (rowInfo.suspendEndTime == "" || rowInfo.suspendEndTime == null) {
            delete rowInfo.suspendEndTime;
          } else {
            rowInfo.suspendEndTime = new Date(rowInfo.suspendEndTime);
          }
          if (rowInfo.suspendBeginTime == "" || rowInfo.suspendBeginTime == null) {
            delete rowInfo.suspendBeginTime;
          } else {
            rowInfo.suspendBeginTime = new Date(rowInfo.suspendBeginTime);
          }
          if(rowInfo.applianceRealname){
            rowInfo.applianceRealname = this.ToCDB(rowInfo.applianceRealname);
          }
          if (rowInfo.id) {
            ajaxRequest("put", "back/appliance/", rowInfo, function(res) {
              if (res.code === 200) {
                _this.$message.success("编辑成功");
                if(rowInfo.applianceUse){
                  _this.form.applianceUse = rowInfo.applianceUse.split(',')
                }
              } else {
                _this.$message.error("编辑失败");
              }
            });
          } else {
            ajaxRequest("post", "back/appliance/", rowInfo, function(res) {
              if (res.code === 200) {
                _this.$message.success("新增成功");
                if(_this.otherAdd){
                  _this.callbackAdd(res.daoResult);
                }
                _this.handleClear();
              } else {
                _this.$message.error("新增失败");
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    //器具实际名称全半角转换
    ToCDB(str) {
      var tmp = "";
      if(str){
        for (var i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
          }
          else {
            tmp += String.fromCharCode(str.charCodeAt(i));
          }
        }
      }
      return tmp;
    },
    //返回按钮事件
    handleCancel() {
      //如果是业务受理的时候添加器具
      if(this.otherAdd){
        this.callbackAdd();
      }
      this.callback();
    },
    //获取强检目录下拉列表
    getCompulsoryVerifyCatalogs(){
        ajaxRequest('get','back/forceCatalogItem/list',{isDelete:0},(res)=>{
          if(res.code === 200){
            this.compulsoryVerifyCatalogs = res.rows;
          }
        })
    },
    //获取部门列表
    ajaxDepartNameObj() {
      ajaxRequest(
        "get",
        "back/depart/list/",
        {
          isDelete: 0
        },
        function(data) {
          if (data.code === 200) {
            if(data.rows.length){
              for (var i = 0; i < data.rows.length; i++) {
                this.departNameData.push({
                  departId: data.rows[i].id,
                  departName: data.rows[i].departName
                });
              }
            }
          }

          if(btnPower==null || btnPower==undefined) {
            btnPower = "@@";
          }

          if(btnPower.indexOf("@M6410@")==-1){//没有权限，操作本部门
            this.form.departId = parseInt(localStorage.getItem("departId"));
            this.getPostListForFirst(this.form.departId);
            this.isUseOtherDep = true;
          }else{
            if(!this.form.departId){
              this.form.departId = parseInt(localStorage.getItem("departId"));
            }
            this.getPostListForFirst(this.form.departId);
            this.isUseOtherDep = false;
          }
        }.bind(this)
      );
    },
    //获取人员列表
    getPostListForFirst(departId) {
      //        this.form.postId="";
      this.postNameData = [];
      ajaxRequest(
        "get",
        "back/post/listByDeptId/" + departId,
        {
          isDelete: 0
        },
        function(data) {
          if (data.code === 200) {
            if(data.rows.length){
              for (var i = 0; i < data.rows.length; i++) {
                this.postNameData.push({
                  postId: data.rows[i].id,
                  postName: data.rows[i].postName
                });
              }
            }
          }
        }.bind(this)
      );
    },
    // 获取人员列表
    getPostList(departId) {
      Vue.set(this.form, 'postId', '');
      this.postNameData = [];
      ajaxRequest(
        "get",
        "back/post/listByDeptId/" + departId,
        {
          isDelete: 0
        },
        function(data) {
          if (data.code === 200) {
            if(data.rows.length){
              for (var i = 0; i < data.rows.length; i++) {
                this.postNameData.push({
                  postId: data.rows[i].id,
                  postName: data.rows[i].postName
                });
              }
            }
          }
        }.bind(this)
      );
    },
    //获取类别代码下拉列表
    getCategoryList() {
      ajaxRequest(
        "get",
        "back/category/retrieve",
        {
          isDelete: 0
        },
        function(data) {
          if (data.code === 200) {
            if(data.rows.length){
              for (var i = 0; i < data.rows.length; i++) {
                this.categoryIds.push({
                  id: data.rows[i].id,
                  name:
                    data.rows[i].categoryName +
                    "(" +
                    data.rows[i].categoryCode +
                    ")"
                });
              }
            }
          }
        }.bind(this)
      );
    },
    //获取服务类型下拉列表
    getServiceType() {
      ajaxProxyRequest("get", "/njmind/findParam/certificateType", {}, res => {
        console.log(res.list);
        this.certificateTypes = res.list;
      });
    },
    //获取强检类别下拉列表
    getCompulsoryVerifyCategory() {
      ajaxProxyRequest("get", "/njmind/findParam/forceType", {isDelete:0}, res => {
        console.log(res.list);
        this.compulsoryVerifyCategorys = res.list;
      });
    },
    // 获取器具用途
    getApplianceUses() {
      ajaxProxyRequest("get", "/njmind/findParam/applianceUse", {}, res => {
        this.applianceUses = res.list;
      });
    },
    //获得检定周期
    getCertificateJdzqArr() {
      ajaxProxyRequest("get", "/njmind/findParam/certificateJdzq", {}, res => {
        this.certificateJdzqArr = res.list;
      });
    },

    //验证检测费大于0
    verificateDetectionFee(){
      let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
      if (this.form.detectionFee != "") {
        if (!regu.test(this.form.detectionFee)) {
          this.form.detectionFee=0.00;
        }else{
          this.form.detectionFee = parseFloat(this.form.detectionFee).toFixed(2);
        }
      }else{
        this.form.detectionFee = 0.00;
      }
    },
    //验证检测点大于0
    verificateDetectionPoint(){
      let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
      if (this.form.detectionPoint != "") {
        if (!regu.test(this.form.detectionPoint)) {
          this.form.detectionPoint=0.00;
        }else{
          this.form.detectionPoint = parseFloat(this.form.detectionPoint).toFixed(2);
        }
      }else{
        this.form.detectionPoint = 0.00;
      }
    },
    //验证附加费大于0
    verificateAttachedFee(){
      let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
      if (this.form.attachedFee != "") {
        if (!regu.test(this.form.attachedFee)) {
          this.form.attachedFee=0.00;
        }else{
          this.form.attachedFee = parseFloat(this.form.attachedFee).toFixed(2);
        }
      }else{
        this.form.attachedFee = 0.00;
      }
    },
    //按钮_计量器具修改权限
    checkPower(){
      if (btnPower.indexOf("@M6420@") !=-1){//按钮_计量器具修改权限
        this.isModifyPower = true;
      }
    }
  }
};
</script>

<style lang="scss">
.applianceFormTotal{
  @media screen and (max-width:1500px){
    .el-col-6{width: 50%!important;}
    .mid{width:50%!important;}
    .large{width:100%!important;}
  }
}
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
.footButton {
  width: 100%;
  margin: 50px 0;
  /* display: inline-block; */
  display: flex;
  justify-content: center;
  /* margin: 0 auto; */
}
.custom-1d74b7 .el-col-4 {
  width: 25%;
}
.big-width {
  width: 100%;
}
.el-checkbox__label {
  padding-left: 5px !important;
}
.custom-1d74b7 .el-checkbox + .el-checkbox {
  margin-left: 5px !important;
}
.custom-1d74b7 .el-button--warning {
  background-color: #ff8585 !important;
  border:#ff8585!important;
}
.custom-1d74b7 .el-button--warning:hover {
  background-color: #ff9c9c !important;
  border:#ff9c9c!important;
}
.custom-1d74b7 .el-form-item__error {
  margin-top: -4px !important;
}
.ft12{
  font-size: 12px;
}
</style>
