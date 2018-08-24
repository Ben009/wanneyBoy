<template>
    <div>
      <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
      <el-form :model="form" :rules="rules" label-width="140px">
        <div class="title-item" style="text-align: left;margin-bottom: 10px">
          <span style="width: 95%">基本信息</span>
          <span style="width: 5%">
          <global-tootips :width="600">
            <p>1、本页面适用于预开发票的开票操作；可对所有通过审核的预开发票申请进行预开票操作；</p>
            <p>2、若需预开发票，需先通过缴费单申请开票，或通过预开票申请节点申请预开票；</p>
            <p>3、读取功能为：系统以本台计算机上一次的发票号码加1默认为本次发票号码，若不正确可修改；</p>
            <p>4、当预开票申请为多张发票时，需对每一张发票登记发票信息；</p>
            <p>5、若无发票号，可输入/，系统针对非/的发票号进行排重检查，若重复将进行提示。</p>
          </global-tootips>
          </span>
        </div>
        <el-Row>
          <el-col :span="12">
            <el-form-item label="添加人" prop="userName">
              <span>{{form.userName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="添加时间" prop="addTime">
              <span>{{form.addTime}}</span>
            </el-form-item>
          </el-col>
        </el-Row>
        <el-Row>
          <el-col :span="12">
            <el-form-item label="审核人" prop="auditorName">
              <span>{{form.auditorName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核时间" prop="auditTime">
              <span>{{form.auditTime}}</span>
            </el-form-item>
          </el-col>
        </el-Row>
        <el-Row>
          <el-col :span="24">
            <el-form-item label="开票单位" prop="ticketCompany">
              <el-input v-model="form.ticketCompany" :disabled="true"></el-input>
              <el-input v-model="form.companyId" v-show="false"></el-input>
            </el-form-item>
          </el-col>
        </el-Row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请金额" prop="ticketMoney">
              <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
              <el-input type="number" v-model="form.ticketMoney" :disabled="true" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  prop="ticketDate">
              <template slot = "label">
                <span>开票日期</span>
                <el-tooltip class="item" effect="dark" content="预开发票的开票日期">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-date-picker
                v-model="form.ticketDate"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd" style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-Row>
      </el-form>
      <div class="title-item"><span>发票信息</span></div>
      <checkoutInfo v-for="(item,index) in ticketList"
                    ref="form"
                    :dataindex="index"
                    :data="item"
                    :key="index"
                    :isDetail="isDetail"
                   ></checkoutInfo>
      <div style="text-align: center;margin-top: 10px">
        <!-- 绑定form提交事件-->
        <el-button type="primary" v-mindPopover="{message:'确定开票?',success:handleSubmit.bind(this),isOpen:handleOpen.bind(this)}">开 票</el-button>
      </div>

      <div v-show="applySource=='1'">
        <div class="title-item"><span>缴费单信息</span></div>
        <div>
          <commonBillForm :id="billId"></commonBillForm>
        </div>
      </div>
    </div>

</template>
<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import { ajaxRequest, ajaxSyncRequest,formatDate } from "../../util/base";
  import checkoutInfo from "../checkout/checkoutInfo.vue";
  import billDetail from './billDetail.vue';
  import $ from 'jquery';
  import commonBillForm from '../bill/commonBillForm.vue';

/*   import {
    Button,
    Table,
    TableColumn,
    Row,
    Col,
    Radio,
    RadioGroup,
  } from "element--ui";
  Vue.use(Button);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Radio);
  Vue.use(RadioGroup); */

  const defaults = {
    ticketDate :new Date(),
  };
  export default {
    name:'financeBillInfo',
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
      }
    },
    data() {
      return {
        form:{},
        isDetail:"1",//开票信息是否可以新增删除
        rules:{
          ticketDate: [{type: 'date', required: true, message: '开票日期不能为空'}],//开票日期
        },
        ticketList:[],
      };
    },
    components: {
      checkoutInfo,
      billDetail,
      commonBillForm,
    },
    watch: {
      applyId(){
        this.getTicketData(this.applyId,this.applySource);
      },
      ticketApplyData() {
        if(!this.ticketApplyData.ticketDate){
          console.log("delete");
          delete this.ticketApplyData.ticketDate
          this.form=$.extend({},defaults,this.ticketApplyData)
        }else {
          console.log("not");
          this.ticketApplyData.ticketDate = new Date(this.ticketApplyData.ticketDate)
          this.form=$.extend({},this.ticketApplyData)
        }
      }
    },
    methods: {
      getTicketData(id,source) {
        if (id){
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
        }else {
          this.ticketList=[]
        }

      },
      // 开票
      handleSubmit() {
        let ticketMoneyTotal = Number(0),errorFlag = true;
        if(this.form.ticketDate === ''||this.form.ticketDate === null){
          this.$message.error('开票日期未填写');
          errorFlag = false;
          return;
        }
        console.log(this.form.ticketDate,"开票日期")
        this.ticketList.forEach((v, i) => {

          //开票金额
          let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
          if (!regu.test(v.ticketMoney)) {
            this.$message.error('第' + (i + 1) + '个开票信息发票金额请填写正数');
            errorFlag = false;
            return;
          }

          ticketMoneyTotal += Number(v.ticketMoney);
          if (v.ticketMoney === '') {
            this.$message.error('第' + (i + 1) + '个开票信息未填写发票金额');
            errorFlag = false;
            return;
          }
          if (v.ticketMoney === 0) {
            this.$message.error('第' + (i + 1) + '个开票信息开票金额不能为0');
            errorFlag = false;
            return;
          }
          if (v.ticketCode === ''||v.ticketCode===null) {
            this.$message.error('第' + (i + 1) + '个开票信息未填写发票号');
            errorFlag = false;
            return;
          }
          for(let m=i+1;m<this.ticketList.length;m++){
            if(v.ticketCode !="" && v.ticketCode !=undefined && v.ticketCode==this.ticketList[m].ticketCode){
              this.$message.error('存在重复发票号,请确认发票号信息');
              errorFlag = false;
              return;
            }
          }
          console.log(v.ticketCode,"发票号")
        });
        if(errorFlag===false){
          return;
        }
        if (this.form.ticketMoney != ticketMoneyTotal) {
          this.$message.error('开票金额与申请金额不一致');
          errorFlag = false;
          return;
        }
        if(errorFlag){
          let checkoutDate = new Date(this.form.ticketDate).format('YYYY-MM-DD');
          Vue.set(this.form, "ticketDate", checkoutDate);
          this.callback(this.form,this.ticketList);
          console.log(this.form,this.ticketList,'开票信息')
        }
      },
      //提交前验证
      handleOpen(){
        let ticketMoneyTotal = Number(0),errorFlag = true;
        if(this.form.ticketDate === ''||this.form.ticketDate === null){
          this.$message.error('开票日期未填写');
          errorFlag = false;
          return;
        }
        console.log(this.form.ticketDate,"开票日期")
        for(let i=0;i<this.ticketList.length;i++){
          //开票金额
          let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
          if (!regu.test(this.ticketList[i].ticketMoney)) {
            this.$message.error('第' + (i + 1) + '个开票信息发票金额请填写正数');
            errorFlag = false;
            return;
          }

          ticketMoneyTotal += Number(this.ticketList[i].ticketMoney);
          if (this.ticketList[i].ticketMoney === '') {
            this.$message.error('第' + (i + 1) + '个开票信息未填写发票金额');
            errorFlag = false;
            return;
          }
          if (this.ticketList[i].ticketMoney === 0) {
            this.$message.error('第' + (i + 1) + '个开票信息开票金额不能为0');
            errorFlag = false;
            return;
          }
          if (this.ticketList[i].ticketCode === ''||this.ticketList[i].ticketCode===null) {
            this.$message.error('第' + (i + 1) + '个开票信息未填写发票号');
            errorFlag = false;
            return;
          }
          for(let m=i+1;m<this.ticketList.length;m++){
            if(this.ticketList[i].ticketCode !="" && this.ticketList[i].ticketCode !=undefined && this.ticketList[i].ticketCode==this.ticketList[m].ticketCode){
              this.$message.error('存在重复发票号,请确认发票号信息');
              errorFlag = false;
              return;
            }
          }
        }
        if(errorFlag===false){
          return false;
        }
        if (this.form.ticketMoney != ticketMoneyTotal) {
          this.$message.error('开票金额与申请金额不一致');
          errorFlag = false;
          return false;
        }else {
          return true;
        }
      }
    },
    filters: {
    },
    created() {
    },
    mounted(){
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
