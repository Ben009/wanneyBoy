<template>
  <mind-dialog
    :title="'缴费单新增'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="large"
    @close="handleCancel">
  <billFormSjd :callback="handelCompany"></billFormSjd>
    <br>
  <div class="title-item"><span>缴费单基本信息</span></div>
  <div>
      <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <div style="padding-top: 10px">
          <el-Row>
            <el-col :span="12">
              <el-form-item label="缴费单名称" prop="billName">
                <el-autocomplete style="width: 100%"
                                 v-model="form.billName"
                                 :fetch-suggestions="querySearchEntrust"
                                 @select="handleSelect"
                                 :trigger-on-focus="flag"
                ></el-autocomplete>
                <el-input v-model="form.companyId" v-show="false"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="单位联系人" prop="companyContact">
                <el-input v-model="form.companyContact" v-rightclick="handleRightClick.bind(this,form,'companyContact')"></el-input>
              </el-form-item>
            </el-col>
              <el-col :span="12">
                <el-form-item label="单位地址" prop="companyAddress">
                    <el-input v-model="form.companyAddress" v-rightclick="handleRightClick.bind(this,form,'companyAddress')"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
              <el-form-item label="单位联系电话" prop="companyPhone">
                    <el-input v-model="form.companyPhone" v-rightclick="handleRightClick.bind(this,form,'companyPhone')"></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="12">
              <el-form-item label="缴费单金额" prop="totalMoney">
                <span style="color: red">{{totalMoney}}</span>
              </el-form-item>
            </el-col>
              <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" v-rightclick="handleRightClick.bind(this,form,'remark')"></el-input>
              </el-form-item>
              </el-col>
          </el-Row>
        </div>
          <div class="title-item"><span>开票信息</span></div>
          <div style="padding-top: 10px">
            <el-Row>
              <el-col :span="12">
                <el-form-item label="名称" prop="ticketCompany">
                    <el-input v-model="form.ticketCompany" v-rightclick="handleRightClick.bind(this,form,'ticketCompany')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="纳税人识别号" prop="taxCode">
                  <el-input v-model="form.taxCode" v-rightclick="handleRightClick.bind(this,form,'taxCode')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地址、电话" prop="ticketAddressPhone">
                  <el-input v-model="form.ticketAddressPhone" v-rightclick="handleRightClick.bind(this,form,'ticketAddressPhone')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开户行及帐号" prop="ticketBankAccount">
                  <el-input v-model="form.ticketBankAccount" v-rightclick="handleRightClick.bind(this,form,'ticketBankAccount')"></el-input>
                </el-form-item>
              </el-col>
            </el-Row>
          </div>
      </el-form>
      <div style="text-align:center;padding: 35px 0px 10px 0px;">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
             <el-button @click="handleCancel">取 消</el-button>
          </span>
      </div>
  </div>
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
  import billFormSjd from './billFormSjd';

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
    name: "billForm",
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
        rules: {
            //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
            billName: [{type: 'string', required: true, message: '缴费单名称不能为空'}]
        },
        loading: false,
        remoteOptions: [],
        //autoComplete 是否不输入值就可匹配
        flag: false,
        registration_no:"",//够选中的登记号
        totalMoney:0,//缴费单金额
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
    },
    directives:{ rightclick },
    mixins:[rightClick],
    components:{
      billFormSjd
    },
    methods: {//方法定义
      handleSubmit() {
        let _this=this;
      //-- 表单提交处理 --
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
          if (valid) {
                  var httpMethod;//http请求方式
            if(!this.form.id||this.form.id==''){//新增 注意:通过id是否存在来判断是新增还是编辑
                httpMethod = 'post';
            }else {//更新
                httpMethod = 'put';
            }

            this.form.registrationNo = this.registration_no;
            this.form.billMoney = this.totalMoney;
            ajaxRequest(httpMethod, "back/bill/", this.form, (res)=> {
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
      handleSelect(item) {
        this.visable = true;
        this.$set(this.form, "companyId", item.id)
        this.$set(this.form, "billName", item.companyName)
        this.$set(this.form, "companyAddress", item.address)
        this.$set(this.form, "companyContact", item.contacter)
        this.$set(this.form, "companyPhone", item.telephone)
        //开票信息
        this.$set(this.form, "ticketCompany", item.invoiceCompany)
        this.$set(this.form, "taxCode", item.taxNo)
        this.$set(this.form, "ticketAddressPhone", item.invoiceAddressTel)
        this.$set(this.form, "ticketBankAccount", item.accountBankNo)
      },

      //委托单位autoComplete
      querySearchEntrust(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        let params = queryString ? {
          companyName: queryString,
          fuzzySearch: 1
        } : ''
        ajaxRequest('get', 'back/company/matchCompanysByName', params, (res) => {
          if (res.code == 200) {
            this.handleResult(res.rows);
            cb(res.rows)
          }
        })
      },
      handleResult(res) {
        for (let key in res) {
          Vue.set(res[key], 'value', res[key].companyName)
        }
      },
      handleCancel(){
          this.callback();
      },
      handelCompany(obj,djh,sumMoney){
        this.$set(this.form, "companyId", obj.COMPANY_ID)
        this.$set(this.form, "billName", obj.COMPANY_NAME)
        this.$set(this.form, "companyAddress", obj.ADDRESS)
        this.$set(this.form, "companyContact", obj.CONTACTER)
        this.$set(this.form, "companyPhone", obj.TELEPHONE)
        //开票信息
        this.$set(this.form, "ticketCompany", obj.INVOICE_COMPANY)
        this.$set(this.form, "taxCode", obj.TAX_NO)
        this.$set(this.form, "ticketAddressPhone", obj.INVOICE_ADDRESS_TEL)
        this.$set(this.form, "ticketBankAccount", obj.ACCOUNT_BANK_NO)
        this.registration_no = djh;
        this.totalMoney = sumMoney;
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
