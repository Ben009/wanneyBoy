<template>
  <div className="box">
    <div class="box-left" style="top:0;width:150px;">
      <el-menu
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#fff"
        @select="selectMenu"
        default-active="2">

        <el-menu-item index="1">
          <i class="el-icon-document"></i>
          <span slot="title">资源管理</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">角色管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-time"></i>
          <span slot="title">定时管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="box-middle" style="width:300px;left:150px;top:0;overflow: auto" >
      <!--<Table @showcontent="showContent" :meun-index="menuIndex"/>-->
      <iframe src="table.html" frameborder="0"></iframe>
    </div>
    <div class="box-right" style="left:450px;top:0;overflow: auto">
      <!--<FormView/>-->
      <iframe src="form.html" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';

  import {ajaxRequest, formatArrayToTree} from '../util/base';
  import FormView from '../mould/FormView';
  import Table from '../Table/demo1';
  import '../util/Base.css'

/*   import {Button, Menu,MenuItem,Switch,Icon,CheckboxGroup,Checkbox} from 'element--ui';
  Vue.use(Button);
  Vue.use(Menu);
  Vue.use(MenuItem);
  Vue.use(Switch);
  Vue.use(Icon);
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup); */

    export default {
        name: "admin2",
        components:{
          FormView,Table
        },
        data(){
            return{
              menuIndex:0
            }
        },
        methods:{
          showContent(){
            alert('刷新页面');
          },
          selectMenu(index,indexPath){
            alert('刷新页面');
            this.menuIndex=index;
          }
        }
    }
</script>

<style scoped>
  .box-left{
    background: #545c64;
  }
  .box-left .el-menu .el-menu-item.is-active{
    background-color: rgb(67,74,80)!important;
  }
  .box-middle {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index:1;
  }
  .box-right{
    padding: 20px;
  }
</style>
