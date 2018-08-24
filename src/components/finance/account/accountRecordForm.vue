<template>
  <mind-dialog
    :title="!!data.id?'到款详情':'新增到款'"
    :visible="true"
    dialogSize="mid"
    center
    v-dialogDrag
    @close="handleCancel">
    <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-Row>
          <el-col :span="12">
            <el-form-item label="付款单位" prop="paymentCompany">
              <el-input v-model="form.paymentCompany" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款账号" prop="paymentAccount">
              <el-input v-model="form.paymentAccount" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到款金额" prop="payMoney">
              <el-input v-model.number="form.payMoney" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款时间" prop="payTime">
              <el-date-picker style="width: 100%"
                              v-model="form.payTime"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" :readonly="isReadOnly">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款账号" prop="receiveAccount">
              <el-input v-model="form.receiveAccount" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
        </el-Row>
      </el-form>
    </div>
    <div style="margin-top:20px;" v-if="isReadOnly">
      <el-table :max-height="QJTableMaxHeight"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="USER_NAME" label="认领人" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="ADD_TIME" label="认领时间" show-overflow-tooltip :formatter="formatteraddTime"></el-table-column>
        <el-table-column prop="CLAIM_MONEY" label="认领金额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="LINK_SOURCE" label="来源">
          <template slot-scope="scope">
            <span v-if="scope.row.LINK_SOURCE=='1'">缴费单</span>
            <span v-if="scope.row.LINK_SOURCE=='2'">预开票</span>
            <span v-if="scope.row.LINK_SOURCE=='3'">其他条件结账</span>
          </template>
        </el-table-column>
        <el-table-column prop="TICKET_COMPANY" label="预开票单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="BILL_NO" label="缴费单编号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.LINK_SOURCE=='3'"></span>
            <span v-else>{{scope.row.BILL_NO}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="BILL_NAME" label="缴费单名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.LINK_SOURCE=='3'"></span>
            <span v-else>{{scope.row.BILL_NAME}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer" >
          <el-button v-if="!isReadOnly" type="primary" @click="handleSubmit">保 存</el-button>
          <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';

  import {ajaxRequest,formatDate} from '../../util/base';
  import $ from 'jquery';

  const defaults = {
    payTime:new Date()
  };
  export default {
    name: "account-record-form",
    props: {
      data: {
        type: Object,
        required:true
      },
      callback: {
        type:Function,
        required:true
      }
    },
    data() {
      let paymentCompanyCheck = (rule,value,cb)=>{
        if(!!value){
          if(value.length>100){
            cb(new Error('最多输入100个字符'))
          }else{
            cb();
          }
        }else{
          cb(new Error('付款单位不能为空！'))
        }
      };
      let paymentAccountCheck = (rule,value,cb)=>{
        if(!!value){
          if(value.length>100){
            cb(new Error('最多输入100个字符'))
          }else{
            cb();
          }
        }else{
          cb(new Error('付款账号不能为空！'))
        }
      };
      let payMoneyCheck = (rule,value,cb)=>{
        if(!!value){
          if(value.length>10){
            cb(new Error('最多输入10个字符'))
          }else{
            let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
            if (!regu.test(value)) {
              cb(new Error('付款金额只能输入数字'))
            }else{
              cb();
            }
          }
        }else{
          cb(new Error('付款金额不能为空！'))
        }
      };
      let receiveAccountCheck = (rule,value,cb)=>{
        if(!!value){
          if(value.length>50){
            cb(new Error('最多输入50个字符'))
          }else{
            cb();
          }
        }else{
          cb(new Error('收款账号不能为空！'))
        }
      };
      return {
        form: $.extend({}, defaults, this.data ),
        rules: {
          paymentCompany: [{type: "string", required: true, validator:paymentCompanyCheck,trigger:'blur'}],
          paymentAccount: [{type: 'string', required: true, validator:paymentAccountCheck,trigger:'blur'}],
          payMoney: [{type: 'number',required: true, validator:payMoneyCheck,trigger:'blur'}],
          payTime: [{type: 'string',required: true, message: '付款时间不能为空'}],
          receiveAccount: [{type: 'string',required: true, validator:receiveAccountCheck,trigger:'blur'}],
          remarks: [{type:'string',max:100,message:'最多输入200个字符'}]
        },

        tableData:[],
        isReadOnly:false//是否可修改
      }
    },
    mounted() {
      if(this.form.payTime){
        this.form.payTime = new Date(this.form.payTime).format('YYYY-MM-DD');
      }
      this.getTableList();
    },
    methods: {
      //保存操作
      handleSubmit() {
        let _this = this;
        this.$refs.form.validate((valid) => {
          if (valid) {
            let rowInfo = this.form;
            delete rowInfo.updateTime;
            delete rowInfo.addTime;
            if(rowInfo.payTime == "" || rowInfo.payTime == null){
              delete rowInfo.payTime;
            }else{
              rowInfo.payTime = new Date(rowInfo.payTime);
            }
            if(rowInfo.id){
              ajaxRequest('put','back/accountRecord/',rowInfo,(res)=>{
                if(res.code===200){
                  this.callback("success");
                }else{
                  this.callback("error");
                }
              });
            }else {
              ajaxRequest('post', 'back/accountRecord/', rowInfo, (res) => {
                if (res.code === 200) {
                  _this.callback("success");
                } else {
                  _this.callback("error");
                }
              });
            }
          }else {
            return false;
          }
        })
      },
      //关闭弹窗
      handleCancel(){
        this.callback();
      },
      //分页
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      //分页
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getTableList();
      },
      //获取列表
      getTableList(){
        let _this = this;
        ajaxRequest('get','back/accountRecord/getAccountRecordClaimInfo',{
          id:_this.form.id
        },(res)=>{
          if(res.code===200){
            if(_this.data.isReadOnly){
              _this.isReadOnly = true;
            }else{
              if(res.rows.length>0){
                _this.isReadOnly = true;
              }else{
                _this.isReadOnly = false;
              }
            }
            _this.tableData = res.rows;
          }
        })
      },
      formatteraddTime:function(row, column){
        return formatDate(row.ADD_TIME,'YYYY-MM-DD');
      },
    },
  }
</script>

<style>
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
