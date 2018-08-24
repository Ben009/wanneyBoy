<template>
  <mind-dialog
    :title="'打印缴费单'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="mini"
    @close="handleCancel">
    <el-form ref="form" :model="account" :rules="rules" label-width="100px">
      <el-Row>
        <el-col :span="24" style="text-align: center">
          <el-radio-group v-model="printType" >
            <el-radio label="0">打给客户</el-radio>
            <el-radio label="1">本部自用</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="24">
          <el-form-item label="使用账户" prop="accountInfo">
            <el-select v-model="account.id" @change="changeAccountInfo" style="width: 100%">
              <el-option v-for="val in accountList" :label="val.accountInfo" :value="val.id" :key="val.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="开户名" prop="accountName">
            <el-input v-model="account.accountName"
                      v-rightclick="handleRightClick.bind(this,account,'accountName')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="开户行" prop="accountBank">
            <el-input v-model="account.accountBank"
                      v-rightclick="handleRightClick.bind(this,account,'accountBank')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="账号" prop="accountNo">
            <el-input v-model="account.accountNo"
                      v-rightclick="handleRightClick.bind(this,account,'accountNo')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handlePrint">打 印</el-button>
      <el-button @click="handleCancel">取 消</el-button>
</span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';

  import {ajaxRequest} from '../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';

  const defaults = {
  };
  export default {
    name: "printBillTypeDialog",
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function,
        required: true,
      },
      appData:{
        type:Array,
      },
      feeName:{
        type:Object,
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules:{},
        printType:"0",
        accountList:[],
        account:{},
      }
    },
    mounted() {
      this.getAccountSelect();
    },
    components: {},
    directives: {rightclick},
    mixins: [rightClick],
    methods: {
      //获取银行账户
      getAccountSelect(){
        ajaxRequest('get', 'back/account/getAccountSelect', {}, (res) => {
          if (res.code === 200) {
            this.accountList = $.extend(true,[],res.rows);
            this.account= res.rows[0];
          }
        })
      },
      changeAccountInfo(accountId){
        console.log("选择的账户",accountId);
        var arr = $.extend(true,[],this.accountList)
        arr.forEach(val => {
          if(val.id===accountId){
            this.account = val;
          }
        });
        console.log(this.account)
      },
      handlePrint(){
        this.printHtml("billDetailPrint",{bill:this.data,account:this.account,appData:this.appData,feeName:this.feeName,printType:this.printType});
        this.callback();
      },
      handleCancel() {
        this.callback();
      }
    },
  }
</script>

<style>
  .right-click-menu {
    position: fixed;
    border: 1px solid #ccc;
    padding: 2px 0;
    background: #fff;
    width: 100px;
    z-index: 9999;
  }

  .right-click-menu li {
    padding: 3px 10px;
    cursor: default;
    font-size: 14px;
    color: #606266;
  }

  .right-click-menu li:hover {
    color: #409eff;
  }

  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
