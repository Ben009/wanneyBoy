<template>
  <!-- 周检计划 -->
  <div>
    <div v-if="!flag">
      <div style="margin-bottom:10px;" v-if="defaultOpen">
        <Retrieve ref="retrieve-wapper"
                  :rowsCondition='rowsCondition'
                  :sortBy="sortBy"
                  :order="order"
                  :paramJson="paramJson"
                  :retrieveCondition="retrieveCondition"/>
      </div>
      <!-- 高级检索搜索框 end -->

      <!-- 个性化设置 start -->
      <div>
        <div style="text-align: center">
          <el-button type="primary" @click="QJAdvanceSearch" v-if="defaultOpen" class="el-icon-search">查询</el-button>
          <el-button type="warning" @click="QJEmptyCondition" v-if="defaultOpen" class="el-icon-info">&nbsp;清空</el-button>
        </div>
        <div style="float:left">
          <el-button type="primary" @click="flag = 'selfCheck'">创建自检计划</el-button>
          <el-button type="primary" @click="flag = 'deliveryCheck'" >创建外送计划</el-button>
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
                <global-tootips>
                    <p>1、本页面用于创建与查询设备周检的具体实施计划（区分自校、自校）；</p>
                    <p>2、无权限人员本询本部门记录，有权限人员查询所有记录；</p>
                    <p>3、有权限人员可以通过“创建自检计划”创建自检计划，“新建外送计划”创建外送计划；</p>
                    <p>4、创建外送计划后，由各部门通过设备明细节点，将需要外送的设备关联进本次计划；</p>
                    <p>5、外送计划状态关闭后，将无法再次设备；</p>
                </global-tootips>
                <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                           :handleMouldBack="QJHandleMouldBack"/>
            </span>
      </div>
      <!-- 如果是外送计划，部门、要求都是/
       如果是周检计划，状态是/
       明细界面：
       周检计划明细页面同添加页面；可导出，导出模版同计划管理（没有审核人）；
       外送计划明细界面：
       上面是基本信息，器具列表：
       序号、设备名称、型号规格、测量范围、准确度等级、出厂编号、设备编号、溯源方式、校检机构、所属部门、保管人、有效日期、加入人、加入时间（谁把设备关联到该器具的）

       有两个互斥按钮：
       1、关闭、2、打开：控制计划的打开、关联；
       导出功能；模版为：外送计划导出模版 -->
      <div style="margin-top:10px;">
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%" v-loading="laoding">
          <el-table-column key="index" type="index" label="序号" width="60"></el-table-column>
          <el-table-column label="计划名称" prop="planItem" show-overflow-tooltip></el-table-column>
          <!--<el-table-column label="要求" prop="planRequire"></el-table-column>-->
          <!--<el-table-column label="专业部门" prop="departName"></el-table-column>-->
          <el-table-column key="planTypes"label="计划类型" prop="planTypes" v-if="headObj.planTypes"></el-table-column>
          <el-table-column key="userName"label="添加人" prop="userName" v-if="headObj.userName"></el-table-column>
          <el-table-column key="addTime"label="添加时间" prop="addTime" v-if="headObj.addTime"></el-table-column>
          <el-table-column key="auditUserName"label="审核人" prop="auditUserName" v-if="headObj.auditUserName"></el-table-column>
          <el-table-column key="auditDate"label="审核时间" prop="auditDate"  v-if="headObj.auditDate"></el-table-column>
          <el-table-column key="closeState"label="状态" prop="closeState" v-if="headObj.closeState" :formatter="formatterState"></el-table-column>
          <el-table-column key="planRequire"label="备注" prop="planRequire" v-if="headObj.planRequire" ></el-table-column>
          <el-table-column key="operate"label="操作" fixed="right" width="80px">
            <template slot-scope="scope">
                <el-button type="text" @click="handleView(scope.row)" title="查看"><i class="iconClass el-icon-edit-outline"></i></el-button>
                <el-button type="text" v-mindPopover="{message:'是否删除?',placement:'left',success:handleDelete.bind(this,scope.row)}"
                           title="删除"><i class="iconClass el-icon-delete"></i></el-button>
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
    <self-check v-if="flag == 'selfCheck'" type="self" @back="handleBack" planClass="1"  planType="1" :selfCheckInfo="selfCheckInfo"></self-check>
    <delivery-check v-if="flag == 'deliveryCheck'" @back="handleBack" planClass="1" planType="2"></delivery-check>
    <planDetail v-if="flag == 'planDetail'" @show="handleBack" :rowInfo="planDetailInfo"></planDetail>
  </div>
</template>
<script>
  import $ from 'jquery'
  import {ajaxRequest, formatArrayToTree} from "../../util/base.js";
  import Retrieve from "../../Retrieve.vue";
  import WorkMould from "../../mould/WorkMould.vue";
  import param from './weeklyPlan.js'
  import selfCheck from './planManageDetail/weeklyCheck.vue'
  import deliveryCheck from './weeklyPlan/deliveryCheck.vue'
  import planDetail from "./planDetail.vue";
  export default {
    name: 'weeklyPlan',
    components: {
      Retrieve,
      WorkMould,
      selfCheck,
      deliveryCheck,
      planDetail
    },
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
        flag:undefined,//控制显示组件标志位  selfCheck 自检 deliveryCheck 外送 planDetail 外送查看

        tableData: [],//列表数据
        planDetailInfo:null,//外送计划数据
        selfCheckInfo:undefined,//查看自检数据
        laoding:false
      }
    },
    mounted() {
      this.getTableList();
      this.QJGetMounted();
    },
    methods: {
      handlePageSizeChange(size) {
        this.page = 1
        this.rows = size
        this.getTableList();
      },
      getTableList() {
        this.laoding=true
        ajaxRequest("get", "back/instraumentationTra/findByTra", {
            planClass:1,
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
              console.log(res,'res')
              this.tableData = res.rows;
              this.total = res.total;
            }
            this.laoding=false
          }
        );
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      // 处理返回
      handleBack(){
        this.flag = undefined ;
        this.getTableList();
      },
      // 查看详情
      handleView(info){
          this.planDetailInfo = info;
          this.flag = 'planDetail'
      },
      //计划状态
      formatterState(row, column, cellValue){
        if(cellValue==0){
          return '关闭'
        }else if(cellValue==1){
          return '正常'
        }else {
          return cellValue
        }
      },
      handleDelete(info){
        ajaxRequest("put", "back/instraumentationTra/", {id:info.id,isDelete:1},res => {
          if(res.code===200){
            this.$message.success("刪除成功");
            this.getTableList();
          }
          }
        );
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

