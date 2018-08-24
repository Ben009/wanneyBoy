<!-- 追加器具 -->
<template>
  <mind-dialog title="追加器具"
               :visible="true"
               dialogSize="large"
               center
               v-dialogDrag
               @close="handleCancel" >
    <template>
      <el-button type="primary small" @click="historyImport">历史数据导入</el-button>
      <!--
       TODO 未开发，暂时注释
       -->
      <!--<el-button type="primary small" @click="">单位台帐</el-button>-->
      <!--<el-button type="primary small" @click="">EXCEL导入</el-button>-->
    </template>
    <div style="min-height:450px;">
      <InstrumentInfo ref="instrumentinfo"
                      v-if="!isRefresh"
                      :callback="handleApplianceEditCallback"
                      :columnsInfo="columnsInfo"
                      :batchInfo="batchInfo"
                      :header="header"
                      :tableData="tableData"
                      :companyId="companyId"
                      :defaultList="defaultList"
                      :originalDecimals="originalDecimals"
      >
      </InstrumentInfo>
    </div>

    <QuotationHistoryImport v-if="this.companyName"
                            :companyName="companyName"
                            :callback="importHistory"
    >
    </QuotationHistoryImport>

    <span slot="footer" class="dialog-footer" style="display: block;  text-align: center;">
            <el-button type="primary" @click="handleSubmit" >保 存</el-button>
            <el-button type="warning" @click="handleCancel">关 闭</el-button>
         </span>

  </mind-dialog>
</template>

<script>
  import Vue from 'vue'
  import QuotationHistoryImport from './QuotationHistoryImport'
  import InstrumentInfo from './InstrumentInfoForMore'
  import {header, defaultList, batchInfo, columnsInfo} from './tableJson'
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest} from '../../util/base'
  var Big = require('big.js')


  export default {
    name: 'addMoreAppliance',
    data () {
      return {
        header: header,
        defaultList: defaultList,
        companyName:null,
        isRefresh: false,
        tableData: [],
        /*更多表格的字段展示信息*/
        columnsInfo: columnsInfo,
        /*批量设置的信息*/
        batchInfo: batchInfo,
      }
    },
    components: {InstrumentInfo,QuotationHistoryImport},
    props: {
      quotationId: {
        type: Number
      },
      originalDecimals: {
        type: Number
      },
      callback: {
        type: Function
      },
      companyId:{
        type: Number
      }
    },
    methods: {
      handleApplianceEditCallback (applianceList) { // 获取器具信息
        this.applianceUsedList = applianceList
      },
      handleCancel () {
        this.callback();
      },
      // 保存
      handleSubmit () {
        let data = this.$refs.instrumentinfo.data, errFlag = true
        // 验证
        data.forEach((v, i) => {
          var flag = this.$refs.instrumentinfo.$refs['form' + i][0].test()
          if (!flag) {
            errFlag = false
          }
          v.isPlanned = 0;
          v.isDelete = 0;
          v.quotationId = this.quotationId// 报价单ID
          v.receivablesCost = new Big(v.unitPrice).mul(v.setNumber).mul(v.pieceNumber)// 应收费用
          v.discount = new Big(v.afterDiscountTotal).div(v.receivablesCost).toFixed(2)// 每个器具的折扣
        })
        if(!errFlag){
          return;
        }
        this.callback(data)
      },
      //历史数据导入查询
      historyImport(){
        ajaxRequest('get', 'back/company/' + this.companyId, {}, (res) => {
          this.companyName = res.daoResult.companyName;
        })
      },
      //导入历史数据
      importHistory(rowInfo) {
        if (rowInfo) {
          //加载器具列表
          this.companyName = null;
          if (this.tableData) {
            this.tableData = this.tableData.concat(rowInfo);
          } else {
            this.tableData = rowInfo;
          }
          //移出、移入刷新器具组件
          this.isRefresh = true;
          this.$nextTick(() => {
            this.isRefresh = false;
          });

          setTimeout(() => {
            this.setDecimals();
          }, 0)

        } else {
          this.companyName = null;
        }
      },
    }
  }
</script>

<style scoped>

</style>
