<template>
  <mind-dialog
    :visible="true"
    dialogSize="mid"
    :title="!!data.id?'修改':'添加'"
    center
    v-dialogDrag
    append-to-body
    @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-row>
        <el-form-item label="部门名称">
          <el-select v-model="deptName" placeholder="请选择" @change="getOptionId">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.departName"
              :value="item.departName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="房间号">
          <el-input v-model="room"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
      </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";

/*   import {
    Button,
    Checkbox,
    CheckboxGroup,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
  } from 'element--ui'; 
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox); */

  const defaults = {
  };
  export default {
    name: "departmentRoomMaintainForm",
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object,
        require: true
      },
      callback: {
        type: Function,
        require: true
      },
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          deptCode: [{type: 'string', required: true, message: '部门名称不能为空',trigger: 'blur'}],
          room: [{type: 'string', required: true, message: '房间号不能为空',trigger: 'blur'}],
        },
        options:[],//部门名称list
        deptName:"",//部门名称
        deptCode:"",//部门id
        room:"",//房间号

      }
    },
    //asdad
    methods:{
      handleSubmit(){
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
          if (valid) {
            ajaxRequest('post', "back/exchange/addRoom", {
              id:this.form.id,
              deptCode:this.deptCode,
              room:this.room
            }, (res)=> {
              if(res.code == 200){
                this.$message.success('提交成功');
                this.callback(this.form);//回调刷新父页面表格
              }else{
                this.$message.error(res.msg);
              }
            });
          }else{
            return false;
          }
        })
      },
      getOptions(){
        ajaxRequest(
          "get",
          "back/depart/list",
          {
            isDelete: 0
          },
          res => {
            if (res.code === 200) {
              this.options = res.rows;
            }
          }
        );
      },
      getOptionId(value){
        for(let i=0;i<this.options.length;i++){
          if(this.options[i].departName===value){
            this.deptCode=this.options[i].id;
          }
        }
      },
      getInfo(){
        this.deptName=this.data.deptName;
        this.deptCode=this.data.deptCode;
        this.room=this.data.room;
      },
      handleCancel(){
        this.callback();
      },
    },
    mounted(){
      this.getOptions();
      this.getInfo();
    },
    created(){

    }
  }
</script>
