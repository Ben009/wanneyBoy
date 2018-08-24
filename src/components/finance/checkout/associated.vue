<template>
    <div>
      <div style="margin:10px 0;" v-if="associatedList.length>0">
        <div class="title-item" style="margin-top: 20px"><span>到款关联信息</span></div>
        <el-table :max-height="QJTableMaxHeight"
          :data="associatedList"
          border
          style="width: 100%;margin-top: 10px">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="PAYMENT_COMPANY" label="付款单位"></el-table-column>
          <el-table-column prop="PAYMENT_ACCOUNT" label="付款账号"></el-table-column>
          <el-table-column prop="PAY_TIME" label="付款时间">
            <template slot-scope="scope">
              {{scope.row.PAY_TIME | dateyymmdd}}
            </template>
          </el-table-column>
          <el-table-column prop="PAY_MONEY" label="到账金额"></el-table-column>
          <el-table-column prop="REMARKS" label="备注"></el-table-column>
          <el-table-column prop="BALANCE" label="余额" ></el-table-column>
          <el-table-column prop="CLAIM_MONEY" label="认领金额"></el-table-column>
          <el-table-column prop="USER_NAME" label="关联人"></el-table-column>
          <el-table-column prop="ADD_TIME" label="关联时间">
            <template slot-scope="scope">
              {{scope.row.ADD_TIME | dateyymmdd}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<style>

</style>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest,formatDate} from '../../util/base';
  import $ from 'jquery';


    export default {
      name:"associated",
      props:{
        source:{
          type:Number,
          required:true
        },
        mySourceId:{
          type:Number,
          required:true
        }
      },
        data() {
            return {
              associatedList:[],
            }
        },
      methods:{
        //缴费单和预开票结账初始化已关联的数据，把数据传到父页面(billCheckoutDetail)
        getAssociated(){
          ajaxRequest('get','back/accountRecord/getAccountInfoBySourceAndSourceId',{
            source:this.source,
            sourceId:this.mySourceId
          },(res)=>{
            if(res.code===200){
              this.associatedList=res.rows;
            }
          })
        }
      },
      created(){
        this.getAssociated();
      },
      mounted(){

      },
      filters: {
        dateyymmdd(myInput) {
          return formatDate(myInput, "YYYY-MM-DD");
        },
      },
    }
</script>
