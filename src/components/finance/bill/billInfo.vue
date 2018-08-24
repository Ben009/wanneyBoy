<template>
  <mind-dialog title="新增缴费单" :visible="true" dialog-size="large" center v-dialogDrag @close="handleCancel">
    <div style="padding-top: 5px;text-align: center">合计：<span style="color: red;font-weight: bold;font-size: 16px;">{{totalMoney}}</span>&nbsp;&nbsp;&nbsp;&nbsp;可打折金额：<span
      style="font-size: 16px;color: red;font-weight: bold">{{discountSum}}</span>
      &nbsp;&nbsp;&nbsp;&nbsp;不可打折金额：<span style="font-size: 16px;color: red;font-weight: bold">{{undiscountSum}}</span>
    </div>

    <div class="title-item" style="text-align: left;margin-bottom: 10px">
      <span style="width: 95%">缴费单基本信息</span>
      <span style="width: 5%">
          <global-tootips :width="600">
            <p>1、缴费单名称、开票信息等默认提取第一个登记号关联的信息，可进行修改；</p>
          </global-tootips>
          </span>
    </div>
    <div>
      <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <div style="padding-top: 10px">
          <el-Row>
            <el-col :span="12">
              <el-form-item label="缴费单单位" prop="companyName">
                <el-autocomplete style="width: 100%"
                                 v-model="form.companyName"
                                 :fetch-suggestions="querySearchEntrust"
                                 @select="handleSelect"
                                 :trigger-on-focus="flag"
                >
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
                <el-input v-model="form.companyId" v-show="false"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务员" prop="businessStaff">
                <el-select v-model="form.businessStaff" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in staffs"
                    :key="item.staff"
                    :label="item.staffName"
                    :value="item.staff">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="缴费单名称" prop="billName">
                <el-input v-model="form.billName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位联系人" prop="companyContact">
                <el-input v-model="form.companyContact"
                          v-rightclick="handleRightClick.bind(this,form,'companyContact')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位地址" prop="companyAddress">
                <el-input v-model="form.companyAddress"
                          v-rightclick="handleRightClick.bind(this,form,'companyAddress')"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="联系电话" prop="companyPhone">
                <el-input v-model="form.companyPhone"
                          v-rightclick="handleRightClick.bind(this,form,'companyPhone')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
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
              <el-form-item label="开票单位" prop="ticketCompany">
                <el-input v-model="form.ticketCompany"
                          v-rightclick="handleRightClick.bind(this,form,'ticketCompany')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税号" prop="taxCode">
                <el-input v-model="form.taxCode" v-rightclick="handleRightClick.bind(this,form,'taxCode')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址/电话" prop="ticketAddressPhone">
                <el-input v-model="form.ticketAddressPhone"
                          v-rightclick="handleRightClick.bind(this,form,'ticketAddressPhone')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户行/帐号" prop="ticketBankAccount">
                <el-input v-model="form.ticketBankAccount"
                          v-rightclick="handleRightClick.bind(this,form,'ticketBankAccount')"></el-input>
              </el-form-item>
            </el-col>
          </el-Row>
        </div>
      </el-form>
      <div style="text-align:center;padding: 35px 0px 10px 0px;">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
             <el-button @click="handleCancel">取 消</el-button>
          </span>
      </div>
    </div>
    <div class="title-item"><span>登记号列表</span></div>
    <el-table :data="djhTable" :max-height="QJTableMaxHeight" border style="width: 100%">
      <el-table-column prop="ORDER_NO" label="委托单号"></el-table-column>
      <el-table-column prop="REGISTRATION_NO" label="登记号"></el-table-column>
      <el-table-column prop="COMPANY_NAME" label="委托单位"></el-table-column>
      <el-table-column prop="APPLIANCE_NAME" label="器具名称"></el-table-column>
      <el-table-column prop="SET_NUMBER" label="套数">
        <template slot-scope="scope">
          {{scope.row.SET_NUMBER}}<span v-if="scope.row.RETURN_NUMBER!=0"
                                        style="color:red">/{{scope.row.RETURN_NUMBER}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="TOTAL_ACTUAL" :label="defaultInfo.fee7">
        <template slot-scope="scope">
          <span>{{scope.row.TOTAL_FEE}}/{{scope.row.TOTAL_ACTUAL}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="EXECUTOR" label="检测人员"></el-table-column>
      <el-table-column prop="JDF_ACTUAL" :label="defaultInfo.fee1">
        <template slot-scope="scope">
          <span>{{scope.row.JDF}}/{{scope.row.JDF_ACTUAL}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="FJF_ACTUAL" :label="defaultInfo.fee2">
        <template slot-scope="scope">
          <span>{{scope.row.FJF}}/{{scope.row.FJF_ACTUAL}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="JJF_ACTUAL" :label="defaultInfo.fee3">
        <template slot-scope="scope">
          <span>{{scope.row.JJF}}/{{scope.row.JJF_ACTUAL}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="XLF_ACTUAL" :label="defaultInfo.fee4">
        <template slot-scope="scope">
          <span>{{scope.row.XLF}}/{{scope.row.XLF_ACTUAL}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="FWF_ACTUAL" :label="defaultInfo.fee5">
        <template slot-scope="scope">
          <span>{{scope.row.FWF}}/{{scope.row.FWF_ACTUAL}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="QTF_ACTUAL" :label="defaultInfo.fee6">
        <template slot-scope="scope">
          <span>{{scope.row.QTF}}/{{scope.row.QTF_ACTUAL}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="WORKLOAD_ACTUAL" :label="defaultInfo.fee8">
        <template slot-scope="scope">
          <span>{{scope.row.WORKLOAD}}/{{scope.row.WORKLOAD_ACTUAL}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="INTENSIVE_WORKLOAD_ACTUAL" :label="defaultInfo.fee9">
        <template slot-scope="scope">
          <span>{{scope.row.INTENSIVE_WORKLOAD}}/{{scope.row.INTENSIVE_WORKLOAD_ACTUAL}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="DISCOUNT" label="折扣"></el-table-column>
      <el-table-column prop="SUBCONTRACT_FEE" label="分包费用"></el-table-column>
      <el-table-column label="操作" min-width="50" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" style="padding:0;font-size:18px;" v-mindPopover="{message:'确认删除？若删除最后一个登记号则关闭此窗口，需重新选择登记号！',success:handleDelete.bind(this,scope)}"><i
            class="el-icon-delete" title="删除"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, ajaxSyncProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';

  const defaults = {
    hoho: ''
  };
  export default {
    name: "billInfo",
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      callback: {
        type: Function
      },
      djhTable: {
        type: Array
      },
    },
    data() {
      let companyPhoneCheck = (rule, value, callback) => {
        let reg = /([0-9]{3,4}-)?[0-9]{7,8}/
        if (value && !reg.test(value)) {
          callback(new Error('请输入正确的办公电话'));
        } else {
          callback();
        }
      };
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          billName: [{type: 'string', required: true, message: '缴费单名称不能为空'},
            {type:'string',max:100,message:'最多输入100个字符',trigger:'blur'}],
          companyContact:[{type:'string',max:40,message:'最多输入40个字符',trigger:'blur'}],//单位联系人
          companyAddress:[{type:'string',max:150,message:'最多输入150个字符',trigger:'blur'}],//单位地址
          companyPhone:[
            {validator:companyPhoneCheck,trigger:'blur'}
          ],
          remark:[{type:'string',max:400,message:'最多输入400个字符',trigger:'blur'}],
          ticketCompany:[{type:'string',max:100,message:'最多输入100个字符',trigger:'blur'}],
          taxCode:[{type:'string',max:50,message:'最多输入50个字符',trigger:'blur'}],
          ticketAddressPhone:[{type:'string',max:200,message:'最多输入200个字符',trigger:'blur'}],
          ticketBankAccount: [{type:'string',max:200,message:'最多输入200个字符',trigger:'blur'}],
        },
        loading: false,
        remoteOptions: [],
        //autoComplete 是否不输入值就可匹配
        flag: false,
        registration_no: "",//勾选中的登记号
        staffs: [],//业务员下拉
        defaultInfo: {},//初始化页面字段名称
        totalMoney: 0,//缴费单金额
        discountSum: 0,//可打折费用合计
        undiscountSum: 0,//不可打折费用合计
        jdfActual: 0,//检测费实收合计

      }
    },
    directives: {rightclick},
    mixins: [rightClick],
    components: {},
    methods: {//方法定义
      //删除登记号
      handleDelete(scope) {
        let _this = this;
        if (this.djhTable.length > 1) {
          _this.djhTable.splice(scope.$index, 1);
        } else {
          _this.djhTable.splice(scope.$index, 1);
          _this.callback();
        }
      },
      getBusinessStaff() {
        ajaxRequest('get', 'back/businessStaff/getStaff', {showFlag: '1'}, (res) => {
          this.staffs = res;
        })
      },
      handleSubmit() {
        let _this = this;
        //-- 表单提交处理 --
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
          if (valid) {
            var httpMethod;//http请求方式
            if (!this.form.id || this.form.id == '') {//新增 注意:通过id是否存在来判断是新增还是编辑
              httpMethod = 'post';
            } else {//更新
              httpMethod = 'put';
            }

            this.form.registrationNo = this.registration_no;
            this.form.billMoney = this.totalMoney;
            this.form.jdfActual = this.jdfActual;
            console.log("新增缴费单提交数据", this.form)
            ajaxRequest(httpMethod, "back/bill/", this.form, (res) => {
              _this.callback(res);
            });
          } else {
            return false;
          }
        })
      },
      remoteMethod() {
        //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
        ajaxSyncProxyRequest('get', '/njmind/findParams/fee1$fee2$fee3$fee4$fee5$fee6$fee7$fee8$fee9', {}, (res) => {
          this.defaultInfo = {
            fee1: res.fee1.value,
            fee2: res.fee2.value,
            fee3: res.fee3.value,
            fee4: res.fee4.value,
            fee5: res.fee5.value,
            fee6: res.fee6.value,
            fee7: res.fee7.value,
            fee8: res.fee8.value,
            fee9: res.fee9.value,
          }
        });
        console.log("费用名称", this.defaultInfo)
      },
      handleSelect(item) {
        console.log("选择的单位信息",item)
        this.$set(this.form, "companyId", item.id)
        this.$set(this.form, "companyName", item.companyName);
        this.$set(this.form, "companyAddress", item.address);
        this.$set(this.form, "companyContact", item.contacter);
        this.$set(this.form, "companyPhone", item.telephone);
        this.$set(this.form, "businessStaff", item.businessStaff);
        //开票信息
        this.$set(this.form, "ticketCompany", item.invoiceCompany);
        this.$set(this.form, "taxCode", item.taxNo)
        this.$set(this.form, "ticketAddressPhone", item.invoiceAddressTel);
        this.$set(this.form, "ticketBankAccount", item.accountBankNo)
      },

      handleForm() {
        this.$set(this.form, "companyId", this.data.COMPANY_ID);
        this.$set(this.form, "billName", this.data.COMPANY_NAME);
        this.$set(this.form, "companyName", this.data.COMPANY_NAME);
        this.$set(this.form, "companyAddress", this.data.ADDRESS);
        this.$set(this.form, "companyContact", this.data.CONTACTER);
        this.$set(this.form, "companyPhone", this.data.TELEPHONE);
        this.$set(this.form, "businessStaff", this.data.BUSINESS_STAFF);
        //开票信息
        this.$set(this.form, "ticketCompany", this.data.INVOICE_COMPANY);
        this.$set(this.form, "taxCode", this.data.TAX_NO)
        this.$set(this.form, "ticketAddressPhone", this.data.INVOICE_ADDRESS_TEL);
        this.$set(this.form, "ticketBankAccount", this.data.ACCOUNT_BANK_NO)
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
      handleCancel() {
        this.callback(null);
      },
      getDjhTotal() {
        let djh = "", totalActual = Number(0), jdfActual = Number(0);
        this.djhTable.forEach(row => {
          djh += row.REGISTRATION_NO + ";";
          totalActual += Number(row.TOTAL_ACTUAL);
          jdfActual += Number(row.JDF_ACTUAL);
          if (row.IS_DISCOUNT == 1) {
            this.discountSum += row.TOTAL_ACTUAL;
          } else {
            this.undiscountSum += row.TOTAL_ACTUAL;
          }
        });
        this.registration_no = djh;
        this.totalMoney = totalActual;
        this.jdfActual = jdfActual;
      }
    },
    mounted() {
      this.remoteMethod();
      this.getBusinessStaff();
      this.getDjhTotal();
      this.handleForm();
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
