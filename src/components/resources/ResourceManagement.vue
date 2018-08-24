<template>
  <div style="height: 100%;min-height: 800px">
    <div style="top:0;width:15%;bottom:0;height: 100%;min-height: 800px;min-width: 100px">
      <el-tree
      ref="tree"
      :data="dataTreeList"
      node-key="id"
      highlight-current
      :props="{label:'name',children:'children'}"
      @node-click="handleNodeClick"
    >
    </el-tree>
    </div>
    <div  style="position:absolute;left:15%;width:85%;top:0;bottom:0;padding:5px;">
      <div class="el-tab_head" style="float:left;">
        <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(multipleSelection)">批量删除</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增资源</el-button>
      </div>
      <div class="el-tab_head" style="float:right;width:200px">
        <el-input placeholder="请输入资源名称" class="custom-input" @change="handleSearch">
          <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>

      <div class="el-tab_head">
        <el-table :max-height="QJTableMaxHeight"
          :data="dataList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称">
          </el-table-column>
          <el-table-column
            prop="icon"
            label="图标">
          </el-table-column>
          <el-table-column
            prop="rank"
            label="排序">
          </el-table-column>

          <el-table-column
            prop="description"
            label="描述"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            :formatter="function(row, column, cellValue, index){return TYPE[cellValue]}">
          </el-table-column>
          <el-table-column
            prop="url"
            label="url"
            width="250">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            :formatter="function(row, column, cellValue, index){return cellValue==0?'启用':'禁用'}">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="200">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-edit-outline" title="编辑"></i></el-button>
              <el-button @click="handleDelete([scope.row])" type="text" style="padding:0;font-size:18px;"><i class="el-icon-delete" title="删除"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="text-align:center;float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
    </div>
    <ResourceEdit v-if="!!edit" :rowInfo="edit" :callback="handleEditCallback"></ResourceEdit>
  </div>
</template>

<script>
  import Vue from 'vue';
  
  import {ajaxRequest, formatArrayToTree} from '../util/base';
  import ResourceEdit from './ResourceEdit'
  import '../util/Base.css';

/*   import {Tree, Table, TableColumn, Pagination} from 'element--ui';
  Vue.use(Tree);
  Vue.use(Table);
  Vue.use(TableColumn); */
  

  export default {
    name: "resource-management",
    data(){
      return {
        dataTreeList:[],
        pid:null,
        dataList:[],
        page:1,
        rows:10,
        total:0,
        searchKey:null,
        TYPE:['','目录','模块','页面','Action'],
        multipleSelection:[],
        edit:null,//编辑和新增弹窗
      }
    },
    created(){
      this.getDataList();
      this.getDataListByPid();
    },
    methods:{
      getDataList(){
        let _this = this;
        ajaxRequest('get','back/sysResource/list',null,(res)=>{
          if(res.code===200){
            let dataTreeList = formatArrayToTree(res.rows,[],0,[]);
            _this.dataTreeList=dataTreeList;
          }
        });
      },
      getDataListByPid(){
        if(this.searchKey){
          ajaxRequest('get','back/sysResource/retrieve',{
            name:this.searchKey,
            fuzzySearch:1,
            page:this.page,
            rows:this.rows,
            total:0
          },(res)=>{
            if(res.code===200){
              this.dataList=res.rows;
              this.total=res.total;
            }
          })
        }
        else{
          ajaxRequest('get','back/sysResource/list',{pid:this.pid, page:this.page,rows:this.rows,total:0},(res)=>{
            if(res.code===200){
              this.dataList=res.rows;
              this.total=res.total;
            }
          })
        }

      },
      handleNodeClick(data,node,comp){
        // console.log(this.$refs.tree.getCurrentNode());
        if(this.pid !== data.id){
          this.pid=data.id;
          this.getDataListByPid();
        }
      },
      handleSearch(value){
        this.searchKey=value;
        this.page=1;
        this.total=0;
        this.getDataListByPid();
      },
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getDataListByPid();
      },
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getDataListByPid();
      },
      handleDelete(data){
        if(data.length>0){
          let ids = data.map(function (v) {
            return v.id
          }).join(",");
          ajaxRequest('post','back/sysResource/list/'+ids,{_method:'delete'},function(res){
            if(res.code===200){
              this.$message.success('删除成功');
              this.getDataListByPid();
              this.getDataList();
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(roleInfo){
        this.edit=roleInfo || {}
      },
      handleEditCallback(data){
        let _this=this;
        if(data){
          if(data.id){
            ajaxRequest('put','back/sysResource/',
              {id:data.id,pid:data.pid,name:data.name,type:data.type,url:data.url,reqMethod:data.reqMethod,rank:data.rank,description:data.description,icon:data.icon},
              function(res){
                if(res.code===200){
                  _this.$message.success('编辑成功');
                  _this.edit=null;
                  _this.getDataList();
                  let tableData = _this.dataList;
                  for(let i = 0,len = tableData.length; i < len; i++){
                    if(tableData[i].id===data.id){
                      tableData.splice(i,1,data);
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
            ajaxRequest('post','back/sysResource/',
              {companyId:-1,pid:this.pid?this.pid:0,name:data.name,url:data.url,type:data.type,reqMethod:data.reqMethod,rank:data.rank,description:data.description,icon:data.icon},
              function(res){
                if(res.code===200){
                  _this.$message.success('新增成功');
                  _this.edit=null;
                  _this.getDataListByPid();
                  _this.getDataList();
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
      ResourceEdit
    }
  }
</script>

<style>

</style>
