<template>
  <mind-dialog
  title="请选择技术规程"
  :visible="true"
  dialogSize="mid"
  center
  v-dialogDrag
  @close="handleCancel">
  <el-row justify="3">
    <el-col :sm="6" :offset="1">
      <el-input placeholder="请输入技术规程名称" v-model="searchKey" clearable/>
    </el-col>
    <el-col :sm="6" :offset="3">
      <el-button type="primary" @click="resetAll">清空所选行</el-button>
    </el-col>
    <el-col :sm="6" :offset="3">

    </el-col>
  </el-row>

  <el-row>
    <el-col :sm="24">
      <el-table :data="data" :max-height="QJTableMaxHeight" border @row-click="handleNodeClick">
        <el-table-column prop="jsgcName" label="技术规程名称"></el-table-column>
        <el-table-column prop="jsgcNameEng" label="技术规程英文名称"></el-table-column>
    </el-table>
    </el-col>

  </el-row>


</mind-dialog>
</template>


<script>
import Vue from "vue";
import Vuex from "vuex";
import vueBus from "vue-bus";
import "../../../util/Base.css";
import { ajaxRequest } from "../../../util/base";

/* import { Button,  Tree } from "element--ui";
Vue.use(Button);
Vue.use(Tree); */

export default {
  props: {
    callback: {
      type: Function,
      required: true
    },
    thlogyRules:{
      required:true
    }
  },
  data() {
    return {
      data: null,
      tempData:null,
      searchKey:''
    };
  },
 watch:{
    searchKey(){
        this.data=this.tempData.filter(val=>{
        return val.jsgcName?val.jsgcName.indexOf(this.searchKey)!=-1:''.indexOf(this.searchKey)!=-1;
      })

    }
  },
  methods: {
    handleCancel() {
      this.callback(null);
    },
    getTreeData() {
      ajaxRequest("post", "back/certificateQuality/queryJsgc", null, res => {
        if (res.code === 200) {
          // let obj = { jsgcId: 0, label: "依据规程",jsgcNameEng:null, children: [] };
          // let array = [];
          // res.rows.forEach(element => {
          //   let temp = {
          //     jsgcId: element.jsgcId,
          //     label: element.jsgcName,
          //     jsgcNameEng:element.jsgcNameEng,
          //     children: []
          //   };
          //   array.push(temp);
          // });

          // obj["children"] = array;
          // this.treeData.push(obj);
          this.data = res.rows;
          this.tempData=res.rows;
        }
      });
    },
    //左击
    handleNodeClick(row, event, column) {
     this.callback(this.thlogyRules,row);
    },
    resetAll(){
      this.callback(this.thlogyRules,'reset');
    }
  //  filterNode(value, data) {
  //       if (!value) return true;
  //       return data.label?data.label.indexOf(value) != -1:''.indexOf(value) != -1;
  //     }
  },
  created() {},
  mounted() {
    this.getTreeData();
  }
};
</script>

<style scoped>
</style>
