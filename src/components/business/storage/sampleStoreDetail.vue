<template>
  <el-form ref="form" :model="form" label-width="150px">
    <div class="wtdw">({{companyType}}){{companyName}}</div>
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
        <el-table-column type="selection" width="40" :selectable='checkboxT'></el-table-column>
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
          prop="sampleWarehouseNo"
          label="货柜号"
          >
        </el-table-column>
        <el-table-column
          prop="applianceWarehouseFlag"
          label="状态"

          :formatter="function(row, column, cellValue, index){return cellValue==0?'送检在收发':cellValue==1?'未检在实验室':cellValue==2?'已检在实验室':cellValue==3?'已入库':cellValue==4?'已出库':'送检在收发'}"
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
          prop="guaranteeType"
          label="担保类型"

          :formatter="function(row, column, cellValue, index){return cellValue==1?'货证齐担':cellValue==2?'仅担保货':cellValue==3?'仅担保证':''}"
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
      <el-row>
        <el-form-item label="货柜号">
          <el-input v-model="hgh" @keyup.enter.native="handleSubmit"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注">
          <el-input v-model="remark" @keyup.enter.native="handleSubmit"></el-input>
        </el-form-item>
      </el-row>
      <div style="text-align: center">
        <el-button type="primary" @click="handleSubmit">入库</el-button>
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
        <el-table-column type="index" label="序号" width="50" ></el-table-column>
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
          prop="sampleWarehouseNo"
          label="货柜号"
          >
        </el-table-column>
        <el-table-column
          prop="applianceWarehouseFlag"
          label="状态"

          :formatter="function(row, column, cellValue, index){return cellValue==0?'送检在收发':cellValue==1?'未检在实验室':cellValue==2?'已检在实验室':cellValue==3?'已入库':cellValue==4?'已出库':'送检在收发'}"
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
          prop="guaranteeType"
          label="担保类型"

          :formatter="function(row, column, cellValue, index){return cellValue==1?'货证齐担':cellValue==2?'仅担保货':cellValue==3?'仅担保证':''}"
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
      ElCol},
    name:"originalRecordHandDetail",
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        tableData:[],//表格中的数据
        tableData2:[],//表格中的数据
        multipleSelection:[],//多选，选中的数据
        hgh:"",//货柜号
        remark:"",//备注
        companyName:"",//委托单位名称
        companyType:"",//委托单位等级
        paramObj: this.$route.query,
        flag:false,//用于判断是否加载表格
      }
    },
    methods:{
      getTableList(){
        this.flag=this.paramObj.flag;
        if(this.flag===true){
          this.tableData=this.paramObj.tableData;
          this.tableData2=this.paramObj.tableData2;
          this.companyName=this.paramObj.companyName;
          this.companyType=this.paramObj.companyType;
        }else{
          return;
        }
      },
      handleSubmit(){
        if(this.multipleSelection.length<=0){
          this.$message.warning('必须选择一条数据');
          return;
        }
        if(this.hgh===""){
          this.$message.warning('货柜号未填写');
          return;
        }
        this.form.sampleWarehouseNo=this.hgh;
        this.form.remark=this.remark;
        this.form.dhlist=JSON.stringify(this.multipleSelection);
        ajaxRequest('post','back/ruku/addYpRuku',this.form,(res)=>{
          if(res.code===200){
            this.$message.success('提交成功');
            this.$router.push({
              path:'/admin/337',
            })
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      checkboxT(row,index){
        if(row.applianceWarehouseFlag ===0||row.applianceWarehouseFlag ===1||row.applianceWarehouseFlag ===2){//可勾选
          return 1;
        }else{//不可勾选
          return 0;
        }
      },
      goBack(){
        this.$router.push({
          path:'/admin/337',
        })
      },
      dealDate: function (row, column, cellValue) {
        if(cellValue===""||cellValue===null||cellValue===undefined){
          return "";
        }else{
          return new Date(cellValue).format('YYYY-MM-DD');
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
          if (index===2||index===3||index===4||index===5||index===6||index===9||index===11||index===12||index===13) {
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
