<!--
    报价系统录入的Tab页
 -->
<template>
  <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="basicInfo">
      <quotationForm ref="basicInfo" :callback="sendData" :setCompanyId="setCompanyId"></quotationForm>
    </el-tab-pane>

    <el-tab-pane label="器具信息" name="applianInfo" :disabled="disabled">
      <applianceDetail ref="applianInfo" :callback="sendData"></applianceDetail>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import Vue from 'vue'

  import quotationForm from './QuotationForm'
  import applianceDetail from './QuotationApplianceDetail'
  import quotationState from './QuotationState'

  export default {
    name: 'quotationTab',
    data() {
      return {
        activeName: 'basicInfo',
        disabled: false
      }
    },
    methods: {
      handleClick(tab, event) {
        if(tab.name == 'applianInfo'){
          this.$nextTick(val => {
            console.log(this.$refs.applianInfo.$refs.instrumentinfo.$refs['table-header'],'11111111111111111111')
            this.$refs.applianInfo.$refs.instrumentinfo.fixedTableColumns()
          })
        }
      },
      sendData(quotationId) {
        this.$refs.applianInfo.quotationId = quotationId
        // this.disabled = false
      },
      setCompanyId(companyId) {
        this.$refs.applianInfo.companyIdtemp = companyId
      }
    },
    components: {quotationForm, applianceDetail, quotationState}
  }
</script>

<style scoped>

</style>
