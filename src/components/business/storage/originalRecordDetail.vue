<template>
  <el-form ref="form" :model="form" label-width="150px">
    <div class="wtdw">({{companyType}}){{companyName}}</div>
    <div style="margin-left:10px">{{searchKey}}单号下所有登记号状态</div>
    <div>
      <el-table
        ref="table"
        :data="tableData"
        border
        style="width: 100%"
        @sort-change="handleSort"
        :fit="true"
        show-summary
        :summary-method="getSummaries"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          prop="registrationNo"
          label="登记号">
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
          width="200">
        </el-table-column>
        <el-table-column prop="setNumber" label="套数">
          <template slot-scope="scope">
            <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pieceNumber"
          label="件数">
        </el-table-column>
        <el-table-column
        prop="status"
        label="状态">
        </el-table-column>
        <el-table-column
          prop="changePerson"
          label="交接人">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="操作时间"
          :formatter="dealDate">
        </el-table-column>
      </el-table>
    </div>
    <div class="centerForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-select v-model="handState" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.code"
                :label="item.remark"
                :value="item.remark">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交接人">
            <el-input v-model="handPerson" ref="focusInput" @keyup.enter.native="handleSubmit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="text-align: center">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
    <div style="margin-left:10px">{{searchKey}}对应委托单下所有登记号担保信息</div>
    <div>
      <el-table
        ref="table2"
        :data="tableData2"
        border
        style="width: 100%"
        @sort-change="handleSort"
        :fit="true">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="registrationNo"
          label="登记号">
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
          width="200">
        </el-table-column>
        <el-table-column prop="setNumber" label="套数" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pieceNumber"
          width="100"
          label="套/件">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="changePerson"
          label="交接人">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="操作时间"
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
        handState:"",//状态
        handPerson:"",//交接人
        companyName:"",//委托单位名称
        companyType:"",//委托单位等级
        paramObj: this.$route.query,
        options:[],//状态list，用数据字典维护
        flag:false,//用于判断是否加载表格
        searchKey:"",
      }
    },
    methods:{
      getState(){//状态下拉框
        ajaxProxyRequest('get','/njmind/findParams/ysjljjStatus',{codeType:'NUMBER'},(res) => {
          this.options=res.ysjljjStatus.list;
          this.$nextTick(()=>{
            this.initState();
          })
        })
      },
      getTableList(){
        this.flag=this.paramObj.flag;
        if(this.flag===true){
          this.tableData=this.paramObj.tableData;
          this.tableData2=this.paramObj.tableData2;
          this.companyName=this.paramObj.companyName;
          this.companyType=this.paramObj.companyType;
          this.searchKey=this.paramObj.searchKey;
        }else{
          return;
        }
      },
      initState(){//状态默认值
            if(this.tableData.length>0){
              let nowHandState=this.tableData[0].status;
              if(nowHandState==""||nowHandState==null||nowHandState==undefined){
                this.handState=this.options[0].remark;
              }else{
                let nextHandState="";
                for(let i=0;i<this.options.length;i++){
                  if(this.options[i].code==nowHandState){
                    if((i+1)==this.options.length){
                      nextHandState=this.options[i].remark;
                    }else{
                      nextHandState=this.options[i+1].remark;
                    }
                  }
                }
                this.handState=nextHandState;
              }

            }
        for(let i=0;i<this.tableData.length;i++){
          this.$refs.table.toggleRowSelection(this.tableData[i], true);//默认选中
        }
      },
      handleSubmit(){
        if(this.multipleSelection.length<=0){
          this.$message.warning('必须选择一条数据');
          return;
        }
        if(this.handState===""){
          this.$message.warning('状态没有选择');
          return;
        }
          this.form.changePerson=this.handPerson;
          this.form.status=this.handState;
          this.form.dhlist=JSON.stringify(this.multipleSelection);
          ajaxRequest('post','back/guarantee/addYsjljj',this.form,(res)=>{
            if(res.code===200){
              this.$message.success('提交成功');
              this.$router.push({
                path:'/admin/492',
              })
            }else{
              this.$message.error(res.msg);
            }
          })
      },
      goBack(){
        this.$router.push({
          path:'/admin/492',
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
          if (index===2||index===5||index===6||index===7||index===8||index===9) {
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
      this.getState();
      this.$nextTick(()=>{
        this.$refs.focusInput.focus();
      })
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
