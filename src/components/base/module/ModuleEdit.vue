<template>
  <mind-dialog
    :title="!!this.moduleInfo.id==null  ?'编辑菜单':'新增菜单'"
    :visible="true"
    :lock-scroll="true"
    width="550px"
    center
    v-dialogDrag
    @close="handleCancel">
    <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="140px" class="ModuleEdit " >
      <el-form-item label="是否根节点" prop="isMaster">
        <el-radio-group v-model="form.isMaster">
          <el-radio :label="0">否&nbsp;&nbsp;&nbsp;</el-radio>
          <el-radio :label="1">是&nbsp;&nbsp;&nbsp;</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否菜单" prop="isHidden">
        <el-radio-group v-model="form.isHidden" @change="isHiddenChang">
          <el-radio :label="0">菜单</el-radio>
          <el-radio :label="1">权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限ID" prop="id" :id="'moduleId'" style="display: none">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="moduleName">
        <el-input v-model="form.moduleName" ></el-input>
      </el-form-item>
      <el-form-item label="URL" prop="moduleUrl">
        <el-input v-model="form.moduleUrl" ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="moduleDesc">
        <el-input v-model="form.moduleDesc"></el-input>
      </el-form-item>
      <el-form-item label="TAB页签名称" prop="moduleTabName">
        <el-input v-model="form.moduleTabName" ></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon" >
        <el-input v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item label="直接展示人" prop="advancedUserid">
        <el-input v-model="form.advancedUserid" ></el-input>
      </el-form-item>
      <el-form-item label="是否建标" prop="isJianbiao">
        <el-radio-group v-model="form.isJianbiao">
          <el-radio :label="0">否&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          <el-radio :label="1">是&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所有人展示" prop="isDefault">
        <el-radio-group v-model="form.isDefault">
          <el-radio :label="0">否&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          <el-radio :label="1">是&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限类别" prop="isMobile">
        <el-radio-group v-model="form.isMobile">
          <el-radio :label="0">WEB权限</el-radio>
          <el-radio :label="1">手机权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sortIndex">
        <el-input-number v-model="form.sortIndex" controls-position="right" :min="1" :max="100"></el-input-number>
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

/*   import  { Form, FormItem, Input, Button, InputNumber} from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(InputNumber) */

  const defaults={
    isMaster:0,
    isHidden:0,
    isJianbiao:1,
    isDefault:0,
    isMobile:0,
    sortIndex:1
  };
  export default { 
    name: "module-edit",
    props:{
      moduleInfo:{
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
        if(value !==null && value!=='') {
          callback();
        }else if( !/^\d+$/.test(value)) {
          callback(new Error('只能输入数字'));
        } else {
          callback();
        }
      };
      return {
        form:$.extend({},defaults,this.moduleInfo),
        rules:{
          moduleName:[{ required: true, message: '名称不能为空'},{ max:30, message:'最多输入30个字符', trigger: 'blur' }],
          moduleUrl:[{ max:255, message:'最多输入255个字符', trigger: 'blur' }],
          moduleDesc:[{ max:100, message:'最多输入100个字符', trigger: 'blur' }],
          moduleTabName:[{ max:100, message:'最多输入100个字符', trigger: 'blur' }],
          icon:[{ max:100, message:'最多输入100个字符', trigger: 'blur' }],
          advancedUserid:[{ validator: validateRank, trigger: 'blur' },{ max:11, message:'最多输入11个字符', trigger: 'blur' }],
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
      },
      //是否菜单切换
      isHiddenChang() {
        if(this.form.isHidden == '1') {
          $("#moduleId").show();
        }else {
          $("#moduleId").hide();
        }
      }
    },
    mounted(){
      //type为1新增，0修改
      if($.isEmptyObject(this.moduleInfo)){
        Vue.set(this.form, 'typef', 1);
      }else {
        Vue.set(this.form, 'typef', 0);
      }
    }
  }
</script>

<style scoped lang="scss">
  .ModuleEdit{
    .el-input, .el-select, .el-input-number{
      width: 250px;
      }
    .el-button{
      padding:6px 15px;
    }
    .nopoint{
      pointer-events:none;
    }
  }
</style>
