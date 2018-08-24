<template>
  <mind-dialog
    title="角色-权限列表"
    :visible="true"
    center
    dialogSize="mid"
    :lock-scroll="true"
    v-dialogDrag
    @close="handleCancel">
    <el-button type="primary" size="mini" @click="checkAll">全选</el-button>
    <el-button type="warning" size="mini" style="margin-bottom: 10px;" @click="removeAll">重置</el-button>
    <div >
      <el-tree
        ref="tree"
        :data="data"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        @check-change="handleChange"
        >
      </el-tree>
    </div>
    <span slot="footer" class="dialog-footer">
       <el-button type="primary" @click="handleSubmit">保 存</el-button>
       <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>

</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../util/base';

/*   import  { Tree, Button} from 'element--ui';
  Vue.use(Tree);
  Vue.use(Button); */

  export default {
    name: "resource_role",
    props:{
      resourceList:{
        type:Array,
        required:true
      },
      roleId:{
        type:Number,
        required:true
      },
      callback:{
        type:Function,
        required:true
      }
    },
    data() {
      return {
        data:[],
        checked:[],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        test:[],
      }
    },
    methods:{
      handleChange(data, checked, indeterminate){

      },
      getResourceList(){
        ajaxRequest('get','back/module/getModuleTree',{showDesc: '1'
        },(data) =>{
          this.data = data;
          this.getCheckedResource();
        })
      },
      getCheckedResource(){
        ajaxRequest('get','back/roleModule/list',{roleId:this.roleId},(data)=>{
          if(data.code===200){
//            this.checked = data.rows.map(v=>v.moduleId);
            this.checked = data.rows.map(function(v) {
               if(v.isLeaf == 0) {
                return v.moduleId;
               }
            });
            this.$refs.tree.setCheckedKeys(this.checked);
          }
        })
      },
      checkAll(){
        ajaxRequest('get','back/module/list',{},(data)=>{
          if(data.code===200){
            this.checked = data.rows.map(v=>v.id);
            this.$refs.tree.setCheckedKeys(this.checked);
          }else{
            this.$message.error('请求错误！')
          }
        })
      },
      removeAll(){
            this.$refs.tree.setCheckedKeys([]);
      },
      handleSubmit(){
        var checkedData=[];
        this.$refs.tree.getCheckedKeys().forEach(val=>{
          checkedData.push({'roleId':this.roleId,'moduleId':val});
        })
        this.$refs.tree.getHalfCheckedKeys().forEach(val=>{//半选框的值获取
          checkedData.push({'roleId':this.roleId,'moduleId':val});
        })
        this.callback(checkedData, this.roleId);
      },
      handleCancel(){
        this.callback(null);
      }
    },
    mounted(){
      this.getResourceList();
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
