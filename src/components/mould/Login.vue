<template>
  <!--<div  class="lg_css">-->
    <!--<el-form ref="form" :model="form" label-width="80px" style="width: 300px">-->
      <!--<el-form-item>用户登录</el-form-item>-->
      <!--<el-form-item label="用户名">-->
        <!--<el-input v-model="form.username" ref="username" @keyup.enter.native="toPwdInput"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="密码">-->
        <!--<el-input v-model="form.password" ref="password" type="password" @keyup.enter.native="login"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
        <!--<el-button size="small" type="primary" plain @click="login">登录</el-button>-->
        <!--<el-button size="small" type="danger" plain @click="delRetrieveItem(i)">取消</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->
  <!--</div>-->
  <div class="center">
    <div class="img"><img src="../../assets/img_login/dl-img-two.png" style="width:600px;"></div>

    <div class="login_form" style="margin-top:60px;">
      <div class="login" >
        <div class="login-two"><img src="../../assets/img_login/logo.png"></div>
        <div style="font-size: 18px; color: red; width: 368px;height: 24px; text-align: center;font-weight:bold;
        display: block; vertical-align: middle;">{{errMsg}}</div>
        <el-form ref="form" :model="form" label-width="80px" >
          <div class="form-control" style="margin-top:10px;box-sizing: border-box;">
            <img src="../../assets/img_login/dl-img-number.png" style="width:30px;">
            <input id="username" name="username" type="text" class="text" autocomplete="off" placeholder="请输入用户名" value="1651">
            <!--<el-input v-model="form.username" ref="username" class="text"-->
                      <!--autocomplete="off" placeholder="请输入用户名" @keyup.enter.native="toPwdInput"></el-input>-->
          </div>

          <div class="form-control" style="margin-top:20px;box-sizing: border-box;">
            <img src="../../assets/img_login/dl-img-password.png" style="width:30px;">
            <input id="password" name="password" type="password" class="text" autocomplete="off" placeholder="请输入密码" value="666666">
            <!--<el-input v-model="form.password" ref="password" type="password" @keyup.enter.native="login" class="text" placeholder="请输入密码"></el-input>-->
          </div>

          <div class=" space">
            <label class="t"></label>
            <el-button size="small" type="primary" plain class="form-control btn" style="margin-top: 12px;" @click="login">&nbsp;登&nbsp;录&nbsp;</el-button>
            <el-button size="small" plain  class="form-control " style="margin-top: 12px; margin-left: 20px;" @click="delRetrieveItem(i)">&nbsp;取&nbsp;消&nbsp;</el-button>
          </div>
        </el-form>

      </div>
    </div>
    <ul id="supersized" class="speed" style="visibility: visible;">
      <li class="slide-2 prevslide" ><a target="_blank"><img src="../../assets/img_login/bg.png" style="width: 100%; height: 916px;  top: 0px;"></a></li>
    </ul>
  </div>

</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import md5 from 'js-md5';
  import $ from 'jquery';

  import {ajaxRequest,ajaxSyncProxyRequest, formatArrayToTree} from '../util/base';
  import ElFormItem from "@/common-el/packages/form/src/form-item.vue";

/*   import {Button,Col,  Radio,RadioGroup,Form ,FormItem,Input,Menu,MenuItem,Switch,Icon,CheckboxGroup,Checkbox} from 'element--ui';
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
            errMsg:""
          }
      },
      methods:{
        login(){
          let _this = this;
          if($.trim($("#username").val()) == "") {
            _this.errMsg="请输入用户名";
            return;
          }else if($.trim($("#password").val()) == "") {
            _this.errMsg="请输入密码";
            return;
          }
          ajaxRequest("post","back/sys/login",{username: $.trim($("#username").val()), password: md5($.trim($("#password").val()))},(res)=>{
            if(res.code == 200){
              localStorage.setItem("userId", res.map.userId);
              localStorage.setItem("userNo", res.map.userNo);//登录名
              localStorage.setItem("userName", res.map.userName);//真实姓名
              localStorage.setItem("departId", res.map.departId);//部门编号
              localStorage.setItem("departName", res.map.departName);//部门名称
              localStorage.setItem("position", res.map.position);//职务
              localStorage.setItem("mobilePhone", res.map.mobilePhone);//手机
              localStorage.setItem("officePhone", res.map.officePhone);//办公电话
              localStorage.setItem("fax", res.map.fax);//传真
              localStorage.setItem("address", res.map.address);//地址
              localStorage.setItem("email", res.map.email);//邮箱
              localStorage.setItem("headPortrait", res.map.headPortrait);//头像地址
              localStorage.setItem("btnPower", res.map.btnPower);//按钮权限
              localStorage.setItem("layim-token", res.map.layimToken);//即时通讯令牌
              localStorage.setItem("layim-ws", res.map.layimWs);//即时通讯服务地址
              localStorage.setItem("layim-web",res.map.layimWeb);//即时通讯服务代理前缀
              localStorage.setItem("userMenus", res.map.userMenus);//用户所有有权限的菜单，@拼接
              for(let k in res.map.baseInfo){
                let tp=res.map.baseInfo[k]
                localStorage.setItem(k,tp.value);//系统基础信息
              }
              this.$router.push("/");
              ajaxSyncProxyRequest("post","/njmind/findParams/fileUploadUrl$fileDownloadUrl",{},(ress)=>{
                if(ress['fileUploadUrl'].value){
                  localStorage.setItem("fileUploadUrl",ress['fileUploadUrl'].value);
                }
                if(ress['fileDownloadUrl'].value){
                  localStorage.setItem("fileDownloadUrl",ress['fileDownloadUrl'].value);
                }
              });
            }else{
              _this.errMsg=res.msg;
            }
          })
        },
      },
      mounted(){
        let _this =this;
        $("#username").keyup(function(event){
            if(event.keyCode ==13){
              $("#password").focus();
            }
          });
        $("#password").keyup(function(event){
          if(event.keyCode ==13){
            _this.login();
          }
        });
      }
    }
</script>
<style lang="postcss" src="../../assets/css/login.css" scoped></style>
