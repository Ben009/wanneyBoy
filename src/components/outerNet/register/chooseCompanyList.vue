<template>
  <mind-dialog
    :title="'请选择绑定单位'"
    :visible="true"
    dialogSize="large"
    center
    v-dialogDrag
    @close="handleCancel">

    <div v-if="defaultOpen">
      <Retrieve ref="retrieve-wapper"
                :rowsCondition='rowsCondition'
                :sortBy="sortBy"
                :order="order"
                :paramJson="paramJson"
                :retrieveCondition="retrieveCondition"
                :collectionInfo="collectionInfo"/>
    </div>

    <div>
      <div style="display: flex;justify-content: space-between; margin:10px 0px;">
        <div style="display: inline-block;text-align: center;margin:0 auto">
          <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
          <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning">&nbsp;清空</el-button>
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
          </span>
      </div>
      <div>
        <el-table :data="tableData"
          border
          style="width: 100%"
          :max-height="QJTableMaxHeight"
          @sort-change="handleSort"
          @selection-change="handleSelectionChange"
          @row-click="openDetails">

          <el-table-column fixed type="index" label="序号" width="50px"></el-table-column>

          <el-table-column
            prop="companyName"
            label="单位名称"
            v-if="headObj.companyName"

          ></el-table-column>

          <el-table-column
            prop="contacter"
            label="联系人"
            v-if="headObj.contacter"

          ></el-table-column>
          <el-table-column
            prop="telephone"
            label="联系电话"
            v-if="headObj.telephone"

          ></el-table-column>

          <el-table-column
            prop="contractNo"
            label="合同号"
            v-if="headObj.contractNo"

          ></el-table-column>

          <el-table-column
            prop="companyType"
            label="单位类别"
            v-if="headObj.companyType"

            :formatter="formatterCompanyType"
          ></el-table-column>

          <el-table-column
            prop="businessGroup"
            label="业务组"
            v-if="headObj.businessGroup"

          ></el-table-column>

          <el-table-column
            prop="businessStaff"
            label="业务员"
            v-if="headObj.businessStaff"

          ></el-table-column>

          <el-table-column
            prop="status"
            label="是否审核"
            v-if="headObj.status"

            :formatter="formatterCompanyStatus"
          ></el-table-column>
        </el-table>
      </div>
      <div style="margin-top:10px;text-align:center;float:right;">
        <!-- TODO 案例 分页控件 mind-pagination  -->
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
    </div>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import $ from 'jquery'
  import {ajaxRequest, formatArrayToTree} from '../../util/base'
  import Retrieve from '../../Retrieve'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import paramJson from '../customerSearch/company'    //同目录下json数据

  const defaults = {
    hoho: ''
  };
  export default {
    name: 'companyList',
    props: {
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

        page: 1,
        rows: 10,
        total: 0,
        searchKey: "",
        orderProperty: "",
        orderType: "",
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,
        isPut: true,

        isSetting: 0, //控制个性化设置弹窗是否展示
        edit: null, //控制编辑弹窗是否展示
        isInner: 0,

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
        collectionInfo: []
      }
    },
    methods: {

      formatterCompanyType: function (row, column) {
        var companyTypes = {1: '第一类别', 2: '第二类别', 3: '第三类别', 4: '第四类别', 5: '第五类别', 6: '第六类别'}
        return companyTypes[row.companyType]
      },

      formatterCompanyStatus(row, column) {
        var status = {1: '已审核', 0: '未审核'};
        return status[row.companyType]
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

      getTableList() {
        ajaxRequest('get', 'back/company/retrieve', {
          fuzzySearch: 1,
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total: 0,
          isDelete: 0,
          sc: this.sc
        }, (res) => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
            this.multipleSelection = []

          }
        })
      },

      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList()
      },

      handleCurrentPageChange(currentPage) {
        this.page = currentPage
        this.getTableList()
      },

      handleCancel: function () {
        this.callback();
      },
      openDetails(row,event,column){
        this.callback(row);
      },
      bindCompany: function (rowInfo) {
        //密码复位
        var _this = this;
        ajaxRequest("post", "back/customer/bindCompany", {
          dwId: _this.form.dwId,
          erpDwId: rowInfo.id
        }, (res) => {
          if (res.code == 200) {
            _this.$message.success(res.msg);
            _this.handleCancel();
          } else {
            _this.$message.error(res.msg);
          }
        });

      }
    },
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve
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
  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }

  .el-icon-setting:hover {
    color: #3094e0 !important;
  }

  .shuoming {
    border: none !important;
    color: #56BC4E !important;
    font-size: 16px !important;
  }

  .shuoming::after {
    content: "";
    width: 35px;
    height: 40px;
    /*background: #fff;*/
    position: absolute;
    z-index: 999;
    /* top: 0; */
    /* left: -65px; */
    margin-left: -16px;

  }

  .el-sm {
    background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 1px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -361px;
    word-break: break-all;
    margin-top: 18px;
    padding: 4px 5px;
    font-size: 14px;
    opacity: 50;
    float: right;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }

  .shuoming .el-sm {
    display: none;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }

  .el-button--warning:hover {
    background: #ff9c9c !important;
    border: 1px solid #ff9c9c !important;

  }
</style>
