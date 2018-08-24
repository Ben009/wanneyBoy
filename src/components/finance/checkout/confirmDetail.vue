<template>
  <div>
    <div style="margin-left: 97%">
      <global-tootips>
        <p>1、	本功能适用于将缴费单关联挂账记录的结账操作；</p>
        <p>2、	左侧列表的查询条件为：缴费单关联挂账记录，可通过缴费单页面关联挂账记录功能进行关联操作；</p>
        <p>3、	结账后对应缴费单状态将变更为到款状态；</p>
        <p>4、	拒绝后相应金额将退回挂账记录；</p>
      </global-tootips>
    </div>
    <div class="title-item"><span>缴费单信息</span></div>
    <billDetail :billId="billId"></billDetail>
    <div class="title-item" style="margin-top: 20px"><span>结账信息</span></div>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="结账日期" prop="checkoutTime">
            <el-date-picker
              v-model="form.checkoutTime"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-Row>
    </el-form>

    <div style="text-align: center;margin-bottom: 20px">
      <!-- 绑定form提交事件-->
      <el-button type="primary" v-mindPopover="{message:'确认结账操作?',success:handleSubmit.bind(this),isOpen:handleOpen.bind(this)}">结 账</el-button>
      <el-button type="danger" v-mindPopover="{message:'确认拒绝操作？',success:handleRefuse.bind(this)}">拒 绝</el-button>
    </div>

    <div class="title-item" style="margin-top: 20px"><span>关联信息</span></div>
    <billClaimTicketList ref="ticket" :billId="billId"></billClaimTicketList>

  </div>

</template>
<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
  import billDetail from '../ticketApply/billDetail.vue';
  import billClaimTicketList from '../bill/billClaimTicketList.vue'
  import $ from 'jquery'


  const defaults = {
    checkoutTime: new Date(),
  };
  export default {
    props: {
      billData: {
        required: true
      },
      billId: {
        type: Number,
        required: true
      },
      billNo: {
        type: String,
        required: true
      },
      callback: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.checkoutTime),
        rules: {
          checkoutTime: [{type: 'date', required: true, message: '结账日期不能为空'}],//开票日期
        },
      };
    },
    components: {
      billDetail,
      billClaimTicketList,
    },
    methods: {
      // 结账
      handleSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.doSomething(this.form,this.billData,this.$refs.ticket.tableData,1);
          }
        });
      },
      //结账前验证
      handleOpen(){
        var flag = false;
        this.$refs.form.validate(valid => {
          if (valid) {
            flag = true;
          }else{
            flag = false;
          }
        });
        return flag;
      },
      //拒绝
      handleRefuse(){
        this.doSomething(this.form,this.billData,this.$refs.ticket.tableData,0);
      },
      //结账确认同意或者拒绝事件
      doSomething(form,billData,ticketList,flag) {

        let url = "back/checkRecord/confirmCheckout";
        if(flag ==0){//拒绝
          url ="back/checkRecord/refuseCheckoutConfirm";
        }

        let jsonObj={
          checkRecordData:form,//结账信息
          billData:billData,//缴费单信息
          ticketList:ticketList
        };
        ajaxRequest('post',url,{json:JSON.stringify(jsonObj)},(res) => {
            //刷新查询列表
            if (res.code == 200) {
              this.$message.success('操作成功！');
              this.callback();
            }
          });
      },
    },
    filters: {},
    created() {
    },
    mounted() {
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
