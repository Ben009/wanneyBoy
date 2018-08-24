<template>
  <div>
    <div>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(multipleSelection)">批量删除</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增任务</el-button>
    </div>
    <div style="position:absolute;top:20px;right:20px">

      <el-input placeholder="请输入任务名称" class="custom-input" @change="handleSearch">
        <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div style="margin-top:20px;">
      <el-table :max-height="QJTableMaxHeight"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column
          prop="id"
          label="任务ID">
        </el-table-column>
        <el-table-column
          prop="category"
          label="类别名称">
        </el-table-column>
        <el-table-column
          prop="beanName"
          label="bean名称">
        </el-table-column>
        <el-table-column
          prop="methodName"
          label="方法名称">
        </el-table-column>
        <el-table-column
          prop="url"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="jsonParam"
          label="参数">
        </el-table-column>
        <el-table-column
          prop="cornStr"
          label="corn表达式">
        </el-table-column>
        <el-table-column
          prop="memo"
          label="备注">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status==0?'暂停':'已启动' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button @click="handlePause(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-remove" title="暂停"></i></el-button>
            <el-button @click="handleRecover(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-refresh" title="恢复"></i></el-button>
            <el-button @click="handleQuickStart(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-caret-right" title="立即执行"></i></el-button>
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-edit-outline" title="编辑"></i></el-button>
            <el-button @click="handleDelete([scope.row])" type="text" style="padding:0;font-size:18px;"><i class="el-icon-delete" title="删除"></i></el-button>
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
    <EditTask v-if="!!edit" :rowInfo="edit" :callback="handleEditCallback"></EditTask>
  </div>


</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest, formatArrayToTree} from '../util/base';
  import EditTask from './EditTask';

/*   import { Table, TableColumn } from 'element--ui';
  Vue.use(Table);
  Vue.use(TableColumn); */
  export default {
    name: "time-table",
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
        if(this.searchKey){
          ajaxRequest('get','back/scheduleJob/retrieve',{
            category:this.searchKey,
            fuzzySearch:1,
            page:this.page,
            rows:this.rows,
            total:0
          },(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
              this.multipleSelection=[];
            }
          })
        }
        else{
          ajaxRequest('get','back/scheduleJob/list',{
            page:this.page,
            rows:this.rows,
            total:0
          },function(res){
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
              this.multipleSelection=[];
            }
          }.bind(this))
        }
      },
      handleToggleTheme(color) {
        this.$store.commit('toggleTheme', color)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSearch(value){
        this.searchKey=value;
        this.page=1;
        this.total=0;
        this.getTableList();
      },
      handlePageSizeChange(size){
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getTableList();
      },
      handlePause(info){
        ajaxRequest('put','back/scheduleJob/list/'+info.id,{status:0},(res)=>{
          if(res.code==200){
            this.$message({
              message: '任务已暂停',
              type: 'info'
            });
            var taskList = this.tableData;
            for(var i = 0,len=taskList.length;i < len; i++){
              if(taskList[i].id==info.id){
                taskList[i].status=0;
                this.tableData = taskList;
                return
              }
            }

          }
        })
      },
      handleRecover(info){
        ajaxRequest('put','back/scheduleJob/list/'+info.id,{status:1},(res)=>{
          if(res.code==200){
            this.$message({
              message: '任务已恢复',
              type: 'info'
            });
            var taskList = this.tableData;
            for(var i = 0,len=taskList.length;i < len; i++){
              if(taskList[i].id==info.id){
                taskList[i].status=1;
                this.tableData = taskList;
                return
              }
            }
          }
        })
      },
      handleQuickStart(info){
        ajaxRequest('put','back/scheduleJob/list/'+info.id,{quickStart:1},(res)=>{
          if(res.code==200){
            this.$message({
              message: '任务已立即执行',
              type: 'info'
            });
            var taskList = this.tableData;
            for(var i = 0,len=taskList.length;i < len; i++){
              if(taskList[i].id==info.id){
                taskList[i].status=1;
                this.tableData = taskList;
                return
              }
            }
          }
        })
      },
      handleEdit(rowInfo){
        this.edit = rowInfo || {}
      },
      handleDelete(data){
        if(data.length>0){
          let ids = data.map(function (v) {
            return v.id
          }).join(",");
          ajaxRequest('post','back/scheduleJob/list/'+ids,{_method:'delete'},function(res){
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
      },
      handleEditCallback(rowInfo){
        let _this=this;
        if(rowInfo){
          if(rowInfo.id){
            ajaxRequest('put','back/scheduleJob/',
              {id:rowInfo.id,category:rowInfo.category,name:rowInfo.name,value:rowInfo.value,memo:rowInfo.memo},
              function(res){
                if(res.code===200){
                  _this.$message.success('编辑成功');
                  _this.edit=null;
                  let roleList = _this.tableData;
                  for(let i = 0,len = roleList.length; i < len; i++){
                    if(roleList[i].id===rowInfo.id){
                      _this.tableData.splice(i,1,rowInfo);
                      break;
                    }
                  }
                }
                else{
                  _this.$message.error('编辑失败');
                }
            });
          }
          else{
            ajaxRequest('post','back/scheduleJob/',
              {category:rowInfo.category,name:rowInfo.name,value:rowInfo.value,memo:rowInfo.memo},
              function(res){
                if(res.code===200){
                  _this.$message.success('新增成功');
                  _this.edit=null;
                  _this.getTableList();
                }
                else{
                  _this.$message.error('新增失败');
                }
            })
          }
        }
        else{
          this.edit=null
        }
      }
    },
    components:{
      EditTask
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
