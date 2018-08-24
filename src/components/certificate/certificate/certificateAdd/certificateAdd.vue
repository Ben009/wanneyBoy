<template>
  <div class="certArea" ref="certArea-page" :style="{height:innerHeight+'px'}">
      <div class="certLeftMenu cerCommonStyle" v-divDrag="{'drag':_ => calcOtherWidth()}" ref="certLeftMenu">
        <!-- 查询的表头 -->
        <div class="topButton">
          <el-form :inline="true">
            <el-col :span="16">
              <el-form-item class="setMinLine">
                <el-select v-model="searchType" >
                  <el-option value="0" label="登记号"></el-option>
                  <el-option value="1" label="委托单号"></el-option>
                  <el-option value="2" label="流转单号"></el-option>
                  <el-option value="3" label="单位名称"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="text-align: center;margin-top:8px;">
              <template>
                <span>
                    {{certificateTotal}}
                  </span>
                <el-tooltip content="当前需要出具的证书数量" placement="top">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
            </el-col>
            <el-col :span="16">
              <el-form-item class="setMinLine">
                <el-input clearable v-model="searchKey" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="setMinLine">
                <el-button type="primary" size="mini" @click="searchInit">查询</el-button>
              </el-form-item>
            </el-col>
            </el-form>
        </div>
        <el-col :span="24">
          <!--<ul class="ulList">-->
            <!--&lt;!&ndash; 列表 &ndash;&gt;-->
            <!--<li @click="certificateDataClick(val.registrationNo,val.certificateNumber,(val.applianceActualName == null ? val.applianceName : val.applianceActualName))" v-for="val in certificateData"-->
                <!--style="border-bottom:1px grey solid;cursor:pointer;margin-bottom:10px;">-->
              <!--<div>{{val.registrationNo}}</div>-->
              <!--<div>{{val.applianceActualName == null ? val.applianceName : val.applianceActualName}}</div>-->
              <!--<div>{{val.companyName}}</div>-->
            <!--</li>-->
          <!--</ul>-->

          <el-table :data="certificateData" :show-header="false" ref="certificateTable" @row-click='certificateDataClick' :max-height="ZSTableMaxHeight" >
            <el-table-column align='left'>
              <template slot-scope="scope" align="left">
                <div :class="{cursor:true,'current-row':registrationNoTemp && registrationNoTemp == scope.row.registrationNo }">
                  <p v-if="scope.row.returnFlag == 1 " style="color: red">{{scope.row.registrationNo}}</p>
                  <p v-else style="color: blue">{{scope.row.registrationNo}}</p>
                  <p style="font-weight: bold">{{scope.row.applianceActualName == null ? scope.row.applianceName : scope.row.applianceActualName}}</p>
                  <p>{{scope.row.companyName }}</p>
                </div>
              </template>
            </el-table-column>
          </el-table>

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
        <!--<mind-pagination style=" position: absolute; bottom:0px;"-->
          <!--layout="total,sizes,prev,next"-->
          <!--@size-change="handleSizeChange"-->
          <!--@current-change="handleCurrentChange"-->
          <!--:current-page="page"-->
          <!--:page-size="rows"-->
          <!--:total="total"-->
        <!--&gt;-->
        <!--</mind-pagination>-->

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
        </el-col>
      </div>
      <div class="certRightMenu cerCommonStyle" v-divDrag="{'drag':_ => calcOtherWidth()}" ref="certRightMenu">
        <div style="overflow: auto;border-bottom: 1px dashed #ccc;margin-bottom: 5px;" :style="{height:calcListHeight+'px'}">
          <div class="btn">
            <el-button type="primary" @click="searchDialog">搜索模板</el-button>
          </div>
          <CertificateListTree ref="certificateListTree" :dataList="treeDataList" :keyId="keyId" :treePid="treePid"
                             :propsKey="propsKey" :currentKey="currentKey" :isLazy="isLazy" :defaultExpandedKeys="0"
                               :leftClickMain="leftClick"  />
        </div>
        <div :style="{height:calcListHeight+'px'}">
          <CertificatesList v-if="certificatesListRouter" :certificateList="certificateList"
                            :certificateId="certificateId"
                            :certificateNumber="certificateNumber"
                            :certificateAddCount="certificateAddCount"
                            @leftCilck="chooseCertificate" :handleDelete="deleteCertificate"
                            @certificatesListReload="getCertificateList"
                            :registrationNo="registrationNoTemp"
                            :showChangeCertificateNumber="true"
          />

        </div>
        <certificate-temp-search v-if="!!searchDialogShow"  :callback="handleCallback"
                                 v-on:checkMb="checkMb"
                                 :checkPower="true"
                                 :applianceName="applianceName"
        ></certificate-temp-search>
      </div>
      <div class="certRightArea" :style="{'width':calcWidth+'px','padding':'0px 5px','z-index':'1'}">
        <CertificateAddDetailMain
                                  ref="certificateAddDetailMain"
                                  v-if="certificateAddDetailMainRouter"
                                  :certificateId="certificateId"
                                  :certificateTempId="certificateTempId" :registrationNo="registrationNo"
                                  @certificatesListReload="getCertificateList"
                                  @hideCertificateAddDetailMain="hideCertificateAddDetailMain"
                                  :getNextCertificate="getNextCertificate"
                                  :getClickRegistrationNo="getClickRegistrationNo"
                                  :actionType="actionType"
                                  :showNextCertificate="true"
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
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../../util/base";
  import CertificateListTree from '../../common/certificateListTree';
  import CertificatesList from '../../common/certificateCommon/certificatesList.vue';
  import CertificateAddDetailMain from './certificateAddDetailMain.vue';
  import ElCol from "@/common-el/packages/col/src/col";
  import certificateTempSearch from '../../common/certificateCommon/certificateTempSearch';
  import $ from 'jquery';
/*   import {
    Button,
    Table,
    TableColumn,
    Row,
    Col,
    Radio,
    RadioGroup
  } from "element--ui";
  Vue.use(Button);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Radio);
  Vue.use(RadioGroup);
 */

  export default {
    name: "CertificateAdd",
    data() {
      return {
        searchType: "0",
        searchKey: "",
        page: 1,
        rows: 10,
        total: 0,
        certificateData: [],
        treeDataList:[],
        mlId:"0",
        keyId:"keyMlId",
        keyMlId:"0",
        treePid:"mlIdParentTemp",
        propsKey:{label: 'mlName', children: 'children',isLeaf:'isLeaf'},
        edit:null,
        currentKey:0,
        isLazy:true,
        certificateList:[],
        certificatesListRouter: true,
        certificateAddDetailMainRouter: false,
        certificateId:null,
        certificateNumber : 0 ,
        certificateAddCount : 0 ,
        certificateTempId : null ,
        registrationNo : null ,
        registrationNoTemp : null,
        searchDialogShow: false,
        certificateTotal:0,
        actionType:"",
        //是否可修改标准器证书
        canChangeBzqZSInfo:true,
        //技术依据、标准、仪器可编辑内容
        canEditYjBzBzqInfo:true,
        //可根据器具名称查询开始数据
        canChooseHistoryByQjmc:true,
        computedRefs:false,
        calcWidth:'',
        calcListHeight:'',
        delay:true,
      };
    },
    components: {
      ElCol,CertificateListTree,CertificatesList,CertificateAddDetailMain,certificateTempSearch
    },
    computed:{
      ZSTableMaxHeight(){
        return  this.$store.state.admin.window_innerHeight-127;
      },
      width(){
        if(!computedRefs){
          console.log(this.$refs)
          return this.$refs['certRightMenu'].clientWidth
        }
      },
    },
    watch:{
      innerWidth(v){
        this.calcOtherWidth();
        this.calcListHeightFun();
      },
      innerHeight(){
        this.calcListHeightFun();
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
          total: 0
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
        this.getNotAddSjdList(paramters)
      },
      getNotAddSjdList(paramters) {
        paramters = paramters == null ? {page: this.page, rows: this.rows, total: 0} : paramters;
        console.log(paramters,'paramters')
        ajaxRequest("get", "back/certificate/getNotAddSjdList", paramters, res => {
          if (res.code === 200) {
            this.certificateData = res.rows;
              this.total = res.total;
            if (this.certificateData.length > 0) {
              this.$nextTick(()=>{
                this.$refs.certificateTable.setCurrentRow(this.certificateData[0]);
                this.certificateDataClick(this.certificateData[0])
              })
              }
            this.certificateTotal = res.map.certificateTotal;
          }
        });
      },
      handleSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.search();
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage;
        this.search();
      },
      leftClick(data ){
        //判断是否模板
        if(data.isLeaf){
          if(!this.registrationNoTemp){
            this.$message.warning('请选择登记号');
            return ;
          }
          if(data.auditFlag<3){
            let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限

            if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
              btnPower = "@@";
            }
            //按钮_证书添加时可使用未审核模板
            if(btnPower.indexOf("@M27107@") == -1){
              this.$message.warning('该模板未通过审核，系统不允许使用此模板！');
              return ;
            }
          }
          if(this.getCertificateStatus()){
            this.$message.warning('无可添加的证书');
            return ;
          }
          this.actionType="add";
          this.keyMlId = data.keyMlId ;
          this.mbId = data.mlId ;
          this.currentKey = this.keyMlId;
          //强制刷新组件
//          this.reload();
          this.certificateTempId = data.mlId ;
          this.registrationNo = this.registrationNoTemp ;
          this.certificateId = null ;
          this.certificateAddDetailMainReload();
        }else {
          this.mlId = data.mlId ;
          this.getTreeDataList(this.mlId);

        }
      },
      //从后台获得数据
      getTreeDataList(mlId) {
        //重命名进来的
        if(mlId){
        }
        //第一次进来的
        else {
          mlId = 0 ;
          this.treeDataList = [{"mlName":"证书模板","mlId":"0","keyMlId":"W0","isParent":"-1"}];
          this.$nextTick(()=>{
            //点击第一个文件夹
            this.$refs.certificateListTree.$refs.tree.$children[0].handleClick();
          })
          return ;
        }
        ajaxSyncRequest('get', 'back/certificateTemp/'+mlId, null, (res) => {
          if (res.code === 200) {
            this.treeDataList = res.rows;
          }
        });
      },
      //获得已添加证书的列表
      getCertificateList(registrationNo) {
        ajaxSyncRequest("get", "back/certificate/getCertificateListBySjd", {registrationNo:registrationNo}, res => {
          if (res.code === 200) {
            this.certificateList = res.rows;
            console.log(this.certificateList,'this.certificateList')
            //设置证书数量
            this.certificateNumber = res.map.certificateNumber ;
            this.certificateAddCount = res.map.certificateAddCount ;

            if(this.$refs.certificateAddDetailMain) {
              var showId = this.$refs.certificateAddDetailMain.$refs.certificateAddDetail.getCertificateId();
              this.certificateId = showId ;
            }

            //刷新已添加证书列表
            this.certificatesListReload();
          }
        });
      },
      //登记号行点击事件    登记号，证书数量
      certificateDataClick(rowInfo, event, column){
        //获得已添加证书列表
        this.getCertificateList(rowInfo.registrationNo);
        //设置登记号临时变量
        this.registrationNoTemp = rowInfo.registrationNo ;
//        this.$nextTick(()=>{
//          Vue.set(this,'registrationNoTemp',rowInfo.registrationNo);
//        })

        //器具名称
        this.applianceName=(rowInfo.applianceActualName == null ? rowInfo.applianceName : rowInfo.applianceActualName);
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
        this.actionType="query";
        this.registrationNo = this.registrationNoTemp ;
        this.certificateId = certificateId ;
        this.certificateTempId = null ;
        this.certificateAddDetailMainReload();
      },
      //删除证书
      deleteCertificate(certificateId){
        ajaxRequest("get", "back/certificate/delCertificateById",
          {
            zsId:certificateId,
            registrationNo:this.registrationNo==null?this.registrationNoTemp:this.registrationNo,
            actionType:"删除",
            actionContent:"证书删除",
          }
          , res => {
          if (res.code === 200) {
            console.log(this.registrationNoTemp,this.registrationNo,'11234')
            //刷新已添加证书列表   temp为左侧点击的，另一个是右侧加载的登记号
            this.getCertificateList(this.registrationNoTemp);
            if(this.$refs.certificateAddDetailMain){
              var showId = this.$refs.certificateAddDetailMain.$refs.certificateAddDetail.getCertificateId();
              if(showId == certificateId || showId == null){
                this.certificateId = null ;
                this.certificateTempId = null ;
                this.actionType="";
                this.certificateAddDetailMainReload();
              }
            }
          }
        });

      },
      //搜索模版回调
      checkMb(data){
        if(!this.registrationNoTemp){
          this.$message.warning('请选择登记号');
          return ;
        }

        if(data.mbId){
          if(data.auditFlag<3){
            let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限

            if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
              btnPower = "@@";
            }
            //按钮_证书添加时可使用未审核模板
            if(btnPower.indexOf("@M27107@") == -1){
              this.$message.warning('该模板未通过审核，系统不允许使用此模板！');
              return ;
            }
          }
          if(this.getCertificateStatus()){
            this.$message.warning('无可添加的证书');
            return ;
          }
          this.actionType="add";
          this.certificateTempId = data.mbId;
          this.registrationNo = this.registrationNoTemp ;
          this.certificateId = null ;
          this.certificateAddDetailMainReload();
        }
      },
      //显示弹出层
      searchDialog() {
        this.searchDialogShow = true;
      },
      //隐掉弹出层
      handleCallback(){
          this.searchDialogShow = false;
      },
      //获得当前添加证书的状态  是否已添加完
      getCertificateStatus(){
        return (this.certificateNumber - this.certificateAddCount ) == 0  ;
      },
      //隐藏右侧组件
      hideCertificateAddDetailMain(){
        this.certificateAddDetailMainRouter = false ;
      },
      //下一份证书（跨登记号）
      getNextCertificate(zsId){
        this.actionType="next";
        this.registrationNo = this.registrationNoTemp ;
        this.certificateId = zsId ;
//        this.certificateTempId = null ;
        this.certificateAddDetailMainReload();
      },
      //获得左侧点击的登记号
      getClickRegistrationNo(){
        return this.registrationNoTemp ;
      },
      calcOtherWidth(){
        this.calcWidth = this.$store.state.admin.window_innerWidth - ($(this.$refs['certLeftMenu']).width() + $(this.$refs['certRightMenu']).width())
      },
      calcListHeightFun(){
        this.calcListHeight = this.$store.state.admin.window_innerHeight / 2 - 9
      },
      //重置点击的登记号
      resetRegistrationNoTemp(){
        this.registrationNoTemp = null
      }
    },
    filters: {

    },
    created() {
      this.getTreeDataList();

    },
    mounted() {
      this.getNotAddSjdList();
      this.calcListHeightFun();
      this.computedRefs = true;
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
</style>
<style scoped  lang="scss">

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
  width: 200px;
  // position: absolute;
  top: 0px;
  bottom:0px;
  left:270px;
  overflow: auto;
  padding: 0px 5px;
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
.current-row{
  background-color: #f0f9eb;
}
</style>
