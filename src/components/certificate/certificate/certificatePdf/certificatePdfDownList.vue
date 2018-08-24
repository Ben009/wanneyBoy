<template>
  <div>
    <template v-if="mainShow">
      <!-- 高级查询条件 -->
      <mind-condition ref="certificatePdfDownWhere" :op-code="opCode" ></mind-condition>
      <!-- 查询调用按钮 -->
      <div style="display: flex;justify-content: space-between;">
        <span style="">
           <el-checkbox style="padding: 0px;margin-right: 15px" v-model="isQueryAll">
            <span>查询所有证书</span>
           </el-checkbox>
        </span>
        <div style="display: inline-block;text-align: center">

          <el-button type="primary"  @click="findBtn" class="el-icon-search">查询</el-button>
          <el-button type="primary" @click="downloadCertPdfZip" class="el-icon-download">打包下载</el-button>
          <el-button type="warning"  @click="emptyCondition" class="el-icon-info">清空</el-button>
        </div>
        <span style="float: right">
          <el-select size="mini"  v-model="isDefModule" placeholder="请选择" @change="changeModule">
            <el-option
              v-for="(item,index) in modules"
              :key="index"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" round @click="personalSetting(1)" class="el-icon-setting">个性化设置</el-button>
          <global-tootips style="float:right;margin-top:5px;" >
            <p><span>1、默认查询一个月内证书，勾上“查询所有证书”后查询所有证书。 </span></p>
            <p>2、是否入库查询仅代表该证书有出入库记录，不代表证书还在库房，有可能已出库。 </p>
            <p>3、打包下载的PDF份数如果超过2000份则剩下的不进行处理。</p>
            <p>4、证书编号<span style="color:green">绿色</span>代表该证书是由原始记录生成的。</p>
          </global-tootips>
        </span>
      </div>
      <!-- TODO 案例 通用查询组件 -->
      <mind-datagrid ref="certificatePdfDownList"  :op-code="opCode" :findUrl="findUrl" :downUrl="downUrl" :callBack="callBack"  :ckbox="ckbox"  setTabH="setHeightForRetS">
        <template slot="statusName" slot-scope="scope"  >
          <span v-if="scope.row.status=='2'" style="color:red;">{{scope.row.statusName}}</span>
          <span v-else>{{scope.row.statusName}}</span>
        </template>
        <template>
          <el-table-column   label="操作" fixed="right"  width="80px">
            <template slot-scope="scope">
              <el-button @click="showCertPdf(scope.row)" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-view" title="查看"></i>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </mind-datagrid>
      <!-- tips -->

    </template>
    <template v-else>
      <CertificateQueryDetailMain
        ref="certificateAddDetailMain"
        v-if="certificateAddDetailMainRouter"
        :certificateId="certificateId"
        :registrationNo="registrationNo"
        :actionType="actionType"
        :certificateQueryListBack="certificateQueryListBack"
        :showReturn="true"
        :canChangeBzqZSInfo="canChangeBzqZSInfo"
        :canEditYjBzBzqInfo="canEditYjBzBzqInfo"
        :canChooseHistoryByQjmc="canChooseHistoryByQjmc"
      />
    </template>
  </div>
</template>
<script>
  import Vue from "vue";
  import $ from 'jquery';
  import CertificateQueryDetailMain from '../certificateQuery/certificateQueryDetailMain.vue';
  import { ajaxRequest,ajaxProxyRequest} from '../../../util/base'
  import CertificatePrint from "@/components/certificate/common/printJs/certificatePrint.js"

  export default {
    name: "",
    components: {
      CertificateQueryDetailMain
    },
    mixins:[CertificatePrint],
    data() {
      return {
        ckbox:false,
        mainShow: true,
        edit: null,
        opCode: "findCertPdfDownPage",
        downOpCode: "findCertPdfDownList",
        modules:[],//模板列表
        isDefModule:'',//默认模板
        certificateAddDetailMainRouter: false,
        certificateId:null,
        registrationNo : null ,
        actionType:"",
        findUrl:'/back/certificatePdf/findCertPdfDownList/',
        downUrl:'/back/certificatePdf/certPdfZipDown/',   // 下载接口地址
        //是否可修改标准器证书
        canChangeBzqZSInfo:true,
        //技术依据、标准、仪器可编辑内容
        canEditYjBzBzqInfo:true,
        //可根据器具名称查询开始数据
        canChooseHistoryByQjmc:true,
        isQueryAll:false,
        priority:-1,
      };
    },
    methods: {
      //查询按钮调用
      findBtn() {
        this.$refs.certificatePdfDownWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          wheres.isQueryAll = this.isQueryAll;
          console.log("回调传入参数：", wheres);
          this.$refs.certificatePdfDownList.findPageInfo(wheres);
        });
      },
      downloadCertPdfZip(){
        this.$refs.certificatePdfDownWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          //console.log("回调传入参数：", wheres);
          wheres.isQueryAll = this.isQueryAll;
          wheres["rows"]=1000;//每页行数
          wheres["page"]=1;   //页码
          wheres["CERT_DOWN_ZIP"] = "true";   //证书下载zip
          wheres["opCode"] = this.downOpCode;   //附件下载
          // wheres["page"]=1;   //页码
          // wheres
          this.$refs.certificatePdfDownList.findPageInfo(wheres,true);
        });
      },
      /** 打开个性化设置 */
      personalSetting(){//个性化设置
        this.$refs.certificatePdfDownWhere.settingShow(true,(personalSet)=>{
          //当个性化设置打开后如果有参数变动会回调
          //console.log("设置后回调：",res);
          this.$refs.certificatePdfDownList.changeFilter(null,personalSet);
          this.modules=personalSet.content;
          this.isDefModule=personalSet.isDefModule;
        });
      },
      /** 清空查询条件 */
      emptyCondition(){//
        this.$refs.certificatePdfDownWhere.emptyCondition();
      },
      /** 回调 可以单datagrid使用  */
      callBack(type,param1,param2){
        if(type=='modules'){
          this.modules=param1;
          this.isDefModule=param2;
        }else{
          //console.log("回调接收参数",param1);
        }
      },
      /** 模板变换 */
      changeModule(value){
        //console.log("模板变更",value);
        this.$refs.certificatePdfDownList.changeFilter(value,null);
      },
      handleEdit(rowInfo) {
        this.mainShow = false;
        // 改了页面的显示数据
        this.registrationNo = rowInfo.registrationNo ;
        this.certificateId = rowInfo.zsId ;
        this.actionType="query";
        this.certificateAddDetailMainReload();
      },
      //刷新已添加证书详情页
      certificateAddDetailMainReload(){
        this.certificateAddDetailMainRouter = false
        if(this.certificateId != null || this.certificateTempId != null){
          this.$nextTick(() => (this.certificateAddDetailMainRouter = true))
        }
      },
      // 传入子页面的回调函数
      certificateQueryListBack() {
        this.certificateAddDetailMainRouter = false;
        this.mainShow = true;
        this.registrationNo = null ;
        this.certificateId = null ;
        this.actionType="";
        this.$nextTick(() => {
          this.findBtn();
        });
      },
      //显示证书pdf
      showCertPdf(data){
        this.certificateId = data.zsId;
        var fileId = data.pdfPath;
        this.fileDownlodByFileId(fileId,null,null,null,null,"toOpenPDF",null,data.zsbh);
      }
    },
    mounted() {
      this.findBtn();
    },
  };
</script>

<style scoped>
  .flex-one {
    flex: 1;
  }
  .flex {
    display: flex;
    margin: 20px 0;
  }
  .custom-input {
    width: 200px;
    height: 32px;
  }
  .custom-input .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .custom-input .el-input-group__append {
    padding: 0 10px;
  }
  /* 在容器的底部预留空间，否则整个页面有一种紧迫感 */
  .container {
    padding-bottom: 50px;
  }
  .position{
    width: 100%;
    text-align: center;
  }

  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }
  .el-icon-setting:hover {
    color: #3094e0 !important;
  }
</style>
