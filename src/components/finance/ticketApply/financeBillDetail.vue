<template>
  <mind-dialog  :title="'预开票详情'"
                dialogSize="large"
                center
                :visible="true"
                v-dialogDrag
                @close="handleCancel"
                :appendToBody="true">
    <el-form :model="applyInfo" label-width="140px">
      <div class="title-item" style="text-align: left;margin-bottom: 10px">
        <span style="width: 95%">基本信息</span>
        <span style="width: 5%">
          <global-tootips :width="600">
            <p>1、有权限人员在该预开票未到账前，可取消。</p>
          </global-tootips>
        </span>
      </div>
      <el-Row>
        <el-col :span="8">
          <el-form-item label="开票单位" prop="ticketCompany">
            {{applyInfo.ticketCompany}}
            <el-input v-model="applyInfo.companyId" v-show="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请金额" prop="ticketMoney">
            {{applyInfo.ticketMoney}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票日期" prop="ticketDate">
            {{applyInfo.ticketDate | DateFormat}}
          </el-form-item>
        </el-col>
      </el-Row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="申请人" prop="drawerName">
            {{applyInfo.userName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核人" prop="drawerName">
            {{applyInfo.auditorName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票人" prop="drawerName">
            {{applyInfo.drawerName}}
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="申请时间" prop="ticketOperateDate">
            {{applyInfo.addTime}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核时间" prop="ticketOperateDate">
            {{applyInfo.auditTime}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票时间" prop="ticketOperateDate">
            {{applyInfo.ticketOperateDate}}
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-row>
        <el-col :span="8">
          <el-form-item label="结账人" prop="drawer">
            {{applyInfo.checkName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作时间" prop="ticketOperateDate">
            {{applyInfo.checkTime}}
          </el-form-item>
        </el-col>
      </el-row>-->
    </el-form>

    <div class="title-item"><span>发票信息</span></div>
    <checkoutInfo v-for="(item,index) in ticketList" :data="item"></checkoutInfo>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"  v-has="'M39301'" v-mindPopover="{message:'确定取消开票?',success:handleSubmit.bind(this),isOpen:handleOpen.bind(this)}">取消开票</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
    <div v-if="applyInfo.source==1">
      <div  class="title-item"><span>缴费单信息</span></div>
      <div>
        <commonBillForm :id="applyInfo.billId"></commonBillForm>
      </div>
    </div>
  </mind-dialog>
</template>
<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import { ajaxRequest, ajaxSyncRequest,formatDate } from "../../util/base";
  import checkoutInfo from "../checkout/ticketDetail.vue";
  import $ from 'jquery'
  import commonBillForm from '../bill/commonBillForm.vue'

  const defaults = {};
  export default {
    props:{
      data:{
        type:Object,
      },
      callback:{
        type:Function,
      }
    },
    data() {
      return {
        applyInfo:$.extend({}, defaults, this.data || {}),
        isDetail:"1",//开票信息是否可以新增删除
        ticketList:[],
      };
    },
    components: {
      checkoutInfo,
      commonBillForm
    },
    methods: {
      handleCancel(){
        this.callback();
      },
      //查询预开票信息
      getApplyInfo(){
        ajaxRequest('get', 'back/ticketApply/'+this.$route.query.applyId, {}, res => {
          if (res.code === 200) {
            this.applyInfo = res.daoResult;
            this.getTicketData(this.applyInfo.id,this.applyInfo.source);
          }
        })
      },
      //查询开票信息
      getTicketData(id,source) {
        ajaxRequest(
          "get",
          "back/ticket/getTicketListByApply",
          {
            linkId: id,
            source:source,
          },
          res => {
            if (res.code == 200) {
              this.ticketList = res.rows;
            }
          }
        )
      },
      //取消 开票
      handleSubmit() {
        if(this.applyInfo.status==3){//已结账
          this.$message.error('预开票已结账，请先解除结账！');
        }else if(this.applyInfo.isLinkPayment==1) {
          this.$message.error('预开票已关联到款，请先撤销到款关联！');
        }else{
          let jsonObj={
            ticketApplyData:this.applyInfo,//预开票
            ticketList:this.ticketList,//开票信息
          };
          ajaxRequest('post', 'back/ticketApply/cancelFinanceBill',
            {json: JSON.stringify(jsonObj)}, function (res) {
              if (res.code === 200) {
                this.$message.success('操作成功');
                this.handleBack();
              } else {
                this.$message.error('操作失败');
              }
            }.bind(this))
        }
      },
      //取消开票前验证
      handleOpen(){
        if(this.applyInfo.status==3){//已结账
          this.$message.error('预开票已结账，请先解除结账！');
          return false;
        }else if(this.applyInfo.isLinkPayment==1) {
          this.$message.error('预开票已关联到款，请先撤销到款关联！');
          return false;
        }else{
          return true;
        }
      },
    },
    filters: {
      DateFormat(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      }
    },
    created() {
    },
    mounted(){
      /*this.getApplyInfo();*/
      this.getTicketData(this.data.id,this.data.source)
    }
  };
</script>
<style scoped>
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
</style>
