<template>
  <div>
    <div class="title-item"><span>器具列表</span></div>
    <div>
      <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%"
                show-summary
                :summary-method="getSummaries"
                :span-method="arraySpanMethod">
        <el-table-column type="index" width="40" label="序号"></el-table-column>
        <el-table-column prop="ORDER_NO" label="委托单编号"></el-table-column>
        <el-table-column prop="COMPANY_NAME" label="委托单位"></el-table-column>
        <el-table-column prop="REGISTRATION_NO" label="登记号" ></el-table-column>
        <el-table-column prop="APPLIANCE_NAME" label="器具名称" ></el-table-column>
        <el-table-column prop="SET_NUMBER" label="套数" ></el-table-column>
        <el-table-column prop="IS_DISCOUNT" label="是否可打折" :formatter="function(row, column, cellValue, index){return cellValue==0?'不可打折':'可打折'}"></el-table-column>
        <el-table-column prop="DISCOUNT" label="折扣" ></el-table-column>
        <el-table-column prop="JDF_ACTUAL" label="检测费（实收）" ></el-table-column>
        <el-table-column prop="FJF_ACTUAL" label="附加费（实收）" ></el-table-column>
        <el-table-column prop="XLF_ACTUAL" label="修理费（实收）" ></el-table-column>
        <el-table-column prop="JJF_ACTUAL" label="加急费（实收）" ></el-table-column>
        <el-table-column prop="FWF_ACTUAL" label="服务费（实收）" ></el-table-column>
        <el-table-column prop="QTF_ACTUAL" label="其他费（实收）" ></el-table-column>
        <el-table-column prop="WORKLOAD_ACTUAL" label="工作量（实收）" ></el-table-column>
        <el-table-column prop="INTENSIVE_WORKLOAD_ACTUAL" label="强检工作量（实收）" ></el-table-column>
        <el-table-column prop="TOTAL_ACTUAL" label="费用合计（实收）" ></el-table-column>
      </el-table>
    </div>
    <div class="title-item"><span>缴费单基本信息</span></div>
    <div>
      <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
      <el-form ref="form" :model="form" label-width="140px">
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
                <el-input v-model="form.billName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缴费单金额" prop="billMoney">
                <span style="color: red">{{form.billMoney}}</span>
              </el-form-item>
            </el-col>
          </el-Row>
          <el-Row>
            <el-col :span="8">
              <el-form-item label="单位联系人" prop="companyContact">
                <el-input v-model="form.companyContact" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位地址" prop="companyAddress">
                <el-input v-model="form.companyAddress" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位联系电话" prop="companyPhone">
                <el-input v-model="form.companyPhone" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-Row>
        </div>
        <div class="title-item"><span>开票信息</span></div>
        <div style="padding-top: 10px">
          <el-Row>
            <el-col :span="12">
              <el-form-item label="名称" prop="ticketCompany">
                <el-input v-model="form.ticketCompany" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纳税人识别号" prop="taxCode">
                <el-input v-model="form.taxCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址、电话" prop="ticketAddressPhone">
                <el-input v-model="form.ticketAddressPhone" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户行及帐号" prop="ticketBankAccount">
                <el-input v-model="form.ticketBankAccount" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-Row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入右击事件 可自行绑定到输入框
  import ElCol from "@/common-el/packages/col/src/col";

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

  export default {
    name: "bill-detail",
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object
      }
    },
    data() {
      return {
        form: $.extend({}, this.data || {}),
        tableData: [],//列表
      }
    },
    mounted() {
      this.getTableList();
    },
    components: {
      ElCol
    },
    methods: {//方法定义
      getTableList() {
        let _this = this;
        ajaxRequest('get', 'back/bill/' + this.form.id, {}, (res) => {
          if (res.code === 200) {
            _this.form = res.daoResult;
            _this.tableData = res.daoResult.sjdList;
          }
        })
      },
      //合计行
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 1 || index === 6) {
            sums[index]='';
            return;
          }
          if (index === 3) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (rowIndex === this.tableData.length) {
          if (columnIndex === 0) {
            return [1, 2];
          } else if (columnIndex === 1) {
            return [0, 0];
          }
        }
      },
    }
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
