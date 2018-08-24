<template>
  <el-form label-width="150px">
    <div class="wtdw">
      <div style="float: left">({{companyType}}){{companyName}}</div>
      <div style="float: right">
        <global-tootips width="600" style="text-align: left">
          <p>1、若其中登记号已结账，则不允许担保！</p>
          <p>2、若其中登记号已担保，则不允许再次担保！</p>
          <p>3、若其中登记号的单位为第五，六类别，系统不允许担保！</p>
          <p>4、若其中登记号的单位为第二类别，系统默认担保人为合同签署人，有效期为合同有效期！</p>
          <p>5、若其中登记号的单位为第三类别，且该登记号中的器具包含在合同中，系统默认担保人为合同签署人，有效期默认三个月，否则，按第6条说明处理！</p>
          <p>6、不属于上述任何情况时，以登录号，登录密码，电子签名密码，进行担保，有效期默认三个月！</p>
        </global-tootips>
      </div>
    </div>
    <div style="margin-left:10px">{{searchKey}}单号下所有登记号状态</div>
    <div>
      <el-table  :max-height="QJTableMaxHeight"
        ref="table"
        :data="tableData"
        border
        style="width: 100%"
        @sort-change="handleSort"
        :fit="true"
        show-summary
        :summary-method="getSummaries"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" disabled="true" :selectable='checkboxT'></el-table-column>
        <el-table-column
          prop="registrationNo"
          label="登记号">
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
          width="200">
        </el-table-column>
        <el-table-column prop="setNumber" label="套数" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pieceNumber" label="套/件" width="100"></el-table-column>
        <el-table-column label="样品状态">
          <template slot-scope="scope">
            <span v-if="scope.row.registrationNo.toString().substring(0,1)=='9'&&scope.row.applianceWarehouseFlag==0" style="color:red">无样品</span>
            <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea=='0'">未入库</span>
            <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea!='0'">外送</span>
            <span v-if="scope.row.applianceWarehouseFlag==3">已入库</span>
            <span v-if="scope.row.applianceWarehouseFlag==4">已出库</span>
          </template>
        </el-table-column>
        <el-table-column label="证书状态">
          <template slot-scope="scope">
            <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateCount<scope.row.certificateNumber" style="color:red">证书未出</span>
            <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.approveCertificateCount<scope.row.certificateNumber&&scope.row.certificateCount==scope.row.certificateNumber" style="color:red">证书未批准</span>
            <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea=='0'" style="color:red">无需出证</span>
            <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea!='0'" style="color:red">外送</span>
            <span v-if="scope.row.certificateWarehouseFlag==3">已入库</span>
            <span v-if="scope.row.certificateWarehouseFlag==4">已出库</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fyhj"
          label="费用合计">
        </el-table-column>
        <el-table-column prop="sfjz" label="费用状态">
          <template slot-scope="scope">
            <span v-if="scope.row.isSettleAccount ==1">已结账</span>
            <span v-if="scope.row.isSettleAccount ==0&&scope.row.isSettlement ==1" style="color:red">已结算</span>
            <span v-if="scope.row.isSettlement ==0&&scope.row.feeStatus ==1" style="color:red">已录费</span>
            <span v-if="scope.row.feeStatus ==0" style="color:red">未录费</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="guaranteeType"
          label="担保类型"
          :formatter="function(row, column, cellValue, index){return cellValue==1?'货证齐担':cellValue==2?'仅担保货':cellValue==3?'仅担保证':''}">
        </el-table-column>
        <el-table-column
          prop="guaranteePerson"
          label="担保人">
        </el-table-column>
        <el-table-column
          prop="guaranteeTime"
          label="担保期限"
          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="creator"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="操作时间"
          :formatter="dealDate">
        </el-table-column>
      </el-table>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="centerForm">
      <div>
        <el-form-item label="担保类型">
          <el-radio-group v-model="dbType" @change="changeDbType">
            <el-radio :label="1" :disabled="isDisabled1">货证齐担</el-radio>
            <el-radio :label="2" :disabled="isDisabled2">仅担保货</el-radio>
            <el-radio :label="3" :disabled="isDisabled3">仅担保证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="dbPerson">
              <template slot="label">
                  <span>担保人</span>
                  <el-tooltip content="登录号">
                    <i class="el-icon-info" style="font-size: 12px !important;"></i>
                  </el-tooltip>
              </template>
              <el-input v-model="form.dbPerson" :disabled="dbPersonDisabled" ref="focusInput"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="userName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="系统登录密码" prop="userPwd">
          <el-input v-model="form.userPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="电子签名密码" prop="elePwd">
          <el-input v-model="form.elePwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="担保期限">
          <el-date-picker
            v-model="dbTerm"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            :disabled="dbPersonDisabled"
            placeholder="选择日期" style="width:100%;">
          </el-date-picker>
        </el-form-item>
      </div>
      <div style="text-align: center">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-form>
    <div style="margin-left:10px">{{searchKey}}对应委托单下所有登记号担保信息</div>
    <div>
      <el-table  :max-height="QJTableMaxHeight"
        ref="table2"
        :data="tableData2"
        border
        style="width: 100%"
        @sort-change="handleSort"
        :fit="true">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="registrationNo"
          label="登记号">
        </el-table-column>
        <el-table-column
          prop="applianceName"
          label="器具名称"
          width="200">
        </el-table-column>
        <el-table-column prop="setNumber" label="套数">
          <template slot-scope="scope">
            <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pieceNumber" label="件数"></el-table-column>
        <el-table-column label="样品状态">
          <template slot-scope="scope">
            <span v-if="scope.row.registrationNo.toString().substring(0,1)=='9'&&scope.row.applianceWarehouseFlag==0" style="color:red">无样品</span>
            <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea=='0'">未入库</span>
            <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea!='0'">外送</span>
            <span v-if="scope.row.applianceWarehouseFlag==3">已入库</span>
            <span v-if="scope.row.applianceWarehouseFlag==4">已出库</span>
          </template>
        </el-table-column>
        <el-table-column label="证书状态">
          <template slot-scope="scope">
            <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateCount<scope.row.certificateNumber" style="color:red">证书未出</span>
            <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.approveCertificateCount<scope.row.certificateNumber&&scope.row.certificateCount==scope.row.certificateNumber" style="color:red">证书未批准</span>
            <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea=='0'" style="color:red">无需出证</span>
            <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea!='0'" style="color:red">外送</span>
            <span v-if="scope.row.certificateWarehouseFlag==3">已入库</span>
            <span v-if="scope.row.certificateWarehouseFlag==4">已出库</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fyhj"
          label="费用合计">
        </el-table-column>
        <el-table-column prop="sfjz" label="费用状态">
          <template slot-scope="scope">
            <span v-if="scope.row.sfjz ==1">已结账</span>
            <span v-if="scope.row.sfjz ==0&&scope.row.isSettlment ==1" style="color:red">已结算</span>
            <span v-if="scope.row.isSettlment ==0&&scope.row.feeStatus ==1" style="color:red">已录费</span>
            <span v-if="scope.row.feeStatus ==0" style="color:red">未录费</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="guaranteeType"
          label="担保类型"
          :formatter="function(row, column, cellValue, index){return cellValue==1?'货证齐担':cellValue==2?'仅担保货':cellValue==3?'仅担保证':''}">
        </el-table-column>
        <el-table-column
          prop="guaranteePerson"
          label="担保人">
        </el-table-column>
        <el-table-column
          prop="guaranteeTime"
          label="担保期限"
          :formatter="dealDate">
        </el-table-column>
        <el-table-column
          prop="creator"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="操作时间"
          :formatter="dealDate">
        </el-table-column>
      </el-table>
    </div>
  </el-form>
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
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";

  const defaults = {
  };
  export default {
    components: {
      ElRow,
      ElCol
    },
    name:"guaranteeEntryDetail",
    data() {
      var checkUserName = (rule, value, callback) => {
        if (this.form.dbPerson!=""&&value!="") {
          ajaxRequest('get','back/guarantee/checkDbrName',{
            userNo:this.form.dbPerson,
            type:"userNo",
          },(res)=>{
            if(res.code===200){
              callback();
            }else{
              return callback(new Error(res.msg));
            }
          })

        }else{
          callback();
        }
      };

      var checkUserPwd = (rule, value, callback) => {
        if (this.form.dbPerson!=""&&value!="") {
          let flag1=false;let flag2=false;let name="";
        ajaxRequest('get','back/guarantee/checkDbrPwd',{
          userNo:this.form.dbPerson,
          password:this.form.userPwd,
          type:"password",
        },(res)=>{
          if(res.code===200){
            flag1=true;
            name=res.daoResult.userName;
            ajaxRequest('get','back/guarantee/checkDbrEPwd',{//两个密码都验证成功显示姓名
              userNo:this.form.dbPerson,
              signnaturePassword:this.form.elePwd,
              type:"signnaturePassword",
            },(res)=>{
              if(res.code===200){
                flag2=true;
                this.dbPersonId=res.daoResult.id;
                name=res.daoResult.userName;
                if(flag1==true&&flag2==true){
                  this.userName=name;
                  callback();
                }else{
                }
              }else{

              }
            })
          }else{
            return callback(new Error('系统登录密码校验失败'));
          }
        });


        }else{
          callback();
        }
      };
      var checkElePwd = (rule, value, callback) => {
        let flag1=false;let flag2=false;let name="";
          if (this.form.dbPerson!=""&&value!="") {
            ajaxRequest('get','back/guarantee/checkDbrEPwd',{
              userNo:this.form.dbPerson,
              signnaturePassword:this.form.elePwd,
              type:"signnaturePassword",
            },(res)=>{
              if(res.code===200){
                flag1=true;
                name=res.daoResult.userName;
                ajaxRequest('get','back/guarantee/checkDbrPwd',{//两个密码都验证成功显示姓名
                  userNo:this.form.dbPerson,
                  password:this.form.userPwd,
                  type:"password",
                },(res)=>{
                  if(res.code===200){
                    flag2=true;
                    name=res.daoResult.userName;
                    this.dbPersonId=res.daoResult.id;
                    if(flag1==true&&flag2==true){
                      this.userName=name;
                      callback();
                    }else{
                    }
                  }else{

                  }
                })
              }else{
                return callback(new Error('电子签名密码校验失败'));
              }
            });


          }else{
            callback();
          }
      };
      return {
        form: {
          dbPerson:"",//系统登录名
          userPwd:"",//系统登录密码
          elePwd:"",//电子签名密码
        },
        rules: {
          dbPerson: [{ validator: checkUserName, trigger: 'blur' }],
          userPwd: [{ validator: checkUserPwd, trigger: 'blur' }],
          elePwd: [{ validator: checkElePwd, trigger: 'blur' }],
        },
        pickerOptions: {//担保期限只能选择今天之后的
          disabledDate(time) {
            return time.getTime() <= Date.now();
          },
        },
        orderProperty:'id',//排序字段
        orderType:'desc',//排序方式
        searchKey:"",//查询单号
        tableData:[],//表格中的数据
        tableData2:[],//表格中的数据
        multipleSelection:[],//多选，选中的数据
        companyName:"",//委托单位名称
        companyType:"",//委托单位等级
        companyId:"",//委托单位Id
        dbType:"",//担保类型
        isDisabled1:false,//仅担保货选项禁用
        isDisabled2:false,//仅担保证选项禁用
        isDisabled3:false,//货证齐担选项禁用
        dbPerson:"",//担保人
        dbPersonDisabled:false,//担保人禁用
        userName:"",//姓名
        dbTerm:"",//担保期限
        dbTermDisabled:false,//担保期限禁用
        dbPersonId:"",//担保人Id
        db:false,//担保权限弹层
        paramObj: this.$route.query,
        flag:false,//用于判断是否加载表格
      }
    },
    methods:{
      getTableList(){
        /*获取table数据，维护data数据*/
        this.flag=this.paramObj.flag;
        if(this.flag===true){
          this.searchKey=this.paramObj.searchKey;
          this.tableData=this.paramObj.tableData;
          this.tableData2=this.paramObj.tableData2;
          this.companyName=this.paramObj.companyName;
          this.companyType=this.paramObj.companyType;
          this.companyId=this.paramObj.companyId;
          this.$nextTick(_ => {
            this.chooseAll();
          })
        }else{
          return;
        }
      },
      chooseAll() {//全选 818000936
        for (let i = 0; i < this.tableData.length; i++) {
          let s = this.tableData[i].registrationNo.toString().substring(0,1);
          if(s=="8"){
            let [dbYpFlag,dbZsFlag]=[false,false];//判断样品证书是否已担保
            if(this.tableData[i].guaranteeType==1){
              dbYpFlag=true;
              dbZsFlag=true;
            }else{
              for(let j=0;j<this.tableData.length;j++){
                if(this.tableData[i].registrationNo==this.tableData[j].registrationNo){
                  if(this.tableData[j].guaranteeType==1){
                    dbYpFlag=true;
                    dbZsFlag=true;
                  }else if(this.tableData[j].guaranteeType==2){
                    dbYpFlag=true;
                  }else if(this.tableData[j].guaranteeType==3){
                    dbZsFlag=true;
                  }
                }
              }
            }

            // 可担保的条件：1.可担保货（货未担保且货已入库）/可担保证（证未担保且证已入库） 2.单位是第一/第二/第三/第四类别 3.未结账
            if(this.tableData[i].isSettleAccount==0&&(this.companyType=="1"||this.companyType=="2"||this.companyType=="3"||this.companyType=="4")&&this.tableData[i].guaranteeType!=1&&((this.tableData[i].applianceWarehouseFlag==3&&dbYpFlag==false)||(this.tableData[i].certificateWarehouseFlag==3&&dbZsFlag==false))){
              this.$refs.table.toggleRowSelection(this.tableData[i], true);
            }
          }else if(s=="9"){//现场检测可担保条件：1.证已入库，并且证未担保 2.单位是第一/第二/第三/第四类别 3.未结账
            if(this.tableData[i].certificateWarehouseFlag==3&&this.tableData[i].isSettleAccount==0&&(this.tableData[i].guaranteeType!=1||this.tableData[i].guaranteeType!=3)&&(this.companyType=="1"||this.companyType=="2"||this.companyType=="3"||this.companyType=="4")){
              this.$refs.table.toggleRowSelection(this.tableData[i], true);
            }
          }
        }

        },
      handleSubmit(){
        this.$refs.form.validate((valid) => {
          if (valid) {
          if (this.multipleSelection.length <= 0) {
            this.$message.warning('必须选择一条数据');
            return;
          }
          if (this.dbType === "") {
            this.$message.warning('担保类型没有填写');
            return;
          }
          if (this.form.dbPerson === "") {
            this.$message.warning('担保人没有填写');
            return;
          }
          if (this.dbTerm === "") {
            this.$message.warning('担保期限没有选择');
            return;
          }
          if (this.userName === "") {
            this.$message.warning('姓名没有填写');
            return;
          }
          if (this.form.userPwd === "") {
            this.$message.warning('系统登录密码没有填写');
            return;
          }
          if (this.form.elePwd === "") {
            this.$message.warning('电子签名密码没有填写');
            return;
          }
          this.form.guaranteeType = this.dbType;
          this.form.guaranteePerson = this.dbPersonId;
          this.form.guaranteeTime = this.dbTerm;
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.multipleSelection[i].creator = 0;
            this.multipleSelection[i].guaranteePerson = 0;
          }
          this.form.dhlist = JSON.stringify(this.multipleSelection);
          ajaxRequest('post', 'back/guarantee/addGuarantee', this.form, (res) => {
            if (res.code === 200) {
              this.$message.success('提交成功');
              this.$router.push({
                path: '/admin/493',
              })
            } else {
              this.$message.error(res.msg);
            }
          })
        }
        });
      },
      changeDbType(){
        if (this.multipleSelection.length<1){
          this.$message.warning("必须先选择一条数据");
          this.dbType="";
          return;
        }
      },
      checkboxT(row,index){
        let s = row.registrationNo.toString().substring(0,1);
        if(s=="8"){// 可担保的条件：1.可担保货（货未担保且货已入库）/可担保证（证未担保且证已入库） 2.单位是第一/第二/第三/第四类别 3.未结账
          let [dbYpFlag,dbZsFlag]=[false,false];//判断样品证书是否已担保
          if(row.guaranteeType==1){
            dbYpFlag=true;
            dbZsFlag=true;
          }else{
            for(let j=0;j<this.tableData.length;j++){
              if(row.registrationNo==this.tableData[j].registrationNo){
                if(this.tableData[j].guaranteeType==1){
                  dbYpFlag=true;
                  dbZsFlag=true;
                }else if(row.guaranteeType==2){
                  dbYpFlag=true;
                }else if(this.tableData[j].guaranteeType==3){
                  dbZsFlag=true;
                }
              }
            }
          }
          if(row.isSettleAccount==0&&(this.companyType=="1"||this.companyType=="2"||this.companyType=="3"||this.companyType=="4")&&row.guaranteeType!=1&&((row.applianceWarehouseFlag==3&&dbYpFlag==false)||(row.certificateWarehouseFlag==3&&dbZsFlag==false))){
            return 1;
          }else{//货证齐担和样品证书均未入库的不可勾选
            return 0;
          }
        }else if(s=="9"){//现场检测可担保条件：1.证已入库，并且证未担保 2.单位是第一/第二/第三/第四类别 3.未结账
          if(row.certificateWarehouseFlag==3&&row.isSettleAccount==0&&(row.guaranteeType!=1||row.guaranteeType!=3)&&(this.companyType=="1"||this.companyType=="2"||this.companyType=="3"||this.companyType=="4")){
            return 1;
          }else{
            return 0;
          }
        }
      },
      goBack(){
        this.$router.push({
          path:'/admin/743',
        })
      },
      dealDate: function (row, column, cellValue) {
        if(cellValue===""||cellValue===null||cellValue===undefined){
          return "";
        }else{
          return new Date(cellValue).format('YYYY-MM-DD');
        }
      },
      handleSort: function(column, prop, order){
        /*用ui组件提供的排序接口,维护实例data数据*/
        this.orderProperty = column['prop'];
        if(column['order'] == 'descending'){
          this.orderType='desc';
        }else{
          this.orderType = 'asc';
        }
        this.getTableList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.initData();
      },
      //合计行
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 2||index===3||index===4||index===6||index===9||index===10||index===11||index===12||index===13||index===14) {
            sums[index]='';
            return;
          }
          if (index === 1) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      initData() {
        if(this.multipleSelection.length>0){
        if (this.companyType == "3") {
          let registrationNo = "";
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if((i+1)==this.multipleSelection.length){
              registrationNo = this.multipleSelection[i].registrationNo;
            }else{
            registrationNo = this.multipleSelection[i].registrationNo + ",";
            }
          }
          ajaxRequest('post', 'back/guarantee/companyByRegistrNo', {
            registrationNo: registrationNo,
          }, (res) => {
            if (res.code === 200) {
            if(res.daoResult!=null){//登记号中的器具包含在合同中，系统默认担保人为合同签署人
                this.form.dbPerson=res.contractSignatory;
            }
            }
          })

          this.initDbTerm();
        } else if (this.companyType == "2") {//担保人为合同签署人，有效期为合同有效期
          ajaxRequest('get', 'back/guarantee/getCompany/' + this.companyId, {}, (res) => {
            if (res.code === 200) {
              this.form.dbPerson = res.contractSignatory;
              this.dbTerm = res.contractValidateEnd;
            } else {
              this.$message.error(res.msg);
            }
          })
        } else if (this.companyType == "1" || this.companyType == "4") {//三个月
          this.initDbTerm();
        } else {//第五第六类别，不允许担保，不设置默认担保期限

        }
      }
      },
      initDbTerm(){//担保期限默认三个月后
        var d = new Date();
        // 因为getMonth()获取的月份的值只能在0~11之间所以我们在进行setMonth()之前先给其减一
        d.setMonth((d.getMonth()-1) + 3);
        var yy1 = d.getFullYear();
        var mm1 = d.getMonth()+1;
        var dd1 = d.getDate();
        if (mm1 < 10 ) {
          mm1 = '0' + mm1;
        }
        if (dd1 < 10) {
          dd1 = '0' + dd1;
        }
        this.dbTerm=yy1 + '-' + mm1 + '-' + dd1;
      }
    },
    mounted() {
      this.getTableList();
      this.$nextTick(()=>{
        this.$refs.focusInput.focus()
      })
    },
    created(){

    }
  }
</script>

<style scoped>
  .centerForm{
    border-bottom:1px solid #ddd;
    width: 800px;
    margin: 0 auto;
    padding: 10px 60px 10px 0;
  }
  .wtdw{
    margin:10px 0;
    font-size:16px;
    color:blue;
    overflow: hidden;
  }
</style>
