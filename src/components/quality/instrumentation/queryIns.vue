<template>
<div class="MStandardList">
    <div v-if="!edit">
    <div >
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
              <global-tootips>
                  <p>1、有权限人员查询所有，无权限人员查询本部门设备；</p>
                  <p>2、设备名称红，该仪器设备被证书模板,记录模板引用；</p>
                  <p>3、所属部门红，三个月之内该设备下过自检计划;</p>
                  <p>4、设备编号红，计量标准已绑定该器具;</p>
                  <p>5、有效日期红，此标准器有效期过期。</p>
              </global-tootips>
              <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                        :handleMouldBack="QJHandleMouldBack"/>
          </div>
        </div>
        <!-- 表格 start -->
        <div>
            <el-table :max-height="QJTableMaxHeight"
                      :data="tableData"
                      border
                      style="width: 100%;"
                      v-loading="loading">
                <el-table-column key="index"  type="index"  width="55" label="序号"></el-table-column>
                <el-table-column key="instrumentationName" prop="instrumentationName" v-if="headObj.instrumentationName" show-overflow-tooltip :render-header="QJrenderHeader" label="设备名称">
                    <template slot-scope="instrumentationName">
                        <!-- quoted 被证书模板,记录模板引用 标志位 -->
                        <span :class="{'color':instrumentationName.row.zsMbCount>0}">{{instrumentationName.row.instrumentationName}}</span>
                    </template>
                </el-table-column>
                <el-table-column key="deviceNumber" label="设备编号" prop="deviceNumber"  v-if="headObj.deviceNumber"  show-overflow-tooltip  :render-header="QJrenderHeader" >
                        <template slot-scope="device">
                            <!-- binded 计量标准已绑定该器具  标志位 -->
                             <span :class="{'color':device.row.zptCount>0}">{{device.row.deviceNumber}}</span>
                        </template>
                </el-table-column>

                <el-table-column key="manufacturingCode" label="出厂编号" prop="manufacturingCode"  v-if="headObj.manufacturingCode"  show-overflow-tooltip  :render-header="QJrenderHeader" > </el-table-column>
                <el-table-column key="departName" label="所属部门" prop="departName" v-if="headObj.departName" show-overflow-tooltip  :render-header="QJrenderHeader" >
                        <template slot-scope="depart">
                            <!--slefCheckPlan 三个月之内该设备下过自检计划 标志位 -->
                             <span :class="{'color':depart.row.slefCheckPlan>0}">{{depart.row.departName}}</span>
                        </template>
                </el-table-column>
                <el-table-column key="model" label="型号规格" prop="model" :formatter="htmlFormat"  v-if="headObj.model"  show-overflow-tooltip   :render-header="QJrenderHeader" ></el-table-column>
                <el-table-column key="keeperName" label="保管人" prop="keeperName" v-if="headObj.keeperName"  show-overflow-tooltip   :render-header="QJrenderHeader" > </el-table-column>
                <el-table-column key="calibrationDate" label="实际检校日期" prop="calibrationDate" v-if="headObj.calibrationDate" show-overflow-tooltip :formatter="dateFormat" :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="scheduleDate" label="计划检校日期" prop="scheduleDate" v-if="headObj.scheduleDate"  show-overflow-tooltip :formatter="dateFormat" :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="mearsuringRange" label="测量范围" prop="mearsuringRange" :formatter="htmlFormat"  v-if="headObj.mearsuringRange" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="manufacturer" label="制造厂家" prop="manufacturer" v-if="headObj.manufacturer" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="servicesCondition" label="使用条件" prop="servicesCondition" v-if="headObj.servicesCondition" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="accuracyClass" label="准确度等级" prop="accuracyClass" :formatter="htmlFormat" v-if="headObj.accuracyClass" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="accuracyClassE" label="准确度等级(英)" prop="accuracyClassE" :formatter="htmlFormat"  v-if="headObj.accuracyClassE" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="supplier" label="购入单位" prop="supplier" v-if="headObj.supplier" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="unit" label="单位" prop="unit" v-if="headObj.unit" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="purchaseDate" label="购入日期" prop="purchaseDate" v-if="headObj.purchaseDate" :formatter="dateFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="quantity" label="数量" prop="quantity" v-if="headObj.quantity" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="money" label="金额" prop="money" v-if="headObj.money" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="invoice" label="发票号" prop="invoice" v-if="headObj.invoice" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="location" label="存放地点" prop="location" v-if="headObj.location" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="propertyUnit" label="产权单位" prop="propertyUnit" v-if="headObj.propertyUnit" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="operator" label="经办人" prop="operator" v-if="headObj.operator" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="accepter" label="验收人" prop="accepter" v-if="headObj.accepter" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="type" label="设备类别" prop="type" v-if="headObj.type" :formatter="typeFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="modelType" label="设备类型" prop="modelType" v-if="headObj.modelType" :formatter="modelTypeFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="status" label="设备状态" prop="status" v-if="headObj.status" :formatter="statusFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="isAssets" label="是否固定资产" prop="isAssets" v-if="headObj.isAssets" :formatter="isFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="assetsNo" label="资产编号" prop="assetsNo" v-if="headObj.assetsNo" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="confirmedWay" label="确认方式" prop="confirmedWay" v-if="headObj.confirmedWay" :formatter="wayFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="isCapacityConfirme" label="设备能力确认" prop="isCapacityConfirme" v-if="headObj.isCapacityConfirme" :formatter="isFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="isSubjectMatter" label="是否标物/标样" prop="isSubjectMatter" v-if="headObj.isSubjectMatter":formatter="isFormat"  show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="itemNo" label="所属认可项目号" prop="itemNo" v-if="headObj.itemNo" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="itemName" label="所属认可项目名称" prop="itemName" v-if="headObj.itemName" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="traceWay" label="溯源方式" prop="traceWay" v-if="headObj.traceWay" :formatter="traceWayFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="isAuthorization" label="是否授权使用" prop="isAuthorization" v-if="headObj.isAuthorization" :formatter="isFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="instructionsNo" label="仪器说明书编号" prop="instructionsNo" v-if="headObj.instructionsNo" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="maintenanceItem" label="维护项目" prop="maintenanceItem" v-if="headObj.maintenanceItem" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="maintenanceCycle" label="维护周期(月)" prop="maintenanceCycle" v-if="headObj.maintenanceCycle" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="isMonitorUse" label="是否监控使用记录" prop="isMonitorUse" v-if="headObj.isMonitorUse" :formatter="isFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="controlMeasures" label="控制措施" prop="controlMeasures" v-if="headObj.controlMeasures" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="effectiveDate" label="证书有效期" prop="effectiveDate" v-if="headObj.effectiveDate" :formatter="dateFormat" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="bz" label="备注" prop="bz" v-if="headObj.bz" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
                <el-table-column key="operate"    label="操作" width="120px" fixed="right">
                    <template slot-scope="scope">
                        <div :id="'id'+scope.row.id"></div>
                        <el-button @click="handleEdit(scope.row)" type="text" class="iconClass">
                            <i class="el-icon-edit-outline" title="详情"></i>
                        </el-button>
                        <el-button v-mindPopover="{message:'确认删除？',success:handleDelete.bind(this,scope.row)}" type="text" class="iconClass">
                            <i class="el-icon-delete" title="删除"></i>
                        </el-button>
                        <el-button type="text" class="iconClass"
                        v-mindPopover="{message:`<div>选择打印的标签类型</div><div style='margin-top:10px'><el-radio v-model='flag1' :label='false'>一维码</el-radio><el-radio v-model='flag1' style='margin-left:10px' :label='true'>二维码</el-radio></div>`,success:printLabel.bind(this,scope.row)}">
                          <i class="el-icon-printer" title="标签打印"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 表格 end -->
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
    <instrumentation-tab v-if="edit" :standardId="edit" @goBack="back" type="search"></instrumentation-tab>
</div>
</template>

<script>
import Vue from "vue";
import Vuex from "vuex";
import $ from "jquery";
import { ajaxRequest, ajaxProxyRequest } from "../../util/base.js";
import Retrieve from "../../Retrieve.vue";
import WorkMould from "../../mould/WorkMould.vue";
import TableColumnHeader from "../../Table/TableColumnHeader.vue";
import paramJson from "./queryIns.js"; //同目录下json数据
import instrumentationTab from "./instrumentationTab.vue";
import VueBarcode from 'vue-barcode';
import formatTable from './format.js'
/* import { Table, TableColumn,} from "element--ui";
    Vue.use(Table);
    Vue.use(TableColumn); */

export default {
  name: "MStandardList",
  components: {
    Retrieve,
    WorkMould,
    TableColumnHeader,
    instrumentationTab,
  },
  mixins:[formatTable],
  data() {
    return {
      page: 1,
      rows: 10,
      total: 0,
      searchKey: "",
      orderProperty: "i.id",
      orderType: "desc",
      tableData: [],
      departlist: [],
      keeperlist: [],
      fuzzySearch: 0,
      isPut: true,

      isSetting: 0, //控制个性化设置弹窗是否展示
      edit: null, //控制编辑弹窗是否展示
      isInner: 0,
      flag1:undefined,//标签打印的类型

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
      retrieveCondition: [],
      collectionInfo: [],

      edit: undefined ,//详情显示
      loading:false,
    };
  },
  methods: {
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
       this.loading=true
        ajaxRequest( "get",  "back/instrumentation/retrieve", {
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
            this.loading=false
          }
        );
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
    handleDelete(rowInfo) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        type: "warning"
      }).then(res => {
        ajaxRequest(
          "put",
          "back/instrumentation/",
          { id: rowInfo.id, isDelete: 1 },
          res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getTableList();
            } else {
              this.$message.success("删除失败");
            }
          }
        );
      });
    },
    handleEdit(rowInfo) {
      this.edit = rowInfo.id;
    },
    // 查看详细内容后的返回
    back() {
      this.edit = undefined;
      this.getTableList();
    },
    // 标签打印
    /**
     * @param {Object} info 待打印信息
     */
    printLabel(info){
      console.log(this.flag1,'打印flag')
      let barcodeStr = '';
      let MyComponent = Vue.extend({
        template: `<div><vue-barcode style="display:none" id="id${info.id}" value="${info.id}" :displayValue="false" tag="canvas"></vue-barcode><div style:text-align:center>设备编号：${info.deviceNumber}</div></div>`,
        components:{VueBarcode},
      })
      // selector
      new MyComponent().$mount('#id'+info.id)
      barcodeStr = document.getElementById('id'+info.id).innerHTML;
      // sessionStorage.setItem('appliancePrintHtml', barcodeStr)
      document.body.innerHTML = barcodeStr
      window.print()
      // 重新加载页面，以刷新数据
      window.location.reload()
    },
  },
  mounted() {
    //判断是否从首页跳转进来,并设置默认查询条件
    let objFromIndex = this.$route.query;
    if (objFromIndex && objFromIndex.title) {
      let now = new Date();
      now.setDate(now.getDate() + 30);
      this.collectionInfo = [
        {
          name: "",
          value: [
            {
              comparison: "3",
              nameCode: "effectiveDate",
              sqlSeg: "trunc(i.EFFECTIVE_DATE)",
              value: now.format("YYYY-MM-DD")
            }
          ]
        }
      ];
      setTimeout(res => {
        this.QJAdvanceSearch();
      }, 0);
    } else {
      this.getTableList();
      this.QJGetMounted();
    }
  }
};
</script>

<style scoped lang="scss">
.color {
  color: #cb1b45;
}
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

