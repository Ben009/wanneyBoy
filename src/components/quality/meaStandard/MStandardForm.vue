<template>
  <div class="MstandardForm">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="基础信息" name="baseDetail">
        <base-detail :isAdd="isAdd"></base-detail>
      </el-tab-pane>
      <el-tab-pane label="主/配套信息" name="experience" :disabled="!isdisabled">
        <experience :isAdd="isAdd"></experience>
      </el-tab-pane>
      <el-tab-pane label="开展校验项目" name="support" :disabled="!isdisabled">
        <support :isAdd="isAdd"></support>
      </el-tab-pane>
      <el-tab-pane label="技术资料" name="technicalBase" :disabled="!isdisabled">
        <technical-base :isAdd="isAdd"></technical-base>
      </el-tab-pane>
      <el-tab-pane label="使用记录" name="sour-record" v-if="standardId">
        <sout-record></sout-record>
      </el-tab-pane>
      <el-tab-pane label="审核记录" name="audlt" v-if="standardId">
        <audit-list-record></audit-list-record>
      </el-tab-pane>
      <el-tab-pane v-if="standardId" name="exist">
        <el-button slot="label" type="danger">返回</el-button>
      </el-tab-pane>
    </el-tabs>
    <audit-comp class="mt20" v-if="standardId" :standardId="standardId" @goBack="back"></audit-comp>
  </div>
</template>

<script>
  import baseDetail from './standardFormComp/baseDetail'
  import experience from './standardFormComp/experience'
  import support from './standardFormComp/support'
  import auditComp from './standardFormComp/auditCommon'
  import auditListRecord from './standardFormComp/auditListRecord'
  import soutRecord from './SoutRecord.vue'
  import technicalBase from './standardFormComp/technicalBase'
  export default {
    name: "mStandardForm",
    props:{
      standardId:{
        required:false,
        default:null,
      },
      isAdd:{
        type:Boolean,
        default:true,
      }
    },
    data() {
      return {
        activeName:'baseDetail',
      }
    },
    computed:{
      isdisabled(){
        return this.$store.state.Mstandard.currentStandardId
      },
    },
    methods:{
      goBack(){
        this.$emit('goBack')
      },
      handleClick(tab){
        if(tab.name == 'exist'){
          this.goBack()
        }
      },
      back(){
        this.goBack();
      }
    },
    components:{
      baseDetail,
      experience,
      support,
      auditComp,
      auditListRecord,
      soutRecord,
      technicalBase
    },
    mounted(){
      if(this.standardId){
        this.$store.commit('CURRENT_STANDARD_ID',this.standardId)
      }
    },
    destroyed(){
      this.$store.commit('RESET_STATE')
    }
  }
</script>

<style lang="scss" scoped>
  .MstandardForm{
    margin-bottom:20px;
    .wd100{
      width:100px;
    }
    .mt20{
      margin-top:20px;
    }
    .mb20{
      margin-bottom:20px;
    }
    .textCenter{
      text-align:center;
    }
    .el-tabs--card{
      .el-tabs__header{
        border-bottom:none
      }
    }
  }
</style>
