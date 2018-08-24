<template>
  <div>
    <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <div class="title-item"><span>申请信息</span></div>
      <el-Row>
        <el-col :span="12">
          <el-form-item label="开票单位" prop="ticketCompany">
            <el-input :disabled="true" v-model="form.ticketCompany"></el-input>
            <el-input v-model="form.companyId" v-show="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票金额" prop="ticketMoney">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input type="number" v-model="form.ticketMoney" :disabled="true"
                      v-rightclick="handleRightClick.bind(this,form,'ticketMoney')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="回款周期" prop="paybackPeriods">
            <el-date-picker
              v-model="form.paybackPeriods"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled="true">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票部门" prop="departName">
            <el-input v-model="form.departName" :disabled="true"
                      v-rightclick="handleRightClick.bind(this,form,'departName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="申请原因" prop="applyReason">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.applyReason" :disabled="true"
                      v-rightclick="handleRightClick.bind(this,form,'applyReason')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <div class="title-item"><span>开票信息</span></div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="ticketHead">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.ticketHead" :disabled="true"
                      v-rightclick="handleRightClick.bind(this,form,'ticketHead')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纳税人识别号" prop="taxCode">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.taxCode" :disabled="true"
                      v-rightclick="handleRightClick.bind(this,form,'taxCode')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址、电话" prop="ticketAddressPhone">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.ticketAddressPhone" :disabled="true"
                      v-rightclick="handleRightClick.bind(this,form,'ticketAddressPhone')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行及帐号" prop="ticketBankAccount">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.ticketBankAccount" :disabled="true"
                      v-rightclick="handleRightClick.bind(this,form,'ticketBankAccount')"></el-input>
          </el-form-item>
        </el-col>

      </el-Row>

      <div class="title-item"><span>发票信息</span></div>
      <el-Row style="line-height: 40px">
        <el-col :span="6" align="center">发票类型<font style="color: red">(*)</font></el-col>
        <el-col :span="5" align="center">付款方式<font style="color: red">(*)</font></el-col>
        <el-col :span="5" align="center">发票金额<font style="color: red">(*)</font></el-col>
        <el-col :span="8" align="center">备注</el-col>
      </el-Row>
      <el-Row style="line-height: 40px" v-for="(temp,index) in ticketList">
        <el-col :span="6" align="center">
          <el-select :disabled="true" placeholder="请选择" v-model="temp.ticketType" style="width: 80%">
            <el-option
              v-for=" (item,index) in ticketTypes"
              :label="item.remark"
              :value="item.code"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" align="center">
          <el-select :disabled="true" placeholder="请选择" v-model="temp.checkWay" style="width: 90%">
            <el-option
              v-for=" (item,index) in checkWays"
              :label="item.remark"
              :value="item.code"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" align="center">
          <el-input style="width: 80%;" :disabled="true" v-model="temp.ticket_money" size="mini"
                    type="number"></el-input>
        </el-col>
        <el-col :span="8" align="center">
          <el-input v-model="temp.remark" :disabled="true" size="mini"></el-input>
        </el-col>
      </el-Row>
      <div class="title-item"><span>审核区域</span></div>
      <el-Row>
        <el-col :span="1" style="text-align:right;margin-top: 8px;">
          <font style="color: red;" v-if="checkAudit">*</font>
        </el-col>
        <el-col :span="24" style="line-height: 60px">
          <el-form-item label="审核意见" label-width="70px">
            <el-input type="textarea" v-model="form.auditorRemark"
                      v-rightclick="handleRightClick.bind(this,form,'auditorRemark')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
    </el-form>
    <div style="text-align: center;line-height: 40px">
      <el-button type="primary" @click="handleSubmit(1)">同 意</el-button>
      <el-button type="warning" @click="handleSubmit(-1)">退 回</el-button>
    </div>
    <div v-if="bill_id != '' && bill_id != null && bill_id != 'null'">
      <div class="title-item"><span>缴费单信息</span></div>
      <div>
        <commonBillForm :id="bill_id"></commonBillForm>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';

  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import ElRow from "@/common-el/packages/row/src/row";
  import ElCol from "@/common-el/packages/col/src/col";
  import commonBillForm from '../bill/commonBillForm.vue';

  const defaults = {
    hoho: ''
  };
  export default {
    components: {
      ElCol,
      ElRow, commonBillForm
    },
    name: "ticketExamineForm",
    props: {//用于接收从父组件中传来的数据
      applyInfo: {
        type: Object,
        required: true
      },
      applyId: {
        type: Number,
        required: true
      },
      callback: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.applyInfo || {}),
        rules: {},
        loading: false,
        remoteOptions: [],
        jsonData: ['checkWay', 'ticketType', 'auditorResult'],//数据字典下拉框
        checkWays: [],//付款方式
        ticketTypes: [],//票种
        auditorResult: [],//审核意见
        flag: false, //autoComplete 是否不输入值就可匹配
        el: "",//用于数据字典临时存放
        ticketList: [
          {
            ticketType: '',//票种
            checkWay: '',//结账方式
            ticket_money: 0,//开票金额
            remark: ''//备注
          }
        ],//应收费列表
        checkAudit: false,//审核意见是否必填
        source: false,//是否显示缴费单
        tableData: [],//缴费单表格
        billNo: '',//缴费单编号
        bill_id: '',
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
    },
    created() {
      //初始化
      this.getSelectOption();
    },
    watch: {
      //监听预开票申请是否被切换
      applyId() {
        this.getTicketApplyInfo(this.applyId);
      },
    },
    directives: {rightclick},
    mixins: [rightClick],
    methods: {//方法定义
      //获取预开票详情
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
      //此方法作废  原先用于判断是否需要填写审核意见
      checkAuditOpinion(value) {//审核意见是否必填
        if (value == "1") {//同意
          this.checkAudit = false;
        } else {//不同意
          this.checkAudit = true;
        }
      },
      //审核按钮事件
      handleSubmit(flag) {
        let _this = this;
        //-- 表单提交处理 --
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
          if (flag == -1 && (_this.form.auditorRemark == null || _this.form.auditorRemark == '')) {
            _this.$message.error('审核意见未填写');
            return;
          }
          if(_this.form.id==null){
            _this.$message.error('请选择未审核的预开票记录');
            return;
          }
          if (valid) {
            let obj = {
              id: _this.form.id,
              status: flag,
              auditor: localStorage.getItem('userId'),
              auditTime: new Date(),
              auditorResult: _this.form.auditorResult,
              auditorRemark: _this.form.auditorRemark,
            };
            ajaxRequest("post", "back/ticketApply/ticketExamine", {json: JSON.stringify(obj)}, (res) => {
              if (res.code == 200) {
                this.$message.success('提交成功');
                _this.callback(this.form);
              } else {
                this.$message.error('提交失败');
              }
              _this.callback();
            });
          } else {
            return false;
          }
        })
      },
      remoteMethod() {
        //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
        ajaxRequest('get', 'back/bill/retrieve', {
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total: 0
        }, function (res) {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
            this.multipleSelection = [];
          }
        }.bind(this))
      },
      handleCancel() {
        this.callback();
      },
      //初始化下拉框
      getSelectOption() {
        let _this = this;
        ajaxProxyRequest('get', '/njmind/findParams/' + this.jsonData.join("$"), {codeType: 'NUMBER'}, (res) => {
          _this.jsonData.forEach((val) => {
            if (val == 'checkWay') {
              _this.checkWays = res[val].list
            }
            if (val == 'ticketType') {
              _this.ticketTypes = res[val].list
            }
            if (val == 'auditorResult') {
              _this.auditorResult = res[val].list
              _this.form.auditorResult = 1;
            }
          })

        })
      },
      //通过id获取预开票信息
      getTicketApplyInfo(id) {
        let _this = this;
        if (id) {
          ajaxRequest('get', 'back/ticketApply/' + id, {}, (res) => {
            if (res.code == 200) {
              this.form = res.daoResult;
              this.bill_id = this.form.billId;
              if (res.daoResult.ticketList) {
                var temList = new Array();
                //循环发票信息
                for (var i = 0; i < res.daoResult.ticketList.length; i++) {
                  var obj = new Object();
                  obj.ticketType = res.daoResult.ticketList[i].ticketType;
                  obj.checkWay = res.daoResult.ticketList[i].checkWay;
                  obj.ticket_money = res.daoResult.ticketList[i].ticketMoney;
                  obj.remark = res.daoResult.ticketList[i].remark;
                  temList.push(obj);
                }
                //如果查询出发票信息，则替换ticketList
                if (temList.length > 0) {
                  _this.ticketList = temList;
                }
              }

              if (this.bill_id != null && this.bill_id != "" && this.bill_id != "null") {
                this.getTableList();
              }
            }
          })
        } else {
          this.bill_id=null
          this.form={}
          _this.ticketList=[];
        }

      }
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
