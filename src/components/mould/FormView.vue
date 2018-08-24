<template>
  <div  class="lg_css">
    <el-form ref="form" :model="form" label-width="80px" style="width: 300px">
      <el-form-item>用户登录</el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" plain @click="login">登录</el-button>
        <el-button size="small" type="danger" plain @click="delRetrieveItem(i)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';

  import {ajaxRequest, formatArrayToTree} from '../util/base';
  import ElFormItem from "@/common-el/packages/form/src/form-item.vue";

/*   import {Button,Col,  Radio,RadioGroup,Form ,FormItem,Input,Menu,MenuItem,Switch,Icon,CheckboxGroup,Checkbox,} from 'element--ui';
  Vue.use(Button); 
  Vue.use(Menu);
  Vue.use(MenuItem);
  Vue.use(Switch);
  Vue.use(Icon);
  Vue.use(Col);
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);  
  Vue.use(Radio);
  Vue.use(RadioGroup); */

    export default {
      components: {ElFormItem},
      name: "formView",
      data(){
          return{
            form:{
              username:'',
              password: ''
            },
          }
      },
      methods:{
        login(){
          ajaxRequest("post","back/sys/login",this.form,(res)=>{
            if(res.code == 200){
              window.location.href="admin.html";
            }else{
              alert("用户名或密码错误");
            }
          })
        }
      }
    }
</script>

<style scoped>
  .lg_css{
    position: absolute;
    width: 310px;
    /*background-color: blue;*/
    border: 1px solid black;
    /*margin-top: 50%;*/
    margin: auto 50%;
    top:200px;
    left:-155px;
  }
</style>
