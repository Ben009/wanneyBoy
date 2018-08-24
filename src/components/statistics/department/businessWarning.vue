<template>
  <div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="3">
            <el-form-item label="是否现场" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否强检" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否加急" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="出证进度" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否异常" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="汇总字段" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="检测部门" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="检测岗位" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="isScene" placeholder="请选择">
                <el-option
                  v-for="item in sceneOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="isStrongInspection" placeholder="请选择">
                <el-option
                  v-for="item in strongInspectionOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="isUrgent" placeholder="请选择">
                <el-option
                  v-for="item in urgentOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="status" placeholder="请选择">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="isAbnormal" placeholder="请选择">
                <el-option
                  v-for="item in abnormalOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="summary" placeholder="请选择">
                <el-option
                  v-for="item in summaryOptions"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
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
          <el-col :span="3">
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
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span v-if="sum=='1'" @click="openRegistration(scope.row,1)" style="color:deepskyblue;cursor:pointer;">{{scope.row.departName}}</span>
              <span v-if="sum=='2'" @click="openRegistration(scope.row,2)" style="color:deepskyblue;cursor:pointer;">{{scope.row.postName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="wts" label="委托数"></el-table-column>
          <el-table-column prop="djhs" label="登记号数"></el-table-column>
          <el-table-column prop="ts" label="套数"></el-table-column>
          <el-table-column prop="js" label="件数"></el-table-column>
        </el-table>
      </div>
      <businessForm v-if="registrationNo" :departmentOrPost="departmentOrPost" :callback="handleClose" :data="data"></businessForm>
      <businessChart :list="tableData" v-if="demo" :sum="sum" :height="chartHeight" :width="chartWidth"></businessChart>
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
  //引入登记号弹层
  import businessForm from "./businessForm";
  import businessChart from "./businessChart"; //图表
  export default {
    name:"businessWarning",//业务预警
    components: {
      businessForm,
      businessChart
    },
    data() {
      return {
        tableData:[],
        sceneOptions:[],//现场option
        strongInspectionOptions:[],//强检option
        urgentOptions:[],//加急option
        abnormalOptions:[],//异常option
        statusOptions:[],//出证进度option
        summaryOptions:[],//汇总字段option
        departmentOptions:[],//检测部门option
        postOptions:[],//检测岗位option
        isScene:"",//是否现场
        isStrongInspection:"",//是否强检
        isUrgent:"",//是否加急
        isAbnormal:"",//是否异常
        status:"",//出证进度
        summary:"1",//汇总字段
        testDepartment:"",//检测部门名
        departId:"",//检测部门id
        testPost:"",//检测岗位名
        postId:"",//检测岗位id
        sum:"1",//控制显示的汇总字段
        registrationNo:false,//登记号弹层
        departmentOrPost:"",//登记号弹层查看部门还是岗位
        data:{},//传到登记号弹层的数据
        demo:true,//图表
        chartWidth:"",//图表
        chartHeight:"",//图表
      }
    },
    methods:{
      getTableList(){
        if(this.summary==""){
          this.$message.warning('汇总字段没有选择');
          return;
        }
        ajaxRequest('get','back/statistics/yewuWarning',{
          isScene:this.isScene,//是否现场
          isStrongInspection:this.isStrongInspection,//是否强检
          isUrgent:this.isUrgent,//是否加急
          isAbnormal:this.isAbnormal,//是否异常
          status:this.status,//出证进度
          summary:this.summary,//汇总字段
          departId:this.departId,//检测部门id
          postId:this.postId,//检测岗位id
        },(res)=>{
          if(res.code===200){
            this.sum=this.summary;
            this.tableData=res.rows;
            if(this.summary=="1"){
              this.chartWidth="1000px";
              this.chartHeight="1000px";
            }else if(this.summary=="2"){
              this.chartWidth="1000px";
              this.chartHeight="1000px";
            }
            this.demo = false;
            this.$nextTick(val => {
              this.demo = true;
            });
          }else{
            this.$message.error(res.msg);
          }
        })
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
      search(){
        this.getTableList();
      },
      setOptions(){
        this.sceneOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//现场option
        this.strongInspectionOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//强检option
        this.urgentOptions=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];//加急option
        this.abnormalOptions=[{"code":"","remark":"全部"},{"code":"1","remark":"无"},{"code":"2","remark":"退"},{"code":"3","remark":"延"},{"code":"4","remark":"退延"}];//异常option
        this.statusOptions=[{"code":"","remark":"全部"},{"code":"1","remark":"未出证"},{"code":"2","remark":"已出部分"},{"code":"3","remark":"已出全"}];//出证进度option
        this.summaryOptions=[{"code":"1","remark":"检测部门"},{"code":"2","remark":"检测岗位"}];//汇总字段option
        ajaxRequest("get","back/statistics/getDepartList",{isDelete: 0},res => {//检测部门
            if (res.code === 200) {
              this.departmentOptions = res.rows;
            }
          }
        );
      },
      exportList(){//导出

      },
      openRegistration(row,type){//打开登记号弹层
        this.registrationNo=true;
        this.departmentOrPost=type;//1是部门，2是岗位
        if(this.departmentOrPost==1){
          this.data.departId=row.departId;
          this.data.postId="";
        }else{
          this.data.postId=row.postId;
          this.data.departId="";
        }
      },
      handleClose(){//关闭登记号弹层
        this.registrationNo=false;
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
