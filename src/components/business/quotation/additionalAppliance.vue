<!-- 要号时追加的器具 -->
<template>
  <div v-if="tableData.length>0">
    <div class="title-item"><span>现场要号、带回配号追加器具</span></div>
    <el-table :data="tableData" :max-height="QJTableMaxHeight"
              style="width: 100%"
              max-height="500"
              ref="applianceListTable"
              :summary-method="getSummariess"
              show-summary>
      <el-table-column  label="序号" type="index"  width="60"></el-table-column>
      <el-table-column prop="APPLIANCE_NAME" label="器具名称" width="180"></el-table-column>
      <el-table-column prop="MODEL" label="型号规格" width="180"></el-table-column>
      <el-table-column prop="FACTORY_NO" label="出厂编号"></el-table-column>
      <el-table-column prop="SET_NUMBER" label="套数"></el-table-column>
      <el-table-column prop="TOTAL_ACTUAL" label="合计费用"></el-table-column>
      <el-table-column prop="DETECTION_METHOD" label="检测方式" :formatter="detectionMethod"></el-table-column>
      <el-table-column prop="DEPART_NAME" label="检测部门"></el-table-column>
      <el-table-column prop="APPLIANCE_WAREHOUSE_FLAG" label="库房状态" :formatter="warehouseFormatter"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Vue from 'vue'
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest} from '../../util/base'
  var Big = require('big.js')

  export default {
    name: "additionalAppliance",
    components: {},
    props: {
      quotationId:{
        type:Number
      }
    },
    watch:{
      quotationId(val){
        if(val){
          this.getTableList();
        }
      }
    },
    data() {
      return {
        tableData: []
      }
    },
    mounted() {
      this.getTableList();
    },
    methods: {
      getTableList() {
        ajaxRequest('get', 'back/quotationAppliance/getAddAppliance', {
          quotationId:this.quotationId
        }, (res) => {
          if (res.code === 200) {
            this.tableData = res.rows
          }
        })
      },
      //样品库房状态
      warehouseFormatter(row, column){
        if(row.APPLIANCE_WAREHOUSE_FLAG==0){
          return '送检在收发（现场的无样品）';
        }else if(row.APPLIANCE_WAREHOUSE_FLAG==1){
          return '未检在实验室';
        }else if(row.APPLIANCE_WAREHOUSE_FLAG==2){
          return '已检在实验室';
        }else if(row.APPLIANCE_WAREHOUSE_FLAG==3){
          return '已入库';
        }else if(row.APPLIANCE_WAREHOUSE_FLAG==4){
          return '已出库';
        }
      },
      // 检测方式格式化
      detectionMethod (row, column) {
        if (row.DETECTION_METHOD == '0') {
          return '现场'
        } else if (row.DETECTION_METHOD == '1') {
          return '送检'
        } else if (row.DETECTION_METHOD == '2') {
          return '带回'
        }
      },
      getSummariess(param) {
        let {columns, data} = param
        let sums = []
        columns.forEach((column, index) => {
          if (index === 1) {
            sums[index] = '合计'
            return
          }
          let values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr)
              if (!isNaN(value)) {
                return new Big(prev).add(curr)
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' '
          } else {
            sums[index] = ' '
          }
        })
        sums[2] = ''
        sums[3] = ''
        sums[6] = ''
        sums[7] = ''
        sums[8] = ''
        return sums
      },
    }
  }
</script>

<style scoped>

</style>
