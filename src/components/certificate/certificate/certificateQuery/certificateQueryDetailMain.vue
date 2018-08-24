<template>
  <div>
        <div class="topButton" ref="topBut">
          <!--{{form.mbName}}-->
          <el-button type="warning" @click="certificateQueryListBack" size="small" v-if="!!showReturn">返回</el-button>
          <el-button type="primary" @click="handleSubmit" v-if="canSaveBut" size="small">保存证书</el-button>
          <el-button type="primary" size="small" @click="handleExcel" >Excel</el-button>
          <el-button type="primary" size="small" v-has="'M27119'" @click="pzrButtonClick(false)" :disabled="pzrSh != 0" >批准</el-button>
          <el-button type="primary" size="small" v-has="'M27119'" v-if="certificateApprovalTwoShow ==1" @click="pzrButtonClick(true)" :disabled="pzrSh != 0" >备用批准</el-button>
          <el-button type="primary" @click="addJgy" v-if="canSaveBut" size="small">添加结果页</el-button>
          <!--<el-button type="primary" v-if="canChangeCertificateNumber" @click="handleEditNumber" size="small">修改证书数量</el-button>-->
          <el-button type="primary" size="small" v-has="'M27113'" >更新模板</el-button>
          <el-button type="primary" size="small" v-has="'M27114'" >另存模板</el-button>
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
        <div class="certForm" :style="{top:formTop }">
          <CertificateAddDetail ref="certificateAddDetail"
            :registrationNo="registrationNo" :certificateTempId="certificateTempId"
            :certificateId="certificateId"
            @hideCertificateAddDetailMain="hideCertificateAddDetailMain"
                                :certificateCanEdit="canSaveBut"
                                :setMainCertificateJdzq = "setMainCertificateJdzq"
                                :actionType="actionType"
                                :canChangeBzqZSInfo="canChangeBzqZSInfo"
                                :canEditYjBzBzqInfo="canEditYjBzBzqInfo"
                                :canChooseHistoryByQjmc="canChooseHistoryByQjmc"
                                :changeJdy4Sh="changeJdy4Sh"
                                :setMainCertificatePzr="setMainCertificatePzr"
                                :canChangeCertificateGcInfo="canChangeCertificateGcInfo"
                                :canModifyCertificateGcInfo="canModifyCertificateGcInfo"
          />
          <!--<CertificateEditNumber v-if="!!editNumberShow" :registrationNo="registrationNo"  :callback="handleCallback"  />-->
          <!--<ModifySjdBgxsDialog v-if="!!modifySjdBgxsShow"-->
                               <!--:registrationNo="registrationNo" :sjdSampleNo="sjdSampleNo"-->
                               <!--:callback="modifySjdBgxsCallback"-->
          <!--/>-->
        </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest,ajaxSyncRequest} from '../../../util/base';
  import $ from 'jquery';
  import CertificateAddDetail from '../certificateAdd/certificateAddDetail.vue';
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
    name: "CertificateQueryDetailMain",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateAddDetail,CertificateEditNumber,ModifySjdBgxsDialog,
    },
    props: {
      //证书ID
      certificateId: {default: null},
      //模板ID
      certificateTempId: {default: null},
      //登记号
      registrationNo :{default: null},
      //获得当前添加证书的状态
//      getCertificateStatus:{
//        type:Function,
//        required:false
//      },
      //将左侧点击的登记号传递到右侧
//      getNextCertificate:{
//        type:Function,
//        required:false
//      },
      //获得左侧点击的登记号
//      getClickRegistrationNo:{
//        type:Function,
//        required:false
//      },
      certificateQueryListBack:{
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

    },
    data() {
      return {
        form: {},
        rules: {
        },
//        loading: false,
//        remoteOptions: [],
//        kindEditor : null ,
//        jgyMainContentMap: null,
//        jgyIdArray:[],
//        jgyContentArray:[],
//        jgyShowArray:[],
        isRouterAlive: false ,
        auditFlag : 0 ,
        editNumberShow: false,
        modifySjdBgxsShow:false,
        sjdSampleNo : null ,
        //是否可点击下一份
//        canAddNext:false,
        canSaveBut:false,
        certificateJdzqArr : [] ,
        mainCertificateJdzq:12,
        canChangeCertificateNumber:false,
        certificateApprovalTwoShow:0,
        formTop:"36px",
        certificateWareHouseFlag:"",
        //是否显示返回按钮
        showReturn:{
          required:false,
          default: false
        },
        //按钮_证书查询审核后可更换检定、核验、批准人员
        changeJdy4Sh:false,
        pzrSh:0,
        canChangeCertificateGcInfo:false,
        canModifyCertificateGcInfo:false,
      }
    },
    watch:{
      innerWidth(v){//高度变化触发
           //写入触发的事件方法
           //debugger
           this.formTop = this.$refs.topBut.clientHeight+'px';
       },
    },
    computed:{
    },
    created(){
      //获得检定周期
      this.getCertificateJdzqArr();
      this.getCertificateApprovalTwoShow();

      let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
      if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
        btnPower = "@@";
      }
      //按钮_证书查询入库前可保存证书 M27615
      //按钮_证书查询入库后可保存证书 M27616
      this.getCertificateWareHouseFlag();
      if(btnPower.indexOf("@M27615@") != -1 && this.certificateWareHouseFlag != 4){
        this.canSaveBut = true ;
      }else if(btnPower.indexOf("@M27616@") != -1 && this.certificateWareHouseFlag == 4){
        this.canSaveBut = true ;
      }else {
        this.canSaveBut = false ;
      }
      //按钮_证书查询审核后可更换检定、核验、批准人员
      if(btnPower.indexOf("@M27609@") != -1 ){
        console.log(this.changeJdy4Sh,'this.changeJdy4Sh')
        this.changeJdy4Sh = true ;
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
//      if(this.certificateId && this.actionType!="next"){
//        this.canAddNext = true;
//      }

    },
    methods: {
      handleSubmit() {
        //子页面的保存方法
        var flag = this.$refs.certificateAddDetail.handleSubmit();
//        if(flag){
          //父页面刷新证书列表
//          this.$emit('certificatesListReload',this.registrationNo);
//          this.canAddNext = true;
//        }
      },
//      changeAuditFlag(type,step,actionType){
////        this.$refs.certificateTemplateDetail.changeAuditFlag(type,step,actionType);
//      },
//      setAuditFlag(auditFlag){
//        this.auditFlag = auditFlag ;
//      },
      //修改证书数量(弹窗显示)
//      handleEditNumber(){
//        this.editNumberShow = true;
//      },
      //修改证书数量(弹窗隐藏)
//       handleCallback(){
//        this.editNumberShow = false;
//        //刷新已添加证书
//         this.$emit('certificatesListReload',this.registrationNo);
//      },
      //下一份证书
//      nextCertificate(click){
//        this.canAddNext = false ;
//        var flag = this.$refs.certificateAddDetail.showNextCertificate(click);
//        //当前登记号没有待添加证书了
//        if(false === flag ){
//          console.log(this.getClickRegistrationNo(),this.registrationNo,'this.getClickRegistrationNo() == this.registrationNo')
//          if(this.getClickRegistrationNo() == this.registrationNo ){
//            this.$message.warning('无可添加的证书');
//            this.canAddNext = true ;
//            return ;
//          }else {
//            //获得新的登记号
//            this.getNextCertificate(this.$refs.certificateAddDetail.getCertificateId());
//          }
//        }
//      },
//      //修改报告形式
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
//      relationXxy(){
//        this.$refs.certificateAddDetail.relationXxy();
//      },
      //添加结果页
      addJgy(){
        this.$refs.certificateAddDetail.addJgy();
      },
      handleExcel(){
        this.$refs.certificateAddDetail.openExcelDialog();
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
      pzrButtonClick(BY){
        this.$refs.certificateAddDetail.$refs.certificateXxy.pzrButtonClick(BY);
      },
      setMainCertificatePzr(pzrSh){
        this.pzrSh = pzrSh ;
      },
      //获得证书的库房状态
      getCertificateWareHouseFlag(){
        ajaxSyncRequest("get", "back/certificateCommon/getCertificateWareHouseFlag/"+this.certificateId,{} , (res) => {
          if (res.code === 200) {
            this.certificateWareHouseFlag = res.daoResult;
          }else {
            this.$message.error(res.msg);
          }
        })
      },
    },
  }

</script>


<style lang="scss" scoped>
  .topButton{
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    /* height: 36px;
    overflow: auto;
    border: 1px solid red; */
    padding: 1px;
  }
  .certForm{
    position: absolute;
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

/*   .el-form-item--small{
    margin-bottom:3px !important;
  } */
</style>
