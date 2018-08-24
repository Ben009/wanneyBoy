<template>
  <mind-dialog
    title="设置角色权限"
    :visible="true"
    width="500px"
    center
    v-dialogDrag
    @close="handleCancel">
    <el-tree
      ref="tree"
      :data="resourceList"
      node-key="id"
      :props="defaultProps"
      show-checkbox
      check-strictly
      :default-checked-keys="checked"
      @check-change="handleCheckChange"
      >
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>

</template>

<script>
  import Vue from 'vue';
  
  import {ajaxRequest} from '../util/base';

  /* import { Tree, Button} from 'element--ui';
  Vue.use(Tree);
  Vue.use(Button); */

  export default {
    name: "set-authority-of-role",
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
        checked:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    methods:{
      getCheckedResource(){
        ajaxRequest('get','/back/sysRole/'+this.roleId+'/resource',null,(res)=>{
          if(res.code===200){
            this.checked = res.rows.map(v=>v.id);
            this.$refs.tree.setCheckedKeys(this.checked);
          }
        })
      },
      handleCheckChange(data, checked, childStatus){
        if(checked){
          this.checked.push(data.id);
        }
        else{
          this.checked=this.checked.filter(v=>v!==data.id)
        }
      },
      handleSubmit(){
        this.callback(this.checked);
      },
      handleCancel(){
        this.callback();
      }
    },
    mounted(){
      this.getCheckedResource();
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
