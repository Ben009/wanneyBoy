<template>
  <div style="position:relative;">
    <div>
      <!-- 高级查询条件 -->
      <mind-condition ref="accountRecordWhere" :op-code="opCode" ></mind-condition>
      <!-- 查询调用按钮 -->
      <div style="display: flex;justify-content: space-between;">
        <span>
          <el-button size="small" type="primary" @click="claimForBill">关联缴费单</el-button>
          <el-button size="small" type="primary" @click="claimForTicket">关联预开票</el-button>
        </span>
        <div style="display: inline-block;text-align: center">
          <el-button type="primary"  @click="findBtn" class="el-icon-search">查询</el-button>
          <el-button type="primary"  @click="findBtnForAll" class="el-icon-search">查询所有</el-button>
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
            <p>1、	本页面提供将银行到款记录与缴费单、预开票记录关联的功能，用于跟踪每一笔银行到款的去向；</p>
            <p>2、	本界面默认查询所有余额不为0的银行到款记录，如需查询余额为0请勾中“查询余额为0记录”的复选框；</p>
            <p>3、	可勾中多条银行到款记录同时认领；</p>
            <p>4、	“关联缴费单”通常适用为：已添加缴费单，未预开发票，客户已提前将相应费用转账；通过缴费单预开票需使用“关联预开票”功能；</p>
            <p>5、	“关联预开票”通常适用为：申请预开发票后，客户将费用转账；此时需将该银行到款与具体的预开票记录关联；</p>
          </global-tootips>
        </span>
      </div>
      <!-- TODO 案例 通用查询组件 -->
      <mind-datagrid ref="accountRecordList"  :op-code="opCode" :callBack="callBack" :ckbox="ckbox" setTabH="setHeightForRetS">
        <template slot="payTime" slot-scope="scope"  >
          {{scope.row.payTime|formatDateFifter}}
        </template>
        <template>
          <el-table-column   label="操作" fixed="right"  width="80px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-search" title="详情"></i></el-button>
            </template>
          </el-table-column>
        </template>
      </mind-datagrid>
    </div>
    <!--到款详细页面-->
    <accountRecordForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></accountRecordForm>
    <!--认领缴费单页面-->
    <claimBillPage v-if="!!billEdit" :data="billEdit" :callback="handleEditCallback"></claimBillPage>
    <!--认领预开票页面-->
    <claimTicketPage v-if="!!ticketEdit" :data="ticketEdit" :callback="handleEditCallback"></claimTicketPage>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,formatDate} from '../../util/base';
  import claimBillPage from './claimBillPage';
  import claimTicketPage from './claimTicketPage';
  import accountRecordForm from './accountRecordForm';

  export default {
    name: "account-record-claim-list",
    data(){
      return{
        opCode: "findAccountRecordClaimPage",
        modules:[],//模板列表
        isDefModule:'',//默认模板
        ckbox:true,//是否多选 显示checkbox

        billEdit:null,//关联缴费单弹窗显示
        ticketEdit:null,//关联预开票弹窗显示
        edit:null,//详情弹窗显示
        checkValue:false
      }
    },
    methods:{
      //查询所有按钮调用
      findBtnForAll() {
        this.$refs.accountRecordWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          //console.log("回调传入参数：", wheres);
          wheres["checkValue"] = "1";
          this.$refs.accountRecordList.findPageInfo(wheres);
        });
      },
      //查询按钮调用downloadFile
      findBtn() {
        this.$refs.accountRecordWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          //console.log("回调传入参数：", wheres);
          wheres["checkValue"] = "0";
          this.$refs.accountRecordList.findPageInfo(wheres);
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

      //缴费单认领
      claimForBill(){
        if (this.$refs.accountRecordList.multipleSelection.length > 0) {
          let ids = this.$refs.accountRecordList.multipleSelection.map(function (v) {
            return v.id
          }).join(",");
          this.billEdit=ids;
        }else{
          this.$message.error('请先选择要认领的到款记录！');
        }
      },
      //预开票认领
      claimForTicket(){
        if (this.$refs.accountRecordList.multipleSelection.length > 0) {
          let ids = this.$refs.accountRecordList.multipleSelection.map(function (v) {
            return v.id
          }).join(",");
          this.ticketEdit=ids;
        }else{
          this.$message.error('请先选择要认领的到款记录！');
        }
      },
      //缴费单认领回调事件
      handleEditCallback(res){
        if(res==="success"){
          this.findBtn();
        }
        this.billEdit=null;
        this.ticketEdit=null;
        this.edit=null;
      },
      //到款详情页面
      handleEdit(rowInfo){
        rowInfo.isReadOnly=true;
        this.edit = rowInfo || {}
      },
    },
    components:{
      claimBillPage,claimTicketPage,accountRecordForm
    },
    filters: {
      formatDateFifter(val) {
        return formatDate(val, 'YYYY-MM-DD')
      }
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
