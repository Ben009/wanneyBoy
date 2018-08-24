<template>
  <div style="position:relative;width: 100%;text-align: center">
    <div>
      请输入登记号：
      <el-autocomplete v-model="registrationNo" placeholder="请输入登记号" style="width: 30%" v-focusSelect
                       :trigger-on-focus="false" :fetch-suggestions="querySearch" @select="handleSelect">
      </el-autocomplete>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
      <div class="el-icon-info  shuoming" >
        <span class="el-sm" style="text-align: left">
          <p>1、无权限人员仅可针对本部门登记号录入费用；</p>
          <p>2、本页面仅可通过登记号录入费用，建议在原始记录或证书编制时录入费用，或通过未完成任务节点录入费用。</p>
        </span>
      </div>
      <!--费用录入弹窗页面-->
      <chargeAdd v-if="!!edit" :data="edit" :callback="handleEditCallback"></chargeAdd>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue';
  import $ from 'jquery';
  import {ajaxRequest} from '../../util/base';
  import chargeAdd from './chargeAdd.vue';


    export default {
        name: "to-charge-add",
      data() {
        return {
          restaurants: [],
          registrationNo:"",
          edit:null
        }
      },
      methods:{
        //下拉匹配送检单列表
        querySearch(queryString, cb) {
          let _this = this;
          _this.restaurants=[];
          ajaxRequest("get", "back/charge/getregistrationNoList", {registrationNo:this.registrationNo}, res => {
            if (res.code === 200) {
              for(let i=0;i<res.rows.length;i++){
                let obj = new Object();
                obj.value=res.rows[i].registrationNo.toString();
                _this.restaurants.push(obj);
              }
              cb(_this.restaurants);
            }
          });
        },
        //选择列表事件
        handleSelect() {
          this.handleSubmit();
        },
        //提交验证送检单是否可收费
        handleSubmit(){
          var regu = /^[1-9]\d*$/;
          if (!regu.test(this.registrationNo)) {
            this.$message.error("无效登记号，请重新输入");
            this.registrationNo="";
            $('input').eq(0).focus();
            return;
          }
          ajaxRequest("get", "back/entrustSjd/getEntrustSjdDetails",{registrationNo:this.registrationNo,feeStatus:0,type:"1"}, res => {
            if (res.code === 200) {
              if(res.rows.length > 0){
                this.edit=res.rows[0];
              }else{
                this.$message.error("此登记号不满足录入费用条件！");
                $('input').eq(0).focus();
                this.registrationNo="";
              }
            }else{
              this.$message.error("数据异常，请联系系统管理员！");
              $('input').eq(0).focus();
              this.registrationNo="";
            }
          });
        },
        //回调事件
        handleEditCallback(){
          this.edit=null;
          this.registrationNo="";
        }
      },
      components:{
        chargeAdd
      },
      mounted() {
        $('input').eq(0).focus();
      }
    }
</script>
<style>
  .ft12{
    font-size: 12px;
  }
  .shuoming {
    border: none !important;
    color: #56BC4E !important;
    font-size: 16px !important;
  }

  .shuoming::after {
    content: "";
    width: 18px;
    height: 35px;
    /* background: white; */
    position: absolute;
    /* z-index: 999; */
    /* top: 0; */
    /* left: -65px; */
    margin-left: -16px;

  }

  .el-sm {
    background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 1px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -318px;
    word-break: break-all;
    margin-top: 19px;
    padding: 4px 5px;
    font-size: 14px;
    opacity: 50;
    float: right;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }

  .shuoming .el-sm {
    display: none;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }

  .shuoming .el-sm {
    display: none;
  }

  .shuoming:hover .el-sm {
    display: block;
  }
</style>

