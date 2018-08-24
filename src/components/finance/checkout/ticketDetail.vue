<template>
  <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
  <el-form label-width="140px">
    <div style="margin-top: 10px;border: dashed 1px red">
      <el-Row>
        <el-col :span="12">
          <el-form-item label="票种">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="data.ticketType"
              :disabled="true" style="width: 100%">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in ticketType"
                :key="item.code"
                :label="item.remark"
                :value="item.code*1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款方式" >
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="data.checkWay"
              :disabled="true" style="width: 100%">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in checkWay"
                :key="item.code"
                :label="item.remark"
                :value="item.code*1"
                >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" >
            <el-input v-model="data.ticketHead" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纳税人识别号" >
            <el-input v-model="data.taxCode" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址、电话" >
            <el-input v-model="data.ticketAddressPhone" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行及帐号" >
            <el-input v-model="data.ticketBankAccount" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票号" >
            <el-input v-model="data.ticketCode" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票金额" prop="ticketMoney">
            <el-input v-model="data.ticketMoney" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
    </div>
  </el-form>
</template>

<script>
  import Vue from 'vue';

  const defaults = {
  };
  export default {
    name: "checkoutInfo",
    props: {//用于接收从父组件中传来的数据
      data: {type: Object}
    },
    data() {
      return {
      }
    },
    computed: {
      ticketType() {
        return this.$store.state.finance.ticketType
      },
      checkWay() {
        return this.$store.state.finance.checkWay
      },
    },
    watch:{
    },
    methods: {
      //票种
      getTicketType() {
        this.$store.dispatch('getTicketType');
      },
      //付款方式
      getCheckWay() {
        this.$store.dispatch('getCheckWay');
      },
    },
    components: {
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.getTicketType();
      this.getCheckWay();
    },

  }
</script>

<style>
  <!--
  右键菜单样式设置

  -->
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
