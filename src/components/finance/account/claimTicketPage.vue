<template>
  <mind-dialog
    :title="'关联预开票'"
    :visible="true"
    dialogSize="large"
    center
    v-dialogDrag
    @close="handleCancel">

    <div style="width: 100%;margin-left: 92%">
      <el-button type="primary" v-mindPopover="{message:'确认关联到款记录?',success:toClaimMoney.bind(this),isOpen:handleOpen.bind(this)}">确认关联</el-button>
      <global-tootips>
        <p>1、系统默认列出申请人为当前登录人的预开票申请记录；</p>
        <p>2、	预开票申请记录需满足下述条件：已开票、未到账、未关联到款；</p>
        <p>3、	有权限人员可以使用查询功能为其它预开票记录认领到款；</p>
        <p>4、	若一笔银行到款不足抵扣预开票金额时，可选择多条银行到款记录（客户可能分多次转账）；</p>
        <p>5、	认领后，需相关人员确认后该预开票状态变更为为到款状态；</p>
        <p>6、	若误认领可通过到款认领记录进行取消认领操作；</p>
      </global-tootips>
    </div>
    <div style="margin-top:10px;">
        <el-table :max-height="QJTableMaxHeight"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="paymentCompany" label="付款单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="paymentAccount" label="付款账号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="payMoney" label="到账金额" ></el-table-column>
          <el-table-column prop="payTime" label="付款时间"   :formatter="formatterpayTime"></el-table-column>
          <el-table-column prop="receiveAccount" label="收款账号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="balance" label="余额" ></el-table-column>
          <el-table-column label="认领金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.claimMoney" @change="verificateClaimMoney"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    <div style="margin-top:20px;">
      <div style="margin-bottom:5px;" v-if="searchPower=='1'">
        <div>
          <div style="text-align: center">
            <el-button type="primary" @click="AdvanceSearch" class="el-icon-search">查询</el-button>
            <el-button type="warning" @click="EmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
          </div>
        </div>
      </div>
      <el-checkbox-group v-model="checkIdList">
      <el-table :max-height="QJTableMaxHeight"
        :data="ticketTableData"
        border
        style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="ticketCompany" label="开票单位" v-if="searchPower=='1'" show-overflow-tooltip :render-header="renderHeader"></el-table-column>
        <el-table-column prop="departName" label="开票部门" v-if="searchPower=='1'" :render-header="renderHeader"></el-table-column>
        <el-table-column prop="userName" label="申请人" v-if="searchPower=='1'" :render-header="renderHeader"></el-table-column>
        <el-table-column prop="ticketMoney" label="申请金额" v-if="searchPower=='1'" :render-header="renderHeader"></el-table-column>
        <el-table-column prop="applyReason" label="备注" v-if="searchPower=='1'" :render-header="renderHeader"></el-table-column>

        <el-table-column prop="ticketCompany" label="开票单位" v-if="searchPower=='0'" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="departName" label="开票部门" v-if="searchPower=='0'" ></el-table-column>
        <el-table-column prop="userName" label="申请人" v-if="searchPower=='0'" ></el-table-column>
        <el-table-column prop="ticketMoney" label="申请金额" v-if="searchPower=='0'" ></el-table-column>
        <el-table-column prop="applyReason" label="备注" v-if="searchPower=='0'" ></el-table-column>

        <el-table-column label="选择" width="80">
          <template slot-scope="scope">
            <el-checkbox :label="scope.row.id" :key="scope.row.id" @change="changeFun(scope.row)">&nbsp;</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      </el-checkbox-group>
    </div>
    <div style="margin-top:10px;text-align:center;float:right;">
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
  import {ajaxRequest,formatDate} from '../../util/base';
  import paramJson from './claimTicketPageParam'; // 同目录下json数据
  import MiniTableHeader  from './TableHeader.vue';

  let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
  export default {
    name: "claim-ticket-page",
    props: {
      data: {
        type: String,
        required:true
      },
      callback: {
        type:Function,
        required:true
      }
    },
    data(){
      return{
        page:1,
        rows:10,
        total:0,
        searchKey:'',
        orderProperty:'t.id',
        orderType:'desc',
        tableData:[],//到款列表
        ticketTableData:[],//预开票列表
        checkList:[],
        checkIdList:[],
        searchPower:"0",

        /* 高级检索相关项 */
        rowsCondition: paramJson, // 默认同目录下json数据 会依据模板改变
        paramJson: paramJson, // 同目录下json数据 常量
        sc:{},
        search:{},
        setEmpty:{},
      }
    },
    methods:{
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
          //console.log('aaaa',currentInfo,'序号',$index)
          return (
            <MiniTableHeader key={$index + property} column={column} handleSearch={this.handleSearch.bind(this)} index={$index}
          currentInfo={currentInfo}/>
        )
        }else{
          return column.label
        }
      },
      //点击计算到款金额事件
      changeFun(row){

        this.checkList =[];
        this.checkIdList =[];
        this.checkList.push(row);
        this.checkIdList.push(row.id);
        var ticketMoney = row.ticketMoney;
        var totalMoney = 0;
        for (let i=0;i<this.tableData.length;i++){
          if(parseFloat(ticketMoney).toFixed(2)-parseFloat(totalMoney).toFixed(2)>0){
            if(parseFloat(this.tableData[i].balance)>(parseFloat(ticketMoney)-parseFloat(totalMoney))){
              this.tableData[i].claimMoney = (parseFloat(ticketMoney)-parseFloat(totalMoney)).toFixed(2);
            }else{
              this.tableData[i].claimMoney = parseFloat(this.tableData[i].balance).toFixed(2);
            }
            totalMoney = parseFloat(totalMoney)+parseFloat(this.tableData[i].claimMoney);
          }else{
            this.tableData[i].claimMoney = parseFloat(0.00).toFixed(2);
          }
        }
      },
      //时间格式转换
      formatteraddTime:function(row, column){
        return formatDate(row.addTime,'YYYY-MM-DD');
      },
      //时间格式转换
      formatterpayTime:function(row, column){
        return formatDate(row.payTime,'YYYY-MM-DD');
      },

      //获取列表信息
      getTableList(){
        ajaxRequest('get','back/ticketApply/getCanClaimAccountRecordTicketApplys',{
          page:this.page,
          rows:this.rows,
          orderProperty:this.orderProperty,
          orderType:this.orderType,
          total:0,
          sc:this.sc
        },(res)=>{
          if(res.code===200){
            this.ticketTableData=res.rows;
            this.total=res.total;
          }
        })
      },
      //分页事件
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      //分页事件
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getTableList();
      },

      //弹窗关闭事件
      handleCancel(){
        this.callback();
      },

      //初始化页面到款数据
      loadAccountRecordByIds(){
        let _this = this;
        ajaxRequest('get','back/accountRecord/list/'+_this.data,{
        },(res)=>{
          if(res.code===200){
            var arr=new Array();
            for(let i=0; i<res.rows.length;i++){
              res.rows[i].claimMoney=parseFloat(0.00).toFixed(2);
              arr.push(res.rows[i]);
            }
            _this.tableData=arr;
          }
        })
      },

      //验证认领金额大于0且小于等于余额
      verificateClaimMoney(){
        let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
        for(let i=0;i<this.tableData.length;i++){
          if (this.tableData[i].claimMoney != "") {
            if (!regu.test(this.tableData[i].claimMoney)) {
              this.tableData[i].claimMoney=parseFloat(0.00).toFixed(2);
            }else{
              if(Number(this.tableData[i].balance) < Number(this.tableData[i].claimMoney)){
                this.tableData[i].claimMoney = parseFloat(this.tableData[i].balance).toFixed(2)
              }else{
                this.tableData[i].claimMoney = parseFloat(this.tableData[i].claimMoney).toFixed(2);
              }
            }
          }else{
            this.tableData[i].claimMoney = parseFloat(0.00).toFixed(2);
          }
        }

      },

      //预开票认领到款操作
      toClaimMoney(){
        let _this = this;
        if(this.checkList.length==0){
          _this.$message.error('请先选择预开票！');
          return;
        }
        let rowInfo = this.checkList[0];
        let totalClaimMoney = 0;
        let arr = new Array();
        for(let i=0;i<this.tableData.length;i++){
          totalClaimMoney = totalClaimMoney + parseFloat(this.tableData[i].claimMoney);
          if(Number(this.tableData[i].claimMoney)>0){
            let obj = new Object();
            obj.accountRecordId = this.tableData[i].id;
            obj.claimMoney = parseFloat(this.tableData[i].claimMoney).toFixed(2);
            arr.push(obj);
          }
        }
        if(Number(totalClaimMoney) !== Number(rowInfo.ticketMoney)){
          this.$message.error('认领总金额与预开票金额不符，不允许认领操作！');
          return;
        }

        let claimObj = new Object();
        claimObj.sourceId = rowInfo.id;//预开票ID
        claimObj.linkSource = "2";//来源预开票
        claimObj.claimMoney = rowInfo.ticketMoney;//认领金额
        claimObj.claimDetailArr = arr;
        ajaxRequest('post','back/accountRecord/doClaimTicket/',{
          jsonStr : JSON.stringify(claimObj),
          isUpdate : "false"//"false"不撤销到款，"true"撤销原先到款重新添加
        },function (res){
          if(res.code === 200){
            _this.$message.success('操作成功！');
            _this.callback("success");
          }else{
            _this.$message.error('操作异常！');
          }
        }.bind(this));
      },
      //关联到款前验证
      handleOpen(){
        let _this = this;
        if(this.checkList.length==0){
          _this.$message.error('请先选择预开票！');
          return false;
        }
        let rowInfo = this.checkList[0];
        let totalClaimMoney = 0;
        let arr = new Array();
        for(let i=0;i<this.tableData.length;i++){
          totalClaimMoney = totalClaimMoney + parseFloat(this.tableData[i].claimMoney);
          if(Number(this.tableData[i].claimMoney)>0){
            let obj = new Object();
            obj.accountRecordId = this.tableData[i].id;
            obj.claimMoney = parseFloat(this.tableData[i].claimMoney).toFixed(2);
            arr.push(obj);
          }
        }
        if(Number(totalClaimMoney) !== Number(rowInfo.ticketMoney)){
          this.$message.error('认领总金额与预开票金额不符，不允许认领操作！');
          return false;
        }
        return true;
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
        console.log("新增检索项",JSON.stringify(this.search));
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
    components:{
    },
    mounted() {
      this.loadAccountRecordByIds();
      this.getTableList();
      if(btnPower.indexOf("@M36910@") !=-1){//无查询所有缴费单权限,不显示查询条件框
        this.searchPower = "1";
      }else{
        this.searchPower = "0";
      }
    }
  }

</script>

<style scoped>
  .custom-input{
    width:200px;
    height:32px;
  }
  .custom-input .el-input__inner{
    height:32px;
    line-height:32px;
  }
  .custom-input .el-input-group__append{
    padding:0 10px;
  }
</style>
