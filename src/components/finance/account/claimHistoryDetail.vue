<template>
  <mind-dialog
    :title="'认领详情'"
    :visible="true"
    dialogSize="large"
    center
    v-dialogDrag
    @close="handleCancel">
    <div>
      <financeTicketDetail v-if="data.linkSource==2" :data="data.linkId"></financeTicketDetail>
      <commonBillForm v-if="data.linkSource==1" :id="data.linkId"></commonBillForm>
      <djhDetail v-if="data.linkSource==3" :billId="data.linkId" :isShowBh="1"></djhDetail>
    </div>
    <div class="title-item"><span>关联到款信息</span></div>
    <div style="margin-top:10px;">
        <el-table :max-height="QJTableMaxHeight"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="PAYMENT_COMPANY" label="付款单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="PAYMENT_ACCOUNT" label="付款账号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="PAY_TIME" label="付款时间" :formatter="formatterpayTime"></el-table-column>
          <el-table-column prop="RECEIVE_ACCOUNT" label="收款账号"   show-overflow-tooltip></el-table-column>
          <el-table-column prop="PAY_MONEY" label="金额" show-overflow-tooltip></el-table-column>
          <el-table-column prop="BALANCE" label="余额" ></el-table-column>
          <el-table-column prop="CLAIM_MONEY" label="认领金额" ></el-table-column>
        </el-table>
    </div>
    <span slot="footer" class="dialog-footer" >
          <el-button v-if="data.claimStatus==1 && cancelPower" type="danger" v-mindPopover="{message:'确定撤销认领到款?',success:cancelClaim.bind(this)}">撤销认领</el-button>
          <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,formatDate} from '../../util/base';
  import financeTicketDetail from "../ticketApply/financeTicketDetail.vue";
  import commonBillForm from "../bill/commonBillForm.vue";
  import djhDetail from '../ticketApply/billDetail.vue';

  let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
  export default {
    name: "claim-history-detail",
    props: {
      data: {
        type: Object,
        required:true
      },
      callback: {
        type:Function,
        required:true
      }
    },
    data(){
      return{
        tableData:[],
        cancelPower:true,
        edit:null
      }
    },
    methods:{
      //获取列表信息
      getTableList(){
        let _this = this;
        ajaxRequest('get','back/accountRecord/getClaimHistoryDetailList',{
          claimId:_this.data.id
        },(res)=>{
          if(res.code===200){
            _this.tableData=res.rows;
          }
        })
      },
      //弹窗关闭事件
      handleCancel(){
        this.callback();
      },
      //时间格式转换
      formatterpayTime:function(row, column){
        return formatDate(row.PAY_TIME,'YYYY-MM-DD');
      },
      //撤销认领记录
      cancelClaim(){
        let _this = this;
        ajaxRequest('post','back/accountRecord/cancelClaim',{
          claimId:_this.data.id
        },(res)=>{
          if(res.code===200){
            if(res.msg===""){
              _this.callback("success");
            }else{
              _this.$message.error(res.msg);
            }
          }
        })
      },
    },
    components:{
      financeTicketDetail,commonBillForm,djhDetail
    },
    mounted() {
      this.getTableList();
      if(btnPower.indexOf("@M36940@") !=-1){//撤销认领按钮权限
        this.cancelPower = true;
      }else{
        this.cancelPower = false;
      }
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
</style>
