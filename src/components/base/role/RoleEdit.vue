<template>
  <mind-dialog :title="!!roleInfo.id?title:'新增角色'" :visible="true"  dialogSize="mini" center  v-dialogDrag @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">

      <el-form-item label="角色名称" prop="roleName">
        <el-input type="text" v-model.trim="form.roleName" ></el-input>
      </el-form-item>

      <el-form-item label="角色描述" prop="roleDesc">
        <el-input type="textarea" autosize v-model.trim="form.roleDesc"></el-input>
      </el-form-item>
      <el-form-item v-if="title == '复制' ? true : false ">
        <i class="el-icon-info"></i>
        <span>此功能仅复制原角色的权限，不复制原角色下的人员。</span>
      </el-form-item>


    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">{{buttonName}}</el-button>
      <el-button  @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import $ from 'jquery';

/*   import  { Form, FormItem, Input, Button} from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button); */

  const defaults={

  };
  export default {
    name: "role-edit",  
    props:{
      roleInfo:{
        type:Object,
        required:true
      },
      title:{
        type:String,
      },
      buttonName:{type:String},
      callback:{
        type:Function,
        required:true
      }
    },
    data() {
      let roleNameCheck = function(role,value,cb){
        if(!!!value){
          cb(new Error('角色名称不能为空！'))
        }else{
          value.length>80?cb(new Error('字符长度不能超过80！')): cb();
        }
      }
      return {
        form:$.extend({},defaults,this.roleInfo),
        rules:{
          roleName:[{ validator:roleNameCheck,required: true,}],
          roleDesc:[{type:'string',max:100,trigger:'blur',message:'字符长度不能超过100！'}]
        }
      }
    },
    methods:{
      handleSubmit(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            if( !this.roleInfo.id){
              this.form.addUser = window.localStorage.userId
              this.form.addUserName = window.localStorage.userName;
            }else{
              this.form.updateUser = window.localStorage.userId
              this.form.addUserName = window.localStorage.userName;
            }
            this.form.roleName = this.form.roleName.trim();
            this.callback(this.form,this.title);
          } else {
            return false;
          }
        })
      },
      handleCancel(){
        this.callback()
      }
    },
  }
</script>

<style scoped>

</style>
