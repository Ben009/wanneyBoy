<template>
  <mind-dialog
    :title="!!data.zmbId?'重命名':'新增'"
    :visible="true"
    width="30%"
    center
    v-dialogDrag
    @close="handleCancel">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-col :span="22">
            <el-form-item label="证书模板名称" prop="zmbName">
              <el-input  v-model="form.zmbName"></el-input>
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
import Vue from "vue";
import { ajaxRequest } from "../../../util/base";
import $ from "jquery";

/* import {
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
} from "element--ui";
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);  */

const defaults = {
  hoho: ""
};
export default {
  name: "layout",
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
    return {
      form: $.extend({}, defaults, this.data || {}),
      rules: {
        zmbName: [
          { type: "string", required: true, message: "证书模板名称不能为空" }
        ]
      },
      loading: false,
      remoteOptions: []
    };
  },
  mounted() {
    this.remoteMethod();
  },
  methods: {
    handleSubmit() {
      let _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!_this.form.zmbId) {
            ajaxRequest("post", "back/certificateMainTemp/", _this.form, function(res) {
              if (res.code == 200) {
                  _this.$message.success('添加成功');
                  _this.callback(res.daoResult.zmbType,res.rows);
              } else {
                _this.$message.error("添加失败");
              }
            });
          } else {
            //把时间字段删掉
            ajaxRequest("post", "back/certificateMainTemp/updateCertificate",{_method:'post',zmbId:_this.form.zmbId,zmbName:_this.form.zmbName,backupType:1,zmbType:_this.form.zmbType}, function(res) {

              if (res.code == 200) {
                _this.$message.success("修改成功");
                _this.callback(res.daoResult.zmbType,res.rows);
              } else {
                _this.$message.error("修改失败");
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    remoteMethod(keyWords) {
      this.loading = true;
      $.ajax();
    },
    handleCancel() {
      this.callback();
    }
  }
};
</script>

<style>
</style>
