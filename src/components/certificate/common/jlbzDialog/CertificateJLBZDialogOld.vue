<template>
<mind-dialog
  title="请选择计量标准"
  :visible="true"
  dialogSize="large"
  center
  v-dialogDrag
  @close="handleCancel">
  <el-row justify="3">
    <el-col :sm="6" :offset="1">
      <el-input placeholder="请输入计量标准名称" v-model="searchKey" clearable/>
    </el-col>
    <el-col :sm="6" :offset="3">
      <el-button type="primary" @click="resetAll">清空所选行</el-button>
    </el-col>
    <el-col :sm="6" :offset="3">

    </el-col>
  </el-row>
    <el-table :data="data" :max-height="QJTableMaxHeight" border @row-click="rowClick">
        <el-table-column prop="jlbzName" label="计量标准名称"></el-table-column>
        <el-table-column prop="jlbzNameEng" label="计量标准英文名称"></el-table-column>
        <el-table-column prop="jlbzClfw" label="测量范围"></el-table-column>
        <el-table-column prop="jlbzClfwEng" label="测量范围英文名称"></el-table-column>
        <el-table-column prop="jlbzZqddj" label="准确度等级"></el-table-column>
        <el-table-column prop="jlbzZqddjEng"  label="准确度等级英文"></el-table-column>
        <el-table-column prop="jlbzZsbh"  label="证书编号"></el-table-column>
        <el-table-column prop="jlbzYxrq" label="证书有效日期" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="jlbzZsbhSocial"  label="计量标准社会公用证书编号"></el-table-column>
        <el-table-column prop="jlbzYxrqSocial" label="计量标准社会公用有效日期" :formatter="dateFormat"></el-table-column>

    </el-table>
  </mind-dialog>
</template>
<script>
import Vue from "vue";
import Vuex from "vuex";
import { ajaxRequest,formatDate } from "../../../util/base";
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
    thlogyRules:{
      required:true
    },

  },
  data() {
    return {
      data: null,
      tempData:null,
      searchKey:'',
    };
  },
  watch:{
    searchKey(){
        this.data=this.tempData.filter(val=>{
        return val.jlbzName?val.jlbzName.indexOf(this.searchKey)!=-1:''.indexOf(this.searchKey)!=-1;
      })

    }
  },
  mounted(){
      this.getTableData();
  },
  methods: {
    getTableData() {
      // let searchObj=this.searchKey?{jlbzName:this.searchKey} : {};
      ajaxRequest("post", "back/certificateQuality/queryJlbz", null, res => {
        if (res.code === 200) {
          this.data = res.rows;
          this.tempData=res.rows;
        }
      });
    },
    rowClick(row, event, column){
      this.callback(this.thlogyRules,row);
    },
    handleCancel() {
      this.callback(null);
    },
    dateFormat(row, column, cellValue, index) {
        return formatDate(cellValue, "YYYY-MM-DD");
      },
      resetAll(){
      this.callback(this.thlogyRules,'reset');
    }
  }
};
</script>
<style scoped>
</style>
