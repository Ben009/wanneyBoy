<!--
  异常报价（现场任务、配号退回记录）
 -->
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
    </div>

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

    <div style="display: flex;justify-content: space-between;">
      <el-checkbox v-model="searchAll" v-if="defaultOpen">查询所有</el-checkbox>
      <div style="display: inline-block;text-align: center">
        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询</el-button>
        <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning" v-if="defaultOpen">&nbsp;清空</el-button>
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
                <p>3、报价单号红色，表示该报价单异常未查看。 </p>
                <p>4、黄色的器具为异常退回的器具。 </p>
            </global-tootips>
          </span>
    </div>


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
          prop="quotationNo"
          label="报价单编号"
          :render-header="QJrenderHeader"
          v-if="headObj.quotationNo"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isBackSee==0" style="color: red">{{scope.row.quotationNo}}</span>
            <span v-else>{{scope.row.quotationNo}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="companyName"
          label="委托单位"
          :render-header="QJrenderHeader"
          width="200"
          show-overflow-tooltip
          v-if="headObj.companyName"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.auditFlag==0 && scope.row.companyName"
                  style="color: red">({{scope.row.companyType}}){{scope.row.companyName}}</span>
            <span v-else><span style="color: red;" v-if="scope.row.companyName">({{scope.row.companyType}})</span>{{scope.row.companyName}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="businessArea"
          label="业务组"
          :render-header="QJrenderHeader"
          v-if="headObj.businessArea"
        >
        </el-table-column>

        <el-table-column
          prop="businessStaffName"
          label="业务员"
          :render-header="QJrenderHeader"
          v-if="headObj.businessStaffName"
        >
        </el-table-column>

        <el-table-column
          prop="chargeName"
          label="业务负责人"
          :render-header="QJrenderHeader"
          v-if="headObj.chargeName"
        >
        </el-table-column>

        <el-table-column
          prop="secondChargeName"
          label="第二负责人"
          :render-header="QJrenderHeader"
          v-if="headObj.secondChargeName"
        >
        </el-table-column>

        <el-table-column
          prop="taxNo"
          label="税号"
          :render-header="QJrenderHeader"
          v-if="headObj.taxNo"
        >
        </el-table-column>

        <el-table-column
          prop="afterDiscountsTotal"
          label="报价金额"
          :render-header="QJrenderHeader"
          v-if="headObj.afterDiscountsTotal"
        >
        </el-table-column>

        <el-table-column
          prop="auditDate"
          label="审核时间"
          :render-header="QJrenderHeader"
          :formatter="formatterDate"
          v-if="headObj.auditDate"
        >
        </el-table-column>

        <el-table-column
          prop="contractNo"
          label="合同编号 "
          :render-header="QJrenderHeader"
          v-if="headObj.contractNo"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          fixed="right"
          width="80px">
          <template slot-scope="scope" v-if="scope.row.quotationNo!='合计'">
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-edit-outline" title="编辑"></i></el-button>
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
    <quotationForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></quotationForm>
  </div>

</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import {ajaxRequest,ajaxSyncRequest} from '../../util/base'
  import Retrieve from '../../Retrieve'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import quotationForm from './quotationForm'
  import paramJson from './paramBack'
  export default {
    name: 'parameter-table',
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 'q.id',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,
        isSetting: 0,
        defaultOpen: true,
        edit: null,
        searchAll: false,
        businessGroups: [], // 业务组
        businessStaffs: [], // 业务员
        businessGroup:null,
        businessStaff:null,
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
      formatterDate: function (row, column, cellValue) {
        if(cellValue){
          return new Date(cellValue).format('YYYY-MM-DD')
        }else{
          return '';
        }
      },
      getTableList() {
        this.loading=true
        ajaxRequest('get', 'back/quotation/quotationBackList', {
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
          businessStaff: this.businessStaff
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
        this.setBackSee(rowInfo.id);
        this.$router.push({
          path: '/admin/252',
          query: {
            id: rowInfo.id,
            isBack:1
          }
        })
      },
      handleEditCallback(rowInfo) {
        let _this = this
        if (rowInfo) {
          if (rowInfo.id) {
            ajaxRequest('put', 'back/quotation/', {
              id: rowInfo.id,
              category: rowInfo.category,
              name: rowInfo.name,
              value: rowInfo.value,
              memo: rowInfo.memo
            }, function (res) {
              if (res.code === 200) {
                _this.$message.success('编辑成功')
                _this.edit = null
                let roleList = _this.tableData
                for (let i = 0, len = roleList.length; i < len; i++) {
                  if (roleList[i].id === rowInfo.id) {
                    _this.tableData.splice(i, 1, rowInfo)
                    break
                  }
                }
              } else {
                _this.$message.error('编辑失败')
              }
            })
          } else {
            ajaxRequest('post', 'back/quotation/', {
              category: rowInfo.category,
              name: rowInfo.name,
              value: rowInfo.value,
              memo: rowInfo.memo
            }, function (res) {
              if (res.code === 200) {
                _this.$message.success('新增成功')
                _this.edit = null
                _this.getTableList()
              } else {
                _this.$message.error('新增失败')
              }
            })
          }
        } else {
          this.edit = null
        }
      },
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
      listUserByBD () {
        ajaxRequest('get', 'back/user/listUserByCharge', {}, (res) => {
          this.charges = res.rows
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
        this.businessStaff = null;
      },
      //设置异常报价单查看标记
      setBackSee(id){
        ajaxRequest('post', 'back/quotation/setBackIsSee', {quotationId:id}, (res) => {

        })
      }
    },
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      quotationForm
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


</style>
