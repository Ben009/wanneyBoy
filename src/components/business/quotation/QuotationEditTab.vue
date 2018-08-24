<!--
    报价系统明细Tab页
 -->

<template>
  <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="basicInfo">
      <QuotationForm ref="basicInfo" :callback="sendData"></QuotationForm>
    </el-tab-pane>

    <el-tab-pane label="器具信息" name="applianInfo">
      <applianceDetail ref="applianInfo"></applianceDetail>
    </el-tab-pane>

    <!--<el-tab-pane label="执行状态" name="executeState">-->
      <!--<quotationState ref="executeState"></quotationState>-->
    <!--</el-tab-pane>-->

    <el-tab-pane label="操作痕迹" name="logs">
      <historyLog  ref="logs"></historyLog>
    </el-tab-pane>

    <el-tab-pane  name="exist" >
      <el-button slot="label" type="danger" style="border:1px solid #8da3d6; color:#602666;" >返回</el-button>
    </el-tab-pane>


  </el-tabs>

</template>

<script>
  import Vue from 'vue'
  import applianceDetail from './QuotationApplianceDetail'
  import quotationState from './QuotationState'
  import $ from 'jquery'
  import ElButton from '@/common-el/packages/button/src/button'
  import QuotationForm from './QuotationForm'
  import historyLog from './quotationHistoryLog'

/*   import {
    Button,
    Checkbox,
    CheckboxGroup,
    Col,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
    Row,
    Autocomplete
  } from 'element--ui'
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  Vue.use(Button)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(RadioGroup)
  Vue.use(Radio)
  Vue.use(CheckboxGroup)
  Vue.use(Checkbox)
  Vue.use(Autocomplete) */

  export default {
    name: 'QuotationEditTab',
    data() {
      return {
        activeName: 'basicInfo',
      }
    },
    methods: {
      handleClick(tab, event) {
        if(tab.name=='exist'){
          let path = '/admin/72';
          if(this.$route.query.isBack==1){
            //异常报价
            path = '/admin/462';
          }
          this.$router.push({
            path: path,
            query: {}
          })
        }
      },
      sendData(quotationId) {
        this.$refs.applianInfo.quotationId = quotationId
      }
    },
    mounted() {

    },
    components: {ElButton, applianceDetail, quotationState, QuotationForm,historyLog}
  }
</script>

<style scoped>

</style>
