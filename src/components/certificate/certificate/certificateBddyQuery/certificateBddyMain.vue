<template>
  <div>
    <div v-if="showList">
      <div>
        <el-table :data="certificateList" style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
          >
          </el-table-column>
          <el-table-column prop="zsbh" label="证书编号" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="zsdwmc" label="证书单位" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="zsqjmc" label="器具名称" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="xhgg" label="型号规格" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="ccbh" label="出厂编号" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="zzcs" label="制造厂商" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="orderNo" label="委托单号" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="zsjdrq" label="检定日期" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="departName" label="检测部门" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="userName" label="添加人" >
          </el-table-column>
          <el-table-column prop="zsbh" label="操作" >
            <template slot-scope="scope">
              <el-button @click="showZsDetailClick(scope.row)" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-view" title="查看"></i>
              </el-button>
              <el-button @click="printCertificate(scope.row,false,false)" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-printer" title="打印"></i>
              </el-button>
              <el-button @click="printCertificate(scope.row,true,false)" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-printer" title="备用打印"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else="" class="certForm">
      <CertificateAddDetail ref="certificateAddDetail"
                            showReturn="true"
                            :registrationNo="registrationNo"
                            :certificateId="certificateId"
                            @hideCertificateAddDetailMain="hideCertificateAddDetailMain"
                            :actionType="actionType"
                            :certificateQueryBack="certificateQueryBack"
      />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest,ajaxSyncRequest,formatDate} from '../../../util/base';
  import $ from 'jquery';
  import CertificateAddDetail from '../certificateAdd/certificateAddDetail.vue';
  import CertificatePrint from "@/components/certificate/common/printJs/certificatePrint.js"


  const defaults = {
    hoho:''
  };
  export default {
    name: "CertificateBddyMain",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateAddDetail,
    },
    mixins:[CertificatePrint],
    props: {
      //证书ID
//      certificateId: {default: null},
      //登记号
      registrationNo :{default: null},
      //勾选登记号列表
      checkAuditDjhList :{default: []},
      actionType:{default: ""},
      //需要展现的证书列表
      certificateList: {required: true},
      //打印机
      printer: {required: true},
      //打印份数
      printCopies: {required: true},
      //批量打印回调
      batchPrintCallBack: {
        type:Function,
        required:false
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
        certificateJdzqArr : [] ,
        mainCertificateJdzq:12,
        isSaved:false,
        canSHBatch:false,
        showList:true,
        certificateId:null,
        defaultPrinter:"zsdy",
        continuePrint:true,
      }
    },
    watch:{
      //监听参数的变化
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

    },
    mounted() {
//      this.certificateStatus = this.getCertificateStatus();
    },
    methods: {
      handleSubmit() {
        //子页面的保存方法
        this.$refs.certificateAddDetail.handleSubmit();
        //父页面刷新证书列表
        this.$emit('certificatesListReload',this.registrationNo);
//        this.certificateStatus = this.getCertificateStatus();
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
      setCertificateJdzq(){
        this.$refs.certificateAddDetail.form.jdzq = this.mainCertificateJdzq;
        this.$refs.certificateAddDetail.setCertificateJdzq();
      },
      //显示证书详情
      showZsDetailClick(data){
        this.certificateId = data.zsId;
        var fileId = data.pdfPath;
        this.fileDownlodByFileId(fileId,null,null,null,null,"toOpenPDF",null,data.zsbh);
//        this.showZsDetail();
      },
      showZsDetail(){
        this.showList=false;
      },
      certificateQueryBack(){
        this.showList=true;
      },
      //data 数据
      //flag 是否备份打印
      //isBatch 是否批量
      printCertificate(data,backPrint,isBatch){
        if (navigator.userAgent.indexOf("CefSharp") == -1 && navigator.userAgent.indexOf("IECsharp") == -1) { //未在容器中
          this.$message.warning("此功能依赖于容器，请在容器中进行操作。");
          return;
        }
        if((!this.continuePrint) && isBatch){
          this.$message.warning("已终止打印");
          this.continuePrint = true ;
          return;
        }
        //校验证书是否可以打印
        var flag = true;
        var errorMsg = "获取证书失败" ;
        var fileId = "";
        var printCopies = 1 ;
        var actionContent = "证书打印（补打打印）";
        if(!backPrint && !isBatch){
          actionContent = "证书打印（补打打印）";
        }else if(backPrint && !isBatch){
          actionContent = "证书备份打印（补打打印）";
        }else if(!backPrint && isBatch){
          actionContent = "证书批量打印（补打打印）";
        }else if(backPrint && isBatch){
          actionContent = "证书备份批量打印（补打打印）";
        }
        ajaxSyncRequest("get", "back/certificatePrintQuery/addCertificatePrintLog",
          {
            zsId:data.zsId,
            actionType:"打印",
            actionContent:actionContent,
          }
          , res => {
          if (res.code === 200) {
            fileId = res.daoResult.pdfPath;
          }else {
            this.$message.error(res.msg);
          }
        });

        if(fileId == "") {
          this.$message.warning(errorMsg);
          return ;
        }
        if(isBatch){
          printCopies = this.printCopies ;
        }
        //记录日志，并获得文件路径

        var printer = backPrint ? this.printer : this.defaultPrinter;
//        var printer = "Microsoft Print To PDF";
        //打印pdf
        this.fileDownlodByFileId(fileId,printer,isBatch,backPrint,printCopies,"toPrintPDF",this.printCallBack,data.zsbh);

      },
      printCallBack(isBatch,backPrint){
        if(!isBatch){
          this.$message.success("打印成功");
        }else {
          if(typeof this.batchPrintCallBack == "function"){
            this.batchPrintCallBack(backPrint);
          }
        }
      },
      stopPrint(){
        this.continuePrint = false ;
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
    height: 36px;
    overflow: auto;
    /* border: 1px solid red; */
    padding: 1px;
  }
  .certForm{
    position: absolute;
    top: 0px;
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
