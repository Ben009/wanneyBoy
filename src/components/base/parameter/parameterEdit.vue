<template>
  <mind-dialog
    :title="!!data.id?'编辑参数':'新增参数'"
    :visible="true"
    width="35%"
    center
    v-dialogDrag
    @close="handleCancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
          <el-Row>
              <el-col :span="24">
                  <el-form-item label="参数名称" prop="paramColName">
                            <el-input v-model="form.paramColName"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="24">
              <el-form-item label="参数值" prop="paramColValue">
                        <el-input v-model="form.paramColValue"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="参数描述" prop="paramDesc">
                  <el-input v-model="form.paramDesc" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
              <el-form-item label="归属模块" prop="paramBlong">
                <el-input v-model="form.paramBlong" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="24">
              <el-form-item label="参数类别" prop="paramDifferent">
                <el-select v-model="form.paramDifferent" filterable placeholder="请选择" style="width: 100%">
                    <el-option value="1" label="系统配置">系统配置</el-option>
                    <el-option value="2" label="业务配置">业务配置</el-option>
                </el-select>
              </el-form-item>
              </el-col>
          </el-Row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../util/base';
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
  };
  export default {
    name: "parameter-edit",
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          paramColName: [{type: 'string', required: true, message: '参数名称不能为空'}],
          paramColValue: [{type: 'string', required: true, message: '参数值不能为空'}],
          paramDesc: [{type: 'string', required: true, message: '参数描述不能为空'}],
          paramBlong: [{type: 'string', required: true, message: '归属模块不能为空'}],
          paramDifferent: [{type: 'string', required: true, message: '参数类别不能为空'}]
        },
        loading: false
      }
    },
    mounted() {
    },
    methods: {
      handleSubmit() {
        let _this = this
        this.$refs.form.validate((valid) => {
          if (valid) {
            let rowInfo = this.form;
            delete rowInfo.updateTime;
            delete rowInfo.addTime;
            if(rowInfo.id){
                ajaxRequest('put','back/parameter/',rowInfo,function(res){
                  if(res.code===200){
                    _this.callback("success");
                  }else{
                    _this.callback("error");
                  }
                });
            }else{
              ajaxRequest('post','back/parameter/',rowInfo,function(res){
                if(res.code===200){
                  _this.callback("success");
                }else{
                  _this.callback("error");
                }
              });
            }
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

<style>
  .right-click-menu{
    position:fixed;
    border:1px solid #ccc;
    padding: 2px 0;
    background:#fff;
    width:100px;
    z-index:9999;
  }
  .right-click-menu li{
    padding:3px 10px;
    cursor:default;
    font-size:14px;
    color:#606266;
  }
  .right-click-menu li:hover{
    color:#409eff;
  }
  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
</style>
