<template>
  <mind-dialog
    :title="'关联到款'"
    :visible="true"
    dialogSize="large"
    center
    v-dialogDrag
    @close="handleCancel">
    <div>
      <!-- 高级查询条件 -->
      <mind-condition ref="accountRecordWhere" :op-code="opCode" :loaded="findBtn"></mind-condition>
      <!-- 查询调用按钮 -->
      <div style="width: 100%">

        <div style="text-align: center">
          <el-button type="primary"  @click="findBtn" class="el-icon-search">查询</el-button>
          <el-button type="warning"  @click="emptyCondition" class="el-icon-info">清空</el-button>
        </div>
        <span style="float: right" >
          <el-select size="mini"  v-model="isDefModule" placeholder="请选择" @change="changeModule">
            <el-option
              v-for="(item,index) in modules"
              :key="index"
              :label="item.name"
              :value="item.name">
            </el-option>
        </el-select>
          <el-button type="primary" size="mini" round @click="personalSetting(1)" class="el-icon-setting">个性化设置</el-button>
        </span>
      </div>

      <!-- TODO 案例 通用查询组件 -->
      <mind-datagrid ref="accountRecordList" :isLoad="false" :op-code="opCode" :callBack="gridCallBack" :ckbox="ckbox" setTabH="setHeightForRetS">
        <template slot="payTime" slot-scope="scope"  >
          {{scope.row.payTime|formatDateFifter}}
        </template>
      </mind-datagrid>
    </div>
    <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <el-form ref="form" :rules="rules" label-width="150px">
        <el-row style="margin-top: 10px">
          <el-button class="el-button el-button--primary" @click="associate">关联</el-button>
        </el-row>
        <el-row style="margin-top:10px;border-top:1px solid #000;padding:10px 0;">
          结账金额：{{totalBalance}}
          <span style="color:red;margin-left: 20px"></span>

        </el-row>
      <el-row>
        <el-col :span="4" style="border: 1px solid gray;border-right:0">客户单位</el-col>
        <el-col :span="4" style="border: 1px solid gray;border-right:0">到款金额</el-col>
        <el-col :span="4" style="border: 1px solid gray;border-right:0">到款余额</el-col>
        <el-col :span="4" style="border: 1px solid gray;border-right:0">到款日期</el-col>
        <el-col :span="4" style="border: 1px solid gray;border-right:0">认领金额</el-col>
        <el-col :span="4" style="border: 1px solid gray;">操作</el-col>
      </el-row>
      <el-row v-for="(claim,index) in claimData">
        <el-col :span="4" style="border-left: 1px solid gray;border-bottom: 1px solid gray;padding:5px 10px;">
          <el-input v-model="claim.paymentCompany" :disabled="true"></el-input>
        </el-col>
        <el-col :span="4" style="border-left: 1px solid gray;border-bottom: 1px solid gray;padding:5px 10px;">
          <el-input v-model="claim.payMoney" :disabled="true"></el-input>
        </el-col>
        <el-col :span="4" style="border-left: 1px solid gray;border-bottom: 1px solid gray;padding:5px 10px;">
          <el-input v-model="claim.balance" :disabled="true"></el-input>
        </el-col>
        <el-col :span="4" style="border-left: 1px solid gray;border-bottom: 1px solid gray;padding:5px 10px;">
          <el-input v-model="claim.payTime" :disabled="true"></el-input>
        </el-col>
        <el-col :span="4" style="border-left: 1px solid gray;border-bottom: 1px solid gray;padding:5px 10px;">
          <el-input v-model="claim.claimMoney"></el-input>
        </el-col>
        <el-col :span="4" style="border: 1px solid gray;border-top:0;padding:5px 10px;" class="formBtn">
          <el-button @click.prevent="deleteClaim(claim)" class="el-button el-button--danger">删除</el-button>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" >
        <el-button class="el-button el-button--primary" @click="confirmAs">确定</el-button>
        <el-button class="el-button" @click="handleCancel">取消</el-button>
    </span>
  </mind-dialog>
</template>

<style>
  .el-row {
    margin-bottom: 0!important;
  }
</style>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest,formatDate} from '../../util/base';
  import $ from 'jquery';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";


  export default {
    components: {
      ElCol,
      ElRow},
    name:"account-claim",
      props:{
        callback:{
          type:Function,
          require: true
        },
        source:{
          type:Number,
          require: true
        },
        loadClaim:{
          type:Function,
          require: true
        },
        list:{
          type:Array,
          require: true
        },
        totalBalance:{
          type:Number,
          require: true
        },
        mySourceId:{
          type:Number,
          require: true
        },
      },
        data() {
            return {
              opCode: "findAccountRecordClaimList",
              modules:[],//模板列表
              isDefModule:'',//默认模板
              ckbox:true,//是否多选 显示checkbox

              rules:{},
              claimData:[],//关联到款
              flag:true,//判断claimData是否能提交到父页面
              update:"false",//是新增还是修改
            }
        },
      methods:{
        //查询按钮调用
        findBtn() {
          //this.$nextTick(()=>{
            this.$refs.accountRecordWhere.sendParams(wheres => {
              //调用usersDataGrid查询
              //console.log("回调传入参数：", wheres);
              this.$refs.accountRecordList.findPageInfo(wheres);
            });
          //});
        },
        /** 打开个性化设置 */
        personalSetting(){//个性化设置
          this.$refs.accountRecordWhere.settingShow(true,(personalSet)=>{
            //当个性化设置打开后如果有参数变动会回调
            //console.log("设置后回调：",res);
            this.$refs.accountRecordList.changeFilter(null,personalSet);
            this.modules=personalSet.content;
            this.isDefModule=personalSet.isDefModule;
          });
        },
        /** 清空查询条件 */
        emptyCondition(){//
          this.$refs.accountRecordWhere.emptyCondition();
        },
        /** 回调 可以单datagrid使用  */
        gridCallBack(type,param1,param2){
          if(type=='modules'){
            this.modules=param1;
            this.isDefModule=param2;
          }else{
            //console.log("回调接收参数",param1);
          }
        },
        /** 模板变换 */
        changeModule(value){
          //console.log("模板变更",value);
          this.$refs.accountRecordList.changeFilter(value,null);
        },

        isUpdate(){
          if(this.claimData.length>0){
            this.update="true";
          }else{
            this.update="false";
          }
        },
        associate(){//关联
          let _this=this;
          if(_this.claimData.length==0){
            this.claimData=this.$refs.accountRecordList.multipleSelection;
            for(var i=0;i < this.claimData.length; i++){//格式化时间
              this.claimData[i].payTime=new Date(this.claimData[i].payTime).format('YYYY-MM-DD');
            }
          }else{//判断复选框数组和已关联的数组中有没有重复的，筛选出未关联的
            for (var j = 0; j < _this.$refs.accountRecordList.multipleSelection.length; j++) {
              var found = false;
              for (var i = 0; i < _this.claimData.length; i++) {
                if (_this.claimData[i]['id'] === _this.$refs.accountRecordList.multipleSelection[j]['id']) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                this.claimData.push(_this.$refs.accountRecordList.multipleSelection[j]);
              }
            }
            for(var i=0;i < this.claimData.length; i++){//格式化时间
              this.claimData[i].payTime=new Date(this.claimData[i].payTime).format('YYYY-MM-DD');
            }
          }
        },
        deleteClaim(claim){//删除本条关联
          var index=this.claimData.indexOf(claim);
          if (index !== -1) {
            this.claimData.splice(index,1);
          }
        },
        confirmAs(){//提交确定
          let _this=this;
          var totalAmount=0;
          for(var i=0;i<_this.claimData.length;i++){
            var value=_this.claimData[i].claimMoney;
            if(value===undefined||Number(value)<0||Number(value)===0){
              this.$message.warning('认领金额填写有误');
              this.flag=false;
              return false;
            }else{
              this.flag=true;
            }
            totalAmount=totalAmount+Number(value);
          }
          if(totalAmount!==_this.totalBalance){
            this.$message.warning('认领金额和结账金额不等');
            return false;
          }
          if(this.flag===false){
            return false;
          }

          if(_this.source===undefined){//其他条件结账，如果认领金额总额和结账金额相等，把claimData传到父页面
              let list=_this.claimData;
              this.loadClaim(list);
              this.handleCancel();
          }else if(_this.source===1){//缴费单
            let claimObj = new Object();
            claimObj.sourceId = _this.mySourceId;//缴费单ID
            claimObj.linkSource = "1";//来源缴费单
            claimObj.claimMoney = _this.totalBalance;//认领金额
            claimObj.claimDetailArr=[];
            if(_this.claimData.length>0){
            for(var i=0;i<_this.claimData.length;i++){
              claimObj.claimDetailArr[i]={
                claimMoney:_this.claimData[i].claimMoney,
                accountRecordId:_this.claimData[i].id,
              }
            }
            }
            ajaxRequest('post','back/accountRecord/doClaimBill/',{
              jsonStr : JSON.stringify(claimObj)
            },function (res){
              if(res.code === 200){
                _this.$message.success('操作成功！');
                _this.callback("success");
              }else{
                _this.$message.error('操作异常！');
              }
            }.bind(this));

          }else if(_this.source===2){//预开票

            //把claimData（包括id和认领金额）传到后台，并回调父页面方法加载父页面已经认领的表格
            let claimObj = new Object();
            claimObj.sourceId = _this.mySourceId;//预开票ID
            claimObj.linkSource = "2";//来源预开票
            claimObj.claimMoney = _this.totalBalance;//认领金额
            claimObj.claimDetailArr=[];
            if(_this.claimData.length>0){
              for(var i=0;i<_this.claimData.length;i++){
                claimObj.claimDetailArr[i]={
                  claimMoney:_this.claimData[i].claimMoney,
                  accountRecordId:_this.claimData[i].id,
                }
              }
            }
            ajaxRequest('post','back/accountRecord/doClaimTicket/',{
              jsonStr : JSON.stringify(claimObj),
              isUpdate : _this.update//"false"不撤销到款，"true"撤销原先到款重新添加
            },function (res){
              if(res.code === 200){
                this.$message.success('操作成功！');
                this.callback("success");
              }else{
                this.$message.error('操作异常！');
              }
            }.bind(this));

          }
        },
        handleCancel(){
          this.callback();
        }
      },
    filters: {
      formatDateFifter(val) {
        return formatDate(val, 'YYYY-MM-DD')
      }
    },
      mounted() {
        this.claimData=this.list;
        this.isUpdate();
        //this.findBtn();
      },
      created(){

      },
    }
</script>
