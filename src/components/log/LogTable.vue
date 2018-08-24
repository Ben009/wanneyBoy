<template>
  <div>
    <div class="el-tab_head">
      <el-button size="small" type="primary" icon="el-icon-refresh" @click="handleRefresh(null)">刷新</el-button>
    </div>
    <div class="el-tab_head" style="margin-top:10px;">
      <el-table :data="tableData"
        :max-height="QJTableMaxHeight"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="操作时间"
          width="200">
        </el-table-column>
        <el-table-column
          prop="userId"
          label="操作用户">
        </el-table-column>
        <el-table-column
          prop="category"
          label="操作">
        </el-table-column>
        <el-table-column
          prop="objectStr"
          label="操作内容">
        </el-table-column>
        <el-table-column
          prop="content"
          label="位置">
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align:center; margin-top:10px; float:right;">
       <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">
      </mind-pagination>
    </div>
    <EditParameter v-if="!!edit" :rowInfo="edit" :callback="handleEditCallback"></EditParameter>
  </div>


</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest, formatArrayToTree} from '../util/base';

/*   import { Table, TableColumn } from 'element--ui';
  Vue.use(Table);
  Vue.use(TableColumn); */

  export default {
    name: "log-table",
    data(){
      return{
        page:1,
        rows:10,
        total:0,
        searchKey:'',
        tableData:[],
        multipleSelection:[],

        edit:null,
      }
    },
    methods:{
      getTableList(){
        ajaxRequest('get','back/log/list',{
          page:this.page,
          rows:this.rows,
          total:0
        },function(res){
          if(res.code===200){
            var data =res.rows;
            for(var i = 0,l=data.length; i < l; i++){
              data[i].addTime = this.formatDate(data[i].addTime,'YYYY-MM-DD hh:mm')
            }
            this.tableData = data;
            this.total=res.total;
            this.multipleSelection=[];
          }
        }.bind(this))
      },
      formatDate(val,pattern){
        if (val != null && val != "") {
          var date = new Date(val);
          return date.format(pattern);
        } else {
          return null;
        }
      },
      handleToggleTheme(color) {
        this.$store.commit('toggleTheme', color)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getTableList();
      },
      handleRefresh(){
        this.getTableList();
      }
    },
    mounted() {
      this.getTableList();
    }
  }
</script>

<style scoped>
  .custom-input{
    width:200px;
    height:32px;
  }
  .custom-input .el-input__inner{
    height:32px;
    line-height:32px;
  }
  .custom-input .el-input-group__append{
    padding:0 10px;
  }
</style>
