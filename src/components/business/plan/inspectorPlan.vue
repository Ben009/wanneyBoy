<template>
    <div style="position:relative;">
        <div style="text-align:center;">
            <span class="span">历史记录查询请在此输入日期：</span>
            <el-date-picker
                    v-model="input1"
                    align="right"
                    type="date"
                    placeholder="选择日期" style="width:200px">
            </el-date-picker>
            <el-button size="small" type="primary" @click="getTableList()" class="el-icon-search">查询</el-button>
        </div>
        <div>
            <div style="float: right">
                <global-tootips :width="600">
                    <p>１、查询认领后检定员是当前用户，还没有要号的现场任务；</p>
                    <p>２、委托单位带有*表示该任务有特殊说明，您可将鼠标移至委托单位查询名称上查看；如有附件可在此下载；</p>
                </global-tootips>
            </div>
            <div>
                <el-table :data="tableData" :max-height="QJTableMaxHeight" border v-loading="loading">
                    <!--:span-method="arraySpanMethod"-->

                    <el-table-column prop="planTime" label="计划日期" align="center">
                        <template slot-scope="scope">
                            {{scope.row.planTime}}
                            <el-button v-show="isSelfarrange=='0'" type="warning" class="p-2" size="mini"
                                       @click="handleView(scope.row)">自排
                            </el-button>
                        </template>
                    </el-table-column>

                    <el-table-column prop="orderNo" label="委托单号" align="left"></el-table-column>

                    <el-table-column prop="companyName" label="委托单位" align="center">
                        <template slot-scope="scope">
                            <companyPopover :rowInfo="scope.row" showContent="companyName"></companyPopover>
                        </template>
                    </el-table-column>

                    <el-table-column prop="detectionSite" label="上门检测地址" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="leader" label="带队人" align="center" show-overflow-tooltip
                                     :formatter="userFormat">
                    </el-table-column>

                    <el-table-column prop="vehicle" label="车辆情况" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="driver" label="司机" align="center" show-overflow-tooltip
                                     :formatter="userFormat">
                    </el-table-column>

                    <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="orderSingleNo" label="流转单号" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="applianceName" label="器具名称" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="setNumber" label="套数" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="departId" label="检测部门" align="center" show-overflow-tooltip
                                     :formatter="departFormat">
                    </el-table-column>

                    <el-table-column prop="claimant" label="认领人" align="center" show-overflow-tooltip
                                     :formatter="userFormat">
                    </el-table-column>

                    <el-table-column prop="claimTime" label="认领时间" align="center" show-overflow-tooltip
                                     :formatter="dateFormat">
                    </el-table-column>

                    <el-table-column prop="inspector" label="执行人" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="estimatedWorkload" label="工作量" align="center" show-overflow-tooltip>
                    </el-table-column>

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
        <AssignmentDialog v-if="!!assigmentDialog" :isShow="isShow" :orderNo="assigmentDialog"
                          :callback="handleViewCallback"></AssignmentDialog>
    </div>

</template>

<script>
    import Vue from "vue";
    import Vuex from "vuex";
    import AssignmentDialog from "./AssigmentDialog.vue";
    import companyPopover from './companyPopover';
    import {ajaxRequest, formatDate, ajaxProxyRequest} from "../../util/base";

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
        name: "role-table",
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
                input1: new Date(),
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
                    "back/arrange/getInspectorPlan",
                    {
                        planTime: new Date(this.input1).format('YYYY-MM-DD'),
                        inspector: localStorage.getItem("userName"),
                        page: this.page,
                        rows: this.rows,
                        total: 0
                    },
                    res => {
                        if (res.code === 200) {
                            this.tableData = res.rows;
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
                                allPlanTime: data.isSelfarrange == '0' ? '' : data.allPlanTime,
                                leader: data.leader,
                                driver: data.driver,
                                vehicle: data.vehicle,
                                remark: data.remark
                            },
                            res => {
                                if (res.code == 200) {
                                    if (res.msg) {
                                        this.$message.error(res.msg);
                                    } else {
                                        this.getTableList();
                                        this.$message.success("操作成功");
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
</style>
