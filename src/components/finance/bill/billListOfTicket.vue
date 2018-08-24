<template>
  <mind-dialog
    :title="'发票使用详情'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="large"
    @close="handleCancel">
      <div class="title-item" style="text-align: left;margin-bottom: 10px">
        <span style="width: 95%">使用记录</span>
        <span style="width: 5%">
          <global-tootips :width="600">
            <p>1、点击缴费单编号可以查看缴费详情。</p>
          </global-tootips>
          </span>
      </div>
      <el-table :max-height="QJTableMaxHeight"
                :data="tableData"
                border
                style="width: 100%">
        <el-table-column prop="billNo" label="缴费单编号">
          <template slot-scope="scope">
              <span style="color: blue;font-weight: bold;cursor:pointer;"
                    @click="getBillDetail(scope.row.id)">{{scope.row.billNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="billName" label="缴费单名称"></el-table-column>
        <el-table-column prop="billMoney" label="金额"></el-table-column>
        <el-table-column prop="useTime" label="使用时间"></el-table-column>
        <el-table-column prop="userName" label="使用人"></el-table-column>
        <el-table-column prop="useMoney" label="使用金额"></el-table-column>
      </el-table>
      <div class="title-item"><span>预开票详情</span></div>
      <el-form :model="applyInfo" label-width="140px">
        <el-Row>
          <el-col :span="8">
            <el-form-item label="开票单位" prop="ticketCompany">
              {{applyInfo.ticketCompany}}
              <el-input v-model="applyInfo.companyId" v-show="false"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请金额" prop="ticketMoney">
              {{applyInfo.ticketMoney}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票日期" prop="ticketDate">
              {{applyInfo.ticketDate | DateFormat}}
            </el-form-item>
          </el-col>
        </el-Row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请人" prop="drawerName">
              {{applyInfo.userName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核人" prop="drawerName">
              {{applyInfo.auditorName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票人" prop="drawerName">
              {{applyInfo.drawerName}}
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请时间" prop="ticketOperateDate">
              {{applyInfo.addTime}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核时间" prop="ticketOperateDate">
              {{applyInfo.auditTime}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票时间" prop="ticketOperateDate">
              {{applyInfo.ticketOperateDate}}
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>
          <el-col :span="8">
            <el-form-item label="结账人" prop="drawer">
              {{applyInfo.checkName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间" prop="ticketOperateDate">
              {{applyInfo.checkTime}}
            </el-form-item>
          </el-col>
        </el-row>-->
      </el-form>
      <div class="title-item"><span>发票信息</span></div>
      <checkoutInfo v-for="(item,index) in ticketList" :data="item"></checkoutInfo>
      <span slot="footer" class="dialog-footer" >
      <el-button @click="handleCancel">取 消</el-button>
      </span>
    <commonBillDetail v-if="!!edit" :data="edit" :callback="handleBillCallback"></commonBillDetail>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import {ajaxRequest, formatDate} from '../../util/base';
  import Retrieve from '../../Retrieve';
  import WorkMould from '../../mould/WorkMould';
  import TableColumnHeader from '../../Table/TableColumnHeader';
  import financeBillDetail from '../ticketApply/financeBillDetail.vue';
  import commonBillDetail from './commonBillDetail.vue';
  import checkoutInfo from '../checkout/ticketDetail.vue';

  /*   import {Table, TableColumn} from 'element--ui';
    Vue.use(Table);
    Vue.use(TableColumn); */

  const defaults = {
    hoho: ''
  };
  export default {
    name: "bill-list-of-ticket",
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
        tableData: [],
        modify: null,
        edit: null,
        ticketList: [],
        applyInfo: {},
      }
    },
    methods: {
      getApplyInfo() {
        ajaxRequest('get', 'back/ticketApply/' + this.data.linkId, {}, res => {
          if (res.code === 200) {
            this.applyInfo = res.daoResult;
            this.getTicketData(this.applyInfo.id, this.applyInfo.source);
          }
        })
      },
      //查询开票信息
      getTicketData(id, source) {
        ajaxRequest(
          "get",
          "back/ticket/getTicketListByApply",
          {
            linkId: id,
            source: source,
          },
          res => {
            if (res.code == 200) {
              this.ticketList = res.rows;
            }
          }
        )
      },
      getBillDetail(id) {
        let _this = this;
        ajaxRequest('get', 'back/bill/' + id, {}, (res) => {
          if (res.code === 200) {
            _this.edit = res.daoResult;
          }
        })
      },
      handleBillCallback() {
        this.edit = null;
      },
      getTableList() {
        let _this = this;
        ajaxRequest('get', 'back/ticket/getTicketBillList', {
          ticketId: _this.data.id
        }, function (res) {
          if (res.code === 200) {
            _this.tableData = res.rows;
          }
        }.bind(this))
      },
      handleCancel() {
        this.callback();
      },
      //详情页面
      handleModify(rowInfo) {
        this.modify = rowInfo || {}
      },
      handleEditCallback() {
        this.modify = null;
      }
    },
    filters: {
      DateFormat(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      }
    },
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      commonBillDetail,
      checkoutInfo
    },
    mounted() {
      this.getTableList();
      this.getApplyInfo()
    }
  }
</script>
