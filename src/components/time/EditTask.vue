<template>
  <mind-dialog
    :title="!!rowInfo.id?'编辑任务':'新增任务'"
    :visible="true"
    width="500px"
    center
    v-dialogDrag
    @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="类别名称" prop="category">
        <el-input v-model="form.category"></el-input>
      </el-form-item>
      <el-form-item label="bean名称" prop="beanName">
        <el-input v-model="form.beanName"></el-input>
      </el-form-item>
      <el-form-item label="方法名称" prop="methodName">
        <el-input v-model="form.methodName"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="json参数" prop="jsonParam">
        <el-input v-model="form.jsonParam"></el-input>
      </el-form-item>
      <el-form-item label="corn表达式" prop="cornStr">
        <el-input v-model="form.cornStr"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="form.memo"></el-input>
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
  /* import { Form, FormItem, Input, Button} from 'element--ui'; */
  import $ from 'jquery';

   

  const defaults={
    name:'',
  };
  export default {
    name: "edit-user",
    props:{
      rowInfo:{
        type:Object,
        required:true
      },
      callback:{
        type:Function,
        required:true
      }
    },
    data() {
      console.log(this.rowInfo);

      return {
        form:$.extend({},defaults,this.rowInfo),
        rules:{
          category:[{ required: true, message: '类别名称不能为空'}],
          beanName:[{ required: true, message: 'bean名称不能为空'}],
          methodName:[{ required: true, message: '方法名称不能为空'}],
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
