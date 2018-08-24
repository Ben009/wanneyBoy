<template>
    <div>
        <div v-if="defaultOpen">
            <Retrieve ref="retrieve-wapper"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      :order="order"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"
                      :collectionInfo="collectionInfo"/>
        </div>
        <div style="display: flex;justify-content: space-between; margin:10px 0px;">
            <span></span>
            <div style="display: inline-block;text-align: center">
                <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning">&nbsp;清空</el-button>
            </div>
            <span style="float: right">
            <el-select size="mini" v-if="resultCondition.length" v-model="templateValue" placeholder="请选择"
                       @change="QJHandleSelectTemplate">
              <el-option
                      v-for="item in moduleList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)"
                       class="el-icon-setting">个性化设置</el-button>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                       :handleMouldBack="QJHandleMouldBack"></WorkMould>
            <global-tootips style="float: right;margin: 5px;">
                <p>1、<span style="color:red">登记号</span>：未收费；</p>
                <p>2、<span style="color:red">委托单位</span>：未到账；</p>
                <p>3、委托单位名称前含（**）符号，表示该单位有特殊要求！鼠标移至单位名称上查看详情；</p>
            </global-tootips>
          </span>
        </div>
        <div>
            <el-table :max-height="QJTableMaxHeight" ref="multipleTable" :data="tableData" border :fit="true"
                      style="width: 100%" v-loading="loading"
                      @sort-change="handleSort" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40" disabled="true" :selectable='checkboxT'></el-table-column>
                <el-table-column prop="registrationNo" label="登记号"></el-table-column>
                <el-table-column prop="orderSingleNo" label="流转单号" v-if="headObj.orderSingleNo"></el-table-column>
                <el-table-column prop="orderNo" label="委托单号" v-if="headObj.orderNo"></el-table-column>
                <el-table-column prop="companyName" label="委托单位" width="200"></el-table-column>
                <el-table-column prop="applianceName" label="器具名称" width="200"></el-table-column>
                <el-table-column prop="setNumber" label="套数" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pieceNumber" label="套/件" width="100"></el-table-column>
                <el-table-column prop="sfjz" label="费用状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sfjz ==1">已结账</span>
                        <span v-if="scope.row.sfjz ==0&&scope.row.isSettlment ==1" style="color:red">已结算</span>
                        <span v-if="scope.row.isSettlment ==0&&scope.row.feeStatus ==1" style="color:red">已录费</span>
                        <span v-if="scope.row.feeStatus ==0" style="color:red">未录费</span>
                    </template>
                </el-table-column>
                <el-table-column prop="guaranteePersonName" label="担保人"></el-table-column>
                <el-table-column prop="guaranteeDeadline" label="担保期限">
                    <template slot-scope="scope">
                        <span v-if="scope.row.guaranteeDeadline>new Date()" style="color:red">{{scope.row.guaranteeDeadline}}</span>
                        <span v-else>{{scope.row.guaranteeDeadline}}</span>
                    </template>
                </el-table-column>
              <el-table-column label="样品入库状态/货架号">
                <template slot-scope="scope">
                        <span v-if="scope.row.registrationNo.toString().substring(0,1)=='9'&&scope.row.applianceWarehouseFlag==0"
                              style="color:red">无样品</span>
                  <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea=='0'">未入库</span>
                  <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea!='0'">外送</span>
                  <span v-if="scope.row.applianceWarehouseFlag==3">已入库</span>
                  <span v-if="scope.row.applianceWarehouseFlag==4">已出库</span>
                  <span v-if="scope.row.registrationNo.toString().substring(0, 1)=='8'&&(scope.row.applianceWarehouseFlag==3||scope.row.applianceWarehouseFlag==4)">/{{scope.row.sampleWarehouseNo}}</span>
                </template>
              </el-table-column>
              <el-table-column label="证书入库状态/货架号">
                <template slot-scope="scope">
                        <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateCount<scope.row.certificateNumber"
                              style="color:red">证书未出</span>
                  <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.approveCertificateCount<scope.row.certificateNumber&&scope.row.certificateCount==scope.row.certificateNumber"
                        style="color:red">证书未批准</span>
                  <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea=='0'"
                        style="color:red">无需出证</span>
                  <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea!='0'"
                        style="color:red">外送</span>
                  <span v-if="scope.row.certificateWarehouseFlag==3">已入库</span>
                  <span v-if="scope.row.certificateWarehouseFlag==4">已出库</span>
                  <span v-if="scope.row.certificateWarehouseFlag==3||scope.row.certificateWarehouseFlag==4">/{{scope.row.certificateWarehouseNo}}</span>
                </template>
              </el-table-column>
            </el-table>
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
        <div>
            <el-button type="primary" @click="handleToggleAllCheck">全选</el-button>
            <el-button type="primary" @click="reverseSection">反选</el-button>
            <el-button type="primary" @click="batchOutage">批量出库</el-button>
        </div>
        <sendSampleForm v-if="outStore" :callback="handleClose" :data="data"
                        :title="title"></sendSampleForm>
    </div>
</template>

<script>
    //引入ajax工具
    import {ajaxRequest} from '../../util/base';
    //引入高级检索
    import Retrieve from '../../Retrieve';
    //引入个性化设置模版
    import WorkMould from '../../mould/WorkMould';
    //引入自定义表头
    import TableColumnHeader from '../../Table/TableColumnHeader';
    //引入库房信息弹层
    import sendSampleForm from './sendSampleForm';
    //引入对应的json文件 当前目录下sendSampleParam.js文件
    import paramJson from './sendSampleParam';
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";

    export default {
        components: {
            sendSampleForm,
            ElRow,
            ElCol,
            WorkMould,
            TableColumnHeader,
            Retrieve,
        },
        name: "sendSample",
        data() {
            return {
                page: 1,//页码
                rows: 10,//每页记录数
                fuzzySearch: 0,//是否模糊查询，默认关闭模糊查询
                total: 0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
                orderProperty: 'id',//排序字段
                orderType: 'desc',//排序方式
                tableData: [],//表格中的数据
                multipleSelection: [],//多选列表
                outStore: false,//批量出库弹层
                title: "",//弹层的标题
                data: [],//出库的list

                isSetting: 0,  //控制个性化设置弹窗是否展示
                edit: null,   //控制新增弹窗是否展示
                modify: null,   //控制修改弹窗是否展示
                isInner: 0,

                /*高级检索相关项*/
                rowsCondition: paramJson,   //默认同目录下json数据 会依据模板改变
                paramJson: paramJson,      //同目录下json数据 常量
                moduleList: [],           //模板列表
                templateValue: '',       //当前选择的模板id
                sortBy: '',              //排序字段
                order: '',              //desc降序 asc升序
                headObj: {},           //表头显示对象 {category:true}
                defaultOpen: true,
                userId: "",
                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: [],
                collectionInfo: [],
                loading: false
            }
        },
        methods: {
            handleToggleAllCheck() {//全选
                for (let i = 0; i < this.tableData.length; i++) {
                    let s = this.tableData[i].registrationNo.toString().substring(0, 1);
                    if (s == "8") {
                        //可勾选的情况：（1）证书状态是已入库，已结账或已担保证。（2）样品状态是已入库，已结账或已担保货
                        if ((this.tableData[i].applianceWarehouseFlag == 3 && (this.tableData[i].sfjz == 1 || this.tableData[i].guaranteeType == 1 || this.tableData[i].guaranteeType == 2)) || (this.tableData[i].certificateWarehouseFlag == 3 && (this.tableData[i].sfjz == 1 || this.tableData[i].guaranteeType == 1 || this.tableData[i].guaranteeType == 3))) {
                            this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true);
                        }
                    }
                    else if (s == "9") {//现场检测可勾选的情况：（1）证书状态是已入库，已结账或已担保证。
                        if (this.tableData[i].certificateWarehouseFlag == 3 && (this.tableData[i].sfjz == 1 || this.tableData[i].guaranteeType == 2 || this.tableData[i].guaranteeType == 3)) {
                            this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true);
                        }
                    }
                }
            },
            reverseSection(rows) {//反选
                for (let i = 0; i < this.tableData.length; i++) {
                    let s = this.tableData[i].registrationNo.toString().substring(0, 1);
                    if (s == "8") {
                        //可勾选的情况：（1）证书状态是已入库，已结账或已担保证。（2）样品状态是已入库，已结账或已担保货
                        if ((this.tableData[i].applianceWarehouseFlag == 3 && (this.tableData[i].sfjz == 1 || this.tableData[i].guaranteeType == 1 || this.tableData[i].guaranteeType == 2)) || (this.tableData[i].certificateWarehouseFlag == 3 && (this.tableData[i].sfjz == 1 || this.tableData[i].guaranteeType == 1 || this.tableData[i].guaranteeType == 3))) {
                            this.$refs.multipleTable.toggleRowSelection(this.tableData[i]);
                        }
                    }
                    else if (s == "9") {//现场检测可勾选的情况：（1）证书状态是已入库，已结账或已担保证。
                        if (this.tableData[i].certificateWarehouseFlag == 3 && (this.tableData[i].sfjz == 1 || this.tableData[i].guaranteeType == 2 || this.tableData[i].guaranteeType == 3)) {
                            this.$refs.multipleTable.toggleRowSelection(this.tableData[i]);
                        }
                    }
                }
            },
            //登记号勾选事件
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getTableList() {
                this.loading = true;
                /*获取table数据，维护data数据*/
                ajaxRequest('get', 'back/ruku/retrieveZhChuku', {
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    sc: this.sc
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData = res.rows;
                        this.total = res.total;
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
//                        for (let i = 0; i < this.tableData.length; i++) {
//                            let [sampleState, sampleWarehouseNo, sampleAndWarehouseNo] = ["", "", ""];
//                            let [certificateState, certificateWarehouseNo, certificateAndWarehouseNo] = ["", "", ""];
//                            let s = this.tableData[i].registrationNo.toString().substring(0, 1);
//                            if (s === "9") {
//                                sampleState = "无样品";
//                            } else {
//                                if (this.tableData[i].applianceWarehouseFlag === 1 ||
//                                    this.tableData[i].applianceWarehouseFlag === 0 ||
//                                    this.tableData[i].applianceWarehouseFlag === 2) {
//                                    sampleState = "未入库";
//                                } else if (this.tableData[i].applianceWarehouseFlag === 3) {
//                                    sampleState = "已入库";
//                                } else if (this.tableData[i].applianceWarehouseFlag === 4) {
//                                    sampleState = "已出库";
//                                } else {
//                                    sampleState = "";
//                                }
//                            }
//
//                            if (this.tableData[i].certificateWarehouseFlag === 3) {
//                                certificateState = "已入库";
//                            } else if (this.tableData[i].certificateWarehouseFlag === 4) {
//                                certificateState = "已出库";
//                            } else {
//                                certificateState = "未入库";
//                            }
//                            sampleWarehouseNo = this.tableData[i].sampleWarehouseNo;
//                            certificateWarehouseNo = this.tableData[i].certificateWarehouseNo;
//
//                            sampleAndWarehouseNo = sampleState + "/" + (sampleWarehouseNo ? sampleWarehouseNo : "");
//                            certificateAndWarehouseNo = certificateState + "/" + (certificateWarehouseNo ? certificateWarehouseNo : "");
//                            this.tableData[i]["sampleAndWarehouseNo"] = sampleAndWarehouseNo;
//                            this.tableData[i]["certificateAndWarehouseNo"] = certificateAndWarehouseNo;
//                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            batchOutage() {//批量出库
                if (this.multipleSelection.length > 0) {
                    this.title = "批量出库";
                    this.data = this.multipleSelection;
                    this.outStore = true;
                } else {
                    this.$message.warning('至少选择一条记录');
                    return;
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
            handleClose(rowInfo) {//关闭出库弹层
                if (rowInfo) {
                    this.getTableList();
                }
                this.outStore = false;
            },
            dealDate: function (row, column, cellValue) {
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                    return "";
                } else {
                    return new Date(cellValue).format('YYYY-MM-DD');
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
            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size
                this.getTableList()
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage
                this.getTableList()
            },
        },
        mounted() {
            this.getTableList();
            this.QJGetMounted;
        },
        created() {

        }
    }
</script>

<style scoped>
    .el-icon-setting {
        background: none !important;
        border: none !important;
        color: #3094e0 !important;
    }

    .el-icon-setting:hover {
        color: #3094e0 !important;
    }
</style>
