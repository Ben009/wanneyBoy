<template>
  <div class="certArea">
      <div class="certLeftMenu">
        <!-- 查询的表头 -->
        <div class="topButton">
          <el-form :inline="true">
            <el-col :span="16">
            <el-form-item>
              <el-select v-model="searchType" >
                <el-option value="2" label="流转单号"></el-option>
                <el-option value="1" label="委托单号"></el-option>
                <el-option value="3" label="单位名称"></el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: center;margin-top:10px;">
              <div class="btn">
                <global-tootips style="float:right;margin-top:5px;" :width="200">
                  <p>分单编号后面括号中内容：（证书未打印份数/总份数）</p>
                </global-tootips>
              </div>
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
                      <el-checkbox  :label="scope.row.orderSingleNo"  :key="scope.row.orderSingleNo" @change="certificateDataClick(scope.row.orderSingleNo,scope.row.certificateNumber)" style="width: 100%" >
                        <div :class="{cursor:true,'current-row':orderSingleNo && orderSingleNo == scope.row.orderSingleNo }">
                          <p v-if="scope.row.returnFlag == 1 " style="color: red">{{scope.row.orderSingleNo}}（{{scope.row.zsPrintNoCount}}/{{scope.row.certificateNumber}}）</p>
                          <p v-else="" style="color: blue">{{scope.row.orderSingleNo}}（{{scope.row.zsPrintNoCount}}/{{scope.row.certificateNumber}}）</p>
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
        <CertificateJzdyMain
                                  ref="certificateJzdyMain"
                                  :certificateId="certificateId"
                                  :orderSingleNo="orderSingleNo"
                                  @certificatesListReload="getCertificateList"
                                 :checkAuditDjhList="checkAuditDjhList"
                                 :resetOrderSingleNo="resetOrderSingleNo"
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
  import CertificateJzdyMain from './certificateJzdyMain.vue';
  import ElCol from "@/common-el/packages/col/src/col";
  import CertificatePrint from "@/components/certificate/common/printJs/certificatePrint.js"
  import $ from 'jquery';

  export default {
    name: "CertificateJzdyQuery",
    mixins:[CertificatePrint],
    data() {
      return {
        searchType: "2",
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
        orderSingleNo : null ,
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
      ElCol,CertificatesList,CertificateJzdyMain,

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
            paramters["orderSingleNo"] = this.searchKey;
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
        this.resetOrderSingleNo() ;
        this.getPrintSjdList(paramters)
      },
      getPrintSjdList(paramters) {
        paramters = paramters == null ? {page: this.page, rows: this.rows, total: 0} : paramters;
        console.log(paramters,'paramters')
        ajaxSyncRequest("get", "back/certificatePrintQuery/getCertificateJzPrintSjdList", paramters, res => {
          if (res.code === 200) {
            this.certificateData = res.rows;
            this.total = res.total;
//            this.certificateTotal = res.map.certificateTotal;
            this.checkAuditDjhListInterim=[];
            //将流转单号放入页面变量，用于全选
            for(var i in this.certificateData){
              if(this.certificateData.hasOwnProperty(i)){
                this.checkAuditDjhListInterim.push(this.certificateData[i].orderSingleNo);
              }
            }
            //去除 checkAuditDjhList 中，已不存在的流转单号
            for(var i=this.checkAuditDjhList.length-1;i>=0;i--){
              if($.inArray(this.checkAuditDjhList[i],this.checkAuditDjhListInterim)==-1){
                this.checkAuditDjhList.splice(i,1);
              }
            }

            //默认选中第一个
            if(this.orderSingleNo != null ){
              this.certificateDataClick(this.orderSingleNo);
            }else {
              if (this.certificateData.length > 0) {
                this.certificateDataClick(this.certificateData[0].orderSingleNo);
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
        this.resetOrderSingleNo() ;

        this.page = 1;//Math.floor(this.page * this.rows / size);
        if(this.page == 0){
          this.page = 1 ;
        }
        console.log(this.page,'this.page')
        this.rows = size;
        this.search();
      },
      handleCurrentChange(currentPage) {
        this.resetOrderSingleNo() ;
        this.page = currentPage;
        this.search();
      },
      //获得已添加证书的列表
      getCertificateList(orderSingleNo) {
        var flag = false;
        ajaxSyncRequest("get", "back/certificatePrintQuery/getCertificateJzPrintList", {orderSingleNo:orderSingleNo}, res => {
          if (res.code === 200) {
            this.certificateList = res.rows;
            this.orderSingleNo = orderSingleNo ;
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
        this.orderSingleNo = null ;
        this.certificateId = null ;
        this.certificateTempId = null ;
//        this.certificateAddDetailMainReload();
      },
      //流转单号行点击事件    流转单号，证书数量
      certificateDataClick(orderSingleNo){
        //获得已添加证书列表
        this.getCertificateList(orderSingleNo);
        //设置流转单号临时变量
        this.orderSingleNo = orderSingleNo ;
      },
      //刷新已添加证书列表
      certificatesListReload(){
        this.certificatesListRouter = false
        this.$nextTick(() => (this.certificatesListRouter = true))
      },
      //点击证书列表回调
      chooseCertificate(certificateId){
      },
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
      //重置点击的流转单号
      resetOrderSingleNo(){
        this.orderSingleNo = null
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
          this.$message.warning("请先在左侧勾选需要批量打印的流转单号！");
          return;
        }
        var flag = this.getCertificateList(this.orderSingleNo);
        if(!flag){
          return ;
        }
        this.$refs.certificateJzdyMain.continuePrint = true ;
        this.batchPrintCallBack(backPrint);
      },
      batchPrintCallBack(backPrint){
        if(this.checkAuditDjhList.length == this.batchPrintDjhIndex){
          this.search();
          this.$message.success("打印成功");
          return;
        }
        //获得当前勾选的第一个流转单号
        this.orderSingleNo = this.checkAuditDjhList[this.batchPrintDjhIndex];
        if(this.certificateList.length == this.batchPrintZsIndex){
          //刷新证书list
          var flag = this.getCertificateList(this.orderSingleNo);
          if(!flag){
            return ;
          }
        }

        this.$nextTick(() => {
          //判断长度
          //当前流转单号是否还有了
          if(this.certificateList.length > this.batchPrintZsIndex){
//            for (var i=0;i<this.certificateList.length ;i++) {
              console.log(this.orderSingleNo + "打印第"+this.batchPrintZsIndex+"分证书" + this.certificateList[this.batchPrintZsIndex].zsbh);
              this.$refs.certificateJzdyMain.printCertificate(this.certificateList[this.batchPrintZsIndex], backPrint, true);
              this.batchPrintZsIndex ++ ;
//            }
          }
          //没有了，下一份流转单号
          else {
            console.log("打印下一个流转单号");
            this.batchPrintDjhIndex ++ ;
            this.batchPrintZsIndex = 0  ;
            //刷新左侧
//            this.search();
            //获得选中的流转单号
            this.batchPrintCallBack(backPrint);
            //
          }
        })
      },
      stopPrint(){
        this.$refs.certificateJzdyMain.stopPrint();
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
    /*margin: 4% !important;*/
  }
</style>
