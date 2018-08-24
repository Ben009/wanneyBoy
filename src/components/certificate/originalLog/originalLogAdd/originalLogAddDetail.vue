<template>
  <div>
    <div class="topButton">
      <el-form :inline="true">
        <el-form-item v-if="!!showReturn">
          <el-button type="warning" @click="certificateQueryBack" size="small" >返回</el-button>
        </el-form-item>
        <el-form-item v-if="!form.ysjlId">
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
        <el-form-item>
          <el-select v-model="form.isAuthorise" style="width:100px"
                     v-show="canChangeCertificateisAuthorise"
          >
            <el-option :value="1" label="SC0"><span style="color: red">SC0</span></el-option>
            <el-option :value="0" label="SC1">SC1</el-option>
          </el-select>
        </el-form-item>
        <!-- 是否CNAS -->
        <el-form-item>
          是否CNAS：
          <el-select v-model="form.cnasFlag" style="width:100px">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <!-- 是否强检 -->
        <el-form-item prop="qjFlag">
          是否强检：
          <el-select v-model.number="form.qjFlag" style="width:100px" @change="qjFlagChange" >
            <el-option :value=2 label="请选择"></el-option>
            <el-option :value=0 label="否"></el-option>
            <el-option :value=1 label="是"></el-option>

          </el-select>
        </el-form-item>
        <!-- 器具用途 -->
        <el-form-item>
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
        <el-form-item>
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
          <OriginalLogXxy ref="originalLogXxy"
                          :getChangeShr="getChangeShr"
                          @setChangeShr="setChangeShr"
                          :getOriginalLogId="getOriginalLogId"
                          :certificateCanEdit="certificateCanEdit"
                          :setCertificateJdzq4Xxy="setCertificateJdzq4Xxy"
                          :certificatePasswordCheck="certificatePasswordCheck"
                          :canChangeBzqZSInfo="canChangeBzqZSInfo"
                          :canEditYjBzBzqInfo="canEditYjBzBzqInfo"
                          :canChooseHistoryByQjmc="canChooseHistoryByQjmc"
                          :changeJdy4Sh="changeJdy4Sh"
                          :returnAuditStatus="returnAuditStatus"
                          :canChangeCertificateGcInfo="canChangeCertificateGcInfo"
                          :canModifyCertificateGcInfo="canModifyCertificateGcInfo"
                          :skFlag="skFlag"
          />
        </el-col>
        <el-col :span="24" v-show="jgyTempType == 'html'">
          <OriginalLogJgy
            ref="originalLogJgy"
            @loadJgyContent4Main="loadJgyContent4Main"
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
  import OriginalLogXxy from './originalLogXxy.vue';
  import OriginalLogJgy from './originalLogJgy.vue';
  import CertificateCommon from "@/components/certificate/common/certificateCommon.js";
  import ExcelUtil from '@/mixins/ExcelUtil'
  //  import CertificateTemplateDetail from './certificateTemplateDetail.vue';


  const defaults = {
    hoho:''
  };
  export default {
    name: "OriginalLogAddDetail",
    components:{
      /** 模块对象 import 进来 后的别名  */
      OriginalLogXxy,OriginalLogJgy,
    },
    props: {
      //登记号
      registrationNo: {default: null},
      originalLogTempId:{default: null},
      originalLogId:{default: null},
      certificateCanEdit:{default: false},
      setMainCertificateJdzq:{
        type:Function,
        required:false
      },
//      setMainCertificatePzr:{
//        type:Function,
//        required:false
//      },
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
      getJgyTempType:{
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
//        isRouterJgyAlive:true,
        applianceUses: [],
//        jgyIdArray:[],
//        jgyMainContentMap:{},
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
        jgyTempType: "exl",
        skFlag: 1 ,
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
        this.getOriginalLogTemplateDetail();
        this.getNotAddCertificateSampleList();
        if(this.notAddCertificateSampleList.length == 0){
          this.$message.warning('无可添加的证书');
          this.$emit('hideOriginalLogAddDetailMain');
          return;
        }
        this.notAddCertificateSampleClick();
        this.getCertificateAddDefaultJdy();
        console.log(this.$refs.originalLogXxy,'this.$refs.originalLogXxy')
        this.$refs.originalLogXxy.setCertificateAddDefaultJdy(this.certificateAddDefaultJdy);
      }else if(this.actionType == "query"){
        //回显证书
        this.getOriginalLogDetail();
      }else if(this.actionType == "next"){
        //添加证书
        this.getNextOriginalLogContent();
        this.getNotAddCertificateSampleList();
        if(this.notAddCertificateSampleList.length == 0){
          this.$message.warning('无可添加的证书');
          this.$emit('hideOriginalLogAddDetailMain');
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
        if(this.originalLogTempId){
          _this.form.mbId = this.originalLogTempId ;
        }
        //登记号
        _this.form.registrationNo = this.registrationNo ;

        //来源（1->采用证书模板直接添加;2->原始记录上传;3->批量添加;4->原始记录批量上传;5->单机版来源;6->PAD版来源;7->移动端来源;8->仪器接口来源;9->出租车计价器;10->定量包装;）
        _this.form.source = "1" ;

        if("exl" == this.jgyTempType){
          this.form.mbType = 1 ;
        }else if("html" == this.jgyTempType){
          this.form.mbType = 2 ;
        }

        //检定周期
        _this.form.jdzq = _this.$refs.originalLogXxy.certificateJdzq;

        //备份标志位
        _this.form.backupStatus = _this.backupStatus ;
        //信息页保存的校验
        var flag = _this.$refs.originalLogXxy.checkData4CertificateAdd();
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
        _this.form.xxyId = _this.$refs.originalLogXxy.xxyZmbId;
        _this.form.xxyContent = _this.$refs.originalLogXxy.getContent();

        //处理excel 添加记录时不管有没有打开excel都保存excel参数
        if("exl" == this.jgyTempType){
          //exl
          let excelInfo = this.getExcelInfo();
          _this.form.excelPath = excelInfo["excelId"];
          _this.form.excelType = excelInfo["excelType"];
          _this.form.isSaveRange = true;
          _this.form.redPositionArray = excelInfo["redRange"];
          _this.form.bluePosition = excelInfo["blueRange"];
        }else if("html" == this.jgyTempType) {
          //html
          //结果页的
          _this.form.htmlContent = this.$refs.originalLogJgy.getJgyAllContent();
        }

        if(!_this.form.ysjlId){
          //证书编号
          _this.form.zsbh = this.notAddCertificateSample.zsbh ;
          _this.form.actionType = "记录添加" ;
          //样品编号
          _this.form.sampleBh = this.notAddCertificateSample.sampleBh ;

          //富文本的赋值
          ajaxSyncRequest('post',"back/originalLog/originalLogAdd",_this.form,function(res){
            if(res.code == 200){
              _this.$message.success('添加成功');
              _this.form.ysjlId = res.daoResult.ysjlId ;
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
          console.log(excelInfo)
          if(!!excelInfo["isSaveExcel"]){
            _this.form.excelPath = excelInfo["excelId"];
            _this.form.excelType = excelInfo["excelType"];
            if(!!excelInfo["isSaveRange"]){
              _this.form.isSaveRange = excelInfo["isSaveRange"];
              _this.form.redPositionArray = excelInfo["redRange"];
              _this.form.bluePosition = excelInfo["blueRange"];
            }
          }

          //富文本的赋值
          ajaxSyncRequest('put',"back/originalLog/updateOriginalLogById",_this.form,function(res){
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
        ajaxSyncRequest("get", "back/certificateCommon/getCertificateAddZsbhList/"+this.registrationNo+"/"+(this.originalLogTempId==null?this.form.mbId:this.originalLogTempId), null, res => {
          if (res.code === 200) {
            this.notAddCertificateSampleList = res.rows;
          }else {
            this.notAddCertificateSampleList = [] ;
          }
        });
      },
      notAddCertificateSampleClick(newVal,flag){
        Vue.set(this.form,'ysjlId',null);
        Vue.set(this.form,'zsbh',null);
        console.log(this.notAddCertificateSample,'notAddCertificateSample')
        console.log(newVal,'newVal')
//        if(typeof this.setMainCertificatePzr == "function") {
//          this.setMainCertificatePzr(0);
//        }
        if(newVal){
          //设置报告编号
          this.$nextTick(()=>{
            this.setZsbh();
            //下一份证书对信息页的处理
            this.$refs.originalLogXxy.nextCertificateInit(true);
          })
        }else {
          console.log(this.notAddCertificateSampleList,'this.notAddCertificateSampleList')
          //选中第一个样品编号
          Vue.set(this,'notAddCertificateSample',this.notAddCertificateSampleList[0]);
          //设置报告编号
          this.$nextTick(()=>{
            this.setZsbh();
            //下一份证书对信息页的处理
            this.$refs.originalLogXxy.nextCertificateInit(flag);
          })
        }
      },
      getOriginalLogTemplateDetail(){
        if(this.registrationNo != ""){
//          let _this = this;
          ajaxSyncRequest("get", "back/originalLog/initOriginalLog4Add",{registrationNo:this.registrationNo,mbId:this.originalLogTempId} , (res) => {
            if (res.code === 200) {
              this.form = res.daoResult ;

              //是否建标写死 1
//              this.form.isAuthorise = 1 ;
//              var result = res.daoResult;
              //处理信息页的内容
              this.$refs.originalLogXxy.xxyZmbId = this.form.xxyId

              //初始化Excel参数
              this.form["caseId"] = this.registrationNo
              this.initExcelInfo(this.form);
              //检定周期
              this.$refs.originalLogXxy.certificateJdzq = this.form.jdzq

              if(typeof this.setMainCertificateJdzq == "function"){
                this.setMainCertificateJdzq(this.form.jdzq);
              }
              this.$refs.originalLogXxy.setContent(this.form.xxyContent);

              if(this.form.mbType == 1){
                this.jgyTempType = "exl" ;
              }else if(this.form.mbType == 2){
                this.jgyTempType = "html" ;
              }

              if(typeof this.getJgyTempType == "function"){
                this.getJgyTempType(this.jgyTempType)
              }
              //是否受控
              this.skFlag = this.form.skFlag ;

              //设置页码并获得
//              this.getXxyTotalPage(false);
//              if(typeof this.setMainCertificatePzr == "function") {
//                this.setMainCertificatePzr(0);
//              }

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
      getNextOriginalLogContent(){
        if(this.registrationNo != ""){
//          let _this = this;
          ajaxSyncRequest("get", "back/originalLog/getNextOriginalLogContent",{registrationNo:this.registrationNo,ysjlId:this.originalLogId} , (res) => {
            if (res.code === 200) {
              this.form = res.daoResult ;

              //是否建标写死 1
              this.form.isAuthorise = 1 ;
//              var result = res.daoResult;
              //处理信息页的内容
              this.$refs.originalLogXxy.xxyZmbId = this.form.xxyId
              //检定周期
              this.$refs.originalLogXxy.certificateJdzq = this.form.jdzq


              //初始化Excel参数
              this.form["caseId"] = this.registrationNo
              this.initExcelInfo(this.form);

              if(typeof this.setMainCertificateJdzq == "function"){
                this.setMainCertificateJdzq(this.form.jdzq);
              }
              if(this.form.mbType == 1){
                this.jgyTempType = "exl" ;
              }else if(this.form.mbType == 2){
                this.jgyTempType = "html" ;
              }
              if(typeof this.getJgyTempType == "function"){
                this.getJgyTempType(this.jgyTempType)
              }

              //是否受控
              this.skFlag = this.form.skFlag ;

              this.$refs.originalLogXxy.setContent(this.form.xxyContent);
              //设置页码并获得
//              this.getXxyTotalPage(false);
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
      getOriginalLogDetail(){
        if(this.registrationNo != ""){
//          let _this = this;
          ajaxRequest("get", "back/originalLog/originalLogQueryByZsId",{registrationNo:this.registrationNo,ysjlId:this.originalLogId} , (res) => {
            if (res.code === 200) {
              this.form = res.daoResult;
              //设置模板id
//              this.originalLogTempId = this.form.mbId ;
              //处理信息页的内容
              this.$refs.originalLogXxy.xxyZmbId = this.form.xxyId
              //检定周期
              this.$refs.originalLogXxy.certificateJdzq = this.form.jdzq

              if(typeof this.setMainCertificateJdzq == "function"){
                this.setMainCertificateJdzq(this.form.jdzq);
              }

              //处理结果页内容
              if(this.form.mbType == 1){
                this.jgyTempType = "exl" ;
                //初始化Excel参数
                this.form["caseId"] = this.registrationNo
                this.initExcelInfo(this.form);
              }else if(this.form.mbType == 2){
                this.jgyTempType = "html" ;
                //强制刷新组件
                this.loadJgyContent4Main();
              }
              if(typeof this.getJgyTempType == "function"){
                this.getJgyTempType(this.jgyTempType)
              }

              //是否受控
              this.skFlag = this.form.skFlag ;

              //信息页大字段
              this.$refs.originalLogXxy.setContent(this.form.xxyContent);

              //检定信息
              this.$refs.originalLogXxy.setJdyInfo(this.form.jdyList);
              //核验信息
              this.$refs.originalLogXxy.setHyyInfo(this.form.hyyList);
              //批准人
//              this.$refs.originalLogXxy.setPzrInfo(this.form);
//              if(typeof this.setMainCertificatePzr == "function"){
//                this.setMainCertificatePzr(this.form.pzrSh);
//              }
              this.getAuditStatus();
            }else {
              this.$message.error(res.msg);
            }
          });
        }
      },
//      reloadJgy(){
//        this.isRouterJgyAlive = false
//        this.$nextTick(() => (this.isRouterJgyAlive = true))
//      },
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
//      getXxyCont(xxyZmbId){
//        //后台请求信息页内容
//        ajaxRequest("get", "back/certificateTemp/queryCertificateMainTempById", {zmbId:xxyZmbId,mbId:this.mbId}, res => {
//          if (res.code === 200) {
//            //将信息页加载
//            this.$refs.originalLogXxy.xxyZmbId = xxyZmbId;
//
//            //加载新的信息页模板内容
//            this.$refs.originalLogXxy.setContent(res.daoResult.xxyContent);
//            //设置页码并获得
//            this.getXxyTotalPage(true);
//          }
//        });
//      },
      //调用，加载结果页内容
      loadJgyContent4Main(){
        console.log(this.$refs.originalLogJgy,'this.$refs.originalLogJgy')
//        this.$refs.originalLogJgy.loadJgyContent(
//          this.jgyIdArray ,
//          this.jgyMainContentMap ,
//          this.jgyContentArray
//        )
//        console.log(this.form.jgyContent,'this.form.jgyContent')
        this.$refs.originalLogJgy.setJgyAllContent(this.form.htmlContent)

        //获得结果页
//        this.jgyTotalPage = this.$refs.originalLogJgy.getJgyPageTotal();
//        this.getJgyTotalPage(true);
      },
      //获得信息页页数，并根据入参是否重新刷新页码
//      getXxyTotalPage(flag){
//        this.xxyTotalPage = this.$refs.originalLogXxy.initPageIndex();
//        console.log(this.xxyTotalPage,'xxyTotalPage')
//        if(flag){
//          //结果页页码
//          this.getJgyTotalPage(true);
//        }
//      },
//      getJgyTotalPage(flag){
//        if(this.$refs.originalLogJgy){
//          this.jgyTotalPage = this.$refs.originalLogJgy.initPageIndex(this.xxyTotalPage);
//          console.log(this.jgyTotalPage,'jgyTotalPage')
//          if(flag){
//            //总页码
//            this.setTotalPage();
//          }
//        }
//      },
//      setTotalPage(){
//        this.$refs.originalLogXxy.initPageTotal(this.xxyTotalPage + this.jgyTotalPage);
//        if(this.$refs.originalLogJgy){
//          this.$refs.originalLogJgy.initPageTotal(this.xxyTotalPage + this.jgyTotalPage);
//        }
//      },
      //获得样品编号
      getSjdSampleNo(){
        return (this.form.sampleBh == null) ? this.notAddCertificateSample.sampleBh : this.form.sampleBh ;
      },
      //获得信息页模板ID
      getXxyZmbId(){
        return this.$refs.originalLogXxy.xxyZmbId ;
      },
      //添加结果页
      addJgy(){
        //调用结果页弹出选择模板页
        this.$refs.originalLogJgy.addGjy(null,'addGjy');
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
      getOriginalLogId(){
        return this.form.ysjlId ;
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
          this.$refs.originalLogXxy.setXxyZsbh(zsbh);
          console.log("这时候结果页是：",this.$refs.originalLogJgy)
          if(this.$refs.originalLogJgy){
            this.$refs.originalLogJgy.setJgyZsbh(zsbh);
          }
        }
      },
      //关联信息页主模板
      relationXxy(){
        this.$refs.originalLogXxy.relationXxy();
      },
      //获得检定周期
//      getCertificateJdzqArr() {
//        ajaxProxyRequest("get", "/njmind/findParam/certificateJdzq", {codeType:'NUMBER'}, res => {
//          this.certificateJdzqArr = res.list;
//        });
//      },
      //设置检定周期
      setCertificateJdzq() {

        this.$refs.originalLogXxy.certificateJdzq = this.form.jdzq

        this.$refs.originalLogXxy.setCertificateJdzq();

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
          this.$refs.originalLogXxy.getAuditStatus() ;
        }
      },
      initExcelParam () { // 初始化excel相关参数
        if (this.canDownloadExcel) {
          this.excelInfo.downLoadExcel = '1'
        }
//        this.excelInfo.savePicture = '1';
//        this.excelInfo.needSaveEmfCallBack = true;
      },
      /**
       * 保存截图后 回调方法
       */
//      saveEmfCallBack(){
//        // todo 根据截图信息动态生成结果页
//        if(!!this.excelInfo.emfJson && !!this.excelInfo.emfJson.emz){
//          let xxyZmbId = this.getXxyZmbId();
//          let redResultPageHtmlContent = "";
//          let blueResultPageHtmlContent = "";
//          let _that = this;
//          let errorMsg = "";
//          console.log(this.excelInfo.emfJson)
//          $.each(this.excelInfo.emfJson.emz,function (index, item) {
//            if(!!item){
//              if(item.fileType !='blue'){ //无框和红框时均采用红框html
//
//                if(!_that.redResultPageHtml){
//                  _that.getResultPageHtml(0,xxyZmbId)
//                }
//
//                if(!_that.redResultPageHtml){
//
//                  errorMsg = "操作失败！未定义红色区域！";
//                  return false;
//                }
//                redResultPageHtmlContent += _that.createResultPage(item,0)
//              }else { //篮筐
//                if(!_that.blueResultPageHtml){
//                  _that.getResultPageHtml(1,xxyZmbId)
//                }
//                if(!_that.blueResultPageHtml){
//
//                  errorMsg = "操作失败！未定义蓝色区域！";
//                  return false;
//                }
//                blueResultPageHtmlContent += _that.createResultPage(item,1)
//              }
//
//            }
//
//          })
//          if(!!errorMsg){
//            this.$message.error(errorMsg);
//            return;
//          }
//
//          this.form.jgyContent = blueResultPageHtmlContent + redResultPageHtmlContent;
//          this.loadJgyContent4Main();
//          this.setZsbh();
//          this.setExcelWinState(-1);
//          this.setScrollTop();
//          this.$message.success("操作成功!");
//        }
//      },
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
        //     scrollTop: $("#originalLogJgyDiv").offset().top
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
