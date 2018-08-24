<template>
  <el-form ref="form" :model="form" label-width="150px">
    <div class="wtdw">({{companyType}}){{companyName}}</div>
    <div style="margin-left:10px">该登记号或流转单下当前状态</div>
    <div>
      <el-table :max-height="QJTableMaxHeight"
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
          v-if="form.state===1"
          prop="sampleWarehouseNo"
          label="货柜号"
          >
        </el-table-column>
        <el-table-column
          v-if="form.state===2"
          prop="certificateWarehouseNo"
          label="货柜号"
          >
        </el-table-column>
        <el-table-column
          v-if="form.state===1"
          prop="applianceWarehouseFlag"
          label="状态"

          :formatter="sampleInfoFormatter"
        >
        </el-table-column>
        <el-table-column
          v-if="form.state===2"
          prop="certificateWarehouseFlag"
          label="状态"

          :formatter="function(row, column, cellValue, index){return cellValue==3?'已入库':cellValue==4?'已出库':'未入库'}"
        >
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
      <div style="text-align: center;margin-top:20px;">
        <el-button type="primary" @click="handleSubmit">撤销</el-button>
        <el-button @click="goBack">返回</el-button>
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
        multipleSelection:[],//多选，选中的数据
        companyName:"",//委托单位名称
        companyType:"",//委托单位等级
        paramObj: this.$route.query,
        flag:false,//用于判断是否加载表格
      }
    },
    methods:{
      sampleInfoFormatter(row, column, cellValue, index) {
        let s = row.registrationNo.toString().substring(0, 1);
        if (s == "8") {
          if (cellValue == 0) {
            return '送检在收发';
          } else if (cellValue == 1) {
            return '未检在实验室';
          } else if (cellValue == 2) {
            return '已检在实验室';
          } else if (cellValue == 3) {
            return '已入库';
          } else if (cellValue == 4) {
            return '已出库';
          } else {
            return '送检在收发';
          }
        } else {
          return '';
        }
      },
      getTableList(){
        this.flag=this.paramObj.flag;
        if(this.flag===true){
          this.form.state=this.paramObj.revertType;
          this.tableData=this.paramObj.tableData;
          this.companyName=this.paramObj.companyName;
          this.companyType=this.paramObj.companyType;
//          this.$nextTick(_ => {
//            this.chooseAll();
//          })
        }else{
          return;
        }
      },
      handleSubmit(){
        if(this.multipleSelection.length<=0){
          this.$message.warning('必须选择一条数据');
          return;
        }
        this.form.dhlist=JSON.stringify(this.multipleSelection);
        ajaxRequest('put','back/ruku/backRuku',this.form,(res)=>{
          if(res.code===200){
            this.$message.success('撤销成功');
            this.$router.push({
              path:'/admin/518',
            })
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      checkboxT(row,index){
        if(this.form.state===1){//样品撤销
        if(row.applianceWarehouseFlag ===3){//可勾选：样品状态是已入库
          return 1;
        }else{ //不可勾选
          return 0;
        }
        }else if(this.form.state===2){//证书撤销
          if(row.certificateWarehouseFlag ===3){//可勾选：证书状态是已入库
            return 1;
          }else{ //不可勾选
            return 0;
          }
        }
      },
      goBack(){
        this.$router.push({
          path:'/admin/518',
        })
      },
      dealDate: function (row, column, cellValue) {
        if(cellValue===""||cellValue===null||cellValue===undefined){
          return "";
        }else{
          return new Date(cellValue).format('YYYY-MM-DD');
        }
      },
//      chooseAll(){//全选
//        for(let i=0;i<this.tableData.length;i++){
//          this.$refs.multipleTable.toggleRowSelection(this.tableData[i],true);
//        }
//      },
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
          if (index===2||index===3||index===4||index===5||index===8||index===10||index===11||index===12) {
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
  .wtdw{
    margin:10px 0;
    font-size:16px;
    color:blue;
  }
</style>
