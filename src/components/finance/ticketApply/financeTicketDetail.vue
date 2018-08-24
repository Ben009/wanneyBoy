<template>
  <div>
    <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <el-form :model="applyInfo" label-width="140px">
      <div class="title-item"><span>基本信息</span></div>
      <el-Row>
        <el-col :span="24">
          <el-form-item label="开票单位" prop="ticketCompany">
            {{applyInfo.ticketCompany}}
            <el-input v-model="applyInfo.companyId" v-show="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请金额" prop="ticketMoney">
            {{applyInfo.ticketMoney}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票日期" prop="ticketDate">
            {{applyInfo.ticketDate | DateFormat}}
          </el-form-item>
        </el-col>
      </el-Row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开票人" prop="drawerName">
            {{applyInfo.drawerName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作时间" prop="ticketOperateDate">
            {{applyInfo.ticketOperateDate}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="结账人" prop="drawer">
            {{applyInfo.checkName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作时间" prop="ticketOperateDate">
            {{applyInfo.checkTime}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="title-item"><span>发票信息</span></div>
    <checkoutInfo v-for="(item,index) in ticketList" :data="item"></checkoutInfo>
    <div v-show="applyInfo.source=='1'" class="title-item"><span>关联业务信息</span></div>
    <commonBillForm v-if="applyInfo.source=='1'" :id="applyInfo.billId"></commonBillForm>
  </div>

</template>
<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import { ajaxRequest, ajaxSyncRequest,formatDate } from "../../util/base";
  import checkoutInfo from "../checkout/ticketDetail.vue";
  import commonBillForm from '../bill/commonBillForm.vue';
  import $ from 'jquery'

  export default {
    props:{
      data:{
        type:String,
      },
    },
    data() {
      return {
        applyInfo:{},
        isDetail:"1",//开票信息是否可以新增删除
        ticketList:[],
      };
    },
    components: {
      checkoutInfo,
      commonBillForm,
    },
    methods: {
      //查询预开票信息
      getApplyInfo(){
        ajaxRequest('get', 'back/ticketApply/'+this.data, {}, res => {
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
    },
    filters: {
      DateFormat(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      }
    },
    created() {
    },
    mounted(){
      this.getApplyInfo();

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
