<template>
    <div>
        <div v-if="!detailInfo">
            <div>
                <!-- 高级查询 -->
                <div>
                    <Retrieve ref="retrieve-wapper"
                            v-if="defaultOpen"
                            :rowsCondition='rowsCondition'
                            :sortBy="sortBy"
                            :order="order"
                            :paramJson="paramJson"
                            :retrieveCondition="retrieveCondition"
                            :collectionInfo="collectionInfo"/>
                </div>

                <div>
                    <div style="text-align: center;" v-if="defaultOpen">
                        <el-button type="primary" @click="QJAdvanceSearch"  class="el-icon-search">查询</el-button>
                        <el-button type="warning" @click="QJEmptyCondition"  class="el-icon-warning">&nbsp;清空</el-button>
                    </div>
                    <div style="float: right">
                    <el-select size="mini" v-if="resultCondition.length" v-model="templateValue" placeholder="请选择"
                                @change="QJHandleSelectTemplate">
                        <el-option
                                v-for="item in moduleList"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size="mini" @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
                    <!-- <global-tootips>
                    </global-tootips> -->
                    <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                                :handleMouldBack="QJHandleMouldBack"/>
                </div>
                </div>
            </div>
            <div>
                <!-- tab数据 -->
                <el-table :data="tableData"
                        :max-height="QJTableMaxHeight"
                        border
                        style="width: 100%;"
                        v-loading="loading">
                    <el-table-column key="index"  type="index"  width="55" label="序号"></el-table-column>
                    <el-table-column key="instrumentationName"  label="设备名称" prop="instrumentationName" v-if="headObj.instrumentationName" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                    <el-table-column key="model" label="型号规格" prop="model" :formatter="htmlFormat"  v-if="headObj.model"  show-overflow-tooltip   :render-header="QJrenderHeader" ></el-table-column>
                    <el-table-column key="mearsuringRange" label="测量范围" prop="mearsuringRange" :formatter="htmlFormat"  v-if="headObj.mearsuringRange" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                    <el-table-column key="manufacturingCode" label="出厂编号" prop="manufacturingCode"  v-if="headObj.manufacturingCode"  show-overflow-tooltip  :render-header="QJrenderHeader" > </el-table-column>
                    <el-table-column key="deviceNumber" label="设备编号" prop="deviceNumber"  v-if="headObj.deviceNumber"  show-overflow-tooltip  :render-header="QJrenderHeader" ></el-table-column>
                    <el-table-column key="departName" label="所属部门" prop="departName" v-if="headObj.departName" show-overflow-tooltip  :render-header="QJrenderHeader" ></el-table-column>
                    <el-table-column key="status" label="设备状态" prop="status" v-if="headObj.status" :formatter="statusFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                    <el-table-column key="traceWay" label="溯源方式" prop="traceWay" v-if="headObj.traceWay" :formatter="traceWayFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                    <el-table-column key="keeperName" label="保管人" prop="keeperName" v-if="headObj.keeperName"  show-overflow-tooltip   :render-header="QJrenderHeader" > </el-table-column>
                    <el-table-column key="isCheck" label="是否考核" prop="isCheck" :formatter="(row,column,value)=>{return parseInt(value)?'是':'否'}" v-if="headObj.isCheck"  show-overflow-tooltip   :render-header="QJrenderHeader" > </el-table-column>
                    <el-table-column key="manufacturer" label="制造厂商" prop="manufacturer" v-if="headObj.manufacturer"  show-overflow-tooltip   :render-header="QJrenderHeader" > </el-table-column>
                    <el-table-column key="conclusion" label="结论" prop="conclusion" v-if="headObj.conclusion"  show-overflow-tooltip   :render-header="QJrenderHeader" > </el-table-column>
                    <el-table-column key="userName" label="考核人" prop="userName" v-if="headObj.userName"  show-overflow-tooltip   :render-header="QJrenderHeader" > </el-table-column>
                    <el-table-column key="checkDate" label="考核日期" prop="checkDate" :formatter="dateFormat" v-if="headObj.checkDate"  show-overflow-tooltip   :render-header="QJrenderHeader" > </el-table-column>
                    <el-table-column key="checkCycle" label="考核周期(月)" prop="checkCycle" v-if="headObj.checkCycle"  show-overflow-tooltip   :render-header="QJrenderHeader" > </el-table-column>
                    <el-table-column key="estimatedTime" label="预计下次考核日期" prop="estimatedTime" :formatter="dateFormat" v-if="headObj.estimatedTime"  show-overflow-tooltip   :render-header="QJrenderHeader" > </el-table-column>
                    <el-table-column key="remark" label="备注" prop="remark" v-if="headObj.remark"  show-overflow-tooltip   :render-header="QJrenderHeader" > </el-table-column>
                    <el-table-column label="操作" width="60px">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleWatch(scope.row)"><i class="el-icon-view iconClass" title="查看" ></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
        </div>
        <instrumentation-tab v-if="detailInfo" type="repeatabilityRecordTab" :standard-id="detailInfo" @goBack="back"></instrumentation-tab>
    </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import { ajaxRequest,ajaxProxyRequest } from "../../../util/base";
import param from "./repeatabilityRecordTabParam.js";
import instrumentationTab from '../instrumentationTab.vue'
import Retrieve from "../../../Retrieve.vue";
import WorkMould from "../../../mould/WorkMould.vue";
import queryTableFormat from './htmlFormat.vue'
export default {
  name: "repeatabilityRecordTab",
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
      collectionInfo:[],

      /************************************* 高级检索字段 end *************************************/
      page: 1,
      rows: 10,
      total: 0,

      tableData: [],
      loading: false, //加载数据时显示的符号 在getTableList中添加标志位
      detailInfo:null,//详情数据
      deviceStatus:[],
      examineWay:[],
      traceWays:[]
    };
  },
  components:{
      instrumentationTab,
      queryTableFormat,
      Retrieve,
      WorkMould,
  },
  mounted() {
    // 获取table数据
    this.getInitData();
    this.getTableList();
    this.QJGetMounted();
  },
  methods: {
    getInitData(){
      ajaxProxyRequest("get", "/njmind/findParams/instrumentationtraceWay$instrumentationStatus$examineWay", {}, res => {
          this.traceWays = res.instrumentationtraceWay.list;
          this.deviceStatus = res.instrumentationStatus.list;
          this.examineWay = res.examineWay.list;
        }
      )
    },
    handlePageSizeChange(size) {
      this.page = 1; //Math.floor(this.page * this.rows / size);
      this.rows = size;
      this.getTableList();
    },
    handleCurrentPageChange(currentPage) {
      this.page = currentPage;
      this.getTableList();
    },
    getTableList(){
      ajaxRequest('get', 'back/instrumentationRepeat/retrieve', {
        page: this.page,
        rows: this.rows,
        orderProperty: this.orderProperty,
        orderType: this.orderType,
        total: 0,
        sc: this.sc,
      }, (res) => {
        if (res.code === 200) {
          this.tableData = res.rows
          this.total = res.total
        }
        this.loading=false
      })
    },
    /**表格数据格式化 */
    dateFormat(row,column,cellValue){
        if(cellValue){
            return new Date(cellValue).format('YYYY-MM-DD');
        }
    },
    htmlFormat(row,column,cellValue){
      return (<query-table-format html-content={cellValue?cellValue:undefined}></query-table-format>)
    },
    // 设备状态格式化-
    statusFormat(row, column, cellValue) {
      if(cellValue){
        let msg = ''
        this.deviceStatus.forEach((v,i)=>{
          if(cellValue == v.code){
            return msg = v.remark
          }
        })
        return msg
      }
    return cellValue
    },
    //溯源方式格式化
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
    return cellValue ;
    },
    /** */
    handleWatch(info){
      this.detailInfo = parseInt(info.instId)
    },
    back(){
        this.detailInfo = undefined;
        this.getTableList();
    }
  }
};
</script>
<style scoped>
.iconClass{
  padding:0;
  font-size:18px;
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

