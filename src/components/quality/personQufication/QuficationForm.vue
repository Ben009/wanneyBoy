<template>
 <div>
    <el-form ref="form" :model="form"  label-width="80px">
      <el-Row>
        <el-col :span="1" style="text-align:right;margin-top: 14px;">
          <font style="color: red;">*</font>
        </el-col>
        <el-col :span="7">
          <el-form-item label="部门" prop="dept" label-width="44px">
            <!--<mind-select :options="deptLists"-->
                         <!--:optionsConfig="{label:'departName',value:'id'}"-->
                         <!--v-model="dept"-->
                         <!--:changeCallback="driverChangeEvt"-->
                         <!--class="selectFull"></mind-select>-->
            <el-select
              class="validateSel"
              placeholder="请选择"
              value-key="dept"
              v-model="dept" @change="driverChangeEvt" style="width:100%;">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in deptLists"
                :label="item.departName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1" style="text-align:right;margin-top: 14px;">
          <font style="color: red;">*</font>
        </el-col>
        <el-col :span="6">
          <el-form-item label="人员" prop="person" label-width="44px">
            <!--<mind-select :options="personLists" :extraConfig="{disabled:readonly}"-->
                          <!--:optionsConfig="{label:'userName',value:'id'}"-->
                          <!--v-model="person"-->
                          <!--class="selectFull"></mind-select>-->
            <el-select
              class="validateSel"
              placeholder="请选择"
              value-key="person"
              v-model="person" style="width:100%;" @change="toBackName">
              <el-option
                v-for="item in personLists"
                :key="item.userName"
                :label="item.userName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!--<el-col :span="1" style="text-align:right;margin-top: 14px;">-->
          <!--<font style="color: red;">*</font>-->
        <!--</el-col>-->
        <el-col :span="5">
          <el-form-item label="性别" prop="sex">
            <!--单选 -->
            <el-radio-group v-model="form.sex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="1" style="text-align:right;margin-top: 14px;">
          <font style="color: red;">*</font>
        </el-col>
        <el-col :span="7">
          <el-form-item label="出生日期" prop="birthDate" label-width="70px">
            <!-- type指定日期类型为date  placeholder显示提示文字 format格式化日期显示效果 value-format格式化日期提交的值,必须与model实体中该字段的时间格式注解一致   -->
            <el-date-picker
              class="validateIn"
              v-model="form.birthDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期" style="width:100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="1" style="text-align:right;margin-top: 8px;"></el-col>
        <el-col :span="7">
          <el-form-item label="学历" prop="education" label-width="50px">
            <el-select
              placeholder="请选择"
              value-key="education"
              v-model="form.education" style="width:100%;">
              <el-option
                v-for="item in educations"
                :label="item.remark"
                :value="item.remark"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-Row>
        <div class="title-item">
          <span>证件信息</span>
            <el-button @click="addCertificate" class="el-button el-button--primary" style="margin-left: 50px">新增</el-button>
            <!--<el-button @click="deleteCertificate(cer)" class="el-button el-button&#45;&#45;danger">删除</el-button>-->
          <el-button @click="deleteCertificate" class="el-button el-button--danger">删除</el-button>
          <global-tootips  style="float:right;">
            <p>1.有超级权限者资质申报时，直接通过审核。</p>
            <p>2.一个证件的信息维护在一条证件信息上，如有多个证件，点击新增。</p>
            <p>3.发证单位、证件类别、证件名称在基础数据维护节点维护。</p>
          </global-tootips>
        </div>

      </el-Row>
      <el-checkbox-group v-model="checkData">
      <div v-for="(cer,index1) in certificateList" :key="index1" style="border: 1px dashed red;padding: 10px 20px; margin-bottom: 15px">
        <el-row>
          <el-col v-if="paramObj.type==1">
            <el-checkbox :label="cer.id" :key="cer.id" ></el-checkbox>
          </el-col>
          <el-col :span="1" style="text-align:right;margin-top: 14px;">
            <font style="color: red;">*</font>
          </el-col>
          <el-col :span="5">
            <el-form-item  label="发证单位" prop="certificateDepart" >
              <template slot="label">
                <span>发证单位</span>
                <!--<el-tooltip class="item" effect="dark" content="可在基础数据维护中维护">-->
                  <!--<i class="el-icon-info ft12"></i>-->
                <!--</el-tooltip>-->
              </template>
              <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
              <el-select  class="validateSel"  ref="certificateDepart"   placeholder="请选择"  value-key="certificateDepart"  v-model="cer.certificateDepart" style="width:100%;">
                <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
                <el-option
                  v-for="item in certificateDeparts"
                  :key="item.unit"
                  :label="item.unit"
                  :value="item.unit">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="1" style="text-align:right;margin-top: 14px;">
            <font style="color: red;">*</font>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="certificateCategory">
              <template slot="label">
                <span>证件类别</span>

              </template>

              <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
              <el-select
                class="validateSel"
                placeholder="请选择"
                v-model="cer.certificateCategory" style="width:100%;">
                <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
                <el-option
                  v-for="item in certificateCategorys"
                  :key="item.certificationType"
                  :label="item.certificationType"
                  :value="item.certificationType">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align:right;margin-top: 14px;">
            <font style="color: red;">*</font>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="certificateName">
              <template slot = "label">
                <span>证件名称</span>

              </template>

              <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
              <el-autocomplete style="width: 100%"
                               class="validateSel"
                               v-model="cer.certificateName"
                               :fetch-suggestions="querySearchEntrust"
                               placeholder="请输入委托单位"
              >
                <template slot-scope='scope'>
                  <div>
                    <span style="margin-left:0">{{scope.item.certificationName}}</span>
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align:right;margin-top: 14px;">
            <font style="color: red;">*</font>
          </el-col>
          <el-col :span="5">
            <el-form-item label="证件编号" prop="certificateNo">
              <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
              <el-input class="validateIn" v-model="cer.certificateNo" maxlength="50"  placeholder="50字以内"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="1" style="text-align:right;margin-top: 14px;">
            <font style="color: red;">*</font>
          </el-col>
          <el-col :span="5">
            <el-form-item label="发证日期" prop="certificateDate">
              <!-- type指定日期类型为date  placeholder显示提示文字 format格式化日期显示效果 value-format格式化日期提交的值,必须与model实体中该字段的时间格式注解一致   -->
              <el-date-picker
                class="validateIn"
                v-model="cer.certificateDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align:right;margin-top: 14px;">
            <font style="color: red;"></font>
          </el-col>
          <el-col :span="17">
            <el-form-item label="备注" prop="remark">
              <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
              <el-input  v-model="cer.remark" maxlength="100" placeholder="100字以内"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-Row>
          <el-col :span="1" style="text-align:right;margin-top: 14px;">
            <font style="color: red;">*</font>
          </el-col>
          <el-col :span="8">
            <!--<el-form-item label="证书附件" prop="certificateFile">-->
              <!--<mind-upload ref="upload"   :attachIds="cer.certificateFile" :itemIndex="index1" :limitNumb="limitNumb" :callBack="callBack" ></mind-upload>-->
              <!--<el-input  v-model="cer.certificateFile" v-show="false"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item prop="certificateFile">
              <template slot="label">
                <span>附件</span>
                <el-tooltip class="item" effect="dark" content="可上传4个文件，大小格式不限">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <mind-upload ref="upload"
                           :attachIds="cer.certificateFile"
                           :itemIndex="index1"
                           :limitNumb="limitNumb"
                           :callBack="callBack">
              </mind-upload>
              <el-input class="validateIn" v-model="cer.certificateFile" v-show="false"></el-input>
            </el-form-item>
          </el-col>
        </el-Row>

        <el-Row style="padding-left: 20px"><div class="title-item"><span>持证项目</span></div></el-Row>
        <div style="border: 1px dashed blue;margin:20px;padding-bottom: 10px">
          <el-Row :gutter="20" style="padding-left: 20px;">
            <el-col :span="1" style="text-align:right; padding-right: 0px; margin-top: 14px;">
              <font style="color: red;">*</font>
            </el-col>
            <el-col :span="3">
              <el-form-item label="项目名称" prop="projectName" style="width: 70px;"></el-form-item>
            </el-col>
            <el-col :span="1" style="text-align:right;padding-right: 0px;margin-top: 14px;">
              <font style="color: red;">*</font>
            </el-col>
            <el-col :span="3">
              <el-form-item label="项目类型" prop="source" style="width: 70px;"></el-form-item>
            </el-col>
            <el-col :span="1" style="text-align:right;padding-right: 0px;margin-top: 14px;">
              <font style="color: red;">*</font>
            </el-col>
            <el-col :span="3">
              <el-form-item label="取证日期" prop="projectDate" style="width: 70px;"></el-form-item>
            </el-col>
            <el-col :span="1" style="text-align:right;padding-right: 0px;margin-top: 14px;">
              <font style="color: red;">*</font>
            </el-col>
            <el-col :span="3">
              <el-form-item label="有效日期" prop="projectEfectiveDate" style="width: 70px;"></el-form-item>
            </el-col>
            <!--<el-col :span="2">-->
              <!--<el-form-item label="扫描件" prop="projectFileName" style="width: 70px;"></el-form-item>-->
            <!--</el-col>-->
          </el-Row>
          <el-Row :gutter="20" v-for="(pro,index) in cer.proList" :key="index" style="padding-left: 20px;margin-bottom: 10px">
            <el-col :span="4">
              <el-input class="validateIn" v-model="pro.projectName" @focus="choosePro(1,index1,index)"  ></el-input>
            </el-col>
            <el-col :span="4">
              <el-input class="validateIn" v-model="pro.source"  maxlength="0"></el-input>
            </el-col>
            <el-col :span="4">
              <el-date-picker
                class="validateIn"
                v-model="pro.projectDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;"
                @change="calculateDate(pro,index1,index)">
              </el-date-picker>
            </el-col>
            <el-col :span="4">
              <el-date-picker
                class="validateIn"
                v-model="pro.projectEfectiveDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-col>
            <!--<el-col :span="3" style="margin-left: 60px">-->
              <!--<mind-upload ref="upload2" :attachIds="pro.projectFile" :itemIndex="index1+'-'+index" :limitNumb="limitNumb2" :callBack="callBack2"></mind-upload>-->
              <!--<el-input class="fujian"  v-model="pro.projectFile" v-show="false"></el-input>-->
            <!--</el-col>-->
            <el-col :span="5" class="formBtn" >
              <el-button @click="addProject(index1,index)" class="el-button el-button--primary" >新增</el-button>
              <el-button @click.prevent="deleteProject(pro,index1)" class="el-button el-button--danger">删除</el-button>
              <!--<el-button @click="calculateDate(pro,index1,index)" class="el-button el-button&#45;&#45;primary">计算</el-button>-->
            </el-col>
          </el-Row>
        </div>
      </div>
      </el-checkbox-group>
    </el-form>
      <span slot="footer" class="dialog-footer" style="display:block;text-align: center;">
          <el-button v-if="(paramObj.type==2 && paramObj.personId==creator && paramObj.status!=3)  || paramObj.id==null || (btnPower>=0 && paramObj.type==2)" type="primary" @click="handleSubmit">保存</el-button>
          <el-button v-if="paramObj.type==1"  type="primary" @click="check4shenhe" v-has="'M26201'">审核通过</el-button>
          <el-button v-if="paramObj.type==2 && paramObj.status==0"  type="primary" @click="check" v-has="'M26201'">审核通过</el-button>
          <el-button v-if="paramObj.type==1"  type="primary" @click="back4shenhe" v-has="'M26201'">退回申请</el-button>
          <el-button v-if="paramObj.type==2 && paramObj.status==0"  type="primary" @click="back" v-has="'M26201'">退回申请</el-button>
          <el-button v-if="paramObj.status==3 && paramObj.personId==creator"  type="primary"  @click="checkBack" >撤销审核</el-button>

          <!--<el-button @click="handleCancel"  v-if="this.paramObj.id">返 回</el-button>-->
          <!--<el-button @click="handleCancel"  v-if="!this.paramObj.id">取 消</el-button>-->
      </span>
   <selectProjectForm v-if="chooseproject" :callback="handleCloseSpe" :proIds='proIds' :index="index" :index1="index1" :checkRow="checkRow" :checkRows="checkRows"  :recheckTecBas="recheckTecBas"></selectProjectForm>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import $ from 'jquery';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";
  import  selectProjectForm from './SelectProjectForm';



  const defaults = {
    sex: 0
  };
  export default {
    components: {
      selectProjectForm,
      ElRow,
      ElCol},
    name: "quficationForm",
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object,
        require: true
      },
      callback: {
        type: Function,
        require: true
      },
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
//        rules: {
//          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
//          certificateNo:[{type: 'string', required: true, message: '证件编号不能为空', trigger: 'blur'},
//            {max: 50, message: '最多输入50个字符', trigger: 'blur'}],
//        },
        count:0,
//        fjCount:0,
        paramObj: this.$route.query,
        deptLists:[],//部门
        personLists:[],//人员
        certificateDeparts:[],//发证部门
        certificateCategorys:[],//证书类别,
        educations:[],//学历
        birthDate:null,
        tempId:null,
        person:null,
        personName:null,
        dept:null,
        loading: false,
        chooseproject:false,//项目弹层
        proIds: [],
        index: 0,
        index1: 0,
        row: {},
//        certificateFile:'',
        projectFile:'',
        fileList: [],
        limitNumb: 4, // 附件上传个数限制,
        fileList2: [],
        limitNumb2:1,
        certificateList:[],
        checkData:[],
        idTemp:"",
        creator:localStorage.getItem('userId'),
        btnPower:localStorage.getItem('btnPower').indexOf('@M26201@'),
        certificateName:"",
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
    },
    created(){
      this.getCertificationUnit();
      this.getCertificationType();
      this.getDepartData();

    },
    methods:{
      //证件名称
      querySearchEntrust(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        let params = queryString
          ? {
            certificationName: queryString,
            fuzzySearch: 1
          }
          : "";
        ajaxRequest("get", "back/certificationName/retrieve", params, res => {
          if (res.code == 200) {
            this.handleResult(res.rows);
            cb(res.rows);
          }
        });
      },
      handleResult(res) {
        for (let key in res) {
          Vue.set(res[key], "value", res[key].certificationName);
        }
      },
      //验证方法
      checkForm(){
        let temp=0;
//        let fjTemp=0;
        $('.validateSel').each(function(){
          if($(this).children().eq(0).children().eq(0).val()===undefined||$(this).children().eq(0).children().eq(0).val()===""){
            $(this).children().eq(0).children().eq(0).css("border","1px solid red");
            temp++;
          }else{
            $(this).children().eq(0).children().eq(0).css("border","1px solid #bbb");
          }
        })
        $('.validateIn').each(function(){
          console.log($(this).children().eq(0).val())
          if($(this).children().eq(0).val()===undefined||$(this).children().eq(0).val()===""||$(this).children().eq(0).val()===null){
            $(this).children().eq(0).css("border","1px solid red");
            temp++
          }else{
            $(this).children().eq(0).css("border","1px solid #bbb");
          }
        })
//        $('.fujian').each(function(){
//          console.log($(this).children().eq(0).val())
//          if($(this).children().eq(0).val()===undefined||$(this).children().eq(0).val()===""||$(this).children().eq(0).val()===null){
////            $(this).children().eq(0).css("border","1px solid red");
//            fjTemp++
//          }else{
//            $(this).children().eq(0).css("border","1px solid #bbb");
//          }
//        })
        this.count=temp;
//        this.fjCount=fjTemp;
      },

      reset(){
        this.dept=null,
        this.person=null,
        this.form.birthDate='',
        this.certificateList=[{
          fileList: [],
          certificateFile:'',
          certificateDepart:null,
          certificateCategory:null,
          certificateNo:null,
          certificateName:null,
          certificateDate:null,
          quficationFileName:null,
          proList:[{fileList2: [],projectName: '', projectDate: '', projectEfectiveDate: '',projectFileName:'',linkId:null,source:'',projectFile:''}],
          remark:null
        }]
      },
      //增加证件信息
      addCertificate(){
        this.certificateList.push({
          fileList: [],
          certificateDepart:null,
          certificateCategory:null,
          certificateNo:null,
          certificateName:null,
          certificateFile:'',
          sort:1,
          certificateDate:null,
          quficationFileName:null,
          proList:[{fileList2: [],projectName: '', projectDate: '', projectEfectiveDate: '',projectFileName:'',linkId:null,source:'',projectFile:''}],
          remark:null
        })
      },
      deleteCertificate(){
        var index= this.certificateList.length;
        if (index >1) {
          this.certificateList.splice(index-1,1);
        }
        if(index==1){
          this.certificateList=[{
            fileList: [],
            certificateFile:'',
            certificateDepart:null,
            certificateCategory:null,
            certificateNo:null,
            certificateName:null,
            certificateDate:null,
            quficationFileName:null,
            proList:[{fileList2: [],projectName: '', projectDate: '', projectEfectiveDate: '',projectFileName:'',linkId:null,source:'',projectFile:''}],
            remark:null
          }];
        }else{
          let _this=this;
          $(_this.certificateList).each(function (index) {
            _this.certificateList[index].sort = index + 1
          })
        }
      },
//      deleteCertificate(cer){
//        var index = this.certificateList.indexOf(cer);
//        if (index !== -1) {
//          this.certificateList.splice(index,1);
//        }
//        if(this.certificateList.length==0){
//          this.certificateList=[{
//            fileList: [],
//            certificateFile:'',
//            certificateDepart:null,
//            certificateCategory:null,
//            certificateNo:null,
//            certificateName:null,
//            certificateDate:null,
//            quficationFileName:null,
//            proList:[{fileList2: [],projectName: '', projectDate: '', projectEfectiveDate: '',projectFileName:'',linkId:null,source:'',projectFile:''}],
//            remark:null
//          }];
//        }else{
//          let _this=this;
//          $(_this.certificateList).each(function (index) {
//            _this.certificateList[index].sort = index + 1
//          })
//        }
//      },
      //增加项目信息
      addProject(index1,index){
        this.certificateList[index1].proList.push({
          fileList2: [],
          linkId:null,
          source:null,
          projectName:null,
          projectDate:this.certificateList[index1].proList[index].projectDate,
          projectEfectiveDate:this.certificateList[index1].proList[index].projectEfectiveDate,
          projectFile:''

        })
      },
      deleteProject(pro,index1){
        var index = this.certificateList[index1].proList.indexOf(pro);
        if(index!=-1){
          this.certificateList[index1].proList.splice(index,1);
        }

        if(this.certificateList[index1].proList.length==0){
          this.certificateList[index1].proList=[{
            fileList2: [],
            linkId:null,
            source:null,
            projectName:null,
            projectDate:null,
            projectEfectiveDate:null,
            projectFile:''
          }];
        }else{
          let _this=this;
          $(_this.certificateList[index1].proList).each(function (index) {
            _this.certificateList[index1].proList[index].sort = index + 1
          })
        }
      },
      callBack (file, list,index) {
        let _this=this;
        this.certificateList[index]["fileList"] = list

        let certificateFile = ''
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            certificateFile = list[i].id + ',' + certificateFile
          }
          console.log("11111111"+certificateFile);
        }
        if (certificateFile != '') {
          certificateFile = certificateFile.substring(0, certificateFile.length - 1)
         _this.certificateList[index].certificateFile = certificateFile
        }else{
          _this.certificateList[index].certificateFile = '';
        }

      },
      callBack2 (file, list,index) {

        console.log(index);
        let indexArr=index.split('-');
        let pIndex=indexArr[0];
        let cindex=indexArr[1];
        let _this=this;
        this.certificateList[pIndex].proList[cindex]["fileList2"] = list;
        let certificateFile = ''
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            certificateFile = list[i].id + ',' + certificateFile
          }
        }
        if (certificateFile != '') {
          certificateFile = certificateFile.substring(0, certificateFile.length - 1)
          this.certificateList[pIndex].proList[cindex].projectFile = certificateFile
        }else{
          this.certificateList[pIndex].proList[cindex].projectFile = '';
        }
        console.log('附件变更',this.certificateList);
      },
      choosePro: function (flag,index1, index) {
        for (let i = 0; i < this.certificateList[index1].proList.length; i++) {
          let spe = this.certificateList[index1].proList[i]
          if (spe.linkId != null) {
            this.proIds[this.proIds.length] = spe.linkId
          }
        }
        if (this.form.id != null && this.form.id != '') {
          this.proIds[this.proIds.length] = this.form.id
        }
        this.chooseproject = flag
        this.index = index == null ? 0 : index
        this.index1 = index1 == null ? 0 : index1
      },
      recheckTecBas: function (index1) {
        this.certificateList[index1].proList[this.index]={source:null,projectName:null, projectDate:'',ctEfectiveDate:''}
        this.proIds=[]
        for(let i;i<this.certificateList[index1].proList.length;i++){
          let spe = this.certificateList[index1].proList[i]
          if(spe.linkId != null){
            this.proIds[this.proIds.length] = spe.linkId
          }
        }
        if(this.form.id != null && this.form.id != ''){
          this.proIds[this.proIds.length] = this.form.id
        }
        return this.proIds

      },
      checkRow (row,index1, index,value) {
        if(value=='2'){
          this.certificateList[index1].proList[index]["projectName"] = row.projectName;
          this.certificateList[index1].proList[index]["linkId"]= row.id;
          this.certificateList[index1].proList[index]["source"]='项目';
        }
        if(value=='0'){
          this.certificateList[index1].proList[index]["projectName"] = row.standardName;
          this.certificateList[index1].proList[index]["linkId"]= row.id;
          this.certificateList[index1].proList[index]["source"]='计量标准';
        }
        if(value=='1'){
          this.certificateList[index1].proList[index]["projectName"] = row.name;
          this.certificateList[index1].proList[index]["linkId"]= row.id;
          this.certificateList[index1].proList[index]["source"]='CNAS';
        }
      },
      checkRows(list,index1,index,value) {
        let _this = this;
        if (_this.certificateList[index1].proList.length == 1) {
          this.certificateList[index1].proList = list;
          console.log("list:"+list.toString());

        } else {
        for (var i = 0; i < list.length; i++) {
          var found = false;

          for (var j = 0; j < _this.certificateList[index1].proList.length; j++) {

            if (list[i]["linkId"] === _this.certificateList[index1].proList[j]["linkId"]) {
              found = true;
              break;
            }
          }
          if (!found) {
            _this.certificateList[index1].proList.push({projectName: list[i].projectName, linkId: list[i].linkId, source: list[i].source});
          }
        }
      }
//        //去掉空白行
//        for(var k=0;k<_this.certificateList[index1].proList.length;k++){
//          if(_this.certificateList[index1].proList[k].linkId===null||_this.certificateList[index1].proList[k].linkId==="null"){console.log(44400999)
//            _this.certificateList[index1].proList.splice(k,1);
//          }
//        }
      },

      getBaseDetailById(){
          if(this.dept){
            this.$store.dispatch('driverChangeEvt',{departId:this.dept})
          }

      },

      calculateDate(pro,index1,index){
        ajaxRequest(
          "get",
          "back/personQufication/calculateDate",
          {
            date: pro.projectDate,
            yxq:60
          },
          res => {
            if (res.code === 200) {
              this.certificateList[index1].proList[index]["projectEfectiveDate"]=res.t;
            }
          }
        );
      },
      handleCloseSpe(){
        this.chooseproject =null;
      },
      getCertificationUnit () {//获取发证单位
        let _this=this;
        ajaxRequest('get','/back/certificationUnit/list',{},function (res) {
          _this.certificateDeparts = res.rows;
        }.bind(this))
      },
      getCertificationType(){//获取证件类型
        let _this=this;
        ajaxRequest('get','/back/certificationType/list',{},function (res) {
          _this.certificateCategorys = res.rows;
        }.bind(this))
      },
      driverChangeEvt(departId) {//获取部门人员
        ajaxRequest(
          "get",
          "back/user/retrieve",
          {
            isDelete: 0,
            departId: departId
          },
          res => {
            if (res.code === 200) {
              this.personLists = res.rows;
              if (res.rows.length > 0) {
                if(this.paramObj.personName!=''){
                  this.form.personName =this.paramObj.personName;
                  this.person =this.paramObj.personId;
                }else{
                  this.person = res.rows[0].id;
                  this.form.personName=res.rows[0].userName;
                }
              } else {
                this.personLists = null;
              }
            }
          }
        );
      },
      getDepartData() {
        ajaxRequest(
          "get",
          "back/depart/list",
          {
            isDelete: 0
          },
          res => {
            if (res.code === 200) {
              this.deptLists = res.rows;
            }
          }
        );
      },
      toBackName(value){
        let obj = {};
        obj = this.personLists.find((item)=>{
          return item.id === value;
        });
        this.form.personName=obj.userName;
      },
      remoteMethod() {
        //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
        this.idTemp=this.paramObj.id;
        console.log("状态为"+this.paramObj.type);
        if(this.paramObj.type==2){
          //debugger
          ajaxRequest('get', 'back/personQufication/getCertificateDetail', {id: this.paramObj.id}, (data) => {
            if (data.code == 200) {
              console.log(data.daoResult);
//              data = data.daoResult
              for (let key in data) {
                if (data[key] == null) {
                  delete data[key]
                }
              }
              this.dept=data.daoResult.orgId;
              this.driverChangeEvt(this.dept);
              this.tempId=data.daoResult.personId;
//              this.form.person=data.daoResult.personName;
//              this.form.personName=data.daoResult.personName;
              this.form.birthDate=data.daoResult.birthDate;
              this.form.education==data.daoResult.education;
              if(data.daoResult.certificateList && data.daoResult.certificateList.length>0){
                this.certificateList =[];
                data.daoResult.certificateList.forEach((item,i) => {
                    for(var j=0;j<item.proList.length;j++){
                      if($.trim(item.proList[j].source)=='2'){
                        item.proList[j].source='项目';
                      }else if($.trim(item.proList[j].source)=='0'){
                        item.proList[j].source='计量标准';
                      }else if($.trim(item.proList[j].source)=='1'){
                        item.proList[j].source='CNAS';
                      }
                    }
                  this.certificateList.push(item);
                });

              }


            }
          })
        } else if(this.paramObj.type==1){
          //debugger
          ajaxRequest('get', 'back/personQufication/getWeiAudi', {personId: this.paramObj.personId}, (data) => {
            if (data.code == 200) {
              console.log( data.daoResult);
//              data = data.daoResult
              for (let key in data) {
                if (data[key] == null) {
                  delete data[key]
                }
              }

              this.dept=data.daoResult.orgId;
              this.driverChangeEvt(this.dept);
              this.tempId=data.daoResult.personId;
//              this.person=data.daoResult.personName;
//              this.personName=data.daoResult.personName;
              this.form.birthDate=data.daoResult.birthDate;
              this.form.education==data.daoResult.education;
              console.log(this.form.certificateList)

              if(data.daoResult.certificateList && data.daoResult.certificateList.length>0){
                this.certificateList =[];
                data.daoResult.certificateList.forEach((item,i) => {
                    for(var j=0;j<item.proList.length;j++){
                      if($.trim(item.proList[j].source)=='2'){
                        item.proList[j].source='项目';
                      }else if($.trim(item.proList[j].source)=='0'){
                        item.proList[j].source='计量标准';
                      }else if($.trim(item.proList[j].source)=='1'){
                        item.proList[j].source='CNAS';
                      }
                    }
                  this.certificateList.push(item);
                });
              }

            }
          })
        }else {
          this.certificateList.push({
            fileList: [],
            certificateFile:'',
            certificateDepart:null,
            certificateCategory:null,
            certificateNo:null,
            certificateName:null,
            certificateDate:null,
            quficationFileName:null,
            proList:[{fileList2: [],projectName: '', projectDate: '', projectEfectiveDate: '',projectFileName:'',linkId:null,source:'',projectFile:''}],
            remark:null
          });
        }
      },

      check(){
        this.$confirm('确认审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.form)

          this.form.certificateList = JSON.stringify(this.certificateList);
          ajaxRequest("PUT", 'back/personQufication/check', this.form, (res) => {
            if (res.code == 200) {
              this.$message.success('审核成功')
                 this.$router.push({
                   path: '/admin/364',
                 })

            }
          })
        })
      },
      check4shenhe(){
        if(this.checkData.length<1){
          this.$message.error('至少勾选一个证件信息');
          return false;
        }
        this.$confirm('确认审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.checkData)

          this.form.checkData = JSON.stringify(this.checkData);
          ajaxRequest("PUT", 'back/personQufication/check4shenhe', this.form, (res) => {
            if (res.code == 200) {
              this.$message.success('审核成功')
//              this.remoteMethod();
              this.$router.push({
                path: '/admin/364',
              })
            }
          })
        })
      },
      checkBack(){
        this.$confirm('确认撤销?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.form)

          this.form.certificateList = JSON.stringify(this.certificateList);
          ajaxRequest("PUT", 'back/personQufication/checkBack', this.form, (res) => {
            if (res.code == 200) {
              this.$message.success('撤销成功')
              this.$router.push({
                path: '/admin/364',
              })
            }else {
              this.$message.error('撤销失败');
            }
          })
        })
      },
    back(){
        this.$confirm('确认退回?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.form)

          this.form.certificateList = JSON.stringify(this.certificateList);
          ajaxRequest("PUT", 'back/personQufication/back', this.form, (res) => {
            if (res.code == 200) {
              this.$message.success('退回成功')
              this.$router.push({
                path: '/admin/364',
              })
            }else {
              this.$message.error('退回失败');
            }
          })
        })
      },
      back4shenhe(){
        if(this.checkData.length<1){
          this.$message.error('至少勾选一个证件信息');
          return false;
        }
        this.$confirm('确认退回?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.form)

          this.form.checkData = JSON.stringify(this.checkData);
          ajaxRequest("PUT", 'back/personQufication/back4shenhe', this.form, (res) => {
            if (res.code == 200) {
              this.$message.success('退回成功')
//              this.remoteMethod();
              this.$router.push({
                path: '/admin/364',
              })
            }else {
              this.$message.error('退回失败');
            }
          })
        })
      },
      handleSubmit(){
        this.checkForm();
//        let _this=this;
        this.form.dept=this.dept;
        this.form.person=this.person;
//        this.form.personName=this.personName;
        if(this.count!=0){
          this.$message.error('请完善信息');
          return false;
        }
//        if(this.fjCount!=0){
//          this.$message.error('请上传扫描件');
//          return false;
//        }
        let btnPower=window.localStorage.getItem("btnPower");
        if(this.paramObj.status=='3' && btnPower.indexOf("@M26201@")<=0){
          this.$message.error('此申请已审核，如需修改，请先撤销审核');
          return false;
        }else{
          this.$refs.form.validate((valid) => {//校验成功则回调提交数据
            if (valid) {
              var httpMethod;//http请求方式
              if(!this.idTemp||this.idTemp==''){//新增 注意:通过id是否存在来判断是新增还是编辑
                httpMethod = 'post';
              }else {//更新
                httpMethod = 'put';
              }

              if(typeof(this.person) =='string'){
                this.form.person=this.tempId;
                this.form.personName=this.personName;
              }

              for(var i=0;i<this.certificateList.length;i++){
                for(var j=0;j<this.certificateList[i].proList.length;j++){
                  if(this.certificateList[i].proList[j].source=='项目'){
                    this.certificateList[i].proList[j].source='2';
                  }else if(this.certificateList[i].proList[j].source=='计量标准'){
                    this.certificateList[i].proList[j].source='0';
                  }else if(this.certificateList[i].proList[j].source=='CNAS'){
                    this.certificateList[i].proList[j].source='1';
                  }
                }
              }


              this.form.certificateList = JSON.stringify(this.certificateList);
              ajaxRequest(httpMethod, "back/personQufication/addCer", this.form, (res)=> {
                if(res.code == 200){
                 this.idTemp = res.daoResult
                  this.certificateList[0].id=res.daoResult;
                 if(httpMethod=='post'){
                   this.$message.success('保存成功');
                   this.reset();
                 }else{
                   this.$message.success('编辑成功');
                 }



                }else{
                  this.$message.error('提交失败');
                }
              });
            }else{
              return false;
            }
          })
        }

      }

    },



  }
</script>
