<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="line-height:18px;" >
      <el-Row>
        <el-col :span="1">
          <el-form-item label="单位名称" prop="companyName">
            <!-- <el-input v-model="form.companyName"
                      v-rightclick="handleRightClick.bind(this,form,'companyName')"
                      :disabled="isWatch"
                      @focus="focus('companyName')"></el-input> -->
              <el-autocomplete
                v-model="form.companyName"
                :fetch-suggestions="querySearchAsync"
                value="sjdw"
                value-key="sjdw"
                @select="handleSelect"
                style="width:100%;"
                :disabled="isWatch"
                :debounce="1000"
              >
              <template slot-scope="{item}">
                  <el-button :class="{special:!!item.isSpecial}" :disabled="true" type="text">{{item.sjdw}}</el-button>
                <!-- <template v-if="!!isSpecial">
                </template>
                <template v-else>
                  <div>{{item.sjdw}}</div>
                </template> -->
              </template>
              </el-autocomplete>
          </el-form-item>
        </el-col>

        <el-col :span="1">
          <el-form-item  prop="companyNameEn">
            <template slot="label">
              <span>单位名称(英文)</span>
              <el-tooltip content="用于中英文内容对照证书">
                <i class="el-icon-info fS12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.companyNameEn" :disabled="isWatch" @focus="changeTextFont('companyNameEn',form)"
                      v-rightclick="handleRightClick.bind(this,form,'companyNameEn')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-Row>
        <el-col :span="1">
          <el-form-item label="地址" prop="address">
            <el-input :disabled="isWatch"  v-model="form.address" @focus="changeTextFont('address',form)"  v-rightclick="handleRightClick.bind(this,form,'address')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="1">
          <el-form-item label="地址（英文）" prop="addressEn">
            <el-input  :disabled="isWatch" v-model="form.addressEn" @focus="changeTextFont('addressEn',from)" v-rightclick="handleRightClick.bind(this,form,'addressEn')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-Row>
        <el-form-item label="证书单位名称" prop="certificateCompanyName">
          <el-input :disabled="isWatch"  v-model="form.certificateCompanyName" @focus="changeTextFont('certificateCompanyName',form)" v-rightclick="handleRightClick.bind(this,form,'certificateCompanyName')"></el-input>
        </el-form-item>
      </el-Row>

      <el-Row>
        <el-form-item label="现场检测地址" prop="sceneTestingAddress">
          <el-input :disabled="isWatch"  v-model="form.sceneTestingAddress" @focus="changeTextFont('sceneTestingAddress',form)" v-rightclick="handleRightClick.bind(this,form,'sceneTestingAddress')"></el-input>
        </el-form-item>
      </el-Row>


      <el-Row>
        <el-col :span="8">
          <el-form-item label="客户联系人" prop="contacter">
            <el-input :disabled="isWatch"  v-model="form.contacter" @focus="changeTextFont('contacter',form)"  v-rightclick="handleRightClick.bind(this,form,'contacter')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号码" prop="mobilePhone">
            <el-input :disabled="isWatch"  v-model="form.mobilePhone" @focus="changeTextFont('mobilePhone',form)"
                      v-rightclick="handleRightClick.bind(this,form,'mobilePhone')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户对接部门" prop="companyDepart">
            <el-input :disabled="isWatch"  v-model="form.companyDepart" @focus="changeTextFont('companyDepart',form)"
                      v-rightclick="handleRightClick.bind(this,form,'companyDepart')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户负责人" prop="companyCharge">
            <el-input :disabled="isWatch"  v-model="form.companyCharge" @focus="changeTextFont('companyCharge',form)"
                      v-rightclick="handleRightClick.bind(this,form,'companyCharge')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="8">
          <el-form-item label="单位类别" prop="companyType">
            <template slot="label">
                <span>单位类别</span>
                <el-tooltip>
                  <i class="el-icon-info" style="font-size:12px;"></i>
                  <div slot="content">
                    <p>第一类别：允许不担保未结帐直接出库；</p>
                    <p>第二类别：合同单位，担保时默认协议签属人与协议有效期， 若合同有效期已过期，则不允许担保； </p>
                    <p>第三类别：该单位送检的器具若有合同号，则以合同签署人担保。有效期默认三个月！ 若该单位送检的器具不包含在合同中，对于该器具以第四类别单位处理；</p>
                    <p>第四类别：默认第四类别单位，即正常单位。允许本所员工以电子签名密码与登录密码对其进行担保，有效期默认三个月；</p>
                    <p>第五类别：不允许对该客户单位担保，必须结帐出库；</p>
                    <p>第六类别：不对该客户提供服务。</p>
                  </div>
                </el-tooltip>
            </template>
            <el-select :disabled="isWatch"
              placeholder="请选择" class="list-width"
              value-key="name"
              v-model="form.companyType"
              >
              <el-option
                v-for="item in companyTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item  label="统一社会信用代码" prop="creditCode">
            <el-input :disabled="isWatch"  v-model="form.creditCode" @focus="changeTextFont('creditCode',form)"  v-rightclick="handleRightClick.bind(this,form,'creditCode')"></el-input>
          </el-form-item>
        </el-col>

          <el-col :span="8">
          <el-form-item label="业务组" prop="businessGroup">
            <el-select :disabled="isWatch"  v-model="form.businessGroup"
                       v-rightclick="handleRightClick.bind(this,form,'businessGroup')" @change="businessEvt" class="list-width">
              <el-option
                v-for="item in businessGroupNames"
                :key="item.businessGroup"
                :label="item.businessGroupName"
                :value="item.businessGroup">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="业务员" prop="businessStaff">
            <el-select :disabled="isWatch"  v-model="form.businessStaff"
                       placeholder="请选择" @change="staffEvt" class="list-width">
              <el-option
                v-for="item in staffs"
                :key="item.staff"
                :label="item.staffName"
                :value="item.staff">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-Row>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="telephone">
            <el-input :disabled="isWatch"  v-model="form.telephone" @focus="changeTextFont('telephone',form)"  v-rightclick="handleRightClick.bind(this,form,'telephone')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="传真" prop="fax">
            <el-input :disabled="isWatch"  v-model="form.fax" @focus="changeTextFont('fax',form)"  v-rightclick="handleRightClick.bind(this,form,'fax')"></el-input>
          </el-form-item>
        </el-col>
          <el-col :span="8">
          <el-form-item label="邮箱" prop="email">
            <el-input :disabled="isWatch"  v-model="form.email" @focus="changeTextFont('email',form)"  v-rightclick="handleRightClick.bind(this,form,'email')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮编" prop="postCode">
            <el-input :disabled="isWatch"  v-model="form.postCode" @focus="changeTextFont('postCode',form)" v-rightclick="handleRightClick.bind(this,form,'postCode')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-Row>
        <el-col :span="8" class="large">
          <el-form-item  prop="industryValue">
            <template slot="label">
              <span>所属行业</span>
              <el-tooltip content="该客户所属行业，可通过数据字典新增行业">
                <i class="el-icon-info fS12"></i>
              </el-tooltip>
            </template>
            <el-select class="list-width" :disabled="isWatch"
              placeholder="请选择"
              value-key="name"
              v-model="form.industryValue"
              >
              <el-option
                v-for="item in industryCategorys"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" class="small">
          <el-form-item prop="provinceId">
            <template slot="label">
              <span>行政区划</span>
              <el-tooltip content="可通过行政区划维护内容、设置默认的行政区划">
                <i class="el-icon-info fS12"></i>
              </el-tooltip>
            </template>
            <el-select class="list-width" :disabled="isWatch"
              placeholder="请选择"
              value-key="name"
              v-model="form.provinceId"
              @change="provinceEvt"
            >
              <el-option
                v-for="item in provinces"
                :key="item.provinceIds"
                :label="item.provinceName"
                :value="item.provinceIds">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="small">
          <el-form-item  prop="cityId">
            <el-select class="list-width" :disabled="isWatch"
              placeholder="请选择"
              value-key="name"
              v-model="form.cityId"
              @change="cityEvt">
              <el-option
                v-for="item in citys"
                :key="item.cityIds"
                :label="item.cityName"
                :value="item.cityIds">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="small">
          <el-form-item prop="areaId">
            <el-select class="list-width" :disabled="isWatch"
              placeholder="请选择"
              value-key="name"
              v-model="form.areaId"
              @change="areaIdSelect"
              >
              <el-option
                v-for="item in areas"
                :key="item.areaIds"
                :label="item.areaName"
                :value="item.areaIds">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-Row>
       <el-Row>
          <el-form-item prop="certificateRequirement">
            <template slot="label">
              <span>证书要求</span>
              <el-tooltip content="用于流转单打印、证书/记录添加、审核时提醒相应人员">
                <i class="el-icon-info fS12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.certificateRequirement" :disabled="isWatch"  @focus="changeTextFont('certificateRequirement',form)"
                      v-rightclick="handleRightClick.bind(this,form,'certificateRequirement')"></el-input>
          </el-form-item>
        <!-- <el-col :span="8">
          <el-form-item label="加盖CNAS章" prop="sealedByCnas">
            <el-radio-group v-model="form.sealedByCnas">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
      </el-Row>


      <el-Row>
        <el-col :span="24">
          <el-form-item  prop="visitSpecialRequirement">
            <template slot="label">
              <span>上门特殊要求</span>
              <el-tooltip content="用于现场委托单打印">
                <i class="el-icon-info fS12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.visitSpecialRequirement" :disabled="isWatch"  @focus="changeTextFont('visitSpecialRequirement',form)"
                      v-rightclick="handleRightClick.bind(this,form,'visitSpecialRequirement')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
  <!-- **********************字段缺失********************** -->
      <!-- <el-Row>
        <el-col :span="24">
          <el-form-item label="证书特殊要求" prop="specialCertificateRequire">
            <el-input   :disabled="isWatch" v-model="form.specialCertificateRequire" @focus="changeTextFont('specialCertificateRequire',form)"
            v-rightclick="handleRightClick.bind(this,form,'specialCertificateRequire')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row> -->
  <!-- ******************************************** -->
      <el-Row>
        <el-col :span="24">
          <el-form-item label="其他特殊要求" prop="otherSpecialRequirement">
            <el-input :disabled="isWatch"  @focus="changeTextFont('otherSpecialRequirement',form)"  v-model="form.otherSpecialRequirement"
            v-rightclick="handleRightClick.bind(this,form,'otherSpecialRequirement')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>


      <el-Row>
        <el-col :span="8">
          <el-form-item label="业务提成(%)" prop="businessPromotion">
            <template slot="label">
              <span>业务提成(%)</span>
              <el-tooltip content="可用于统计时针对该客户的提成比例">
                <i class="el-icon-info fS12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.businessPromotion" :disabled="isWatch" ></el-input>

          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="附件"  prop="attachment">
            <mind-upload :disabled="isWatch" :limitNuymb="limitNumb" ref="upFiles" :callBack="callBack" :before-upload='handleFileUploading' ></mind-upload>
            <el-input :disabled="isWatch"   v-model="form.attachment" v-show="false"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-row>
        <!-- ***************备注的字段要更改****************** -->
        <el-form-item label="备注" prop="remark">
          <el-input :disabled="isWatch"  @focus="changeTextFont('remark',form)" v-model="form.remark" v-rightclick="handleRightClick.bind(this,form,'remark')"></el-input>
        </el-form-item>
        <!-- *********************************************** -->
      </el-row>
      <div class="title-item">
        <span>开票信息</span>
        <el-tooltip content="该信息用于制作缴费单、财务结账时默认相应内容">
          <i class="el-icon-info fS12" style="color:#606266;"></i>
        </el-tooltip>
      </div>
      <el-Row>
        <el-col :span="8">
          <el-form-item label="名称" prop="invoiceCompany">
            <el-input v-model="form.invoiceCompany" :disabled="isWatch"  @focus="changeTextFont('invoiceCompany',form)"
                      v-rightclick="handleRightClick.bind(this,form,'invoiceCompany')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="纳税人识别号" prop="taxNo">
            <el-input :disabled="isWatch"  v-model="form.taxNo" @focus="changeTextFont('taxNo',form)"  v-rightclick="handleRightClick.bind(this,form,'taxNo')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地址、电话" prop="invoiceAddressTel"  >
            <el-input v-model="form.invoiceAddressTel" :disabled="isWatch"
                       @focus="changeTextFont('invoiceAddressTel',form)" v-rightclick="handleRightClick.bind(this,form,'invoiceAddressTel')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="开户行及账号" prop="accountBankNo">
            <el-input v-model="form.accountBankNo" :disabled="isWatch"
                       @focus="changeTextFont('accountBankNo',form)" v-rightclick="handleRightClick.bind(this,form,'accountBankNo')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
    </el-form>
    <br>
    <span slot="footer" class="dialog-footer" style="display: block; text-align: center;" v-if="!isWatch">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
      <el-button type="warning" @click="handleClear" v-if="!isPut">清 空</el-button>
      <template v-if="otherAdd">
        <el-button  @click="callbackAdd">取 消</el-button>
      </template>
      <template v-if="isPut">
        <el-button @click="handleCancel" v-if="!audit||isPut">返 回</el-button>
      </template>
    </span>
  </div>
</template>

<script>
import Vue from "vue";

import { ajaxRequest, ajaxProxyRequest } from "../../util/base";
import $ from "jquery";
import rightclick from "../../../directives/rightcilck";
import rightClick from "../../../mixins/FormRightClick";

/* import {
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
  Upload
} from "element--ui";
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Upload); */

const defaults = {
  companyType: 4,
  sealedByCnas: 0
};
export default {
  name: "company-form",
  props: {
    data: {
      type: Object
    },
    isPut: {
      type: Boolean,
      default:false,
    },
    isWatch:{
      type:Boolean,
      default:false
    },
    callbackAdd:{
      type:Function
    },
    otherAdd:{
      type: Boolean
    },
    // 在审核页面的状态，控制返回按键
    audit:{
      type:Boolean,
      default:false
    }
  },
  data() {
    let mobilePhoneCheck = function(rule, value, callback) {
      let ruleRex = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
      if (!!!value) {
        callback(new Error("手机号码不能为空"));
      } else if (ruleRex.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    let commonLengthCheck = function(rule, value, callback) {
      if (!!!value) {
        callback();
      } else if (value.length > 100) {
        callback(new Error("最多输入100个字符"));
      } else {
        callback();
      }
    };
    let promotionCheck = function(rule, value, cb) {
      let ruleRex = /^([0-9]|[.])*$/;
      if (!!!value) {
        cb();
      } else{
        if(typeof value != String){
            value = value + '';
          }
          if(value.length>10){
            cb(new Error('最多输入10个字符'))
          }else{
            let arr = value.split('.')
            if(arr.length>2){
              cb(new Error('请输入正确格式数字'))
            }
            if(ruleRex.test(value)){
              cb()
            }else{
              cb(new Error('请输入数字'))
            }
          }
      }

      // if (ruleRex.test(value)) {
      //   if(value.length>10){
      //     cb(new Error('最多输入10个字符'))
      //   }else{
      //     cb()
      //   }
      //   cb();
      // } else {
      //   cb(new Error("请输入正确的格式"));
      // }
    };
    let companyNameEnCheck = (rule, value, cb) => {
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
    let commonLength100NCheck = (rule,value,cb)=>{
      if(value){
        if(value.length > 100){
          cb(new Error('最多输入100个字符'))
        }else{
          cb()
        }
      }else{
        cb()
      }
    }
    let postCodeCheck = (rule,value,cb)=>{
      if(value){
        let regx = /^[0-9]*$/g
        value= value+''
        if(value.length>10){
          cb(new Error('最多输入10个字符'))
        }else{
          if(regx.test(value)){
            cb()
          }else{
            cb(new Error('请输入正确格式'))
          }
        }
      }else{
        cb()
      }
    }
    let faxCheck = (rule,value,cb)=>{
      if(value){
        value = value + ''
        if(value.length>20){
          cb(new Error('最多输入20个字符'))
        }else{
          let regx = /^[0-9-]*$/g
          if(regx.test(value)){
            cb()
          }else{
            cb(new Error('请输入正确格式传真'))
          }
        }
      }else{
        cb()
      }
    }
    return {
      form: $.extend({}, defaults, this.data || {}),
      rules: {
        companyName: [
          {
            type: "string",
            required: true,
            message:'单位名称不能为空',
            trigger: "blur"
          },
          {
            max:100,
            message:'最多输入100个字符',
            trigger:'blur'
          }
        ],
        companyType: [
          { type: "integer", required: true, message: "单位类别不能为空" }
        ],
        contacter: [
          { type: "string", required: true, message: "客户联系人不能为空" },
          {max:30,message:'最多输入30个字符',trigger:'blur'}
        ],
        mobilePhone: [
          {
            type: "string",
            validator: mobilePhoneCheck,
            required: true,
            trigger: "blur"
          }
        ],
        address: [
          {
            type: "string",
            required: true,
            message:'单位地址不能为空',
            trigger: "blur"
          },
          {
            max:50,
            message:'最多输入50个字符',
            trigger:'blur'
          }
        ],
        addressEn: [{type:'string', validator: companyNameEnCheck, trigger: "blur" }],
        visitSpecialRequirement: [
          { validator: commonLengthCheck, trigger: "blur" }
        ],
        otherSpecialRequirement: [
          { type:'string',max:200,message:'最多输入200个字符', trigger: "blur" }
        ],
        certificateRequirement: [
          { validator: commonLengthCheck, trigger: "blur" }
        ],
        businessPromotion: [
          { type: "string", validator: promotionCheck, trigger: "blur" }
        ],
        companyNameEn: [
          {
            type: "string",
            validator: companyNameEnCheck,
            trigger: "blur"
          }
        ],
        sceneTestingAddress:[
          {validator:commonLength100NCheck,trigger:'blur'}
        ],
        certificateCompanyName:[
          {validator:commonLength100NCheck,trigger:'blur'}
        ],
        companyDepart:[
          {type:'string',max:30,message:'最多输入30个字符',trigger:'blur'}
        ],
        companyCharge:[
          {type:'string',max:30,message:'最多输入30个字符',trigger:'blur'}
        ],
        telephone:[
          {validator:telephoneCheck,trigger:'blur'}
        ],
        email:[
          {validator:emailCheck,trigger:'blur'}
        ],
        remark:[
          { validator: commonLengthCheck, trigger: "blur" }
        ],
        invoiceCompany:[
          {max:50,message:'最多输入50个字符',trigger:'blur'}
        ],
        taxNo:[
          {max:50,message:'最多输入50个字符',trigger:'blur'}
        ],
        creditCode:[
          {max:30,message:'最多输入30个字符',trigger:'blur'}
        ],
        postCode:[
          {validator:postCodeCheck,trigger:'blur'}
        ],
        // specialCertificateRequire:[
        //   {type:'string',max:50,message:'最多输入50个字符',trigger:'blur'}
        // ],
        taxNo:[
          {max:50,message:'最多输入50个字符',trigger:'blur'}
        ],
        invoiceAddressTel:[
          {max:50,message:'最多输入50个字符',trigger:'blur'}
        ],
        accountBankNo:[
          {max:50,message:'最多输入50个字符',trigger:'blur'}
        ],
        fax:[
          {validator:faxCheck,trigger:'blur'}
        ]

      },

      attachment: "",
      fileListArray: [], //
      limitNumb: 4, //附件上传个数限制
      up_url: "", //自定义上传路径 [非必填]  默认不用修改
      fdata:{//附件上传额外参数
        caseId: "", //登记号       [非必填]  业务相关的登记号
        serverId: "", //服务id     [非必填]  分布式附件服务可以用默认不用配制
        flowId: "", //流程id      [非必填]  流程相关
        execType: "", //操作类型   [非必填]  业务相关
      },
      industryCategorys: [],
      loading: false,
      businessGroupNames: [],
      staffs: [],
      remoteOptions: [],
      provinces: [],
      citys: [],
      areas: [],
      alreadyPost: false,
      companyName:'',
      companyTypes: [
        { id: 1, name: "第一类别" },
        { id: 2, name: "第二类别" },
        { id: 3, name: "第三类别" },
        { id: 4, name: "第四类别" },
        { id: 5, name: "第五类别" },
        { id: 6, name: "第六类别" }
      ],
      // aId:110102 ,
      // 用来对上传文件进行判断，现有的上传问题是callback在before-upload之前调用，导致无法进行去重操作
      uploadTimes:0,
    };
  },
  mounted() {
    this.getIndustryCategory();
    if (!!this.form.attachment) {
      let fileId = this.form.attachment.slice(
        0,
        this.form.attachment.length - 1
      );
      this.$refs.upFiles.loadAttacheIds(fileId);
    }
    this.remoteMethod();
    //获取业务组
    ajaxRequest(
      "get",
      "back/businessStaff/getBusinessGroupName",
      {},
      function(res) {
        this.businessGroupNames = res;
        if (this.form.businessGroup) {
          this.departEvtInit(this.form.businessGroup);
        }
      }.bind(this)
    );

    //获取省初始化
    new Promise((resolve,reject)=>{
      ajaxRequest(
        "get",
        "back/company/getRegion?type=0",
        {isDelete:0},
        function(res) {
            this.provinces = res;
            if(!this.form.provinceId){
              Vue.set(this.form, "provinceId", res[0].provinceIds);
              resolve(res[0].provinceIds);
            }else{
              resolve(this.form.provinceId)
            }
        }.bind(this)
      );
    }).then((id)=>{
        ajaxRequest(
          "get",
          "back/company/getRegion?type=1&id=" + id,
          {isDelete:0},
          res => {
            this.citys = res;
            let cityId = '';
            if(!this.form.cityId){
              Vue.set(this.form, 'cityId',res[0].cityIds);
              cityId = res[0].cityIds;
            }else{
              cityId = this.form.cityId;
            }
            ajaxRequest("get", "back/company/getRegion?type=2&id=" + cityId, {isDelete:0}, res => {
              this.areas = res;
              if(!this.form.areaId){
                Vue.set(this.form, "areaId", res[0].areaIds);
              }
            });
          }
        );
    })
  },
  directives: { rightclick },
  mixins: [rightClick],
  methods: {
    // 上传文件的判定
    handleFileUploading(file) {
      if(!!file.name){
        for(let i = 0 ; i < this.fileListArray.length ; i ++){
          if(file.uid!=this.fileListArray[i].uid){
            if(file.name == this.fileListArray[i].name){
              return new Promise((resolve,reject)=>{
                this.$confirm('文件名已存在，是否覆盖？').then(()=>{
                  this.$refs.upFiles.setDeleteIds(this.fileListArray[i].id);
                  resolve(true);
                }).catch(()=>{
                  reject(false)
                })
              })
            }
          }
        }
      }else{
        return true;
      }
    },
    getIndustryCategory() {
      ajaxProxyRequest("get", "/njmind/findParam/industryCategory", {}, res => {
        this.industryCategorys = res.list;
      });
    },

    //callBack上传组件数据发生变化回调
    callBack(file, list) {
      this.fileListArray = list;
    },
    businessEvt(id) {
      ajaxRequest(
        "get",
        "back/businessStaff/StaffByBusinessGroupId?businessGroup=" + id,
        {},
        res => {
          this.staffs = res;
          Vue.set(this.form, "businessStaff", "");
        }
      );
    },

    departEvtInit(id) {
      if (id) {
        ajaxRequest(
          "get",
        "back/businessStaff/StaffByBusinessGroupId?businessGroup=" + id,
          {},
          res => {
            this.staffs = res;
            Vue.set(this.form, "businessStaff", this.form.businessStaff);
          }
        );
      }
    },

    regionEvtInit(id) {
      if (id) {
        ajaxRequest(
          "get",
          "back/company/getRegion?type=1&id=" + id,
          {},
          res => {
            this.citys = res;
            //Vue.set(this.form, 'city', parseInt(this.form.city));
            this.regionEvtInit1(this.form.cityId);
          }
        );
      }
    },

    regionEvtInit1(id) {
      if (id) {
        ajaxRequest(
          "get",
          "back/company/getRegion?type=2&id=" + id,
          {},
          res => {
            this.areas = res;
          }
        );
      }
    },
    //省点击事件,获取区
    provinceEvt(id) {
      ajaxRequest("get", "back/company/getRegion?type=1&id=" + id, {}, res => {
        this.citys = res;
        Vue.set(this.form, "cityId", "");
        Vue.set(this.form, "areaId", "");
      });
    },
    //市点击事件,获取县
    cityEvt(id) {
      ajaxRequest("get", "back/company/getRegion?type=2&id=" + id, {}, res => {
        this.areas = res;
        Vue.set(this.form, "areaId", "");
      });
    },
    areaIdSelect(info){
      this.form.areaId = info;
    },
    staffEvt(id) {
      this.charges.forEach(data => {
        if (id == data.staff) {
          Vue.set(this.form, "businessStaff", data.staff);
          Vue.set(this.form, "businessStaffName", data.staffName);
        }
      });
    },

    handleSubmit() {
      let _this = this;
      if (!!this.fileListArray.length) {
        let attachment = "";
        for (let i = 0; i < this.fileListArray.length; i++) {
          if(!!this.fileListArray[i].response){
            attachment += this.fileListArray[i].response.v_attach_id + ",";
          }else{
            attachment += this.fileListArray[i].id + ","
          }
        }
        _this.form.attachment = attachment;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          // 进行编辑与新增的区分
          if (this.isPut || this.alreadyPost) {
            _this.form.updateWay = 0;
            ajaxRequest("put", "back/company/", _this.form, res => {
              if (res.code === 200) {
                _this.$message({
                  type: "success",
                  message: "保存成功"
                });
              }
            });
          } else {
            ajaxRequest("post", "back/company/", _this.form, res => {
              if (res.code === 200) {
                this.form = res.daoResult;
                this.alreadyPost = true;
                _this.$message({
                  type: "success",
                  message: "新增成功"
                });
                _this.$emit("enableClick",res.daoResult);
                if(this.otherAdd){
                  this.callbackAdd(this.form);
                }
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    remoteMethod(keyWords) {
      this.loading = true;
    },
    handleCancel() {
      // this.callback(null);
      this.$emit("willBack");
    },
    handleClear() {
      this.form = {};
      this.$refs["form"].resetFields();
      this.$refs["upFiles"].$refs["upFiles"].clearFiles();
    },
    focus(name){
      this.$store.state.myName = name;
      this.$store.state.form = this.form;
    },
    // 远程搜索方法
    querySearchAsync(querystring,cb){
      if(querystring == undefined || querystring == '' || !querystring){
        cb([])
        return ;
      }else{
        ajaxRequest('get','back/company/queryCompanyName',{companyName:querystring},res=>{
          if(res.code ===200){
            // 第一个的提醒信息
            // _special:设置被点击选中无效的标志位
            res.rows.unshift({sjdw:'以下为相似单位名称:' + res.rows.length,isSpecial:1,_special:1})
            cb(res.rows)
          }else{
            this.$message.error('查询出错，请重试！')
          }
        })
      }
    },
    handleSelect(item){
    }
  }
};
</script>

<style scoped>
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
.custom-1d74b7 .el-col-1 {
  width: 50%;
}
.custom-1d74b7 .el-col-8 {
  width: 25%;
}
@media screen and (max-width:1500px){
  /*.custom-1d74b7 .el-col-1{width: 100%!important;}*/
  .custom-1d74b7 .el-col-8{width: 50%!important;}
  .custom-1d74b7 .small{width: 25%!important;}
  .custom-1d74b7 .large{width: 100%!important;}
}
.list-width {
  width: 100%;
}
.fS12{
  font-size: 12px !important;
}
.special{
  color: red!important;
}
</style>
