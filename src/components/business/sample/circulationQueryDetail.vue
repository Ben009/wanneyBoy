<template>
  <el-form ref="form" class="sampleForm" label-width="150px">
    <div>
      <el-Row :gutter="20" style="text-align: center;">
        查询条件：登记号：{{djh}}
        <el-button @click="goBack"  style="float: right;margin-right:10px;">返回</el-button>
        <el-button type="primary" @click="refresh" style="float: right;margin-right:10px;">刷新</el-button>
      </el-Row>
      <el-Row :gutter="20" style="text-align: center">
        <span class="djhsc blue">登记号生成</span>
        <span>
          <span class="arrowLine"></span>
          <span class="triangle"></span>
        </span>
        <!--<img src="../../assets/img_login/ProjectFlow_Duan.JPG" />-->
        <span class="sczs red">生成证书</span>
        <span>
          <span class="arrowLine"></span>
          <span class="triangle"></span>
        </span>
        <span class="zsjd">证书检定</span>
        <span>
          <span class="arrowLine"></span>
          <span class="triangle"></span>
        </span>
        <span class="zshy">证书核验</span>
        <span>
          <span class="arrowLine"></span>
          <span class="triangle"></span>
        </span>
        <span class="zszg">证书主管</span>
        <span>
          <span class="arrowLine"></span>
          <span class="triangle"></span>
        </span>
        <span class="rk">入库</span>
        <span>
          <span class="arrowLine"></span>
          <span class="triangle"></span>
        </span>
        <span class="ck">出库</span>
      </el-Row>
    </div>
    <div>
      <global-tootips  style="float: right">
        <p><span style="color:blue">蓝色</span>表示已完成<span style="color:red">红色</span>表示即将要做的；</p>
      </global-tootips>
    </div>
    <div style="padding:10px 0;font-weight: 600">检测单信息</div>
    <div>
      <el-table
        ref="table"
        :data="tableData"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column
          label="登记号"
          >
          <template slot-scope="scope">
            <span @click="goCost" style="color:deepskyblue;cursor:pointer;">{{scope.row.registrationNo}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="送检单位"
          >
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
          >
        </el-table-column>
        <el-table-column
          prop="setNumber"
          label="套数"
          >
        </el-table-column>
        <el-table-column
          prop="certificateNumber"
          label="证书数量"
          >
        </el-table-column>
        <el-table-column
          prop="departName"
          label="检测部门"
          >
        </el-table-column>
        <el-table-column
          prop="entrustDate"
          label="委托日期"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="detectionDeadline"
          label="检测期限"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="planTime"
          label="任务时间"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="rlr"
          label="认领人"
          >
        </el-table-column>
        <el-table-column
          prop="rlsj"
          label="认领时间"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="inspector"
          label="执行人"
          >
        </el-table-column>
      </el-table>
    </div>
    <div style="padding:10px 0;font-weight: 600">
      证书流程
      <span style="color:red">（点击证书编号查看相应证书）</span>
    </div>
    <div>
      <el-table
        ref="table2"
        :data="tableData2"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column
          label="证书编号"
          prop="zsbh"
          >
          <template slot-scope="scope">
            <span @click="goCertificateFlow(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.zsbh}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="zsqjmc"
          label="证书器具名称"
          >
        </el-table-column>
        <el-table-column
          prop="zsjdrq"
          label="校验日期"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="addUser"
          label="添加人"
          >
        </el-table-column>
        <el-table-column
          prop="jdr"
          label="检定人"
          >
          <template slot-scope="scope">
            <span>{{scope.row.jdr}}</span>
            [
            <span v-if="scope.row.jdrSh==0" style="color:red">未审核</span>
            <span v-if="scope.row.jdrSh==1" style="color:red">已审核</span>
            ]
          </template>
        </el-table-column>
        <el-table-column
          prop="hyy"
          label="核验人"
          >
          <template slot-scope="scope">
            <span>{{scope.row.hyy}}</span>
            [
            <span v-if="scope.row.hyySh==0" style="color:red">未审核</span>
            <span v-if="scope.row.hyySh==1" style="color:red">已审核</span>
            ]
          </template>
        </el-table-column>
        <el-table-column
          prop="pzr"
          label="批准人"
          >
          <template slot-scope="scope">
            <span>{{scope.row.pzr}}</span>
            [
            <span v-if="scope.row.pzrSh==0" style="color:red">未审核</span>
            <span v-if="scope.row.pzrSh==1" style="color:red">已审核</span>
            ]
          </template>
        </el-table-column>
        <el-table-column
          prop="isPrint"
          label="是否打印"
          >
        </el-table-column>
      </el-table>
    </div>
    <div style="margin:10px 0;">需出证书<span class="red">{{needNum}}</span>份，已出证书<span class="red">{{alreadyNum}}</span>份。<span style="cursor: pointer;" class="blue" @click="openCertificateFlow">点击查看所有未出证书编号</span></div>
    <div style="padding:10px 0;font-weight: 600">
      证书申请记录
      <span style="color:red">（点击证书编号查看相应证书修改记录）</span>
    </div>
    <div>
      <el-table
        ref="table3"
        :data="tableData3"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column
          label="证书编号"
          >
          <template slot-scope="scope">
            <span @click="goCertificateApply(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.registrationNo}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="修改申请人"
          >
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="申请时间"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="setNumber"
          label="申请原因"
          >
        </el-table-column>
        <el-table-column
          prop="creator"
          label="处理人"
          >
        </el-table-column>
        <el-table-column
          prop="setNumber"
          label="处理时间"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="returnNumber"
          label="指定修改人"
          >
        </el-table-column>
        <el-table-column
          prop="jdy"
          label="修改时间"

          :formatter="dealDate">
        </el-table-column>
      </el-table>
    </div>
    <div style="padding:10px 0;font-weight: 600">
      证书修改记录（仅支持按登记号查询,其它条件查询不出现结果）
    </div>
    <div>
      <el-table
        ref="table4"
        :data="tableData4"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="zsbh"
          label="证书编号"
          >
        </el-table-column>
        <el-table-column
          prop="xglx"
          label="修改类型"
          >
        </el-table-column>
        <el-table-column
          prop="xgr"
          label="修改人"
          >
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="修改时间"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          label="查看痕迹"

          width="80">
          <template slot-scope="scope">
            <el-button class="el-button el-button--primary" type="button" @click="openCertificateModify(scope.row)" disabled>
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="padding:10px 0;font-weight: 600">
      流转单流程</span>
    </div>
    <div>
      <el-table
        ref="table5"
        :data="tableData5"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="registrationNo"
          label="登记号"
          >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          >
        </el-table-column>
        <el-table-column
          prop="receivePersonName"
          label="交接人"
          >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="日期"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="creatorName"
          label="操作人"
          >
        </el-table-column>
      </el-table>
    </div>
    <div style="padding:10px 0;font-weight: 600">
      检测流程
    </div>
    <div>
      <el-table
        ref="table6"
        :data="tableData6"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column
          label="登记号"
          prop="registrationNo"
          >
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
          >
        </el-table-column>
        <el-table-column
          prop="applyType"
          label="申请类型"
          >
        </el-table-column>
        <el-table-column
          prop="applyTime"
          label="申请时间"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="applyPerson"
          label="申请人"
          >
        </el-table-column>
        <el-table-column
          prop="applyReason"
          label="申请原因"
          >
        </el-table-column>
        <el-table-column
          prop="bmShFlag"
          label="部门处理结果"

          :formatter="function(row, column, cellValue, index){return cellValue==0?'未审核':cellValue==1?'审核通过':cellValue==2?'退回':''}">
        </el-table-column>
        <el-table-column
          prop="bmShr"
          label="部门处理人"
          >
        </el-table-column>
        <el-table-column
          prop="bmShTime"
          label="部门处理时间"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="shFlag"
          label="处理结果"

          :formatter="function(row, column, cellValue, index){return cellValue==0?'未审核':cellValue==1?'审核通过':cellValue==2?'退回':''}">
        </el-table-column>
        <el-table-column
          prop="shr"
          label="处理人"
          >
        </el-table-column>
        <el-table-column
          prop="shTime"
          label="处理时间"

          :formatter="dealDate">
        </el-table-column>
      </el-table>
    </div>
    <div style="padding:10px 0;font-weight: 600">
      样品库房查询
    </div>
    <div>
      <el-table
        ref="table7"
        :data="tableData7"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column
          label="登记号"
          prop="registrationNo"
          >
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
          >
        </el-table-column>
        <el-table-column
          prop="cz"
          label="操作"
          >
        </el-table-column>
        <el-table-column
          prop="sampleWarehouseNo"
          label="货柜号"
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
          prop="lqr"
          label="领取人"
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
    <div style="padding:10px 0;font-weight: 600">
      证书库房查询
    </div>
    <div>
      <el-table
        ref="table8"
        :data="tableData8"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column
          label="登记号"
          prop="registrationNo"
          >
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
          >
        </el-table-column>
        <el-table-column
          prop="cz"
          label="操作"
          >
        </el-table-column>
        <el-table-column
          prop="certificateWarehouseNo"
          label="货柜号"
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
          prop="lqr"
          label="领取人"
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
    <div style="padding:10px 0;font-weight: 600">
      原始记录流程：
      <span style="color:red">（点击证书编号查看相应相应记录）</span>
    </div>
    <div>
      <el-table
        ref="table9"
        :data="tableData9"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column
          label="记录编号"
          >
          <template slot-scope="scope">
            <span @click="goYsjl(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.zsbh}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="zsmc"
          label="记录名称"
          >
        </el-table-column>
        <el-table-column
          prop="qjmc"
          label="器具名称"
          >
        </el-table-column>
        <el-table-column
          prop="addPersonName"
          label="添加人"
          >
        </el-table-column>
        <el-table-column
          prop="jdy"
          label="检定人"
          >
        </el-table-column>
        <el-table-column
          prop="hyy"
          label="核验人"
          >
        </el-table-column>
      </el-table>
    </div>
    <div style="padding:10px 0;font-weight: 600">
      原始记录交接查询
    </div>
    <div>
      <el-table
        ref="table10"
        :data="tableData10"
        border
        style="width: 100%"
        :fit="true">
        <el-table-column
          label="登记号"
          prop="registrationNo"
          >
        </el-table-column>
        <el-table-column
          prop="changePerson"
          label="交接人"
          >
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="操作时间"

          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="操作人"
          >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          >
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center;padding:10px 10px;">
      <el-button @click="goBack">返回</el-button>
    </div>
    <certificateFlowForm v-if="!!certificateFlow" :data="certificateFlow" :callback="handleFlowCallback"></certificateFlowForm>
  </el-form>
</template>

<style>

</style>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入证书流程弹层
  import certificateFlowForm from './certificateFlowForm';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";

    export default {
        data() {
            return {
              paramObj: this.$route.query,
              djh:"",//登记号
              certificateFlow:null,//证书流程弹层
              needNum:"",//需出证书份数
              alreadyNum:"",//已出证书份数
              tableData:[],
              tableData2:[],
              tableData3:[],
              tableData4:[],
              tableData5:[],
              tableData6:[],
              tableData7:[],
              tableData8:[],
              tableData9:[],
              tableData10:[],
            }
        },
      components:{
        certificateFlowForm
      },
        methods:{
          getTableList(){
            if(this.$route.query.data){
              this.djh=this.$route.query.data;
              ajaxRequest('get','back/exchange/getDjhInfo',{//流转单查询
                bh:this.djh,
              },(res)=>{
                if(res.code===200){
                  this.needNum=res.daoResult.zsSumCount;
                  this.alreadyNum=res.daoResult.zsCount;
                  this.tableData=res.daoResult.sjdList;//送检单
                  this.tableData2=res.daoResult.zsList;//证书流程
                  //证书申请记录
                  this.tableData4=res.daoResult.zsxgList;//证书修改记录
                  this.tableData5=res.daoResult.bhlist;//流转单
                  this.tableData6=res.daoResult.changeList;//检测流程
                  this.tableData9=res.daoResult.ysjlList;//原始记录流程
                }else{
                  this.$message.error(res.msg);
                }
              })
              ajaxRequest('get','back/ruku/getRukuInfo',{//样品库房信息，证书库房信息
                bh:this.djh,
                state:2,
              },(res)=>{
                if(res.code===200){
                  this.tableData7=res.daoResult.bhlist;
                  this.tableData8=res.daoResult.bhlist;
                }else{
                  this.$message.error(res.msg);
                }
              })
              ajaxRequest('get','back/guarantee/ysjljjList',{//原始记录交接查询
                bh:this.djh,
              },(res)=>{
                if(res.code===200){
                  this.tableData10=res.daoResult.bhList;
                }else{
                  this.$message.error(res.msg);
                }
              })
            }
          },
          goCost(){//费用历史操作页面
            this.$router.push({
              path: '/admin/571',
              query:{
                djh:this.djh,
              }
            })
          },
          openCertificateFlow(rowInfo){//弹层-点击查看所有未出证书编号
            this.certificateFlow=rowInfo || {};
          },
          goCertificateFlow(rowInfo){//点击证书编号查看相应证书

          },
          openCertificateModify(rowInfo){//证书修改记录弹层

          },
          goYsjl(rowInfo){//点击相应编号查看原始记录流程

          },
          goOriginalRecordFlow(rowInfo){//原始记录流程打印页面

          },
          initState(){//获取完成情况，蓝色已完成，红色即将要做

          },
          handleApplyCallback(rowInfo){
            this.certificateApply = null;
          },
          handleFlowCallback(rowInfo){
            this.certificateFlow = null;
          },
          dealDate: function (row, column, cellValue) {
            if(cellValue===""||cellValue===null||cellValue===undefined){
              return "";
            }else{
              return new Date(cellValue).format('YYYY-MM-DD');
            }
          },
          refresh(){
            this.getTableList();
          },
          goBack(){
            this.$router.push({
              path:'/admin/567',
            })
          },
        },
      mounted(){
          this.getTableList();
      }
    }
</script>

<style scoped>
  .arrowLine{
    width: 27px;
    height: 4px;
    background-color: green;
    display: inline-block;
    margin-bottom: 4px;
  }
  .triangle {
    display: inline-block;
    position: relative;
    width: 0;
    height: 0;
    border: 7px solid transparent;
    border-left-color: green;
    left:-6px;
  }
  .red{
    color:red;
  }
  .blue{
    color:blue;
  }
 </style>
