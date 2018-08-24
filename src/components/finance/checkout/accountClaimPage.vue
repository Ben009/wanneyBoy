<template>
  <mind-dialog
    :title="'关联到款'"
    :visible="true"
    dialogSize="large"
    center
    v-dialogDrag
    @close="handleCancel">

      <div style="margin-bottom:5px;margin-top: 10px">
        <div>
          <div style="width: 25%;float: left">&nbsp;</div>
          <div style="text-align: center;width: 50%;float: left">
            <el-button type="primary" @click="AdvanceSearch" class="el-icon-search">查询</el-button>
            <el-button type="warning" @click="EmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
          </div>
          <div style="width: 25%;float: left;">
            <span style="font-size: 16px;font-weight: bold">
              结账金额：{{totalBalance}}
            </span>
            <span style="margin-left: 20%">
              <el-button type="primary" v-mindPopover="{message:'确定关联到款?',success:confirmAs.bind(this),isOpen:handleOpen.bind(this)}">确认关联</el-button>
              <el-button @click="handleCancel">&nbsp;取消</el-button>
            </span>
          </div>
        </div>
      </div>
      <br>
      <br>
      <el-table
        :data="tableData" border style="width: 100%" :fit="true">
        <el-table-column prop="paymentCompany" label="付款单位" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
        <el-table-column prop="paymentAccount" label="付款账号" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
        <el-table-column prop="payTime" label="付款时间" :formatter="formatterpayTime" :render-header="renderHeader"></el-table-column>
        <el-table-column prop="payMoney" label="到账金额" :render-header="renderHeader"></el-table-column>
        <el-table-column prop="remarks" label="备注" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
        <el-table-column prop="balance" label="余额" :render-header="renderHeader"></el-table-column>
        <el-table-column label="使用金额">
          <template slot-scope="scope">
            <el-input v-model="scope.row.claimMoney" @change="verificateClaimMoney" @focus ="autoShowMoney(scope.$index)"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:10px;text-align:center; float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest,formatDate} from '../../util/base';
  import MiniTableHeader  from '../account/TableHeader.vue';
  import paramJson from './accountClaimPageParam' // 同目录下json数据


  export default {
    components: {},
    name:"account-claim-page",
    props:{
      callback:{
        type:Function,
        require: true
      },
      totalBalance:{
        type:Number,
        require: true
      },
      source:{
        type:Number,
        require: true
      },
      sourceId:{
        type:Number,
        require: true
      }
    },
    data() {
      return {
        page:1,
        rows:10,
        total:0,
        orderProperty:'a.id',
        orderType:'desc',
        tableData:[],

        /* 高级检索相关项 */
        rowsCondition: paramJson, // 默认同目录下json数据 会依据模板改变
        paramJson: paramJson, // 同目录下json数据 常量
        sc:{},
        search:{},
        setEmpty:{},
      }
    },
    methods:{
      getTableList(){
        ajaxRequest('get','back/accountRecord/getAccountRecordListForClaim',{
          page:this.page,
          rows:this.rows,
          orderProperty:this.orderProperty,
          orderType:this.orderType,
          total:0,
          sc:this.sc,
        },(res)=>{
          if(res.code===200){
            var arr=new Array();
            for(let i=0; i<res.rows.length;i++){
              res.rows[i].claimMoney="";
              arr.push(res.rows[i]);
            }
            this.tableData=arr;
            this.total=res.total;
          }
        })
      },
      formatterpayTime:function(row, column){
        return formatDate(row.payTime,'YYYY-MM-DD');
      },
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getTableList();
      },
      handleCancel(){
        this.callback();
      },
      //验证认领金额大于0且小于等于余额
      verificateClaimMoney(){
        let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
        for(let i=0;i<this.tableData.length;i++){
          if (this.tableData[i].claimMoney != "") {
            if (!regu.test(this.tableData[i].claimMoney)) {
              this.tableData[i].claimMoney="";
            }else{
              if(Number(this.tableData[i].balance) < Number(this.tableData[i].claimMoney)){
                this.tableData[i].claimMoney = parseFloat(this.tableData[i].balance).toFixed(2);
              }else{
                this.tableData[i].claimMoney = parseFloat(this.tableData[i].claimMoney).toFixed(2);
              }
            }
            if(Number(this.tableData[i].claimMoney)<=0){
              this.tableData[i].claimMoney = "";
            }
          }else{
            this.tableData[i].claimMoney = "";
          }
        }

      },
      autoShowMoney(index){
        let hasChooseMoney = 0;
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].claimMoney !=""){
            hasChooseMoney = Number(hasChooseMoney) +Number(this.tableData[i].claimMoney);
          }
        }
        if(Number(hasChooseMoney)<Number(this.totalBalance)){
          if(Number(this.totalBalance)-Number(hasChooseMoney)  <=  Number(this.tableData[index].balance)){
            this.tableData[index].claimMoney = parseFloat(Number(this.totalBalance)-Number(hasChooseMoney)).toFixed(2);
          }else{
            this.tableData[index].claimMoney = parseFloat(this.tableData[index].balance).toFixed(2);
          }
        }
      },
      //确认关联
      confirmAs(){//提交确定
        let _this=this;
        let hasChooseMoney = 0;
        var arr=new Array();
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].claimMoney !=""){
            hasChooseMoney = Number(hasChooseMoney) +Number(this.tableData[i].claimMoney);
            arr.push(this.tableData[i]);
          }
        }
        if(Number(hasChooseMoney) != this.totalBalance){
          _this.$message.error('认领总金额和结账金额不等，不允许关联操作！');
          return;
        }
        if(Number(hasChooseMoney)<=0){
          _this.$message.error('结账金额为0，不允许关联到款！');
          return;
        }

        if(_this.source===0) {//其他条件结账，如果认领金额总额和结账金额相等
          this.callback(arr);
        }else if(_this.source===1){//缴费单结账，生成到款认领记录
          let claimObj = new Object();
          claimObj.sourceId = _this.sourceId;//缴费单ID
          claimObj.linkSource = "1";//来源缴费单
          claimObj.claimMoney = _this.totalBalance;//认领金额
          claimObj.claimDetailArr=[];
          for(var i=0;i<arr.length;i++){
            claimObj.claimDetailArr[i]={
              claimMoney:arr[i].claimMoney,
              accountRecordId:arr[i].id,
            }
          }
          ajaxRequest('post','back/accountRecord/doClaimBill/',{
            jsonStr : JSON.stringify(claimObj)
          },function (res){
            if(res.code === 200){
              _this.$message.success('操作成功！');
              _this.callback();
            }else{
              _this.$message.error('操作异常！');
            }
          }.bind(this));
        }else if(_this.source===2) {//预开票结账关联到款
          //把claimData（包括id和认领金额）传到后台，并回调父页面方法加载父页面已经认领的表格
          let claimObj = new Object();
          claimObj.sourceId = _this.sourceId;//预开票ID
          claimObj.linkSource = "2";//来源预开票
          claimObj.claimMoney = _this.totalBalance;//认领金额
          claimObj.claimDetailArr=[];
          for(var i=0;i<arr.length;i++){
            claimObj.claimDetailArr[i]={
              claimMoney:arr[i].claimMoney,
              accountRecordId:arr[i].id,
            }
          }
          ajaxRequest('post','back/accountRecord/doClaimTicket/',{
            jsonStr : JSON.stringify(claimObj),
            isUpdate : _this.update//"false"不撤销到款，"true"撤销原先到款重新添加
          },function (res){
            if(res.code === 200){
              _this.$message.success('操作成功！');
              _this.callback();
            }else{
              _this.$message.error('操作异常！');
            }
          }.bind(this));

        }
      },
      handleOpen(){
        let _this=this;
        let hasChooseMoney = 0;
        var arr=new Array();
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].claimMoney !=""){
            hasChooseMoney = Number(hasChooseMoney) +Number(this.tableData[i].claimMoney);
            arr.push(this.tableData[i]);
          }
        }
        if(Number(hasChooseMoney) != this.totalBalance){
          _this.$message.error('认领总金额和结账金额不等，不允许关联操作！');
          return false;
        }
        if(Number(hasChooseMoney)<=0){
          _this.$message.error('结账金额为0，不允许关联到款！');
          return false;
        }
        return true;
      },

      /*高级查询相关*/
      renderHeader (h, {column, $index}) {
        /*表格头部自定义渲染  key值必加 隐藏列时需重新渲染头部*/
        let property = column.property,flag=false;
        this.rowsCondition.forEach(v=>{
          if(property==v.nameCode){
            flag=true;
          }
        });
        if(flag){
          let currentInfo = this.paramJson.filter((v) => {return v.nameCode == property});
          return (
            <MiniTableHeader key={$index + property} column={column} handleSearch={this.handleSearch.bind(this)} index={$index}
          currentInfo={currentInfo}/>
        )
        }else{
          return column.label
        }
      },
      handleSearch (column, value,index,empty) {
        /*表格头部检索回调 获取当前列检索信息回显高级搜索组件
        * comparison 默认显示第一条比较项
        * column.property 列英文名称
        * value 检索值
        * sqlSeg 列sqlSeg信息*/
        var comparison = this.getComparison(column.property);
        var sqlSeg = this.getSqlSeg(column.property);
        /*表格标题检索回调 插入一条检索项*/
        this.search[column.property]={
          logicalValue: 0,
          nameCode: column.property,
          comparison: comparison,
          value: value,
          sqlSeg: sqlSeg,
        };

        this.setEmpty[column.property]=empty;
      },
      getComparison (property) {
        /*通过列属性，找到当前列json配置中第一个比较项*/
        let temp = this.paramJson.filter((v) => {return v.nameCode == property})
        let comparison = temp.length > 0 ? temp[0].comparison : ''
        if (Object.prototype.toString.call(comparison) === '[object String]') {
          comparison = comparison.split(',')[0]
        } else {
          comparison = comparison[0]
        }
        return comparison
      },
      getSqlSeg (property) {
        /*通过列属性，找到当前列json配置中sqlSeg信息*/
        let temp = this.paramJson.filter((v) => {return v.nameCode == property})
        let sqlSeg = temp.length > 0 ? temp[0].sqlSeg : ''
        return sqlSeg
      },
      AdvanceSearch() {
        let sc=[];
        this.paramJson.forEach(item=>{
          if(this.search[item.nameCode]){
            item.isSpecial?this.search[item.nameCode]['isSpecial']=item.isSpecial:null;
            if(this.search[item.nameCode].value!=""){
              sc.push(this.search[item.nameCode]);
            }
          }
        })
        this.page=1;
        this.sc = JSON.stringify(sc);
        //this.orderProperty = data.sortBy;
        //this.orderType = data.order;
        this.fuzzySearch = 1;
        this.getTableList();
      },
      EmptyCondition(){
        for(let p in  this.setEmpty){
          this.setEmpty[p]();
          this.search[p].value="";
        }
      }
    },
    mounted() {
    },
    created(){
      this.getTableList();
    },
  }
</script>
