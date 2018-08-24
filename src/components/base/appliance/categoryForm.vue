<template>
  <mind-dialog
    :title="!!data.id?'编辑器具类别':'新增器具类别'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="mini"
    @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="器具类别代码" prop="categoryCode">
        <el-input v-model="form.categoryCode" v-rightclick="handleRightClick.bind(this,form,'categoryCode')"></el-input>
      </el-form-item>
      <el-form-item label="器具类别名称" prop="categoryName">
        <el-input v-model="form.categoryName" v-rightclick="handleRightClick.bind(this,form,'categoryName')"></el-input>
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

  import {ajaxRequest} from '../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';



  const defaults = {
    hoho: ''
  };
  export default {
    name: "category-form",
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function,
        required: true
      }
    },
    data() {
      var checkCategoryCode = function(rule, value, callback) {
        if (!!value) {
          if(value.length>20){
            callback(new Error("最多输入20个字符"));
          }else {
            callback();
          }
        } else {
          callback(new Error("器具类别代码不能为空"));
        }
      };
      var checkCategoryName = function(rule, value, callback) {
        if (!!value) {
          if(value.length>100){
            callback(new Error("最多输入100个字符"));
          }else {
            callback();
          }
        } else {
          callback(new Error("器具类别名称不能为空"));
        }
      };
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          categoryCode: [{required: true, validator: checkCategoryCode}],
          categoryName: [{required: true, validator: checkCategoryName}]
        },
        loading: false,
        remoteOptions: [],
      }
    },
    mounted() {
      this.remoteMethod();
    },
    directives: {rightclick},
    mixins: [rightClick],
    methods: {
      //保存方法
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
        console.log(keyWords);
        this.loading = true;
        $.ajax();
      },
      //关闭弹窗方法
      handleCancel() {
        this.callback();
      }
    },
  }
</script>

<style>
  .right-click-menu {
    position: fixed;
    border: 1px solid #ccc;
    padding: 2px 0;
    background: #fff;
    width: 100px;
    z-index: 9999;
  }

  .right-click-menu li {
    padding: 3px 10px;
    cursor: default;
    font-size: 14px;
    color: #606266;
  }

  .right-click-menu li:hover {
    color: #409eff;
  }

  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
