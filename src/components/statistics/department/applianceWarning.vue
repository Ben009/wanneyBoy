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
            <el-form-item label="所属部门" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检定单位" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="6">
            <el-form-item>
              <el-select v-model="departId" placeholder="请选择">
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
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="testCompany"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect">
                <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick"></i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.remark }}</div>
                </template>
              </el-autocomplete>
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
          <el-table-column label="设备名称">
            <template slot-scope="scope">
              <span @click="goDevice(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.instrumentationName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="departName" label="所属部门"></el-table-column>
          <el-table-column prop="deviceNumber" label="设备编号"></el-table-column>
          <el-table-column prop="manufacturingCode" label="出厂编号"></el-table-column>
          <el-table-column prop="effectiveDate" label="有效期" :formatter="dealDate"></el-table-column>
          <el-table-column prop="model" label="型号规格" v-if="headObj.model"></el-table-column>
          <el-table-column prop="calibrationInstitutiOn" label="检定单位" v-if="headObj.calibrationInstitutiOn"></el-table-column>
          <el-table-column prop="mearsuringRange" label="测量范围" v-if="headObj.mearsuringRange"></el-table-column>
          <el-table-column prop="accuracyClass" label="准确度等级" v-if="headObj.accuracyClass"></el-table-column>
          <el-table-column prop="scheduleDate" label="计划检校日期" v-if="headObj.scheduleDate" :formatter="dealDate"></el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <el-button class="el-button el-button--primary" type="button"  @click="openOtherAppliance(scope.row)">
                查看其他设备
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <otherApplianceForm v-if="otherAppliance" :callback="handleClose" :data="data"></otherApplianceForm>
      <charts :list="tableData"></charts>
    </el-form>
  </div>
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
  import Retrieve from "../../Retrieve";
  import WorkMould from "../../mould/WorkMould";
  import TableColumnHeader from "../../Table/TableColumnHeader";
  import paramJson from "./applianceParam"; //同目录下json数据
  import otherApplianceForm from "./otherApplianceForm"; //引入其他设备弹层
  import charts from "./charts"; //图表
  export default {
    name:"applianceWarning",//标准器预警
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      otherApplianceForm,
      charts
    },
    data() {
      return {
        tableData:[],
        departmentOptions:[],//检测部门option
        testCompanyOptions:[],//检定单位option
        testDepartment:"",//检测部门名
        departId:"",//检测部门id
        testCompany:"",//检定单位名
        data:"",//传到其他设备弹层的数据
        otherAppliance:"",//其他设备弹层

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
      querySearch(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        let params = queryString
          ? {
            testCompany: queryString,
            fuzzySearch: 1
          }
          : "";
       ajaxProxyRequest("get", "/njmind/findParam/verificationMechanism", {}, res => {//检定单位
         this.handleResult(res.list);
         cb(res.list);
        });
      },
      handleResult(res) {
        for (let key in res) {
          Vue.set(res[key], "value", res[key].remark);
        }
      },
      handleSelect(item) {
//        this.testCompanyId=item.code;
      },
      handleIconClick(ev) {
        console.log(ev);
      },
      goDevice(row){//跳转查询仪器设备页面
        this.$router.push({
          path: '/admin/343',
          query:{
          }
        })
      },
      openOtherAppliance(row){//打开其他设备弹层
        this.otherAppliance=true;
        this.data=row;
      },
      handleClose(){//关闭其他设备弹层
        this.otherAppliance=false;
      },
      getTableList(){
        ajaxRequest('get','back/statistics/instWarning',{
          departId:this.departId,//检测部门id
          calibrationInstitutiOn:this.testCompany,//检定单位名
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
