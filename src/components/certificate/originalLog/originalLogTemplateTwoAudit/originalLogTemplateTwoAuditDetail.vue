<template>
  <div ref="certificate-page">
        <div class="topButton" ref="topBut">
          <el-button type="primary" :disabled="!canSaveBut" @click="handleSubmit" size="small" class="certificateButton">保存模板</el-button>
          <el-button type="primary" v-if="jgyTempType == 'exl'" @click="handleExcel" class="certificateButton">Excel模板</el-button>

          <el-button type="primary" @click="handleExcel" class="certificateButton">Excel</el-button>
          <!--<el-button type="primary" :disabled="!canSaveBut" @click="relationXxy" size="small">关联信息页主模板</el-button>-->
          <el-button type="primary" @click="changeAuditFlag(0,2,0)" :disabled="auditFlag != 2 " size="small" class="certificateButton">二级审核</el-button>
          <el-button type="primary" @click="changeAuditFlag(1,3,0)" :disabled="auditFlag != 3 " size="small" class="certificateButton">二级审核取消</el-button>
          <el-button type="primary" @click="changeAuditFlag(0,2,1)" :disabled="auditFlag != 2 " size="small" class="certificateButton">批量审核</el-button>
          <el-button type="primary" @click="changeAuditFlag(1,3,1)" :disabled="auditFlag != 3 " size="small" class="certificateButton">批量退回</el-button>
          <el-radio v-model="skFlag" label="1" @change="skFlagChange">受控</el-radio>
          <el-radio v-model="skFlag" label="0" @change="skFlagChange">非受控</el-radio>
          <el-input v-model="skbh" v-if="skFlag == 1 " style="width: 100px;margin-left: 20px"></el-input>
          <el-button type="primary" @click="saveSkbh" v-if="skFlag == 1 " class="certificateButton">保存编号</el-button>

          <!--<el-button type="primary" v-if="jgyTempType == 'html'" @click="relationJgy"  size="small" class="certificateButton">关联HTml主模板</el-button>-->
          <!--<el-select size="mini" v-model="mainCertificateJdzq" style="width:100px"-->
                     <!--@change="setCertificateJdzq"-->
                     <!--:disabled="!canSaveBut"-->
          <!--&gt;-->
            <!--<el-option  ref="certificateJdzqSel"-->
                        <!--v-for="certificateJdzq in certificateJdzqArr" :key="certificateJdzq.code"-->
                        <!--:label="certificateJdzq.remark" :value="certificateJdzq.code"-->
            <!--&gt;-->
              <!--{{certificateJdzq.remark}}-->
            <!--</el-option>-->
          <!--</el-select>-->
        </div>
        <div class="certForm" :style="{'max-height':certificateMaxHeight+'px' }">
          <OriginalLogTemplateDetail ref="originalLogTemplateDetail" v-on:showName="showName"
                                     :mbIds="mbIds" @setAuditFlag="setAuditFlag"
                                     :certificateCanEdit="canSaveBut"
                                     :setMainCertificateJdzq = "setMainCertificateJdzq"
                                     :canChangeCertificateGcInfo = "canChangeCertificateGcInfo"
                                     :canModifyCertificateGcInfo = "canModifyCertificateGcInfo"
                                     :getSkFlag = "getSkFlag"
                                     :getSkbh = "getSkbh"
          ></OriginalLogTemplateDetail>
        </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest} from '../../../util/base';
  import $ from 'jquery';
  import OriginalLogTemplateDetail from '../originalLogTempMain/originalLogTemplateDetail.vue';

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
    name: "OriginalLogTemplateTwoAuditDetail",
    components:{
      /** 模块对象 import 进来 后的别名  */
      OriginalLogTemplateDetail,
    },
    props: {
      //获得父页面传进来的参数
      mbId: {default: null},
//      mbIds:{default: null},
      mlId: {default:null},
      checkAuditedList:{default:null},
      checkUnauditedList:{default:null},
    },
    data() {
      return {
        form: {},
        rules: {
        },
        isRouterAlive: false ,
        auditFlag : 1 ,
        mbName:null,
        mbIds:null,
        canSaveBut:false,
        certificateJdzqArr : [] ,
        mainCertificateJdzq:12,
        certificateMaxHeight:'',
        canChangeCertificateGcInfo:true,
        canModifyCertificateGcInfo:true,
        jgyTempType:"exl",
        skFlag:1,
        skbh:"",
      }
    },
    created(){
      //获得检定周期
      this.getCertificateJdzqArr();
    },
    watch:{
      innerWidth(v){
           //写入触发的事件方法
           this.formTop = this.$refs.topBut.clientHeight+'px';
           this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
       },
      innerHeight(v){
        this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
      }
    },
    activated(){//keepalive 缓存重新反序列化
      this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
    },
    mounted() {
      this.$refs.originalLogTemplateDetail.getOriginalLogTemplateDetail(this.mbId);
      this.auditFlag = this.$refs.originalLogTemplateDetail.getAuditFlag();
      this.setButtonPower();
      this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
    },
    methods: {

      handleSubmit() {
        this.$refs.originalLogTemplateDetail.handleSubmit();
      },
      handleExcel () {
        this.$refs.originalLogTemplateDetail.openExcelDialog();
      },
      //添加结果页
      addJgy(){
        this.$refs.originalLogTemplateDetail.addJgy();
      },
      changeAuditFlag(type,step,actionType){
        var tip = "";
        var tiperror = "";
        if(0 == actionType){
          this.auditFlag = this.$refs.originalLogTemplateDetail.changeAuditFlag(type,step,actionType);
          this.noticeRefresh();
        }else if( 1 == actionType){
          if(1 == type){
            tip= "确认批量解除审核勾选的模板？";
            tiperror="请先在左侧下方勾选需要批量解除审核的模板！";
            this.mbIds = this.checkAuditedList ;
          }else{
            tip= "确认批量审核勾选的模板？";
            tiperror="请先在左侧下方勾选需要批量审核的模板！";
            this.mbIds = this.checkUnauditedList ;
          }
          if(this.mbIds!=null && this.mbIds.length>0){
            this.$confirm(tip, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center:true,
            }).then(() => {
              this.auditFlag = this.$refs.originalLogTemplateDetail.changeAuditFlag(type,step,actionType);
              this.noticeRefresh();
            },()=>{
            })
          }else{
             this.$message.error(tiperror);
          }
        }

      },
      setAuditFlag(auditFlag){
        this.auditFlag = auditFlag ;
        this.noticeRefresh();
      },
      showName:function(data){
       this.mbName =data;
      },
       //通知父组件刷新
      noticeRefresh(){
        console.log("noticeRefresh",this.mlId)
        this.$emit('noticeRefresh',this.mlId);
      },
      setButtonPower(){

        let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限

        if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
          btnPower = "@@";
        }
        //按钮_模板维护可修改已审核模板
        console.log(btnPower.indexOf("@M27008@"),"btnPower.indexOf(\"@M27008@\")");
        if(btnPower.indexOf("@M27008@") != -1){
          this.canSaveBut = true;
        }else {
          this.canSaveBut = false;
        }
      },
      //关联信息页主模板
      relationXxy(){
        this.$refs.originalLogTemplateDetail.relationXxy();
      },
      //获得检定周期
      getCertificateJdzqArr() {
        ajaxProxyRequest("get", "/njmind/findParam/certificateJdzq", {codeType:'NUMBER'}, res => {
          this.certificateJdzqArr = res.list;
        });
      },
      setCertificateJdzq(){
        this.$refs.originalLogTemplateDetail.form.jdzq = this.mainCertificateJdzq;
        this.$refs.originalLogTemplateDetail.setCertificateJdzq();
      },
      setMainCertificateJdzq(certificateJdzq){
        this.mainCertificateJdzq = certificateJdzq ;
      },
      getJgyTempType(jgyTempType){
        if(jgyTempType){
          this.jgyTempType = jgyTempType ;
        }
      },
      getSkFlag(skFlag){
        this.skFlag = skFlag ;
      },
      getSkbh(skbh){
        this.skbh = skbh ;
      },
      skFlagChange(){
        ajaxRequest('put', 'back/originalLogTemp/updateOriginalLogTempSkflag', {mbId:this.mbId,skFlag:this.skFlag}, (res) => {
          if (res.code === 200) {
            this.$message.success("修改成功");
          }else {
            this.$message.error(res.msg);
          }
        });
      },
      saveSkbh(){
        ajaxRequest('put', 'back/originalLogTemp/updateOriginalLogTempSkflag', {mbId:this.mbId,skbh:this.skbh}, (res) => {
          if (res.code === 200) {
            this.$message.success("保存成功");
          }else {
            this.$message.error(res.msg);
          }
        });
      },
    },
  }

</script>


<style lang="scss" scoped>
  .certificateButton{
    margin-bottom: 5px;
    margin-right: 5px;
    margin-left: 0px!important;
  }
  .topButton{
    // position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    // height: 36px;
    overflow: auto;
    /* border: 1px solid red; */
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
