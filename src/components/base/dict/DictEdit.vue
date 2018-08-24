<template>
  <mind-dialog :title="formData.id?'编辑字典':'新增字典'" :visible="true"  width="750px" center v-dialogDrag  @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">

      <!-- <el-form-item style="display:none" type="hidden" label="节点id" prop="treeNodeId">
        <el-input type="hidden" v-model="form.treeNodeId" ></el-input>
      </el-form-item> -->

      <el-form-item label="值" prop="value">
        <el-input type="text" v-model="form.value" ></el-input>
      </el-form-item>

      <el-form-item label="字典项文本" prop="text">
        <el-input type="text" autosize v-model="form.text"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input type="text" autosize v-model="form.remark"></el-input>
      </el-form-item>

       <el-form-item label="排序" prop="orderNum">
        <el-select v-model="form.orderNum"  :popperAppendToBody="false">
          <el-option v-for="v in 30" :value="v" :label="v"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import $ from 'jquery';

/*   import { Form, FormItem, Input, Button,} from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button); */

  const defaults={
  };
export default {
  name:'dictTable-add',
   props:{
      treeNodeId:{
        type:String,
        required:true
      },
      callback:{
        type:Function,
        required:true
      },
      formData:{
        type:Object,
        required:true
      }
    },
  data(){
      let valueCheck = function(rule, value, callback) {
          if (value) {
            let jmz = {};
            jmz.GetLength = function(str) {
              return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
            };  
            if(jmz.GetLength(value)>100){
              callback(new Error("值长度不能超过100个字符"));
            }else{
              callback();
            }
          } else {
            callback(new Error("请输入值"));
          }
    };
    let textCheck = function(rule, value, callback) {
          if (value) {
            let jmz = {};
            jmz.GetLength = function(str) {
              return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
            };  
            if(jmz.GetLength(value)>200){
              callback(new Error("字典项文本长度不能超过200个字符"));
            }else{
              callback();
            }
          } else {
            callback(new Error("请填写字典项文本"));
          }
    };
    let remarkCheck = function(rule, value, callback) {
          if (value) {
            let jmz = {};
            jmz.GetLength = function(str) {
              return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
            };  
            if(jmz.GetLength(value)>200){
              callback(new Error("长度不能超过200个字符"));
            }else{
              callback();
            }
          } else{
            callback();
          }
    };
      return{
        form:$.extend({},defaults,{'nodeId':this.treeNodeId}),
        rules:{
          value:{
            type: "string",
            validator: valueCheck,
            required: true,
            trigger: "blur"
            },
          text:{
            type: "string",
            validator: textCheck,
            required: true,
            trigger: "blur"
            },
          remark:{
            type: "string",
            validator:remarkCheck,
            // required: true,
            trigger: "blur"
            },
            
        }
      }
  },
  mounted(){
    if(!!this.formData.nodeId){
      this.form = this.formData
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
        this.callback(null);
      }
    },
}
</script>

<style scoped>

</style>

