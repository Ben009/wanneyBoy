<template>
  <div class="certArea" ref="certArea-page">
      <div class="certLeftMenu" v-divDrag="{'drag':_ => calcOtherWidth()}" ref="certLeftMenu">
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
                <el-tooltip content="当前需要出具的记录数量" placement="top">
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

          <el-table :data="originalLogData" :show-header="false" ref="originalLogTable" @row-click='originalLogDataClick' :max-height="ZSTableMaxHeight" >
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
          <mind-pagination
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
      <div class="certRightMenu" v-divDrag="{'drag':_ => calcOtherWidth()}" ref="certRightMenu">
        <div style="overflow: auto;border-bottom: 1px dashed #ccc;margin-bottom: 5px;" :style="{height:calcListHeight+'px'}">
          <div class="btn">
            <el-button type="primary" @click="searchDialog">搜索模板</el-button>
          </div>
          <CertificateListTree ref="originalLogListTree" :dataList="treeDataList" :keyId="keyId" :treePid="treePid"
                             :propsKey="propsKey" :currentKey="currentKey" :isLazy="isLazy" :defaultExpandedKeys="0"
                               :leftClickMain="leftClick"  />
        </div>
        <div :style="{height:calcListHeight+'px'}">
          <OriginalLogList v-if="originalLogListRouter" :originalLogList="originalLogList"
                            :originalLogId="originalLogId"
                            :certificateNumber="certificateNumber"
                            :certificateAddCount="certificateAddCount"
                            @leftCilck="chooseOriginalLog" :handleDelete="deleteOriginalLog"
                            @originalLogsListReload="getOriginalLogList"
                            :registrationNo="registrationNoTemp"
                            :showChangeCertificateNumber="true"
          />

        </div>
        <OriginalLogTempSearch v-if="!!searchDialogShow"  :callback="handleCallback"
                                 v-on:checkMb="checkMb"
                                 :checkPower="true"
                                 :applianceName="applianceName"
        ></OriginalLogTempSearch>
      </div>
      <div class="certRightArea" :style="{'width':calcWidth+'px','padding':'0px 5px','z-index':'1'}">
        <OriginalLogAddDetailMain
                                  ref="originalLogAddDetailMain"
                                  v-if="originalLogAddDetailMainRouter"
                                  :originalLogId="originalLogId"
                                  :originalLogTempId="originalLogTempId" :registrationNo="registrationNo"
                                  @originalLogsListReload="getOriginalLogList"
                                  @hideOriginalLogAddDetailMain="hideOriginalLogAddDetailMain"
                                  :showNextCertificate="true"
                                  :getNextOriginalLog="getNextOriginalLog"
                                  :getClickRegistrationNo="getClickRegistrationNo"
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
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../../util/base";
  import CertificateListTree from '../../common/certificateListTree';
  import OriginalLogList from '../../common/originalLogCommon/originalLogList.vue';
  import OriginalLogAddDetailMain from './originalLogAddDetailMain.vue';
  import ElCol from "@/common-el/packages/col/src/col";
  import OriginalLogTempSearch from '../../common/originalLogCommon/originalLogTempSearch.vue';
  import $ from 'jquery';

  export default {
    name: "OriginalLogAdd",
    data() {
      return {
        searchType: "0",
        searchKey: "",
        page: 1,
        rows: 10,
        total: 0,
        originalLogData: [],
        treeDataList:[],
        mlId:"0",
        keyId:"keyMlId",
        keyMlId:"0",
        treePid:"mlIdParentTemp",
        propsKey:{label: 'mlName', children: 'children',isLeaf:'isLeaf'},
        edit:null,
        currentKey:0,
        isLazy:true,
        originalLogList:[],
        originalLogListRouter: true,
        originalLogAddDetailMainRouter: false,
        originalLogId:null,
        certificateNumber : 0 ,
        certificateAddCount : 0 ,
        originalLogTempId : null ,
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
      };
    },
    components: {
      ElCol,CertificateListTree,OriginalLogList,OriginalLogAddDetailMain,OriginalLogTempSearch
    },
    computed:{
      ZSTableMaxHeight(){
        return  this.$store.state.admin.window_innerHeight-227;
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
        ajaxRequest("get", "back/originalLog/getNotAddSjdList", paramters, res => {
          if (res.code === 200) {
            this.originalLogData = res.rows;
              this.total = res.total;
            if (this.originalLogData.length > 0) {
              this.$nextTick(()=>{
                this.$refs.originalLogTable.setCurrentRow(this.originalLogData[0]);
                this.originalLogDataClick(this.originalLogData[0])
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
            this.$message.warning('该模板未通过审核，系统不允许使用此模板！');
            return ;
          }
          if(this.getOriginalLogStatus()){
            this.$message.warning('无可添加的证书');
            return ;
          }
          this.actionType="add";
          this.keyMlId = data.keyMlId ;
          this.mbId = data.mlId ;
          this.currentKey = this.keyMlId;
          //强制刷新组件
//          this.reload();
          this.originalLogTempId = data.mlId ;
          this.registrationNo = this.registrationNoTemp ;
          this.originalLogId = null ;
          this.originalLogAddDetailMainReload();
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
          this.treeDataList = [{"mlName":"记录模板","mlId":"0","keyMlId":"W0","isParent":"-1"}];
          this.$nextTick(()=>{
            //点击第一个文件夹
            this.$refs.originalLogListTree.$refs.tree.$children[0].handleClick();
          })
          return ;
        }
        ajaxSyncRequest('get', 'back/originalLogTemp/'+mlId, null, (res) => {
          if (res.code === 200) {
            this.treeDataList = res.rows;
          }
        });
      },
      //获得已添加证书的列表
      getOriginalLogList(registrationNo) {
        ajaxSyncRequest("get", "back/originalLog/getOriginalLogListBySjd", {registrationNo:registrationNo}, res => {
          if (res.code === 200) {
            this.originalLogList = res.rows;
            console.log(this.originalLogList,'this.originalLogList')
            //设置证书数量
            this.certificateNumber = res.map.certificateNumber ;
            this.certificateAddCount = res.map.certificateAddCount ;

            if(this.$refs.originalLogAddDetailMain) {
              var showId = this.$refs.originalLogAddDetailMain.$refs.originalLogAddDetail.getOriginalLogId();
              this.originalLogId = showId ;
            }

            //刷新已添加证书列表
            this.originalLogListReload();
          }
        });
      },
      //登记号行点击事件    登记号，证书数量
      originalLogDataClick(rowInfo, event, column){
        //获得已添加证书列表
        this.getOriginalLogList(rowInfo.registrationNo);
        //设置登记号临时变量
        this.registrationNoTemp = rowInfo.registrationNo ;
//        this.$nextTick(()=>{
//          Vue.set(this,'registrationNoTemp',rowInfo.registrationNo);
//        })

        //器具名称
        this.applianceName=(rowInfo.applianceActualName == null ? rowInfo.applianceName : rowInfo.applianceActualName);
      },
      //刷新已添加证书列表
      originalLogListReload(){
        this.originalLogListRouter = false
        this.$nextTick(() => (this.originalLogListRouter = true))
      },
      //刷新已添加证书详情页
      originalLogAddDetailMainReload(){
        this.originalLogAddDetailMainRouter = false
        if(this.originalLogId != null || this.originalLogTempId != null){
          this.$nextTick(() => (this.originalLogAddDetailMainRouter = true))
        }
      },
      //点击证书列表回调
      chooseOriginalLog(originalLogId){
        this.actionType="query";
        this.registrationNo = this.registrationNoTemp ;
        this.originalLogId = originalLogId ;
        this.originalLogTempId = null ;
        this.originalLogAddDetailMainReload();
      },
      //删除证书
      deleteOriginalLog(originalLogId){
        ajaxRequest("get", "back/originalLog/delOriginalLogById",
          {
            ysjlId:originalLogId,
            registrationNo:this.registrationNo==null?this.registrationNoTemp:this.registrationNo,
            actionType:"删除",
            actionContent:"证书删除",
          }
          , res => {
          if (res.code === 200) {
            console.log(this.registrationNoTemp,this.registrationNo,'11234')
            //刷新已添加证书列表   temp为左侧点击的，另一个是右侧加载的登记号
            this.getOriginalLogList(this.registrationNoTemp);
            if(this.$refs.originalLogAddDetailMain){
              var showId = this.$refs.originalLogAddDetailMain.$refs.originalLogAddDetail.getOriginalLogId();
              if(showId == originalLogId || showId == null){
                this.originalLogId = null ;
                this.originalLogTempId = null ;
                this.actionType="";
                this.originalLogAddDetailMainReload();
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
          if(this.getOriginalLogStatus()){
            this.$message.warning('无可添加的证书');
            return ;
          }
          this.actionType="add";
          this.originalLogTempId = data.mbId;
          this.registrationNo = this.registrationNoTemp ;
          this.originalLogId = null ;
          this.originalLogAddDetailMainReload();
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
      getOriginalLogStatus(){
        return (this.certificateNumber - this.certificateAddCount ) == 0  ;
      },
      //隐藏右侧组件
      hideOriginalLogAddDetailMain(){
        this.originalLogAddDetailMainRouter = false ;
      },
      //下一份证书（跨登记号）
      getNextOriginalLog(ysjlId){
        this.actionType="next";
        this.registrationNo = this.registrationNoTemp ;
        this.originalLogId = ysjlId ;
//        this.originalLogTempId = null ;
        this.originalLogAddDetailMainReload();
      },
      //获得左侧点击的登记号
      getClickRegistrationNo(){
        return this.registrationNoTemp ;
      },
      calcOtherWidth(){
        this.calcWidth = $(this.$refs['certArea-page']).parents('.tbs_info').width() - ($(this.$refs['certLeftMenu']).width() + $(this.$refs['certRightMenu']).width())
      },
      calcListHeightFun(){
        this.calcListHeight = $(this.$refs['certArea-page']).parents('.tbs_info').height() / 2 - 10
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
//      this.getOriginalLogList();
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
