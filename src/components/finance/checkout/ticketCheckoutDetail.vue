<template>
    <div>
      <div style="margin-left: 97%">
        <global-tootips>
          <p>1、	本功能适用于申请预开票且已经开票、未到款的记录进行结账操作；</p>
          <p>2、	若原通过缴费单进行申请预开票，结账后缴费单状态变更为结账状态；</p>
          <p>3、	若原先通过无业务申请预开票，结账后相应的金额转入挂账记录，供后续业务发生时抵扣；</p>
          <p>4、	若客户通过银行转账，可使用：关联到款按钮关联转账记录；</p>
          <p>5、	若预开票已关联到款记录（即开票单位为蓝色），可点击撤销关联按钮解除关联到款信息；</p>
        </global-tootips>
      </div>
      <el-form ref="form" :rules="rules"   label-width="140px">
        <div class="title-item"><span>基本信息</span></div>
        <el-Row>
          <el-col :span="16">
            <el-form-item label="开票单位" >
              <el-input v-model="ticketApplyData.ticketCompany" :disabled="true"></el-input>
              <el-input v-model="ticketApplyData.companyId" v-show="false"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请金额" >
              <el-input type="number" v-model="ticketApplyData.ticketMoney" :disabled="true" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结账日期" prop="checkDate" >
              <el-date-picker v-model="checkDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="票种" prop="ticketType">
              <template slot = "label">
                <span>票种</span>
              </template>
              <el-select placeholder="请选择" value-key="name" v-model="ticketType" style="width: 100%" disabled>
                <el-option
                  v-for="(item,index) in ticketTypes" :key="index" :label="item.remark" :value="item.code*1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预结账方式" prop="checkWay">
              <template slot = "label">
                <span>付款方式</span>
              </template>
              <el-select placeholder="请选择" value-key="name" v-model="checkWay" style="width: 100%" disabled>
                <el-option
                  v-for="(item,index) in checkWays" :key="index" :label="item.remark" :value="item.code*1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-Row>
      </el-form>
      <detailTicket v-for="(item,index) in ticketList" :data="item"></detailTicket>

      <el-form  label-width="140px">
        <el-Row>
          <el-col :span="8">
            <el-form-item label="申请人" >
              {{ticketApplyData.userName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核人" >
              {{ticketApplyData.auditorName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票人" >
              {{ticketApplyData.drawerName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请时间" >
              {{ticketApplyData.addTime | yyyymmdd}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核时间" >
              {{ticketApplyData.auditTime | yyyymmdd}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票时间" >
              {{ticketApplyData.ticketOperateDate | yyyymmdd}}
            </el-form-item>
          </el-col>
        </el-Row>
      </el-form>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" v-mindPopover="{message:'确认结账操作?',success:ticketCheckout.bind(this),isOpen:handleOpen.bind(this)}">结 账</el-button>
        <el-button type="primary" v-if="accountSize===0" @click="accountClaim">关联到款</el-button>
        <el-button type="danger" v-if="accountSize>0" v-mindPopover="{message:'确认取消关联到款？',success:cancelClaim.bind(this)}">取消关联</el-button>
      </div>
      <div v-show="applySource=='1'" class="title-item"><span>关联业务信息</span></div>
      <!--缴费单详情页-->
      <commonBillForm v-if="applySource=='1'" :id="billId"></commonBillForm>
      <!--已关联到款列表页面-->
      <associated ref="associated" :source="2" :mySourceId="sourceId"></associated>
      <!--关联到款页面-->
      <accountClaimPage v-if="!!claim" :callback="claimCallback" :source="2" :totalBalance="totalMoney" :sourceId="sourceId"></accountClaimPage>
    </div>
</template>
<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import { ajaxRequest, ajaxProxyRequest,ajaxSyncRequest,formatDate } from "../../util/base";
  import detailTicket from "../checkout/detailTicket.vue";
  import commonBillForm from './../bill/commonBillForm.vue';
  import accountClaimPage from './accountClaimPage.vue';
  import associated from './associated.vue';
  import $ from 'jquery'

  const defaults = {
    ticketDate :new Date(),
  };
  export default {
    props:{
      ticketApplyData:{
        required:true
      },
      applyId:{
        type:Number,
        required:true
      },
      applySource:{
        type:Number,
        required:true
      },
      billId:{
        type:Number,
      },
      callback:{
        type:Function,
        required:true
      },
      sourceId: {
        type:Number,
        required:true
      },
      totalMoney: {
        type:Number,
        required:true
      },
    },
    data() {
      let checkDateCheck = (rule,value,cb)=>{
        if(this.checkDate){
          cb();
        }else{
          cb(new Error('结账日期不能为空'));
        }
      };
      return {
        rules:{
          checkDate: [{required: true, validator:checkDateCheck,trigger:'blur'}],//开票日期
        },
        ticketList:[],
        claim:false,//关联到款弹层
        list:[],//关联到款list(接收从associated页面传来的已关联list，然后将它传到accountClaim页面展示并判断是否更新)

        ticketTypes:[],//票种
        checkWays:[],//结账方式
        ticketType:0,//票种
        checkWay:0,//结账方式
        checkDate:new Date(),//结账日期
        accountSize:0
      };
    },
    components: {
      detailTicket,
      commonBillForm,
      accountClaimPage,
      associated
    },
    methods: {
      //关联到款弹层的回调
      claimCallback(){
        this.claim=false;
        this.$refs.associated.getAssociated();//回调associated页面的方法
        this.checkAccountSize();
      },
      //判断是否已关联到款
      checkAccountSize(){
        ajaxRequest('get','back/accountRecord/getAccountInfoBySourceAndSourceId',{
          source:"2",
          sourceId:this.sourceId
        },(res)=>{
          if(res.code===200){
            this.accountSize=res.rows.length;
          }
        })
      },
      //撤销关联
      cancelClaim(){
        let _this = this;
        ajaxRequest('post','back/accountRecord/cancelClaimForCheck',{
          source:"2",
          sourceId:this.sourceId
        },(res)=>{
          if(res.code===200){
            _this.$message.success('操作成功！');
            this.claimCallback();
          }
        })
      },
      //关联到款
      accountClaim() {
        if(this.totalMoney!==0){
          this.claim=true;
        }else{
          this.$message.warning('结账金额总和不能等于0');
        }
      },
      //获取发票列表
      getTicketData: function () {
        ajaxRequest(
          "get",
          "back/ticket/getTicketListByApply",
          {
            linkId: this.applyId,
            source: this.applySource,
          },
          res => {
            if (res.code == 200) {
              this.ticketList = res.rows;
              this.ticketType=res.rows[0].ticketType;//票种
              this.checkWay=res.rows[0].checkWay;//结账方式
            }
          }
        )
      },

      //结账操作
      ticketCheckout(){
        if(this.checkDate){
        }else{
          this.$message.error('请选择结账日期!');
          return;
        }
        ajaxRequest('post', "back/checkRecord/ticketCheckout",
          {
            applyId:this.applyId,
            applySource:this.applySource,
            checkDate : this.checkDate
          },
          (res) => {
            if(res.code===200){
              this.$message.success('操作成功！');
              this.callback();
            }else{
              this.$message.error('操作异常!');
            }
          });
      },
      //结账前验证
      handleOpen(){
        if(this.checkDate){
          return true;
        }else{
          this.$message.error('请选择结账日期!');
          return false;
        }
      },

      //票种
      getTicketType() {
        ajaxProxyRequest("get", "/njmind/findParam/ticketType", {}, res => {
          this.ticketTypes = res.list;
        });
      },
      //付款方式
      getCheckWay() {
        ajaxProxyRequest("get", "/njmind/findParam/checkWay", {}, res => {
          this.checkWays = res.list;
        });
      },
    },
    created() {
    },
    mounted(){
      this.getTicketType();
      this.getCheckWay();
      this.getTicketData();
      this.checkAccountSize();
    },
    destroyed(){
      this.$store.commit('RESET_FINANCE_STATE')
    },
    filters: {
      yyyymmdd(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      },
    },
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
