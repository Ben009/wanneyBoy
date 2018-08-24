<template>
  <mind-dialog :title="!!departInfo.id?'编辑部门':'新增部门'" :visible="true"  dialogSize="mini" center v-dialogDrag  @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" >

      <!--<el-form-item label="日期">-->

        <!--<el-date-picker-->
          <!--v-model="form.date"-->
          <!--type="date"-->
          <!--size="small"-->
          <!--placeholder="选择日期">-->
        <!--</el-date-picker>-->
      <!--</el-form-item>-->


      <el-form-item label="部门名称" prop="departName">
        <el-input type="text" ref="input" v-model="form.departName" ></el-input>
      </el-form-item>


      <el-form-item label="部门代码" prop="departCode">
        <el-input v-model="form.departCode" ></el-input>
      </el-form-item>

      <el-form-item label="部门简称" prop="departShortName">
        <el-input v-model="form.departShortName"></el-input>
      </el-form-item>

      <!-- <el-form-item label="部门描述" prop="departDesc">
        <el-input type="textarea" autosize v-model="form.departDesc"></el-input>
      </el-form-item> -->

      <!-- 要求是不用部门类型，并且数据字典的相应字段也不用 -->
      <!-- <el-form-item label="部门类型" prop="departType" >
        <el-select  v-model="form.departType">
          <el-option label="检测实验室" :value="1"></el-option>
          <el-option label="业务管理部" :value="2"></el-option>
          <el-option label="技术质量部" :value="3"></el-option>
          <el-option label="业务拓展部" :value="4"></el-option>
          <el-option label="驾驶室" :value="5"></el-option>
          <el-option label="所领导" :value="9"></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="电话" prop="telephone">
        <el-input type="text" v-model="form.telephone"></el-input>
      </el-form-item>

      <el-form-item label="传真" prop="fax">
        <el-input type="text" v-model="form.fax"></el-input>
      </el-form-item>

      <el-form-item label="地址" prop="address">
        <el-input type="text" v-model="form.address"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input type="text" v-model="form.email"></el-input>
      </el-form-item>


      <el-form-item prop="orderNum" >
        <template slot="label">
          <span>排序</span>
          <el-tooltip class="item" effect="dark" content="用于部门列表时的排序顺序"><i class="el-icon-info ft12"></i></el-tooltip>
        </template>
        <!-- 这里的排序不是全部数据的排序，只是按照当前显示的数据进行排列，可能有问题 -->
        <el-select  v-model="form.orderNum" :popperAppendToBody="false">
          <el-option v-for="(n,index) in 30" :value="n" :key="index">{{n}}</el-option>
        </el-select>
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

/*   import { Form, FormItem, Input, Button} from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button); */
  
  const defaults={

  };
  export default {
    name: "depart-edit",
    props:{
      departInfo:{
        type:Object,
        required:true
      },
      callback:{
        type:Function,
        required:true
      }
    },
    data() {
      let departNameCheck = function(rule, value, callback) {
          if (value) {
            let jmz = {};
            jmz.GetLength = function(str) {
              return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
            };  
            if(jmz.GetLength(value)>80){
              callback(new Error("部门名称长度不能超过80个字符"));
            }else{
              callback();
            }
          } else {
            callback(new Error("请输入部门名称"));
          }
    };

    let departCodesCheck = function(rule, value, callback) {
          if (value) {
            let jmz = {};
            jmz.GetLength = function(str) {
              return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
            };  
            if(jmz.GetLength(value)>5){
              callback(new Error("长度不能超过5个字符"));
            }else{
              callback();
            }
          } else {
            callback(new Error("请输入部门代码"));
          }
    };

    let faxCheck = function(rule, value, callback) {
          if (value) {
            let jmz = {};
            jmz.GetLength = function(str) {
              return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
            };  
            if(jmz.GetLength(value)>20){
              callback(new Error("传真长度不能超过20个字符"));
            }else{
              callback();
            }
          } else {
            callback();
          }
    };

    let addressCheck= function(rule, value, callback) {
          if (value) {
            let jmz = {};
            jmz.GetLength = function(str) {
              return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
            };  
            if(jmz.GetLength(value)>100){
              callback(new Error("地址长度不能超过100个字符"));
            }else{
              callback();
            }
          } else {
            callback();
          }
    };

      let mobilePhoneCheck = function(rule, value, callback) {
        if(value){
          let ruleRex = /^[0-9]*$/;
          if (ruleRex.test(value)) {
            if(value.length>20){
              callback(new Error("电话长度不能超过20个字符"));
            }else{
              callback();
            }
          } else {
            callback(new Error("请输入纯数字"));
          }
        }else{
          callback();
        }
      
    };

   

    let emailCheck = function(rule, value, callback) {
      if(value){
        let filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(value)) {
          if(value.length>40){
            callback(new Error("长度不能超过40个字符"));
          }else{
            callback();
          }
          
        }
        else {
        callback(new Error("请输入正确的电子邮件"));
        }
      }else{
        callback();
      }
      
    }
    
    

      return {
        form:$.extend({},defaults,this.departInfo),
        rules:{
          departName:{
            type: "string",
            validator: departNameCheck,
            required: true,
            trigger: "blur"
          },
          departCode:{
            type: "string",
            validator: departCodesCheck,
            required: true,
            trigger: "blur"
          },
          fax:{
            type: "string",
            validator: faxCheck,
            // required: true,
            trigger: "blur"
          },
          address:{
            type: "string",
            validator: addressCheck,
            // required: true,
            trigger: "blur"
          },
          departShortName:{
             type:'string',
             max:10,
             message: '长度不能超过10个字符'
          },
          // departType:[{ required: true, message: '请选择部门类型'}],
          orderNum:{
            required: true,
            message:'请选择排序'
          },
          // departDesc:[{required:false,type:'string',max:50,message:'长度不能超过50!',trigger:'blur'}]
          telephone:{
            type: "string",
            validator: mobilePhoneCheck,
            // required: true,
            trigger: "blur"
          },
          email:{
            type: "string",
            validator: emailCheck,
            // required: true,
            trigger: "blur"
          }
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
      }
    },
    mounted(){
      let that = this
      this.$nextTick(()=>{
        that.$refs.input.focus()
      })
    }
  }
</script>

<style scoped>

</style>
