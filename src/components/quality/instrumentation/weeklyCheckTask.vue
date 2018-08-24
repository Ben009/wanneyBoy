<template>
  <div style="position:relative;">
    <div v-if="!detailId">
      <div style="margin-bottom:10px;" v-if="defaultOpen">
        <Retrieve ref="retrieve-wapper"
                  :rowsCondition='rowsCondition'
                  :sortBy="sortBy"
                  :order="order"
                  :paramJson="paramJson"
                  :retrieveCondition="retrieveCondition"/>
      </div>
      <div>
        <div style="text-align: center"  v-if="defaultOpen" >
          <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
          <el-button type="warning" @click="QJEmptyCondition"  class="el-icon-info">&nbsp;清空</el-button>
        </div>

        <span style="float: right">
                <el-select size="mini"
                           v-if="resultCondition.length"
                           v-model="templateValue"
                           placeholder="请选择"
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
                <global-tootips>
                    <p>1、本节点周检设备的状态跟踪；</p>
                    <p>2、若为自检设备，当完成状态出现完成日期时，表示该设备已检测完毕，可以更新</p>
                </global-tootips>
                <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                           :handleMouldBack="QJHandleMouldBack"/>
            </span>
      </div>
      <div style="margin-top:10px;">
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%" v-loading="loading">
          <el-table-column type="index" label="序号" key="index"></el-table-column>
          <el-table-column label="设备名称"
                           prop="instrumentationName"
                           key="instrumentationName">
          </el-table-column>
          <el-table-column label="型号规格" prop="model"
                           v-if="headObj.model"
                           key="model">
          </el-table-column>
          <el-table-column label="测量范围" prop="mearsuringRange"
                           v-if="headObj.mearsuringRange"
                           key="mearsuringRange">
          </el-table-column>
          <el-table-column label="出厂编号" prop="manufacturingCode"
                           v-if="headObj.manufacturingCode"
                           key="manufacturingCode">
          </el-table-column>
          <el-table-column label="设备编号" prop="deviceNumber"
                           v-if="headObj.deviceNumber"
                           key="deviceNumber">
          </el-table-column>
          <el-table-column label="归属部门" prop="departName"
                           v-if="headObj.departName"
                           key="departName">
          </el-table-column>
          <el-table-column label="有效日期" prop="effectiveDate"
                           v-if="headObj.effectiveDate"
                           :formatter="dateFormat"
                           key="effectiveDate">
          </el-table-column>
          <el-table-column label="登记号" prop="registrationNo"
                           v-if="headObj.registrationNo"
                           key="registrationNo">
          </el-table-column>
          <el-table-column label="完成状态" prop="sjdStatus"
                           v-if="headObj.sjdStatus"
                           key="sjdStatus">
          </el-table-column>
          <el-table-column label="设备状态" prop="status"
                           v-if="headObj.status"
                           :formatter="statusFormatter"
                           key="status">
          </el-table-column>
          <el-table-column label="溯源方式" prop="traceWay"
                           v-if="headObj.traceWay"
                           :formatter="traceWayFormatter"
                           key="traceWay">
          </el-table-column>
          <el-table-column label="保管人" prop="keeperName" v-if="headObj.keeperName" key="keeperName"></el-table-column>
          <el-table-column label="周检类型" prop="source" v-if="headObj.source"
                           :formatter="sourceFormatter" key="source"></el-table-column>
          <el-table-column label="计划名称" prop="planItem" v-if="headObj.planItem" key="planItem"></el-table-column>
          <el-table-column label="更新状态" prop="isUpdate" v-if="headObj.isUpdate" key="isUpdate" :formatter="formatterStatus"></el-table-column>
          <el-table-column label="加入人" prop="addUserName" v-if="headObj.addUserName"
                           key="addUserName"></el-table-column>
          <el-table-column label="加入日期" prop="addTime" :formatter="dateFormat" v-if="headObj.addTime" key="addTime"></el-table-column>
          <el-table-column label="更新人" prop="updateUserName" v-if="headObj.updateUserName"
                           key="updateUserName"></el-table-column>
          <el-table-column label="更新日期" prop="updateTime" :formatter="dateFormat" v-if="headObj.updateTime" key="updateTime"></el-table-column>
          <el-table-column label="操作" fixed="right" width="60px">
            <template slot-scope="scope">
              <el-button type="text" class="iconClass" @click="editInfo(scope.row)"><i class="el-icon-view"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
    </div>
    <instrumentation-tab v-if="detailId" :standard-id="detailId" type="weeklyCheckTask"
                         @goBack="handleCancel"></instrumentation-tab>
    <!-- <plan-detail v-if="detailInfo" @show="handleBack" :row-info="detailInfo"></plan-detail> -->

  </div>
</template>
<script>
  import $ from 'jquery'
  import {ajaxRequest, ajaxProxyRequest} from "../../util/base.js";
  import Retrieve from "../../Retrieve.vue";
  import WorkMould from "../../mould/WorkMould.vue";
  import param from './weeklyCheckTaskParam.js'
  import instrumentationTab from './instrumentationTab.vue'
  import planDetail from './planDetail.vue'
  export default {
    name: 'weeklyCheckTask',
    components: {Retrieve, WorkMould, instrumentationTab ,planDetail},
    data() {
      return {
        /************************************* 高级检索字段 start *************************************/
        fuzzySearch: 0,
        isSetting: 0, //控制个性化设置弹窗是否展示
        rowsCondition: param, //默认同目录下json数据 会依据模板改变
        paramJson: param, //同目录下json数据 常量
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
        /************************************* 高级检索字段 end *************************************/
        page: 1,
        rows: 10,
        total: 0,

        tableData: [],
        detailId: undefined,//查看详细的id
        instStatusList: [],//设备状态列表
        instTraceWay: [],//溯源方式
        loading:false,
        detailInfo:null,//另一种查看详情的方式
      }
    },
    mounted() {
      this.getInstStatusList();
      this.getTableList();
      this.QJGetMounted();
    },
    methods: {
      //获取设备状态、溯源方式数据字典
      getInstStatusList() {
        ajaxProxyRequest('get', '/njmind/findParams/instrumentationStatus$instrumentationtraceWay', {}, (res) => {
          this.instStatusList = res.instrumentationStatus.list
          this.instTraceWay = res.instrumentationtraceWay.list
        })
      },
      //设备状态格式化
      statusFormatter(row, column, cellValue) {
        if (cellValue+'') {
          let msg =''
          console.log(cellValue,'cellValue');
          this.instStatusList.forEach(v => {
            console.log(v.code,'v.code')
            if (cellValue*1 == v.code*1) {
              return msg =v.remark;
            }
          })
          return msg;
        }
      },
      //溯源方式格式化
      traceWayFormatter(row, column, cellValue) {
        if (cellValue+'') {
          let msg = ''
          this.instTraceWay.forEach(v => {
            if (cellValue == v.code) {
              return msg = v.remark;
            }

          })
          return msg;
        }
      },
      //更新状态
      formatterStatus(row, column, cellValue){
        return cellValue == 1 ? '已更新' : '未更新';
      },
      //周检类型格式化
      //来源 0：核查计划1：周检计划； 2：实施计划-外送 3：实施计划-自检 4：单独自检 5：自行外送
      sourceFormatter(row, column, cellValue) {
        if (cellValue == 3 || cellValue == 4) {
          return '自检计划';
        } else if (cellValue == 2 || cellValue == 5) {
          return '外送计划';
        }
      },
      //查询
      getTableList() {
        this.loading=true
        ajaxRequest("get", "back/instrumentation/getTraList", {
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            orderType: this.orderType,
            total: 0,
            sc: this.sc
          }, res => {
            this.total= res.total;
            this.tableData = res.rows;
            this.loading=false
          }
        );
      },
      handlePageSizeChange(size) {
        this.page = 1;
        this.rows = size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      /******table内容格式化******* */
      dateFormatter(row, column, cellValue) {
        if (cellValue) {
          return new Date(cellValue).format("YYYY-MM-DD");
        }
      },
      /*********格式化end***** */
      editInfo(info) {
        this.detailId = info.id;
      },
      handleCancel() {
        this.detailId = undefined;
        this.getTableList();
      },
      // 查看详情的返回
      handleBack(info){
        this.detailInfo = null;
        this.getTableList();

      },
      // table时间格式化
      dateFormat(row,column,cellValue){
        if(cellValue){
          return new Date(cellValue).format('YYYY-MM-DD')
        }
      }
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

.iconClass{
  padding:0;
  font-size:18px;
}
</style>


