<template>
  <mind-dialog
    :title="'预开票申请'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="large"
    :appendToBody="true"
    @close="handleCancel">
  <div>
    <div class="title-item"><span>申请信息</span></div>
      <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
          <el-Row>
              <el-col :span="12">
              <el-form-item label="开票单位" prop="ticketCompany">
                <div v-if="bill_id != '' && bill_id != null && bill_id != 'null'">
                  <el-autocomplete style="width: 100%"
                                   v-model="form.ticketCompany"
                                   :fetch-suggestions="querySearchEntrust"
                                   @select="handleSelect"
                                   :trigger-on-focus="flag"
                                   :disabled="true"
                  >
                    <template slot-scope='scope'>
                      <div>
                        <span style="margin-left:0">({{scope.item.companyType}}) {{scope.item.companyName}}
                           (<span :style="{color:scope.item.status == 0 ? 'red' : 'green'}">{{scope.item.status == 0 ? '未审核' : '已审核'}}</span>)
                           {{!!scope.item.companyDepart ? '['+scope.item.companyDepart+']' : ''}}
                           {{!!scope.item.contacter ? '['+scope.item.contacter+']' : ''}}
                           {{!!scope.item.mobilePhone ? '['+scope.item.mobilePhone+']' : ''}}
                        </span>
                      </div>
                    </template>
                  </el-autocomplete>
                </div>
                <div v-else>
                  <el-autocomplete style="width: 100%"
                                   v-model="form.ticketCompany"
                                   :fetch-suggestions="querySearchEntrust"
                                   @select="handleSelect"
                                   :trigger-on-focus="flag"
                  >
                    <template slot-scope='scope'>
                      <div>
                        <span style="margin-left:0">({{scope.item.companyType}}) {{scope.item.companyName}}
                           (<span :style="{color:scope.item.status == 0 ? 'red' : 'green'}">{{scope.item.status == 0 ? '未审核' : '已审核'}}</span>)
                           {{!!scope.item.companyDepart ? '['+scope.item.companyDepart+']' : ''}}
                           {{!!scope.item.contacter ? '['+scope.item.contacter+']' : ''}}
                           {{!!scope.item.mobilePhone ? '['+scope.item.mobilePhone+']' : ''}}
                        </span>
                      </div>
                    </template>
                  </el-autocomplete>
                </div>
                <el-input v-model="form.companyId" v-show="false"></el-input>
              </el-form-item>
              </el-col>

              <el-col :span="12">
              <el-form-item label="开票金额" prop="ticketMoney">
                <div v-if="bill_id != '' && bill_id != null && bill_id != 'null'">
                  <el-input type="number" v-model="form.ticketMoney"
                            disabled
                            @blur="setTicketMoney()"
                            v-rightclick="handleRightClick.bind(this,form,'ticketMoney')">

                  </el-input>
                </div>
                <div v-else>
                  <el-input type="number" v-model="form.ticketMoney"
                            @blur="setTicketMoney()"
                            v-rightclick="handleRightClick.bind(this,form,'ticketMoney')">

                  </el-input>
                </div>

              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item prop="paybackPeriods">
                <template slot = "label">
                  <span>回款周期</span>
                  <el-tooltip class="item" effect="dark" content="系统默认按当天核算90个自然日，可修改">
                    <i class="el-icon-info ft12"></i>
                  </el-tooltip>
                </template>
                <el-date-picker style="width:100%;"
                  v-model="form.paybackPeriods"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              </el-col>
                 <el-col :span="12">
              <el-form-item prop="ticketDepart">
                <template slot = "label">
                  <span>开票部门</span>
                  <el-tooltip class="item" effect="dark" content="系统默认为申请人所在部门">
                    <i class="el-icon-info ft12"></i>
                  </el-tooltip>
                </template>

                <el-select placeholder="请选择" v-model="form.ticketDepart"  style="width:100%;">
                  <el-option
                    v-for="item in departNameData"
                    :label="item.departName"
                    :value="item.departId">
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
          </el-Row>
          <el-row>
              <el-col :span="24">
                <el-form-item label="申请原因" prop="applyReason">
                  <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                  <el-input v-model="form.applyReason" v-rightclick="handleRightClick.bind(this,form,'applyReason')"></el-input>
                </el-form-item>
              </el-col>
          </el-Row>
        <div class="title-item"><span>开票信息</span></div>
        <el-row>
              <el-col :span="12"  >
              <el-form-item label="名称" prop="ticketHead">
                  <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                  <el-input v-model="form.ticketHead" v-rightclick="handleRightClick.bind(this,form,'ticketHead')"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="12" >
                <el-form-item label="纳税人识别号" prop="taxCode">
                  <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                  <el-input v-model="form.taxCode" v-rightclick="handleRightClick.bind(this,form,'taxCode')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" >
              <el-form-item label="地址、电话" prop="ticketAddressPhone">
                  <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                  <el-input v-model="form.ticketAddressPhone" v-rightclick="handleRightClick.bind(this,form,'ticketAddressPhone')"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="12"  >
              <el-form-item label="开户行及帐号" prop="ticketBankAccount">
                  <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                  <el-input v-model="form.ticketBankAccount" v-rightclick="handleRightClick.bind(this,form,'ticketBankAccount')"></el-input>
              </el-form-item>
              </el-col>
          </el-Row>

        <div class="title-item"><span>发票信息</span></div>
        <el-Row  style="line-height: 40px">
          <el-col :span="4" align="center" style="width:22%;">发票类型<font style="color: red">(*)</font></el-col>
          <el-col :span="4" align="center" style="width:22%;">预付款方式<font style="color: red">(*)</font></el-col>
          <el-col :span="4" align="center" style="width:22%;">发票金额<font style="color: red">(*)</font></el-col>
          <el-col :span="8" align="center" style="width:22%;">备注</el-col>
          <el-col :span="4" align="center" style="width:10%;">操作</el-col>
        </el-Row>
        <el-Row v-for="(temp,index) in ticketList"  style="line-height: 40px">
          <el-col :span="4" align="center" style="width:22%;">
            <el-select placeholder="请选择" v-model="temp.ticketType" style="width: 70%">
              <el-option
                v-for=" (item,index) in ticketTypes"
                :label="item.remark"
                :value="item.code"
                :key="index"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" align="center" style="width:22%;">
              <el-select placeholder="请选择" v-model="temp.checkWay" style="width: 70%">
                <el-option
                  v-for=" (item,index) in checkWays"
                  :label="item.remark"
                  :value="item.code"
                  :key="index"
                >
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="4" align="center" style="width:22%;">
            <el-input style="width: 50%;" v-model="temp.ticket_money" size="mini" type="number"></el-input>
          </el-col>
          <el-col :span="8" align="center" style="width:22%;">
            <el-input v-model="temp.remark" size="mini"></el-input>
          </el-col>
          <el-col :span="4" align="center" style="margin-top:3px;width:10%;">
            <el-button @click="addLine(index)" type="el-button el-button--primary" style="padding: 5px 4px; font-size: 12px;">增加</el-button>
            <el-button @click="delLine(index)" type="el-button el-button--danger" style="padding: 5px 4px; font-size: 12px;">删除</el-button>
          </el-col>
        </el-Row>
      </el-form>

    <div style="text-align:center; padding: 35px 0px 10px 0px;">
        <span slot="footer" class="dialog-footer">
          <!-- 绑定form提交事件-->
          <el-button v-if="form.status == null || (form.status == 0 && form.isLinkPayment == 0)" type="primary" v-mindPopover="{message:'确定提交预开票申请?',success:handleSubmit.bind(this),isOpen:handleOpen.bind(this)}">提 交</el-button>

          <el-button v-if="calcelPower && (form.status == 0 || form.status == 1) && form.isLinkPayment == 0" type="warning" v-mindPopover="{message:'确定撤销预开票申请?',success:handleCancelApply.bind(this)}">撤 销</el-button>

          <el-button @click="handleCancel">取 消</el-button>
        </span>
    </div>

  <div v-if="bill_id != '' && bill_id != null && bill_id != 'null'">
    <div class="title-item"><span>缴费单信息</span></div>
    <div>
      <commonBillForm :id="bill_id"></commonBillForm>
    </div>
  </div>
  </div>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import ElRow from "@/common-el/packages/row/src/row";

  import commonBillForm from '../bill/commonBillForm.vue';


  const defaults = {
    hoho:''
  };
  export default {
    components: {ElRow,commonBillForm},
    name: "ticketApplyForm",
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
          ticketCompany: [{type: 'string', required: true, message: '开票单位不能为空'}],
          ticketMoney: [{required: true, message: '开票金额不能为空'}],
          paybackPeriods: [{required: true, message: '回款周期不能为空'}],
          ticketDepart: [{required: true, message: '请选择开票部门'}],
        },
        loading: false,
        remoteOptions: [],
        departNameData:[],//部门
        jsonData:['checkWay','ticketType'],//数据字典下拉框
        checkWays:[],//付款方式
        ticketTypes:[],//票种
        flag:false, //autoComplete 是否不输入值就可匹配
        el:"",//用于数据字典临时存放
        ticketList:[
          {
            ticketType:'',//票种
            checkWay:'',//结账方式
            ticket_money:this.data.ticketMoney==null?0:this.data.ticketMoney,//开票金额
            remark:''//备注
          }
        ],//应收费列表
        bill_id: this.data.billId,//缴费单id
        tableData: [],//列表
        billNo:'',//缴费单编号
        paybackPeriods:90,//回款周期
        checkFlag: false,//是否有审核权限
        calcelPower : false,
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
    },
    created(){
      //初始化部门
      this.ajaxDepartNameObj();
      this.getSelectOption();
      this.getTicketApplyInfo();
      this.getPaybackPeriods();
//      this.getBillTicketInitInfo();
      if(this.bill_id!=null && this.bill_id!="") {
        this.getTableList();
      }


      let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
      if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
        btnPower = "@@";
      }
      if(btnPower.indexOf("@M39301@") != -1){
        this.calcelPower = true ;
      }else {
        this.calcelPower = false ;
      }
    },
    directives:{ rightclick },
    mixins:[rightClick],
    methods: {//方法定义
      handleOpen(){
        let userMenus = window.localStorage.getItem("userMenus");
        if(userMenus.indexOf("@348@") != -1) {
          this.checkFlag = true;
          return "确认提交该预开票申请？您有审核权限，提交后将自动审核通过，转入预开发票节点。";
        }else{
          return "确认提交该预开票申请？预开票需有人审核。";
        }
      },
      //提交预开票申请
      handleSubmit() {
        let _this=this;
        //-- 表单提交处理 --
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
          _this.ticketList.forEach(function(v,i){
            let rownum = parseInt(i)+1;
            if(v.ticketType==''){
              _this.$message.error('第'+rownum+'行发票类型未选择');
              valid=false;
              return;
            }

            if(v.checkWay==''){
              _this.$message.error('第'+rownum+'行票种未选择');
              valid=false;
              return;
            }
            if(v.ticket_money===''){
              _this.$message.error('第'+rownum+'行发票金额未填写');
              valid=false;
              return;
            }
          })
          if (valid) {
            var httpMethod;//http请求方式
            if(!this.form.id||this.form.id==''){//新增 注意:通过id是否存在来判断是新增还是编辑
                httpMethod = 'post';
            }else {//更新
                httpMethod = 'put';
            }
            //处理回款周期
            if(this.form.paybackPeriods == "" || this.form.paybackPeriods == null){
              delete this.form.paybackPeriods;
            }else{
              this.form.paybackPeriods = new Date(this.form.paybackPeriods);
            }
            //设置预开票来源  1缴费单申请预开票  0无业务预开票
            let source,bill_id;
            if(this.billNo!='' && this.billNo!=null){
              source = 1;
              bill_id = this.bill_id;
            }else{
              source = 0;
            }
            //表单数据
            let jsonObj={
              formData:_this.form,
              ticketList:_this.ticketList,
              source:source,
              bill_id:bill_id,
              status: _this.checkFlag ?1:0
            };
            ajaxRequest(httpMethod, "back/ticketApply/", {
              json:JSON.stringify(jsonObj)
            }, (res)=> {
              if(res.code == 200){
                this.$message.success('提交成功');
                _this.callback();
              }else{
                this.$message.error('提交失败');
              }
            });
          }else{
            return false;
          }
        })
      },
      //撤销预开票申请
      handleCancelApply(){
        let _this = this;
        let jsonObj={
          id:this.form.id,
          source:this.form.source,
          bill_id:this.form.billId
        };
        ajaxRequest('put', "back/ticketApply/cancelTicketApply", {
          json:JSON.stringify(jsonObj)
        }, (res)=> {
          if(res.code == 200){
            this.$message.success('撤销成功');
            _this.callback();
          }else{
            this.$message.error('撤销失败');
          }
        });
      },
      remoteMethod() {
      //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
      },
      //关闭页面
      handleCancel(){
        this.callback();
      },
      //初始化开票部门
      ajaxDepartNameObj(){
        ajaxRequest('get','back/depart/list/',{
          isDelete:0,
        },function(data){
          if(data.code===200){
            for (var i = 0; i < data.rows.length; i++) {
              this.departNameData.push({'departId':data.rows[i].id,'departName':data.rows
                [i].departName});
            }
            Vue.set(this.form, 'ticketDepart', Number(window.localStorage.getItem("departId")));
          }
        }.bind(this))
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
      //单位数据处理
      handleResult(res) {
        for (let key in res) {
          Vue.set(res[key], 'value', res[key].companyName)
        }
      },
      //选择回调函数
      handleSelect(item) {
        this.visable = true;
        this.$set(this.form, "companyId", item.id)
        this.$set(this.form, "ticketCompany", item.companyName)
        //开票信息
        this.$set(this.form, "ticketHead", item.invoiceCompany)
        this.$set(this.form, "taxCode", item.taxNo)
        this.$set(this.form, "ticketAddressPhone", item.invoiceAddressTel)
        this.$set(this.form, "ticketBankAccount", item.accountBankNo)
      },
      //数据字典取值
      getSelectOption(){
        let _this=this;
        ajaxProxyRequest('get','/njmind/findParams/'+this.jsonData.join("$"),{codeType:'NUMBER'},(res) => {
          _this.jsonData.forEach((val) => {
            if(val == 'checkWay'){
              _this.checkWays=res[val].list
            }
            if(val == 'ticketType'){
              _this.ticketTypes=res[val].list
            }
          })
        })
      },
      //增加行方法
      addLine(index){
        let _this = this;
        this.ticketList.push({
          ticketType:_this.ticketList[index].ticketType,//票种
          checkWay:_this.ticketList[index].checkWay,//结账方式
          ticket_money:0,//开票金额
          remark:''//备注
        });
        //自动处理发票金额
        this.handleTicketMoney();
      },
      //删除行方法
      delLine(index){
        if(this.ticketList.length===1){
          this.$message.error('至少保留一条数据！');
        }else{
          this.ticketList.splice(index,1);
        }
        this.handleTicketMoney();
      },
      //动态改变发票金额
      handleTicketMoney(){
        let sumFee = 0;
        if(this.form.ticketMoney !='' && this.form.ticketMoney > 0 ) {
          for (let i = 0; i < this.ticketList.length - 1; i++) {
            sumFee += parseFloat(this.ticketList[i].ticket_money);
          }
          if(this.form.ticketMoney - sumFee >0) {
            this.ticketList[this.ticketList.length - 1].ticket_money = parseFloat(this.form.ticketMoney) - parseFloat(sumFee);
          }else{
            this.ticketList[this.ticketList.length - 1].ticket_money = 0;
          }
        }
      },
      //通过id获取预开票信息
      getTicketApplyInfo(){
        let _this=this;
        if(this.form.id!=null && this.form.id!=""){
          ajaxRequest('get', 'back/ticketApply/'+this.form.id,{}, (res) => {
            if (res.code == 200) {
              _this.form = res.daoResult;
              if(res.daoResult.ticketList){
               var temList=new Array();
               //循环发票信息
               for(var i=0;i<res.daoResult.ticketList.length;i++){
                  var obj=new Object();
                  obj.ticketType = res.daoResult.ticketList[i].ticketType;
                  obj.checkWay = res.daoResult.ticketList[i].checkWay;
                  obj.ticket_money = res.daoResult.ticketList[i].ticketMoney;
                  obj.remark = res.daoResult.ticketList[i].remark;
                  temList.push(obj);
               }
               //如果查询出发票信息，则替换ticketList
               if(temList.length>0) {
                 _this.ticketList = temList;
               }
              }
            }
          })
        }
      },
      //处理缴费单申请预开票初始化页面
      getBillTicketInitInfo(){
        let _this = this;
        if(this.bill_id!="" && this.bill_id != null){
          ajaxRequest('get', 'back/company/'+this.data.companyId, null,(res) => {
            if (res.code == 200) {
              _this.handleSelect(res.daoResult);
            }
          })
        }
      },
      //查询缴费单列表
      getTableList() {
        let _this = this;
        ajaxRequest('get', 'back/bill/' + this.bill_id, {}, (res) => {
          if (res.code === 200) {
            _this.billNo = res.daoResult.billNo;
            _this.tableData = res.daoResult.sjdList;
          }
        })
      },
      //合计行
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0 || index === 1 || index === 2) {
            sums[index] = '';
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
      //自动设置预开票发票金额
      setTicketMoney(){
        this.ticketList[0].ticket_money = this.form.ticketMoney;
      },
      //回款周期处理
      getPaybackPeriods(){
        let _this = this;
        ajaxProxyRequest('get','/njmind/findParams/paybackPeriods',{},(res)=>{
          _this.paybackPeriods = res.paybackPeriods.value;

          let dd = new Date();

          dd.setDate(dd.getDate() + Number(res.paybackPeriods.value));

          var y = dd.getFullYear();
          var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
          var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0

          Vue.set(this.form, 'paybackPeriods', y+"-"+m+"-"+d);

        });
      },
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
  .custom-1d74b7 .el-row {
    padding-top: 1px;
}
</style>
