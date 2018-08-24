<template>
  <mind-dialog
    :title="'缴费单追加'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="large"
    @close="handleCancel"
    :appendToBody="true"
  >
    <bill-form-sjd :callback="handelCompany" :isToAdd="true"></bill-form-sjd>
    <br>
    <div class="title-item"><span>缴费单基本信息</span></div>

      <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <div style="padding-top: 10px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="缴费单编号">
                <span style="font-weight: bold;color: blue">{{form.billNo}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-Row>
            <el-col :span="16">
              <el-form-item label="缴费单名称" prop="billName">
                <el-input v-model="form.billName" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缴费单金额" prop="totalMoney">
                <span style="color: red">{{totalMoney}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位联系人" prop="companyContact">
                <el-input v-model="form.companyContact" v-rightclick="handleRightClick.bind(this,form,'companyContact')" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位地址" prop="companyAddress">
                <el-input v-model="form.companyAddress" v-rightclick="handleRightClick.bind(this,form,'companyAddress')" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位联系电话" prop="companyPhone">
                <el-input v-model="form.companyPhone" v-rightclick="handleRightClick.bind(this,form,'companyPhone')" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" v-rightclick="handleRightClick.bind(this,form,'remark')" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-Row>
        </div>
        <div class="title-item"><span>开票信息</span></div>
        <div style="padding-top: 10px">
          <el-Row>
            <el-col :span="12">
              <el-form-item label="名称" prop="ticketCompany">
                <el-input v-model="form.ticketCompany" v-rightclick="handleRightClick.bind(this,form,'ticketCompany')" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纳税人识别号" prop="taxCode">
                <el-input v-model="form.taxCode" v-rightclick="handleRightClick.bind(this,form,'taxCode')" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址、电话" prop="ticketAddressPhone">
                <el-input v-model="form.ticketAddressPhone" v-rightclick="handleRightClick.bind(this,form,'ticketAddressPhone')" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户行及帐号" prop="ticketBankAccount">
                <el-input v-model="form.ticketBankAccount" v-rightclick="handleRightClick.bind(this,form,'ticketBankAccount')" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-Row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
    </span>

  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import billFormSjd from './billFormSjd.vue';
  import ElRow from "@/common-el/packages/row/src/row";

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
    name: 'billAddSjd',
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {},
        loading: false,
        remoteOptions: [],
        registration_no:"",//够选中的登记号
        totalMoney:this.data.billMoney,//缴费单金额
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
    },
    directives:{ rightclick },
    mixins:[rightClick],
    components:{
      ElRow,
      billFormSjd
    },
    methods: {//方法定义
      handleSubmit() {
        let _this=this;
        //-- 表单提交处理 --
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
          if (valid) {
            ajaxRequest('post', "back/bill/addBillSjd", {
              nos:this.registration_no,
              billId:this.form.id
            }, (res)=> {
              _this.callback(res);
            });
          }else{
            return false;
          }
        })
      },
      remoteMethod() {
        //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
      },
      //委托单位autoComplete
      handleCancel(){
        this.callback();
      },
      handelCompany(djh,sumMoney){
        this.registration_no = djh;
        this.totalMoney = this.data.billMoney + sumMoney;
      }
    },
  }
</script>

<style>
  <!-- 右键菜单样式设置 -->
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
