<template>
    <div style="position:relative;">
        <el-form ref="form" :model="form" size="small">
            <el-row>
                <el-col :span="4">
                    <el-form-item label-width="140px" label="预计工作量(小时)" prop="estimatedWorkload"
                                  :rules="{type: 'number', message: '请输入数字'}">
                        <el-input v-model.number="form.estimatedWorkload" type="number" min="0"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="15">
                    <el-form-item label-width="80px" label="执行人" prop="taskPerson">
                        <el-input type="input" style="width: 50%;" v-model="taskPerson.join()" readonly></el-input>
                        <el-select v-model="form.orgId" @change="changeDepartEvt" style="width: 25%;">
                            <el-option
                                    v-for="item in orgIds"
                                    :key="item.id"
                                    :label="item.departName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select
                                placeholder="请选择"
                                v-model="form.user" @change="userDataChangeEvt" style="width: 20%;">
                            <el-option
                                    v-for="item in users"
                                    :key="item.id"
                                    :label="item.userName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" size="mini" @click="claimantClick">认领</el-button>
                    <el-button type="warning" size="mini" @click="rsSetClamntClick">撤销</el-button>
                    <el-button type="warning" size="mini" @click="removeClaimant">清空</el-button>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col :span="8">
                    <el-form-item label-width="120px" label="计划日期" prop="planTime">
                        <el-date-picker
                                v-model="form.planTime"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label-width="80px" label="执行人" prop="zxr">
                        <el-input type="input" v-model="form.inspector"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label-width="80px" label="委托单位" prop="wtdw">
                        <el-input type="input" v-model="form.companyName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="mini" style="margin-left: 20px" @click="getTableList">查询</el-button>
                </el-col>
            </el-row>
        </el-form>
        <div>
            <div style="float:right">
                <global-tootips :width="600">
                    <p>１、如果一个任务安排多天时，只支持对此任务安排的最后一天的时间进行认领；</p>
                    <p>２、委托单位带有*表示该任务有特殊说明，您可将鼠标移至委托单位查询名称上查看；如有附件可在此下载；</p>
                    <p>３、您可点击委托单号打印现场委托单，点击流转单号打印流转单。</p>
                </global-tootips>
            </div>
            <div>
                <el-table :data="tableData" :max-height="QJTableMaxHeight" v-loading="loading"
                          :span-method="arraySpanMethod" border>
                    <el-table-column type="index" label="序号" align="center" width="50px"></el-table-column>
                    <el-table-column prop="planTime" label="计划日期" align="center">
                        <template slot-scope="scope">
                            {{scope.row.planTime}}
                            <el-button v-show="isSelfarrange=='0'" type="warning" class="p-2" size="mini"
                                       @click="handleView(scope.row)" v-has="'M13926'">自排
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="委托单号" align="left">
                        <template slot-scope="scope">
                            <span style="color:blue" @click="printOrder(scope.row)">{{scope.row.orderNo}}</span>
                            <el-button v-show="isSelfarrange=='1'" type="warning" class="p-2" size="mini"
                                       @click="handleView(scope.row)">详细
                            </el-button>
                            <el-tooltip content="选中当前委托单下所有器具" placement="bottom" effect="light">
                                <el-checkbox v-model="scope.row.isCheckedOrderNo"
                                             @change="checkChangeEvt(scope.row,scope.row.isCheckedOrderNo)"
                                             v-show="scope.row.detectionMethod!='2'&&scope.row.flag=='0'"></el-checkbox>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="companyName" label="委托单位" align="center">
                        <template slot-scope="scope">
                            <companyPopover :rowInfo="scope.row" showContent="companyName"></companyPopover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="detectionSite" label="上门检测地址" align="center"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column prop="leader" label="带队人" align="center" show-overflow-tooltip
                                     :formatter="userFormat"></el-table-column>
                    <el-table-column prop="vehicle" label="车辆情况" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="driver" label="司机" align="center" show-overflow-tooltip
                                     :formatter="userFormat"></el-table-column>
                    <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderSingleNo" label="流转单号" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span style="color:blue"
                                  @click="printOrderSingle(scope.row)">{{scope.row.orderSingleNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="选择" align="center" prop="isChecked" width="50px">
                        <template slot-scope="scope">
                            <el-tooltip :disabled="!(scope.row.flag=='1'||scope.row.detectionMethod=='2')"
                                        content="存在最大计划日期或者器具检测方式为带回" placement="bottom" effect="light">
                                <el-checkbox v-model="scope.row.isChecked"
                                             :disabled="scope.row.flag=='1'||scope.row.detectionMethod=='2'"></el-checkbox>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="applianceName" label="器具名称" align="center"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column prop="setNumber" label="套数" align="center" width="50px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column prop="departId" label="检测部门" align="center" show-overflow-tooltip
                                     :formatter="departFormat"></el-table-column>
                    <el-table-column prop="claimant" label="认领人" align="center" show-overflow-tooltip
                                     :formatter="userFormat"></el-table-column>
                    <el-table-column prop="claimTime" label="认领时间" align="center" show-overflow-tooltip
                                     :formatter="dateFormat"></el-table-column>
                    <el-table-column prop="inspector" label="执行人" align="center"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column prop="estimatedWorkload" label="工作量" align="center"
                                     show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div style="margin-top:10px;text-align:center; float:right;">
                <mind-pagination
                        :current-page="page"
                        :page-size="rows"
                        :total="total"
                        @size-change="handlePageSizeChange"
                        @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
        </div>
        <!--委托单详情-->
        <AssignmentDialog v-if="!!assigmentDialog" :isShow="isShow" :orderNo="assigmentDialog"
                          :callback="handleViewCallback"></AssignmentDialog>
    </div>
</template>

<script>
    import Vue from "vue";
    import Vuex from "vuex";
    import AssignmentDialog from "./AssigmentDialog.vue";
    import companyPopover from './companyPopover.vue';
    import {ajaxRequest, formatDate, ajaxProxyRequest} from "../../util/base";
    import $ from 'jquery';

    /*   import {
        Button,
        Table,
        TableColumn,
        Form,
        FormItem,
        Tag
      } from "element--ui";
      Vue.use(Button);
      Vue.use(Table);
      Vue.use(TableColumn);
      Vue.use(Form);
      Vue.use(FormItem);
      Vue.use(Tag); */

    export default {
        name: "plan-arrange-dis-detail",
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: "",
                tableData: [],
                multipleSelection: [],
                form: {},
                rules: {},
                orgIds: [],
                users: [],
                userData: [],
                assigmentDialog: null,
                orderSingleNoState: true,
                comPanyForm: {
                    'specialRequirement': '',
                    'attachment': '',
                    'remarkQuo': '',
                    'attachmentQuo': '',
                    'otherSpecialRequirement': ''
                },
                isShow: false,
                showEppro: false,
                taskPerson: [],
                isShowTooltips: {},
                loading: false
            };
        },
        props: ["isSelfarrange"],
        components: {AssignmentDialog, companyPopover},
        created() {
            this.initDepart();
            this.getUserData();
        },
        mounted() {
            this.getTableList();
        },
        computed: {},
        filters: {
            claimTimeFormat(myInput) {
                return formatDate(myInput, "YYYY-MM-DD");
            }
        },
        methods: {
            //流转单打印
            printOrderSingle(rowInfo) {
                this.printHtml("planOrderSingle", {planId: rowInfo.id, orderSingleNo: rowInfo.orderSingleNo})
            },
            //委托单打印
            printOrder(rowInfo) {
                this.printHtml("planOrderPrint", {planId: rowInfo.id, orderNo: rowInfo.orderNo});
            },
            userFormat(row, column, cellValue, index) {
                let returnName = "";
                this.userData.forEach(data => {
                    if (data.id == cellValue) {
                        returnName = data.userName;
                        return;
                    }
                });
                return returnName;
            },
            departFormat(row, column, cellValue, index) {
                let returnName = "";
                this.orgIds.forEach(data => {
                    if (data.id == cellValue) {
                        returnName = data.departName;
                        return;
                    }
                });
                return returnName;
            },
            dateFormat(row, column, cellValue, index) {
                return formatDate(cellValue, "YYYY-MM-DD hh:mm:ss");
            },
            isOrderSingleNo(row, column, cellValue, index) {
                if (row.orderSingleNo) {
                    alert(2);
                }
            },
            getTableList() {
                this.loading = true;
                ajaxRequest(
                    "get",
                    "back/arrange/assignmentTaskList",
                    {
                        isSelfarrange: this.isSelfarrange,
                        planTime: this.form.planTime,
                        inspector: this.form.inspector,
                        companyName: this.form.companyName,
                        page: this.page,
                        rows: this.rows,
                        total: 0
                    },
                    res => {
                        if (res.code === 200) {
                            this.tableData = res.rows;
                            console.table(this.tableData)
                            this.total = res.total;
                            this.multipleSelection = [];
                        }
                        this.loading = false
                    }
                );
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size;
                this.getTableList();
            },
            initDepart() {
                //获取部门数据
                ajaxRequest(
                    "get",
                    "back/depart/list/",
                    {
                        isDelete: 0
                    },
                    res => {
                        this.orgIds = res.rows;
                    }
                );
            },
            getUserData() {
                ajaxRequest(
                    "get",
                    "back/user/retrieve",
                    {
                        isDelete: 0
                    },
                    res => {
                        if (res.code === 200) {
                            this.userData = res.rows;
                        }
                    }
                );
            },
            changeDepartEvt(orgId) {
                //根据部门ID获取人员
                this.form.user = '';
                if (orgId) {
                    ajaxRequest(
                        "get",
                        "back/user/retrieve",
                        {
                            departId: orgId
                        },
                        res => {
                            this.users = res.rows;
                        }
                    );
                }
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getTableList();
            },
            handleView(rows) {
                this.assigmentDialog = rows.orderNo;
            },
            handleViewEvt(orderNo) {
                this.assigmentDialog = orderNo;
            },
            handleViewCallback(data) {
                if (data) {
                    if (data.id) {
                        ajaxRequest(
                            "put",
                            "back/arrange/updateArrangeByOrderNo",
                            {
                                orderNo: data.orderNo,
                                isSelfarrange: data.isSelfarrange,
                                allPlanTime:  data.allPlanTime.toString(),
                                leader: data.leader,
                                driver: data.driver,
                                vehicle: data.vehicle,
                                remark: data.remark,
                                planId: data.planId
                            },
                            res => {
                                if (res.code == 200) {
                                    if (res.msg) {
                                        this.$message.error(res.msg);
                                    } else {
                                        this.getTableList();
                                        this.$message.success("编辑成功");
                                    }
                                }
                            }
                        );
                        this.assigmentDialog = null;
                    }
                } else {
                    this.assigmentDialog = null;
                }
            },
            userDataFormat(id) {
                let returnName = "";
                this.userData.forEach(data => {
                    if (data.id == id) {
                        returnName = data.userName;
                        return;
                    }
                });
                return returnName;
            },
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex < 9 && columnIndex > 0) {
                    var num = 0;
                    var max = 0;
                    for (var i = 0; i < this.tableData.length; i++) {
                        if (
                            this.tableData[i].orderNo === row.orderNo &&
                            this.tableData[i].planTime === row.planTime &&
                            i >= rowIndex
                        ) {
                            num++;
                        }
                        if (
                            this.tableData[i].orderNo === row.orderNo &&
                            this.tableData[i].planTime === row.planTime
                        ) {
                            max++;
                        }
                    }
                    if (num > 1) {
                        if (max === num) {
                            return {
                                rowspan: num,
                                colspan: 1
                            };
                        } else {
                            return {
                                rowspan: 0,
                                colspan: 0
                            };
                        }
                    } else {
                        if (max > 1) {
                            return {
                                rowspan: 0,
                                colspan: 0
                            };
                        }
                    }
                }
            },
            checkChangeEvt(row, state) {
                if (state) {
                    this.tableData.forEach(val => {
                        if (row.orderNo == val.orderNo && row.detectionMethod != '2' && row.flag == '0') {

                            val.isChecked = true;
                        }
                    })
                } else {
                    this.tableData.forEach(val => {
                        if (row.orderNo == val.orderNo && row.detectionMethod != '2' && row.flag == '0') {

                            val.isChecked = false;
                        }
                    })
                }

            },
            comPanyNameDetail(row) {
                this.comPanyForm = {'specialRequirement': row.specialRequirement, 'attachment': row.attachment};

                ajaxRequest(
                    "get",
                    "back/plan/getQuoInfoByQuoNo",
                    {
                        quotationNo: row.quotationNo
                    },
                    res => {
                        if (res.code === 200) {
                            if (res.daoResult) {

                                this.comPanyForm['remarkQuo'] = res.daoResult.remark;
                                this.comPanyForm['attachmentQuo'] = res.daoResult.attachment;
                                this.comPanyForm['otherSpecialRequirement'] = row.otherSpecialRequirement;
                            } else {
                                this.showEppro = true;
                            }
                            // comPanyForm: {'specialRequirement':'','attachment':'','remarkQuo':'','attachmentQuo':'','otherSpecialRequirement':''}
                            this.isShowTooltips = {};

                            if (this.comPanyForm['attachment'] != null) {
                                this.isShowTooltips[row.orderNo] = true;
                            } else {
                                this.isShowTooltips[row.orderNo] = false;
                            }
                            console.log(this.isShowTooltips)
                        }
                    }
                )
            },
            attachmentClick(val) {
                alert(val)
            },
            userDataChangeEvt(userId) {

                this.users.forEach(val => {
                    if (val.id == userId) {
                        this.taskPerson.push(val.userName);
                        this.taskPerson = Array.from(new Set(this.taskPerson));
                        // this.taskIds.push(val.id);
                        // this.taskIds = Array.from(new Set(this.taskIds));
                    }
                });
            },
            claimantClick() {
                //  执行人
                let inspectors = "";
                this.taskPerson.forEach((v, i) => {
                    if (i == 0) {
                        inspectors += v;
                    } else {
                        inspectors += ",";
                        inspectors += v;
                    }
                });
                if (inspectors == '') {
                    this.$message.error('请选择任务执行人');
                    return;
                }
                //勾选
                let checkedData = [];
                let isHaveClaimant = 0;
                let orderNo = null;

                this.tableData.forEach(val => {
                    if (val.isChecked == true && val.detectionMethod != '2' && val.flag == '0') {
                        var obj = $.extend(true, {}, val);
                        obj.inspector = inspectors;
                        obj.estimatedWorkload = this.form.estimatedWorkload;
                        checkedData.push(obj);
                        //val.inspector = inspectors;
                        //val.estimatedWorkload = this.form.estimatedWorkload;
                        //checkedData.push(val);
                        if (val.orderSingleNo) {
                            isHaveClaimant++;
                            orderNo = val.orderNo;
                        }
                    }
                });
                if (checkedData.length < 1) {
                    this.$message.error('请至少选择一条记录');
                    return;
                }

                if (isHaveClaimant > 0) {
                    this.$message.error('该' + orderNo + '委托单下已有任务被认领！请先撤销，再认领！');
                    return;
                }

                ajaxRequest(
                    "post",
                    "back/planAppliance/updateApplianceByOrderNo",
                    {
                        planAppliance: JSON.stringify(checkedData),
                    }, res => {
                        if (res.code = 200) {
                            this.$message.success('操作成功');
                            this.getTableList();
                        }

                    })
            },
            removeClaimant() {
                this.taskPerson = [];
                //  this.taskIds=[];
            },
            rsSetClamntClick() {
                //勾选
                let checkedData = [];
                this.tableData.forEach(val => {
                    if (val.isChecked == true && val.detectionMethod != '2' && val.flag == '0') {
                        checkedData.push(val);
                    }
                });

                if (checkedData.length < 1) {
                    this.$message.error('请选择将要撤销的记录');
                    return;
                }
                //已经配号的数据无法撤销
                ajaxRequest(
                    "post",
                    "back/planAppliance/resetApplianceByOrderNo",
                    {
                        planAppliance: JSON.stringify(checkedData),
                    }, res => {
                        if (res.code = 200) {
                            this.$message.success('操作成功');
                            this.getTableList();
                        }

                    })

            },
        }
    };
</script>

<style scoped>
    .table {
        width: 100%;
        max-width: 100%;
        margin-bottom: 20px;
        text-align: center;
        border: 1px solid #ddd;
    }

    .table > thead > tr > th {
        vertical-align: bottom;
        border: 1px solid #ddd;
        border-bottom: 2px solid #ddd;
        padding: 8px;
        line-height: 1.42857143;
        background: #fbfbfb;
    }

    .table tr:hover {
        background: #fbfbfb;
    }

    .table tr:nth-child(odd) {
        background: #f4f4f4;
    }

    .table > tbody > tr > td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    .bg-purple-green {
        background-color: #85d76b;
    }

    .font-12 {
        font-size: 12px !important;
    }

    .p-2 {
        padding: 2px 2px;
    }

    .font-red {
        color: red;
        font-weight: bold;
        cursor: pointer;
    }

    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
    }

    .shuoming::after {
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

    .el-sm {
        background: #ffffff;
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
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .shuoming .el-sm {
        display: none;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }
</style>
