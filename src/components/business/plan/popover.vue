<template>
  <el-popover trigger="hover" placement="bottom" v-if="tableData.length">
    <div>
      <el-table :max-height="QJTableMaxHeight"
                :data="tableData"
                border
                style="width: 100%">
        <el-table-column
          v-for="item in columnsInfo"
          :prop="item.nameCode"
          :label="item.title"
          :formatter="formatterColumn">
        </el-table-column>
      </el-table>
    </div>
    <div slot="reference" class="name-wrapper">
      <span ref="refer" :style="{color:showContent=='orderNo'?'blue':''}"
            @click="doSomethingElse(rowInfo)">{{rowInfo[showContent]}}</span>
    </div>
  </el-popover>
  <span v-else ref="refer" :style="{color:showContent=='orderNo'?'blue':''}"
        @click="doSomethingElse(rowInfo)">{{rowInfo[showContent]}}</span>
</template>
<script>
  import {ajaxRequest} from '../../util/base'

  export default {
    name: 'popover',
    props: {
      rowInfo: {required: true, type: Object},  //当前行数据
      columnsInfo: {required: true, type: Array}, //展示表格的信息
      tableData: {required: true, type: Array},  //展示表格的数据
      showContent: {required: true},
    },
    data() {
      return {}
    },
    methods: {
      //委托单号打印
      doSomethingElse(value) {
        this.$emit('doSomethingElse', value);
      },
      //格式化单元格内容
      formatterColumn(row, column, cellVaule, index) {
        if (column.property == 'detectionMethod')//检测方式
        {
          if (cellVaule == 0) {
            return "现场"
          } else if (cellVaule == 1) {
            return "送检"
          } else if (cellVaule == 2) {
            return "带回"
          }
        } else if (column.property == 'status') {
          if (row.orderNo == null) {
            return "未排单";
          } else if (row.isClaim == '0') {
            return "未分配";
          } else {
            if (row.isClaim == "2") {
              return "退回" + (row.returnReason == null ? '' : '(' + row.returnReason + ')') + "";
            } else if (row.registrationNo == null) {
              return "未配号";
            } else {
              return row.registrationNo;
            }
          }
        } else {
          return cellVaule;
        }
      }
    },
    mounted() {
    }
  }
</script>

