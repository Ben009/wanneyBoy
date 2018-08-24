<template>
  <div ref="certificate-page">
        <div class="topButton cerCommonStyle" ref="topBut">
          <el-button type="primary" @click="handleSubmit" size="small" class="certificateButton">保存证书</el-button>
          <el-button type="primary" v-if="jgyTempType == 'exl'" @click="handleExcel" class="certificateButton">Excel模板</el-button>
          <el-button :disabled="isSaved" type="primary" @click="certificateSH" size="small" class="certificateButton">审核</el-button>
          <el-button type="primary" v-if="canSHBatch" @click="certificateSHBatch" size="small" class="certificateButton">批量审核</el-button>

        </div>
        <div class="certForm" :style="{'max-height':certificateMaxHeight+'px' }">
          <OriginalLogAddDetail ref="originalLogAddDetail"
            :registrationNo="registrationNo"
            :originalLogId="originalLogId"
            @hideOriginalLogAddDetailMain="hideOriginalLogAddDetailMain"
                                :certificateCanEdit="canSaveBut"
                                :setMainCertificateJdzq = "setMainCertificateJdzq"
                                :actionType="actionType"
                                :canChangeBzqZSInfo="canChangeBzqZSInfo"
                                :canEditYjBzBzqInfo="canEditYjBzBzqInfo"
                                :canChooseHistoryByQjmc="canChooseHistoryByQjmc"
                                :returnAuditStatus="getAuditStatus"
                                :canChangeCertificateGcInfo="canChangeCertificateGcInfo"
                                :canModifyCertificateGcInfo="canModifyCertificateGcInfo"
                                :getJgyTempType="getJgyTempType"
          />
        </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest,ajaxSyncRequest} from '../../../util/base';
  import $ from 'jquery';
  import OriginalLogAddDetail from '../originalLogAdd/originalLogAddDetail.vue';


  const defaults = {
    hoho:''
  };
  export default {
    name: "OriginalLogAuditJdyDetailMain",
    components:{
      /** 模块对象 import 进来 后的别名  */
      OriginalLogAddDetail,
    },
    props: {
      //证书ID
      originalLogId: {default: null},
      //登记号
      registrationNo :{default: null},
      //勾选登记号列表
      checkAuditDjhList :{default: []},
      //获得当前添加证书的状态
      shCallBack:{
        type:Function,
        required:true
      },
      //重置点击的登记号
      resetRegistrationNoTemp:{
        type:Function,
        required:true
      },
      actionType:{default: ""},
      //是否可修改标准器证书
      canChangeBzqZSInfo:{default: false},
      //技术依据、标准、仪器可编辑内容
      canEditYjBzBzqInfo:{default: false},
      //可根据器具名称查询开始数据
      canChooseHistoryByQjmc:{default: false},
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
        canSaveBut:true,
        certificateJdzqArr : [] ,
        mainCertificateJdzq:12,
        isSaved:false,
        canSHBatch:false,
        auditStatusTemp:[],
        certificateMaxHeight:'',
        jgyTempType:"exl",
        canChangeCertificateGcInfo:false,
        canModifyCertificateGcInfo:false,
      }
    },
    watch:{
      innerWidth(v){//高度变化触发
           //写入触发的事件方法
           //debugger
           this.formTop = this.$refs.topBut.clientHeight+'px';
           this.certificateMaxHeight = this.$store.state.admin.window_innerHeight - this.$refs.topBut.clientHeight - 3
       },
      innerHeight(v){
        this.certificateMaxHeight = this.$store.state.admin.window_innerHeight - this.$refs.topBut.clientHeight - 3
      }
    },
    created(){
      //获得检定周期
      this.getCertificateJdzqArr();

      let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
      if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
        btnPower = "@@";
      }
      //按钮_证书审核可批量审核证书
      if(btnPower.indexOf("@M27303@") != -1){
        this.canSHBatch = true ;
      }else {
        this.canSHBatch = false ;
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
//      this.certificateStatus = this.getCertificateStatus();
      this.certificateMaxHeight = this.$store.state.admin.window_innerHeight - this.$refs.topBut.clientHeight - 3
    },
    activated(){//keepalive 缓存重新反序列化
      this.certificateMaxHeight = this.$store.state.admin.window_innerHeight - this.$refs.topBut.clientHeight - 3
    },
    methods: {
      handleSubmit() {
        //子页面的保存方法
        this.$refs.originalLogAddDetail.handleSubmit();
        //父页面刷新证书列表
//        this.$emit('certificatesListReload',this.registrationNo);
//        this.certificateStatus = this.getCertificateStatus();
      },
      handleExcel(){
        this.$refs.originalLogAddDetail.openExcelDialog();
      },
      getJgyTempType(jgyTempType){
        if(jgyTempType){
          this.jgyTempType = jgyTempType ;
        }
      },
      changeAuditFlag(type,step,actionType){
//        this.$refs.certificateTemplateDetail.changeAuditFlag(type,step,actionType);
      },
      setAuditFlag(auditFlag){
        this.auditFlag = auditFlag ;
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
      certificateSH(){
        var flag = true ;
        for(var i=0;i<this.auditStatusTemp.length;i++){
          if(this.auditStatusTemp[i].auditRyId == window.localStorage.userId && this.auditStatusTemp[i].auditRyStatus != 1 && flag){
            flag = this.$refs.originalLogAddDetail.$refs.originalLogXxy.checkSignnaturePasswordBack(true,"0","0",i,this.auditStatusTemp[i].auditRyId ,this.originalLogId,"")
          }
        }
        if(flag){
          this.$message.success("审核成功");
          this.shCallBack("one");
          this.isSaved = true;
        }
      },
      certificateSHBatch(){
        console.log(this.checkAuditDjhList,"checkAuditDjhList");
        if(this.checkAuditDjhList.length==0){
          this.$message.warning("请先在左侧勾选需要批量审核的委托单！");
          return;
        }
        var auditObj = this.$refs.originalLogAddDetail.$refs.originalLogXxy.certificateAuditBatch(this.checkAuditDjhList,'0',"审核成功");
        if(auditObj != false){
          this.resetRegistrationNoTemp();
          this.shCallBack("bach");
          this.isSaved = true;
        }
      },
      getAuditStatus(auditStatus){
        this.auditStatusTemp = auditStatus.jdy ;
        for(var i=0;i<this.auditStatusTemp.length;i++){
          if(this.auditStatusTemp[i].auditRyId == window.localStorage.userId && this.auditStatusTemp[i].auditRyStatus != 1){
            this.isSaved = false ;
            return;
          }
        }
        this.isSaved = true ;
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
  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
  .custom-1d74b7 .el-form-item--small.el-form-item{
    margin-bottom:0px;
  }
</style>
