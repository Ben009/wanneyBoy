<template>
  <mind-dialog :title="!!postInfo.id?'编辑岗位':'新增岗位'" :visible="true" dialogSize="mini" center v-dialogDrag  @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="155px" >


      <el-form-item label="部门名称" prop="departId">
        <el-select v-model="form.departId"  @change="selectChange" :popperAppendToBody="false">
          <el-option v-for="(val,index) in departNameData" :label="val.departName" :value="val.departId" :key="index" ></el-option>
        </el-select>

      </el-form-item>

      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="form.postName"></el-input>
      </el-form-item>

      <el-form-item label="岗位代码" prop="postCode">
        <el-input v-model="form.postCode"></el-input>
      </el-form-item>

      <!--<el-form-item label="岗位简称" prop="postShortName">-->
        <!--<el-input v-model="form.postShortName"></el-input>-->
      <!--</el-form-item>-->

      <el-form-item prop="postCommission">
        <template slot="label">
          <span>岗位提成</span>
          <el-tooltip >
            <i class="el-icon-info" style="fontSize:12px;"></i>
            <div slot="content">统计报表可按该岗位的比例计算提成</div>
          </el-tooltip>

        </template>
        <el-input  v-model="form.postCommission">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>

      <el-form-item prop="testTerm" >
        <template slot="label">
          <span>检测周期(工作日)</span>
          <el-tooltip content="bottom center">
            <i class="el-icon-info" style="fontSize:12px;"></i>
            <div slot="content">
              <p>该岗位若维护具体的检测周期，受理时针对该岗位以维护的检测周期计算检测期限，</p>
              <p>若未维护，系统以统一设置的检测周期进行计算。</p></div>
          </el-tooltip>
        </template>
        <el-input  v-model="form.testTerm"></el-input>
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
  import  Vuex from  'Vuex';
  import $ from 'jquery';
  import { ajaxRequest } from '../../util/base';

/*   import { Form, FormItem, Input, Button} from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button); */

  const defaults={
  };
  export default {
    name: "post-edit",
    props:{
      postInfo:{
        type:Object,
        required:true
      },
      departNameData:{
        type:Array,
        required:true
      },
      callback:{
        type:Function,
        required:true
      }
    },
    data() {
      let validateTestTerm= (rule, value, callback) => {
        let reg=/^[0-9]*$/;
        if(value){
          if (!reg.test(value)) {
            callback(new Error('请输入纯数字'));
          }else{
            if(value.length>10){
              callback(new Error('长度不能超过10个字符'));
            }else{
              callback();
            }
          }
        } else {
          callback();
        }
      };

      let postNameCheck = function(rule, value, callback) {
          if (value) {
            let jmz = {};
            jmz.GetLength = function(str) {
              return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
            };  
            if(jmz.GetLength(value)>80){
              callback(new Error("岗位名称长度不能超过80个字符"));
            }else{
              callback();
            }
          } else {
            callback(new Error("请输入岗位名称"));
          }
    };
      return {
        form:$.extend({},defaults,this.postInfo),
        rules:{
          departId:[{required:true,message:'部门名称不能为空!',trigger:'blur'}],
          postName:{type: "string",
            validator: postNameCheck,
            required: true,
            trigger: "blur"},
          postCode:[{ type:'string',max:5, message: '长度不能超过5个字符!'}],
          postShortName:[{ required: true, message: '请填写岗位简称'}],
          testTerm:[{validator: validateTestTerm, trigger: 'blur'}],
          postCommission:[{validator:validateTestTerm,trigger:'blur'}]
        }
      }
    },
    methods:{
      selectChange(value){

      },
      handleSubmit(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.callback(this.form);
          } else {
            return false;
          }
          console.log(this.form,'form的数据')
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
