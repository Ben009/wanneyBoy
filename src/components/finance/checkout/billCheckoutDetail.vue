<template>
  <div>
    <div style="margin-left: 97%">
      <global-tootips>
        <p>1、	本功能用于通过缴费单进行结账操作；</p>
        <p>2、	缴费单需未申请需开票、未处于折扣审核过程中、未结账；</p>
        <p>3、	本批次结账若需开具多张发票，可点击“+－”按钮进行；</p>
        <p>4、	若客户通过银行转账，可使用：关联到款按钮关联转账记录；</p>
        <p>5、	读取功能为：系统以本台计算机上一次的发票号码加1默认为本次发票号码，若不正确可修改；</p>
        <P>6、	若缴费单已关联到款记录（即缴费单编号为蓝色），可点击撤销关联按钮解除关联到款信息；</p>
      </global-tootips>
    </div>
    <billDetail :billId="billId" ></billDetail>
    <div class="title-item" style="margin-top: 20px"><span>结账信息</span></div>

    <el-form :model="form" :rules="rules" label-width="140px">
      <el-row>
        <!--<el-col :span="12">
          <el-form-item label="开票单位" prop="ticketCompany">
            <el-autocomplete style="width: 100%"
                             v-model="form.ticketCompany"
                             :fetch-suggestions="querySearchEntrust"
                             placeholder="请输入委托单位"
                             :trigger-on-focus="false"
                             @select="handleSelect">
            </el-autocomplete>
          </el-form-item>
        </el-col>-->
        <el-col :span="8">
          <el-form-item label="到账日期" prop="checkoutTime">

            <template slot = "label">
              <span>到账日期</span>
              <el-tooltip class="item" effect="dark" content="到账日期默认当天，可改">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>

            <el-date-picker
              v-model="form.checkoutTime"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"  style="width:100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
        <el-col :span="8">
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
    <el-row class="m-l-5">
      <el-col :sm="24">
        <addTicket v-for="(item,index) in ticketList"
                      ref="form"
                      :dataindex="index"
                      :data="item"
                      :key="index"
                      @selection-change="selectionChange">
        </addTicket>
      </el-col>
    </el-row>
    <associated ref="associated" :source="1" :mySourceId="sourceId"></associated>
    <div style="text-align: center;margin-top: 10px;margin-bottom: 20px">
      <el-button type="primary" v-mindPopover="{message:'确认结账操作?',success:billCheckout.bind(this),isOpen:handleOpen.bind(this)}">结 账</el-button>
      <el-button type="primary" v-if="accountSize===0" @click="accountClaim">关联到款</el-button>
      <el-button type="danger" v-if="accountSize>0" v-mindPopover="{message:'确认取消关联到款？',success:cancelClaim.bind(this)}">取消关联</el-button>
    </div>
    <accountClaimPage v-if="!!claim" :callback="claimCallback" :source="1" :totalBalance="totalMoney" :sourceId="sourceId"></accountClaimPage>
  </div>
</template>
<script>
  import Vue from "vue";
  import {ajaxRequest,formatDate,ajaxProxyRequest} from "../../util/base";
  import addTicket from "./addTicket.vue";
  import billDetail from "../ticketApply/billDetail";
  import accountClaimPage from './accountClaimPage.vue';
  import associated from './associated.vue';

  //引入jquery
  import $ from 'jquery';
  export default {
    name: "bill-checkout-detail",
    props: {
      data: {
        type: Object,
        required:true
      },
      callback: {
        type:Function,
        required:true
      },
      sourceId: {
        type:Number,
        required:true
      },
      totalMoney: {
        type:Number,
        required:true
      },
    },
    data() {
      return {
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          ticketCompany: [{required: true, message: '开票单位不能为空'}],
          checkoutTime: [{required: true, message: '结账日期不能为空'}]
        },
        ticketList: [{
          "ticketMoney": 0,
          "ticketCode" : "",
          "ticketHead":"",
          "taxCode":"",
          "ticketAddressPhone":"",
          "ticketBankAccount":""
        }],//发票列表
        defaultForm: {//开票新增数据
          "ticketMoney": 0
        },
        ticketTypes:[],//票种
        checkWays:[],//结账方式

        billId:this.data.id,
        form: {
          ticketCompany: this.data.companyName,
          checkoutTime: new Date(),
          ticketCompanyId: this.data.companyId},
        claim:false,//关联到款弹层
        list:[],//关联到款list(接收从associated页面传来的已关联list，然后将它传到accountClaim页面展示并判断是否更新)
        accountSize:0
      };
    },
    methods: {
      //关联到款
      accountClaim() {
        if(this.totalMoney!==0){
          this.claim=true;
        }else{
          this.$message.warning('结账金额总和不能等于0');
        }
      },
      //关联到款弹层的回调
      claimCallback(){
        this.claim=false;
        this.$refs.associated.getAssociated();//回调associated页面的方法
        this.checkAccountSize();
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
            this.handleResult(res.rows);
            cb(res.rows)
          }
        })
      },
      //单位下拉匹配事件
      handleResult(res) {
        for (let key in res) {
          Vue.set(res[key], 'value', res[key].companyName)
        }
      },
      //单位下拉匹配事件
      handleSelect(item) {
        this.form.ticketCompanyId = item.id;
      },

      //结账按钮功能
      billCheckout() {
        //-- 表单提交处理 --
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
          if (v.ticketMoney === '') {
            this.$message.error('第' + (i + 1) + '个开票信息未填写发票金额');
            errorFlag = false;
            return;
          }
          if(this.ticketList.length>1){
            if (v.ticketMoney === 0) {
              this.$message.error('第' + (i + 1) + '个开票信息开票金额不能为0');
              errorFlag = false;
              return;
            }
          }
          if ( v.ticketCode ==undefined || v.ticketCode === '') {
            this.$message.error('第' + (i + 1) + '个开票信息未填写发票号');
            errorFlag = false;
            return;
          }
          for(let m=i+1;m<_this.ticketList.length;m++){
            if(v.ticketCode !="" && v.ticketCode !=undefined && v.ticketCode==_this.ticketList[m].ticketCode){
              this.$message.error('存在重复发票号,请确认发票号信息');
              errorFlag = false;
              return;
            }
          }
        });
        if (errorFlag) {
          if (ticketMoneyTotal !== this.data.billMoney) {
            this.$message.error('开票金额与缴费单金额不一致');
            return;
          }
          let companyIndex = this.$store.state.finance.radioIndex, company;
          //同步单位库
          if (companyIndex > -1) {
            company = {
              "id": this.form.ticketCompanyId,
              "taxNo": this.ticketList[companyIndex].taxCode,
              "invoiceAddressTel": this.ticketList[companyIndex].ticketAddressPhone,
              "accountBankNo": this.ticketList[companyIndex].ticketBankAccount
            }
          }
          let obj =new Object();
          obj.companyData = company;//单位信息
          obj.ticketList = this.ticketList;//发票列表信息
          obj.billId = this.billId;//缴费单ID
          obj.ticketCompany = this.form.ticketCompany;//开票单位
          obj.checkoutTime = formatDate(this.form.checkoutTime,"YYYY-MM-DD");//开票日期
          obj.ticketCompanyId = this.form.ticketCompanyId;//开票单位ID
          obj.billMoney = this.data.billMoney;//结账金额

          ajaxRequest('post', "back/checkRecord/billCheckout",
            {
              json:JSON.stringify(obj)
            },
            (res) => {
              if(res.code===200){
                this.$message.success('操作成功！');
                this.callback();
              }else{
                this.$message.error('操作异常!');
              }
            });
        }
      },
      //结账前验证事件
      handleOpen(){
        let userId = localStorage.getItem("userId");
        let _this = this, ticketMoneyTotal = Number(0), errorFlag = true;
        this.ticketList.forEach((v, i) => {
          this.ticketList[i].ticketType=this.form.ticketType;
          this.ticketList[i].checkWay=this.form.checkWay;
          v.ticketCompany = this.form.ticketCompany;
          v.companyId = this.form.companyId;
          v.creator = userId;
          //开票金额
          ticketMoneyTotal += Number(v.ticketMoney);
          if (v.ticketMoney === '') {
            this.$message.error('第' + (i + 1) + '个开票信息未填写发票金额');
            errorFlag = false;
            return;
          }
          if(this.ticketList.length>1){
            if (v.ticketMoney === 0) {
              this.$message.error('第' + (i + 1) + '个开票信息开票金额不能为0');
              errorFlag = false;
              return;
            }
          }
          if ( v.ticketCode ==undefined || v.ticketCode === '') {
            this.$message.error('第' + (i + 1) + '个开票信息未填写发票号');
            errorFlag = false;
            return;
          }
          for(let m=i+1;m<_this.ticketList.length;m++){
            if(v.ticketCode !="" && v.ticketCode !=undefined && v.ticketCode==_this.ticketList[m].ticketCode){
              this.$message.error('存在重复发票号,请确认发票号信息');
              errorFlag = false;
              return;
            }
          }
        });
        if (errorFlag) {
          if (ticketMoneyTotal !== this.data.billMoney) {
            this.$message.error('开票金额与缴费单金额不一致');
            return false;
          }else{
            return true;
          }
        }else {
          return false;
        }
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
      //初始化页面元素值
      loadFirstInfo() {
        Vue.set(this.$refs['form'][0].form, 'ticketHead', this.data.companyName);
        Vue.set(this.$refs['form'][0].form, 'taxCode', this.data.taxCode);
        Vue.set(this.$refs['form'][0].form, 'ticketAddressPhone', this.data.ticketAddressPhone);
        Vue.set(this.$refs['form'][0].form, 'ticketBankAccount', this.data.ticketBankAccount);
        Vue.set(this.$refs['form'][0].form, 'ticketMoney', this.data.billMoney);
      },
      //验证是否关联过到款
      checkAccountSize(){
        ajaxRequest('get','back/accountRecord/getAccountInfoBySourceAndSourceId',{
          source:"1",
          sourceId:this.sourceId
        },(res)=>{
          if(res.code===200){
            this.accountSize=res.rows.length;
          }
        })
      },
      //撤销关联
      cancelClaim(){
        let _this = this;
        ajaxRequest('post','back/accountRecord/cancelClaimForCheck',{
          source:"1",
          sourceId:this.sourceId
        },(res)=>{
          if(res.code===200){
            _this.$message.success('操作成功！');
            this.claimCallback();
          }
        })
      },
    },
    mounted() {
      this.getTicketType();
      this.getCheckWay();
      this.loadFirstInfo();
      this.checkAccountSize();

    },
    components: {
      addTicket,
      billDetail,
      accountClaimPage,
      associated
    },
    //组件销毁时初始化finance仓库
    destroyed() {
      this.$store.commit('RESET_FINANCE_STATE')
    },
  };
</script>

<style scoped>
  .m-b-10 {
    margin-bottom: 10px;
  }

  .m-b-20 {
    margin-bottom: 20px;
  }

  .inline {
    display: inline;
  }

  .m-r-10 {
    margin-right: 661px;
  }

  .m-f-10 {
    margin-left: 10px;
  }

  .m-t-10 {
    margin-top: 10px;
  }

  .m-l-10 {
    margin-left: 10px;
  }

  .m-l-5 {
    margin-left: 5px;
  }

  .font-blod {
    font-weight: bold;
  }

  .ft12{
    font-size: 12px;
  }
</style>
