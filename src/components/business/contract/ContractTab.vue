<template>
  <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="basicInfo" >
      <ContractForm ref="basicInfo" :quotationId="quotationId"></ContractForm>
    </el-tab-pane>

    <el-tab-pane label="器具信息" name="applianInfo">
      <QuotationApplianceList ref="basicInfo" :quotationId="quotationId" :contractFlag="1"></QuotationApplianceList>
    </el-tab-pane>

    <el-tab-pane label="操作痕迹" name="logHistory"  v-if="id">
      <contractHistoryLog ref="logHistory" :id="id"></contractHistoryLog>
    </el-tab-pane>

  </el-tabs>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import ElButton from '@/common-el/packages/button/src/button'
  import ContractForm from './ContractForm'
  import QuotationApplianceList from '../quotation/QuotationApplianceList'
  import contractHistoryLog from './contractHistoryLog';
  export default {
    name: 'ContractTab',
    data () {
      return {
        activeName: 'basicInfo',
        quotationId:parseInt(this.$route.query.quotationId),
        id:this.$route.query.id
      }
    },
    methods: {
      handleClick (tab, event) {

      }
    },
    components: {ElButton, ContractForm,QuotationApplianceList,contractHistoryLog}
  }
</script>

<style scoped>

</style>
