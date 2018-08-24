<template>
  <mind-dialog
    :title="!!data.zmbId?'重命名':'新增'"
    :visible="true"
    width="30%"
    center
    v-dialogDrag
    @close="handleCancel">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <!--<el-col :span="12">&lt;!&ndash;v-show="false"&ndash;&gt;-->
            <!--<el-form-item label="主键" prop="mlId">-->
              <!--<el-input  v-model="form.mlId"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="22">
            <el-form-item label="目录名称" prop="mlName">
              <el-input  v-model="form.mlName"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button @click="handleCancel">取 消</el-button>
          </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../../util/base';
  import $ from 'jquery';


/*   import {
    Button,
    Checkbox,
    CheckboxGroup,
    Col,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
    Row,
    Select
  } from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox); */


  const defaults = {
    hoho:''
  };
  export default {
    name: "layout",
    props: {
      data: {
        type: Object
      },
      callback: {
        type:Function,
        required:true
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          mlName: [{type: 'string', required: true, message: '证书模板名称不能为空'}],
        },
        loading: false,
        remoteOptions: [],
      }
    },
    mounted() {
      this.remoteMethod();
    },
    methods: {
      handleSubmit() {
        let _this=this;
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(!_this.form.mlId){
              ajaxRequest('post',"back/certificateTemp/",_this.form,function(res){
                  if(res.code == 200){
                    _this.$message.success('添加成功');
                    _this.callback(res.daoResult.mlId);
                  }else {
                    _this.$message.error('添加失败');
                  }
              });
            }else{
              //把时间字段删掉
              delete _this.form.addTime
              delete _this.form.updateTime
              delete _this.form.deleteTime
              _this.form.actionType = "重命名";
              _this.form.actionContent
              ajaxRequest('put',"back/certificateTemp/updateCertificateTempMl",_this.form,function(res){
                if(res.code == 200){
                  _this.$message.success('修改成功');
                  _this.callback(_this.form.mlId);
                }else {
                  _this.$message.error('修改失败');
                }
              });
            }
          } else {
            return false;
          }
        })
      },
      remoteMethod(keyWords) {
        this.loading = true;
        $.ajax();
      },
      handleCancel(){
        this.callback();
      }
    },
  }
</script>

<style>
</style>
