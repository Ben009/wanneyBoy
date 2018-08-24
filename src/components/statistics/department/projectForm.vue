<template>
    <div>
      <mind-dialog
        :visible="true"
        title="项目统计"
        dialogSize="mid"
        center
        v-dialogDrag
        append-to-body
        @close="closeDialog">
        <el-form label-width="150px">
          <el-table  :max-height="QJTableMaxHeight"
                     ref="table"
                     :data="tableData"
                     border
                     style="width: 100%"
                     :fit="true">
            <el-table-column prop="projectName" label="项目" v-if="projectOrPerson==2"></el-table-column>
            <el-table-column prop="userName" label="人员" v-if="projectOrPerson==1"></el-table-column>
            <el-table-column prop="yxq" label="项目有效期" :formatter="dealDate"></el-table-column>
          </el-table>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">关闭</el-button>
        </span>
      </mind-dialog>
    </div>
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
    export default {
      name:"projectForm",//项目统计弹层
      props:{
        callback:{
          type:Function,
          required: true
        },
        projectOrPerson: {//1项目，2人员
          type: Number,
          required: true
        },
        data: {
          type: Object,
          required: true
        },
      },
        data() {
            return {
              tableData:[],
            }
        },
      methods:{
        getTableList(){
          /*获取table数据，维护data数据*/
          ajaxRequest('get','back/statistics/projectCountDetail',this.data,(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
            }
          })
        },
        dealDate: function (row, column, cellValue) {
          if(cellValue===""||cellValue===null||cellValue===undefined){
            return "";
          }else{
            return new Date(cellValue).format('YYYY-MM-DD');
          }
        },
        closeDialog(){
          this.callback();
        },
      },
      mounted(){
        this.getTableList();
      }
    }
</script>
