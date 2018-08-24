<template>
  <div>
    <!-- 缴费单中申请折扣的登记号 -->
    <div >
      <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%" >
        <el-table-column prop="ORDER_NO" label="委托单编号"></el-table-column>
        <el-table-column prop="COMPANY_NAME" label="委托单位"></el-table-column>
        <el-table-column prop="REGISTRATION_NO" label="登记号" ></el-table-column>
        <el-table-column prop="APPLIANCE_NAME" label="器具名称" ></el-table-column>
        <el-table-column prop="SET_NUMBER" label="套数" ></el-table-column>
        <el-table-column prop="JDF_ACTUAL" label="检测费（实收）" ></el-table-column>
        <el-table-column prop="FJF_ACTUAL" label="附加费（实收）" ></el-table-column>
        <el-table-column prop="XLF_ACTUAL" label="修理费（实收）" ></el-table-column>
        <el-table-column prop="JJF_ACTUAL" label="加急费（实收）" ></el-table-column>
        <el-table-column prop="FWF_ACTUAL" label="服务费（实收）" ></el-table-column>
        <el-table-column prop="QTF_ACTUAL" label="其他费（实收）" ></el-table-column>
        <el-table-column prop="DISCOUNT" label="折扣" ></el-table-column>
        <el-table-column prop="WORKLOAD_ACTUAL" label="工作量（实收）" ></el-table-column>
        <el-table-column prop="INTENSIVE_WORKLOAD_ACTUAL" label="强检工作量（实收）" ></el-table-column>
        <el-table-column prop="TOTAL_ACTUAL" label="费用合计（实收）" ></el-table-column>
      </el-table>
    </div>

    <div class="title-item" style="text-align: left;margin-bottom: 10px"><span>审核区域</span></div>
    <div>
      <el-row>
        <el-col :span="6">申请原因：{{data.applyReason}}</el-col>
        <el-col :span="6" v-if="data.type===1">申请折扣值：{{data.zk}}</el-col>
        <el-col :span="6" v-if="data.type===3">申请总收值：{{data.totalCollection}}</el-col>
      </el-row>
    </div>
    <div style="margin-top: 15px">
      <el-row>
        <el-col :span="24" style="line-height: 55px;">
          审核意见：
          <span>
            <el-input type="textarea" style="width: 80%" v-model="verifyAdvise"></el-input>
          </span>


        </el-col>
      </el-row>
    </div>
    <div style="text-align: center">
      <el-button type="primary" v-mindPopover="{message:'确定同意折扣申请?',success:handleAgreeSubmit.bind(this),isOpen:handleOpen.bind(this)}">同 意</el-button>
      <el-button type="warning" v-mindPopover="{message:'确定退回折扣申请?',success:handleRefuseSubmit.bind(this),isOpen:handleOpen.bind(this)}">退 回</el-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxSyncRequest} from '../../util/base';

    export default {
      name: "discount-verify-bill",
      props: {
        data: {
          type: Object,
          required:true
        },
        callback: {
          type: Function,
          required:true
        },
        applyId: {
          type: Number,
          required:true
        }
      },
      data(){
        return{
          edit:null,
          verifyType:1,//审核结果
          verifyAdvise:"",//审核意见
          tableData:[],
        }
      },
      watch:{
        applyId(){
          this.getTableList(this.applyId);
        },
      },
      methods:{
        handleOpen(){
          return true;
        },
        getTableList (applyId) {
          ajaxRequest('get', 'back/bill/getBillZkApplySjdList', {apply_id:applyId}, (res) => {
            if (res.code === 200) {
              this.tableData = res.rows
            }
          });
        },
        handleAgreeSubmit(){
          this.handleSubmit(1);
        },
        handleRefuseSubmit(){
          this.handleSubmit(-1);
        },
        handleSubmit(verifyType){
          if(this.verifyAdvise==="" && verifyType== -1){
            this.$message.error('请填写审核意见！');
            return;
          }

          let _this = this;
          ajaxSyncRequest("post", "back/chargeApply/verifyDiscount",{
            id:_this.data.id,verifyType:verifyType,verifyAdvise:_this.verifyAdvise
          }, res => {
            if (res.code === 200) {
              _this.$message.success('操作成功！');
              _this.callback();
            }else{
              _this.$message.error('系统异常！');
            }
          });
        }
      },
      mounted() {
        this.getTableList(this.applyId);
      }
    }
</script>

