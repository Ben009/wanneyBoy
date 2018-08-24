<template>
  <el-tabs  type="border-card" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="instrumentationInfo" >
      <instrumentationForm ref="instrumentationInfo" :callback="callback" :audId="audId" @headCallBack="headcall" :standard-id="standardId" :review-instid="reviewInstid" :replay-instid="replayInstid" :check-id="checkId" @back="demo" :info="type"></instrumentationForm>
    </el-tab-pane>
    <el-tab-pane label="图文信息" name="fileCheck" >
      <file-check ref="fileCheck" :formData="formData" @headCallBack="headcall" :inst-id="instId" :standard-id="standardId" :review-instid="reviewInstid" :replay-instid="replayInstid" :check-id="checkId"  :info="type"></file-check>
    </el-tab-pane>

    <el-tab-pane label="溯源信息" name="applianInfo" :disabled="disabled">
      <applianceDetail ref="applianInfo" :callback="callback" :inst-id="instId"  :standard-id="standardId" :review-id="reviewId" :review-instid="reviewInstid" :replay-id="replayId" :replay-instid="replayInstid" :check-id="checkId"  :info="type"></applianceDetail>
    </el-tab-pane>

    <el-tab-pane label="核查信息" name="executeState" :disabled="disabled">
      <quotationState ref="executeState" :callback="callback" :inst-id="instId" :standard-id="standardId" :review-instid="reviewInstid" :replay-instid="replayInstid" :check-id="checkId"  :info="type"></quotationState>
    </el-tab-pane>
    <el-tab-pane label="保养信息" name="maintainInfo" :disabled="disabled">
      <maintain-info ref="maintainInfo" :callback="callback" :inst-id="instId"  :standard-id="standardId" :review-instid="reviewInstid" :replay-instid="replayInstid" :check-id="checkId" @back="demo" :type="type"></maintain-info>
    </el-tab-pane>
    <el-tab-pane label="稳定性记录" name="stability" :disabled="disabled">
      <record key="stability" type="stability" ref="stability" :callback="callback" :inst-id="instId" :standard-id="standardId" :review-instid="reviewInstid" :replay-instid="replayInstid" @back="demo" :check-id="checkId"  :info="type"></record>
    </el-tab-pane>
    <el-tab-pane label="重复性记录" name="repeatability" :disabled="disabled">
      <record key="repeatability" type="repeatability" ref="repeatability" :callback="callback" :standard-id="standardId" :inst-id="instId" :review-instid="reviewInstid" :replay-instid="replayInstid" @back="demo" :check-id="checkId"  :info="type"></record>
    </el-tab-pane>
    <el-tab-pane label="历史痕迹" name="trackHistory" :disabled="disabled">
      <track-history ref="trackHistory" :callback="callback" :inst-id="instId" :standard-id="standardId" :review-instid="reviewInstid" :replay-instid="replayInstid" :check-id="checkId"  :info="type"></track-history>
    </el-tab-pane>

    <el-tab-pane v-if="comeback && type != 'traceabilityConfirm' " name="exist">
      <el-button slot="label" type="danger" style="border:1px solid #8da3d6; color:#602666;" @click="demo"> 返回</el-button>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Vue from "vue";

import instrumentationForm from "./instrumentationAdd/instrumentationForm.vue";
import applianceDetail from "./instrumentationAdd/applianceDetail.vue";
import quotationState from "./instrumentationAdd/quotationState.vue";
import fileCheck from './instrumentationAdd/fileCheck.vue'
import maintainInfo from './instrumentationAdd/maintainInfo.vue'
import record from './instrumentationAdd/record.vue'
import trackHistory from './instrumentationAdd/trackHistory.vue'
import $ from "jquery";

export default {
  props: {
    data: {
      type: Object
    },
    callback: {
      type: Function
    },
    standardId:{
      required:false,
    },
    audId:{
      required: false
    },

    // type字段用来区分在某个页面进入详情页面需要的特殊操作，默认为空值/false;
    // type == weeklyCheckTask  从周检任务进入，跳入溯源信息页面
    // type == search 从查询页面进入
    // traceabilityConfirm 溯源确认进入详细页面
    //  type == inspectRecordTab 核查记录 ->  executeState
    //  type == maintainRecordTab 保养记录 -> maintainInfo
    //  type == repeatabilityRecordTab 重复性记录 -> repeatability
    //  type == stabilityRecordTab 稳定性记录 -> repeatability
    type:{
      required:false,
      type:String,
      default:undefined,
    },
    // 用语溯源记录的重新送审
    replayId:{
      required:false,

    },
  },
  components: { instrumentationForm,
                quotationState,
                applianceDetail,
                fileCheck,
                maintainInfo,
                record,
                trackHistory },
  data() {
    return {
      form:$.extend(null,this.data),
      activeName: "instrumentationInfo",
      disabled: true,
      instId:'',
      comeback:false,
      count:1,
      // 要传入其他tab页的表单信息
      formData:null
    };
  },
  methods: {
    demo(){
      this.$emit('goBack')
      this.disabled=true
    },
    handleClick(tab, event) {
      if(tab.name=='exist'){
        this.demo()
      }
    },
    headcall(data){
      if(data){
        // 传入的id值与表单数据
        this.instId=data.id
        this.formData = data.data
        this.disabled=false
      }
    }
  },
  computed:{
    // 仪器设备id
    // standardId(){
    //     return this.$route.query.id
    //   },
      // 关于以下的id名称不是太理解，暂且不予考虑
    reviewId(){
        return this.$route.query.reviewId
    },
    reviewInstid(){
      return this.$route.query.reviewInstid
    },

    replayInstid(){
      return this.$route.query.replayInstid
    },
    checkId(){
      return this.$route.query.checkId
    }
  },
  mounted(){
    console.log(this.type,'type')
    if(this.standardId){
      this.instId=this.standardId
      this.disabled=false
      this.comeback=true
    }
    if(this.reviewId){
      this.activeName="applianInfo"
      this.disabled=false
      this.comeback=true
    }
    if(this.replayId){
      this.activeName="applianInfo"
      this.disabled=false
      this.comeback=true
    }
    if(this.checkId){
      this.disabled=false
      this.comeback=true
    }
    // if(this.type === 'weeklyCheckTask'){
    //   this.disabled = false;
    //   this.activeName = 'applianInfo';
    //   this.comeback = true;
    // }
    if(this.type){
      switch(this.type){
        case 'weeklyCheckTask' : {
          this.disabled = false;
          this.activeName = 'applianInfo';
          this.comeback = true;
          };
        break;
        case 'inspectRecordTab' : {
          this.disabled = false;
          this.activeName = 'executeState';
          this.comeback = true;
          };
          break;
        case 'maintainRecordTab': {
          this.disabled = false;
          this.activeName = 'maintainInfo';
          this.comeback = true;
          };
          break ;
        case 'repeatabilityRecordTab': {
          this.disabled = false;
          this.activeName = 'repeatability';
          this.comeback = true;
          };
          break ;
        case 'stabilityRecordTab': {
          this.disabled = false;
          this.activeName = 'repeatability';
          this.comeback = true;
          };
          break ;
          default:{

          };
      }
    }
  },

};
</script>
