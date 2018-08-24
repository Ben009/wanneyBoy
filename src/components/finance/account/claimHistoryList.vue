<template>
  <div style="position:relative;">
    <div>
      <!-- 高级查询条件 -->
      <mind-condition ref="accountRecordWhere" :op-code="opCode" ></mind-condition>
      <!-- 查询调用按钮 -->
      <div style="display: flex;justify-content: space-between;">
        <span style="width: 150px">
          &nbsp;&nbsp;&nbsp;&nbsp;
        </span>
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
          <global-tootips>
            <p>1、	默认查询本人认领记录，部门权限查询本部门，高级查询查询所有认领记录；</p>
            <p>2、	已认领未处理前，可由本人或有权限人员进行取消认领；</p>
          </global-tootips>
        </span>
      </div>

      <!-- TODO 案例 通用查询组件 -->
      <mind-datagrid ref="accountRecordList"  :op-code="opCode" :findUrl="findUrl" :downUrl="downUrl" :callBack="callBack" setTabH="setHeightForRetS">
        <template>
          <el-table-column   label="操作" fixed="right"  width="80px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-search" title="详情"></i></el-button>
            </template>
          </el-table-column>
        </template>
      </mind-datagrid>
    </div>
    <!--认领记录详情页面-->
    <claimHistoryDetail v-if="!!edit" :data="edit" :callback="handleEditCallback"></claimHistoryDetail>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,formatDate} from '../../util/base';
  import claimHistoryDetail from './claimHistoryDetail'

  export default {
    name: "claim-history-list",
    data(){
      return{
        opCode: "findClaimHistoryPage",
        modules:[],//模板列表
        isDefModule:'',//默认模板
        findUrl:'/back/accountRecord/getClaimHistoryList/',
        downUrl:'/back/accountRecord/getClaimHistoryListForDown/',

        edit:null
      }
    },
    methods:{
      //查询按钮调用
      findBtn() {
        this.$refs.accountRecordWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          //console.log("回调传入参数：", wheres);
          this.$refs.accountRecordList.findPageInfo(wheres);
        });
      },
      //导出按钮调用
      exportExcleBtn() {
        this.$refs.accountRecordWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          //console.log("回调传入参数：", wheres);
          this.$refs.accountRecordList.findPageInfo(wheres,true);
        });
      },
      /** 打开个性化设置 */
      personalSetting(){//个性化设置
        this.$refs.accountRecordWhere.settingShow(true,(personalSet)=>{
          //当个性化设置打开后如果有参数变动会回调
          //console.log("设置后回调：",res);
          this.$refs.accountRecordList.changeFilter(null,personalSet);
          this.modules=personalSet.content;
          this.isDefModule=personalSet.isDefModule;
        });
      },
      /** 清空查询条件 */
      emptyCondition(){//
        this.$refs.accountRecordWhere.emptyCondition();
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
        this.$refs.accountRecordList.changeFilter(value,null);
      },
      //认领详情页面回调事件
      handleEditCallback(res){
        let _this=this;
        if(res==="success"){
          _this.$message.success('操作成功！');
          _this.edit=null;
          _this.findBtn();
        }else{
          _this.edit=null;
        }
      },
      //弹窗显示认领详情页面
      handleEdit(rowInfo){
        this.edit = rowInfo || {}
      },
    },
    filters: {
      formatDateFifter(val) {
        return formatDate(val, 'YYYY-MM-DD')
      }
    },
    components:{
      claimHistoryDetail
    },
    mounted() {
      this.findBtn();
    }
  }

</script>

<style scoped>
  .custom-input{
    width:200px;
    height:32px;
  }
  .custom-input .el-input__inner{
    height:32px;
    line-height:32px;
  }
  .custom-input .el-input-group__append{
    padding:0 10px;
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
