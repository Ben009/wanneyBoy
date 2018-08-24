<template>
  <!-- 计划管理 -->
  <div>
    <div v-if="!weeklyFlag && !inspectFlag">
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
          <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
          <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
        </div>
        <div style="float:left">
          <el-button type="primary" @click="weeklyFlag = true" v-has="'M25720'">创建周检计划</el-button>
          <el-button type="primary" @click="inspectFlag = true" v-has="'M25725'">创建核查计划</el-button>
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
                    <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
                    <global-tootips>
                        <p>1、本页面用于创建与查询设备周检计划与期间核查计划；</p>
                        <p>2、无权限人员本询本部门记录，有权限人员查询所有记录；</p>
                        <p>3、有权限人员可以通过“新建周检计划”创建周检计划，“新建核查计划”创建期间核查计划；</p>
                    </global-tootips>
                    <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                               :handleMouldBack="QJHandleMouldBack"/>
                </span>
      </div>
      <div style="margin-top:10px;">
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%" v-loading="loading">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column label="计划名称" prop="planItem"  show-overflow-tooltip></el-table-column>
          <el-table-column label="备注" prop="planRequire"></el-table-column>
          <el-table-column label="专业部门" prop="departName"></el-table-column>
          <el-table-column label="计划类型" prop="planClass" :formatter="planClassFormatter"></el-table-column>
          <el-table-column label="添加人" prop="userName"></el-table-column>
          <el-table-column label="添加时间" prop="addTime"></el-table-column>
          <el-table-column label="审核人" prop="auditUserName"></el-table-column>
          <el-table-column label="审核时间" prop="auditDate"></el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <el-button @click="handleView(scope.row)" type="text" title="查看" class="iconClass"><i class="el-icon-edit-outline"></i></el-button>
              <el-button v-mindPopover="{message:'是否删除?',placement:'left',success:handleDelete.bind(this,scope.row)}"
                         type="text" title="删除" class="iconClass"><i class="el-icon-delete"></i></el-button>
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

    <weekly-check v-if="weeklyFlag" @back="back" type="week" :planClass="0" :planType="1" :weekly-check-id="detailId"></weekly-check>
    <inspect-check v-if="inspectFlag" @back="back" :planClass="3" :planType="3" :inspect-check-id="detailId"></inspect-check>
  </div>
</template>
<script>
  import {ajaxRequest, ajaxSyncRequest} from '../../util/base'
  import Retrieve from "../../Retrieve.vue";
  import WorkMould from "../../mould/WorkMould.vue";
  import param from './planManage.js'
  import weeklyCheck from './planManageDetail/weeklyCheck.vue'
  import inspectCheck from './planManageDetail/inspectCheck.vue'

  export default {
    name: 'planManage',
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

        weeklyFlag: false,//周检计划标志位
        inspectFlag: false,//核查计划标志位
        tableData: [],//表格数据
        detailId:undefined,//查看详情时传入的id
        loading:false,
      }
    },
    components: {
      weeklyCheck,
      inspectCheck,
      Retrieve,
      WorkMould,
    },
    mounted() {
      this.getTableList();
      this.QJGetMounted();
    },
    methods: {
      //0：年度计划 1:实施计划 3核查计划
      planClassFormatter(row, column, cellValue){
        if(cellValue==0){
          return '周检计划'
        }else if(cellValue==3){
          return  '核查计划'
        }
      }
      ,
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size
        this.getTableList()
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage
        this.getTableList()
      },

      //查询
      getTableList() {
        this.loading=true
        ajaxRequest("get", "back/instraumentationTra/findByTra", {
            planClass:0,
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
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
      // 组件返回
      back(){
        this.inspectFlag = false;
        this.weeklyFlag = false;
        this.detailId = undefined;
        this.getTableList();
      },
      // weeklyCheckBack() {
      //   this.weeklyFlag = false;
      //   this.detailId = undefined;
      //   this.getTableList();
      // },
      // inspectCheckBack() {
      //   this.detailId = undefined;
      //   this.getTableList();
      // },
      handleView(info){
        // 需要周检与核查的标志位，之后传入id进入组件，在组件内进行查找
        let flag = info.planItem.substr(0,4);
        if(flag == '周检计划'){
          console.log(info.planItem.indexOf('周检计划'))
          this.detailId = info.id
          this.weeklyFlag = true;
        }else if(flag == '核查计划'){
          console.log(info.planItem.indexOf('核查计划'))
          this.detailId = info.id
          this.inspectFlag = true;
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
    },
  }
</script>
<style scoped>
  .tootip {
    float: right;
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

