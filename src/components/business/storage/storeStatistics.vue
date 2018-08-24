<template>
    <div>
      <div style="margin-bottom:20px;">
      <el-table :max-height="QJTableMaxHeight"
        ref="table"
        :data="tableData"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="sampleWarehouseNo"
          label="货架名称"
          >
        </el-table-column>
        <el-table-column
          prop="registrationNo"
          label="登记号数量"
          >
        </el-table-column>
        <el-table-column
          prop="setNumber"
          label="样品数量"
          >
        </el-table-column>
      </el-table>
      </div>
      <div>
      <el-table :max-height="QJTableMaxHeight"
        ref="table2"
        :data="tableData2"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="certificateWarehouseNo"
          label="货架名称"
          >
        </el-table-column>
        <el-table-column
          prop="registrationNo"
          label="登记号数量"
          >
        </el-table-column>
        <el-table-column
          prop="cerNumber"
          label="证书数量"
          >
        </el-table-column>
      </el-table>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';

/*   import {
    Button,
    Checkbox,
    CheckboxGroup,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
  } from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox); */


  export default {
    name:"storeStatistics",
    data() {
      return {
        tableData:[],//样品货架信息表格
        tableData2:[],//证书货架信息表格
      }
    },
    methods:{
      getTableList(){
        ajaxRequest('get','back/ruku/kfCount',{},(res)=>{
          if(res.code===200){
            this.tableData=res.daoResult.ypList;
            this.tableData2=res.daoResult.zsList;
          }else{
            this.$message.error(res.msg);
          }
        })
      },
    },
    mounted() {
      this.getTableList();
    },
    created(){

    }
  }
</script>

