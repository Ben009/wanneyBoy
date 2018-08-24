<template>
  <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
  <el-form ref="form" :model="form" label-width="140px">
    <div style="margin-top: 10px;border: dashed red 1px">
      <el-Row>
        <el-col :span="12">
          <el-form-item prop="ticketHead">
            <template slot = "label">
              <span>发票抬头</span>
            </template>
            <span>
              <el-input v-model="form.ticketHead" disabled></el-input>
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纳税人识别号" prop="taxCode">
            <el-input v-model="form.taxCode" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址/电话" prop="ticketAddressPhone">
            <el-input v-model="form.ticketAddressPhone" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行/账号" prop="ticketBankAccount">
            <el-input v-model="form.ticketBankAccount" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票号" prop="ticketCode">
            <el-input v-model="form.ticketCode" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票金额" prop="ticketMoney">
            <el-input v-model="form.ticketMoney" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <br>
    </div>
  </el-form>
</template>

<script>
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';

  const defaults = {
    addTime: new Date(),
  };
  export default {
    name: "detail-ticket",
    props: {//用于接收从父组件中传来的数据
      data: {type: Object},
    },
    data() {
      return {
      }
    },
    computed: {
      form() {//父子组件开票信息绑radioIndex定
        return this.data
      },
    },
    watch:{
    },
    methods: {

    },
    components: {
    },
    mounted() {

    },

  }
</script>

<style>
  .ft12{
    font-size: 12px;
  }
</style>
