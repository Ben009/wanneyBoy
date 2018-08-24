<template>
<div>
  <!-- 已审核单位查询 -->
  <div v-if="!form">
    <div style="margin-top:0px;">



      <!--******************************高级查询组件******************************************************-->
      <div style="margin-bottom:5px;">
        <Retrieve  ref="retrieve-wapper"
                  v-if="defaultOpen"
                  :rowsCondition='rowsCondition'
                  :sortBy="sortBy"
                  :order="order"
                  :paramJson="paramJson"
                  :retrieveCondition="retrieveCondition"
                  :collectionInfo="collectionInfo"/>
      </div>
      <div style="display: flex;justify-content: space-between; margin:10px 0px;">
        <el-button style="opacity:0;" size="small" type="primary" icon="el-icon-plus"></el-button>
        <div style="display: inline-block;text-align: center">
            <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search"   v-if="defaultOpen">查询</el-button>
            <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning"   v-if="defaultOpen">&nbsp;清空</el-button>
        </div>
        <div style="float: right">
          <el-select size="mini" v-if="resultCondition.length" v-model="templateValue"   placeholder="请选择" @change="QJHandleSelectTemplate">
            <el-option
              v-for="item in moduleList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
            <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
        </div>
      </div>
      <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
      <!--************************************************************************************-->
    </div>



<div>
      <el-table :data="tableData"
        :max-height="QJTableMaxHeight" v-loading="loading"
        border
        style="width: 100%">

        <el-table-column  fixed  type="index"  label="序号"  width="50"> </el-table-column>
            <el-table-column  prop="companyName" label="单位名称"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.companyNameEn" prop="companyNameEn" label="单位名称(英文)"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.addTime" prop="addTime"  label="添加时间" :formatter="function(row, column, cellValue, index){return cellValue? new Date(cellValue).format('YYYY-MM-DD'):''}"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.address" prop="address" label="地址"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.addressEn" prop="addressEn" label="地址(英文)"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.certificateCompanyName" prop="certificateCompanyName" label="证书单位名称"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.sceneTestingAddress" prop="sceneTestingAddress" label="现场检测地址"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.mobilePhone" prop="mobilePhone" label="手机号码"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.industryValue" prop="industryValue" label="所属行业" :formatter="industryValueFormat"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.companyDepart" prop="companyDepart" label="客户对接部"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.companyCharge" prop="companyCharge" label="客户负责人"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   prop="companyType" label="单位类别"  :render-header="QJrenderHeader" :formatter="formatterCompanyType"></el-table-column>
            <el-table-column   prop="contacter" label="客户联系人"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   prop="businessGroupName" label="业务组"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   prop="businessStaffName" label="业务员"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   prop="contractNo"  label="合同号"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   prop="creditCode"  label="统一社会信用代码"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.telephone" prop="telephone"  label="联系电话"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.fax" prop="fax"  label="传真"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.email" prop="email"  label="邮箱"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.postCode" prop="postCode"  label="邮编"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.certificateRequirement" prop="certificateRequirement"  label="证书要求"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.visitSpecialRequirement" prop="visitSpecialRequirement"  label="上门特殊要求"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.specialCertificateRequire" prop="specialCertificateRequire"  label="证书特殊要求"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.otherSpecialRequirement" prop="otherSpecialRequirement"  label="其他特殊要求"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.businessPromotion" prop="businessPromotion"  label="业务提成(%)"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractRemark" prop="contractRemark"  label="备注"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.invoiceCompany" prop="invoiceCompany"  label="名称"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.taxNo" prop="taxNo"  label="纳税人识别号"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.invoiceAddressTel" prop="invoiceAddressTel"  label="地址、电话"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.accountBankNo" prop="accountBankNo"  label="开户行及账号"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractDiscount" prop="contractDiscount"  label="合同折扣"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractValidateBegin" prop="contractValidateBegin"  label="合同有效期开始时间" :formatter="function(row, column, cellValue, index){return  cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractValidateEnd" prop="contractValidateEnd"  label="合同有效期结束时间" :formatter="function(row, column, cellValue, index){return  cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractSignatory" prop="contractSignatory"  label="合同签署人"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractSignDate" prop="contractSignDate"  label="合同签署日期" :formatter="function(row, column, cellValue, index){return  cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractRemark" prop="contractRemark"  label="合同备注"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.addUser" prop="auditorName"  label="添加人"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.auditorName" prop="auditorName"  label="审核人"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.auditTime" prop="auditTime"  label="审核时间" :formatter="function(row, column, cellValue, index){return  cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.region" label="行政区划" width="150px">
              <template slot-scope="region">
                  <span>{{region.row.province}}/{{region.row.city}}/{{region.row.area}}</span>
              </template>
            </el-table-column>
        <el-table-column
          label="操作"
          width="60">
          <template slot-scope="scope">
            <el-button title="编辑" @click="getDetail(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-edit-outline"></i></el-button>
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
    <template v-else>
      <company-content :data='form' :isPut='true' :callback="handleCallback" :audit="true"></company-content>
    </template>
  </div>
</template>

<script>
  import Vue from 'vue';

  import {ajaxRequest,ajaxSyncRequest} from '../../util/base'
  import $ from 'jquery'
  // 导入详情页的视图模板
  import companyContent from './companyContent'
  /**************************高级检索相关*********************/
  import Retrieve from '../../Retrieve'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import paramJson from './companyAudit'    //同目录下json数据
  /**************************高级检索相关*********************/


  export default {
    name: "company-audit-list",
    components:{
      WorkMould,    //个性化设置的弹窗组件
      TableColumnHeader,  //表头检索模板
      Retrieve,    //高级搜索组件
      companyContent, //详情页面
    },
    data(){
      return {
        rules: {
          contacter: [{required: true, message: '联系人不能为空!'}],
          address: [{required: true, message: '地址不能为空!'}],
          telephone: [{required: true, message: '电话不能为空!'}]
        },
        page:1,
        rows:10,
        total:0,
        loading:false,

        /**************************高级检索相关*********************/
        orderProperty: "c.ADD_TIME",
        orderType: "desc",
        multipleSelection: [],
        /*高级检索相关项*/
        rowsCondition: paramJson,   //默认同目录下json数据 会依据模板改变
        paramJson: paramJson,      //同目录下json数据 常量
        moduleList: [],           //模板列表
        templateValue: '',       //当前选择的模板id
        sortBy: '',              //排序字段
        order: '',              //desc降序 asc升序
        headObj: {},           //表头显示对象 {category:true}
        defaultOpen: true,
        isSetting:0,
        retrieveCondition:[],
        collectionInfo:[],
        userId: "",
        resultCondition:[],
        sc:'',
        /**************************高级检索相关*********************/


        tableData:[],
        tableArr:['contacter','certificateCompanyName','telephone','fax','address','remark'],   /*表格中需编辑的字段*/
        form:'',
      }
    },
    methods:{
      handleCallback(row){
        if(!!row){
        ajaxRequest(
            "put",
            "back/company/",
            {
              id: rowInfo.id,
              category: rowInfo.category,
              name: rowInfo.name,
              value: rowInfo.value,
              memo: rowInfo.memo
            },
            function(res) {
              if (res.code === 200) {
                _this.$message.success("编辑成功");
                _this.edit = null;
                let roleList = _this.tableData;
                for (let i = 0, len = roleList.length; i < len; i++) {
                  if (roleList[i].id === rowInfo.id) {
                    _this.tableData.splice(i, 1, rowInfo);
                    break;
                  }
                }
              } else {
                _this.$message.error("编辑失败");
              }
            }
          );}else{
            this.form = row;
            this.getTableList();
          }
      },
      //
      getDetail(row){
        // this.$router.push(
        //   // 此处的getDetail应该是在本页面跳转到另外一个组件中将要查看的数据添加到表格中，实现查看明细的功能
        //   path:'/admin/252',
        //   query:{
        //     id:row.id,
        //   }
        // })
        this.form = row;
      },


      formatterCompanyType: function (row, column) {
        var companyTypes = {1: '第一类别', 2: '第二类别', 3: '第三类别', 4: '第四类别', 5: '第五类别', 6: '第六类别'}
        return companyTypes[row.companyType]
      },
      getTableList(){
        this.loading=true
        // 调用已审核的数据
        ajaxRequest('get','back/company/retrieve',{
          //status:1,
          /**************************分页相关*********************/
          fuzzySearch: 1,
          page: this.page,
          rows: this.rows,
          status:1,
          isDelete:0,
          /**************************分页相关*********************/
          /**************************高级检索相关*********************/
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total: 0,
          sc: this.sc
          /**************************高级检索相关*********************/
        },(res)=>{
          if(res.code==200){
            this.tableData = res.rows;
            this.total = res.total;
          }
          this.loading=false
        })
      },
      handlePageSizeChange(size) {
        /*分页组件每页显示条数change 重新计算页码，控制信息在当前表格中*/
        this.page = 1;
        this.rows = size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
    },
    mounted(){
      let userId = localStorage.getItem("userId");
      this.userId = userId;
      this.getTableList();
      this.QJGetMounted();
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
</style>
