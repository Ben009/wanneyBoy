<!-- 折扣审核记录 -->
<template>
  <div style="position:relative;">

    <div style="margin-bottom:10px;" v-if="defaultOpen">
      <Retrieve ref="retrieve-wapper"
                :rowsCondition='rowsCondition'
                :sortBy="sortBy"
                :order="order"
                :paramJson="paramJson"
                :retrieveCondition="retrieveCondition"
                :collectionInfo="collectionInfo"
                :needSort=false
                logic="or"
      />
    </div>

    <div style="display: flex;justify-content: space-between;">
      <div style="width: 300px"></div>
      <div style="display: inline-block;text-align: center">
        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询</el-button>
        <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning" v-if="defaultOpen" >&nbsp;清空</el-button>
      </div>
      <span style="float: right">
            <el-select size="mini" v-if="resultCondition.length" v-model="templateValue" placeholder="请选择"
                       @change="QJHandleSelectTemplate">
              <el-option
                v-for="item in moduleList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)"
                       class="el-icon-setting">个性化设置</el-button>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                       :handleMouldBack="QJHandleMouldBack"/>


            <global-tootips style="float:right;margin-top: 5px">
                <p>1、未审核的可进行撤销；</p>
                <p>2、无权限只能查询业务员或业务组负责人、报价单负责人的报价单；</p>
            </global-tootips>


          </span>
    </div>

    <br>
    <div>
      <el-table :max-height="QJTableMaxHeight"
        :data="tableData"
        border
        style="width: 100%"
        @sort-change="handleSort"
        @selection-change="handleSelectionChange"
        v-loading="loading">

        <el-table-column
          label="序号"
          type="index"
          width="60">
        </el-table-column>

        <el-table-column
          prop="companyName"
          label="委托单位"
          show-overflow-tooltip
          :render-header="QJrenderHeader"
          v-if="headObj.companyName"
          key="companyName"
        >
        </el-table-column>

        <el-table-column
          prop="quotationNo"
          label="报价单编号"
          :render-header="QJrenderHeader"
          v-if="headObj.quotationNo"
          key="quotationNo"
        >
        </el-table-column>

        <el-table-column
          prop="beforeDiscountsTotal"
          label="折前金额"
          :render-header="QJrenderHeader"
          v-if="headObj.beforeDiscountsTotal"
          key="beforeDiscountsTotal"
        >
        </el-table-column>
        <el-table-column
          prop="afterDiscountsTotal"
          label="折后金额"
          :render-header="QJrenderHeader"
          v-if="headObj.afterDiscountsTotal"
          key="afterDiscountsTotal"
        >
        </el-table-column>
        <el-table-column
          prop="applyDiscount"
          label="申请折扣"
          :render-header="QJrenderHeader"
          v-if="headObj.applyDiscount"
          key="applyDiscount"
        >
        </el-table-column>

        <el-table-column
          prop="applyPersonName"
          label="申请人"
          :render-header="QJrenderHeader"
          v-if="headObj.applyPersonName"
          key="applyPersonName"
        >
        </el-table-column>

        <el-table-column
          prop="handleFlag"
          label="当前状态"
          :render-header="QJrenderHeader"
          :formatter="formatterHandleFlag"
          v-if="headObj.handleFlag"
          key="handleFlag"
        >
        </el-table-column>
        <el-table-column
          prop="handlePersonName"
          label="审核人"
          :render-header="QJrenderHeader"
          v-if="headObj.handlePersonName"
          key="handlePersonName"
          >
        </el-table-column>

        <el-table-column
          prop="handleDate"
          label="审核时间"
          :render-header="QJrenderHeader"
          :formatter="formatterDate"
          v-if="headObj.handleDate"
          key="handleDate"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          fixed="right"
          min-width="200">
          <template slot-scope="scope">
            <el-button @click="cancelDiscount([scope.row])" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-back" title="撤销" v-if="scope.row.handleFlag=='0'"></i></el-button>

            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-edit-outline" title="明细"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:10px;text-align:center; float:right;">
      <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">
      </mind-pagination>
    </div>
  </div>

</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'

import {ajaxRequest} from '../../util/base'
import Retrieve from '../../Retrieve'
import WorkMould from '../../mould/WorkMould'
import TableColumnHeader from '../../Table/TableColumnHeader'
import paramJson from './paramAuditHistory'
export default {
  name: 'parameter-table',
  data () {
    return {
      page: 1,
      rows: 10,
      total: 0,
      searchKey: '',
      orderProperty: 'q.id',
      orderType: 'desc',
      tableData: [],
      multipleSelection: [],
      fuzzySearch: 0,
      isSetting: 0,
      edit: null,
      defaultOpen: true,

      /*高级检索相关项*/
      rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
      paramJson: paramJson, //同目录下json数据 常量
      moduleList: [], //模板列表
      templateValue: "", //当前选择的模板id
      sortBy: "", //排序字段
      order: "", //desc降序 asc升序
      headObj: {}, //表头显示对象 {category:true}
      defaultOpen: true, //默认开启高级查询

      userId: "",
      allModules: {}, //所有模板
      resultCondition: [],
      retrieveCondition: [],
      collectionInfo: [],
      loading:false,
    }
  },
  methods: {
    formatterDate: function (row, column) {
      if (row.auditDate) {
        return new Date(row.auditDate).format('YYYY-MM-DD')
      } else {
        return ''
      }
    },
    handleSort: function (column, prop, order) {
      this.orderProperty = column['prop']
      if (column['order'] == 'descending') {
        this.orderType = 'desc'
      } else {
        this.orderType = 'asc'
      }
      this.getTableList()
    },
    getTableList () {
      this.loading=true
      ajaxRequest('get', 'back/quotationDiscountApply/retrieve', {
        fuzzySearch: 1,
        page: this.page,
        rows: this.rows,
        orderProperty: this.orderProperty,
        orderType: this.orderType,
        total: 0,
        sc: this.sc
      }, (res) => {
        if (res.code === 200) {
          this.tableData = res.rows
          this.total = res.total
          this.multipleSelection = []
        }
        this.loading=false
      })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handlePageSizeChange (size) {
      this.page = 1;//Math.floor(this.page * this.rows / size);
      this.rows = size
      this.getTableList()
    },
    handleCurrentPageChange (currentPage) {
      this.page = currentPage
      this.getTableList()
    },
    // 明细页
    handleEdit (rowInfo) {
      this.$router.push({
        path: '/admin/347',
        query: {
          quotationId: rowInfo.quotationId,
          id: rowInfo.id
        }
      })
    },
    // 撤销折扣申请
    cancelDiscount (data) {
      ajaxRequest('post', 'back/quotation/cancelDiscount/', {id: data[0].id, quotationId: data[0].quotationId}, res => {
        if (res.code === 200) {
          this.$message({type: 'success', message: '撤销申请成功'})
          this.getTableList()
        } else {
          this.$message({type: 'error', message: '撤销申请失败'})
          this.getTableList()
        }
      })
    },
    formatterHandleFlag (row) {
      if (row.handleFlag == '0') {
        return '未处理'
      } else if (row.handleFlag == '1') {
        return '已审核'
      } else if (row.handleFlag == '2') {
        return '已退回'
      } else if (row.handleFlag == '3') {
        return '已撤销'
      }
    },
    formatterDate: function (row) {
      if (row.handleDate) {
        return new Date(row.handleDate).format('YYYY-MM-DD')
      } else {
        return ''
      }
    }
  },
  components: {
    WorkMould,
    TableColumnHeader,
    Retrieve
  },
  mounted () {
    let userId = localStorage.getItem("userId");
    this.userId = userId;
    this.getTableList();
    this.QJGetMounted();
  }
}
</script>

<style scoped>


</style>
