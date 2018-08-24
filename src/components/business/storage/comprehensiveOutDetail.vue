<template>
    <el-form ref="form" :model="form" label-width="150px">
        <div class="wtdw">
            <div style="float: left">({{companyType}}){{companyName}}</div>
            <div style="float: right">
                <global-tootips width="600" style="text-align: left">
                    <p>1、若该查询的条件旗下所有登记号已结账，则系统默认结账出库；</p>
                    <p>2、若该查询的条件旗下单位类别为第一类别，则系统默认高权限单位出库；</p>
                    <p>3、若该查询的条件旗下所有登记号含未结帐并已担保，则系统默认担保出库；</p>
                    <p>4、不符合上所述情况下，系统不允许出库。</p>
                </global-tootips>
            </div>
        </div>
        <div style="margin-left:10px">单号状态</div>
        <div>
            <el-table :max-height="QJTableMaxHeight"
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
                        prop="companyName"
                        label="委托单位"
                        width="200">
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
                <el-table-column
                        prop="pieceNumber"
                        label="套/件">
                </el-table-column>
                <el-table-column prop="sfjz" label="费用状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sfjz ==1">已结账</span>
                        <span v-if="scope.row.sfjz ==0&&scope.row.isSettlment ==1" style="color:red">已结算</span>
                        <span v-if="scope.row.isSettlment ==0&&scope.row.feeStatus ==1" style="color:red">已录费</span>
                        <span v-if="scope.row.feeStatus ==0" style="color:red">未录费</span>
                    </template>
                </el-table-column>
              <el-table-column label="样品入库状态/货架号">
                <template slot-scope="scope">
                  <span v-if="scope.row.registrationNo.toString().substring(0,1)=='9'&&scope.row.applianceWarehouseFlag==0" style="color:red">无样品</span>
                  <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea=='0'">未入库</span>
                  <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea!='0'">外送</span>
                  <span v-if="scope.row.applianceWarehouseFlag==3">已入库</span>
                  <span v-if="scope.row.applianceWarehouseFlag==4">已出库</span>
                  <span v-if="scope.row.registrationNo.toString().substring(0, 1)=='8'&&(scope.row.applianceWarehouseFlag==3||scope.row.applianceWarehouseFlag==4)">/{{scope.row.sampleWarehouseNo}}</span>
                </template>
              </el-table-column>
              <el-table-column label="证书入库状态/货架号">
                <template slot-scope="scope">
                  <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateCount<scope.row.certificateNumber" style="color:red">证书未出</span>
                  <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.approveCertificateCount<scope.row.certificateNumber&&scope.row.certificateCount==scope.row.certificateNumber" style="color:red">证书未批准</span>
                  <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea=='0'" style="color:red">无需出证</span>
                  <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea!='0'" style="color:red">外送</span>
                  <span v-if="scope.row.certificateWarehouseFlag==3">已入库</span>
                  <span v-if="scope.row.certificateWarehouseFlag==4">已出库</span>
                  <span v-if="scope.row.certificateWarehouseFlag==3||scope.row.certificateWarehouseFlag==4">/{{scope.row.certificateWarehouseNo}}</span>
                </template>
              </el-table-column>
                <el-table-column
                        prop="guaranteeType"
                        label="担保类型"
                        :formatter="function(row, column, cellValue, index){return cellValue=='1'?'货证齐担':cellValue=='2'?'仅担保货':cellValue=='3'?'仅担保证':''}">
                </el-table-column>
                <el-table-column
                        prop="guaranteePersonName"
                        label="担保人">
                </el-table-column>
                <el-table-column
                        prop="guaranteeTime"
                        label="担保期限"
                        :formatter="dealDate">
                </el-table-column>
            </el-table>
        </div>
        <div class="centerForm">
            <div>
                <el-form-item label="出库类型">
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox label="证书出库"></el-checkbox>
                        <el-checkbox label="样品出库"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="出库方式">
                    <el-radio-group v-model="outWay">
                        <!--<el-radio :label="1">快递</el-radio>-->
                        <el-radio :label="2">客户自取</el-radio>
                        <!--<el-radio :label="3">样管员送样</el-radio>-->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="单位名称">
                    <el-autocomplete style="width: 100%"
                                     v-model="companyName"
                                     :fetch-suggestions="querySearchEntrust"
                                     placeholder="请输入委托单位"
                                     @select="handleSelect"
                    >
                        <template slot-scope='scope'>
                            <div>
                  <span style="margin-left:0">({{scope.item.companyType}}) {{scope.item.companyName}}
                     (<span :style="{color:scope.item.status == 0 ? 'red' : 'green'}">{{scope.item.status == 0 ? '未审核' : '已审核'}}</span>)
                     {{!!scope.item.companyDepart ? '['+scope.item.companyDepart+']' : ''}}
                     {{!!scope.item.contacter ? '['+scope.item.contacter+']' : ''}}
                     {{!!scope.item.mobilePhone ? '['+scope.item.mobilePhone+']' : ''}}
                  </span>
                            </div>
                        </template>
                    </el-autocomplete>
                    <el-input v-model="companyId" v-show="false"></el-input>
                </el-form-item>
                <el-form-item label="快递公司" v-if="outWay===1">
                    <el-select v-model="expressCompany" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.code"
                                :label="item.premark"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递单号" v-if="outWay===1">
                    <el-input v-model="courierNum" @keyup.enter.native="handleSubmit"></el-input>
                </el-form-item>
                <el-form-item label="收件人" v-if="outWay===1">
                    <el-input v-model="person" @keyup.enter.native="handleSubmit"></el-input>
                </el-form-item>
                <el-form-item label="收件地址" v-if="outWay===1">
                    <el-input v-model="address" @keyup.enter.native="handleSubmit"></el-input>
                </el-form-item>
                <el-form-item label="收件人电话" v-if="outWay===1">
                    <el-input v-model="mobile" @keyup.enter.native="handleSubmit"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="remark" @keyup.enter.native="handleSubmit"></el-input>
                </el-form-item>
                <el-form-item label="操作方式">
                    <el-radio-group v-model="operateWay">
                        <el-radio :label="1">出库并生成出库单</el-radio>
                        <el-radio :label="2">仅出库</el-radio>
                        <el-radio :label="3">仅生成出库单</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="checked">自动打印出库单</el-checkbox>
                </el-form-item>
            </div>
            <div style="text-align: center">
                <el-button type="primary" @click="handleSubmit">出库</el-button>
                <el-button @click="goBack">返回</el-button>
            </div>
        </div>
        <div style="margin-left:10px">单位其它登记号对应库房信息</div>
        <div>
            <el-table :max-height="QJTableMaxHeight"
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
                        prop="companyName"
                        label="委托单位"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="applianceName"
                        label="器具名称"
                        width="200">
                </el-table-column>
                <el-table-column prop="setNumber" label="套数/退" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="pieceNumber"
                        label="套/件"
                        width="100">
                </el-table-column>
                <el-table-column prop="sfjz" label="费用状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sfjz ==1">已结账</span>
                        <span v-if="scope.row.sfjz ==0&&scope.row.isSettlment ==1" style="color:red">已结算</span>
                        <span v-if="scope.row.isSettlment ==0&&scope.row.feeStatus ==1" style="color:red">已录费</span>
                        <span v-if="scope.row.feeStatus ==0" style="color:red">未录费</span>
                    </template>
                </el-table-column>
                <el-table-column label="样品入库状态/货架号">
                  <template slot-scope="scope">
                    <span v-if="scope.row.registrationNo.toString().substring(0,1)=='9'&&scope.row.applianceWarehouseFlag==0" style="color:red">无样品</span>
                    <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea=='0'">未入库</span>
                    <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea!='0'">外送</span>
                    <span v-if="scope.row.applianceWarehouseFlag==3">已入库</span>
                    <span v-if="scope.row.applianceWarehouseFlag==4">已出库</span>
                    <span v-if="scope.row.registrationNo.toString().substring(0, 1)=='8'&&(scope.row.applianceWarehouseFlag==3||scope.row.applianceWarehouseFlag==4)">/{{scope.row.sampleWarehouseNo}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="证书入库状态/货架号">
                  <template slot-scope="scope">
                  <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateCount<scope.row.certificateNumber" style="color:red">证书未出</span>
                    <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.approveCertificateCount<scope.row.certificateNumber&&scope.row.certificateCount==scope.row.certificateNumber" style="color:red">证书未批准</span>
                    <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea=='0'" style="color:red">无需出证</span>
                    <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea!='0'" style="color:red">外送</span>
                    <span v-if="scope.row.certificateWarehouseFlag==3">已入库</span>
                    <span v-if="scope.row.certificateWarehouseFlag==4">已出库</span>
                    <span v-if="scope.row.certificateWarehouseFlag==3||scope.row.certificateWarehouseFlag==4">/{{scope.row.certificateWarehouseNo}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                        prop="guaranteeType"
                        label="担保类型"
                        :formatter="function(row, column, cellValue, index){return cellValue=='1'?'货证齐担':cellValue=='2'?'仅担保货':cellValue=='3'?'仅担保证':''}">
                </el-table-column>
                <el-table-column
                        prop="guaranteePersonName"
                        label="担保人">
                </el-table-column>
                <el-table-column
                        prop="guaranteeTime"
                        label="担保期限"
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
    import {ajaxRequest, ajaxProxyRequest} from '../../util/base';
    //引入jquery
    import $ from 'jquery';
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";

    const defaults = {};
    export default {
        components: {
            ElRow,
            ElCol,
        },
        name: "comprehensiveOutDetail",
        data() {
            return {
                form: $.extend({}, defaults, this.data || {}),
                orderProperty: 'id',//排序字段
                orderType: 'desc',//排序方式
                tableData: [],//表格中的数据
                tableData2: [],//表格中的数据
                multipleSelection: [],//多选，选中的数据
                company: "",//最上方显示的委托单位名称
                companyType: "",//单位等级
                checkList: [],
                cklx: "",//出库类型
                outWay: 2,//出库方式
                companyName: "",//单位名称
                companyId: "",//单位id
                expressCompany: "",//快递公司
                options: [],//快递公司选项列表
                courierNum: "",//快递单号
                person: "",//收件人
                address: "",//收件地址
                mobile: "",//收件人电话
                remark: "",//备注
                operateWay: 1,//操作方式
                checked: false,//自动打印出库单
                paramObj: this.$route.query,
            }
        },
        methods: {
            //委托单位autoComplete
            querySearchEntrust(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                let params = queryString
                    ? {
                        companyName: queryString,
                        fuzzySearch: 1
                    }
                    : "";
                ajaxRequest("get", "back/company/retrieve", params, res => {
                    if (res.code == 200) {
                        this.handleResult(res.rows);
                        cb(res.rows);
                    }
                });
            },
            handleResult(res) {
                for (let key in res) {
                    Vue.set(res[key], "value", res[key].companyName);
                }
            },
            handleSelect(item) {
                this.companyId = item.id;
            },
            getTableList() {
              this.checkList=this.paramObj.checkList;
              this.cklx=this.paramObj.cklx;
              this.companyId= this.paramObj.companyId;
              this.checkCklx();
                /*获取table数据，维护data数据*/
                ajaxRequest('get', 'back/out/storage/getUnOutData', {
                    registrationNos: this.paramObj.registrations,//登记号
                    companyId: this.paramObj.companyId,//单位ID
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData = res.rows;
                        this.companyType = res.rows[0].companyType;
                        this.company = res.rows[0].companyName;
                        this.companyName = this.company;
                        this.checkList = this.paramObj.checkList;
                        this.$nextTick(val => {
                          for (let i = 0; i < this.tableData.length; i++) {
                            let s = this.tableData[i].registrationNo.toString().substring(0, 1);
                            if (s == "8"&&(this.tableData[i].certificateNumber==0&&this.tableData[i].subcontactArea!='0')) {//非现场检测（无需出证）：样品不能出库，不能勾选
                              if((this.tableData[i].applianceWarehouseFlag != 3 || (this.tableData[i].sfjz === 0 && this.tableData[i].guaranteeType != "1" && this.tableData[i].guaranteeType != "2"))){
                                this.$refs.table.toggleRowSelection(this.tableData[i], true);
                              }else {

                              }
                            } else if (s == "9") {//现场检测的：证书已入库，已担保证或已结账，可勾选
                              if (this.tableData[i].certificateWarehouseFlag == 3 && (this.tableData[i].sfjz == 1 || this.tableData[i].guaranteeType == 3 || this.tableData[i].guaranteeType == 1)) {
                                this.$refs.table.toggleRowSelection(this.tableData[i], true);
                              } else {

                              }
                            }else{
                              //非现场检测（需要出证），样品证书均不能出库，不能勾选。
                              // 样品不能出库条件：1.样品不是已入库（3） 2.样品已入库，但未结账且样品未担保 3.现场检测
                              //证书不能出库条件：1.证书不是已入库（3） 2.证书已入库，但未结账且证书未担保
                              if ((this.tableData[i].applianceWarehouseFlag != 3 || (this.tableData[i].sfjz === 0 && this.tableData[i].guaranteeType != "1" && this.tableData[i].guaranteeType != "2")) && (this.tableData[i].certificateWarehouseFlag != 3 || (this.tableData[i].sfjz === 0 && this.tableData[i].guaranteeType != "1" && this.tableData[i].guaranteeType != "3"))) {

                              } else {
                                this.$refs.table.toggleRowSelection(this.tableData[i], true);
                              }
                            }
                          }
                        });
                    } else {
                    }
                })
                ajaxRequest('get', 'back/out/storage/getAllUnOutDate', {
                    registrationNos: this.paramObj.registrations,//登记号
                    companyId: this.paramObj.companyId,//单位ID
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData2 = res.rows;
                    } else {
                    }
                })
            },
            getExpressCompany() {//快递公司下拉框
                ajaxProxyRequest('get', '/njmind/findParams/express', {codeType: 'NUMBER'}, (res) => {
                    this.options = res.express.list;
                })
            },
            handleSubmit() {
                if (this.multipleSelection.length <= 0) {
                    this.$message.warning('必须选择一条数据');
                    return;
                }
                if (this.operateWay === "") {
                    this.$message.warning('操作方式没有选择');
                    return;
                }
                this.checkCklx();
                this.form.cklx = this.cklx;
                this.form.dhlist = JSON.stringify(this.multipleSelection);
                this.form.ckfs = this.outWay;
                this.form.dwmc = this.companyName;
                this.form.dwid = this.companyId;
                this.form.expressName = this.expressCompany;
                this.form.expressNo = this.courierNum;
                this.form.receivePerson = this.person;
                this.form.receiveAddress = this.address;
                this.form.receiveMobile = this.mobile;
                this.form.remark = this.remark;
                this.form.czfs = this.operateWay;
                this.form.checked = this.checked;
                ajaxRequest('post', 'back/ruku/chuKu', this.form, (res) => {
                    if (res.code === 200) {
                        this.$message.success('提交成功');
                        this.$router.push({
                            path: '/admin/680',
                        })
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },
            goBack() {
                this.$router.push({
                    path: '/admin/680',
                })
            },
            dealDate: function (row, column, cellValue) {
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                    return "";
                } else {
                    return new Date(cellValue).format('YYYY-MM-DD');
                }
            },
            checkboxT(row, index) {
                let s = row.registrationNo.toString().substring(0, 1);
                if (s == "8"&&(row.certificateNumber==0&&row.subcontactArea!='0')) {//非现场检测（无需出证），样品不能出库，不能勾选。
                  if((this.tableData[i].applianceWarehouseFlag != 3 || (this.tableData[i].sfjz === 0 && this.tableData[i].guaranteeType != "1" && this.tableData[i].guaranteeType != "2"))){
                    this.$refs.table.toggleRowSelection(this.tableData[i], true);
                  }else {

                  }
                } else if (s == "9") {//现场检测的：证书已入库，已担保证或已结账，可勾选
                    if (row.certificateWarehouseFlag == 3 && (row.sfjz == 1 || row.guaranteeType == 3 || row.guaranteeType == 1)) {
                        return 1;
                    } else {
                        return 0;
                    }
                }else{//非现场检测（需要出证），样品证书均不能出库，不能勾选。
                  // 样品不能出库条件：1.样品不是已入库（3） 2.样品已入库，但未结账且样品未担保 3.现场检测
                  //证书不能出库条件：1.证书不是已入库（3） 2.证书已入库，但未结账且证书未担保
                  if ((row.applianceWarehouseFlag != 3 || (row.sfjz === 0 && row.guaranteeType != "1" && row.guaranteeType != "2")) && (row.certificateWarehouseFlag != 3 || (row.sfjz === 0 && row.guaranteeType != "1" && row.guaranteeType != "3"))) {
                    return 0;
                  } else {
                    return 1;
                  }
                }
            },
            handleSort: function (column, prop, order) {
                /*用ui组件提供的排序接口,维护实例data数据*/
                this.orderProperty = column['prop'];
                if (column['order'] == 'descending') {
                    this.orderType = 'desc';
                } else {
                    this.orderType = 'asc';
                }
                this.getTableList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            checkCklx() {
                if (this.checkList.length > 1) {
                    this.cklx = 3;
                } else {
                    if (this.checkList[0] == "样品出库") {
                        this.cklx = 1;
                    } else if (this.checkList[0] == "证书出库") {
                        this.cklx = 2;
                    }
                }
            },
            //合计行
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 2 || index === 3 || index === 6 || index === 7 || index === 8 || index === 9 || index === 10 || index === 11) {
                        sums[index] = '';
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
        },
        mounted() {
            this.getExpressCompany();
            this.getTableList();
        },
        created() {

        }
    }
</script>

<style scoped>
    .centerForm {
        border: 1px solid #ddd;
        margin: 10px 0;
        padding: 10px 10px;
    }

    .wtdw {
        margin: 10px 0;
        font-size: 16px;
        color: blue;
        overflow: hidden;
    }
</style>
