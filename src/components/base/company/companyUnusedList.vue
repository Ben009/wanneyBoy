<template>
  <div>
    <div>
        <!--很多条件那个-->
      <div>
        <Retrieve  ref="retrieve-wapper"
                  v-if="defaultOpen"
                  :rowsCondition='rowsCondition'
                  :sortBy="sortBy"
                  :order="order"
                  :paramJson="paramJson"
                  :retrieveCondition="retrieveCondition"
                  :collectionInfo="collectionInfo"/>
      </div>
      <div style="display: inline-block;text-align: center;width:100%;">
          <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询</el-button>
          <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning" v-if="defaultOpen">&nbsp;清空</el-button>
      </div>

      <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
      <!--************************************************************************************-->


      <!--************************************************************************************-->
      <div>
      <el-form :rules="rule" ref="search">
        <el-row class="option">
              <el-form-item label-width="100px">
                <template slot="label">
                    <span>时间区间:</span>
                    <el-tooltip content="委托时间或报价时间">
                      <i class="el-icon-info fs12"></i>
                    </el-tooltip>
                </template>
                <el-col :span="3">
                  <el-form-item prop="dateBegin">
                    <el-date-picker
                      v-model="dateBegin"
                      :editable="false"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期"
                      style="width:100%">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <div style="textAlign:center">
                    <span>~</span>
                  </div>
                </el-col>
                <el-col :span="3">
                  <el-form-item prop="dateEnd">
                    <el-date-picker
                      v-model="dateEnd"
                      :editable="false"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="{disabledDate:dateLimit}"
                      style="width:100%">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                  <!-- <span style="color:red;">在这段时间内没有报价数据的单位</span> -->
              <el-button type="primary" @click="searchDate" class="search" :disabled="!isValidate" v-if="!defaultOpen">查询</el-button>
              <div style="float:right;">
                <el-select size="mini"  v-model="templateValue"  placeholder="请选择" @change="QJHandleSelectTemplate">
                  <el-option
                    v-for="item in moduleList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
                <global-tootips>
                    <p>1、系统默认查询所有未发生委托或报价记录的相应单位信息；</p>
                    <p>2、可通过指定时间查询在该时间范围内未发生委托或报价记录的相应单位；</p>
                    <p>3、有权限人员可批量删除该类单位信息</p>
                </global-tootips>
              </div>

              </el-form-item>
        </el-row>
      </el-form>
      </div>


    </div>



    <div style="margin-top:10px;">
      <el-table  :data="tableData"
        :max-height="QJTableMaxHeight"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%;min-height:39vh;" v-loading="loading">

        <el-table-column
          type="selection"
          width="80">
        </el-table-column>
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
            <el-table-column   v-if="headObj.contractValidateBegin" prop="contractValidateBegin"  label="合同有效期开始时间" :formatter="function(row, column, cellValue, index){return !!cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }  "   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractValidateEnd" prop="contractValidateEnd"  label="合同有效期结束时间" :formatter="function(row, column, cellValue, index){return !!cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractSignatory" prop="contractSignatory"  label="合同签署人"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractSignDate" prop="contractSignDate"  label="合同签署日期" :formatter="function(row, column, cellValue, index){return !!cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.contractRemark" prop="contractRemark"  label="合同备注"   :render-header="QJrenderHeader"></el-table-column>
            <el-table-column   v-if="headObj.region" label="行政区划" width="150px">
              <template slot-scope="region">
                  <span>{{region.row.province}}/{{region.row.city}}/{{region.row.area}}</span>
              </template>
            </el-table-column>


      </el-table>
    </div>
      <el-button :disabled="!multipleSelection.length" v-mindPopover="{message:'确定要删除委托单位?',success:handleMulti.bind(this)}" style="marginTop:10px;marginLeft:10px;" v-has="'M4803'" >删除</el-button>
    <div style="margin-top:10px;text-align:center;float:right;">
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
  import Vue from 'vue';

  import {ajaxRequest,ajaxSyncRequest} from '../../util/base'
  import $ from 'jquery'
  /**************************高级检索相关*********************/
  import Retrieve from '../../Retrieve'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import paramJson from './companyAudit'    //同目录下json数据
  /**************************高级检索相关*********************/
  import ElForm from "@/common-el/packages/form/src/form.vue";
  import ElRow from "@/common-el/packages/row/src/row";
  import ElCol from "@/common-el/packages/col/src/col";
  import ElFormItem from "@/common-el/packages/form/src/form-item.vue";
  import ElInput from "@/common-el/packages/input/src/input.vue";

/*   import { FormItem, Form} from 'element--ui'
  Vue.use(FormItem)
  Vue.use(Form) */

  export default {
    name: "company-audit-list",
    components:{
      WorkMould,    //个性化设置的弹窗组件
      TableColumnHeader,  //表头检索模板
      Retrieve,    //高级搜索组件
      ElInput,
      ElFormItem,
      ElCol,
      ElRow,
      ElForm,
    },
    data(){
      let dateEndCheck = (rule,value,cb)=>{
        if(!!this.dateEnd){
          let end = this.dateEnd.split('-').join('');
          let begin = this.dateBegin.split('-').join('');
          if(end - begin >= 0){
            this.isValidate = true;
            cb()
          }else{
            this.isValidate = false;
            cb(new Error('请选择正确结束时间！'))
          }
        }else{
          if(!!this.dateBegin){
            this.isValidate = false;
            cb(new Error('请选择结束时间'))
          }else{
            this.isValidate = true;
            cb()
          }
        }
      }
      let dateBeginCheck = (rule,value,cb)=>{
        if(!this.dateBegin){
          this.dateEnd = null;
        }
        cb();
      }
      return {
        rules: {
          contacter: [{required: true, message: '联系人不能为空!'}],
          address: [{required: true, message: '地址不能为空!'}],
          telephone: [{required: true, message: '电话不能为空!'}]
        },
        // 选择委托时间的验证
        rule:{
          dateBegin:[{
            validator:dateBeginCheck,trigger:'blur'
          }],
          // dateEnd:[{
          //   validator:dateEndCheck,trigger:'blur'
          // }]
        },
        page:1,
        rows:10,
        total:0,
        // 日期查询
        dateBegin:null,
        dateEnd:null,
        // search的validate不可用，替代方法
        isValidate:true,

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
        retrieveCondition: [],
        collectionInfo:[],
        resultCondition:[],
        sc:'',
        /**************************高级检索相关*********************/

        loading:false,
        tableData:[],
        tableArr:['contacter','certificateCompanyName','telephone','fax','address','remark'],   /*表格中需编辑的字段*/
      }
    },
    methods:{

      formatterCompanyType: function (row, column) {
        var companyTypes = {1: '第一类别', 2: '第二类别', 3: '第三类别', 4: '第四类别', 5: '第五类别', 6: '第六类别'}
        return companyTypes[row.companyType]
      },
      handleSubmit(){
        this.form.companyId = this.data.id;
        this.$refs.form.validate((valid) => {
          if (valid) {
            ajaxRequest('post','back/companyContact/',this.form,(res)=>{
              if(res.code==200){
                this.tableData.push(res.daoResult);
              }
            });
            this.callback(this.form);
          } else {
            return false;
          }
        })
      },
      getTableList(){
        this.loading=true
        ajaxRequest('get','back/company/retrieveNoUseCompanys',{
          // status:1,
          /**************************分页相关*********************/
          fuzzySearch: 1,
          page: this.page,
          rows: this.rows,
          /**************************分页相关*********************/
          /**************************高级检索相关*********************/
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          isDelete:0,
          total: 0,
          beginDate:this.dateBegin,
          endDate:this.dateEnd,
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
      setOriginal(v,arr){
        /*拿到数据后 用original对象存旧值*/
        this.$set(v,'original',{});
        arr.forEach(item => this.$set(v.original,item,v[item]));
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
      handleMulti(){
        if(!this.multipleSelection.length){
          this.$message.error('至少选中一条数据!')
          return ;
        }
        let arr = []
        for(let i = 0 ;i < this.multipleSelection.length;i++){
          arr.push(this.multipleSelection[i].id)
        }
        ajaxRequest('put','back/company/list/'+arr.join(),{isDelete:1},res=>{
          if(res.code === 200){
            this.$message.success('删除成功!')
            this.getTableList();
            this.multipleSelection = []
          }
        })
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      // 查询委托时间
      searchDate(){
        // this.$refs.search.validate(valid=>{
            this.getTableList();
        // })
      },
      //
      dateLimit(time){
        if(this.dateBegin){
          return new Date(this.dateBegin).getTime() > time.getTime()
        }else {
          return false
        }
      }
    },
    mounted(){
      this.getTableList();
      this.QJGetMounted();
    },
    updated(){
      console.log(this.defaultOpen,'defaultOpen')
    }
  }
</script>

<style scoped>
  .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;}
  .shuoming::after{
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

  .el-sm{background: #ffffff;
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
    float: right; -webkit-transition: all 0.8s;transition: all 0.8s;
    text-align: left!important;}

 .shuoming .el-sm{
    display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
   }
   /* .option{
     display: flex;
     justify-content: space-between;
   } */
   .search{
     margin-left: 20px;
   }
  .el-icon-setting {
  background: none !important;
  border: none !important;
  color: #3094e0 !important;
}
.el-icon-setting:hover {
  color: #3094e0 !important;
}
.fs12{
  font-size: 12px;
}
</style>
