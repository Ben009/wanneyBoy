<template>
  <div style="height:100%;display: flex" class="firstAuditCss" ref="firstAudit-page">
      <!-- 左边区域 -->
      <div class="certificateLeftMenu" style="width:250px;" v-divDrag="{'drag':_ => calcOtherWidth()}" ref="certLeftMenu">
        <!-- 文件夹区域 -->
        <div class="upperLeft">
        <CertificateListTree ref="certificateListTree" :dataList="dataList" :keyId="keyId" :treePid="treePid"
                             :propsKey="propsKey" :currentKey="currentKey" :isLazy="isLazy"
                             :leftClickMain="leftClick"/>
        </div>
        <div class="cutOff"></div>
        <!-- 列表区域 -->
        <div class="lowerLeft">
          <!-- 一级未审核模板 -->
          <div class="auditeList">
            <el-checkbox :indeterminate="isIndeterminateUnauditedList" v-model="checkAllUnauditedList"
                         @change="handleUnauditedListCheckAllChange" >
              一级未审核模板
            </el-checkbox>
          </div>
          <el-checkbox-group v-model="checkUnauditedList" @change="handleUnauditedListCheckedChange">
            <div v-for="unaudited in unauditedList">
              <el-checkbox  :label="unaudited.mbId" :class="{'isActive':mbId == unaudited.mbId}" class="certifitePL5" :key="unaudited.mbId" @change="checkBoxChange(unaudited.mbId)" >
                <span style="color: red">{{unaudited.mbName}}</span>（{{unaudited.mlName}}）
              </el-checkbox>
            </div>
          </el-checkbox-group>
          <!-- 一级已审核模板 -->
          <div class="auditeList">
            <el-checkbox :indeterminate="isIndeterminateAuditedList" v-model="checkAllAuditedList" @change="handleAuditedListCheckAllChange">一级已审核模板</el-checkbox>
          </div>
          <el-checkbox-group v-model="checkAuditedList" @change="handleAuditedListCheckedChange">
            <el-checkbox v-for="audited in auditedList" :class="{'isActive':mbId == audited.mbId}" class="certifitePL5" :label="audited.mbId" :key="audited.mbId" @change="checkBoxChange(audited.mbId)">
              <span style="color: green">{{audited.mbName}}</span>
              （{{audited.mlName}}）</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 右边区域 -->
      <div class="certificateContent" :style="{'width':calcWidth+'px','padding':'0px 5px','z-index':'1'}">
        <OriginalLogTemplateFirstAuditDetail v-if="isRouterAlive" :mlId="mlId" :mbId="mbId"
                                             :checkAuditedList="checkAuditedList" :checkUnauditedList="checkUnauditedList"
                                             @noticeRefresh="noticeRefresh"/>
      </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import CertificateListTree from '../../common/certificateListTree';
  import OriginalLogTemplateFirstAuditDetail from './originalLogTemplateFirstAuditDetail';
  import Clickoutside from '@/common-el/src/utils/clickoutside';
  import {ajaxRequest,ajaxSyncRequest } from '../../../util/base';
  import vueBus from 'vue-bus';
  import '../../../util/Base.css'
  import $ from 'jquery';

/*   import {Container,Aside,Main} from 'element--ui';
  Vue.use(Container);
  Vue.use(Aside);
  Vue.use(Main); */

  export default {
    name: "OriginalLogTempMainFirstAudit",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateListTree,OriginalLogTemplateFirstAuditDetail,
    },
    data(){
      //rentun中的变量仅针对当前组件有效
      return{
        isSetting:0,
        menuIndex:7,
        tempValue:null,
        /** sidtran:"兄弟组件间交互缓存变量",*/
        dataList:[],
        mlId:"0",
        keyId:"keyMlId",
        keyMlId:"0",
        treePid:"mlIdParentTemp",
        propsKey:{label: 'mlName', children: 'children',isLeaf:'isLeaf'},
        edit:null,
        currentKey:0,
        isLazy:true,
        mbId:null,
        mbIds:null,
        isRouterAlive: false,
        copyId: null,
        handType:null,
        dealTreeNodeType:null,
        unauditedList: [],//未审核列表
        auditedList: [],//已审核列表
        checkAllUnauditedList: false,
        isIndeterminateUnauditedList: false,
        isIndeterminateAuditedList:false,
        checkAllAuditedList:false,
        checkUnauditedList:[],
        checkUnauditedListInterim:[],
        checkAuditedList:[],
        checkAuditedListInterim:[],
        calcWidth:'',
      }
    },
    watch:{
      innerWidth(v){
        this.calcOtherWidth();
      },
    },
    methods:{
      reFreashDateList(index){
        this.getDataList(index);
      },
      leftClick(data){
        //判断是否模板
        if(data.isLeaf){
          // 点击根模板
          this.keyMlId = data.keyMlId ;
          this.mbId = data.mlId ;
          this.currentKey = this.keyMlId;
          //强制刷新组件
          this.reload();
        }else {
          // 点击文件夹
          this.mlId = data.mlId ;
          this.getDataList(this.mlId);

        }
      },

      //从后台获得数据
      getDataList(mlId) {
         //重命名进来的
        if(mlId){
        }
        //第一次进来的
        else {
          mlId = 0 ;
          this.dataList = [{"mlName":"证书模板","mlId":"0","keyMlId":"W0","isParent":"-1"}];
          this.$nextTick(()=>{
            //点击第一个文件夹
            this.$refs.certificateListTree.$refs.tree.$children[0].handleClick();
          })
          return ;
        }
        ajaxSyncRequest('get', 'back/originalLogTemp/'+mlId, null, (res) => {
          if (res.code === 200) {
            var dataListTemp = [];
            console.log(res.rows)
            for(var i=0;i<res.rows.length;i++){
              if(res.rows[i].isLeaf == false ){
                dataListTemp[dataListTemp.length] = res.rows[i];
              }
            }
            this.dataList = dataListTemp;
          }
        });
        this.getUnauditedList(mlId);
        this.getAuditedList(mlId);
      },

      //未审核全选checkbox
      handleUnauditedListCheckAllChange(val) {
        this.checkUnauditedList = val ? this.checkUnauditedListInterim : [];
        this.isIndeterminateUnauditedList = false;
      },
      //单个报告点击选中
      handleUnauditedListCheckedChange(value) {
        console.log(value,'value');
        let checkedCount = value.length;
        this.checkAllUnauditedList = checkedCount === this.unauditedList.length;
        this.isIndeterminateUnauditedList = checkedCount > 0 && checkedCount < this.unauditedList.length;

        console.log(this.checkUnauditedList,'checkUnauditedList');

        //        if(value.length>1){
          //多个模板
//        this.mbIds = value;
//        }else{
//          //单个
//          this.keyMlId = value ;
//          this.mbId = value ;
//          this.currentKey = this.keyMlId;
//          //强制刷新组件
//          this.reload();
//        }

      },
      handleAuditedListCheckAllChange(val) {
        this.checkAuditedList = val ? this.checkAuditedListInterim : [];
        this.isIndeterminateAuditedList = false;
      },
      handleAuditedListCheckedChange(value) {
        let checkedCount = value.length;
        this.checkAllAuditedList = checkedCount === this.auditedList.length;
        this.isIndeterminateAuditedList = checkedCount > 0 && checkedCount < this.auditedList.length;
//         if(value.length>1){
//          this.mbIds = value;
//        }else{
//          this.keyMlId = value ;
//          this.mbId = value ;
//          this.currentKey = this.keyMlId;
//          //强制刷新组件
//          this.reload();
//        }
      },
      reload(){
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      },

    // 查询当前文件夹一级未审核的数据列表
     getUnauditedList(mlId){
       if(mlId){
         var url = "" ;
//         if(mlId == 0 ){
//           url = "back/originalLogTemp/getMbByMbName" ;
//         }else {
           url = "back/originalLogTemp/getOriginalLogTempListByMlId" ;
//         }
         this.checkUnauditedListInterim = [] ;
          ajaxRequest("get", url,{mlId:mlId,auditFlag:1}, (res) => {
             if(res.code === 200){
              this.unauditedList = res.daoResult;
              //只存模版Id用于全选
              var itemList = res.daoResult;
              for(var i in itemList){
                if(itemList.hasOwnProperty(i)){
                    this.checkUnauditedListInterim.push(itemList[i].mbId);
                }
              }
               for(var i=this.checkUnauditedList.length-1;i>=0;i--){
                 if($.inArray(this.checkUnauditedList[i],this.checkUnauditedListInterim)==-1){
                   this.checkUnauditedList.splice(i,1);
                 }
               }
             }
         });
       }
     },

    // 查询当前文件夹一级已审核的数据列表
     getAuditedList(mlId){
       if(mlId){
         var url = "" ;
//         if(mlId == 0 ){
//           url = "back/originalLogTemp/getMbByMbName" ;
//         }else {
           url = "back/originalLogTemp/getOriginalLogTempListByMlId" ;
//         }
         this.checkAuditedListInterim = [] ;
          ajaxRequest("get", url,{mlId:mlId,auditFlag:2}, (res) => {
             if(res.code === 200){
               this.auditedList = res.daoResult;
              //只存模版Id用于全选
              var itemList = res.daoResult;
              for(var i in itemList){
                if(itemList.hasOwnProperty(i)){
                    this.checkAuditedListInterim.push(itemList[i].mbId);
                }
              }
               for(var i=this.checkAuditedList.length-1;i>=0;i--){
                 if($.inArray(this.checkAuditedList[i],this.checkAuditedListInterim)==-1){
                   this.checkAuditedList.splice(i,1);
                 }
               }
             }
         });
       }
     },
      deepClone(obj){
        if(!obj){
          return obj;
        }
        var newObj = obj.constructor === Array ? []:{};
        if(typeof obj !== 'object'){
          return
        }else{
          for(var i in obj){
            if(obj.hasOwnProperty(i)){
              newObj[i] = typeof obj[i] === 'object'?this.deepClone(obj[i]):obj[i];
            }
          }
        }
        return newObj
      },
      noticeRefresh(mlId){
        this.getUnauditedList(mlId);
        this.getAuditedList(mlId);
        this.reload();
      },
      calcOtherWidth(){
        this.calcWidth = $(this.$refs['firstAudit-page']).parents('.tbs_info').width() - $(this.$refs['certLeftMenu']).width()
      },
      checkBoxChange(id){

        this.keyMlId = id ;
        this.mbId = id ;
        this.currentKey = this.keyMlId;
        //强制刷新组件
        this.reload();

        console.log(id);
      },
    },
    created () {
      this.getDataList();
    },
  }
</script>

<style lang="scss" scoped> 
 
.firstAuditCss{
  height:100%;
  .cutOff{
    margin:1% 0px calc(1% - 1px) 0px;
    width:100%;
    border-bottom:1px dashed #ccc;
  }
  .certifitePL5{
    line-height:25px;
    margin-left: 0px!important;
  .el-checkbox__input{
    padding-left:5px;
  }
}
.isActive{
  .el-checkbox__label{
    background: #c5e6fd;
  }
}
.certificateLeftMenu{
  width:250px;
  height:100%;
  // padding:0px 5px;
  // position: absolute;
  top: 0px;
  left: 0px;
  width: 200px;
  bottom: 0px;
  overflow: auto;

}
.certificateContent{
  // position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left:200px;
  width:100%;
  // overflow: auto;
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
  .custom-1d74b7 .el-checkbox {
    width: 100%;
  }
 .custom-1d74b7 .el-checkbox+.el-checkbox {
    margin-left: 0px;
}
  .upperLeft{
    height:49%;
    width: 100%;
    // position: absolute;
    overflow:auto;
  }
  .lowerLeft{
    // padding-top: 5%;
    // padding-left: 5%;
    // margin-top: 230%;
    height: 50%;
    width: 100%;
    // position: absolute;
    overflow: auto;
  }
  .auditeList{
    padding-left:5px;
    margin-top: 10px;
    margin-bottom:5px;
    .el-checkbox__label{
      font-weight: bold;
    }
  }

}
</style>
