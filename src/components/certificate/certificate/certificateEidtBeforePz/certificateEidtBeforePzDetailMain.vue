<template>
  <div ref="certificate-page">
        <div class="topButton cerCommonStyle" ref="topBut">
          <!--{{form.mbName}}-->
          <el-button type="primary" @click="handleSubmit" size="small" class="certificateButton">保存证书</el-button>
          <el-button type="primary" size="small" @click="handleExcel" class="certificateButton">Excel</el-button>
          <!--<el-button type="primary" @click="nextCertificate" size="small" v-if="!certificateStatus">下一份证书</el-button>-->
          <!--<el-button :disabled="isSaved" type="primary" @click="certificateSH" size="small" >审核</el-button>-->
          <!--<el-button type="primary" v-if="canSHBatch" @click="certificateSHBatch" size="small" >批量审核</el-button>-->
          <el-button type="primary" size="small" v-has="'M27119'" @click="pzrButtonClick(false)" :disabled="pzrSh != 0" class="certificateButton">批准</el-button>
          <el-button type="primary" size="small" v-has="'M27119'" v-if="certificateApprovalTwoShow ==1" :disabled="pzrSh != 0" @click="pzrButtonClick(true)" class="certificateButton">备用批准</el-button>
          <el-button type="primary" @click="addJgy"  size="small" class="certificateButton">添加结果页</el-button>
          <!--<el-button type="primary" @click="handleEditNumber" size="small">修改证书数量</el-button>-->
          <!--<el-button type="primary" size="small">更新模板</el-button>-->
          <!--<el-button type="primary" size="small">另存模板</el-button>-->
          <!--<el-button type="primary" @click="modifySjdBgxs" size="small">修改报告形式</el-button>-->
          <!-- 关联信息页主模板 -->
          <!--<el-button type="primary" @click="relationXxy" size="small">关联信息页主模板</el-button>-->

          <!-- 检定周期 -->
          <el-select size="mini" v-model="mainCertificateJdzq" style="width:100px"
                     @change="setCertificateJdzq"
                     :disabled="!canSaveBut"
          >
            <el-option  ref="certificateJdzqSel"
                        v-for="certificateJdzq in certificateJdzqArr" :key="certificateJdzq.code"
                        :label="certificateJdzq.remark" :value="certificateJdzq.code"
            >
              {{certificateJdzq.remark}}
            </el-option>
          </el-select>

        </div>
        <div class="certForm" :style="{'max-height':certificateMaxHeight+'px' }">
          <CertificateAddDetail ref="certificateAddDetail"
            :registrationNo="registrationNo"
            :certificateId="certificateId"
            @hideCertificateAddDetailMain="hideCertificateAddDetailMain"
                                :certificateCanEdit="canSaveBut"
                                :setMainCertificateJdzq = "setMainCertificateJdzq"
                                :actionType="actionType"
                                :canChangeBzqZSInfo="canChangeBzqZSInfo"
                                :canEditYjBzBzqInfo="canEditYjBzBzqInfo"
                                :canChooseHistoryByQjmc="canChooseHistoryByQjmc"
                                :setMainCertificatePzr="setMainCertificatePzr"
                                :changeJdy4Sh="changeJdy4Sh"
                                :canChangeCertificateGcInfo="canChangeCertificateGcInfo"
                                :canModifyCertificateGcInfo="canModifyCertificateGcInfo"
          />
        </div>
  </div>
</template>

<script>
  import Vue from 'vue';
//  import {
//    Container,Aside,Main,
//    Button,
//    Col,
//
//    Form,
//    FormItem,
//    Input,
//    Row,
//  } from 'element-ui';
  import {ajaxRequest,ajaxProxyRequest,ajaxSyncRequest} from '../../../util/base';
  import $ from 'jquery';
  import CertificateAddDetail from '../certificateAdd/certificateAddDetail.vue';

//  Vue.use(Container);
//  Vue.use(Aside);
//  Vue.use(Main);
//  Vue.use(Form);
//  Vue.use(FormItem);
//  Vue.use(Input);
//  Vue.use(Button);
//  Vue.use(Row);
//  Vue.use(Col);

  const defaults = {
    hoho:''
  };
  export default {
    name: "CertificateAddDetailMain",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateAddDetail,
    },
    props: {
      //证书ID
      certificateId: {default: null},
      //登记号
      registrationNo :{default: null},
      //勾选登记号列表
      checkAuditDjhList :{default: []},
      //获得当前添加证书的状态
      reSearchSjdInfo:{
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
        pzrSh:0,
        certificateApprovalTwoShow:0,
        //按钮_证书查询审核后可更换检定、核验、批准人员
        changeJdy4Sh:false,
        certificateMaxHeight:'',
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
      this.getCertificateApprovalTwoShow();

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
      //按钮_证书查询审核后可更换检定、核验、批准人员
//      if(btnPower.indexOf("@M27609@") != -1 ){
//        console.log(this.changeJdy4Sh,'this.changeJdy4Sh')
//        this.changeJdy4Sh = true ;
//      }
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
        this.$refs.certificateAddDetail.handleSubmit();
        //父页面刷新证书列表
//        this.$emit('certificatesListReload',this.registrationNo);
//        this.certificateStatus = this.getCertificateStatus();
      },
      handleExcel(){
        this.$refs.certificateAddDetail.openExcelDialog();
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
         this.$emit('certificatesListReload',this.registrationNo);
      },
      //下一份证书
//      nextCertificate(){
//        this.$refs.certificateAddDetail.showNextCertificate();
//      },
      //修改报告形式
//      modifySjdBgxs(){
//        //获得sjd信息
//        this.modifySjdBgxsShow = true ;
//        this.sjdSampleNo = this.$refs.certificateAddDetail.getSjdSampleNo();
//      },
//      //报告形式回调
//      modifySjdBgxsCallback(){
//        this.modifySjdBgxsShow = null;
//      },
      //关联信息页主模板
      relationXxy(){
        this.$refs.certificateAddDetail.relationXxy();
      },
      //添加结果页
      addJgy(){
        this.$refs.certificateAddDetail.addJgy();
      },
      hideCertificateAddDetailMain(){
        this.$emit('hideCertificateAddDetailMain');
      },
      //获得检定周期
      getCertificateJdzqArr() {
        ajaxProxyRequest("get", "/njmind/findParam/certificateJdzq", {codeType:'NUMBER'}, res => {
          this.certificateJdzqArr = res.list;
        });
      },
      //证书备用批准是否启用
      getCertificateApprovalTwoShow() {
        ajaxProxyRequest("get", "/njmind/findParam/certificateApprovalTwoShow", {codeType:'NUMBER'}, res => {
          this.certificateApprovalTwoShow = res.value;
        });
      },
      setCertificateJdzq(){
        this.$refs.certificateAddDetail.form.jdzq = this.mainCertificateJdzq;
        this.$refs.certificateAddDetail.setCertificateJdzq();
      },
      setMainCertificateJdzq(certificateJdzq){
        this.mainCertificateJdzq = certificateJdzq ;
      },
      certificateSH(){
        var auditObj = this.$refs.certificateAddDetail.$refs.certificateXxy.certificateAudit("0", "1", "", "", this.certificateId, "审核成功");
//        ajaxSyncRequest("get", "back/certificate/getCertificateListBySjd", {registrationNo:this.registrationNo}, res => {
          if(auditObj != false){
            this.reSearchSjdInfo();
            //父页面刷新证书列表
//            this.$emit('certificatesListReload',this.registrationNo);
            this.isSaved = true;
          }/*else {
            this.$message.error(res.msg);
          }*/
//        });
      },
      certificateSHBatch(){
        console.log(this.checkAuditDjhList,"checkAuditDjhList");
        if(this.checkAuditDjhList.length==0){
          this.$message.warning("请先在左侧勾选需要批量审核的委托单！");
          return;
        }
        var auditObj = this.$refs.certificateAddDetail.$refs.certificateXxy.certificateAuditBatch(this.checkAuditDjhList,'1',"审核成功");
        if(auditObj != false){
          this.resetRegistrationNoTemp();
          this.reSearchSjdInfo();
          this.isSaved = true;
        }
//        ajaxSyncRequest("get", "back/certificate/getCertificateListBySjd", {registrationNo:this.registrationNo}, res => {
//          if (res.code === 200) {
//            this.resetRegistrationNoTemp();
//            this.reSearchSjdInfo();
//            this.isSaved = true;
//            //父页面刷新证书列表
////            this.$emit('certificatesListReload',this.registrationNo);
//          }else {
//            this.$message.error(res.msg);
//          }
//        });
      },
      pzrButtonClick(BY){
        this.$refs.certificateAddDetail.$refs.certificateXxy.pzrButtonClick(BY);
      },
      setMainCertificatePzr(pzrSh){
        this.pzrSh = pzrSh ;
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
</style>
