<template>
  <div style="position:relative;">
    <el-form label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="form.begTime"
              value-format="yyyy-MM-dd"
              type="date"
              prefix-icon=""
              placeholder="选择日期" :style="'width: 35%'">
            </el-date-picker>
            <span> ~ </span>
            <el-date-picker
            v-model="form.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            prefix-icon=""
            placeholder="选择日期" :style="'width: 35%'">
          </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作人">
            <el-input label="操作人" v-model.trim="form.userName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="操作类型">
            <el-input label="操作类型" v-model.trim="form.operationType"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色名称">
            <el-input label="角色名称" v-model.trim="form.roleName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="操作内容">
            <el-input label="操作内容" v-model.trim="form.operationDetail"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="btn-search">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
          <!-- v-mindPopover="{message:'是否重置?',success:reset}" -->
        </el-col>
      </el-row>
    </el-form>

    <div v-show="!isSetting">
      <div style="margin-top:20px;">
        <el-table :data="tableData" :max-height="QJTableMaxHeight"  border stripe  style="width: 100%" >
          <el-table-column  prop="operatingTime" width="180"  label="操作时间" :formatter="formatDate" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column  prop="userName" width="140" label="操作人" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column  prop="operationType" width="100"  label="操作类型" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column  prop="roleName" width="180"  label="角色名称" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column  prop="operationDetail"  label="操作内容" align="center" show-overflow-tooltip>
          </el-table-column>

          <!-- <el-table-column
            label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-view" title="明细"></i></el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div style="margin-top:10px;text-align:center; float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
      <roleLogForm v-if="!!edit" :logInfo="edit" :callback="handleEditCallback"></roleLogForm>
    </div>
  </div>


</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest, formatArrayToTree} from '../../util/base';
  import roleLogForm from './roleLogForm';
  import ElForm from "@/common-el/packages/form/src/form.vue";
  import ElRow from "@/common-el/packages/row/src/row";
  import ElCol from "@/common-el/packages/col/src/col";
  import ElFormItem from "@/common-el/packages/form/src/form-item.vue";
  import ElInput from "@/common-el/packages/input/src/input.vue";

/*   import { Table, TableColumn } from 'element--ui';
  Vue.use(Table);
  Vue.use(TableColumn); */

  export default {
    name: "roleLogList",
    components:{
      ElInput,
      ElFormItem,
      ElCol,
      ElRow,
      ElForm,
      roleLogForm
    },
    props:{
      flag:Number,
    },
    watch:{
      flag(old,n){
        this.getTableList();
      }
    },
    data(){
      return{
        page:1,
        rows:10,
        total:0,
        searchKey:'',
        orderProperty:'id',
        orderType:'desc',
        tableData:[],
        multipleSelection:[],
        fuzzySearch:0,
        isSetting:0,
        edit:null,
        form:{
          begTime:"",
          endTime:"",
          userName:"",
          roleName:"",
          operationType:"",
          operationDetail:""
        }
      }
    },
    methods:{
      getTableList(){
        let searchKey = {
          page:this.page,
          rows:this.rows,
          total:0,
          fuzzySearch:1,
          orderProperty:'OPERATING_TIME',
          orderType:'desc',
          // operationType:this.form.operationType,
          // operationDetail:this.form.operationDetail,
          // roleName:this.form.roleName,
          // userName:this.form.roleName,
          // begTime:this.form.begTime,
          // endTime:this.form.endTime
        };
        if(!!this.form.begTime) {
          searchKey["begTime"]=this.form.begTime;
        }
        if(!!this.form.endTime) {
          searchKey["endTime"]=this.form.endTime;
        }
        if(!!this.form.userName) {
          // username变量是操作人
          searchKey["userName"]=this.form.userName;
        }
        if(!!this.form.operationType) {
          searchKey["operationType"]=this.form.operationType;
        }
        if(!!this.form.operationDetail) {
          searchKey["operationDetail"]=this.form.operationDetail;
        }
        if(!!this.form.roleName) {
          // roleName正常情况下应该是角色名称
          searchKey["roleName"]=this.form.roleName;
        }
        // 完整的数据是可以实现正常的排序，但是分页之后只能对当前页面的数据排序
        // page:this.page,rows:this.rows,total:0,
        ajaxRequest('get','back/roleLog/retrieve',searchKey,(res)=>{
          if(res.code===200){
            this.tableData=res.rows;
            this.total=res.total;
            // this.multipleSelection=[];
          }
        })
      },

      handleToggleTheme(color) {
        this.$store.commit('toggleTheme', color)
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
      handleEdit(rowInfo){
        if(rowInfo.operatingTime) {
          rowInfo.operatingTime= new Date(rowInfo.operatingTime).format('YYYY-MM-DD hh:mm');
        }
        this.edit = rowInfo || {}
      },
      handleEditCallback(rowInfo){
        this.edit=null
      },
      formatDate(row, column, cellValue, index) {
        return  new Date(cellValue).format('YYYY-MM-DD hh:mm');
      },
      search() {
        this.getTableList();
      },
      reset() {
        for(let item in this.form){
          this.form[item] = ''
        }
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
  .btn-search {
    text-align: center;
    margin-top: -20px;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
  .el-input {
    width: 80%;
  }
  .btn-search{margin-top:10px!important;}
</style>
