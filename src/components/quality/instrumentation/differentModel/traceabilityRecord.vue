<!--
 审核结果
 展示审核不通过的
 -->
<template>
<div>
    <div v-if="!replayId">
        <div>
            <div style="margin-bottom:10px;"  v-if="defaultOpen">
                <Retrieve  ref="retrieve-wapper"
                            :rowsCondition='rowsCondition'
                            :sortBy="sortBy"
                            :order="order"
                            :paramJson="paramJson"
                            :retrieveCondition="retrieveCondition"/>
            </div>
            <!-- 高级检索搜索框 end -->

            <!-- 个性化设置 start -->
            <div>
                <div style="text-align: center" v-if="defaultOpen">
                    <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                    <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
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
                    <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
                    <!-- <global-tootips>
                        <p>1、本页面用于创建与查询设备周检的具体实施计划（区分自校、自校）；</p>
                        <p>2、无权限人员本询本部门记录，有权限人员查询所有记录；</p>
                        <p>3、有权限人员可以通过“创建自检计划”创建自检计划，“新建外送计划”创建外送计划；</p>
                        <p>4、创建外送计划后，由各部门通过设备明细节点，将需要外送的设备关联进本次计划；</p>
                        <p>5、外送计划状态关闭后，将无法再次设备；</p>
                    </global-tootips> -->
                    <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
                </span>
            </div>
            <div style="margin-top:10px;">
                <el-table :data="tableData" v-loading="loading">
                    <!-- 设备名称、型号规格、测量范围、出厂编号、设备编号、归属部门、有效日期、设备状态、溯源方式、保管人、审核意见、审核人、加入人、加入时间、 -->
                    <el-table-column key="index" type="index" label="序号"></el-table-column>
                    <el-table-column key="instrumentationName" label="设备名称" prop="instrumentationName" v-if="headObj.instrumentationName" ></el-table-column>
                    <el-table-column key="model" label="型号规格" prop="model" v-if="headObj.model" ></el-table-column>
                    <el-table-column key="mearsuringRange" label="测量范围" prop="mearsuringRange" v-if="headObj.mearsuringRange" ></el-table-column>
                    <el-table-column key="manufacturingCode" label="出厂编号" prop="manufacturingCode" v-if="headObj.manufacturingCode" ></el-table-column>
                    <el-table-column key="deviceNumber" label="设备编号" prop="deviceNumber" v-if="headObj.deviceNumber" ></el-table-column>
                    <el-table-column key="departName" label="归属部门" prop="departName" v-if="headObj.departName" ></el-table-column>
                    <el-table-column key="effectiveDate" label="有效日期" prop="effectiveDate" :formatter="dateFormat"  v-if="headObj.effectiveDate" ></el-table-column>
                    <el-table-column key="status" label="设备状态" prop="status":formatter="statusFormat" v-if="headObj.status" ></el-table-column>
                    <el-table-column key="traceWay" label="溯源方式" prop="traceWay":formatter="traceWayFormat" v-if="headObj.traceWay" ></el-table-column>
                    <el-table-column key="keeperName" label="保管人" prop="keeperName" v-if="headObj.keeperName" ></el-table-column>
                    <el-table-column key="departmentReviewAdvise" label="审核意见" prop="departmentReviewAdvise" v-if="headObj.departmentReviewAdvise" ></el-table-column>
                    <el-table-column key="reviewerName" label="审核人" prop="reviewerName" v-if="headObj.reviewerName" ></el-table-column>
                    <el-table-column key="addUserName" label="加入人" prop="addUserName" v-if="headObj.addUserName" ></el-table-column>
                    <el-table-column key="addTime" label="加入时间" prop="addTime" :formatter="dateFormat" v-if="headObj.addTime" ></el-table-column>
                    <el-table-column key="operate" label="操作" fixed="right" width="60">
                      <template slot-scope="scope">
                          <el-button type="text" @click="handleWatch(scope.row)"><i class="el-icon-view" style="font-size:16px"></i></el-button>
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
    </div>
    <div>
      <instrumentation-tab v-if="replayId" :replayId="replayId"  :standardId="instId"  @goBack="handleBack" type="traceabilityRecord"></instrumentation-tab>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import { ajaxRequest,ajaxProxyRequest } from "../../../util/base";
import Retrieve from "../../../Retrieve.vue";
import WorkMould from "../../../mould/WorkMould.vue";
import param from "./traceabilityRecordParam.js";
import instrumentationTab from "../instrumentationTab.vue";
export default {
  name: "traceabilityRecord",
  components: { Retrieve, WorkMould, instrumentationTab },
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
      loading: false,
      tableData: [],
      replayId: undefined, //查看溯源记录的id
      deviceStatus:[],
      traceWays:[],
      instId:""

    };
  },
  mounted() {
    this.QJGetMounted();
    this.getTableList();
    this.getInitData();
  },
  methods: {
    handlePageSizeChange(size) {
      this.page = 1;
      this.rows = size;
      this.getTableList();
    },
    getTableList() {
      this.loading=true
      ajaxRequest("get", "back/instrmentationAud/retrieve",{
        page: this.page,
        rows: this.rows,
        total: 0,
        isDelete: 0,
        isTrace:0,
        sc: this.sc,
        isDepartmentReview:0,
        isFinished:0,
        status:1
      },res => {
        this.total = res.total;
        this.tableData = res.rows;
        this.loading=false
      });
    },
    handleCurrentPageChange(currentPage) {
      this.page = currentPage;
      this.getTableList();
    },
    handleWatch(info) {
      console.log(info, "info");
      this.replayId = info.id;
      this.instId = info.instId;
    },
    dateFormat(row, column, value) {
      if (value) {
        return new Date(value).Format("yyyy-MM-dd");
      }
    },
    statusFormat(row,column,value){
      if(value){
        let msg = ''
        this.deviceStatus.forEach((v,i)=>{
          if(value == v.code){
            return msg = v.remark
          }
        })
        return msg
      }
      return value
    },
    traceWayFormat(row, column, cellValue) {
      if(cellValue){
        let msg = ''
          this.traceWays.forEach((v,i)=>{
            if(cellValue == v.code){
              return msg = v.remark;
            }
          })
        return msg;
      }
    },
    getInitData(){
      ajaxProxyRequest("get", "/njmind/findParams/instrumentationStatus$instrumentationtraceWay", {}, res => {
          this.deviceStatus = res.instrumentationStatus.list;
          this.traceWays = res.instrumentationtraceWay.list;
        }
      )
    },
    handleBack(){
      this.replayId = undefined;
      this.getTableList();
    }
  }
};
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
</style>

