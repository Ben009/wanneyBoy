<template>
    <div v-show="!isSetting">
      <div>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增</el-button>
      </div>
      <div style="position:absolute;top:0;right:25px">
        <el-input size="small" placeholder="请输入参数名称" class="custom-input" v-model="paramColName"></el-input>
        <el-input size="small" placeholder="请输入参数描述" class="custom-input" v-model="paramDesc"></el-input>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <div style="margin-top:10px;">
        <el-table   :data="tableData" 
          :max-height="QJTableMaxHeight"
          border
          style="width: 100%" size="small">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="paramColName" label="参数名称"></el-table-column>
          <el-table-column prop="paramColValue" label="参数值"></el-table-column>
          <el-table-column prop="paramDesc" label="参数描述" width="400"></el-table-column>
          <el-table-column prop="paramBlong" label="归属模块"></el-table-column>
          <el-table-column prop="paramDifferent" label="参数类别" :formatter="formatterType"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-edit-outline" title="编辑"></i></el-button>
              <el-button @click="handleDelete([scope.row])" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-delete" title="删除"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:10px;text-align:center;float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
      <parameterForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></parameterForm>
    </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest} from '../../util/base';
  import parameterForm from './parameterEdit';

/*   import { Button,  Table, TableColumn} from 'element--ui';
  Vue.use(Button);
  Vue.use(Table);
  Vue.use(TableColumn); */
  
  export default {
    name: "parameter-table",
    components:{
      parameterForm
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
        paramColName:"",
        paramDesc:""
      }
    },
    methods:{
      getTableList(){
//        alert(this.paramColName);
//        alert(this.paramDesc);
        if(this.searchKey || this.fuzzySearch === 1){
          alert(1)
          ajaxRequest('get','back/parameter/retrieve',{
            fuzzySearch:1,
            page:this.page,
            rows:this.rows,
            orderProperty:this.orderProperty,
            orderType:this.orderType,
            total:0,
            sc:this.sc,

          },(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
              this.multipleSelection=[];
            }
          })
        }
        else{
          ajaxRequest('get','back/parameter/list',{
            page:this.page,
            rows:this.rows,
            orderProperty:this.orderProperty,
            orderType:this.orderType,
            total:0,
            paramColName:this.paramColName,
            paramDesc:this.paramDesc
          },function(res){
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
              this.multipleSelection=[];
            }
          }.bind(this))
        }
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
      handleEdit(rowInfo){
        this.edit = rowInfo || {}
      },
      handleDelete(data){
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(data.length>0){
            let ids = data.map(function (v) {
              return v.id
            }).join(",");
            ajaxRequest('post','back/parameter/list/'+ids,{_method:'delete'},function(res){
              if(res.code===200){
                this.$message.success('删除成功');
                this.getTableList();
              }
              else{
                this.$message.error('删除失败');
              }
            }.bind(this))
          }else{
            this.$message({
              message: '请先选择要删除的数据',
              type: 'warning'
            })
          }
        });
      },
      handleEditCallback(rowInfo){
        let _this=this;
        if(rowInfo=="success"){
          _this.$message.success('操作成功！');
          _this.edit=null;
          _this.getTableList();
        }else if(rowInfo=="error"){
          _this.$message.error('操作失败！');
        }else{
          this.edit=null
        }
      },
      formatterType:function(row, column){
        var type = row.paramDifferent;
        if(type=="1"){
            return "系统配置";
        }else if(type=="2"){
            return "业务配置";
        }
      },
      handleSearch() {
        this.page = 1;
        this.total = 0;
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
