<template>
  <div>
      <el-form ref="form" :model="form" label-width="140px">
        <div style="padding-top: 10px">
          <el-row>
            <el-col :span="12">
              <el-form-item  prop="billNo">
                <template slot = "label">
                  <span>缴费单编号</span>
                  <el-tooltip class="item" effect="dark" content="您可点击缴费单编号查看缴费单详情">
                    <i class="el-icon-info ft12"></i>
                  </el-tooltip>
                </template>
                <span style="color: blue;font-weight: bold;cursor:pointer;" @click="getBillDetail">{{form.billNo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="缴费单金额" prop="billMoney">
                <span style="color: red;font-weight: bold">{{form.billMoney}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-Row>
            <el-col :span="12">
              <el-form-item label="缴费单名称" prop="billName">
                <el-input disabled="disabled" v-model="form.billName"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="单位联系人" prop="companyContact">
                <el-input disabled="disabled" v-model="form.companyContact"></el-input>
              </el-form-item>
            </el-col>
              <el-col :span="12">
                <el-form-item label="单位地址" prop="companyAddress">
                    <el-input disabled="disabled" v-model="form.companyAddress"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
              <el-form-item label="单位联系电话" prop="companyPhone">
                    <el-input disabled="disabled" v-model="form.companyPhone"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input disabled="disabled" v-model="form.remark" ></el-input>
              </el-form-item>
              </el-col>
          </el-Row>
        </div>

      </el-form>

    <commonBillDetail v-if="!!edit" :data="edit" :callback="handleEditCallback"></commonBillDetail>


  </div>
</template>

<script>
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入右击事件 可自行绑定到输入框
  import ElRow from "element-ui/packages/row/src/row";
  import commonBillDetail from "./commonBillDetail.vue";

  const defaults = {
    hoho:''
  };
  export default {
    name: "common-bill-detail",
    props: {//用于接收从父组件中传来的数据
      id: {
        type: Number,
        required:true
      },
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        edit: null,
        tempId: 0,
      }
    },
    watch: {
      tempId() {
        this.getBillInfo(this.id);
      },
      id() {
        this.tempId = this.id
      },
    },
    mounted(){
     /* this.getBillInfo(this.id);*/
     this.tempId = this.id;
    },
    components: {
      commonBillDetail
    },
    methods: {//方法定义
      getBillInfo(id){
        console.log("common-bill-detail",id);
        let _this = this;
        if(id!=null && id!="") {
          ajaxRequest('get', 'back/bill/' + id, {}, (res) => {
            if (res.code === 200) {
              _this.form = res.daoResult;
            }
          })
        }
      },
      //缴费单详情页面
      getBillDetail(){
        this.edit = this.form;
        console.log(this.form)
      },
      handleEditCallback(){
        this.edit = null;
      }
    },
  }
</script>

<style>
   <!-- 右键菜单样式设置 -->
  .right-click-menu{
    position:fixed;
    border:1px solid #ccc;
    padding: 2px 0;
    background:#fff;
    width:100px;
    z-index:9999;
  }
  .right-click-menu li{
    padding:3px 10px;
    cursor:default;
    font-size:14px;
    color:#606266;
  }
  .right-click-menu li:hover{
    color:#409eff;
  }
  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
</style>
