<template>
  <div style="position:relative;">
      <div style="margin-bottom:5px;">
        <Retrieve  ref="retrieve-wapper"
                  :rowsCondition='rowsCondition'
                  :sortBy="sortBy"
                  :order="order"
                  :paramJson="paramJson"
                  :retrieveCondition="retrieveCondition"/>
      </div>

      <div>
        <div style="display: flex;justify-content: space-between;">
          <!-- <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增委托单位</el-button> -->
          <div style="display: inline-block;text-align: center;margin:0 auto">
            <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
            <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
          </div>
          <span style="float: right">
            <el-select size="mini" v-if="resultCondition.length" v-model="templateValue"  placeholder="请选择" @change="QJHandleSelectTemplate">
              <el-option
                v-for="item in moduleList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
          </span>
        </div>
        <div style="margin-top:10px;">
          <el-table :max-height="QJTableMaxHeight"
            :data="tableData"
            border
            style="width: 100%"
            @sort-change="handleSort">

            <el-table-column  type="index"  label="序号" width="40" align="center"></el-table-column>
            <el-table-column  prop="planItem" label="计划名称" :render-header="QJrenderHeader"></el-table-column>         
            <el-table-column  prop="planType" label="周检类型" :render-header="QJrenderHeader" :formatter="formatterPlanType"></el-table-column>
            <el-table-column  prop="instrumentation.instrumentationName" label="设备名称" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="instrumentation.deviceNumber" label="设备编号" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="instrumentation.manufacturingCode" label="出厂编号" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="departName" label="所属部门" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="userName" label="保管人" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="registrAtioNo" label="自检登记号" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="finishFlag" label="登记号是否完成" :render-header="QJrenderHeader" :formatter="formatterFinishFlag"></el-table-column>
            <el-table-column  prop="isFinish" label="周检是否完成" :render-header="QJrenderHeader" :formatter="formatterIsFinish"></el-table-column>
            <el-table-column  label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-edit-outline" title="详情"></i></el-button>
                <el-button @click="handleCancel(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-circle-close-outline" title="取消"></i></el-button>
                <el-button @click="handleSet(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-setting" title="设置完成"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right">
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
  </div>


</template>

<script>
import Vue from "vue";
import Vuex from "vuex";
import $ from "jquery";

import { ajaxRequest, formatArrayToTree } from "../../util/base.js";
import Retrieve from "../../Retrieve.vue";
import WorkMould from "../../mould/WorkMould.vue";
import TableColumnHeader from "../../Table/TableColumnHeader";
import paramJson from "./weeklyCheckQuery.js"; //同目录下json数据

/* import { Table, TableColumn,} from "element--ui";
Vue.use(Table);
Vue.use(TableColumn); */

export default {
  name: "plan-query",
  components: {
    WorkMould,
    TableColumnHeader,
    Retrieve
  },
  data() {
    return {
      page: 1,
      rows: 10,
      total: 0,
      searchKey: "",
      orderProperty: "id",
      orderType: "desc",
      tableData: [],
      fuzzySearch: 0,
      isPut: true,

      isSetting: 0, //控制个性化设置弹窗是否展示
      edit: null, //控制编辑弹窗是否展示
      isInner: 0,
      rowInfo: "", //点击详情传参

      /*高级检索相关项*/
      rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
      paramJson: paramJson, //同目录下json数据 常量
      moduleList: [], //模板列表
      templateValue: "", //当前选择的模板id
      sortBy: "", //排序字段
      order: "", //desc降序 asc升序
      headObj: {}, //表头显示对象 {category:true}
      defaultOpen: true, //这个变量没有产生效果？？加入之后页面内容产生很大的破坏

      userId: "",
      allModules: {}, //所有模板
      resultCondition: [],
      retrieveCondition: []
    };
  },
  methods: {
    formatterPlanType(row, column) {
      var planType = {
        0: "周检",
        1: "自检",
        2: "外送",
        3: "核查"
      };
      return planType[row.planType];
    },
    formatterIsFinish(row, column) {
      var isFinish = {
        1: "是",
        0: "否"
      };
      return isFinish[row.isFinish];
    },
    formatterFinishFlag(row, column) {
      var finishFlag = {
        1: "是",
        0: "否"
      };
      return finishFlag[row.finishFlag];
    },
    handleSort: function(column, prop, order) {
      this.orderProperty = column["prop"];
      if (column["order"] == "descending") {
        this.orderType = "desc";
      } else {
        this.orderType = "asc";
      }
      this.getTableList();
    },

    getTableList() {
      if (this.searchKey || this.fuzzySearch === 1) {
        ajaxRequest(
          "post",
          "back/instraumentationTra/WeeklycheckQuery",
          {
            fuzzySearch: 1,
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            // 进行升序降序排列的标志
            orderType: this.orderType,
            total: 0,
            sc: this.sc
          },
          res => {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
            }
          }
        );
      } else {
        ajaxRequest(
          "post",
          "back/instraumentationTra/WeeklycheckQuery",
          {
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            orderType: this.orderType,
            total: 0
          },
          function(res) {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
            }
          }.bind(this)
        );
      }
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
    //操作详情
    handleEdit(rowInfo) {
      this.$router.push({
        path: "/admin/258",
        query: {
          checkId: rowInfo.instrumentation.id
        }
      });
    },
    //取消
    handleCancel(rowInfo) {
      ajaxRequest(
        "post",
        "back/instraumentationTra/Weeklycheckcancellation",
        { ids: rowInfo.instrumentation.id, traId: rowInfo.id },
        res => {
          if (res.code === 200) {
            this.$message.success("取消成功");
            this.getTableList();
          } else {
            this.$message.error("取消失败");
          }
        }
      );
    },
    //設置完成
    handleSet(rowInfo) {
      ajaxRequest(
        "post",
        "back/instraumentationTra/Completionofweeklyinspection?ids="+rowInfo.instrumentation.id+'&traId='+rowInfo.id,
        {},
        res => {
          if (res.code === 200) {
            this.$message.success("设置完成成功");
            this.getTableList();
          } else {
            this.$message.error("设置完成失败");
          }
        }
      );
    },
    //表格时间格式化
    dealDate: function(row, column, cellValue) {
      if (cellValue) {
        return new Date(cellValue).format("YYYY-MM-DD");
      }
    }
  }, 
  mounted() {
    let userId = localStorage.getItem("userId");
    this.userId = userId;
    this.getTableList();
    this.QJGetMounted();
  }
};
</script>

<style scoped>
.flex-one {
  flex: 1;
}
.flex {
  display: flex;
}
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
.el-icon-setting {
  background: none !important;
  border: none !important; 
  color: #3094e0 !important;
}
.el-icon-setting:hover {
  color: #3094e0 !important;
}
</style>

