<template>
  <div style="position:relative;">
    <div>

      <span style="display: inline-block;line-height:32px;vertical-align: top;">主题色</span>
      <el-select :value="themeColor" placeholder="请选择" @change="handleToggleTheme" size="small" style="width:100px">
        <el-option
          v-for="item in themeColors"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(multipleSelection)">批量删除</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增角色</el-button>
    </div>
    <div style="position:absolute;top:0;right:0">


      <el-input placeholder="请输入角色名称" class="custom-input" @change="handleSearch">
        <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <br/>
    <div>
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
          prop="name"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="description"
          label="角色描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-edit-outline" title="编辑"></i></el-button>
            <el-button @click="handleSetAuthority(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-setting" title="设置权限"></i></el-button>
            <el-button @click="handleSetUser(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-circle-plus" title="设置用户"></i></el-button>
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
    <ResourceEdit v-if="!!edit" :roleInfo="edit" :callback="handleEditCallback"></ResourceEdit>
    <SetUserOfRole v-if="!!setUser" :userList="userList" :roleId="setUser.id" :callback="handleSetUserCallback"></SetUserOfRole>
    <SetAuthorityOfRole v-if="!!setAuthority" :resourceList="resourceList" :roleId="setAuthority.id" :callback="handleSetAuthorityCallback"></SetAuthorityOfRole>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  
  import {ajaxRequest, formatArrayToTree} from '../util/base';
  import ResourceEdit from './ResourceEdit';
  import SetUserOfRole from './SetUserOfRole';
  import SetAuthorityOfRole from './SetAuthorityOfRole';

  /* import {Button,  Table, TableColumn} from 'element--ui';
  Vue.use(Button); 
  Vue.use(Table);
  Vue.use(TableColumn); */
  
  export default {
    name: "resource-table",
    components:{ResourceEdit, SetUserOfRole, SetAuthorityOfRole},
    data() {
      return {
        page:1,
        rows:10,
        total:0,
        searchKey:'',
        tableData:[],
        multipleSelection:[],

        edit:null,

        setUser:null,
        userList:[],

        setAuthority:null,
        resourceList:[],
      }
    },
    methods:{
      getRoleList(){
        if(this.searchKey){
          ajaxRequest('get','back/sysRole/retrieve',{
            name:this.searchKey,
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
          ajaxRequest('get','back/sysRole/list',{
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
      getUserList(){
        ajaxRequest('get','back/sysUser/list',null,(res)=>{
          if(res.code===200){
            this.userList=res.rows;
          }
        })
      },
      getResourceList(){
        ajaxRequest('get','back/sysResource/list',null,(res)=>{
          if(res.code===200){
            this.resourceList=formatArrayToTree(res.rows,[],0,[]);
          }
        });
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
        this.getRoleList();
      },
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getRoleList();
      },
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getRoleList();
      },
      handleDelete(data){
        if(data.length>0){
          let ids = data.map(function (v) {
            return v.id
          }).join(",");
          ajaxRequest('post','back/sysRole/list/'+ids,{_method:'delete'},function(res){
            if(res.code===200){
              this.$message.success('删除成功');
              this.getRoleList();
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
      handleEdit(roleInfo){
        this.edit=roleInfo || {}
      },
      handleEditCallback(roleInfo){
        let _this=this;
        if(roleInfo){
          if(roleInfo.id){
            ajaxRequest('put','back/sysRole/',{id:roleInfo.id,name:roleInfo.name,description:roleInfo.description},function(res){
              if(res.code===200){
                _this.$message.success('编辑成功');
                _this.edit=null;
                let roleList = _this.tableData;
                for(let i = 0,len = roleList.length; i < len; i++){
                  if(roleList[i].id===roleInfo.id){
                    _this.tableData.splice(i,1,roleInfo);
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
            ajaxRequest('post','back/sysRole/',{companyId:-1,name:roleInfo.name,description:roleInfo.description},function(res){
              if(res.code===200){
                _this.$message.success('新增成功');
                _this.edit=null;
                _this.getRoleList();
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
      },
      handleSetUser(roleInfo){
        this.setUser=roleInfo;
      },
      handleSetUserCallback(checked) {
        if(checked){
          ajaxRequest('post','back/userRoleMid/list',{_method:"put",isSysUser:1,roleId:this.setUser.id,userIds:checked.join(",")},(res)=>{
            if(res.code===200){
              this.setUser=null;
              this.$message.success('修改成功');
            }
            else{
              this.$message.error('修改失败');
            }
          })
        }
        else{
          this.setUser=null;
        }
      },
      handleSetAuthority(roleInfo){
        this.setAuthority=roleInfo;
      },
      handleSetAuthorityCallback(checked){
        if(checked){
          ajaxRequest('post','back/roleResource/list',{_method:"put",roleId:this.setAuthority.id,resourceIds:checked.join(",")},(res)=>{
            if(res.code===200){
              this.setAuthority=null;
              this.$message.success('修改成功');
            }else{
              this.$message.error(res.msg || '修改失败');
            }
          })
        }
        else{
          this.setAuthority=null;
        }
      }
    },
    mounted() {
      this.getRoleList();
      this.getUserList();
      this.getResourceList();
    }
  }
</script>

<style>
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
