<template>
  <div class="certificatesListStyle">
    <div class="topButtom">
      <div class="certificateNumber">
        <span>
          {{certificateNumber}}/
        </span>
        <span style="color: red;margin-right:5px">
          {{certificateAddCount }}
        </span>
        <el-tooltip content="应出记录数量/已出记录数量" placement="top">
          <i class="el-icon-info ft12"></i>
        </el-tooltip>
      </div>
      <div>
        <el-button type="primary" v-if="canChangeCertificateNumber" @click="handleEditNumber" size="small" >修改证书数量</el-button>
      </div>
    </div>
    <div class="certificateNeedAduit">
      <ul style="/*overflow: auto;*/font-size:14px;width:100%;">
        <!-- 列表 -->
        <li v-for="val in originalLogList"
            style="cursor:pointer;width:100%">
          <div :class="{cursor:true,'current-row':originalLogId && originalLogId == val.ysjlId }" class="listItem">
            <span v-if="val.returnFlag == 1 " style="color: red;" :style="{marginRight : typeof handleDelete == 'function' ? '45px' : '0px'}" @click="quoInfoClick(val.ysjlId)">{{zsbhFormat(val.zsbh)}}</span>
            <span v-else="" :style="{marginRight : typeof handleDelete == 'function' ? '45px' : '0px'}" @click="quoInfoClick(val.ysjlId)">{{zsbhFormat(val.zsbh)}}</span>

            <el-button v-if="typeof handleDelete == 'function'" v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,val.ysjlId)}" type="text" style="float: right;padding:0;font-size:14px;">
              <i class="el-icon-delete" title="删除"></i>
            </el-button>
          </div>
        </li>
      </ul>
    </div>
    <CertificateEditNumber v-if="!!editNumberShow" :registrationNo="registrationNo"  :callback="handleCallback"  />
  </div>
</template>

<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../../util/base";
  import CertificateEditNumber from '../certificateCommon/certificateEditNumber';
  import ElCol from "@/common-el/packages/col/src/col";
  import CertificateCommon from "@/components/certificate/common/certificateCommon.js";


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
    Vue.use(RadioGroup); */

  export default {
    components: {
      ElCol,CertificateEditNumber,
    },
    props: {
      //需要展现的证书列表
      originalLogList: {required: true},
      //需要选中的证书
      originalLogId: {required: false},
      //需要生成多少份证书
      certificateNumber : {required: false},
      //已出证书数量
      certificateAddCount : {required: false},
      handleDelete :{
        type:Function,
        required:false
      },
      //登记号
      registrationNo :{default: null},
      showChangeCertificateNumber:{default: false},
    },
    data() {
      return {
        canChangeCertificateNumber:false,
        editNumberShow: false,
      };
    },
    mixins: [CertificateCommon],
    methods: {
      quoInfoClick(ysjlId){
        this.$emit('leftCilck', ysjlId );
      },
//      handleDelete(ysjlId){
//        this.handleDelete(ysjlId);
////        this.$emit('handleDelete', ysjlId );
//      }
      //修改证书数量(弹窗显示)
      handleEditNumber(){
        this.editNumberShow = true;
      },
      //修改证书数量(弹窗隐藏)
      handleCallback(){
        this.editNumberShow = false;
        //刷新已添加证书
        this.$emit('originalLogsListReload',this.registrationNo);
      },
    },
    filters: {

    },
    created() {
      let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
      if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
        btnPower = "@@";
      }
      //按钮_证书编辑时可修改证书数量
      if(btnPower.indexOf("@M27111@") != -1 && this.showChangeCertificateNumber){
        this.canChangeCertificateNumber = true ;
      }else {
        this.canChangeCertificateNumber = false ;
      }
    },
    mounted(){
    }
  };
</script>


<style lang="scss">
  .certificatesListStyle{
    height:100%;
    .topButtom{
      display:flex;
      justify-content: center;
      align-items: center;
    }
    .certificateNumber{
      margin-right:10px;
      display:flex;
      align-items: center;
    }
    .certificateNeedAduit{
      height: calc(100% - 30px);
      overflow: auto;
      margin-top: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    .listItem{
      width: 100%;
      display: flex;
      justify-content: center;
      line-height:25px;
    }
    .current-row{
      background-color: #c5e6fd;
    }
  }

</style>
