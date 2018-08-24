<template>
  <div  style="position:relative;">
    <Retrieve  ref="retrieve-wapper"
               :rowsCondition='rowsCondition'
               :sortBy="sortBy"
               :order="order"
               v-if="defaultOpen"
               :paramJson="paramJson"
               :retrieveCondition="retrieveCondition"
               :collectionInfo="collectionInfo"/>

    <div style="display: flex;justify-content: space-between; margin:10px 0px;">
      <div style="display: inline-block;text-align: center">
        <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search"  v-if="defaultOpen">查询</el-button>
        <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning"   v-if="defaultOpen">&nbsp;清空</el-button>
      </div>
      <span style="float: right">
          <el-select size="mini" v-if="resultCondition.length" v-model="templateValue"  placeholder="请选择" @change="QJHandleSelectTemplate">
              <el-option
                v-for="item in moduleList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
          </span>
    </div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="6">
            <el-form-item label="检测部门" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检测岗位" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="委托开始日期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="委托结束日期" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="6">
            <el-form-item>
              <el-select v-model="departId" placeholder="请选择" @change="getPost">
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select v-model="testPost" placeholder="请选择" @change="getPostId">
                <el-option
                  v-for="item in postOptions"
                  :key="item.id"
                  :label="item.postName"
                  :value="item.postName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker
                v-model="startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker
                v-model="endDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20" style="text-align: center;margin:20px 0;">
          <el-button class="el-button el-button--primary" @click="search">查询</el-button>
          <el-button class="el-button el-button--primary" @click="exportList">导出</el-button>
        </el-Row>
      </div>
      <div>
        <el-table :max-height="QJTableMaxHeight"
                  ref="table"
                  :data="tableData"
                  border
                  style="width: 100%"
                  :fit="true">
          <el-table-column prop="registrationNo" label="登记号"></el-table-column>
          <el-table-column prop="orderSingleNo" label="流转单号"></el-table-column>
          <el-table-column prop="applianceName" label="器具名称"></el-table-column>
          <el-table-column prop="companyName" label="委托单位"></el-table-column>
          <el-table-column prop="setNumber" label="套数"></el-table-column>
          <el-table-column prop="certificateNumber" label="证书数量"></el-table-column>
          <el-table-column prop="entrustDate" label="委托日期" :formatter="dealDate"></el-table-column>
          <el-table-column prop="jcqx" label="检测期限" :formatter="dealDate"></el-table-column>
          <el-table-column prop="departName" label="检测部门" v-if="headObj.departName"></el-table-column>
          <el-table-column prop="postName" label="检测岗位" v-if="headObj.postName"></el-table-column>
        </el-table>
      </div>
      <charts :list="tableData"></charts>
    </el-form>
  </div>
</template>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  import Retrieve from "../../Retrieve";
  import WorkMould from "../../mould/WorkMould";
  import TableColumnHeader from "../../Table/TableColumnHeader";
  import paramJson from "./backParam"; //同目录下json数据
  import charts from "./charts"; //图表
  export default {
    name:"backRemind",//返样提醒
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      charts
    },
    data() {
      return {
        tableData:[],
        departmentOptions:[],//检测部门option
        postOptions:[],//检测岗位option
        testDepartment:"",//检测部门名
        departId:"",//检测部门id
        testPost:"",//检测岗位名
        postId:"",//检测岗位id
        startDate:"",//委托开始日期
        endDate:"",//委托结束日期

        isSetting: 0, //控制个性化设置弹窗是否展示
        edit: null, //控制编辑弹窗是否展示
        isInner: 0,
        /*高级检索相关项*/
        rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
        paramJson: paramJson, //同目录下json数据 常量
        moduleList: [], //模板列表
        templateValue: "", //当前选择的模板id
        sortBy: "", //排序字段
        order: "", //desc降序 asc升序
        headObj: {}, //表头显示对象 {category:true}
        defaultOpen: false, //默认开启高级查询
        sc:'',
        userId: "",
        allModules: {}, //所有模板
        resultCondition: [],
        retrieveCondition: [],
        collectionInfo:[],
      }
    },
    methods:{
      getTableList(){
        if(this.startDate==""){
          this.$message.warning('委托开始日期没有选择');
          return;
        }
        if(this.endDate==""){
          this.$message.warning('委托结束日期没有选择');
          return;
        }
        ajaxRequest('get','back/statistics/fanyangRemind',{
          startDate:this.startDate,//委托开始日期
          endDate:this.endDate,//委托结束日期
          departId:this.departId,//检测部门id
          postId:this.postId,//检测岗位id
        },(res)=>{
          if(res.code===200){
            this.tableData=res.rows;
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      search(){
        this.getTableList();
      },
      setOptions(){
        ajaxRequest("get","back/statistics/getDepartList",{isDelete: 0},res => {//检测部门
            if (res.code === 200) {
              this.departmentOptions = res.rows;
            }
          }
        );
      },
      getPost(value) {
        this.testPost="";
        this.postId="";
        ajaxRequest( "get","back/user/retrieve",{isDelete: 0,departId:value},res => {
          if (res.code === 200) {
            this.postOptions = res.rows;
          }
        });
      },
      getPostId(value) {
        for(let i=0;i<this.postOptions.length;i++){
          if(this.postOptions[i].postName===value){
            this.postId=this.postOptions[i].id;
          }
        }
      },
      initDate(){//默认日期从上个月第一天到上个月最后一天
        var nowdays = new Date();
        var year = nowdays.getFullYear();
        var month = nowdays.getMonth();
        if(month==0)
        {
          month=12;
          year=year-1;
        }
        if (month < 10) {
          month = "0" + month;
        }
        this.startDate = year + "-" + month + "-" + "1";//上个月的第一天
        var myDate = new Date(year, month, 0);
        this.endDate = year + "-" + month + "-" + myDate.getDate();//上个月的最后一天
      },
      exportList(){//导出

      },
      dealDate: function (row, column, cellValue) {
        if(cellValue===""||cellValue===null||cellValue===undefined){
          return "";
        }else{
          return new Date(cellValue).format('YYYY-MM-DD');
        }
      },
    },
    mounted(){
      this.setOptions();
      this.initDate();
      this.getTableList();
    }
  }
</script>

<style scoped>
  .lbCenter>label{
    width:100% !important;
    text-align: center !important;
    padding-right: 0!important;
  }
</style>
