<template>
  <div>
    <chargeDetail ref="chargeDetail1" v-if="!!edit" :data="edit"></chargeDetail>
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
          <!--<el-form-item label="审核意见" prop="verifyAdvise">-->
          <!--<el-input type="textarea" style="width: 80%" v-model="verifyAdvise"></el-input>-->
          <!--</el-form-item>-->
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

  import chargeDetail from '../../business/charge/chargeDetail';
  import ElCol from "../../../common-el/packages/col/src/col";
    export default {
      name: "discount-verify",
      props: {
        data: {
          type: Object,
          required:true
        },
        sourceId: {
          type: String,
          required:true
        },
        callback: {
          type: Function,
          required:true
        }
      },
      data(){
        return{
          edit:null,
          verifyType:1,//审核结果
          verifyAdvise:""//审核意见
        }
      },
      watch:{
        sourceId(){
          this.getChargeApplyDetail(this.sourceId);
        },
      },
      methods:{
        handleOpen(){
          return true;
        },
        handleCancel(){
          this.callback();
        },
        handleAgreeSubmit(){
          this.handleSubmit(1);
        },
        handleRefuseSubmit(){
          this.handleSubmit(-1);
        },
        //折折扣审核操作
        handleSubmit(verifyType){
          if(this.verifyAdvise==="" && verifyType==-1){
            this.$message.error('请填写审核意见！');
            return ;
          }
          let _this = this;
          ajaxSyncRequest("post", "back/chargeApply/verifyDiscount",{
            id:_this.data.id,verifyType:verifyType,verifyAdvise:_this.verifyAdvise
          }, res => {
            if (res.code === 200) {
              _this.$message.success('操作成功！');
              _this.handleCancel();
            }else{
              _this.$message.error('系统异常！');
            }
          });
        },
        //审核前验证
        handleOpen(){
            return true;
        },
        getChargeApplyDetail(sourceId){
          let _this = this;
          ajaxSyncRequest("get", "back/entrustSjd/getEntrustSjdDetails",{registrationNo:sourceId}, res => {
            if (res.code === 200) {
              if(res.rows.length > 0){
                _this.edit=res.rows[0];
              }else{
                _this.$message.error("无效登记号");
              }
            }else{
              _this.$message.error("无效登记号");
            }
          });
//          _this.$nextTick(()=>{
//            if(_this.data.type===1){//折扣
//              _this.$refs.chargeDetail1.toDoDiscount(_this.data.zk);
//            }else if(_this.data.type===3){//总收
//              _this.$refs.chargeDetail1.toDoTotalCollection(_this.data.totalCollection);
//            }
//
//          })
        },
      },
      components:{
        ElCol,
        chargeDetail
      },
      mounted() {
        this.getChargeApplyDetail(this.data.sourceId);
      }
    }
</script>

