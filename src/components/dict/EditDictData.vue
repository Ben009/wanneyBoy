<template>
  <mind-dialog
    :title="!!rowInfo.id?'编辑字典实体':'新增字典实体'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="mini"
    @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="物理名称" prop="dictCode">
        <el-input v-model="form.dictCode"></el-input>
      </el-form-item>
      <el-form-item label="逻辑名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="逻辑名称" prop="memo">
        <el-input v-model="form.memo"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="rank">
        <el-input v-model="form.rank"></el-input>
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
  Vue.use(Button);
 */

  const defaults={
    name:'',
  };
  export default {
    name: "edit-dict-data",
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
          dictCode:[{ required: true, message: '物理名称不能为空'}],
          name:[{ required: true, message: '逻辑值不能为空'}],
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
