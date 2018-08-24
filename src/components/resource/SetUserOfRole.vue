<template>
  <mind-dialog
    title="设置角色用户"
    :visible="true"
    width="500px"
    center
    v-dialogDrag
    @close="handleCancel">
    <div>
      <div>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
      </div>
      <el-checkbox-group v-model="checked" @change="handleCheckChange">
        <div v-for="v in userList" style="display: inline-block;width:25%;"><el-checkbox :key="v.id" :label="v.id">{{v.name}}</el-checkbox></div>
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  
  import {ajaxRequest} from '../util/base';

 /*  import { Checkbox, CheckboxGroup, Button} from 'element--ui';
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup);
  Vue.use(Button); */

  export default {
    name: "set-user-of-role",
    props:{
      userList:{
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
        checkAll:false,
        isIndeterminate:false,
        checked:[]
      }
    },
    methods:{
      getCheckedUser(){
        ajaxRequest('get','back/sysRole/'+this.roleId+'/user',null,(res)=>{
          if(res.code===200){
            this.checked = res.rows.map(v=>v.id);
            this.handleCheckChange();
          }
        })
      },
      handleCheckAll(checkAll) {
        this.isIndeterminate=false;
        this.checkAll=checkAll;
        if(checkAll){
          this.checked = this.userList.map(v=>v.id);
        }
        else{
          this.checked=[];
        }
      },
      handleCheckChange(){
        let len=this.checked.length;
        if(len===0){
          this.checkAll=false;
          this.isIndeterminate=false;
        }
        else if(len===this.userList.length){
          this.checkAll=true;
          this.isIndeterminate=false;
        }
        else{
          this.checkAll=false;
          this.isIndeterminate=true;
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
      this.getCheckedUser();
    }
  }
</script>

<style scoped>

</style>
