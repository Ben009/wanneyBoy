<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-Row>
        <el-col :span="12">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" v-rightclick="handleRightClick.bind(this,form,'name')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色描述" prop="description">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否可编辑" prop="canEdit">
            <el-input :disabled="!form.canEdit" v-model="form.canEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="radio">
            <el-radio-group v-model="form.radio">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="爱好" prop="checkbox">
            <el-checkbox-group style="display:inline-block; line-height:1;" v-model="form.checkbox">
              <el-checkbox :label="0">读书</el-checkbox>
              <el-checkbox :label="1">打游戏</el-checkbox>
              <el-checkbox :label="2">健身</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="远程搜索" prop="remoteSelect">
            <el-select
              v-model="form.remoteSelect"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in remoteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="日期选择" prop="date">
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-Row>

    </el-form>
    <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
      <el-button>取 消</el-button>
    </span>
  </div>
</template>

<script>
  import Vue from 'vue';
  import $ from 'jquery';
  import rightclick from '../directives/rightcilck';
  import rightClick from '../mixins/FormRightClick';


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
  } from 'element--ui移除外部引入element';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox);
   */
  


  const defaults = {
    name: '',
    description: '',
    canEdit: 0,
    radio: '',
    checkbox: [],
    remoteSelect: '23',
    date: ''
  };
  export default {
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
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          name: [{type: 'string', required: true, message: '角色名称不能为空'}],
          description: [{type: 'string', required: true, message: '角色描述不能为空'}]
        },
        loading: false,
        remoteOptions: [],
      }
    },
    mounted() {
      this.remoteMethod();
    },
    directives:{ rightclick },
    mixins:[rightClick],
    methods: {
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            $.ajax();
          } else {
            return false;
          }
        })
      },
      remoteMethod(keyWords) {
        console.log(keyWords);
        this.loading = true;
        $.ajax();
      },

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
