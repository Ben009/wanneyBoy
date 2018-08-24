<template>
  <div>
    <template v-if="mainShow">
      <!-- 高级查询条件 -->
      <mind-condition ref="certificateQueryWhere" :op-code="opCode" ></mind-condition>
      <!-- 查询调用按钮 -->
      <div style="display: flex;justify-content: space-between;">
        <span style="width: 150px">&nbsp;</span>
        <div style="display: inline-block;text-align: center">
          <el-button type="primary"  @click="findBtn" class="el-icon-search">查询</el-button>
          <el-button type="primary" @click="exportExcleBtn" class="el-icon-download">导出</el-button>
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
        </span>
      </div>
      <!-- TODO 案例 通用查询组件 -->
      <mind-datagrid ref="certificateQueryList"  :op-code="opCode" :findUrl="findUrl" :downUrl="downUrl" :callBack="callBack" setTabH="setHeightForRetS">
        <template slot="statusName" slot-scope="scope"  >
          <span v-if="scope.row.status=='2'" style="color:red;">{{scope.row.statusName}}</span>
          <span v-else>{{scope.row.statusName}}</span>
        </template>
        <template>
          <el-table-column   label="操作" fixed="right"  width="80px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small" style="padding:0;font-size:18px;"><i
                class="el-icon-edit-outline" title="编辑"></i></el-button>
              <el-button :disabled="certificateCanDel(scope.row.certificateWarehouseFlag)" v-mindPopover="{message:'确定删除?',success:handleDelete.bind(this,[scope.row])}" type="text"  size="small" style="padding:0;font-size:18px;"><i
                class="el-icon-delete" title="删除"></i></el-button>
            </template>
          </el-table-column>
        </template>
      </mind-datagrid>
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
  import CertificateQueryDetailMain from './certificateQueryDetailMain.vue';
  import { ajaxRequest} from '../../../util/base'
  export default {
    name: "",
    components: {
      CertificateQueryDetailMain
    },
    data() {
      return {
        mainShow: true,
        edit: null,
        opCode: "certificateQueryList",
        modules:[],//模板列表
        isDefModule:'',//默认模板
        certificateAddDetailMainRouter: false,
        certificateId:null,
        registrationNo : null ,
        actionType:"",
        findUrl:'/back/certificate/getCertificateQueryList/',
        downUrl:'/back/certificate/getCertificateQueryListForDown/',
        //是否可修改标准器证书
        canChangeBzqZSInfo:true,
        //技术依据、标准、仪器可编辑内容
        canEditYjBzBzqInfo:true,
        //可根据器具名称查询开始数据
        canChooseHistoryByQjmc:true,
      };
    },
    methods: {
      //查询按钮调用
      findBtn() {
        this.$refs.certificateQueryWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          //console.log("回调传入参数：", wheres);
          this.$refs.certificateQueryList.findPageInfo(wheres);
        });
      },
      //导出按钮调用
      exportExcleBtn() {
        this.$refs.certificateQueryWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          //console.log("回调传入参数：", wheres);
          this.$refs.certificateQueryList.findPageInfo(wheres,true);
        });
      },
      /** 打开个性化设置 */
      personalSetting(){//个性化设置
        this.$refs.certificateQueryWhere.settingShow(true,(personalSet)=>{
          //当个性化设置打开后如果有参数变动会回调
          //console.log("设置后回调：",res);
          this.$refs.certificateQueryList.changeFilter(null,personalSet);
          this.modules=personalSet.content;
          this.isDefModule=personalSet.isDefModule;
        });
      },
      /** 清空查询条件 */
      emptyCondition(){//
        this.$refs.certificateQueryWhere.emptyCondition();
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
        this.$refs.certificateQueryList.changeFilter(value,null);
      },
      handleDelete(data) {
        let _this = this;
        ajaxRequest("put", "back/appliance/", {id:data[0].id,isDelete:1}, function(res) {
          if (res.code === 200) {
            _this.$message.success("删除成功");
            _this.findBtn();
          } else {
            _this.$message.error("删除失败");
          }
        });
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
      certificateCanDel(certificateWarehouseFlag){
        let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
        if(btnPower.indexOf("@M27611@") != -1 && certificateWarehouseFlag != 4){
          return !true ;
        }else if(btnPower.indexOf("@M27612@") != -1 && certificateWarehouseFlag == 4){
          return !true ;
        }else {
          return !false ;
        }
      },
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
