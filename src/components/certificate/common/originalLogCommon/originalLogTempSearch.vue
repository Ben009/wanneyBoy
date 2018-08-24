<template>
  <mind-dialog
    title="搜索模板"
    :visible="true"
    width="700"
    height="500"
    @cell-click="checkMb"
    center
    v-dialogDrag
    @close="handleCancel">
        <el-form ref="form" :inline="true" :model="form"  :rules="rules" class="demo-form-inline formDiv">
          <el-form-item label="模板名称" prop="mbName">
            <el-input @keyup.enter.native="handleSubmit" v-model="form.mbName" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">查询</el-button>
             <el-button @click="handleCancel">返回</el-button>
          </el-form-item>
        </el-form>

        <el-table class="tabDiv" :data="gridData" :max-height="QJTableMaxHeight" @cell-click="checkMb" :row-style="{'cursor':'pointer'}">
          <el-table-column  label="模板名称" >
            <template slot-scope="scope">
              <span v-if="scope.row.auditFlag == 0 || scope.row.auditFlag == 1" style="color: red">{{ scope.row.mbName }}</span>
              <span v-if="scope.row.auditFlag == 2" style="color: green">{{ scope.row.mbName }}</span>
              <span v-if="scope.row.auditFlag == 3" >{{ scope.row.mbName }}</span>
            </template>
          </el-table-column>
          <el-table-column property="mlName" label="模板路径" ></el-table-column>
        </el-table>

  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../../util/base';
  import $ from 'jquery';


/*   import {
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
    Select
  } from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox); */


  const defaults = {
    hoho:''
  };
  export default {
    name: "OriginalLogTempSearch",
    props: {
      callback: {
        type:Function,
        required:true
      },
      applianceName:{
        default: "",
        required:false
      },
      checkPower:{
        default: false,
        required:false
      },

    },
    data() {
      return {
        form: {
          mbName:this.applianceName,
        },
        rules: {
          mbName: [{type: 'string', required: true, message: '模板名称不能为空'}],
        },
        loading: false,
        remoteOptions: [],
        gridData: [],
      }
    },
    mounted() {
      this.remoteMethod();
      this.query();
    },
    methods: {
      //搜索
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.query();
          } else {
            return false;
          }
        })
      },
      query(){
        if(this.form.mbName==""){
          return ;
        }
        ajaxRequest("get", "back/originalLogTemp/getMbByMbName",this.form, (res) => {
          if(res.daoResult){
            this.gridData = res.daoResult;
          }
        });
      },
      remoteMethod(keyWords) {
        this.loading = true;
        $.ajax();
      },
      //返回
      handleCancel(){
        this.callback();
      },
       //传递模板ID给父组件
      checkMb(row, column, cell, event) {
        if(row.mbId){
          if(row.auditFlag<3 && this.checkPower){
            let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限

            if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
              btnPower = "@@";
            }
            //按钮_证书添加时可使用未审核模板
            if(btnPower.indexOf("@M27107@") == -1){
              this.$message.warning('该模板未通过审核，系统不允许使用此模板！');
              return ;
            }
          }
          this.$emit('checkMb', row);
          this.callback();
        }
    }
    },
  }
</script>

<style lang="scss" scoped>
  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
  .formDiv{
    text-align: center;
  }
  .tabDiv{
    width: 100%;
    margin-top: 2% !important;
  }
</style>
