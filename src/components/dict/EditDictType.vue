<template>
  <mind-dialog
    :title="!!rowInfo.id?'编辑字典类型':'新增字典类型'"
    :visible="true"
    center
    dialogSize="mini"
    v-dialogDrag
    @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="物理名称" prop="dictCode">
        <el-input v-model="form.dictCode"></el-input>
      </el-form-item>
      <el-form-item label="逻辑名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="rank">
        <el-input v-model="form.rank"></el-input>
      </el-form-item>
      <el-form-item label="所属业务" prop="business">
        <el-input v-model="form.business"></el-input>
      </el-form-item>
      <el-form-item label="字典类型描述" prop="description">
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

/*   import { Form, FormItem, Input, Button} from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button); */

  const defaults={
    name:'',
  };
  export default {
    name: "edit-dict-type",
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
          callback(new Error('排序值不能为空'));
        }  else if ( !/^\d+$/.test(value)) {
          callback(new Error('排序格式不正确'));
        } else {
          callback();
        }
      };
      return {
        form:$.extend({},defaults,this.rowInfo),
        rules:{
          name:[{ required: true, message: '逻辑名称不能为空'}],
          dictCode:[{ required: true, message: '物理名称不能为空'}],
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
  }
</script>

<style scoped>

</style>
