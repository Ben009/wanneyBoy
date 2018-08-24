<template>
  <mind-dialog
    :title="!!rowInfo.id?'编辑资源':'新增资源'"
    :visible="true"
    width="500px"
    center
    v-dialogDrag
    @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="资源类型" prop="type">
        <el-select v-model="TYPE[form.type]" style="width:100%">
          <el-option label="目录" value="1"></el-option>
          <el-option label="模块" value="2"></el-option>
          <el-option label="页面" value="3"></el-option>
          <el-option label="Action" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源URL" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item v-if="TYPE[form.type]==4" label="请求方式" prop="reqMethod">
        <el-select v-model="form.reqMethod" style="width:100%">
          <el-option label="get" value="1"></el-option>
          <el-option label="post" value="2"></el-option>
          <el-option label="put" value="3"></el-option>
          <el-option label="delete" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源排序" prop="rank">
        <el-input v-model="form.rank"></el-input>
      </el-form-item>
      <el-form-item label="资源描述" prop="description">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="资源icon" prop="icon">
        <el-input v-model="form.icon"></el-input>
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
      var validateRank = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入排序'));
        }  else if ( !/^\d+$/.test(value)) {
          callback(new Error('排序格式不正确'));
        } else {
          callback();
        }
      };
      return {
        TYPE:['','1','2','3','4'],
        form:$.extend({},defaults,this.rowInfo),
        rules:{
          name:[{ required: true, message: '资源名称不能为空'}],
          url:[{ required: true, message: '资源URL不能为空'}],
          reqMethod:[{ required: true, message: '请选择请求方式'}],
          rank:[{ required: true, validator: validateRank, trigger: 'blur' }],

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
    mounted(){
      //若是新增，类型默认为目录
      if($.isEmptyObject(this.rowInfo)){
        Vue.set(this.form, 'type', 1);
      }
    }
  }
</script>

<style scoped>

</style>
