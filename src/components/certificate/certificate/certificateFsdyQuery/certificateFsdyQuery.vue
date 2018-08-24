<template>
  <div class="certArea">
      <div class="certLeftMenu">
        <!-- 查询的表头 -->
        <div class="topButton">
          <el-form :inline="true">
            <el-col :span="16">
            <el-form-item>
              <el-select v-model="searchType" >
                <el-option value="0" label="登记号"></el-option>
                <el-option value="1" label="委托单号"></el-option>
                <el-option value="2" label="流转单号"></el-option>
                <el-option value="3" label="单位名称"></el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="6" style="text-align: center;margin-top:10px;">
              <!--<template>-->
                <!--<span>-->
                    <!--{{certificateTotal}}-->
                  <!--</span>-->
                <!--<el-tooltip content="当前需要出具的证书数量" placement="top">-->
                  <!--<i class="el-icon-info ft12"></i>-->
                <!--</el-tooltip>-->
              <!--</template>-->
            </el-col>
            <el-col :span="16">
            <el-form-item>
              <el-col :span="4">
              <el-checkbox :indeterminate="isIndeterminateAuditDjhList"
                           v-model="checkAllAuditDjhListList"
                           @change="handlecheckAllAuditDjhListChange" >
              </el-checkbox>
              </el-col>
              <el-col :span="20">
              <el-input clearable v-model="searchKey"></el-input>
              </el-col>
            </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" @click="searchInit">查询</el-button>
            </el-form-item>
            </el-col>
          </el-form>
        </div>
            <!--<ul class="ulList">-->
              <!-- 列表 -->

              <el-checkbox-group v-model="checkAuditDjhList" @change="handleAuditDjhListCheckedChange">
                <el-table :data="certificateData" ref="certificateTable" :max-height="ZSTableMaxHeight" >
                  <el-table-column align='left'>
                    <template slot-scope="scope" align="left">
                      <el-checkbox  :label="scope.row.registrationNo"  :key="scope.row.registrationNo" @change="certificateDataClick(scope.row.registrationNo,scope.row.certificateNumber)" style="width: 100%" >
                        <div :class="{cursor:true,'current-row':registrationNo && registrationNo == scope.row.registrationNo }">
                          <p v-if="scope.row.returnFlag == 1 " style="color: red">{{scope.row.registrationNo}}</p>
                          <p v-else="" style="color: blue">{{scope.row.registrationNo}}</p>
                          <p style="font-weight: bold">{{scope.row.applianceActualName == null ? scope.row.applianceName : scope.row.applianceActualName}}</p>
                          <p>{{scope.row.companyName }}</p>
                        </div>
                      </el-checkbox>
                    </template>
                  </el-table-column>
                </el-table>
              </el-checkbox-group>

              <mind-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                layout="prev,next,sizes,countpage,total"
                :page-size="rows"
                :total="total"
                style="margin-top:10px;"
              >
              </mind-pagination>
      </div>
      <div class="certRightArea">
        <div>
          <el-col :span="24">
            打印份数：
            <el-select v-model="printCopies" style="width: 100px" >
              <el-option value="1" label="1"></el-option>
              <el-option value="2" label="2"></el-option>
              <el-option value="3" label="3"></el-option>
              <el-option value="4" label="4"></el-option>
              <el-option value="5" label="5"></el-option>
              <el-option value="6" label="6"></el-option>
              <el-option value="7" label="7"></el-option>
              <el-option value="8" label="8"></el-option>
              <el-option value="9" label="9"></el-option>
              <el-option value="10" label="10"></el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="batchPrint(false)">批量打印</el-button>
            　　　
            指定打印机：
            <el-select v-model="printer" :autoWidth=true style="width: 250px" >
              <el-option :value="val" :key="val" :label="val"
                         v-for="val in printerList" >
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="batchPrint(true)">批量备用打印</el-button>
            <el-button type="primary" size="mini" @click="stopPrint()">停止打印</el-button>
          </el-col>
        </div>
        <CertificateFsdyMain
                                  ref="certificateFsdyMain"
                                  :certificateId="certificateId"
                                  :registrationNo="registrationNo"
                                  @certificatesListReload="getCertificateList"
                                 :checkAuditDjhList="checkAuditDjhList"
                                 :resetRegistrationNo="resetRegistrationNo"
                                 :actionType="actionType"
                                  :canChangeBzqZSInfo="canChangeBzqZSInfo"
                                  :canEditYjBzBzqInfo="canEditYjBzBzqInfo"
                                  :canChooseHistoryByQjmc="canChooseHistoryByQjmc"
                                  :certificateList="certificateList"
                                  :printer="printer"
                                  :printCopies="printCopies"
                                  :batchPrintCallBack="batchPrintCallBack"
        />
      </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../../util/base";
  import CertificatesList from '../../common/certificateCommon/certificatesList.vue';
  import CertificateFsdyMain from './certificateFsdyMain.vue';
  import ElCol from "@/common-el/packages/col/src/col";
  import CertificatePrint from "@/components/certificate/common/printJs/certificatePrint.js"
  import $ from 'jquery';

  export default {
    name: "CertificateFsdyQuery",
    mixins:[CertificatePrint],
    data() {
      return {
        searchType: "0",
        searchKey: "",
        page: 1,
        rows: 10,
        total: 0,
        certificateData: [],
        edit:null,
        currentKey:0,
        certificateList:[],
        certificatesListRouter: true,
        certificateId:null,
        certificateNumber : 0 ,
        certificateAddCount : 0 ,
        certificateTempId : null ,
        registrationNo : null ,
        // checkbox 的不确定状态
        isIndeterminateAuditDjhList:false,
        //选中状态
        checkAllAuditDjhListList: false,
        //选中的
        checkAuditDjhList:[],
        //用于全选的
        checkAuditDjhListInterim:[],
//        searchDialogShow: false,
        actionType:"query",
//        certificateTotal:0,
        //是否可修改标准器证书
        canChangeBzqZSInfo:true,
        //技术依据、标准、仪器可编辑内容
        canEditYjBzBzqInfo:true,
        //可根据器具名称查询开始数据
        canChooseHistoryByQjmc:true,
        printer:"",
        printerList:[],
        printCopies:"1",
        batchPrintDjhIndex:0,
        batchPrintZsIndex:0,
      };
    },
    components: {
      ElCol,CertificatesList,CertificateFsdyMain,

    },
    computed:{
      ZSTableMaxHeight(){
        return  this.$store.state.admin.window_innerHeight-250;
      },
    },
    methods: {
      searchInit(){
        this.page = 1 ;
        this.search();
      },
      search() {
        let paramters = {
          page: this.page,
          rows: this.rows,
          total: 0,
        };
        if (this.searchType == "0") {
          if (this.searchKey != '') {
            paramters["registrationNo"] = this.searchKey;
          }

        } else if (this.searchType == "1") {
          if (this.searchKey != '') {
            paramters["orderNo"] = this.searchKey;
          }

        } else if (this.searchType == "2") {
          if (this.searchKey != '') {
            paramters["orderSingleNo"] = this.searchKey;
          }

        } else if (this.searchType == "3") {
          if (this.searchKey != '') {
            paramters["companyName"] = this.searchKey;
          }
        }
        this.resetRegistrationNo() ;
        this.getPrintSjdList(paramters)
      },
//      shCallBack(type){
//        if("one"==type){
//          if(this.certificateList.length>1){
//            this.getCertificateList(this.registrationNo)
//          }else {
//            this.resetRegistrationNo();
//            this.search();
//          }
//        }else {
//          this.search();
//
//        }
//      },
      getPrintSjdList(paramters) {
        paramters = paramters == null ? {page: this.page, rows: this.rows, total: 0} : paramters;
        console.log(paramters,'paramters')
        ajaxSyncRequest("get", "back/certificatePrintQuery/getCertificateFsPrintSjdList", paramters, res => {
          if (res.code === 200) {
            this.certificateData = res.rows;
            this.total = res.total;
//            this.certificateTotal = res.map.certificateTotal;
            this.checkAuditDjhListInterim=[];
            //将登记号放入页面变量，用于全选
            for(var i in this.certificateData){
              if(this.certificateData.hasOwnProperty(i)){
                this.checkAuditDjhListInterim.push(this.certificateData[i].registrationNo);
              }
            }
            //去除 checkAuditDjhList 中，已不存在的登记号
            for(var i=this.checkAuditDjhList.length-1;i>=0;i--){
              if($.inArray(this.checkAuditDjhList[i],this.checkAuditDjhListInterim)==-1){
                this.checkAuditDjhList.splice(i,1);
              }
            }

            //默认选中第一个
            if(this.registrationNo != null ){
              this.certificateDataClick(this.registrationNo);
            }else {
              if (this.certificateData.length > 0) {
                this.certificateDataClick(this.certificateData[0].registrationNo);
              }else {
                this.resetCertificateList() ;
              }
            }
          }
        });
      },
      handleSizeChange(size) {
        console.log(size,'size')
        console.log(this.page , this.rows , size,'aaaaaaaaa')
        this.resetRegistrationNo() ;

        this.page = 1;//Math.floor(this.page * this.rows / size);
        if(this.page == 0){
          this.page = 1 ;
        }
        console.log(this.page,'this.page')
        this.rows = size;
        this.search();
      },
      handleCurrentChange(currentPage) {
        this.resetRegistrationNo() ;
        this.page = currentPage;
        this.search();
      },
      //获得已添加证书的列表
      getCertificateList(registrationNo) {
        var flag = false;
        ajaxSyncRequest("get", "back/certificatePrintQuery/getCertificateFsPrintList", {registrationNo:registrationNo}, res => {
          if (res.code === 200) {
            this.certificateList = res.rows;
            this.registrationNo = registrationNo ;
            console.log(this.certificateList);
            //设置证书数量
            this.certificateNumber = res.map.certificateNumber ;
            this.certificateAddCount = res.map.certificateAddCount ;

//            if(this.$refs.certificateAuditPrintDetailMain) {
//              var showId = this.$refs.certificateAuditPrintDetailMain.$refs.certificateAddDetail.getCertificateId();
//              this.certificateId = showId ;
//            }else {
//              if(this.certificateList.length>0){
//                this.certificateId = this.certificateList[0].zsId ;
//                this.chooseCertificate(this.certificateId)
//              }
//            }

            //刷新已添加证书列表
//            this.certificateAddDetailMainReload();
            flag = true ;
          }else {
            this.$message.error("获取证书列表失败");
            flag = false ;
          }
        });
        return flag ;
      },
      resetCertificateList(){
        this.certificateNumber = 0 ;
        this.certificateAddCount = 0 ;
        this.certificateList = [];
        //刷新已添加证书列表
        this.certificatesListReload();
        this.registrationNo = null ;
        this.certificateId = null ;
        this.certificateTempId = null ;
//        this.certificateAddDetailMainReload();
      },
      //登记号行点击事件    登记号，证书数量
      certificateDataClick(registrationNo){
        //获得已添加证书列表
        this.getCertificateList(registrationNo);
        //设置登记号临时变量
        this.registrationNo = registrationNo ;
      },
      //刷新已添加证书列表
      certificatesListReload(){
        this.certificatesListRouter = false
        this.$nextTick(() => (this.certificatesListRouter = true))
      },
      //刷新已添加证书详情页
//      certificateAddDetailMainReload(){
//        this.certificateAddDetailMainRouter = false
//        if(this.registrationNo != null ){
//          this.$nextTick(() => (this.certificateAddDetailMainRouter = true))
//        }
//      },
      //点击证书列表回调
      chooseCertificate(certificateId){
//        this.registrationNo = this.registrationNoTemp ;
//        this.certificateId = certificateId ;
//        this.certificateTempId = null ;
//        this.certificateAddDetailMainReload();
      },
      //隐藏右侧组件
//      hideCertificateAddDetailMain(){
//        this.certificateAddDetailMainRouter = false ;
//      },
      //未审核全选checkbox
      handlecheckAllAuditDjhListChange(val) {
        this.checkAuditDjhList = val ? this.checkAuditDjhListInterim : [];
        this.isIndeterminateAuditDjhList = false;
      },
      //单个报告点击选中
      handleAuditDjhListCheckedChange(value) {
        console.log(value,'value');
        let checkedCount = value.length;
        this.checkAllAuditDjhListList = checkedCount === this.certificateData.length;
        this.isIndeterminateAuditDjhList = checkedCount > 0 && checkedCount < this.certificateData.length;

      },
      //重置点击的登记号
      resetRegistrationNo(){
        this.registrationNo = null
      },
      //批量打印
      batchPrint(backPrint){
        this.batchPrintDjhIndex = 0;
        this.batchPrintZsIndex = 0;
        if (navigator.userAgent.indexOf("CefSharp") == -1 && navigator.userAgent.indexOf("IECsharp") == -1) { //未在容器中
           this.$message.warning("此功能依赖于容器，请在容器中进行操作。");
           return;
         }
        if(this.checkAuditDjhList.length==0){
          this.$message.warning("请先在左侧勾选需要批量打印的登记号！");
          return;
        }
        var flag = this.getCertificateList(this.orderSingleNo);
        if(!flag){
          return ;
        }
        this.$refs.certificateFsdyMain.continuePrint = true ;
        this.batchPrintCallBack(backPrint);
      },
      batchPrintCallBack(backPrint){
        if(this.checkAuditDjhList.length == this.batchPrintDjhIndex){
          this.search();
          this.$message.success("打印成功");
          return;
        }
        //获得当前勾选的第一个登记号
        this.registrationNo = this.checkAuditDjhList[this.batchPrintDjhIndex];
        if(this.certificateList.length == this.batchPrintZsIndex){
          //刷新证书list
          var flag = this.getCertificateList(this.registrationNo);
          if(!flag){
            return ;
          }
        }

        this.$nextTick(() => {
          //判断长度
          //当前登记号是否还有了
          if(this.certificateList.length > this.batchPrintZsIndex){
//            for (var i=0;i<this.certificateList.length ;i++) {
              console.log(this.registrationNo + "打印第"+this.batchPrintZsIndex+"分证书" + this.certificateList[this.batchPrintZsIndex].zsbh);
              this.$refs.certificateFsdyMain.printCertificate(this.certificateList[this.batchPrintZsIndex], backPrint, true);
              this.batchPrintZsIndex ++ ;
//            }
          }
          //没有了，下一份登记号
          else {
            console.log("打印下一个登记号");
            this.batchPrintDjhIndex ++ ;
            this.batchPrintZsIndex = 0  ;
            //刷新左侧
//            this.search();
            //获得选中的登记号
            this.batchPrintCallBack(backPrint);
            //
          }
        })
      },
      stopPrint(){
        this.$refs.certificateFsdyMain.stopPrint();
      },
    },
    filters: {

    },
    created() {

    },
    mounted() {
      this.getPrintSjdList();
      if (navigator.userAgent.indexOf("CefSharp") != -1 || navigator.userAgent.indexOf("IECsharp") != -1) { //在容器中
        //获得打印机列表
        this.printerList = this.getPrinterList();
        //获得默认打印机
        this.printer = this.getDefaultPrinterName();
      }
    }
  };
</script>



<style scoped  lang="scss">

.certArea{
  position: absolute;
  top: 0px;
  bottom:0px;
  left:0px;
  right: 0px;
}
.certLeftMenu{
  width: 270px;
  position: absolute;
  top: 0px;
  bottom:0px;
  left:0px;
  overflow: auto;
  &::-webkit-scrollbar   {
    display: none;
  }
}
.certRightMenu{
  width: 200px;
  position: absolute;
  top: 0px;
  bottom:0px;
  left:270px;
  overflow: auto;
}
.certRightArea{
  left:270px;
  position: absolute;
  top: 0px;
  bottom:0px;
  right: 0px;
  overflow: auto;
}
.ulList{
    position: absolute;
    overflow-y: auto;
    bottom: 34px;
    top: 90px;
    font-size:14px;
}


  .m-b-10 {
    margin-bottom: 10px;
  }

  .m-b-20 {
    margin-bottom: 20px;
  }

  .inline {
    display: inline;
  }

  .m-r-10 {
    margin-right: 661px;
  }

  .m-f-10 {
    margin-left: 10px;
  }

  .m-t-10 {
    margin-top: 10px;
  }

  .m-l-10 {
    margin-left: 10px;
  }

  .m-l-5 {
    margin-left: 5px;
  }

  .font-blod {
    font-weight: bold;
  }
  .btn{
    text-align: center;
    margin: 4% !important;
  }
</style>
