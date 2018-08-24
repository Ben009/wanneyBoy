<!-- 合同查询 -->
<template>
  <div style="position:relative;">
    <div style="margin-bottom:10px;" v-if="defaultOpen">
      <Retrieve ref="retrieve-wapper"
                :rowsCondition='rowsCondition'
                :sortBy="sortBy"
                :order="order"
                :paramJson="paramJson"
                :retrieveCondition="retrieveCondition"
                :collectionInfo="collectionInfo"
                :needSort=false
                logic="or"
      />

       <div style="display: block;text-align: center;padding-bottom: 20px" v-has="'M7120'" v-if="defaultOpen">
        <span style="font-size: 14px;margin-left: 15px">业务组：</span>
        <el-select placeholder="请选择"
                   value-key="name"
                   @change="businessEvt"
                   v-model="businessGroup"
                   style="width: 10%"
                   size="mini"

        >
          <el-option
            v-for="item in businessGroups"
            :key="item.businessGroup"
            :label="item.businessGroupName"
            :value="item.businessGroup+''">
          </el-option>
        </el-select>

        <span style="font-size: 14px;margin-left: 15px">业务员：</span>
        <el-select placeholder="请选择"
                   value-key="name"
                   v-model="businessStaff"
                   style="width: 10%"
                   size="mini"
        >
          <el-option
            v-for="item in businessStaffs"
            :key="item.staff"
            :label="item.staffName"
            :value="item.staff+''"
          >
          </el-option>
        </el-select>

        <span style="font-size: 14px;margin-left: 15px">业务负责人：</span>
        <el-select class="bigwidth"
                   placeholder="请选择"
                   value-key="name"
                   v-model="charge"
                   style="width: 10%"
                   size="mini"

        >
          <el-option
            v-for="item in charges"
            :key="item.id"
            :label="item.userName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>

    <div style="display: flex;justify-content: space-between;padding-top:20px;padding-bottom:10px">
      <el-checkbox v-model="searchAll" v-if="defaultOpen">查询所有</el-checkbox>
      <div style="display: inline-block;text-align: center" >
        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询</el-button>
        <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning" v-if="defaultOpen">&nbsp;清空</el-button>
        <el-button type="warning" class="el-icon-warning" v-if="defaultOpen" v-has="'M37120'">&nbsp;导出</el-button>
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
            <global-tootips style="float: right;margin-top: 5px">
                <p>1、无权限只能查询业务员或业务组负责人、报价单负责人；</p>
                <p>2、默认情况仅可以查询3个月的记录，超过3个月的请勾中查询所有记录；</p>
                <p>3、单位红，该合同未审核。 </p>
                <p>4、报价单颜色正常，该报价单未包含器具或计划已转。红色：计划未转，蓝色：转入部分计划； </p>
            </global-tootips>
          </span>
    </div>

    <br>

    <div>
      <el-table :max-height="QJTableMaxHeight"
        :data="tableData"
        border
        style="width: 100%"
        :max-row="true"
        @selection-change="handleSelectionChange"
        v-loading="loading">

        <el-table-column
          label="序号"
          type="index"
          width="60">
        </el-table-column>

        <el-table-column
          prop="companyName"
          label="委托单位"
          :render-header="QJrenderHeader"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.auditFlag==0" style="color: red">{{scope.row.companyName}}</span>
            <span v-else>{{scope.row.companyName}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="contractNo"
          label="合同编号"
          :render-header="QJrenderHeader"
        >
        </el-table-column>

        <el-table-column
          prop="quotationNo"
          label="报价单编号"
          :render-header="QJrenderHeader"

          v-if="headObj.quotationNo"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.planState==0">{{scope.row.quotationNo}}</span>
            <span v-else-if="scope.row.planState==1" style="color:blue">{{scope.row.quotationNo}}</span>
            <span v-else-if="scope.row.planState==2" style="color:red">{{scope.row.quotationNo}}</span>
            <span v-else>{{scope.row.quotationNo}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="addTime"
          label="合同日期"
          :render-header="QJrenderHeader"
          :formatter="formatterDate"

          v-if="headObj.addTime"
        >
        </el-table-column>

        <el-table-column
          prop="totalCost"
          label="合同金额"
          :render-header="QJrenderHeader"

          v-if="headObj.totalCost"
        >
        </el-table-column>

        <el-table-column
          prop="contractType"
          label="合同类别"
          :render-header="QJrenderHeader"
          :formatter="formatteContractType"

          v-if="headObj.contractType"         >
        </el-table-column>

        <el-table-column
          prop="businessStaffName"
          label="业务员"
          :render-header="QJrenderHeader"

          v-if="headObj.businessStaffName"
        >
        </el-table-column>

        <el-table-column
          prop="auditFlag"
          label="是否审核"
          :formatter="formatterAuditFlag"
          :render-header="QJrenderHeader"
          v-if="headObj.auditFlag"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          fixed="right"
          min-width="200">
          <template slot-scope="scope" v-if="scope.row.companyName!='合计'">
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
              <i class="el-icon-edit-outline" title="编辑"></i></el-button>
            <el-button v-has="'M37125'"
                       v-mindPopover="{message:'是否删除?',placement:'left',success:handleDelete.bind(this,scope.row)}"
                       type="text" style="padding:0;font-size:18px;">
              <i class="el-icon-delete" title="删除"></i>
            </el-button>
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

</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import {ajaxRequest, ajaxSyncRequest} from '../../util/base'
  import Retrieve from '../../Retrieve'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import paramJson from './paramQuotation'
  export default {
    name: 'ContractList',
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 'c.id',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,
        isSetting: 0,
        edit: null,

        searchAll: false,
        businessGroups: [], // 业务组
        businessStaffs: [], // 业务员
        businessGroup: null,
        businessStaff: null,
        charges: [], // 负责人
        charge: null, // 负责人

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
        collectionInfo: [],
        loading:false,
      }
    },
    methods: {
      // 获取业务组
      getBusinessGroups() {
        ajaxRequest('get', 'back/businessStaff/getBusinessGroupName', {}, (res) => {
          this.businessGroups = res
        })
      },
      // 根据业务组ID查询业务员
      businessEvt(businessGroupId) {
        if (businessGroupId) {
          ajaxSyncRequest('get', 'back/businessStaff/StaffByBusinessGroupId?businessGroup=' + businessGroupId, {}, (res) => {
            this.businessStaffs = res
            Vue.set(this, 'businessStaff', '')
          })
        }
      },
      //获取负责人
      listUserByBD() {
        ajaxRequest('get', 'back/user/listUserByCharge', {}, (res) => {
          this.charges = res.rows
        })
      },
      formatteContractType: function (row, column) {
        if (row.contractType == 0) {
          return '普通合同';
        } else if (row.contractType == 1) {
          return '年度合同';
        }
      },
      formatterDate: function (row, column, cellValue) {
        if(cellValue){
          return new Date(cellValue).format('YYYY-MM-DD')
        }else{
          return '';
        }
      },
      formatterAuditFlag:function(row,column){
        if(row.auditFlag==1){
          return '是'
        }else if(row.auditFlag==0){
          return '否'
        }else{
          return '';
        }
      },
      getTableList() {
        this.loading=true
        ajaxRequest('get', 'back/contract/retrieve', {
          fuzzySearch: 1,
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total: 0,
          sc: this.sc,
          searchAll: this.searchAll,
          charge: this.charge,
          businessGroup: this.businessGroup,
          businessStaff: this.businessStaff,
          sum:true
        }, (res) => {
          if (res.code === 200) {
            this.tableData = res.rows
            this.total = res.total
            this.multipleSelection = []
          }
          this.loading=false
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size
        this.getTableList()
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage
        this.getTableList()
      },
      handleEdit(rowInfo) {
        this.$router.push({
          path: '/admin/373',
          query: {
            id: rowInfo.id,
            quotationId: rowInfo.quotationId,
            type: 2
          }
        })
      },
      //删除
      handleDelete(data) {
        ajaxRequest('post', 'back/contract/', {'_method': 'delete', id: data.id}, (res) => {
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.getTableList();
          }else if(res.code == 300){
            this.$message.error(res.msg);
          }
        })
      },
      QJEmptyCondition() {
        /*清空查询项*/
        this.$refs["retrieve-wapper"].search.conditions = [
          {
            nameCode: null,
            sqlSeg: null,
            comparison: null,
            value: null
          }
        ];
        this.charge = null;
        this.businessGroup = null;
        this.businessStaffs = null;
        this.businessStaff = null;
      },
    },
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
    },
    mounted() {
      this.getTableList();
      this.QJGetMounted();
      this.getBusinessGroups();
      this.listUserByBD();
    }
  }
</script>

<style scoped>
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
</style>
