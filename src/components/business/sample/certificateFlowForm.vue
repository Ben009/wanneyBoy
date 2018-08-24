<template>
  <mind-dialog
    title="未出证书编号"
    :visible="true"
    dialogSize="mid"
    center
    v-dialogDrag
    @close="handleCancel">
    <el-table   :max-height="QJTableMaxHeight"
      ref="table"
      :data="tableData"
      border
      style="width: 100%"
      :fit="true">
      <el-table-column
        prop="certificateNo"
        label="未生成证书编号"
        >
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">关闭</el-button>
     </span>
  </mind-dialog>
</template>

<style>

</style>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";
  
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
      name:"certificateFlowForm",
      props: {//用于接收从父组件中传来的数据
        data: {
          type: Object,
          require: true
        },
        callback: {
          type: Function,
          require: true
        },
      },
        data() {
            return {
              tableData:[],
            }
        },
      methods:{
        getTableList(){
          ajaxRequest('get','back/',{
            bh:data.zsbh,
          },(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
            }else{
              this.$message.error(res.msg);
            }
          })
        },
        handleCancel(){
          this.callback();
        },
      },
      mounted(){
        this.getTableList();
      }
    }
</script>
