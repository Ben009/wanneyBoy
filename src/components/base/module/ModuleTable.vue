<template>
  <el-row>
    <el-col :lg="4">
      <el-tree
        ref="tree"
        :data="treeData"
        :expand-on-click-node="false"
        node-key="id"
        highlight-current
        @node-click="handleNodeClick"
      >
      </el-tree>
    </el-col>
    <el-col :lg="20">
      <el-button type="primary" @click="handleEdit(null)">新增</el-button>
      <el-table :data="tableData"  border stripe  style="width: 100%" :max-height="QJTableMaxHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" ></el-table-column>
        <el-table-column label="id"  prop="id" align="center" width="100"></el-table-column>
        <el-table-column label="名称" prop="moduleName" align="center" max-width="160"></el-table-column>
        <el-table-column label="URL" prop="moduleUrl" align="center" max-width="160" ></el-table-column>
        <el-table-column  label="描述" prop="moduleDesc" align="center" max-width="160"></el-table-column>
        <el-table-column label="TAB页签名称" prop="moduleTabName" align="center" width="120" ></el-table-column>
        <el-table-column label="是否菜单" prop="isHidden" :formatter="formatterISHidden" align="center" width="50"></el-table-column>
        <el-table-column label="是否建标" prop="isJianbiao" :formatter="formatterISJianbiao" align="center" width="50"></el-table-column>
        <el-table-column label="直接展示" prop="isDefault" :formatter="formatterISDefault" align="center" width="50"></el-table-column>
        <el-table-column label="手机权限" prop="isMobile" :formatter="formatterISMobile" align="center" width="50"></el-table-column>
        <el-table-column label="排序" prop="sortIndex" align="center"  width="50"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-edit-outline" title="编辑"></i></el-button>
            <el-button @click="handleDelete(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-delete" title="删除"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <moduleEdit  v-if="!!edit" :moduleInfo="edit" :callback="handleEditCallback"></moduleEdit>
  </el-row>

</template>

<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import { ajaxRequest, ajaxProxyRequest } from "../../util/base";
  import moduleEdit from './moduleEdit'
  
/*   import { Tree, Button,TableColumn,Row,Col} from "element--ui";
  Vue.use(Tree);
  Vue.use(Button);
  Vue.use(TableColumn);
  Vue.use(Row);
  Vue.use(Col); */

  export default {
    name: "module-tree",
    components: {moduleEdit},
    data() {
      return {
        treeData:[],
        pid:null,
        tableData:[],
        searchKey:null,
        multipleSelection:[],
        edit:null,//编辑和新增弹窗
      }
    },
    methods: {
      formatterISHidden(row, column) {
        return this.formateIsOrNo(row.isHidden);
      },
      formatterISJianbiao(row, column) {
        return this.formateIsOrNo(row.isHidden);
      },
      formatterISDefault(row, column) {
        return this.formateIsOrNo(row.isHidden);
      },
      formatterISMobile(row, column) {
        return this.formateIsOrNo(row.isHidden);
      },
      formateIsOrNo(val) {
        if(val == '0') {
            return "否";
        }else {
          return "是";
        }
       },
      getTreeNodeData() {
        ajaxRequest('get','back/module/getModuleTree',{showDesc:"0"
          }, (res) => {
            this.treeData = res;
          }
        );
      },
      handleNodeClick(data,node,comp){
        if(this.pid !== data.id){
          this.pid=data.id;
          this.getDataListByPid();
        }
      },
      getDataListByPid() {
        ajaxRequest('get','back/module/list',{parentId:this.pid},(res)=>{
          if(res.code===200){
            this.tableData=res.rows;
          }
        })
      },
      handleDelete:function(data){
        var _this = this;
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxRequest('put','back/module/',{id:data.id,isDelete:1},function(res) {
            if (res.code === 200) {
              _this.$message.success('删除成功');
              _this.getDataListByPid();
            }
            else {
              _this.$message.error('删除失败');
            }
          });
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(moduleInfo){
        if(this.pid == null || this.pid =="") {
          this.$message.error('请先选择父节点');
          return;
        }
        this.edit=moduleInfo || {}
      },
      handleEditCallback(data){
        let _this=this;
        if(data){
          let pid = _this.pid;
          if(data.isMaster == "1") {
            pid = "0";
          }

          if(data.typef==0){
            ajaxRequest('put','back/module/',
              {id:data.id,parentId:data.parentId,moduleName:data.moduleName,moduleUrl:data.moduleUrl,moduleDesc:data.moduleDesc,
                moduleTabName:data.moduleTabName,icon:data.icon,advancedUserid:data.advancedUserid,isHidden:data.isHidden,
                isJianbiao:data.isJianbiao,isDefault:data.isDefault,isMobile:data.isMobile,sortIndex:data.sortIndex},
              function(res){
                if(res.code===200){
                  _this.$message.success('编辑成功');
                  _this.edit=null;
                  _this.getDataListByPid();
                }
                else{
                  _this.$message.error('编辑失败');
                }
              });
          }
          else{
            ajaxRequest('post','back/module/',
              {id:data.id,parentId:pid,moduleName:data.moduleName,moduleUrl:data.moduleUrl,moduleDesc:data.moduleDesc,
                moduleTabName:data.moduleTabName,icon:data.icon,advancedUserid:data.advancedUserid,isHidden:data.isHidden,
                isJianbiao:data.isJianbiao,isDefault:data.isDefault,isMobile:data.isMobile,sortIndex:data.sortIndex
              },
              function(res){
                if(res.code===200){
                  _this.$message.success('新增成功');
                  _this.edit=null;
                  _this.getDataListByPid();
                  this.getTreeNodeData();
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
    mounted() {
      this.getTreeNodeData();
    }
  };
</script>

