<template>
  <mind-dialog :title="'变更审核'" :visible="true"  width="40%" center v-dialogDrag  @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-Row>

        <el-col :span="24">
          <el-form-item label="审核结果" prop="shStatus">
            <el-radio-group v-model="form.shStatus">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="审核意见" prop="opinion">
            <el-input v-model="form.opinion"></el-input>
          </el-form-item>
        </el-col>

      </el-Row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">审 核</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import ElCol from "@/common-el/packages/col/src/col";

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
    components: {ElCol},
    name: "layout",
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      var validateOpinion = (rule, value, callback) => {
        if (this.form.shStatus != '1' && !this.form.opinion) {
          callback(new Error("请输入审核意见"))
        } else {
          callback();
        }
      };

      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          opinion:[{validator: validateOpinion, trigger: 'blur'}],
        },
        loading: false,
      };
    },
    mounted() {
    },
    directives:{ rightclick },
    mixins:[rightClick],
    methods: {
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.callback(this.form);
          } else {
            return false;
          }
        })
      },
      remoteMethod(keyWords) {
      },
      handleCancel () {
        //关闭窗口
        this.callback()
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
