<template>
    <mind-dialog :title="!!data.id?'编辑拜访记录':'新增拜访记录'" :visible="true" dialogSize="mid" center v-dialogDrag @close="handleCancel">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" >
            <el-row>
              <el-col :span="7">
                <el-form-item label="客户名称" prop="customerName">
                  <template slot="label">
                      <span>客户名称</span>
                      <el-tooltip content="若单位名称不一致，可直接修改">
                        <i class="el-icon-info fs12"></i>
                      </el-tooltip>
                  </template>
                  <el-input v-model="form.customerName"></el-input>

                  </el-select>
                </el-form-item>
              </el-col>
                <el-col :span="7">
                    <el-form-item label="客户部门" prop="visitorOrgid">
                        <!-- <el-select placeholder="请选择"  @change="changeDepartEvt" v-model="form.visitorOrgid">
                            <el-option
                                    v-for="item in orgIds"
                                    :key="item.id"
                                    :label="item.departName"
                                    :value="item.id+''">
                            </el-option>
                        </el-select> -->
                        <el-input v-model="form.visitorOrgid"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="7">
                    <el-form-item label="拜访时间" prop="visitDate">
                        <el-date-picker
                                v-model="form.visitDate"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>


            </el-row>
            <el-row>
                <el-col :span="7">
                    <el-form-item label="联系方式" prop="contactInformation">
                        <el-input v-model="form.contactInformation"
                                  v-rightclick="handleRightClick.bind(this,form,'contactInformation')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="接待人" prop="receptionist">
                        <el-input v-model="form.receptionist"
                                  v-rightclick="handleRightClick.bind(this,form,'receptionist')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="7">
                    <el-form-item label="下次拜访时间" prop="nextVisitDate">
                      <template slot="label">
                          <span>下次拜访</span>
                          <el-tooltip content="若勾选下次拜访时间，系统将提前7天提示">
                            <i class="el-icon-info fs12"></i>
                          </el-tooltip>
                      </template>
                        <el-date-picker
                                v-model="form.nextVisitDate"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-form-item label="客户基本情况" prop="customerBasicSituation">
                <el-input v-model="form.customerBasicSituation"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="拜访方式" prop="wayOfVisiting">
                  <el-input placeholder="现场、电话或者其他" v-model="form.wayOfVisiting"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                    <el-form-item label="拜访人" prop="visitor">
                        <!-- <el-select
                                placeholder="请选择"

                                v-model="form.visitor">
                            <el-option
                                    v-for="item in visitors"
                                    :key="item.id"
                                    :label="item.userName"
                                    :value="item.id+''">
                            </el-option>
                        </el-select> -->
                        <el-input v-model="form.visitor"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="随行人员" prop="attendant">
                        <el-input v-model="form.attendant"
                                  v-rightclick="handleRightClick.bind(this,form,'attendant')" style="width:100%;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row  style="margin-top:9px;">
                <el-col :span="24" >
                    <el-form-item label="沟通情况" prop="visitSituation">
                        <el-input type="textarea" v-model="form.visitSituation"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="margin-top:5px;">
              <el-col :span="24">
                <el-form-item label="客户要求" prop="customerRequirements">
                  <el-input type="textarea" v-model="form.customerRequirements"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top:5px;">
                <el-col :span="24">
                    <el-form-item label="其他事项  " prop="otherSituation">
                        <el-input type="textarea" v-model="form.otherSituation"
                                  v-rightclick="handleRightClick.bind(this,form,'otherSituation')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="margin-top:5px;">
                <el-col :span="24">
                    <el-form-item label="备注 " prop="visitSummary">
                        <el-input type="textarea" v-model="form.visitSummary"
                                  v-rightclick="handleRightClick.bind(this,form,'visitSummary')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="上传附件"  prop="attachment">
                  <mind-upload  :limitNumb="limitNumb" ref="upFiles" :callBack="callBack"  :before-upload='handleFileUploading'></mind-upload>
                  <!--<el-input v-model="form.attachment" v-show="show"></el-input>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-has='"M4805"'>
            <div class="title-item" style="marginBottom:20px;"> <span>处理意见</span></div>
              <el-col :span="24">
                  <el-form-item label="处理意见 " prop="handleAdvice">
                      <el-input type="textarea" v-model="form.handleAdvice"
                                v-rightclick="handleRightClick.bind(this,form,'handleAdvice')"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSubmit" v-has='"M4805"'>{{isAut?'处 理':'保 存'}}</el-button>
          <el-button type="primary" @click="handleSubmit" v-notHas='"M4805"'>保 存</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </span>
    </mind-dialog>
</template>

<script>
import Vue from "vue";
import { ajaxRequest } from "../../util/base";
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
  Select
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
Vue.use(Checkbox); */



const defaults = {
};
export default {
  name: "layout",
  props: {
    data: {
      type: Object
    },
    callback: {
      type: Function
    },
    test:{
      // type:Object,
      // required:true
    },
    defaultName:{
      type:String
    },
    // 在委托单位的界面进入
    isAut:{
      type:Boolean,
      default:false,
    },
    // 默认联系方式、联系人
    defaultInfo:{
      type:Object
    }
  },
  data() {
    let dateCheck = (rule,value,cb)=>{
      if(value){
        let string = value + " "
        let timeNext = string.split('-')
        timeNext = timeNext.join('');
        timeNext = timeNext.slice(0,8)
        let str = this.form.visitDate + " "
        let timeVisit = str.split('-')
        timeVisit=timeVisit.join('')
        timeVisit = timeVisit.slice(0,8)
        if(!!this.form.visitDate){
          if(timeVisit - timeNext <= 0){
            cb()
          }else{
            cb(new Error('下次拜访时间不对'))
          }
        }
//        else{
//          cb(new Error('请先填入拜访时间'))
//        }
      }else{
        cb()
      }
    }
    let todayCheck = (rule,value,cb)=>{
      if(!!value){
        if(this.form.id){
          cb();
          return
        }
        let time = new Date();
        let timeToday = time.getFullYear()+''+ (time.getMonth()+1 > 10 ? time.getMonth()+1 :'0'+(time.getMonth()+1) )+''+time.getDate();
        let timeVisit = value.split('-').join('')
        if(timeToday - timeVisit <= 0){
          cb()
        }else{
          cb(new Error('拜访时间不能小于今天'))
        }
      }else{
        cb(new Error('拜访时间不能为空'))
      }

    };
    let contactInformationCheck = (rule,value,cb)=>{
        if(value == null || value == undefined || !value){
          cb()
          return ;
        }
        let reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/g
        let ruleRex = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/g;
        if(value.length>20){
          cb(new Error('最多输入20位字符'))
        }else{
          if(reg.test(value)){
            cb()
          }else{
            if(ruleRex.test(value)){
              cb()
            }else{
              cb(new Error('请输入正确格式'))
            }
          }
        }
    }
    return {
      form: $.extend({}, defaults, this.data || {}),
      idIns:this.data.companyName || this.id,
      rules: {
        companyId: [
          { type: "string", required: true, message: "拜访单位不能为空" }
        ],
        visitDate: [
          { type: "string", required: true, validator:todayCheck ,trigger:'change'}
        ],
        visitor: [
          { type: "string", required: true,message:'拜访人不能为空',trigger:'blur'}
        ],
        visitorOrgid: [
          { type: "string", required: true, message: "客户部门不能为空",trigger:'blur'}
        ],
        visitSituation:[{
          type:'string',message:'最大长度不能超过200个字符',max:200,trigger:'blur'
        }],
        visitSummary:[{
          type:'string',message:'最大长度不能超过100个字符',max:100,trigger:'blur'
        }],
        otherSituation:[{
          type:'string',message:'最大长度不能超过100个字符',max:100,trigger:'blur'
        }],
        nextVisitDate:[{
          validator:dateCheck,trigger:'change'
        }],
        customerName:[{type:'string',max:20,message:'最多输入20个字符',trigger:'blur'}],
        customerBasicSituation:[{
          type:'string',max:100,message:'最大不能超过100字符',trigger:'blur'
        }],
        customerRequirements:[{
          type:'string',max:100,message:'最大不能超过100字符',trigger:'blur'
        }],
        contactInformation:[
          {type:'string',validator:contactInformationCheck,trigger:'blur'}
        ],
        receptionist:[{
          type:'string',max:20,message:'最多输入20个字符',trigger:'blur'
        }],
        wayOfVisiting:[
          {type:'string',max:100,message:'最多输入100个字符',trigger:'blur'}
        ],
        attendant:[
          {type:'string',max:50,message:'最多输入50个字符',trigger:'blur'}
        ],
        handleAdvice:[
          {max:150,message:'最多输入150个字符',trigger:'blur'}
        ]
      },
      loading: false,
      remoteOptions: [],
      orgIds: [],
      visitors: [],
      companyIds: [],
      companyName: [],
      companyInfo:[],

      attachment: "",
      fileList: [], //
      limitNumb: 4, //附件上传个数限制
      up_url: "", //自定义上传路径 [非必填]  默认不用修改
      fdata:{//附件上传额外参数
        caseId: "", //登记号       [非必填]  业务相关的登记号
        serverId: "", //服务id     [非必填]  分布式附件服务可以用默认不用配制
        flowId: "", //流程id      [非必填]  流程相关
        execType: "", //操作类型   [非必填]  业务相关
      },
      isThree: 0
    };
  },
  mounted() {
      if(!this.data.customerName){
        Vue.set(this.form,'customerName',this.defaultName)
      }
      if(!this.data.id){
        Vue.set(this.form,'contactInformation',this.defaultInfo.contactInformation)
        Vue.set(this.form,'receptionist',this.defaultInfo.receptionist)
        Vue.set(this.form,'visitor',window.localStorage.getItem('userName'))
      }
    this.getDepartListInit();
    this.getCompanyInfo();
    // this.initCompany();
    if(!!this.form.visitDate){
      Vue.set(this.form,'visitDate', new Date(this.form.visitDate).format("YYYY-MM-DD"))
      if(this.form.nextVisitDate){
        Vue.set(this.form,'nextVisitDate',new Date(this.form.nextVisitDate).format("YYYY-MM-DD"))
      }
    }else{
      let today = new Date()
      Vue.set(this.form,'visitDate',new Date(today).format('YYYY-MM-DD'))
    }
    if (!!this.form.attachment) {
        let fileId = this.form.attachment.slice(
          0,
          this.form.attachment.length - 1
        );
        setTimeout(() => {
          this.$refs["upFiles"].loadAttacheIds(fileId);
        }, 200);
    }
  },
  directives: { rightclick },
  mixins: [rightClick],
  methods: {
    getCompanyInfo(){
       ajaxRequest(
          "get",
          "back/company/matchCompanysByName",
          {
            isDelete:0,
          },
          function(res) {
            if (res.code === 200) {
             this.companyInfo = res.rows;
            }
          }.bind(this)
        );
    },
    //callBack上传组件数据发生变化回调
    callBack(file, list) {
      this.fileList = list;
    },

    changeVisitor(v) {
      Vue.set(this.form, "visitor", v);
    },
    handleSubmit() {
      if (!!this.fileList.length) {
        let attachment = "";
        for (let i = 0; i < this.fileList.length; i++) {
          if(!!this.fileList[i].response){
            attachment += this.fileList[i].response.v_attach_id + ",";
          }else{
            attachment += this.fileList[i].id + ","
          }
        }
        this.form.attachment = attachment;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if(this.isAut){
            let date = new Date();
            this.form.isHandle = 1;
            this.form.handleUser = window.localStorage.getItem('userId')
            this.form.handleUserName = window.localStorage.getItem('userName')
            this.form.handleTime = new Date(date).format('YYYY-MM-DD hh:mm:ss')
          }
          this.callback(this.form);
        } else {
          return false;
        }
      });
    },
    getDepartList() {
      //获取部门数据
      ajaxRequest("get", "back/depart/list/", {}, res => {
        this.orgIds = res.rows;
        if (this.form.visitorOrgid) {
          this.changeDepartEvt(this.form.visitorOrgid);
        }
      });
    },
    getDepartListInit() {
      //获取部门数据
      ajaxRequest("get", "back/depart/list/", {}, res => {
        this.orgIds = res.rows;
        if (this.form.visitorOrgid) {
          this.changeDepartEvtInit(this.form.visitorOrgid);
        }
      });
    },
    // customerNameSelect(info){
    //   this.form.customerName = info;
    // },
    changeDepartEvt(visitorOrgid) {
      //根据部门ID获取人员
      if (visitorOrgid) {
        ajaxRequest(
          "get",
          "back/user/listUserByDeptId/" + visitorOrgid,
          {},
          res => {
            this.visitors = res.rows;
            Vue.set(this.form, "visitor", "");
          }
        );
      }
    },
    changeDepartEvtInit(visitorOrgid) {
      //根据部门ID获取人员
      if (visitorOrgid) {
        ajaxRequest(
          "get",
          "back/user/listUserByDeptId/" + visitorOrgid,
          {},
          res => {
            this.visitors = res.rows;
          }
        );
      }
    },
    // 上传文件的判定
    handleFileUploading(file) {
      if(!!file.name){
        for(let i = 0 ; i < this.fileList.length ; i ++){
          if(file.uid!=this.fileList[i].uid){
            if(file.name == this.fileList[i].name){
              return new Promise((resolve,reject)=>{
                this.$confirm('文件名已存在，是否覆盖？').then(()=>{
                  this.$refs.upFiles.setDeleteIds(this.fileList[i].id);
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
    // remoteMethod(keyWords) {
    //   this.loading = true;
    //   $.ajax();
    // },
    handleCancel() {
      //关闭窗口
      this.callback();
    },
    // initCompany() {
    //   //获取单位信息
    //   ajaxRequest("get", "back/company/list/", {}, res => {
    //     this.companyIds = res.rows;
    //   });
    // },
    // remoteMethods(query) {
    //   if (query !== "") {
    //     this.loading = true;
    //     setTimeout(() => {
    //       this.loading = false;
    //       this.companyIds = this.list.filter(item => {
    //         return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
    //       });
    //     }, 200);
    //   } else {
    //     this.companyIds = [];
    //   }
    // }
  }
};
</script>

<style>
.fs12{
  font-size: 12px;
}
</style>
