<template>
  <mind-dialog
    :title="!!roleInfo.id?'编辑角色':'新增角色'"
    :visible="true"
    width="500px"
    center
    v-dialogDrag
    @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue'; 
  import $ from 'jquery';

  /* import { Form, FormItem, Input, Button} from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);  */

  const defaults={
    name:'',
    description:''
  };
  export default {
    name: "resource-edit",
    props:{
      roleInfo:{
        type:Object,
        required:true
      },
      callback:{
        type:Function,
        required:true
      }
    },
    data() {
      console.log(this.roleInfo);
      return {
        form:$.extend({},defaults,this.roleInfo),
        rules:{
          name:[{ required: true, message: '角色名称不能为空'}],
          description:[{ required: true, message: '角色描述不能为空'}]
        }
      }
    },
    methods:{
      handleSubmit(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.callback(this.form);
          } else {
            return false;
          }
        })
      },
      handleCancel(){
        this.callback();
      }
    },
  }
</script>

<style scoped>

</style>
