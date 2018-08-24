<template>
  <div class="certArea" ref="certArea-page">
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
                <el-tooltip content="当前需要检定的记录数量" placement="top">
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
              <el-table :data="originalLogData" style="overflow: auto;" :show-header="false" ref="originalLogTable" :max-height="ZSTableMaxHeight" >
                  <el-table-column align='left'>
                    <template slot-scope="scope" align="left">
                      <el-checkbox  :label="scope.row.registrationNo"  :key="scope.row.registrationNo" @change="originalLogDataClick(scope.row.registrationNo,scope.row.certificateNumber)"  style="width: 100%" class="checkClass">
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
      </div>
      <div class="certRightMenu cerCommonStyle" v-divDrag="{'drag':_ => calcOtherWidth()}" ref="certRightMenu">
        <div>
          <OriginalLogList v-if="originalLogListRouter" :originalLogList="originalLogList"
                            :originalLogId="originalLogId"
                            :certificateNumber="certificateNumber"
                            :certificateAddCount="certificateAddCount"
                            @leftCilck="chooseOriginalLog"
          />

        </div>
      </div>
      <div class="certRightArea" :style="{'width':calcWidth+'px','padding':'0px 5px','z-index':'1'}">
        <OriginalLogAuditJdyDetailMain
                                  ref="originalLogAuditJdyDetailMain"
                                  v-if="originalLogAddDetailMainRouter" :originalLogId="originalLogId"
                                  :registrationNo="registrationNo"
                                  @originalLogsListReload="getOriginalLogList"
                                  @hideOriginalLogAddDetailMain="hideOriginalLogAddDetailMain"
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
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../../util/base";
  import OriginalLogList from '../../common/originalLogCommon/originalLogList.vue';
  import OriginalLogAuditJdyDetailMain from './originalLogAuditJdyDetailMain.vue';
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
    name: "OriginalLogAuditJdy",
    data() {
      return {
        searchType: "0",
        searchKey: "",
        page: 1,
        rows: 10,
        total: 0,
        originalLogData: [],
//        treeDataList:[],
//        mlId:"0",
//        keyId:"keyMlId",
//        keyMlId:"0",
//        treePid:"mlIdParentTemp",
//        propsKey:{label: 'mlName', children: 'children',isLeaf:'isLeaf'},
        edit:null,
        currentKey:0,
//        isLazy:true,
        originalLogList:[],
        originalLogListRouter: true,
        originalLogAddDetailMainRouter: false,
        originalLogId:null,
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
      };
    },
    components: {
      ElCol,OriginalLogList,OriginalLogAuditJdyDetailMain,

    },
    computed:{
      ZSTableMaxHeight(){
        return  this.$store.state.admin.window_innerHeight-227;
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
          if(this.originalLogList.length>1){
            this.getOriginalLogList(this.registrationNoTemp)
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
        ajaxRequest("get", "back/originalLog/getJdHySjdList", paramters, res => {
          if (res.code === 200) {
            this.originalLogData = res.rows;
            this.total = res.total;
            this.certificateTotal = res.map.certificateTotal;
            this.checkAuditDjhListInterim=[];
            //将登记号放入页面变量，用于全选
            for(var i in this.originalLogData){
              if(this.originalLogData.hasOwnProperty(i)){
                this.checkAuditDjhListInterim.push(this.originalLogData[i].registrationNo);
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
              this.originalLogDataClick(this.registrationNoTemp);
            }else {
              if (this.originalLogData.length > 0) {
                this.originalLogDataClick(this.originalLogData[0].registrationNo);
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
      getOriginalLogList(registrationNo) {
        ajaxSyncRequest("get", "back/originalLog/getJdHyOriginalLogList", {registrationNo:registrationNo,type:this.queryType}, res => {
          if (res.code === 200) {
            this.originalLogList = res.rows;
            console.log(this.originalLogList);
            //设置证书数量
            this.certificateNumber = res.map.certificateNumber ;
            this.certificateAddCount = res.map.certificateAddCount ;

//            if(this.$refs.originalLogAuditJdyDetailMain) {
//              var showId = this.$refs.originalLogAuditJdyDetailMain.$refs.certificateAddDetail.getCertificateId();
//              this.originalLogId = showId ;
//            }else {
              if(this.originalLogList.length>0){
                this.originalLogId = this.originalLogList[0].ysjlId ;
                this.chooseOriginalLog(this.originalLogId)
              }
//            }

            //刷新已添加证书列表
            this.originalLogsListReload();
          }
        });
      },
      resetCertificateList(){
        this.certificateNumber = 0 ;
        this.certificateAddCount = 0 ;
        this.originalLogList = [];
        //刷新已添加证书列表
        this.originalLogsListReload();
        this.registrationNo = null ;
        this.originalLogId = null ;
        this.certificateTempId = null ;
        this.certificateAddDetailMainReload();
      },
      //登记号行点击事件    登记号，证书数量
      originalLogDataClick(registrationNo){
        //获得已添加证书列表
        this.getOriginalLogList(registrationNo);
        //设置登记号临时变量
        this.registrationNoTemp = registrationNo ;
      },
      //刷新已添加证书列表
      originalLogsListReload(){
        this.originalLogListRouter = false
        this.$nextTick(() => (this.originalLogListRouter = true))
      },
      //刷新已添加证书详情页
      certificateAddDetailMainReload(){
        this.originalLogAddDetailMainRouter = false
        if(this.originalLogId != null || this.certificateTempId != null){
          this.$nextTick(() => (this.originalLogAddDetailMainRouter = true))
        }
      },
      //点击证书列表回调
      chooseOriginalLog(originalLogId){
        this.registrationNo = this.registrationNoTemp ;
        this.originalLogId = originalLogId ;
        this.certificateTempId = null ;
        this.certificateAddDetailMainReload();
      },
      //隐藏右侧组件
      hideOriginalLogAddDetailMain(){
        this.originalLogAddDetailMainRouter = false ;
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
        this.checkAllAuditDjhListList = checkedCount === this.originalLogData.length;
        this.isIndeterminateAuditDjhList = checkedCount > 0 && checkedCount < this.originalLogData.length;

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
