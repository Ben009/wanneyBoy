<template>
  <div class="entrust-item">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="基本信息"><applianceForm  :data="data" :callback="handleEditCallback"></applianceForm></el-tab-pane>
      <el-tab-pane label="日志信息"><applianceLogList  :applianceId="data.id" :callback="handleEditCallback"></applianceLogList></el-tab-pane>
      <el-tab-pane name="exist"><el-button slot="label" type="danger" style="border:1px solid #8da3d6; color:#602666;" > 返回</el-button></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import Vue from 'vue';

  import {ajaxRequest,ajaxSyncRequest} from '../../util/base'
  import $ from 'jquery'
  import applianceForm from './applianceForm'
  import applianceLogList from './applianceLogList'

  export default {
    name: "appliance-edit", 
    components:{
      applianceForm,applianceLogList
    },
    props:{
      data:{
        type:Object,
        required:true
      },
      callback:{
        type:Function,
        required:true,
      }
    },
    data(){

      return {
      }
    },
    computed:{

    },
    mounted(){
    },
    methods:{
      handleClick(tab,e){
        if(tab.name=='exist'){
          this.callback();
        }
      },
      // 传入子页面的回调函数
      handleEditCallback() {
        this.callback();
      },
    },

  }
</script>

<style scoped>
/* .back{
  color: red;
  background-color: black;
} */
.custom-1d74b7 .el-button--danger:focus, .custom-1d74b7 .el-button--danger:hover {
    background: none!important;
    border-color:#409eff!important;
    /*color: #fff;*/
}
</style>
