<template>
  <div>
    <sjdList ref="sjdList" @change-ticket-name="changeTicketName" :getTotalBalance="getTotalBalance"></sjdList>
    <br>
    <div class="title-item"><span>结账信息</span></div>
    <div style="width: 100%;">
      <el-form :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="开票单位" prop="ticketCompany">
              <el-autocomplete v-model="form.ticketCompany"
                               :fetch-suggestions="querySearchEntrust"
                               placeholder="请输入委托单位"
                               @select="handleSelect"
                               :trigger-on-focus="flag"
                               style="width: 100%">
                <template slot-scope='scope'>
                  <div>
                  <span style="margin-left:0">({{scope.item.companyType}}) {{scope.item.companyName}}
                     (<span :style="{color:scope.item.status == 0 ? 'red' : 'green'}">{{scope.item.status == 0 ? '未审核' : '已审核'}}</span>)
                     {{!!scope.item.companyDepart ? '[' + scope.item.companyDepart + ']' : ''}}
                     {{!!scope.item.contacter ? '[' + scope.item.contacter + ']' : ''}}
                     {{!!scope.item.mobilePhone ? '[' + scope.item.mobilePhone + ']' : ''}}
                  </span>
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="checkoutTime">
              <template slot = "label">
                <span>到账日期</span>
                <el-tooltip class="item" effect="dark" content="默认当天，可改">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-date-picker
                v-model="form.checkoutTime"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="票种" prop="ticketType">
              <template slot = "label">
                <span>票种</span>
                <el-tooltip class="item" effect="dark" content="发票类型，可通过“基础数据=>数据字典=>财务模块=>票种”维护">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-select placeholder="请选择" value-key="name" v-model="form.ticketType" style="width: 100%">
                <el-option
                  v-for="(item,index) in ticketTypes" :key="index" :label="item.remark" :value="item.code*1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款方式" prop="checkWay">
              <template slot = "label">
                <span>付款方式</span>
                <el-tooltip class="item" effect="dark" content="发票类型，可通过“基础数据=>数据字典=>财务模块=>付款方式”维护">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-select placeholder="请选择" value-key="name" v-model="form.checkWay" style="width: 100%">
                <el-option
                  v-for="(item,index) in checkWays" :key="index" :label="item.remark" :value="item.code*1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <addTicket v-for="(item,index) in ticketList"
                    ref="form"
                    :dataindex="index"
                    :data="item"
                    :key="index"
                    @selection-change="selectionChange">
      </addTicket>
    </div>
    <div style="margin:10px 0;" v-if="list.length!=0">
      <div class="title-item"><span>关联到款信息</span></div>
      <el-table :max-height="QJTableMaxHeight"
                :data="list"
                border
                style="width: 100%;margin-top: 10px"
                v-loading="loading">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="paymentCompany" label="付款单位"></el-table-column>
        <el-table-column prop="paymentAccount" label="付款账号"></el-table-column>
        <el-table-column prop="payTime" :formatter="formatterpayTime" label="付款时间"></el-table-column>
        <el-table-column prop="payMoney" label="到账金额"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column prop="balance" label="余额" ></el-table-column>
        <el-table-column prop="claimMoney" label="认领金额"></el-table-column>
      </el-table>
    </div>
    <br>
    <div style="text-align: center;margin-bottom: 20px">
      <el-button type="primary" v-mindPopover="{message:'确认结账操作?',success:checkout.bind(this),isOpen:handleOpen.bind(this)}">结 账</el-button>
      <el-button type="success" @click="toPrint">打 印</el-button>
      <el-button type="danger" v-if="list.length>0" v-mindPopover="{message:'确认取消关联到款？',success:cancelAccountClaim.bind(this)}">取消关联</el-button>
      <el-button type="primary"  v-if="list.length==0" @click="accountClaim">关联到款</el-button>
    </div>
    <accountClaimPage v-if="!!claim" :callback="claimCallback" :source="0" :totalBalance="totalBalance"></accountClaimPage>
  </div>
</template>

<script>
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest,formatDate} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  import sjdList from './sjdList.vue';
  import addTicket from './addTicket.vue';
  import accountClaimPage from './accountClaimPage.vue';

  const defaults = {};
  export default {
    name: "other-check-out",
    props: {//用于接收从父组件中传来的数据},
    },
    data() {
      let ticketCompanyCheck = (rule,value,cb)=>{
        if(!!value){
          if(value.length>100){
            cb(new Error('最多输入100个字符'))
          }else{
            cb()
          }
        }else{
          cb(new Error('开票单位不能为空！'))
        }
      }
      return {
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          checkoutTime: [{type: 'date', required: true, message: '到账日期不能为空'}],
          ticketCompany: [{ type: "string", required: true, validator:ticketCompanyCheck,trigger:'blur'}],
        },
        flag: false,
        form: {"ticketCompany": "", "checkoutTime": new Date(),"ticketType":'',"checkWay":''},
        ticketList: [{
          "ticketMoney": 0,
          "ticketCode" : "",
          "ticketHead":"",
          "taxCode":"",
          "ticketAddressPhone":"",
          "ticketBankAccount":""
        }],
        defaultForm: {//开票新增数据
          "ticketMoney": 0
        },
        registration_no: '',//勾选的登记号;拼接字段
        realChargeTotal: '',//勾选的实收费合计
        firstSelected: {},//勾选的第一个登记号信息
        claim:false,//关联到款弹层
        list:[],//关联的list
        ticketTypes:[],//票种
        checkWays:[],//结账方式
        totalBalance:0,//结账金额
        loading:false,
      }
    },

    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.getTicketType();
      this.getCheckWay();
    },
    components: {
      sjdList,
      addTicket,
      accountClaimPage,
    },
    computed: {},
    methods: {//方法定义
      //时间格式转换
      formatterpayTime:function(row, column){
        return formatDate(row.payTime,'YYYY-MM-DD');
      },
      //从sjdList页面接收结账金额
      getTotalBalance(money){
        if(!!money){
          this.totalBalance=money;
        }else{
          this.totalBalance=0;
        }
      },
      //撤销页面到款信息
      cancelAccountClaim() {
        this.list=[];
      },
      //关联到款回调
      claimCallback(arr){
        if(arr!=null) {
          this.list = arr;
          this.$nextTick(() => {
            this.claim = false;
          });
        }else{
          this.claim = false;
        }
      },
      //结账按钮事件
      checkout() {
        //-- 表单提交处理 --
        if (this.registration_no == '' || this.registration_no == 'undefined') {
          this.$message.error('请勾选登记号');
          return;
        } else {
          let userId = localStorage.getItem("userId");
          let _this = this, ticketMoneyTotal = Number(0), errorFlag = true;
          this.ticketList.forEach((v, i) => {
            this.ticketList[i].ticketType=this.form.ticketType;
            this.ticketList[i].checkWay=this.form.checkWay;
            this.ticketList[i].ticketCompany = this.form.ticketCompany;
            this.ticketList[i].companyId = this.form.companyId;
            v.creator = userId;
            //开票金额
            ticketMoneyTotal += Number(v.ticketMoney);
            if (v.ticketMoney == '') {
              this.$message.error('第' + (i + 1) + '个开票信息未填写发票金额');
              errorFlag = false;
              return;
            }
            if(this.ticketList.length>1){
              if (v.ticketMoney == 0) {
                this.$message.error('第' + (i + 1) + '个开票信息开票金额不能为0');
                errorFlag = false;
                return;
              }
            }
            if (v.ticketCode == '') {
              this.$message.error('第' + (i + 1) + '个开票信息未填写发票号');
              errorFlag = false;
              return;
            }
            for(let m=i+1;m<this.ticketList.length;m++){
              if(v.ticketCode !="" && v.ticketCode !=undefined && v.ticketCode==this.ticketList[m].ticketCode){
                this.$message.error('存在重复发票号,请确认发票号信息');
                errorFlag = false;
                return;
              }
            }
          });
          if (ticketMoneyTotal != this.realChargeTotal) {
            this.$message.error('开票金额与实收费合计不一致');
            errorFlag = false;
            return;
          }
          if (errorFlag) {
            let companyIndex = this.$store.state.finance.radioIndex, company;
            //同步单位库
            if (companyIndex > -1) {
              company = {
                "id": this.form.companyId,
                "taxNo": this.ticketList[companyIndex].taxCode,
                "invoiceAddressTel": this.ticketList[companyIndex].ticketAddressPhone,
                "accountBankNo": this.ticketList[companyIndex].ticketBankAccount
              }
            }
            let checkRecordJSON = {//结账信息
                "companyName": this.form.ticketCompany,
                "companyId": this.form.companyId,
                "money": this.realChargeTotal,
                "creator": userId,
                "checkoutTime": new Date(this.form.checkoutTime).format('YYYY-MM-DD'),
              },
              billJSON = {//缴费单信息
                "billName": this.form.ticketCompany,
                "billMoney": this.realChargeTotal,
                "companyId": this.form.companyId,
                "registrationNo": this.registration_no,
              };
            let jsonObj={
              checkRecordData:checkRecordJSON,
              billData:billJSON,
              ticketList:this.ticketList,
              companyData:company,
              accountClaimList:this.list,
            };

            ajaxRequest('post', "back/checkRecord/otherCheckout",
              {
                json:JSON.stringify(jsonObj)
              },
              (res) => {
                //刷新查询列表、清空结账\关联到款信息
                this.$refs.sjdList.getTableList();
                this.ticketList = [{
                  "ticketMoney": 0,
                  "ticketCode" : "",
                  "ticketHead":"",
                  "taxCode":"",
                  "ticketAddressPhone":"",
                  "ticketBankAccount":""
                }];
                this.list = [];
                this.$message.success('操作成功！');
              });

          }
        }
      },
      //结账前验证
      handleOpen(){
        //-- 表单提交处理 --
        if (this.registration_no == '' || this.registration_no == 'undefined') {
          this.$message.error('请勾选登记号');
          return false;
        } else {
          let userId = localStorage.getItem("userId");
          let _this = this, ticketMoneyTotal = Number(0), errorFlag = true;
          this.ticketList.forEach((v, i) => {
            this.ticketList[i].ticketType = this.form.ticketType;
            this.ticketList[i].checkWay = this.form.checkWay;
            v.ticketCompany = this.form.ticketCompany;
            v.companyId = this.form.companyId;
            v.ticketCompany = "";
            v.companyId = "";
            v.creator = userId;
            //开票金额
            ticketMoneyTotal += Number(v.ticketMoney);
            if (v.ticketMoney == '') {
              this.$message.error('第' + (i + 1) + '个开票信息未填写发票金额');
              errorFlag = false;
              return;
            }
            if(this.ticketList.length>1){
              if (v.ticketMoney == 0) {
                this.$message.error('第' + (i + 1) + '个开票信息开票金额不能为0');
                errorFlag = false;
                return;
              }
            }

            if (v.ticketCode == '') {
              this.$message.error('第' + (i + 1) + '个开票信息未填写发票号');
              errorFlag = false;
              return;
            }
            for (let m = i + 1; m < this.ticketList.length; m++) {
              if (v.ticketCode != "" && v.ticketCode != undefined && v.ticketCode == this.ticketList[m].ticketCode) {
                this.$message.error('存在重复发票号,请确认发票号信息');
                errorFlag = false;
                return;
              }
            }
          });
          if(errorFlag){
            if (ticketMoneyTotal != this.realChargeTotal) {
              this.$message.error('开票金额与实收费合计不一致');
              errorFlag = false;
              return false;
            }else{
              return true;
            }
          }else{
            return false;
          }
        }
      },
      //开票单位默认选中第一个
      changeTicketName(first, djh, fee) {
        if (first != "" && first != undefined) {
          Vue.set(this.form, 'ticketCompany', first.COMPANY_NAME);
          Vue.set(this.form, 'companyId', first.COMPANY_ID);
          Vue.set(this.$refs['form'][0].form, 'ticketHead', first.COMPANY_NAME);
          Vue.set(this.$refs['form'][0].form, 'taxCode', first.TAX_NO);
          Vue.set(this.$refs['form'][0].form, 'ticketAddressPhone', first.INVOICE_ADDRESS_TEL);
          Vue.set(this.$refs['form'][0].form, 'ticketBankAccount', first.ACCOUNT_BANK_NO);
          this.firstSelected = first;
        }
        Vue.set(this.$refs['form'][0].form, 'ticketMoney', Number(fee));
        this.realChargeTotal = Number(fee);
        this.registration_no = djh;
        this.list=[];
      },
      //关联到款
      accountClaim() {
        if(this.totalBalance!==0){
        this.claim=true;
        }else{
          this.$message.warning('结账金额总和不能等于0');
        }
      },

      //结账信息增加、删除
      selectionChange(row, index, action) {
        if (action == 'add') {
          let newItem = $.extend({}, this.defaultForm);
          this.ticketList.splice((index + 1), 0, newItem);
        } else if (action == 'delete') {
          if (this.ticketList.length === 1) {
            this.$message.error('至少保留一条数据！');
          } else {
            this.ticketList.splice(index, 1);
          }
        }
      },

      //开票单位autoComplete
      querySearchEntrust(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        let params = queryString ? {
          companyName: queryString,
          fuzzySearch: 1
        } : ''
        ajaxRequest('get', 'back/company/matchCompanysByName', params, (res) => {
          if (res.code == 200) {
            if(res.rows.length<1){
              this.form.ticketCompany="";
            }
            this.handleResult(res.rows);
            cb(res.rows)
          }
        })
      },

      //单位下拉匹配方法
      handleResult(res) {
        for (let key in res) {
          Vue.set(res[key], 'value', res[key].companyName)
        }
      },
      //单位下拉匹配方法
      handleSelect(item) {
        this.visable = true;
        this.$set(this.form, "companyId", item.id);
        this.$set(this.form, "ticketCompany", item.companyName);
        this.$set(this.$refs['form'][0].form, "ticketHead", item.companyName);
        this.$set(this.$refs['form'][0].form, "taxCode", item.taxNo);
        this.$set(this.$refs['form'][0].form, "ticketAddressPhone", item.invoiceAddressTel);
        this.$set(this.$refs['form'][0].form, "ticketBankAccount", item.accountBankNo)//开户行
      },
      //票种
      getTicketType() {
        ajaxProxyRequest("get", "/njmind/findParam/ticketType", {}, res => {
          this.ticketTypes = res.list;
        });
      },
      //付款方式
      getCheckWay() {
        ajaxProxyRequest("get", "/njmind/findParam/checkWay", {}, res => {
          this.checkWays = res.list;
        });
      },
      //打印
      toPrint(){
        var djhs = this.registration_no.replace(new RegExp(';', 'g'),",").substring(0,this.registration_no.length-1);
        this.printHtml("otherCheckOutPrint",{registration_no:djhs});
      }
    },
    //组件销毁时初始化finance仓库
    destroyed() {
      this.$store.commit('RESET_FINANCE_STATE')
    },

  }
</script>

<style>
  .ft12{
    font-size: 12px;
  }
</style>
