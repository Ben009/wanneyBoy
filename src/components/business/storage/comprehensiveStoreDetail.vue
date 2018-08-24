<template>
    <el-form ref="form" :model="form" label-width="100px">
        <div class="wtdw">
            <div style="float: left">({{companyType}}){{companyName}}</div>
            <div style="float: right">
                <global-tootips style="text-align: left">
                    <p>输入完货柜号之后，保持光标还在输入框内，按enter键，即可提交。</p>
                    <p>操作人:样品操作人/证书操作人</p>
                    <p>操作时间:样品操作时间/证书操作时间</p>
                </global-tootips>
            </div>
        </div>
        <div style="margin-left:10px">{{this.paramObj.searchKey}}单号下所有登记号状态</div>
        <div>
            <el-table :max-height="QJTableMaxHeight" ref="table" :data="tableData" border style="width: 100%"
                      :fit="true" show-summary :summary-method="getSummaries"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40" :selectable='checkboxT'></el-table-column>
                <el-table-column prop="registrationNo" label="登记号"></el-table-column>
                <el-table-column prop="applianceName" label="器具名称" width="200"></el-table-column>
                <el-table-column prop="setNumber" label="套数/退" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pieceNumber" label="套/件" width="100"></el-table-column>
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
                <el-table-column prop="sfjz" label="费用状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isSettleAccount ==1">已结账</span>
                        <span v-if="scope.row.isSettleAccount ==0&&scope.row.isSettlment ==1"
                              style="color:red">已结算</span>
                        <span v-if="scope.row.isSettlment ==0&&scope.row.feeStatus ==1" style="color:red">已录费</span>
                        <span v-if="scope.row.feeStatus ==0" style="color:red">未录费</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sampleWarehouseInPersonName" label="操作人">
                    <template slot-scope="scope">
                        <span>{{scope.row.sampleWarehouseInPersonName}}</span>
                        /<span>{{scope.row.certificateWarehouseInPerName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sampleWarehouseInDate" label="操作时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.sampleWarehouseInDate?new Date(scope.row.sampleWarehouseInDate).format('YYYY-MM-DD'):""}}</span>
                        /<span>{{scope.row.certificateWarehouseInDate?new Date(scope.row.certificateWarehouseInDate).format('YYYY-MM-DD'):""}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="guaranteeType" label="担保类型"
                                 :formatter="formatterGuaranteeType"></el-table-column>
                <el-table-column prop="guaranteePersonName" label="担保人"></el-table-column>
                <el-table-column prop="guaranteeDeadline" label="担保期限" :formatter="dealDate"></el-table-column>
            </el-table>
        </div>
        <div class="centerForm" style="width:70%;margin:0 auto">
            <el-row>
                <el-form-item>
                    <el-checkbox-group v-model="checkList">
                        <el-row>
                            <el-col :span="3">
                                <el-checkbox label="证书入库"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="证书货柜号">
                                    <el-input v-model="zshgh" ref="focusInput"
                                              @keyup.enter.native="checkSample"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">
                                <el-checkbox label="样品入库"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="样品货柜号">
                                    <el-input v-model="yphgh" ref="focusInput2"
                                              @keyup.enter.native="handleSubmit"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">&nbsp;</el-col>
                            <el-col :span="12">
                                <el-form-item label="备注">
                                    <el-input v-model="remark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                </el-form-item>
            </el-row>

            <div style="text-align: center">
                <el-button type="primary" @click="handleSubmit">入库</el-button>
                <el-button @click="goBack">返回</el-button>
            </div>
        </div>
        <div style="margin-left:10px">对应委托单下所有证书和库房信息</div>
        <div style="margin-bottom: 20px;">
            <el-table :max-height="QJTableMaxHeight" ref="table2" :data="tableData2" border style="width: 100%"
                      :fit="true" @selection-change="handleSelectionChange">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="registrationNo" label="登记号"></el-table-column>
                <el-table-column prop="applianceName" label="器具名称" width="200"></el-table-column>
                <el-table-column prop="setNumber" label="套数" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pieceNumber" label="套/件" width="100"></el-table-column>
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
                <el-table-column prop="sfjz" label="费用状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isSettleAccount ==1">已结账</span>
                        <span v-if="scope.row.isSettleAccount ==0 &&scope.row.isSettlment ==1"
                              style="color:red">已结算</span>
                        <span v-if="scope.row.isSettlment == 0&& scope.row.feeStatus ==1" style="color:red">已录费</span>
                        <span v-if="scope.row.feeStatus ==0" style="color:red">未录费</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sampleWarehouseInPersonName" label="操作人">
                    <template slot-scope="scope">
                        <span>{{scope.row.sampleWarehouseInPersonName}}</span>
                        /<span>{{scope.row.certificateWarehouseInPerName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sampleWarehouseInDate" label="操作时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.sampleWarehouseInDate?new Date(scope.row.sampleWarehouseInDate).format('YYYY-MM-DD'):""}}</span>
                        /<span>{{scope.row.certificateWarehouseInDate?new Date(scope.row.certificateWarehouseInDate).format('YYYY-MM-DD'):""}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="guaranteeType" label="担保类型"
                                 :formatter="formatterGuaranteeType"></el-table-column>
                <el-table-column prop="guaranteePersonName" label="担保人"></el-table-column>
                <el-table-column prop="guaranteeDeadline" label="担保期限" :formatter="dealDate"></el-table-column>
            </el-table>
        </div>
    </el-form>
</template>

<script>
    //引入ajax工具
    import {ajaxRequest} from '../../util/base';
    //引入jquery
    import $ from 'jquery';
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";

    const defaults = {};
    export default {
        components: {
            ElRow,
            ElCol
        },
        name: "originalRecordHandDetail",
        data() {
            return {
                form: $.extend({}, defaults, this.data || {}),
                tableData: [],//表格中的数据
                tableData2: [],//表格中的数据
                multipleSelection: [],//多选，选中的数据
                zshgh: "",//证书货柜号
                yphgh: "",//样品货柜号
                remark: "",//备注
                companyName: "",//委托单位名称
                companyId: "",//委托单位ID
                companyType: "",//委托单位等级
                paramObj: this.$route.query,
                flag: false,//用于判断是否加载表格
                searchKey: "",//查询单号
                entryStorageType: "",//入库类型
                checkList: [],
            }
        },
        methods: {
            formatterGuaranteeType: function (row, column, cellValue, index) {
                return cellValue === 1 ? '货证齐担' : cellValue === 2 ? '仅担保货' : cellValue === 3 ? '仅担保证' : ''
            },
            checkSample() {
                this.checkEntryStorageType();
                if (this.entryStorageType === 1 || this.entryStorageType === 3) {
                    this.$refs.focusInput2.focus()
                } else {
                    this.handleSubmit();
                }
            },
            getTable1List() {
                let _self = this;
                _self.flag = _self.paramObj.flag;
                this.checkEntryStorageType();
                /*获取table数据，维护data数据*/
                ajaxRequest('get', 'back/ruku/getUnInStorageData', {
                    registrationNos: _self.paramObj.searchKey,//单号
                }, res => {
                    if (res.code === 200) {
                        _self.tableData = res.rows;
                        _self.$nextTick(val => {
                          for (let i = 0; i < _self.tableData.length; i++) {
                            let s = _self.tableData[i].registrationNo.toString().substring(0, 1);
                            if (s === "8") {
                              //非现场检测。不可勾选条件：样品不可入库且证书不可入库或检测未完成。
                              //样品不可入库条件：1.样品不是未入库。
                              //证书不可入库条件：1.证书不是未入库 2.无需出证 3.证书未批准（批准<应出，包含了证书未出）4.证书未出（已出<应出）。
                              if (((_self.tableData[i].applianceWarehouseFlag != 0) && (_self.tableData[i].certificateWarehouseFlag == !0 || _self.tableData[i].subcontactArea == '0' || _self.tableData[i].certificateCount < _self.tableData[i].certificateNumber))||_self.tableData[i].finishFlag!=1) {

                              } else {
                                _self.$refs.table.toggleRowSelection(this.tableData[i], true);
                              }
                            } else if(s === "9"){
                              //现场检测。不可勾选条件：1.证书不是未入库 2.无需出证 3.证书未批准（批准<应出，包含了证书未出）4.证书未出（已出<应出）。5.检测未完成
                              if (_self.tableData[i].certificateWarehouseFlag == !0 || _self.tableData[i].subcontactArea == '0' || _self.tableData[i].certificateCount < _self.tableData[i].certificateNumber) {

                              } else {
                                _self.$refs.table.toggleRowSelection(this.tableData[i], true);
                              }
                            }
                          }
                            }
                        );
                    }
                });

            },
            getTable2List() {
                let _self = this;
                ajaxRequest('get', 'back/ruku/getOtherUnInStorData', {
                    registrationNos: _self.paramObj.searchKey,//登记号
                }, res => {
                    if (res.code === 200) {
                        _self.tableData2 = res.rows;
                    }
                });

            },
            checkboxT(row, index) {
                let s = row.registrationNo.toString().substring(0, 1);
                if(s === "8"){
                  //非现场检测。需要出证的不可勾选条件：样品不可入库且证书不可入库或检测未完成。
                  //无需出证的不可勾选条件：样品不可入库。
                  //样品不可入库条件：1.样品不是未入库。
                  //证书不可入库条件：1.证书不是未入库 2.无需出证 3.证书未批准（批准<应出，包含了证书未出）4.证书未出（已出<应出）。
                  if(((row.applianceWarehouseFlag!=0)&&(row.certificateWarehouseFlag==!0||row.subcontactArea=='0'||row.certificateCount<row.certificateNumber))||row.finishFlag!=1){
                    return 0;
                  }else{
                    return 1;
                  }
                }
                else if(s === "9"){
                  //现场检测。不可勾选条件：1.证书不是未入库 2.无需出证 3.证书未批准（批准<应出，包含了证书未出）4.证书未出（已出<应出）。
                  if(row.certificateWarehouseFlag==!0||row.subcontactArea=='0'||row.certificateCount<row.certificateNumber){
                    return 0;
                  }else{
                    return 1;
                  }
                }
            },
            handleSubmit() {
                this.checkEntryStorageType();
                if (this.multipleSelection.length <= 0) {
                    this.$message.warning('必须选择一条数据');
                    return false;
                }
                if (this.checkList.length > 1) {
                    if (this.zshgh === "") {
                        this.$message.warning('证书货柜号未填写');
                        return false;
                    } else if (this.yphgh === "") {
                        this.$message.warning('样品货柜号未填写');
                        return false;
                    }
                } else if (this.checkList.length === 1) {
                    if (this.checkList[0] === '样品入库' && this.yphgh === "") {
                        this.$message.warning('样品货柜号未填写');
                        return false;
                    }
                    if (this.checkList[0] === '证书入库' && this.zshgh === "") {
                        this.$message.warning('证书货柜号未填写');
                        return false;
                    }
                } else {
                    this.$message.warning('请至少选择一种入库类别');
                    return false;
                }
                //
                this.form.sampleWarehouseNo = this.yphgh;
                this.form.certificateWarehouseNo = this.zshgh;
                this.form.remark = this.remark;
                this.form.entryStorageType = this.entryStorageType;
                this.form.dhlist = JSON.stringify(this.multipleSelection);
                //判断选中的数据是否符合入库的条件
//                let status = false;
//                this.multipleSelection.forEach((row, index) => {
//                    if (this.checkList.length > 1) {
//                        if (row.applianceWarehouseFlag === 3 || row.applianceWarehouseFlag === 4 ||
//                            row.certificateWarehouseFlag === 3 || row.certificateWarehouseFlag === 4) {
//                            this.$message.warning('选中的记录已经样品入库或者证书入库');
//                        } else {
//                            status = true;
//                        }
//                    } else if (this.checkList.length === 1 && this.checkList[0] === '样品入库') {
//                        if (row.applianceWarehouseFlag === 3 || row.applianceWarehouseFlag === 4) {
//                            this.$message.warning('选中的记录已经样品入库');
//                        } else {
//                            status = true;
//                        }
//                    } else if (this.checkList.length === 1 && this.checkList[0] === '证书入库') {
//                        if (row.certificateWarehouseFlag === 3 || row.certificateWarehouseFlag === 4) {
//                            this.$message.warning('选中的记录已经证书入库');
//                        } else {
//                            status = true;
//                        }
//                    }
//                });
//                if (status) {
                    ajaxRequest('post', 'back/ruku/addZhRuku', this.form, (res) => {
                        if (res.code === 200) {
                            this.$message.success('提交成功');
                            this.$router.push({
                                path: '/admin/517',
                            })
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
//                }
            },
            goBack() {
                this.$router.push({
                    path: '/admin/517',
                })
            },
            dealDate: function (row, column, cellValue) {
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                    return "";
                } else {
                    return new Date(cellValue).format('YYYY-MM-DD');
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            checkEntryStorageType() {
                if (this.checkList.length > 1) {
                    this.entryStorageType = 3;
                } else {
                    if (this.checkList[0] === "样品入库") {
                        this.entryStorageType = 1;
                    } else if (this.checkList[0] === "证书入库") {
                        this.entryStorageType = 2;
                    }
                }
            },
            //合计行
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 2 || index === 5 || index === 6 || index === 7 || index === 8 || index === 9 || index === 10 || index === 11 || index === 12) {
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
            }
        },
        mounted() {
            let _self = this;
            _self.companyType = _self.paramObj.companyType;
            _self.companyId = _self.paramObj.companyId;
            _self.companyName = _self.paramObj.companyName;
            _self.checkList = _self.paramObj.checkList;
            _self.getTable1List();
            _self.getTable2List();
            _self.$nextTick(() => {
                _self.$refs.focusInput.focus();
            });
        }
    }
</script>

<style scoped>
    .centerForm {
        border-bottom: 1px solid #ddd;
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
