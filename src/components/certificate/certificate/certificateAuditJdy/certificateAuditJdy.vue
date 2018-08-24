<template>
  <div class="certArea" ref="certArea-page" :style="{height:innerHeight+'px'}">
      <div class="certLeftMenu cerCommonStyle" v-divDrag="{'drag':_ => calcOtherWidth()}" ref="certLeftMenu">
        <!-- 查询的表头 -->
        <div class="topButton">
          <el-form :inline="true">
            <el-col :span="16">
            <el-form-item>
              <el-select v-model="searchType" class="setMinLine">
                <el-option value="0" label="登记号"></el-option>
                <el-option value="1" label="委托单号"></el-option>
                <el-option value="2" label="流转单号"></el-option>
                <el-option value="3" label="单位名称"></el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="6" style="margin-top:14px;">
              <template>
                <span>
                    {{certificateTotal}}
                  </span>
                <el-tooltip content="当前需要检定的证书数量" placement="top">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
            </el-col>
            <el-col :span="16">
            <el-form-item class="setMinLine">
              <el-col :span="4">
                <el-checkbox :indeterminate="isIndeterminateAuditDjhList"
                             v-model="checkAllAuditDjhListList"
                             @change="handlecheckAllAuditDjhListChange" >
                </el-checkbox>
              </el-col>
              <el-col :span="20">
              <el-input clearable v-model="searchKey" ></el-input>
              </el-col>
            </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item class="setMinLine">

              <el-button type="primary" size="mini" @click="searchInit">查询</el-button>
            </el-form-item>
            </el-col>
          </el-form>
        </div>
              <!-- 列表 -->
        <el-checkbox-group v-model="checkAuditDjhList" @change="handleAuditDjhListCheckedChange">
              <el-table :data="certificateData" style="overflow: auto;" :show-header="false" ref="certificateTable" :max-height="ZSTableMaxHeight" >
                  <el-table-column align='left'>
                    <template slot-scope="scope" align="left">
                      <el-checkbox  :label="scope.row.registrationNo"  :key="scope.row.registrationNo" @change="certificateDataClick(scope.row.registrationNo,scope.row.certificateNumber)"  style="width: 100%" class="checkClass">
                        <div :class="{cursor:true,'current-row':registrationNoTemp && registrationNoTemp == scope.row.registrationNo }">
                          <p v-if="scope.row.returnFlag == 1 " style="color: red">{{scope.row.registrationNo}}</p>
                          <p v-else="" style="color: blue">{{scope.row.registrationNo}}</p>
                          <p style="font-weight: bold;color:#606266!important">{{scope.row.applianceActualName == null ? scope.row.applianceName : scope.row.applianceActualName}}</p>
                          <p style="color:#606266!important">{{scope.row.companyName }}</p>
                        </div>
                      </el-checkbox>
                    </template>
                  </el-table-column>
              </el-table>
        </el-checkbox-group>

                <!--<li  v-for="val in certificateData"-->
                    <!--style="border-bottom:1px grey solid;cursor:pointer;margin-bottom:10px;">-->
                  <!--<el-checkbox  :label="val.registrationNo"  :key="val.registrationNo" @change="certificateDataClick(val.registrationNo,val.certificateNumber)" >-->
                    <!--<div>{{val.registrationNo}}</div>-->
                    <!--<div>{{val.applianceActualName == null ? val.applianceName : val.applianceActualName}}</div>-->
                    <!--<div>{{val.companyName}}</div>-->
                  <!--</el-checkbox>-->
                <!--</li>-->

            <!-- 翻页 -->
            <!--<el-pagination style=" position: absolute; bottom:0px;"-->
              <!--@size-change="handleSizeChange"-->
              <!--@current-change="handleCurrentChange"-->
              <!--:current-page="page"-->
              <!--:page-size="rows"-->
              <!--layout=" total,sizes, prev, next, jumper" prev-text="上一页" next-text="下一页"-->
              <!--:total="total"-->
            <!--&gt;-->
            <!--</el-pagination>-->
        <mind-pagination
          v-if="delay"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          layout="prev,next,sizes,countpage,total"
          :page-size="rows"
          :total="total"
          style="margin-top:10px;margin-bottom:0px!important;"
        >
        </mind-pagination>
        <!--<mind-pagination style=" position: absolute; bottom:0px;"-->
          <!--@size-change="handleSizeChange"-->
          <!--@current-change="handleCurrentChange"-->
          <!--:current-page="page"-->
          <!--:page-size="rows"-->
          <!--:total="total"-->
        <!--&gt;-->
        <!--</mind-pagination>-->
      </div>
      <div class="certRightMenu cerCommonStyle" v-divDrag="{'drag':_ => calcOtherWidth()}" ref="certRightMenu">
        <!--<div style="height: 50%;overflow: auto;">-->
          <!--<div class="btn">-->
            <!--<el-button type="primary" @click="searchDialog">搜索模板</el-button>-->
          <!--</div>-->
          <!--<CertificateListTree ref="certificateListTree" :dataList="treeDataList" :keyId="keyId" :treePid="treePid"-->
                             <!--:propsKey="propsKey" :currentKey="currentKey" :isLazy="isLazy" :defaultExpandedKeys="0"-->
                               <!--:leftClickMain="leftClick"  />-->
        <!--</div>-->
        <div>
          <CertificatesList v-if="certificatesListRouter" :certificateList="certificateList"
                            :certificateId="certificateId"
                            :certificateNumber="certificateNumber"
                            :certificateAddCount="certificateAddCount"
                            @leftCilck="chooseCertificate"
          />

        </div>
        <!--<certificate-temp-search v-if="!!searchDialogShow"  :callback="handleCallback"  v-on:checkMb="checkMb"></certificate-temp-search>-->
      </div>
      <div class="certRightArea" :style="{'width':calcWidth+'px','padding':'0px 5px','z-index':'1'}">
        <CertificateAuditJdyDetailMain
                                  ref="certificateAuditJdyDetailMain"
                                  v-if="certificateAddDetailMainRouter" :certificateId="certificateId"
                                  :registrationNo="registrationNo"
                                  @certificatesListReload="getCertificateList"
                                  @hideCertificateAddDetailMain="hideCertificateAddDetailMain"
                                  :shCallBack="shCallBack"
                                 :checkAuditDjhList="checkAuditDjhList"
                                 :resetRegistrationNoTemp="resetRegistrationNoTemp"
                                 :actionType="actionType"
                                  :canChangeBzqZSInfo="canChangeBzqZSInfo"
                                  :canEditYjBzBzqInfo="canEditYjBzBzqInfo"
                                  :canChooseHistoryByQjmc="canChooseHistoryByQjmc"
        />
      </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import Vuex from "vuex";
//  import {
//    Button,
//    Table,
//    TableColumn,
//    Row,
//    Col,
//    Radio,
//    RadioGroup
//  } from "element-ui";
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../../util/base";
  import CertificatesList from '../../common/certificateCommon/certificatesList.vue';
  import CertificateAuditJdyDetailMain from './certificateAuditJdyDetailMain.vue';
  import ElCol from "@/common-el/packages/col/src/col";
  import $ from 'jquery';

//  Vue.use(Button);
//  Vue.use(Table);
//  Vue.use(TableColumn);
//  Vue.use(Row);
//  Vue.use(Col);
//  Vue.use(Radio);
//  Vue.use(RadioGroup);
  export default {
    name: "CertificateAuditJdy",
    data() {
      return {
        searchType: "0",
        searchKey: "",
        page: 1,
        rows: 10,
        total: 0,
        certificateData: [],
//        treeDataList:[],
//        mlId:"0",
//        keyId:"keyMlId",
//        keyMlId:"0",
//        treePid:"mlIdParentTemp",
//        propsKey:{label: 'mlName', children: 'children',isLeaf:'isLeaf'},
        edit:null,
        currentKey:0,
//        isLazy:true,
        certificateList:[],
        certificatesListRouter: true,
        certificateAddDetailMainRouter: false,
        certificateId:null,
        certificateNumber : 0 ,
        certificateAddCount : 0 ,
        certificateTempId : null ,
        registrationNo : null ,
        registrationNoTemp : null,
        // checkbox 的不确定状态
        isIndeterminateAuditDjhList:false,
        //选中状态
        checkAllAuditDjhListList: false,
        //选中的
        checkAuditDjhList:[],
        //用于全选的
        checkAuditDjhListInterim:[],
//        searchDialogShow: false,
        queryType:"jdy",//检定还是核验
        actionType:"query",
        certificateTotal:0,
        //是否可修改标准器证书
        canChangeBzqZSInfo:true,
        //技术依据、标准、仪器可编辑内容
        canEditYjBzBzqInfo:true,
        //可根据器具名称查询开始数据
        canChooseHistoryByQjmc:true,
        calcWidth:'',
        delay:true,
      };
    },
    components: {
      ElCol,CertificatesList,CertificateAuditJdyDetailMain,

    },
    computed:{
      ZSTableMaxHeight(){
        return  this.$store.state.admin.window_innerHeight-126;
      },
    },
    watch:{
      innerWidth(v){
        this.calcOtherWidth();
      }
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
          type:this.queryType
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
        this.resetRegistrationNoTemp() ;
        this.getJdySjdList(paramters)
      },
      shCallBack(type){
        if("one"==type){
          if(this.certificateList.length>1){
            this.getCertificateList(this.registrationNoTemp)
          }else {
            this.resetRegistrationNoTemp();
            this.search();
          }
        }else {
          this.search();

        }
      },
      getJdySjdList(paramters) {
        paramters = paramters == null ? {page: this.page, rows: this.rows, total: 0,type:this.queryType} : paramters;
        console.log(paramters,'paramters')
        ajaxRequest("get", "back/certificate/getJdHySjdList", paramters, res => {
          if (res.code === 200) {
            this.certificateData = res.rows;
            this.total = res.total;
            this.certificateTotal = res.map.certificateTotal;
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
            if(this.registrationNoTemp != null ){
              this.certificateDataClick(this.registrationNoTemp);
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
        this.resetRegistrationNoTemp() ;

        this.page = 1;//Math.floor(this.page * this.rows / size);
        if(this.page == 0){
          this.page = 1 ;
        }
        console.log(this.page,'this.page')
        this.rows = size;
        this.search();
      },
      handleCurrentChange(currentPage) {
        this.resetRegistrationNoTemp() ;
        this.page = currentPage;
        this.search();
      },
      //获得已添加证书的列表
      getCertificateList(registrationNo) {
        ajaxSyncRequest("get", "back/certificate/getJdHyCertificateList", {registrationNo:registrationNo,type:this.queryType}, res => {
          if (res.code === 200) {
            this.certificateList = res.rows;
            console.log(this.certificateList);
            //设置证书数量
            this.certificateNumber = res.map.certificateNumber ;
            this.certificateAddCount = res.map.certificateAddCount ;

//            if(this.$refs.certificateAuditJdyDetailMain) {
//              var showId = this.$refs.certificateAuditJdyDetailMain.$refs.certificateAddDetail.getCertificateId();
//              this.certificateId = showId ;
//            }else {
              if(this.certificateList.length>0){
                this.certificateId = this.certificateList[0].zsId ;
                this.chooseCertificate(this.certificateId)
              }
//            }

            //刷新已添加证书列表
            this.certificatesListReload();
          }
        });
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
        this.certificateAddDetailMainReload();
      },
      //登记号行点击事件    登记号，证书数量
      certificateDataClick(registrationNo){
        //获得已添加证书列表
        this.getCertificateList(registrationNo);
        //设置登记号临时变量
        this.registrationNoTemp = registrationNo ;
      },
      //刷新已添加证书列表
      certificatesListReload(){
        this.certificatesListRouter = false
        this.$nextTick(() => (this.certificatesListRouter = true))
      },
      //刷新已添加证书详情页
      certificateAddDetailMainReload(){
        this.certificateAddDetailMainRouter = false
        if(this.certificateId != null || this.certificateTempId != null){
          this.$nextTick(() => (this.certificateAddDetailMainRouter = true))
        }
      },
      //点击证书列表回调
      chooseCertificate(certificateId){
        this.registrationNo = this.registrationNoTemp ;
        this.certificateId = certificateId ;
        this.certificateTempId = null ;
        this.certificateAddDetailMainReload();
      },
      //删除证书
//      deleteCertificate(certificateId){
//        ajaxRequest("get", "back/certificate/delCertificateById", {zsId:certificateId,registrationNo:this.registrationNo==null?this.registrationNoTemp:this.registrationNo}, res => {
//          if (res.code === 200) {
//            this.certificateId = null ;
//            this.certificateTempId = null ;
//            console.log(this.registrationNoTemp,this.registrationNo,'11234')
//            //刷新已添加证书列表   temp为左侧点击的，另一个是右侧加载的登记号
//            this.getCertificateList(this.registrationNo==null?this.registrationNoTemp:this.registrationNo)
//            this.certificateAddDetailMainReload();
//          }
//        });
//
//      },
      //搜索模版回调
//      checkMb(data){
//        if(data){
//          this.certificateTempId = data;
//          this.registrationNo = this.registrationNoTemp ;
//          this.certificateId = null ;
//          this.certificateAddDetailMainReload();
//        }
//      },
      //显示弹出层
//      searchDialog() {
//        this.searchDialogShow = true;
//      },
//      //隐掉弹出层
//      handleCallback(){
//          this.searchDialogShow = false;
//      },
      //获得当前添加证书的状态  是否已添加完
//      getCertificateStatus(){
//        console.log(this.certificateList,this.certificateNumber,this.certificateAddCount,'aaaaaaaaa')
//        return (this.certificateNumber - this.certificateAddCount) == 0  ;
//      },
      //隐藏右侧组件
      hideCertificateAddDetailMain(){
        this.certificateAddDetailMainRouter = false ;
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
      calcOtherWidth(){
        this.calcWidth = this.$store.state.admin.window_innerWidth - ($(this.$refs['certLeftMenu']).width() + $(this.$refs['certRightMenu']).width())
      },
      //重置点击的登记号
      resetRegistrationNoTemp(){
        this.registrationNoTemp = null
      }
    },
    filters: {

    },
    created() {
//      this.getTreeDataList();

    },
    mounted() {
      this.getJdySjdList();
      this.calcOtherWidth();
      this.delay = false;
      setTimeout(val => {
        this.delay = true;
      },1000)
//      this.getCertificateList();
    }
  };
</script>

<style lang="scss">
  .setMinLine{
    .el-form-item__content{
      line-height:35px!important;
    }
  }
  .checkClass{
    .el-checkbox__label{
      width:calc(100% - 30px);
    }
  }
</style>

<style scoped  lang="scss">
.setMinLine {
  margin-bottom: 0px!important;
}
.certArea{
  // position: absolute;
  display:flex;
  top: 0px;
  bottom:0px;
  left:0px;
  right: 0px;
}
.certLeftMenu{
  width: 270px;
  // position: absolute;
  top: 0px;
  bottom:0px;
  left:0px;
  overflow: auto;
  &::-webkit-scrollbar   {
    display: none;
  }
}
.certRightMenu{
  width: 140px;
  // position: absolute;
  top: 0px;
  bottom:0px;
  left:270px;
  overflow: auto;
  padding: 0px 5px;
  width:140px;
}
.certRightArea{
  left:470px;
  // position: absolute;
  width:calc(100% - 470px);
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
