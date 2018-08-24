<template>
  <div class="entrust-item companyContentHeader">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first" :key="1"><companyForm :data="form" :audit="audit" :isWatch="isWatch" :isPut="isPut" @willBack="handleBack" @enableClick="handleEnable"/></el-tab-pane>
      <el-tab-pane label="更多单位信息" name="second" :key="2"  :disabled="isDisabledTrue"><moreInfoList  :isWatch="isWatch" :data="form" :isPut="isPut"  @willBack="handleBack"/></el-tab-pane>
      <el-tab-pane label="合同信息" name="eighth" :key="8" :disabled="isDisabledTrue"><historyList :audit="audit" :isWatch="isWatch" :data="form" :isPut="isPut"  @willBack="handleBack"/></el-tab-pane>
      <!--<el-tab-pane label="合并、审核" name="third" :key="key.third">角色管理</el-tab-pane>-->
      <el-tab-pane label="特殊价格" name="fourth" :key="4" :disabled="isDisabledTrue"><priceList  :isWatch="isWatch" :data="form" :isPut="isPut"  @willBack="handleBack"/></el-tab-pane>
      <el-tab-pane label="回访/拜访" name="fifth" :key="5" :disabled="isDisabledTrue"><companyVisitTab :data="form"  :isWatch="isWatch"  :isPut="isPut" @willBack="handleBack"/></el-tab-pane>
      <!--<el-tab-pane label="业务清单" name="sixth" :key="key.sixth">定时任务补偿</el-tab-pane>-->
      <!--<el-tab-pane label="企业台账" name="seventh" :key="key.seventh">定时任务补偿</el-tab-pane>-->
      <template v-if="(!!data.id)&& !isWatch">
        <el-tab-pane  name="exist" v-if="!audit"> <el-button slot="label" type="danger" style="border:1px solid #8da3d6; color:#602666;" > 返回</el-button></el-tab-pane>
      </template>
    </el-tabs>
    <div class="el-icon-info  shuoming" v-if=" (!( activeName == 'eighth')) && !isWatch ">
      <el-row class="el-sm">
        <template v-if="activeName == 'first'">
          <p>1、新增时，若无权限仅可新增业务组、业务员为本人的单位信息；</p> 
          <p>2、新增单位可用于报价、受理，但仍需审核；</p>  
          <p>3、您需先保存基本信息后方可维护其它信息；</p> 
        </template>
        <template v-if="activeName == 'second'">
          <p>用于维护该单位存在多个地址、联系人等情况；如某集团存在多个分部等；</p>
        </template>
        <template v-if="activeName == 'fourth'">
          <p>可通过该节点维护该客户的特殊价格条目；</p>
          <p>维护的特殊价格条目需审核后方可启用；</p>
          <p>若该客户存在生效的特殊价格条目，录入费用时将调用该特殊价格条目；</p>
        </template>
        <template v-if="activeName == 'fifth'">
          <p>用于登记客户回访拜访记录信息，登记的信息可由有权限人员处理</p>
        </template>
      </el-row>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxSyncRequest} from '../../util/base'
  import $ from 'jquery'
  import companyForm from './companyForm.vue'
  import moreInfoList from './moreInfoList.vue'
  import historyList from './historyList.vue'
  import priceList from './priceList.vue'
  import companyVisitTab from './companyVisitTab.vue'

  export default {
    name: "company-content",
    components:{
      companyForm, 
      historyList,
      moreInfoList,
      priceList,
      companyVisitTab
    },
    props:{
      data:{
        type:Object,
        // required:true,
        default:function(){
          return {
            isAdd:true,
          }
        }

      },
      callback:{
        type:Function,
        // required:true,
      },
      // 如果是进行编辑，则isPut为true
      isPut:{
        type:Boolean,
        // required:true,
        default:false,
      },
      isWatch:{
        type:Boolean,
        default:false,
      },
      // 在审核页面的状态，控制返回按键
      audit:{
        type:Boolean,
        default:false
      }
    },
    data(){

      return {
        // tabsList:['基本信息','更多单位信息','合并、审核','价格能力库','拜访记录','业务清单','企业台账','历史合同','返回'],
        tabIndex:0,
        form: $.extend({},this.data),
        activeName:'first',
        key:{
          first:1,
          second:2,
          third:3,
          fourth:4,
          fifth:5,
          sixth:6,
          seventh:7,
          eighth:8,
        },
        isDisabledTrue:false,


      }
    },
    computed:{

    },
    mounted(){
      if(!!!this.data.id){
        this.isDisabledTrue = true;
      }
      if(this.isWatch){
        this.isDisabledTrue = false;
      }
    },
    methods:{
      handleClick(tab,e){
        Vue.set(this.key,tab.name,!this.key[tab.name]);
        //this[tab.name]=!this[tab.name];

        if(tab.name=='exist'){
          this.callback(null);
        }
      },
      handleBack(){
        this.callback(null);
      },
      handleEnable(data){
        this.form=data
        this.isDisabledTrue = false;
      }
    },
  }
</script>

<style scoped>
/* .back{
  color: red;
  background-color: black;
} */
.custom-1d74b7 .el-button--danger:focus, .custom-1d74b7 .el-button--danger:hover {
    background: none!important;
    border-color:#409eff!important;
    /*color: #fff;*/
}
/********说明样式*********/
.el-sm{background: #ffffff;
      position: absolute;
      z-index: 999;
      -webkit-box-shadow: 1px 7px 33px -9px #969696;
      box-shadow: 1px 7px 33px -9px #969696;
      border: 1px solid #56bc4e8c;
      border-radius: 5px;
      color: dimgrey;
      margin-left: -361px;
      word-break: break-all;
      margin-top: 18px;
      padding: 4px 5px;
      font-size: 14px;
      opacity: 50;
      float: right; -webkit-transition: all 0.8s;transition: all 0.8s;}
    .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;position: absolute;right: 10px;top: 5px;}
    .shuoming::after{
      content: "";
      width: 35px;
      height: 40px;
      /*background: #fff;*/
      position: absolute;
      z-index: 999;
      /* top: 0; */
      /* left: -65px; */
      margin-left: -16px;
    }
    .shuoming .el-sm{
      display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
    }
    .companyContentHeader{
      position: relative;
    }
</style>
