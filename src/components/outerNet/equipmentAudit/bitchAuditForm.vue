<template>
  <mind-dialog :title="'批量审核'" :visible="true"  width="40%" center v-dialogDrag  @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-Row>

        <el-col :span="24">
          <el-form-item label="审核结果" prop="qjshStatus">
            <el-radio-group v-model="form.qjshStatus">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">退回修改</el-radio>
              <el-radio :label="4">不予备案</el-radio>
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


  const defaults = {
    hoho:''
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
      var validateQjShStatus = (rule, value, callback) => {
        if (!this.form.canAuditSucc && this.form.qjshStatus == '1') {
          callback(new Error("部分器具检定周期、检定机构等信息未设置完全"))
        } else {
          callback();
        }
      };

      var validateOpinion = (rule, value, callback) => {
        if (this.form.qjshStatus != '1' && !this.form.opinion) {
          callback(new Error("请输入审核意见"))
        } else {
          callback();
        }
      };

      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          qjshStatus: [{validator: validateQjShStatus, trigger: 'blur'}],
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
