<template>
  <div ref="certificate-page">
        <div class="topButton" ref="topBut">
          <!--{{form.mbName}}-->
          <el-button type="warning" @click="originalLogQueryListBack" size="small" class="certificateButton" v-if="!!showReturn">返回</el-button>
          <el-button type="primary" @click="handleSubmit" size="small" class="certificateButton">保存记录</el-button>
          <el-button type="primary" v-if="jgyTempType == 'exl'" @click="handleExcel" class="certificateButton">Excel模板</el-button>
          <el-button type="primary" @click="nextCertificate(true)" size="small" class="certificateButton" :disabled="!canAddNext" v-if="!!showNextCertificate">下一份记录</el-button>
          <el-button type="primary" size="small" v-has="'M27113'" class="certificateButton">更新模板</el-button>
          <el-button type="primary" size="small" v-has="'M27114'" class="certificateButton">另存模板</el-button>

        </div>
        <div class="certForm" :style="{'max-height':certificateMaxHeight+'px' }">
          <OriginalLogAddDetail ref="originalLogAddDetail"
            :registrationNo="registrationNo" :originalLogTempId="originalLogTempId"
            :originalLogId="originalLogId"
            @hideOriginalLogAddDetailMain="hideOriginalLogAddDetailMain"
                                :certificateCanEdit="canSaveBut"
                                :setMainCertificateJdzq = "setMainCertificateJdzq"
                                :actionType="actionType"
                                :canChangeBzqZSInfo="canChangeBzqZSInfo"
                                :canEditYjBzBzqInfo="canEditYjBzBzqInfo"
                                :canChooseHistoryByQjmc="canChooseHistoryByQjmc"
                                :canChangeCertificateGcInfo="canChangeCertificateGcInfo"
                                :canModifyCertificateGcInfo="canModifyCertificateGcInfo"
                                :getJgyTempType="getJgyTempType"
          />
          <CertificateEditNumber v-if="!!editNumberShow" :registrationNo="registrationNo"  :callback="handleCallback"  />
          <ModifySjdBgxsDialog v-if="!!modifySjdBgxsShow"
                               :registrationNo="registrationNo" :sjdSampleNo="sjdSampleNo"
                               :callback="modifySjdBgxsCallback"
          />
        </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest} from '../../../util/base';
  import $ from 'jquery';
  import OriginalLogAddDetail from './originalLogAddDetail.vue';
  import CertificateEditNumber from '../../common/certificateCommon/certificateEditNumber';
  import ModifySjdBgxsDialog from '../../common/certificateCommon/modifySjdBgxsDialog.vue';

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
    name: "OriginalLogAddDetailMain",
    components:{
      /** 模块对象 import 进来 后的别名  */
      OriginalLogAddDetail,CertificateEditNumber,ModifySjdBgxsDialog,
    },
    props: {
      //证书ID
      originalLogId: {default: null},
      //模板ID
      originalLogTempId: {default: null},
      //登记号
      registrationNo :{default: null},
      //获得当前添加证书的状态
      getOriginalLogStatus:{
        type:Function,
        required:false
      },
      //将左侧点击的登记号传递到右侧
      getNextOriginalLog:{
        type:Function,
        required:false
      },
      //获得左侧点击的登记号
      getClickRegistrationNo:{
        type:Function,
        required:false
      },
      originalLogQueryListBack:{
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
      //是否显示返回按钮
      showReturn:{
        required:false,
        default: false
      },
      //是否显示下一份
      showNextCertificate:{
        required:false,
        default: false
      },
    },
    data() {
      return {
        form: {},
        rules: {
        },
        isRouterAlive: false ,
        auditFlag : 0 ,
        editNumberShow: false,
        modifySjdBgxsShow:false,
        sjdSampleNo : null ,
        //是否可点击下一份
        canAddNext:false,
        canSaveBut:true,
        certificateJdzqArr : [] ,
        mainCertificateJdzq:12,
//        pzrSh:0,
        canChangeCertificateNumber:false,
//        certificateApprovalTwoShow:0,
        formTop:"36px",
        certificateMaxHeight:'',
        canChangeCertificateGcInfo:false,
        canModifyCertificateGcInfo:false,
        jgyTempType:"exl",
      }
    },
    watch:{
      innerWidth(v){//高度变化触发
           //写入触发的事件方法
           //debugger
           this.formTop = this.$refs.topBut.clientHeight+'px';
           this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
       },
      innerHeight(v){
        this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
      }
    },
    created(){
      //获得检定周期
      this.getCertificateJdzqArr();
//      this.getCertificateApprovalTwoShow();

      let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
      if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
        btnPower = "@@";
      }
      //按钮_证书编辑时可修改证书数量
      if(btnPower.indexOf("@M27111@") != -1){
        this.canChangeCertificateNumber = true ;
      }else {
        this.canChangeCertificateNumber = false ;
      }
      //按纽_证书编辑时可更换技术规程、计量标准及标准器
      if(btnPower.indexOf("@M27116@") != -1){
        this.canChangeCertificateGcInfo = true ;
      }else {
        this.canChangeCertificateGcInfo = false ;
      }

      //按钮_证书编辑时可右键修改技术规程、计量标准及标准器
      if(btnPower.indexOf("@M27117@") != -1){
        this.canModifyCertificateGcInfo = true ;
      }else {
        this.canModifyCertificateGcInfo = false ;
      }
    },
    mounted() {
      if(this.originalLogId && this.actionType!="next"){
        this.canAddNext = true;
      }
      this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
    },
    activated(){//keepalive 缓存重新反序列化
      this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
    },
    methods: {
      handleSubmit() {
        //子页面的保存方法
        var flag = this.$refs.originalLogAddDetail.handleSubmit();
        if(flag){
          //父页面刷新证书列表
          this.$emit('originalLogsListReload',this.registrationNo);
          this.canAddNext = true;
        }
      },
      changeAuditFlag(type,step,actionType){
//        this.$refs.certificateTemplateDetail.changeAuditFlag(type,step,actionType);
      },
      setAuditFlag(auditFlag){
        this.auditFlag = auditFlag ;
      },
      //修改证书数量(弹窗显示)
      handleEditNumber(){
        this.editNumberShow = true;
      },
      //修改证书数量(弹窗隐藏)
       handleCallback(){
        this.editNumberShow = false;
        //刷新已添加证书
         this.$emit('originalLogsListReload',this.registrationNo);
      },
      //下一份证书
      nextCertificate(click){
        this.canAddNext = false ;
        var flag = this.$refs.originalLogAddDetail.showNextCertificate(click);
        //当前登记号没有待添加证书了
        if(false === flag ){
          console.log(this.getClickRegistrationNo(),this.registrationNo,'this.getClickRegistrationNo() == this.registrationNo')
          if(this.getClickRegistrationNo() == this.registrationNo ){
            this.$message.warning('无可添加的证书');
            this.canAddNext = true ;
            return ;
          }else {
            //获得新的登记号
            this.getNextOriginalLog(this.$refs.originalLogAddDetail.getOriginalLogId());
          }
        }
      },
      //修改报告形式
      modifySjdBgxs(){
        //获得sjd信息
        this.modifySjdBgxsShow = true ;
        this.sjdSampleNo = this.$refs.originalLogAddDetail.getSjdSampleNo();
      },
      //报告形式回调
      modifySjdBgxsCallback(){
        this.modifySjdBgxsShow = null;
      },
      hideOriginalLogAddDetailMain(){
        this.$emit('hideOriginalLogAddDetailMain');
      },
      //获得检定周期
      getCertificateJdzqArr() {
        ajaxProxyRequest("get", "/njmind/findParam/certificateJdzq", {codeType:'NUMBER'}, res => {
          this.certificateJdzqArr = res.list;
        });
      },
      setCertificateJdzq(){
        this.$refs.originalLogAddDetail.form.jdzq = this.mainCertificateJdzq;
        this.$refs.originalLogAddDetail.setCertificateJdzq();
      },
      setMainCertificateJdzq(certificateJdzq){
        this.mainCertificateJdzq = certificateJdzq ;
      },
      pzrButtonClick(BY){
        this.$refs.originalLogAddDetail.$refs.originalLogXxy.pzrButtonClick(BY);
      },
      handleExcel(){
        this.$refs.originalLogAddDetail.openExcelDialog();
      },
      getJgyTempType(jgyTempType){
        if(jgyTempType){
          this.jgyTempType = jgyTempType ;
        }
      },
    },
  }

</script>


<style lang="scss" scoped>
  .topButton{
    // position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    /* height: 36px;
    overflow: auto;
    border: 1px solid red; */
    padding: 1px;
    border-bottom: 1px solid #ccc;
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
  .certificateButton{
    margin-bottom: 5px;
    margin-right: 5px;
    margin-left: 0px!important;
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

/*   .el-form-item--small{
    margin-bottom:3px !important;
  } */
</style>
