<template>
  <div style="position:relative;">
    <div style="margin-bottom:10px;">
      <Retrieve ref="retrieve-wapper"
                :rowsCondition='rowsCondition'
                :sortBy="sortBy"
                :order="order"
                v-if="defaultOpen"
                :paramJson="paramJson"
                :retrieveCondition="retrieveCondition"
                :collectionInfo="collectionInfo"
      />
    </div>
    <div>
      <div style="display: flex;justify-content: space-between; margin:10px 0px;">
        <span></span>
        <div style="display: inline-block;text-align: center">
          <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询</el-button>
          <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info" v-if="defaultOpen">&nbsp;清空
          </el-button>
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
           <global-tootips :width="600">
             <p>1、预开票记录：查询所有申请预开票且已开票的记录；</p>
             <p>2、针对已开票但未到款的记录，有权限人员可取消该预开票；</p>
             <p>3、到款状态红，未到账。</p>
          </global-tootips>
          </span>
      </div>
      <el-table :max-height="QJTableMaxHeight"
                :data="tableData"
                border
                style="width: 100%"
                @sort-change="handleSort"
                v-loading="loading">
        <el-table-column v-if="headObj.ticketCompany" prop="ticketCompany" label="开票单位"></el-table-column>
        <el-table-column v-if="headObj.billNo" prop="billNo" label="缴费单编号"></el-table-column>
        <el-table-column v-if="headObj.ticketMoney"prop="ticketMoney" label="开票金额"></el-table-column>
        <el-table-column v-if="headObj.paybackPeriods" prop="paybackPeriods" label="回款周期" :formatter="handleDate"></el-table-column>
        <el-table-column v-if="headObj.departName" prop="departName" label="开票部门" ></el-table-column>
        <el-table-column v-if="headObj.userName" prop="userName" label="申请人" ></el-table-column>
        <el-table-column v-if="headObj.drawerName" prop="drawerName" label="开票人" ></el-table-column>
        <el-table-column v-if="headObj.ticketDate" prop="ticketDate" label="开票时间" :formatter="handleDate"></el-table-column>
        <el-table-column v-if="headObj.status" prop="status" label="到款状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==3">已到款</span>
            <span v-else style="color:red">未到款</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right"  width="60px">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-search" title="编辑"></i></el-button>
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
    <financeBillDetail v-if="!!edit" :data="edit" :callback="handleEditCallback"></financeBillDetail>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import {ajaxRequest, ajaxProxyRequest} from '../../util/base';
  import Retrieve from '../../Retrieve';
  import WorkMould from '../../mould/WorkMould';
  import TableColumnHeader from '../../Table/TableColumnHeader';
  import paramJson from "./financeBill"; //同目录下json数据
  import financeBillDetail from './financeBillDetail.vue';

/*   import {Table, TableColumn, Pagination} from 'element--ui';
  Vue.use(Table);
  Vue.use(TableColumn); */

  export default {
    name: "finance-bill-list",
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 't.add_time',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,
        isSetting: 0,  //控制个性化设置弹窗是否展示
        edit:null,//详情弹窗

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
        collectionInfo:[],
        loading:false,
      }
    },
    methods: {
      handleSort: function (column, prop, order) {
        this.orderProperty = column['prop'];
        if (column['order'] == 'descending') {
          this.orderType = 'desc';
        } else {
          this.orderType = 'asc';
        }
        this.getTableList();
      },
      getTableList() {
        this.loading=true
          ajaxRequest('get', 'back/ticketApply/retrieveHadCheck', {
            fuzzySearch: 1,
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            orderType: this.orderType,
            total: 0,
            sc: this.sc
          }, (res) => {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
              this.multipleSelection = [];
            }
            this.loading=false
          })
      },
      //每页显示条数切换加载数据
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList();
      },
      //页码切换加载数据
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      //详情页面
      handleEdit(rowInfo) {
        this.edit = rowInfo;
      },
      handleEditCallback() {
        this.edit = null;
        this.getTableList();
      },
      handleDelete(data) {
        let ids = data.map(function (v) {
          return v.id
        }).join(',')
        ajaxRequest('post', 'back/ticketApply/list/' + ids, {_method: 'delete'}, function (res) {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getTableList();
          } else {
            this.$message.error('删除失败');
          }
        }.bind(this))
      },
      handleDate: function (row, column, cellValue) {
        if (cellValue != null && cellValue != "") {
          return new Date(cellValue).format('YYYY-MM-DD');
        }
      },
    },
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      financeBillDetail,
    },
    mounted() {
      let userId = localStorage.getItem("userId");
      this.userId = userId;
      this.getTableList();
      this.QJGetMounted();
    }
  }
</script>

<style scoped>
  .custom-input {
    width: 200px;
    height: 32px;
  }

  .custom-input .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  .custom-input .el-input-group__append {
    padding: 0 10px;
  }
</style>
