<template>
  <mind-dialog
    :title="'结账详情'"
    :visible="true"
    dialogSize="large"
    center
    v-dialogDrag
    @close="handleCancel">
  <div>
    <!--0无业务预开票，1缴费单预开票，2缴费单结账，3其他条件结账，4结账确认-->
    <div v-show="checkoutInfo.source!=0" class="title-item"><span>关联业务信息</span></div>
    <billDetail v-if="checkoutInfo.source==2 || checkoutInfo.source==4 " :billId="checkoutInfo.linkId"></billDetail>
    <billDetail ref="djhList" v-if="checkoutInfo.source==3" :billId="checkoutInfo.linkId" :isShowBh="1"></billDetail>
    <billDetail v-if="checkoutInfo.source==1" :billId="checkoutInfo.billId"></billDetail>
    <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <div class="title-item" v-if="checkoutInfo.source!=4"><span>结账信息</span></div>
    <el-form :model="checkoutInfo" label-width="140px">
      <el-Row v-if="checkoutInfo.source==0 || checkoutInfo.source==1">
        <el-col :span="8">
          <el-form-item label="开票单位">
            <el-input v-model="checkoutInfo.companyName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结账金额">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input type="number" v-model="checkoutInfo.money" disabled ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票日期">
            <el-date-picker
              v-model="checkoutInfo.ticketDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd" disabled style="width: 100%;"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row v-if="checkoutInfo.source==2 || checkoutInfo.source==3">
        <el-col :span="8">
          <el-form-item label="结账日期">
            <el-date-picker
              v-model="checkoutInfo.checkoutTime"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd" disabled style="width: 100%;"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
        <el-col :span="8">
          <el-form-item label="结账方式" prop="checkWay">
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
      <el-row v-if="checkoutInfo.source!=4">
        <el-col :span="24">
          <detailTicket v-for="(item,index) in ticketList" :data="item"></detailTicket>
        </el-col>
      </el-row>
      <div v-if="checkoutInfo.source==4" class="title-item" style="margin-top: 20px"><span>关联信息</span></div>
      <billClaimTicketList v-if="checkoutInfo.source==4" :billId="checkoutInfo.linkId"></billClaimTicketList>
      <el-row>
        <el-col :span="8">
          <el-form-item label="结账人" >{{checkoutInfo.creatorName}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作时间" >{{checkoutInfo.createTime||handleTime}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <associated v-if="checkoutInfo.source==0 || checkoutInfo.source==1" :source="2" :mySourceId="checkoutInfo.linkId"></associated>
    <associated v-if="checkoutInfo.source==2 || checkoutInfo.source==3" :source="1" :mySourceId="checkoutInfo.linkId"></associated>
    <div style="text-align: center;margin-bottom: 20px">
      <!-- 绑定form提交事件-->
      <el-button type="danger" v-if="cancelPower" v-mindPopover="{message:'是否确认取消结账？',success:handleSubmit.bind(this)}">取消结账</el-button>
      <el-button type="success" v-if="checkoutInfo.source==3" @click="toPrint">打 印</el-button>
      <el-button @click="handleCancel">返 回</el-button>
    </div>
  </div>
  </mind-dialog>
</template>
<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import { ajaxRequest, ajaxSyncRequest,ajaxProxyRequest,formatDate } from "../../util/base";
  import detailTicket from "./detailTicket.vue";
  import billDetail from '../ticketApply/billDetail.vue';
  import billClaimTicketList from '../bill/billClaimTicketList.vue'
  import associated from './associated.vue';

  import $ from 'jquery'

  let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限

  export default {
    props:{
      //结账信息
      checkoutInfo: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        isDetail:"1",//开票信息是否可以新增删除
        ticketList:[],//发票信息
        associatedList:[],//关联到款记录
        cancelPower:false,//解除结账权限
        ticketTypes:[],//票种
        checkWays:[],//结账方式
        ticketType:0,//票种
        checkWay:0,//结账方式
      };
    },
    components: {
      detailTicket,
      billDetail,
      billClaimTicketList,
      associated
    },
    methods: {
      //查询开票信息
      getTicketData() {
        if(this.checkoutInfo.source!=4){
          ajaxRequest(
            "get",
            "back/ticket/getTicketListByApply",
            {
              linkId: this.checkoutInfo.linkId,
              source:this.checkoutInfo.source,
            },
            res => {
              if (res.code == 200) {
                this.ticketList = res.rows;
                this.ticketType=res.rows[0].ticketType;//票种
                this.checkWay=res.rows[0].checkWay;//结账方式
              }
            }
          )
        }

      },
      //取消结账
      handleSubmit() {
        let _this = this;
        ajaxRequest('post', 'back/checkRecord/cancelCheckout',
          _this.checkoutInfo, function (res) {
            if (res.code === 200) {
              _this.$message.success('操作成功');
              _this.handleCancel();
            } else if(res.code === 300){
              _this.$message.error(res.msg);
            }else{
              _this.$message.error('操作失败');
            }
          }.bind(this))
      },
      //返回
      handleCancel(){
        this.callback();
      },
      //获取关联到款列表
      getAssociated(){
        ajaxRequest('get','back/accountRecord/getAccountInfoBySourceAndSourceId',{
          source:1,
          sourceId:this.checkoutInfo.linkId
        },(res)=>{
          if(res.code===200){
            for(var i=0;i<res.rows.length;i++){
              let newDate=new Date(res.rows[i].PAY_TIME).format('YYYY-MM-DD');
              res.rows[i].PAY_TIME=newDate;
            }
            this.associatedList=res.rows;
          }
        })
      },
      //打印
      toPrint(){
        var list = this.$refs.djhList.tableData;
        var djhs = "";
        for(var i=0 ;i<list.length;i++) {
          djhs = djhs + "'"+list[i].REGISTRATION_NO+"',";
        }
        djhs = djhs.substring(0,djhs.length-1);
        this.printHtml("otherCheckOutPrint",{registration_no:djhs});
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
    filters: {
      handleTime(date) {
        return formatDate(date, "YYYY-MM-DD");
      },
    },
    mounted(){
      this.getTicketType();
      this.getCheckWay();
      this.getTicketData();
      this.getAssociated();

      if(btnPower.indexOf("@M33110@") !=-1){//取消结账权限
        this.cancelPower = true;
      }else{
        this.cancelPower = false;
      }
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
