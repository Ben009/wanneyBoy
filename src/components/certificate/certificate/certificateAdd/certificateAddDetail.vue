<template>
  <div>
    <div class="topButton">
      <el-form :inline="true">
        <el-form-item v-if="!!showReturn">
          <el-button type="warning" @click="certificateQueryBack" size="small" >返回</el-button>
        </el-form-item>
        <el-form-item v-if="!form.zsId" class="cerCommonStyle">
          <el-select  ref="notAddCertificateSampleSel" v-model="notAddCertificateSample"
                      @change="notAddCertificateSampleClick" value-key="sampleBh"
                      :autoWidth=true style="width: 150px"
                      >
            <el-option :value="val" :key="val.sampleBh" :label="zsbhFormat(val.zsbh)"
                        v-for="val in notAddCertificateSampleList" >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 是否建标 -->
        <el-form-item class="cerCommonStyle">
          <el-select v-model="form.isAuthorise" style="width:100px"
                     v-show="canChangeCertificateisAuthorise"
          >
            <el-option :value="1" label="SC0"><span style="color: red">SC0</span></el-option>
            <el-option :value="0" label="SC1">SC1</el-option>
          </el-select>
        </el-form-item>
        <!-- 是否CNAS -->
        <el-form-item class="cerCommonStyle">
          是否CNAS：
          <el-select v-model="form.cnasFlag" style="width:100px">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <!-- 是否强检 -->
        <el-form-item prop="qjFlag" class="cerCommonStyle">
          是否强检：
          <el-select v-model.number="form.qjFlag" style="width:100px" @change="qjFlagChange" >
            <el-option :value=2 label="请选择"></el-option>
            <el-option :value=0 label="否"></el-option>
            <el-option :value=1 label="是"></el-option>

          </el-select>
        </el-form-item>
        <!-- 器具用途 -->
        <el-form-item class="cerCommonStyle">
          器具用途：
          <el-select v-model="form.qjyt" style="width: 100px" class="resetHeight" :disabled="form.qjFlag != 1" >
            <el-option
              label="请选择" value=""
            >请选择</el-option>
            <el-option v-for="applianceUse in applianceUses" :key="applianceUse.code"
                       :label="applianceUse.remark" :value="applianceUse.code"  >
              {{applianceUse.remark}}

            </el-option>
          </el-select>
        </el-form-item>
        <!-- 收费情况说明 -->
        <el-form-item class="cerCommonStyle">
          收费情况说明：
          <el-input clearable v-model="form.chargeRemark" style="width:200px"></el-input>
        </el-form-item>

        <!-- 检定周期 -->
        <!--<el-form-item>-->
          <!--<el-select v-model="form.jdzq" style="width:100px"-->
                     <!--@change="setCertificateJdzq"-->
                     <!--:disabled="!certificateCanEdit"-->
          <!--&gt;-->
            <!--<el-option  ref="certificateJdzqSel"-->
                        <!--v-for="certificateJdzq in certificateJdzqArr" :key="certificateJdzq.code"-->
                        <!--:label="certificateJdzq.remark" :value="certificateJdzq.code"-->
            <!--&gt;-->
              <!--{{certificateJdzq.remark}}-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item> -->
        <el-col :span="24">
          <CertificateXxy ref="certificateXxy"
                          @getXxyCont="getXxyCont"
                          :getChangeShr="getChangeShr"
                          @setChangeShr="setChangeShr"
                          :getCertificateId="getCertificateId"
                          :certificateCanEdit="certificateCanEdit"
                          :setCertificateJdzq4Xxy="setCertificateJdzq4Xxy"
                          :certificatePasswordCheck="certificatePasswordCheck"
                          :canChangeBzqZSInfo="canChangeBzqZSInfo"
                          :canEditYjBzBzqInfo="canEditYjBzBzqInfo"
                          :canChooseHistoryByQjmc="canChooseHistoryByQjmc"
                          :setMainCertificatePzr="setMainCertificatePzr"
                          :changeJdy4Sh="changeJdy4Sh"
                          :returnAuditStatus="returnAuditStatus"
                          :canChangeCertificateGcInfo="canChangeCertificateGcInfo"
                          :canModifyCertificateGcInfo="canModifyCertificateGcInfo"
          />
        </el-col>
        <el-col :span="24">
          <CertificateJgy
            ref="certificateJgy"
            v-if="isRouterJgyAlive"
            @loadJgyContent4Main="loadJgyContent4Main"
            @getJgyTotalPage = "getJgyTotalPage"
            :getXxyZmbId = "getXxyZmbId"
            :certificateCanEdit="certificateCanEdit"
            :setZsbh="setZsbh"
          />
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest,ajaxSyncRequest,ajaxSyncProxyRequest} from '../../../util/base';
  import $ from 'jquery';
  import CertificateXxy from '../certificateTemp/certificateXxy.vue';
  import CertificateJgy from '../certificateTemp/certificateJgy.vue';
  import CertificateCommon from "@/components/certificate/common/certificateCommon.js";
  import ExcelUtil from '@/mixins/ExcelUtil'
  //  import CertificateTemplateDetail from './certificateTemplateDetail.vue';

/*   import {
    Container,Aside,Main,
    Button,
    Col,
    Form,
    FormItem,
    Input,
    Row,
  } from 'element--ui';
  Vue.use(Container);
  Vue.use(Aside);
  Vue.use(Main);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col); */

  const defaults = {
    hoho:''
  };
  export default {
    name: "CertificateAddDetail",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateXxy,CertificateJgy,
    },
    props: {
      //登记号
      registrationNo: {default: null},
      certificateTempId:{default: null},
      certificateId:{default: null},
      certificateCanEdit:{default: false},
      setMainCertificateJdzq:{
        type:Function,
        required:false
      },
      setMainCertificatePzr:{
        type:Function,
        required:false
      },
      certificateQueryBack:{
        type:Function,
        required:false
      },
      actionType:{default: ""},
      //是否可修改标准器证书
      canChangeBzqZSInfo:{default: false},
      //技术依据、标准、仪器可编辑内容
      canEditYjBzBzqInfo:{default: false},
      //可根据器具名称查询开始数据
      canChooseHistoryByQjmc:{default: false},
      //已审核的证书更换人员
      changeJdy4Sh:{default: false},
      //证书编辑时可更换技术规程、计量标准及标准器
      canChangeCertificateGcInfo:{default: false},
      //证书编辑时可右键修改技术规程、计量标准及标准器
      canModifyCertificateGcInfo:{default: false},
      //是否显示返回按钮
      showReturn:{
        required:false,
        default: false
      },
      //获得每一个检定/审核/批准的状态
      returnAuditStatus:{
        type:Function,
        required:false
      },
    },
    mixins: [ExcelUtil,CertificateCommon],
    data() {
      return {
        form: {},
        rules: {
        },
        auditFlag : 0 ,
        notAddCertificateSampleList:[],
        isRouterJgyAlive:true,
        applianceUses: [],
        jgyIdArray:[],
        jgyMainContentMap:{},
        jgyContentArray:[],
        xxyTotalPage:0,
        jgyTotalPage:0,
        notAddCertificateSample : null ,
        //是否更换检定员、核验员
        isChangeShr:false,
//        certificateJdzqArr : [] ,
        canChangeCertificateisAuthorise:false,
        certificateAddDefaultJdy:0,
        certificatePasswordCheck:0,
        certificateQjCheck:0,
        backupStatus:0,
        /* excel字段 start */
        canDownloadExcel: false,  // 是否可下载Excel
        fileLocalSavePath: null,  // 下载文件本地保存的地址
        redResultPageHtml: null,  // 红色结果页
        blueResultPageHtml: null,  // 蓝色结果页
        /* excel字段 end */
      }
    },
    created(){
      this.getApplianceUses();
      //
      this.getCertificatePasswordCheck();
      this.getCertificateQjCheck();

      let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
      if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
        btnPower = "@@";
      }
      //按钮_证书标注非建标和查询非建标
      if(btnPower.indexOf("@M27121@") != -1){
        this.canChangeCertificateisAuthorise = true ;
      }else {
        this.canChangeCertificateisAuthorise = false ;
      }
      // 下载Excel权限
      if (btnPower.indexOf('@M27013@') != -1) {
        this.canDownloadExcel = true
      } else {
        this.canDownloadExcel = false
      }
    },
    mounted() {
      this.initExcelParam()
      if(this.actionType == "add"){
        //添加证书
        this.getCertificateTemplateDetail();
        this.getNotAddCertificateSampleList();
        if(this.notAddCertificateSampleList.length == 0){
          this.$message.warning('无可添加的证书');
          this.$emit('hideCertificateAddDetailMain');
          return;
        }
        this.notAddCertificateSampleClick();
        this.getCertificateAddDefaultJdy();
        console.log(this.$refs.certificateXxy,'this.$refs.certificateXxy')
        this.$refs.certificateXxy.setCertificateAddDefaultJdy(this.certificateAddDefaultJdy);
      }else if(this.actionType == "query"){
        //回显证书
        this.getCertificateDetail();
      }else if(this.actionType == "next"){
        //添加证书
        this.getNextCertificateContent();
        this.getNotAddCertificateSampleList();
        if(this.notAddCertificateSampleList.length == 0){
          this.$message.warning('无可添加的证书');
          this.$emit('hideCertificateAddDetailMain');
          return;
        }
        this.notAddCertificateSampleClick();
      }

    },
    methods: {
      handleSubmit() {

        //处理excel
        if(!this.handleSubmitSaveExcel()){ //返回值为False时 excel处理失败
          return ;
        }

        let _this=this;
        //把时间字段删掉
        this.dealData(_this.form);
        //对form赋值
        if(this.certificateTempId){
          _this.form.mbId = this.certificateTempId ;
        }
        //登记号
        _this.form.registrationNo = this.registrationNo ;

        //来源（1->采用证书模板直接添加;2->原始记录上传;3->批量添加;4->原始记录批量上传;5->单机版来源;6->PAD版来源;7->移动端来源;8->仪器接口来源;9->出租车计价器;10->定量包装;）
        _this.form.source = "1" ;

        //检定周期
        _this.form.jdzq = _this.$refs.certificateXxy.certificateJdzq;

        //备份标志位
        _this.form.backupStatus = _this.backupStatus ;
        //信息页保存的校验
        var flag = _this.$refs.certificateXxy.checkData4CertificateAdd();
        if(flag != true){
          _this.$message.error(flag);
          return false;
        }

        if(_this.form.cnasFlag != 0 && _this.form.cnasFlag != 1){
          _this.$message.error("是否CNAS没有选择！");
          return false;
        }
        if(_this.certificateQjCheck==1){
          if(_this.form.qjFlag == 2){
            _this.$message.error("请选择证书是否强检！");
            return false;
          }
        }
        if(_this.form.qjFlag == 1 && _this.form.qjyt == ""){
          _this.$message.error("请选择器具用途！");
          return false;
        }
        console.log(_this.form,'form.qjyt')
        //信息页的Id
        _this.form.xxyId = _this.$refs.certificateXxy.xxyZmbId;
        _this.form.xxyContent = _this.$refs.certificateXxy.getContent();
        //结果页的
        var jgyContent = _this.$refs.certificateJgy.getJgyAllContent();
//        _this.form.jgyIdArray = JSON.stringify(jgyArr[0]);
//        _this.form.jgyContentArray = JSON.stringify(jgyArr[1]);
        _this.form.jgyContent = jgyContent;
        if(!_this.form.zsId){
          //证书编号
          _this.form.zsbh = this.notAddCertificateSample.zsbh ;
          _this.form.actionType = "证书添加" ;
          //样品编号
          _this.form.sampleBh = this.notAddCertificateSample.sampleBh ;
          //处理excel 添加记录时不管有没有打开excel都保存excel参数
          let excelInfo = this.getExcelInfo();
          _this.form.excelPath = excelInfo["excelId"];
          _this.form.excelType = excelInfo["excelType"];
          _this.form.isSaveRange = true;
          _this.form.redPositionArray = excelInfo["redRange"];
          _this.form.bluePosition = excelInfo["blueRange"];

          //富文本的赋值
          ajaxSyncRequest('post',"back/certificate/certificateAdd",_this.form,function(res){
            if(res.code == 200){
              _this.$message.success('添加成功');
              _this.form.zsId = res.daoResult.zsId ;
              _this.backupStatus = 1 ;
              _this.setChangeShr(false);
              flag =  true;
            }else {
              _this.$message.error(res.msg);
              flag =  false;
            }
          },"unicode");
        }else {
          _this.form.actionType = "证书修改" ;
          console.log(_this.form,'_this.form')

          //处理excel
          let excelInfo = this.getExcelInfo();
          if(!!excelInfo["isSaveExcel"] || !!excelInfo["isSaveEmf"] ){
            _this.form.excelPath = excelInfo["excelId"];
            _this.form.excelType = excelInfo["excelType"];
            if(!!excelInfo["isSaveRange"]){
              _this.form.isSaveRange = excelInfo["isSaveRange"];
              _this.form.redPositionArray = excelInfo["redRange"];
              _this.form.bluePosition = excelInfo["blueRange"];
            }
          }else{
            //未打开excel时不更新excel相关字段
            delete _this.form.excelPath;
            delete _this.form.excelType;
          }

          //富文本的赋值
          ajaxSyncRequest('put',"back/certificate/updateCertificateById",_this.form,function(res){
            if(res.code == 200){
              _this.$message.success('修改成功');
              _this.backupStatus = 1 ;
              _this.setChangeShr(false);
              flag = true;
            }else {
              _this.$message.error(res.msg);
              flag = false;
            }
          },"unicode");
        }
        return flag ;
      },
      changeAuditFlag(type,step,actionType){

      },
      setAuditFlag(auditFlag){
        this.auditFlag = auditFlag ;
      },
      getNotAddCertificateSampleList(){
        ajaxSyncRequest("get", "back/certificateCommon/getCertificateAddZsbhList/"+this.registrationNo+"/"+(this.certificateTempId==null?this.form.mbId:this.certificateTempId), null, res => {
          if (res.code === 200) {
            this.notAddCertificateSampleList = res.rows;
          }else {
            this.notAddCertificateSampleList = [] ;
          }
        });
      },
      notAddCertificateSampleClick(newVal,flag){
        Vue.set(this.form,'zsId',null);
        Vue.set(this.form,'zsbh',null);
        console.log(this.notAddCertificateSample,'notAddCertificateSample')
        console.log(newVal,'newVal')
        if(typeof this.setMainCertificatePzr == "function") {
          this.setMainCertificatePzr(0);
        }
        if(newVal){
          //设置报告编号
          this.$nextTick(()=>{
            this.setZsbh();
            //下一份证书对信息页的处理
            this.$refs.certificateXxy.nextCertificateInit(true);
          })
        }else {
          console.log(this.notAddCertificateSampleList,'this.notAddCertificateSampleList')
          //选中第一个样品编号
          Vue.set(this,'notAddCertificateSample',this.notAddCertificateSampleList[0]);
          //设置报告编号
          this.$nextTick(()=>{
            this.setZsbh();
            //下一份证书对信息页的处理
            this.$refs.certificateXxy.nextCertificateInit(flag);
          })
        }
      },
      getCertificateTemplateDetail(){
        if(this.registrationNo != ""){
//          let _this = this;
          ajaxSyncRequest("get", "back/certificate/initCertificate4Add",{registrationNo:this.registrationNo,mbId:this.certificateTempId} , (res) => {
            if (res.code === 200) {
              this.form = res.daoResult ;

              //是否建标写死 1
//              this.form.isAuthorise = 1 ;
//              var result = res.daoResult;
              //处理信息页的内容
              this.$refs.certificateXxy.xxyZmbId = this.form.xxyId

              //初始化Excel参数
              this.form["caseId"] = this.registrationNo
              this.initExcelInfo(this.form);
              //检定周期
              this.$refs.certificateXxy.certificateJdzq = this.form.jdzq

              if(typeof this.setMainCertificateJdzq == "function"){
                this.setMainCertificateJdzq(this.form.jdzq);
              }
              this.$refs.certificateXxy.setContent(this.form.xxyContent);
              //设置页码并获得
              this.getXxyTotalPage(false);
              if(typeof this.setMainCertificatePzr == "function") {
                this.setMainCertificatePzr(0);
              }

              //设置结果页内容
              //强制刷新组件
//              _this.reloadJgy();
              this.loadJgyContent4Main();

            }else {
              this.$message.error(res.msg);
            }
          });
        }
      },
      getNextCertificateContent(){
        if(this.registrationNo != ""){
//          let _this = this;
          ajaxSyncRequest("get", "back/certificate/getNextCertificateContent",{registrationNo:this.registrationNo,zsId:this.certificateId} , (res) => {
            if (res.code === 200) {
              this.form = res.daoResult ;

              //是否建标写死 1
              this.form.isAuthorise = 1 ;
//              var result = res.daoResult;
              //处理信息页的内容
              this.$refs.certificateXxy.xxyZmbId = this.form.xxyId
              //检定周期
              this.$refs.certificateXxy.certificateJdzq = this.form.jdzq


              //初始化Excel参数
              this.form["caseId"] = this.registrationNo
              this.initExcelInfo(this.form);

              if(typeof this.setMainCertificateJdzq == "function"){
                this.setMainCertificateJdzq(this.form.jdzq);
              }
              this.$refs.certificateXxy.setContent(this.form.xxyContent);
              //设置页码并获得
              this.getXxyTotalPage(false);
              //设置结果页内容
              //强制刷新组件
//              _this.reloadJgy();
              this.loadJgyContent4Main();

            }else {
              this.$message.error(res.msg);
            }
          });
        }
      },
      getCertificateDetail(){
        if(this.registrationNo != ""){
//          let _this = this;
          ajaxRequest("get", "back/certificate/certificateQueryByZsId",{registrationNo:this.registrationNo,zsId:this.certificateId} , (res) => {
            if (res.code === 200) {
              this.form = res.daoResult;
              //设置模板id
//              this.certificateTempId = this.form.mbId ;
              //处理信息页的内容
              this.$refs.certificateXxy.xxyZmbId = this.form.xxyId
              //检定周期
              this.$refs.certificateXxy.certificateJdzq = this.form.jdzq

              //初始化Excel参数
              this.form["caseId"] = this.registrationNo
              this.initExcelInfo(this.form);

              if(typeof this.setMainCertificateJdzq == "function"){
                this.setMainCertificateJdzq(this.form.jdzq);
              }

              //信息页大字段
              this.$refs.certificateXxy.setContent(this.form.xxyContent);
              //处理结果页内容
//              this.$refs.certificateJgy.setJgyAllContent(this.form.jgyContent);
              //强制刷新组件
              this.loadJgyContent4Main();
//              _this.reloadJgy();
              //获得信息页页数
              this.xxyTotalPage = this.$refs.certificateXxy.getXxyPageTotal();

              //检定信息
              this.$refs.certificateXxy.setJdyInfo(this.form.jdyList);
              //核验信息
              this.$refs.certificateXxy.setHyyInfo(this.form.hyyList);
              //批准人
              this.$refs.certificateXxy.setPzrInfo(this.form);
              if(typeof this.setMainCertificatePzr == "function"){
                this.setMainCertificatePzr(this.form.pzrSh);
              }
              this.getAuditStatus();
            }else {
              this.$message.error(res.msg);
            }
          });
        }
      },
      reloadJgy(){
        this.isRouterJgyAlive = false
        this.$nextTick(() => (this.isRouterJgyAlive = true))
      },
      dealData(form){
        //把时间字段删掉
        delete form.addTime;
        delete form.updateTime;
        delete form.deleteTime;
        delete form.enableDate;
        delete form.disableDate;
        delete form.backupTime;
        delete form.auditSubmitTime;
        delete form.auditOneTime;
        delete form.auditTwoTime;
        delete form.unAuditSubmitTime;
        delete form.unAuditOneTime;
        delete form.unAuditTwoTime;
        delete form.jdTime;
        delete form.hyTime;
        delete form.pzTime;
        delete form.folderClearTime;
        delete form.printTime;
        delete form.pdfTime;
        delete form.enableDate;
        delete form.disableDate;
        delete form.zsjdrq;
        delete form.zsyxrq;
        delete form.dataDate1;
      },
      getApplianceUses() {
        ajaxProxyRequest("get", "/njmind/findParam/applianceUse", {}, res => {
          var myArray = new Array();
//          for (var i = 0; i < res.list.length; i++) {
//            myArray.push(res.list[i].remark);
//          }
          this.applianceUses = res.list;
          // 预留的加载中功能的判断条件
//          this.loading2 = false;
        });
      },
      showNextCertificate(flag){
        this.getNotAddCertificateSampleList();
        console.log(this.notAddCertificateSampleList,'this.notAddCertificateSampleList')
        if(this.notAddCertificateSampleList.length == 0){
         return false ;
        }else {
          this.notAddCertificateSampleClick(null,flag);
          return true ;
        }
      },
      getXxyCont(xxyZmbId){
        //后台请求信息页内容
        ajaxRequest("get", "back/certificateTemp/queryCertificateMainTempById", {zmbId:xxyZmbId,mbId:this.mbId}, res => {
          if (res.code === 200) {
            //将信息页加载
            this.$refs.certificateXxy.xxyZmbId = xxyZmbId;

            //加载新的信息页模板内容
            this.$refs.certificateXxy.setContent(res.daoResult.xxyContent);
            //设置页码并获得
            this.getXxyTotalPage(true);
          }
        });
      },
      //调用，加载结果页内容
      loadJgyContent4Main(){
        console.log(this.$refs.certificateJgy,'this.$refs.certificateJgy')
//        this.$refs.certificateJgy.loadJgyContent(
//          this.jgyIdArray ,
//          this.jgyMainContentMap ,
//          this.jgyContentArray
//        )
//        console.log(this.form.jgyContent,'this.form.jgyContent')
        this.$refs.certificateJgy.setJgyAllContent(this.form.jgyContent)

        //获得结果页
//        this.jgyTotalPage = this.$refs.certificateJgy.getJgyPageTotal();
        this.getJgyTotalPage(true);
      },
      //获得信息页页数，并根据入参是否重新刷新页码
      getXxyTotalPage(flag){
        this.xxyTotalPage = this.$refs.certificateXxy.initPageIndex();
        console.log(this.xxyTotalPage,'xxyTotalPage')
        if(flag){
          //结果页页码
          this.getJgyTotalPage(true);
        }
      },
      getJgyTotalPage(flag){
        if(this.$refs.certificateJgy){
          this.jgyTotalPage = this.$refs.certificateJgy.initPageIndex(this.xxyTotalPage);
          console.log(this.jgyTotalPage,'jgyTotalPage')
          if(flag){
            //总页码
            this.setTotalPage();
          }
        }
      },
      setTotalPage(){
        this.$refs.certificateXxy.initPageTotal(this.xxyTotalPage + this.jgyTotalPage);
        if(this.$refs.certificateJgy){
          this.$refs.certificateJgy.initPageTotal(this.xxyTotalPage + this.jgyTotalPage);
        }
      },
      //获得样品编号
      getSjdSampleNo(){
        return (this.form.sampleBh == null) ? this.notAddCertificateSample.sampleBh : this.form.sampleBh ;
      },
      //获得信息页模板ID
      getXxyZmbId(){
        return this.$refs.certificateXxy.xxyZmbId ;
      },
      //添加结果页
      addJgy(){
        //调用结果页弹出选择模板页
        this.$refs.certificateJgy.addGjy(null,'addGjy');
      },
      //修改 是否更换检定员、核验员
      setChangeShr(flag){
        this.isChangeShr = flag ;
      },
      //初始化 是否更换检定员、核验员
      getChangeShr(){
        return this.isChangeShr;
      },
      //获得证书id，为子组件提供
      getCertificateId(){
        return this.form.zsId ;
      },
      //是否强检变化
      qjFlagChange(val){
        console.log(val);
        this.form.qjyt = "";
      },
      //设置报告编号
      setZsbh(){
        var zsbh = "";
//        if(this.actionType == "add"){
          zsbh = ((!this.form.zsbh) || this.form.zsbh == "")?this.notAddCertificateSample.zsbh:this.form.zsbh ;
//        }else if(this.actionType == "query"){
//          zsbh = this.form.zsbh;
//        }else if(this.actionType == "next"){
//          zsbh = this.notAddCertificateSample.zsbh ;
//        }
        if(zsbh && "" != zsbh ){
          this.$refs.certificateXxy.setXxyZsbh(zsbh);
          console.log("这时候结果页是：",this.$refs.certificateJgy)
          if(this.$refs.certificateJgy){
            this.$refs.certificateJgy.setJgyZsbh(zsbh);
          }
        }
      },
      //关联信息页主模板
      relationXxy(){
        this.$refs.certificateXxy.relationXxy();
      },
      //获得检定周期
//      getCertificateJdzqArr() {
//        ajaxProxyRequest("get", "/njmind/findParam/certificateJdzq", {codeType:'NUMBER'}, res => {
//          this.certificateJdzqArr = res.list;
//        });
//      },
      //设置检定周期
      setCertificateJdzq() {

        this.$refs.certificateXxy.certificateJdzq = this.form.jdzq

        this.$refs.certificateXxy.setCertificateJdzq();

      },
      //子组件设置父组件检定周期
      setCertificateJdzq4Xxy(certificateJdzq) {
        this.form.jdzq = certificateJdzq ;
        if(typeof this.setMainCertificateJdzq == "function"){
          this.setMainCertificateJdzq(this.form.jdzq);
        }
      },
      //证书添加默认检定员  （0->默认模板维护的人员;1->当前登录人;）
      getCertificateAddDefaultJdy() {
        ajaxSyncProxyRequest("get", "/njmind/findParam/certificateAddDefaultJdy", {codeType:'NUMBER'}, res => {
          console.log(res);
          this.certificateAddDefaultJdy = res.value;
          console.log(this.certificateAddDefaultJdy,'this.certificateAddDefaultJdy');
        });
      },
      //证书审核是否不校验电子签名密码
      getCertificatePasswordCheck() {
        ajaxSyncProxyRequest("get", "/njmind/findParam/certificatePasswordCheck", {codeType:'NUMBER'}, res => {
          this.certificatePasswordCheck = res.value;
        });
      },
      //证书强检是否必须选择
      getCertificateQjCheck() {
        ajaxSyncProxyRequest("get", "/njmind/findParam/certificateQjCheck", {codeType:'NUMBER'}, res => {
          this.certificateQjCheck = res.value;
        });
      },
      getAuditStatus(){
        if(typeof this.returnAuditStatus == "function"){
          this.$refs.certificateXxy.getAuditStatus() ;
        }
      },
      initExcelParam () { // 初始化excel相关参数
        if (this.canDownloadExcel) {
          this.excelInfo.downLoadExcel = '1'
        }
        this.excelInfo.savePicture = '1';
        this.excelInfo.needSaveEmfCallBack = true;
      },
      /**
       * 保存截图后 回调方法
       */
      saveEmfCallBack(){
        // todo 根据截图信息动态生成结果页
        if(!!this.excelInfo.emfJson && !!this.excelInfo.emfJson.emz){
          let xxyZmbId = this.getXxyZmbId();
          let redResultPageHtmlContent = "";
          let blueResultPageHtmlContent = "";
          let _that = this;
          let errorMsg = "";
          console.log(this.excelInfo.emfJson)
          $.each(this.excelInfo.emfJson.emz,function (index, item) {
            if(!!item){
              if(item.fileType !='blue'){ //无框和红框时均采用红框html

                if(!_that.redResultPageHtml){
                  _that.getResultPageHtml(0,xxyZmbId)
                }

                if(!_that.redResultPageHtml){

                  errorMsg = "操作失败！未定义红色区域！";
                  return false;
                }
                redResultPageHtmlContent += _that.createResultPage(item,0)
              }else { //篮筐
                if(!_that.blueResultPageHtml){
                  _that.getResultPageHtml(1,xxyZmbId)
                }
                if(!_that.blueResultPageHtml){

                  errorMsg = "操作失败！未定义蓝色区域！";
                  return false;
                }
                blueResultPageHtmlContent += _that.createResultPage(item,1)
              }

            }

          })
          if(!!errorMsg){
            this.$message.error(errorMsg);
            return;
          }

          this.form.jgyContent = blueResultPageHtmlContent + redResultPageHtmlContent;
          this.loadJgyContent4Main();
          this.setZsbh();
          this.setExcelWinState(-1);
          this.setScrollTop();
          this.$message.success("操作成功!");
        }
      },
      /**
       * 查询结果页列表
       * @param queryType 查询类型：0 红框/ 1篮框
       * @param zmbId
       */
      getResultPageHtml(queryType,zmbId){
        let _this = this;
        ajaxSyncRequest('get', 'back/certificateMainTemp/getCertTemplateResultPageListById', {queryType:queryType,zmbId:zmbId}, (res) => {
          if (res.code === 200 ) {
            if(!!res.rows && res.rows.length > 0){
              if(queryType == 0){
                _this.redResultPageHtml = res.rows[0]["zmbContent"];
              }else{
                _this.blueResultPageHtml = res.rows[0]["zmbContent"];
              }
            }
          }
        });
      },
      setScrollTop(){
        // $(".certForm").eq(0).animate({
        //     scrollTop: $("#certificateJgyDiv").offset().top
        // }, 500);
      }
    },
  }

</script>

<style lang="scss">
  .resetHeight{
    .el-input{
      .el-input__inner{
        height: inherit!important;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .topButton{
    // position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    overflow: auto;
    /* border: 1px solid red; */
    padding: 1px;
  }
  .certForm{
    // position: absolute;
    top: 36px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    overflow: auto;
    padding: 1px;
  }

  .right-click-menu{
    position:fixed;
    border:1px solid #ccc;
    padding: 2px 0;
    background:#fff;
    width:100px;
    z-index:9999;
  }
  .right-click-menu li{
    padding:3px 10px;
    cursor:default;
    font-size:14px;
    color:#606266;
  }
  .right-click-menu li:hover{
    color:#409eff;
  }
  .custom-1d74b7 .el-form-item--small.el-form-item{
    margin-bottom:0px;
  }
</style>
