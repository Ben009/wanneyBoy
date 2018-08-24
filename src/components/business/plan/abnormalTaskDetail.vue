<template>
  <div style="position:relative;">
    <div style="float: right">
      <global-tootips :width="600">
        <p>１、配号退回查询在委托-现场要号和带回配号节点被退回的器具；未认领查询已排单但是未分配执行人的器具；</p>
        <p>２、委托单位带有*表示该任务有特殊说明，您可将鼠标移至委托单位查询名称上查看；如有附件可在此下载。</p>
      </global-tootips>
    </div>
    <div>
      <el-table :data="tableData" border :max-height="QJTableMaxHeight" ><!--:span-method="arraySpanMethod"-->
        <el-table-column prop="planTime" label="计划日期" align="center"></el-table-column>
        <el-table-column prop="orderNo" label="委托单编号" align="center"></el-table-column>
        <el-table-column prop="companyName" label="委托单位" align="center" >
          <template slot-scope="scope">
            <companyPopover :rowInfo="scope.row" showContent="companyName"></companyPopover>
          </template>
        </el-table-column>
        <el-table-column prop="detectionSite" label="上门检测地址"  align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="leader" label="带队人" align="center" show-overflow-tooltip :formatter="userFormat">
        </el-table-column>
        <el-table-column prop="vehicle" label="车辆情况" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="driver" label="司机" align="center" show-overflow-tooltip :formatter="userFormat">
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="isClaim=='1'" prop="orderSingleNo" label="流转单编号" align="center" width="104px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="applianceName" label="器具名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="setNumber" label="套数" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="departName" label="检测部门" align="center" show-overflow-tooltip >
        </el-table-column>

        <el-table-column v-if="isClaim=='1'" prop="claimant" label="认领人" align="center" show-overflow-tooltip :formatter="userFormat">
        </el-table-column>
        <el-table-column v-if="isClaim=='1'" prop="claimTime" label="认领时间" align="center" show-overflow-tooltip :formatter="dateFormat">
        </el-table-column>
        <el-table-column v-if="isClaim=='1'" prop="inspector" label="执行人" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="isClaim=='1'" prop="estimatedWorkload" label="工作量" align="center" show-overflow-tooltip>
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
  import Vue from "vue";
  import Vuex from "vuex";
  import companyPopover from './companyPopover.vue';
  import {ajaxRequest, formatDate, ajaxProxyRequest} from "../../util/base";


/*   import {
    Button,
    Table,
    TableColumn,
    Form,
    FormItem,
    Tag
  } from "element--ui";
  Vue.use(Button);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Tag); */

  export default {
    name: "role-table",
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: "",
        tableData: [],
        multipleSelection: [],
        form: {},
        rules: {},
        orgIds: [],
        users: [],
        userData: [],
        orderSingleNoState: true,
        contactArray: [],
        contactDot: null,
        comPanyForm: {
          'specialRequirement': '',
          'attachment': '',
          'remarkQuo': '',
          'attachmentQuo': '',
          'otherSpecialRequirement': ''
        },
        isShow: false,
        showEppro: false,
        taskPerson: [],
        disabled:true,
      };
    },
    props: ["isClaim"],
    components: {companyPopover},
    created() {
      this.initDepart();
      this.getUserData();
    },
    mounted() {
      this.getTableList();
    },
    computed: {},
    filters: {
      claimTimeFormat(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      }
    },
    methods: {
      userFormat(row, column, cellValue, index) {
        let returnName = "";
        this.userData.forEach(data => {
          if (data.id == cellValue) {
            returnName = data.userName;
            return;
          }
        });
        return returnName;
      },
      departFormat(row, column, cellValue, index) {
        let returnName = "";
        this.orgIds.forEach(data => {
          if (data.id == cellValue) {
            returnName = data.departName;
            return;
          }
        });
        return returnName;
      },
      dateFormat(row, column, cellValue, index) {
        return formatDate(cellValue, "YYYY-MM-DD hh:mm:ss");
      },

      isOrderSingleNo(row, column, cellValue, index) {
        if (row.orderSingleNo) {
          alert(2);
        }
      },
      getTableList() {
        this.contactArray = [];
        this.contactDot = 0;
        let  param = {
          isClaim: this.isClaim,
          page: this.page,
          rows: this.rows,
          total: 0
        };
        if(this.isClaim=='0'){//未认领
          param = {
            isClaim: this.isClaim,
            page: this.page,
            rows: this.rows,
            total: 0
          }
        }
        ajaxRequest(
          "get", "back/arrange/abnormalTaskList", param,
          res => {
            if (res.code === 200) {
              this.tableData = res.rows;
              console.table(this.tableData);
              this.total = res.total;
              this.multipleSelection = [];
            }
          }
        );
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      initDepart() {
        //获取部门数据
        ajaxRequest(
          "get",
          "back/depart/list/",
          {
            isDelete: 0
          },
          res => {
            this.orgIds = res.rows;
          }
        );
      },
      getUserData() {
        ajaxRequest(
          "get",
          "back/user/retrieve",
          {
            isDelete: 0
          },
          res => {
            if (res.code === 200) {
              this.userData = res.rows;
            }
          }
        );
      },
      changeDepartEvt(orgId) {
        //根据部门ID获取人员
        this.form.user = '';
        if (orgId) {
          ajaxRequest(
            "get",
            "back/user/retrieve",
            {
              departId: orgId
            },
            res => {
              this.users = res.rows;
            }
          );
        }
      },
      handleCurrentPgetTableageChange(currentPage) {
        this.page = currentPage;
        this.List();
      },
      userDataFormat(id) {
        let returnName = "";
        this.userData.forEach(data => {
          if (data.id == id) {
            returnName = data.userName;
            return;
          }
        });
        return returnName;
      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex < 8 && columnIndex > 0) {
          var num = 0;
          var max = 0;
          for (var i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i].orderNo === row.orderNo &&
              this.tableData[i].planTime === row.planTime &&
              i >= rowIndex
            ) {
              num++;
            }
            if (
              this.tableData[i].orderNo === row.orderNo &&
              this.tableData[i].planTime === row.planTime
            ) {
              max++;
            }
          }
          if (num > 1) {
            if (max === num) {
              return {
                rowspan: num,
                colspan: 1
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          } else {
            if (max > 1) {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          }
        }
      },
      comPanyNameDetail(row) {
        this.comPanyForm = {'specialRequirement': row.specialRequirement, 'attachment': row.attachment};

        ajaxRequest(
          "get",
          "back/plan/getQuoInfoByQuoNo",
          {
            quotationNo: row.quotationNo
          },
          res => {
            if (res.code === 200) {
              if (res.daoResult) {

                this.comPanyForm['remarkQuo'] = res.daoResult.remark;
                this.comPanyForm['attachmentQuo'] = res.daoResult.attachment;
                this.comPanyForm['otherSpecialRequirement'] = row.otherSpecialRequirement;
              } else {
                this.showEppro = true;
              }
              // comPanyForm: {'specialRequirement':'','attachment':'','remarkQuo':'','attachmentQuo':'','otherSpecialRequirement':''}

              if(this.comPanyForm['attachment']!=""&&this.comPanyForm['attachment']!="undified"&&this.comPanyForm['attachment']!="null"){
                this.showEppro = true;
              }else{
                this.showEppro = false;
              }
            }
          }
        )
      },
      //查看附件
      attachmentClick(val) {
        alert(val)
      },
    }
  };
</script>

<style scoped>
  .table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
    text-align: center;
    border: 1px solid #ddd;
  }

  .table > thead > tr > th {
    vertical-align: bottom;
    border: 1px solid #ddd;
    border-bottom: 2px solid #ddd;
    padding: 8px;
    line-height: 1.42857143;
    background: #fbfbfb;
  }

  .table tr:hover {
    background: #fbfbfb;
  }

  .table tr:nth-child(odd) {
    background: #f4f4f4;
  }

  .table > tbody > tr > td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  .bg-purple-green {
    background-color: #85d76b;
  }

  .font-12 {
    font-size: 12px !important;
  }

  .p-2 {
    padding: 2px 2px;
  }

  .font-red {
    color: red;
    font-weight: bold;
    cursor: pointer;
  }
</style>
