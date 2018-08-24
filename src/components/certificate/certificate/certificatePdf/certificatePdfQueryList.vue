<template>
  <div>
    <!--<template v-if="mainShow">-->
      <!-- 高级查询条件 -->
      <mind-condition ref="certificatePdfQueryWhere" :op-code="opCode" ></mind-condition>
      <!-- 查询调用按钮 -->
      <div style="display: flex;justify-content: space-between;">
        <span style="">
           <el-checkbox style="padding: 0px;margin-right: 15px" v-model="isQueryAll">
            <span>查询所有证书</span>
           </el-checkbox>
          <span>优先级：</span>
           <el-select size="mini"  v-model="priority" placeholder="请选择" >
            <el-option value="0">0</el-option>
            <el-option value="1">1</el-option>
            <el-option value="2">2</el-option>
            <el-option value="3">3</el-option>
            <el-option value="4">4</el-option>
            <el-option value="5">5</el-option>
            <el-option value="6">6</el-option>
            <el-option value="7">7</el-option>
            <el-option value="8">8</el-option>
            <el-option value="9">9</el-option>
          </el-select>
           <el-button type="primary"  @click="prioritySettings">设置优先级</el-button>

        </span>
        <div style="display: inline-block;text-align: center">

          <el-button type="primary"  @click="findBtn" class="el-icon-search">查询</el-button>
         <!-- <el-button type="primary" @click="exportExcleBtn" class="el-icon-download">导出</el-button> -->
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
            <p>3、证书编号<span style="color:green">绿色</span>代表该证书是由原始记录生成的。</p>
            <p>4、任务优先级值越大代表优先级越高，值为空代表还未加入到转PDF任务列表中。</p>
          </global-tootips>
        </span>
      </div>
      <!-- TODO 案例 通用查询组件 -->
      <mind-datagrid ref="certificatePdfList"  :op-code="opCode" :findUrl="findUrl" :downUrl="downUrl" :callBack="callBack"  :ckbox="ckbox"  setTabH="setHeightForRetS">
        <template slot="statusName" slot-scope="scope"  >
          <span v-if="scope.row.status=='2'" style="color:red;">{{scope.row.statusName}}</span>
          <span v-else>{{scope.row.statusName}}</span>
        </template>
        <template>
          <el-table-column   label="操作" fixed="right"  width="80px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small" style="padding:0;font-size:18px;"><i
                class="el-icon-view" title="查看"></i></el-button>
            </template>
          </el-table-column>
        </template>
      </mind-datagrid>
      <!-- tips -->

    <!--</template>-->
    <!--<template v-else>-->
     <!-- <CertificateQueryDetailMain
        ref="certificateAddDetailMain"
        v-if="certificateQueryDetailDialogRouter"
        :certificateId="certificateId"
        :registrationNo="registrationNo"
        :actionType="actionType"
        :certificateQueryListBack="certificateQueryListBack"
        :showReturn="true"
        :canChangeBzqZSInfo="canChangeBzqZSInfo"
        :canEditYjBzBzqInfo="canEditYjBzBzqInfo"
        :canChooseHistoryByQjmc="canChooseHistoryByQjmc"
      />-->
      <certificateQueryDetailDialog
        v-if="certificateQueryDetailDialogRouter"
        :certificateId="certificateId"
        :callback="certificateQueryDetailDialogClose"
      ></certificateQueryDetailDialog>
    <!--</template>-->
  </div>
</template>
<script>
  import Vue from "vue";
//  import CertificateQueryDetailMain from '../certificateQuery/certificateQueryDetailMain.vue';
  import certificateQueryDetailDialog from '../../common/certificateCommon/certificateQueryDetailDialog.vue';
  import { ajaxRequest} from '../../../util/base'
  export default {
    name: "",
    components: {
      certificateQueryDetailDialog
    },
    data() {
      return {
        ckbox:true,
        mainShow: true,
        edit: null,
        opCode: "findCertPdfPage",
        modules:[],//模板列表
        isDefModule:'',//默认模板
        certificateQueryDetailDialogRouter: false,
        certificateId:null,
        registrationNo : null ,
        actionType:"",
        findUrl:'/back/certificatePdf/getCertificatePdfList/',
        downUrl:'/back/certificatePdf/getCertificatePdfListForDown/',
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
        this.$refs.certificatePdfQueryWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          wheres.isQueryAll = this.isQueryAll;
          console.log("回调传入参数：", wheres);
          this.$refs.certificatePdfList.findPageInfo(wheres);
        });
      },
      //导出按钮调用
      exportExcleBtn() {
        this.$refs.certificatePdfQueryWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          //console.log("回调传入参数：", wheres);
          this.$refs.certificatePdfList.findPageInfo(wheres,true);
        });
      },
      /** 打开个性化设置 */
      personalSetting(){//个性化设置
        this.$refs.certificatePdfQueryWhere.settingShow(true,(personalSet)=>{
          //当个性化设置打开后如果有参数变动会回调
          //console.log("设置后回调：",res);
          this.$refs.certificatePdfList.changeFilter(null,personalSet);
          this.modules=personalSet.content;
          this.isDefModule=personalSet.isDefModule;
        });
      },
      /** 清空查询条件 */
      emptyCondition(){//
        this.$refs.certificatePdfQueryWhere.emptyCondition();
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
        this.$refs.certificatePdfList.changeFilter(value,null);
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
        this.certificateQueryDetailDialogRouter = false
        if(this.certificateId != null || this.certificateTempId != null){
          this.$nextTick(() => (this.certificateQueryDetailDialogRouter = true))
        }
      },
      // 传入子页面的回调函数
      certificateQueryListBack() {
        this.certificateQueryDetailDialogRouter = false;
        this.mainShow = true;
        this.registrationNo = null ;
        this.certificateId = null ;
        this.actionType="";
        this.$nextTick(() => {
          this.findBtn();
        });
      },
      // 传入子页面的回调函数
      certificateQueryDetailDialogClose() {
        this.certificateQueryDetailDialogRouter = false;
        this.mainShow = true;
        this.registrationNo = null ;
        this.certificateId = null ;
        this.actionType="";
      },
      prioritySettings(){//优先级设置
        if(this.priority < 0){
          this.$message.error("请选择优先级！")
          return;
        }

        let thatSelection = this.$refs.certificatePdfList.multipleSelection
        if(!thatSelection || thatSelection.length <=0 ){
          this.$message.error("请至少勾选一份证书！")
          return;
        }
        let taskList = [];
        let certList = [];

        for(let item of thatSelection){
          if(item["taskId"]){
            taskList.push(item["taskId"])
          }else{
            certList.push(item["zsId"])
          }
        }
        let params = {'taskList':taskList,'certList':certList,"priority":this.priority}
        //设置优先级
        ajaxRequest('post',"back/certificatePdf/prioritySettings",{"data":JSON.stringify(params)},(res) =>{
          if(res.code == 200){
            this.$message.success('操作成功');
            this.findBtn();
          }else {
            this.$message.error(res.msg);
          }
        },"unicode");
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
