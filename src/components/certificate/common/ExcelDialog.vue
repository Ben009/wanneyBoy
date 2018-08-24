<template>
  <mind-dialog  title="Excel" :visible="true" width="50%" center v-dialogDrag @close="handleCancel">
    <h1>111</h1>
  </mind-dialog>
</template>

<script>
import Vue from "vue";
import { ajaxRequest,formatDate } from "../../util/base";
import {CsharpObject,AlertMessage} from "@/components/util/chromeUtil.js";
import ExcelUtil from "@/mixins/ExcelUtil"
export default {
  props:{
    callback:{
      type:Function,
      required:true
    }
  },
  mixins:[ExcelUtil],
  data(){
    return{
      activeLabel: "D:\\TestDocuments\\test.xlsx"
    }
  },
  mounted(){
  },
  methods:{
    handleCancel(){
      this.closeExcel();
      this.callback();
    },
    // 关闭对应打开的excel
    closeExcel() {
      javascript: CsharpObject().ConExcelListClose(this.activeLabel);
    },
  },

}
</script>
<style scoped>

</style>
