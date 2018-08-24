<template>
<mind-dialog
  title="请选择计量标准器"
  :visible="true"
  dialogSize="large"
  center
  v-dialogDrag
  @close="handleCancel">
  <el-row justify="3">
    <el-col :sm="6" :offset="1">
      <el-input placeholder="请输入计量标准器名称" v-model="searchKey" clearable/>
    </el-col>
    <el-col :sm="6" :offset="3">
      <el-button type="primary" @click="resetAll">清空所选行</el-button>
    </el-col>
    <el-col :sm="6" :offset="3">

    </el-col>
  </el-row>
  <el-table :data="data" :max-height="QJTableMaxHeight" border @row-click="rowClick">
        <el-table-column prop="jlbzqName" label="计量标准器名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jlbzq_name_eng" label="计量标准器英文名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jlbzqClfw" label="测量范围"></el-table-column>
        <el-table-column prop="jlbzqZqddj" label="准确度等级"></el-table-column>
        <el-table-column prop="jlbzq_zqddj_eng" label="准确度等级英文"></el-table-column>
        <el-table-column prop="jlbzq_xhgg" label="计量标准器型号规格"show-overflow-tooltip></el-table-column>
        <el-table-column prop="jlbzq_ccbh" label="计量标准器出厂编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jlbzq_sbbh" label="计量标准器设备编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jlbzq_jddw" label="计量标准器检定单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jlbzqZzcs" label="计量标准器制造厂商" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jlbzqZsbh" label="证书编号"></el-table-column>
        <el-table-column prop="jlbzqYxrq" label="证书有效日期" :formatter="dateFormat"></el-table-column>
    </el-table>
  </mind-dialog>

</template>
<script>
import Vue from "vue";
import Vuex from "vuex";
import { ajaxRequest, formatDate } from "../../../util/base";
/* import {
  Button,
  Table,
  TableColumn,
  Row,
  Col
} from "element--ui";
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Row);
Vue.use(Col); */
export default {
  props: {
    callback: {
      type: Function,
      required: true
    },
    thlogyRules: {
      required: true
    }
  },
  data() {
    return {
      data: null,
      searchKey: "",
      tempData: null
    };
  },
  watch: {
    searchKey() {
      if (this.tempData) {
        this.data = this.tempData.filter(val => {
          return val.jlbzqName
            ? val.jlbzqName.indexOf(this.searchKey) != -1
            : "".indexOf(this.searchKey) != -1;
        });
      }
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      ajaxRequest("post", "back/certificateQuality/queryJlbzq", null, res => {
        if (res.code === 200) {
          this.data = res.rows;
          this.tempData = res.rows;
        }
      });
    },
    rowClick(row, event, column) {
      this.callback(this.thlogyRules, row);
    },
    handleCancel() {
      this.callback(null);
    },
    dateFormat(row, column, cellValue, index) {
      return formatDate(cellValue, "YYYY-MM-DD");
    },
    resetAll() {
      this.callback(this.thlogyRules, "reset");
    }
  }
};
</script>
<style scoped>
</style>
