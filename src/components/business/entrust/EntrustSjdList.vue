<!-- 委托器具列表 传入报价单ID查询-->
<template>
   
  <div>
    <div  class="el-tab_head" style="float:left;">
        <el-button v-has="'M16715'" size="small" type="danger" icon="el-icon-delete" 
        v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,multipleSelection)}" >批量删除</el-button>
    </div>
     <div style="font-size:14px;text-align:center;">
      <!-- 合计：
      {{totalCount}}条报检记录
      {{totalSetNumber}}套
      需出{{ totalCertificateNumber}}份证书
      加急{{totalUrgentNumber}}套
      分包{{ totalSubcontractAreaNumber}}套 -->

      <span style="font-size:14px;">
      合计：
      <span style="font: bold 16px 微软雅黑;color:black">{{totalCount}}</span>条报检记录
      <span style="font: bold 16px 微软雅黑;color:black">{{totalSetNumber}}</span>套
      需出<span style="font: bold 16px 微软雅黑;color:black">{{ totalCertificateNumber}}</span>份证书
      加急<span style="font: bold 16px 微软雅黑;color:red">{{totalUrgentNumber}}</span>套
      分包<span style="font: bold 16px 微软雅黑;color:blue">{{ totalSubcontractAreaNumber}}</span>套
    </span>
    </div>
    <el-table :data="tableData" :max-height="QJTableMaxHeight" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="registrationNo" min-width="100" label="登记号"></el-table-column>
      <el-table-column prop="orderSingleNo" min-width="100" label="流转单号" :formatter="orderSingleNoFormat"></el-table-column>
      <el-table-column prop="applianceName" label="器具名称" show-overflow-tooltip=true width="180"></el-table-column>
      <el-table-column prop="setNumber" label="套数">
        <template slot-scope="scope">
                  {{scope.row.setNumber}}<span v-if="scope.row.returnNumber > 0" style="color:red">/{{scope.row.returnNumber}}</span>
              </template>
      </el-table-column>
      <el-table-column prop="pieceNumber" label="件/套"></el-table-column>
      <el-table-column prop="certificateNumber" label="证书数量"></el-table-column>
      <el-table-column prop="detectionDeadline" min-width="100" label="检测期限" :formatter="detectionDeadlineFormat"></el-table-column>
      <el-table-column prop="departName" label="检测部门 "></el-table-column>
      <el-table-column prop="postName" label="检测岗位 "></el-table-column>
      <el-table-column prop="model" label="型号规格" width="180"></el-table-column>
      <el-table-column prop="factoryNo" label="出厂编号"></el-table-column>      
      <el-table-column prop="isUrgent" label="是否加急" :formatter="isUrgentFormat"></el-table-column>
      <el-table-column prop="isCompulsoryVerify" label="是否强检" :formatter="isCompulsoryVerifyFormat"></el-table-column>
      <el-table-column prop="subcontractAreaName" label="是否分包" ></el-table-column>
      <el-table-column v-if="powerRight" label="操作" fixed="right" width="80px">
        <template slot-scope="scope">
          <el-button v-has="'M16712'" @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
            <i class="el-icon-edit-outline" title="编辑"></i>
          </el-button>
          <el-button v-has="'M16717'" v-if="scope.row.finishFlag == 0" :disabled="scope.row.feeStatus == 0" v-mindPopover="{message:'确认手工完成?',success:handleFinish.bind(this,scope.row)}" type="text" style="padding:0;font-size:18px;">
            <i class="el-icon-success" title="手工完成"></i>
          </el-button>
          <!-- <el-button v-has="'M16715'" v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,[scope.row])}" type="text" style="padding:0;font-size:18px;">
            <i class="el-icon-delete" title="删除"></i>
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    
    <EntrustSjdForm v-if="!!edit" :data="edit" :callback="handleSjdEditCallback"></EntrustSjdForm>
  </div>
</template>

<script>
  import EntrustSjdForm from './EntrustSjdForm';
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest,ajaxProxyRequest,ajaxSyncRequest,formatDate} from '../../util/base';
  var Big = require('big.js');
  //引入jquery
  import $ from 'jquery';


/*   import {
    Button,
    Checkbox,
    CheckboxGroup,
    Col,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
    Row,
  } from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox); */

  export default {
    name: "EntrustSjdList",
    data(){
      return {
        edit:null,
        tableData: [],
        powerRight: false,
      multipleSelection: [],
      }
    },
    components: {EntrustSjdForm},
    props: {//用于接收从父组件中传来的数据
      wtdId: {
        type: Number
      },
      serviceDate:{
        type: Date
      },
      callback: {
        type: Function
      }
    },
    mounted() {
      this.getPowerRight();
      this.getTableData();
    },
    computed:{
        totalCount:function(){
        return this.tableData.length;
        },
        totalSetNumber:function(){
        let num = 0;
        this.tableData.forEach((v) => {
          v.setNumber ? num += parseInt(v.setNumber) : null;
        })
        return num
        },
        totalCertificateNumber:function(){
        let num = 0;
        this.tableData.forEach((v) => {
          v.certificateNumber ? num += parseInt(v.certificateNumber) : null;
        })
        return num
        },
        totalUrgentNumber:function(){
        let num = 0;
        this.tableData.forEach((v) => {
          let isUrgent = 0;
          try{
            isUrgent = v.urgentDayPercent.split("@@")[0];
          }catch(e){
            isUrgent = v.isUrgent;
          }
          isUrgent > 0 ? (v.setNumber ? num += parseInt(v.setNumber) : 0) : 0;
        })
        return num
        },
        totalSubcontractAreaNumber:function(){
        let num = 0;
        this.tableData.forEach((v) => {
          v.subcontractArea > 0 ? (v.setNumber ? num += parseInt(v.setNumber) : 0) : 0;
        })
        return num
        },
    },
    methods:{
      getPowerRight(){
        let _this = this;
        let buttonpermsStr=window.localStorage.getItem("btnPower");
        if(!!buttonpermsStr) {//没有权限，所有涉及权限的按钮都不展示
          // let right = ['M16712','M16715'];
          let right = ['M16712','M16717'];
          right.forEach(function(value){
             if(buttonpermsStr.indexOf("@"+value+"@") != -1){
              _this.powerRight = true;
              return;
             }
          });
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getTableData(){
        let _this = this;
        if(_this.wtdId){
          ajaxRequest('get', 'back/entrustSjd/getEntrustSjdDetails', {wtdId:_this.wtdId}, (res) => {
            this.tableData = res.rows;
            this.multipleSelection = [];
          })

        }
      },
      handleEdit(rowInfo){
        rowInfo.serviceDate = this.serviceDate;
        this.edit = rowInfo || {}
      },
      handleSjdEditCallback(rowInfo){
        if(rowInfo){
          this.edit=null;
          this.getTableData();
          this.$emit('getFormData');
        }else{
          this.edit=null;
        }
      },
      handleFinish(rowInfo){
        let registrationNo = rowInfo.registrationNo;
        ajaxRequest('post', 'back/entrustSjd/finishByHand', {registrationNo: registrationNo}, function (res) {
            if (res.code === 200) {
              this.$message.success('设置完检成功');
              this.getTableData();
              this.$emit('getFormData');//重新加载数据
            }
            else {
              this.$message.error('设置完检失败');
            }
          }.bind(this))

      },
      handleDelete(data){
        if (data.length > 0) {
          let registrationNos = data.map(function (v) {
            return v.registrationNo
          }).join(",");
          ajaxRequest('post', 'back/entrustSjd/list/'+registrationNos, {_method: 'delete'}, function (res) {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.getTableData();
              this.$emit('getFormData');//重新加载数据
            }
            else {
              this.$message.error('删除失败');
            }
          }.bind(this))
        } else {
          this.$message({
            message: '请先选择要删除的数据',
            type: 'warning'
          })
        }
      },
      isUrgentFormat(row, column){
        if (row.isUrgent==0) {
          return "否"
        } else {
          return row.isUrgent + "天" + row.urgentProportions + "%";
        }
      },
      isCompulsoryVerifyFormat(row,column){
        if(row.isCompulsoryVerify == 0){
          return "否";
        }else{
          return "是";
        }
      },
      detectionDeadlineFormat(row,column){
        return formatDate(row.detectionDeadline,'YYYY-MM-DD');
      },
      orderSingleNoFormat(row,column){
        // return <a href=''>row.orderSingleNo</a>;
        return row.orderSingleNo;
      }

    },
  }
</script>

<style scoped>

</style>
