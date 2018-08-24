<!-- 报价单查询列表 -->
<template>
  <div style="position:relative;">
    <div style="margin-bottom:10px;" v-if="defaultOpen">
      <Retrieve ref="retrieve-wapper"
                logic="or"
                :rowsCondition='rowsCondition'
                :sortBy="sortBy"
                :order="order"
                :paramJson="paramJson"
                :retrieveCondition="retrieveCondition"
                :collectionInfo="collectionInfo"
                :needSort=false
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
      <div style="display: inline-block;text-align: center">
        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询</el-button>
        <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning" v-if="defaultOpen">&nbsp;清空
        </el-button>
        <el-button type="warning" class="el-icon-warning" @click="exportList" v-if="defaultOpen" v-has="'M7145'">&nbsp;导出</el-button>
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
                <p>3、如无权限，仅限业务员本人修改报价单，且报价单审校后仅允许打折、打印，无法修改，如需修改审核后的报价单，需有权限人员撤消审核； </p>
                <p>4、报价单需在审核通过后方可打印、生成合同或转相关任务； </p>
                <p>5、未生成合同的报价单，您可直接点击“未生成”前往录入合同； </p>
                <p>6、单位红，该报价单未审核； </p>
                <p>7、报价单颜色正常，该报价单未包含器具或计划已转。红色：计划未转，蓝色：转入部分计划； </p>
                <p>8、业务员红色，该报价为从原报价的生成且未完成修改的报价单。</p>
              </global-tootips>
          </span>
    </div>
    <br>

    <div>
      <el-table :max-height="QJTableMaxHeight"
                ref="elTable"
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
          key="quotationNo"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.planState==0">{{scope.row.quotationNo}}</span>
            <span v-else-if="scope.row.planState==1" style="color:blue">{{scope.row.quotationNo}}</span>
            <span v-else-if="scope.row.planState==2" style="color:red">{{scope.row.quotationNo}}</span>
            <span v-else>{{scope.row.quotationNo}}</span>
          </template>

        </el-table-column>

        <el-table-column
          prop="companyName"
          label="委托单位"
          :render-header="QJrenderHeader"
          width="200"
          show-overflow-tooltip
          key="companyName"
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
          key="businessArea"
        >
        </el-table-column>

        <el-table-column
          prop="businessStaffName"
          label="业务员"
          :render-header="QJrenderHeader"
          v-if="headObj.businessStaffName"
          key="businessStaffName"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.newFlag==1" style="color: red">{{scope.row.businessStaffName}}</span>
            <span v-else>{{scope.row.businessStaffName}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="chargeName"
          label="业务负责人"
          :render-header="QJrenderHeader"
          v-if="headObj.chargeName"
          key="chargeName"
        >
        </el-table-column>

        <el-table-column
          prop="secondChargeName"
          label="第二负责人"
          :render-header="QJrenderHeader"
          v-if="headObj.secondChargeName"
          key="secondChargeName"
        >
        </el-table-column>

        <el-table-column
          prop="taxNo"
          label="税号"
          :render-header="QJrenderHeader"
          v-if="headObj.taxNo"
          key="taxNo"
        >
        </el-table-column>

        <el-table-column
          prop="afterDiscountsTotal"
          label="报价金额"
          :render-header="QJrenderHeader"
          v-if="headObj.afterDiscountsTotal"
          key="afterDiscountsTotal"
        >
        </el-table-column>

        <el-table-column
          prop="auditDate"
          label="审核时间"
          :render-header="QJrenderHeader"
          :formatter="formatterDate"
          v-if="headObj.auditDate"
          key="auditDate"
        >
        </el-table-column>

        <el-table-column
          prop="contractNo"
          label="合同编号 "
          :render-header="QJrenderHeader"
          v-if="headObj.contractNo"
          key="contractNo"
        >
          <template slot-scope="scope" v-if="scope.row.quotationNo!='合计'">
            <span v-if="!scope.row.contractNo" @click='toAddContract(scope.row)' style="cursor: pointer;color: blue">未生成合同</span>
            <span v-else @click="getContractDetail(scope.row)" style="cursor: pointer;color: blue">{{scope.row.contractNo}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          fixed="right"
          width="80px">
          <template slot-scope="scope" v-if="scope.row.quotationNo!='合计'">
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-edit-outline" title="编辑"></i></el-button>
            <el-button v-has="'M7140'"
                       v-mindPopover="{message:'是否删除?',placement:'left',success:handleDelete.bind(this,[scope.row])}"
                       type="text" style="padding:0;font-size:18px;">
              <i class="el-icon-delete" title="删除"></i></el-button>
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
  import {ajaxRequest, ajaxSyncRequest} from '../../util/base'
  import Retrieve from '../../Retrieve'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import quotationForm from './quotationForm'
  import paramJson from './paramQuotation'
  import popover from '../plan/popover.vue'
  import companyPopover from '../plan/companyPopover.vue';

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
      formatterDate: function (row, column, cellValue) {
        if(cellValue){
          return new Date(cellValue).format('YYYY-MM-DD')
        }else{
          return '';
        }
      },
      //添加合同,跳转至添加明细页
      toAddContract(rowInfo) {
        if (rowInfo.auditFlag == 0) {
          this.$message.error('未审核不可生成合同');
          return;
        }

        this.$confirm('确认将该报价单生成合同?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/admin/373',
            query: {quotationId: rowInfo.id}
          })
        }).catch(() => {
          // 取消操作
        })

      },

      getTableList() {
        this.loading=true
        ajaxRequest('get', 'back/quotation/retrieve', {
          fuzzySearch: 1,
          page: this.page,
          rows: this.rows,
          orderProperty: 'q.id',
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
          }this.loading=false

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
          path: '/admin/252',
          query: {
            id: rowInfo.id
          }
        })
      },
      handleDelete(data) {
        if (data.length > 0) {
          ajaxRequest('post', 'back/quotation/', {_method: 'delete', id: data[0].id}, res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getTableList()
            } else if (res.code === 300) {
              this.$message.error(res.msg)
            } else {
              this.$message.error('系统错误')
            }
          })
        }
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
      listUserByBD() {
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
      //跳转到合同详情页
      getContractDetail(rowInfo) {
        this.$router.push({
          path: '/admin/373',
          query: {
            id: rowInfo.contractId,
            quotationId: rowInfo.id,
            type: 1
          }
        })
      },
      //报价单列表导出
      exportList() {
        console.log(this.headObj);


      }
    },
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      quotationForm,
      popover,
      companyPopover
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
