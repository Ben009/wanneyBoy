<template>
  <el-form ref="form" :model="form" label-width="150px">
    <div class="wtdw">({{companyType}}){{company}}</div>
    <div style="margin-left:10px">该登记号或流转单下当前状态</div>
    <div>
      <el-table  :max-height="QJTableMaxHeight"
        ref="table"
        :data="tableData"
        border
        style="width: 100%"
        @sort-change="handleSort"
        :fit="true"
        show-summary
        :summary-method="getSummaries"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" disabled="true" :selectable='checkboxT'></el-table-column>
        <el-table-column
          prop="registrationNo"
          label="登记号"
          >
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
          >
        </el-table-column>
        <el-table-column
          v-if="outType===1"
          prop="sampleWarehouseNo"
          label="货柜号"
          >
        </el-table-column>
        <el-table-column
          v-if="outType===2"
          prop="certificateWarehouseNo"
          label="货柜号"
          >
        </el-table-column>
        <el-table-column
          v-if="outType===1"
          prop="applianceWarehouseFlag"
          label="状态"

          :formatter="function(row, column, cellValue, index){return cellValue==0?'送检在收发':cellValue==1?'未检在实验室':cellValue==2?'已检在实验室':cellValue==3?'已入库':cellValue==4?'已出库':'送检在收发'}"
        >
        </el-table-column>
        <el-table-column
          v-if="outType===2"
          prop="certificateWarehouseFlag"
          label="状态"

          :formatter="function(row, column, cellValue, index){return cellValue==3?'已入库':cellValue==4?'已出库':'未入库'}"
        >
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="操作时间"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="creator"
          label="操作人"
          >
        </el-table-column>
        <el-table-column
          prop="setNumber"
          label="总套数"
          >
        </el-table-column>
        <el-table-column
          prop="returnNumber"
          label="退套数"
          >
        </el-table-column>
        <el-table-column
          prop="jdy"
          label="检定员"
          >
        </el-table-column>
        <el-table-column
          prop="fyhj"
          label="费用合计"
          >
        </el-table-column>
        <el-table-column
          prop="isSettleAccount"
          label="是否结账"

          :formatter="function(row, column, cellValue, index){return cellValue==0?'未结账':cellValue==1?'已结账':''}"
        >
        </el-table-column>
        <el-table-column
          prop="guaranteeType"
          label="担保类型"

          :formatter="function(row, column, cellValue, index){return cellValue=='1'?'货证齐担':cellValue=='2'?'仅担保货':cellValue=='3'?'仅担保证':''}"
        >
        </el-table-column>
        <el-table-column
          prop="guaranteePersonName"
          label="担保人"
          >
        </el-table-column>
        <el-table-column
          prop="guaranteeTime"
          label="担保期限"

          :formatter="dealDate">
        </el-table-column>
      </el-table>
    </div>
    <div class="centerForm">
      <div style="text-align: center">
        <global-tootips  style="text-align: left">
          <p>1、若该查询的条件旗下所有登记号已结账，则系统默认结账出库；</p>
          <p>2、若该查询的条件旗下单位类别为第一类别，则系统默认高权限单位出库；</p>
          <p>3、若该查询的条件旗下所有登记号含未结帐并已担保，则系统默认担保出库；</p>
          <p>4、不符合上所述情况下，系统不允许出库。</p>
        </global-tootips>
      </div>
      <div>
        <el-form-item label="出库类型">
          <el-radio-group v-model="outType">
            <el-radio :label="1" v-if="outType===1">仅出货</el-radio>
            <el-radio :label="2" v-if="outType===2">仅出证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出库方式">
          <el-radio-group v-model="outWay">
            <el-radio :label="1">快递</el-radio>
            <!--<el-radio :label="2">客户自取</el-radio>-->
            <el-radio :label="3">样管员送样</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单位名称">
          <el-autocomplete style="width: 100%"
                           v-model="companyName"
                           :fetch-suggestions="querySearchEntrust"
                           placeholder="请输入委托单位"
                           @select="handleSelect"
          >
            <template slot-scope='scope'>
              <div>
                  <span style="margin-left:0">({{scope.item.companyType}}) {{scope.item.companyName}}
                     (<span :style="{color:scope.item.status == 0 ? 'red' : 'green'}">{{scope.item.status == 0 ? '未审核' : '已审核'}}</span>)
                     {{!!scope.item.companyDepart ? '['+scope.item.companyDepart+']' : ''}}
                     {{!!scope.item.contacter ? '['+scope.item.contacter+']' : ''}}
                     {{!!scope.item.mobilePhone ? '['+scope.item.mobilePhone+']' : ''}}
                  </span>
              </div>
            </template>
          </el-autocomplete>
          <el-input v-model="companyId" v-show="false"></el-input>
        </el-form-item>
        <el-form-item label="快递公司" v-if="outWay===1">
          <el-select v-model="expressCompany" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.code"
              :label="item.premark"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" v-if="outWay===1">
          <el-input v-model="courierNum" @keyup.enter.native="handleSubmit"></el-input>
        </el-form-item>
        <el-form-item label="收件人" v-if="outWay===1">
          <el-input v-model="person" @keyup.enter.native="handleSubmit"></el-input>
        </el-form-item>
        <el-form-item label="收件地址" v-if="outWay===1">
          <el-input v-model="address" @keyup.enter.native="handleSubmit"></el-input>
        </el-form-item>
        <el-form-item label="收件人电话" v-if="outWay===1">
          <el-input v-model="mobile" @keyup.enter.native="handleSubmit"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="remark" @keyup.enter.native="handleSubmit"></el-input>
        </el-form-item>
        <el-form-item label="操作方式">
        <el-radio-group v-model="operateWay">
          <el-radio :label="1">出库并生成出库单</el-radio>
          <el-radio :label="2">仅出库</el-radio>
          <el-radio :label="3">仅生成出库单</el-radio>
        </el-radio-group>
      </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked">自动打印出库单</el-checkbox>
        </el-form-item>
      </div>
      <div style="text-align: center">
        <el-button type="primary" @click="handleSubmit">出库</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
    <div style="margin-left:10px">上述条件所对应委托单下所有证书或样品库房信息</div>
    <div>
      <el-table  :max-height="QJTableMaxHeight"
        ref="table2"
        :data="tableData2"
        border
        style="width: 100%"
        @sort-change="handleSort"
        :fit="true">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="registrationNo"
          label="登记号"
          >
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
          >
        </el-table-column>
        <el-table-column
          v-if="outType===1"
          prop="sampleWarehouseNo"
          label="货柜号"
          >
        </el-table-column>
        <el-table-column
          v-if="outType===2"
          prop="certificateWarehouseNo"
          label="货柜号"
          >
        </el-table-column>
        <el-table-column
          v-if="outType===1"
          prop="applianceWarehouseFlag"
          label="状态"

          :formatter="function(row, column, cellValue, index){return cellValue==0?'送检在收发':cellValue==1?'未检在实验室':cellValue==2?'已检在实验室':cellValue==3?'已入库':cellValue==4?'已出库':'未检在实验室'}"
        >
        </el-table-column>
        <el-table-column
          v-if="outType===2"
          prop="certificateWarehouseFlag"
          label="状态"

          :formatter="function(row, column, cellValue, index){return cellValue==3?'已入库':cellValue==4?'已出库':'未入库'}"
        >
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="操作时间"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="creator"
          label="操作人"
          >
        </el-table-column>
        <el-table-column
          prop="setNumber"
          label="总套数"
          >
        </el-table-column>
        <el-table-column
          prop="returnNumber"
          label="退套数"
          >
        </el-table-column>
        <el-table-column
          prop="jdy"
          label="检定员"
          >
        </el-table-column>
        <el-table-column
          prop="fyhj"
          label="费用合计"
          >
        </el-table-column>
        <el-table-column
          prop="isSettleAccount"
          label="是否结账"

          :formatter="function(row, column, cellValue, index){return cellValue==0?'未结账':cellValue==1?'已结账':''}"
        >
        </el-table-column>
        <el-table-column
          prop="guaranteeType"
          label="担保类型"

          :formatter="function(row, column, cellValue, index){return cellValue=='1'?'货证齐担':cellValue=='2'?'仅担保货':cellValue=='3'?'仅担保证':''}"
        >
        </el-table-column>
        <el-table-column
          prop="guaranteePersonName"
          label="担保人"
          >
        </el-table-column>
        <el-table-column
          prop="guaranteeTime"
          label="担保期限"

          :formatter="dealDate">
        </el-table-column>
      </el-table>
    </div>
  </el-form>
</template>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";
  const defaults = {
  };
  export default {
    components: {
      ElRow,
      ElCol,
    },
    name:"sampleOrCertificateOutDetail",
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        orderProperty:'id',//排序字段
        orderType:'desc',//排序方式
        tableData:[],//表格中的数据
        tableData2:[],//表格中的数据
        multipleSelection:[],//多选，选中的数据
        company:"",//最上方显示的委托单位名称
        companyType:"",//单位等级
        outType:"",//出库类型
        outWay:2,//出库方式
        companyName:"",//单位名称
        companyId:"",//单位id
        expressCompany:"",//快递公司
        options:[],//快递公司选项列表
        courierNum:"",//快递单号
        person:"",//收件人
        address:"",//收件地址
        mobile:"",//收件人电话
        remark:"",//备注
        operateWay:"",//操作方式
        checked:false,//自动打印出库单
        paramObj: this.$route.query,
        flag:false,//用于判断是否加载表格
      }
    },
    methods:{
      //委托单位autoComplete
        querySearchEntrust(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        let params = queryString
          ? {
            companyName: queryString,
            fuzzySearch: 1
          }
          : "";
        ajaxRequest("get", "back/company/matchCompanysByName", params, res => {
          if (res.code == 200) {
            this.handleResult(res.rows);
            cb(res.rows);
          }
        });
      },
      handleResult(res) {
        for (let key in res) {
          Vue.set(res[key], "value", res[key].companyName);
        }
      },
      handleSelect(item) {
        this.companyId=item.id;
      },
      getTableList(){
        /*获取table数据，维护data数据*/
        this.flag=this.paramObj.flag;
        if(this.flag===true){
          this.outType=this.paramObj.sampleOrCertificate;
          this.tableData=this.paramObj.tableData;
          this.tableData2=this.paramObj.tableData2;
          this.companyType=this.paramObj.companyType;
          this.company=this.paramObj.companyName;
          this.companyId=this.paramObj.companyId;
          this.companyName=this.company;
        }else{
          return;
        }
      },
      getExpressCompany(){//快递公司下拉框
        ajaxProxyRequest('get','/njmind/findParams/express',{codeType:'NUMBER'},(res) => {
          this.options=res.express.list;
        })
      },
      handleSubmit(){
        if(this.multipleSelection.length<=0){
          this.$message.warning('必须选择一条数据');
          return;
        }
        if(this.operateWay===""){
          this.$message.warning('操作方式没有选择');
          return;
        }
        this.form.cklx=this.outType;
        this.form.dhlist=JSON.stringify(this.multipleSelection);
        this.form.ckfs=this.outWay;
        this.form.dwmc=this.companyName;
        this.form.dwid=this.companyId;
        this.form.expressName=this.expressCompany;
        this.form.expressNo=this.courierNum;
        this.form.receivePerson=this.person;
        this.form.receiveAddress=this.address;
        this.form.receiveMobile=this.mobile;
        this.form.remark=this.remark;
        this.form.czfs=this.operateWay;
        this.form.checked=this.checked;
        ajaxRequest('post','back/ruku/chuKu',this.form,(res)=>{
          if(res.code===200){
            this.$message.success('提交成功');
            if(this.outType===1){
              this.$router.push({
                path:'/admin/547',
              })
            }else{
              this.$router.push({
                path:'/admin/548',
              })
            }
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      goBack(){
        if(this.outType===1){
          this.$router.push({
            path:'/admin/547',
          })
        }else{
          this.$router.push({
            path:'/admin/548',
          })
        }
      },
      dealDate: function (row, column, cellValue) {
        if(cellValue===""||cellValue===null||cellValue===undefined){
          return "";
        }else{
          return new Date(cellValue).format('YYYY-MM-DD');
        }
      },
      checkboxT(row,index){
        if(this.outType===1){//样品出库
          if(row.applianceWarehouseFlag!=3||(row.isSettleAccount===0&&row.guaranteeType!="1"&&row.guaranteeType!="2")){//不可出库条件：1.样品不是已入库（3） 2.样品已入库，但未结账且样品未担保
            return 0;
          }else{
            return 1;
          }
        }else if(this.outType===2){//证书出库
          if(row.certificateWarehouseFlag!=3||(row.isSettleAccount===0&&row.guaranteeType!="1"&&row.guaranteeType!="3")){//不可出库条件：1.证书不是已入库（3） 2.证书已入库，但未结账且证书未担保
            return 0;
          }else{
            return 1;
          }
        }
      },
      handleSort: function(column, prop, order){
        /*用ui组件提供的排序接口,维护实例data数据*/
        this.orderProperty = column['prop'];
        if(column['order'] == 'descending'){
          this.orderType='desc';
        }else{
          this.orderType = 'asc';
        }
        this.getTableList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //合计行
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 2||index===3||index===4||index===5||index===6||index===9||index===11||index===12||index===13||index===14) {
            sums[index]='';
            return;
          }
          if (index === 1) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
    },
    mounted() {
      this.getExpressCompany();
      this.getTableList();
    },
    created(){

    }
  }
</script>

<style scoped>
  .centerForm{
    border:1px solid #ddd;
    margin:10px 0;
    padding:10px 10px;
  }
  .wtdw{
    margin:10px 0;
    font-size:16px;
    color:blue;
  }
</style>
