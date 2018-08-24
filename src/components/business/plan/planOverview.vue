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
        <div style="float: right">
            <global-tootips :width="600">
                <p>１、无权限用户仅可查询本部门或包括本部门的现场检测任务；若包含有多个部门检测任务，详情页会展示所有的任务；</p>
                <p>２、有修改车辆信息权限用户可单击车辆情况进行修改；</p>
                <p>３、委托单位带有*表示该任务有特殊说明，您可将鼠标移至委托单位查询名称上查看；如有附件可在此下载；</p>
                <p>４、您可将鼠标移至委托单号查看该委托单下器具信息；</p>
                <p>５、您可点击委托单号打印现场委托单，点击计划日期打印当天所有的车辆安排，点击车牌号打印车辆下厂信息。</p>
            </global-tootips>
        </div>
        <div>
            <div>
                <el-table :data="tableData" v-loading="loading"
                          :max-height="QJTableMaxHeight"
                          border stripe class="font-12"
                          v-if="!demo"
                          @cell-mouse-enter="handleMouseEnter"
                          @cell-mouse-leave="handleMouseOut"
                          :span-method="objectSpanMethod">
                    <el-table-column label="计划日期">
                        <template slot-scope="scope">
                            <span style="color:blue"
                                  @click="printVehicleArr(scope.row.planTime)">{{scope.row.planTime}}</span>
                            <el-button v-if="scope.row.isSelfarrange===0" type="warning" class="p-2" size="mini"
                                       @click="handleView(scope.row)">自排
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="companyName" label="委托单位">
                        <template slot-scope="scope">
                            <companyPopover :rowInfo="scope.row" showContent="companyName"></companyPopover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="detectionSite" label="上门检测地址"></el-table-column>
                    <el-table-column prop="contacter" label="联系人"></el-table-column>
                    <el-table-column prop="telephone" label="联系电话"></el-table-column>
                    <el-table-column prop="orderNo" label="委托单号">
                        <template slot-scope="scope">
                            <popover :rowInfo="scope.row" :columnsInfo="columnsInfo" :tableData="popverData"
                                     showContent="orderNo" @doSomethingElse="printOrder"></popover>
                        </template>
                    </el-table-column>
                    <!--<el-table-column  label="批量打印" align="center" prop="isChecked">
                      <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.isChecked"></el-checkbox>
                      </template>
                    </el-table-column>-->
                    <el-table-column prop="departName" label="检测部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="inspector" label="执行人" show-overflow-tooltip></el-table-column>
                    <!--<el-table-column prop="setNumber" label="总套数" show-overflow-tooltip width="50px"></el-table-column>-->
                    <el-table-column prop="leaderName" label="带队人" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="vehicle" label="车辆情况" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="vehicleDiv" style="color:blue" @click="printDispatch(scope.row)"
                                  @dblclick="showVehicleSelect($event)">{{scope.row.vehicle}}</span>
                            <el-select class="vehicleSelect" v-model="demo1" style="display: none"
                                       @change="changeVehicle($event,scope.row)">
                                <el-option label="车辆情况" value="车辆情况"></el-option>
                                <el-option label="苏A20180011111111" value="苏A2018001"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="driverName" label="司机" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
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
        </div>
        <AssignmentDialog v-if="!!assigmentDialog" :orderNo="assigmentDialog"
                          :callback="handleViewCallback"></AssignmentDialog>
    </div>
</template>

<script>
    import Vue from "vue";
    import Vuex from "vuex";
    import AssignmentDialog from "./AssigmentDialog.vue";
    import {ajaxRequest, ajaxSyncRequest, formatDate, ajaxProxyRequest} from "../../util/base";
    import Retrieve from '../../Retrieve';
    import {overView} from './plan.js'    //同目录下json数据
    import popover from './popover.vue'
    import companyPopover from './companyPopover.vue';
    import $ from 'jquery';

    export default {
        name: "role-table",
        data() {
            return {
                demo1: '',
                page: 1,
                rows: 10,
                total: 0,
                demo: false,
                searchKey: "",
                tableData: [],
                multipleSelection: [],
                form: {},
                rules: {},
                orgIds: [],
                users: [],
                userData: [],
                assigmentDialog: null,
                comPanyForm: {
                    'specialRequirement': '',
                    'attachment': '',
                    'remarkQuo': '',
                    'attachmentQuo': '',
                    'otherSpecialRequirement': ''
                },
                columnsInfo: [{nameCode: 'applianceName', title: '器具名称'}, {nameCode: 'certificateType', title: '服务类型'}
                    , {nameCode: 'setNumber', title: '套数'}, {nameCode: 'departName', title: '检测部门'},
                    {nameCode: 'postName', title: '检测岗位'}, {nameCode: 'model', title: '规格型号'}
                    , {nameCode: 'detectionMethod', title: '检测方式'}, {
                        nameCode: 'inspector',
                        title: '执行人'
                    }, {nameCode: 'estimatedWorkload', title: '工作量'}
                    , {nameCode: 'status', title: '状态'}],
                disabled: true,
                // isSelfarrange:'',
                /*高级检索相关项*/
                rowsCondition: overView,   //默认同目录下json数据 会依据模板改变
                paramJson: overView,      //同目录下json数据 常量
                moduleList: [],           //模板列表
                templateValue: '',       //当前选择的模板id
                sortBy: '',              //排序字段
                order: '',              //desc降序 asc升序
                headObj: {},           //表头显示对象 {category:true}
                defaultOpen: true,
                input1: new Date(),
                popverData: [],//器具tooltips数据
                loading: false
            };
        },
        // props: ["isSelfarrange"],
        components: {
            AssignmentDialog, Retrieve, overView, popover, companyPopover
        },
        created() {
            this.initDepart();
            this.getUserData();
        },
        mounted() {
            this.getTableList()
        },
        methods: {
            //打印车辆安排信息
            printVehicleArr(planTime) {
                console.log(planTime, '传入打印计划日期')
                this.printHtml("vehicleArrPrint", {planTime: planTime});
            },
            //打印派车单
            printDispatch(rowInfo) {
                this.printHtml("dispatchPrint", {data: rowInfo});
            },
            //修改车辆信息
            showVehicleSelect: function (event) {
                console.log($($(event.target)[0]).html(), '1111')
                let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
                if (btnPower.indexOf("@M13932@") != -1) {   //按钮_任务总览可修改车辆信息
                    $($(event.target).parent()[0].children[1]).show().val($(event.target)[0].innerHTML).select();
                    $(event.target).hide()
                }
            },
            changeVehicle: function (event, info) {
                console.log(event, '选中', info, this.demo1);
                ajaxRequest(
                    "put",
                    "back/arrange/changeVehicle",
                    {
                        orderNo: info.orderNo,
                        vehicle: event,
                    },
                    res => {
                        if (res.code == 200) {
                            this.$message.success('编辑成功');
                            this.getTableList().then(res => {
                                this.demo = true;
                                this.$nextTick(() => {
                                    this.demo = false;
                                })
                            });
                        } else {
                            this.$message.success('编辑失败')
                        }
                    }
                );
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
            //合并单元格
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                /* if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 ) {
                   var num = 0;
                   var max = 0;
                   for (var i = 0; i < this.tableData.length; i++) {
                     if (this.tableData[i].companyId === row.companyId && i >= rowIndex) {
                       num++;
                     }
                     if (this.tableData[i].companyId === row.companyId) {
                       max++;
                     }
                   }
                   if (num > 1) {
                     if (max === num) {
                       return {
                         rowspan: num, colspan: 1
                       };
                     } else {
                       return {
                         rowspan: 0, colspan: 0
                       };
                     }
                   } else {
                     if (max > 1) {
                       return {
                         rowspan: 0, colspan: 0
                       };
                     }
                   }
                 }*/
            },
            //单元格移入事件
            handleMouseEnter: function (row, column, cell, event) {
                //委托单号
                if (column.property == "orderNo" && row.orderNo != null) {
                    ajaxRequest('get', 'back/plan/getApplianceListByOrderNo', {orderNo: row.orderNo}, (res) => {
                        if (res.code == 200) {
                            this.popverData = res.rows;
                        }
                    })
                }
            },
            //单元格移出事件
            handleMouseOut: function (row, column, cell, event) {
                this.popverData = [];
            },

            daysFormat(row, column, cellValue, index) {
                return parseInt(
                    (new Date().getTime() - new Date(row.claimTime).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
            },
            dateFormat(row, column, cellValue, index) {
                return formatDate(cellValue, "YYYY-MM-DD hh:mm:ss");
            },
            getTableList() {
                return new Promise(resolve => {
                    this.loading = true;
                    ajaxRequest(
                        "get",
                        "back/arrange/getOverviewPlan",
                        {
                            planTime: new Date(this.input1).format('YYYY-MM-DD'),
                            page: this.page,
                            rows: this.rows,
                            total: 0,
                            sc: this.sc
                        },
                        res => {
                            if (res.code === 200) {
                                this.tableData = res.rows;
                                this.total = res.total;
                                this.multipleSelection = [];
                                console.log(this.tableData);
                            }
                            this.loading = false;
                            resolve(res)
                        }
                    );
                })
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
                if (orgId) {
                    ajaxRequest(
                        "get",
                        "back/user/retrieve",
                        {
                            departId: orgId
                        },
                        res => {
                            this.users = res.rows;
                            if (this.users.length > 0) {
                                Vue.set(this.form, "user", res.rows[0].id);
                            } else {
                                Vue.set(this.form, "user", "");
                            }
                        }
                    );
                }
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getTableList();
            },
            handleView(rows) {
                console.log(rows.orderNo, 'orderNo');
                console.log(rows, 'rows');
                this.assigmentDialog = rows.orderNo;
            },
            handleViewCallback(data) {
                if (data) {
                    if (data.id) {
                        debugger;
                        ajaxRequest(
                            "put",
                            "back/arrange/updateArrangeByOrderNo",
                            {
                                orderNo: data.orderNo,
                                isSelfarrange: data.isSelfarrange,
                                allPlanTime: data.allPlanTime,
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
            advanceSearch: function (data) {
                console.log(data, '高级检索');
                this.sc = JSON.stringify(data.conditions);
                this.orderProperty = data.sortBy;
                this.orderType = data.order;
                this.fuzzySearch = 1;
                this.getTableList().then(res => {
                    this.demo = true;
                    this.$nextTick(() => {
                        this.demo = false;
                    })
                });
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
                        }
                    }
                )
            },
            attachmentClick(val) {
                alert(val)
            },
            //委托单打印
            printOrder(rowInfo) {
                this.printHtml("planOrderPrint", {planId: rowInfo.id, orderNo: rowInfo.orderNo});
            }
        }
    };
</script>

<style
<style lang="scss" scoped>
    .bg-purple-green {
        background-color: #85d76b;
    }

    .font-12 {
        font-size: 12px !important;
    }

    .p-2 {
        padding: 2px 2px;
        margin-left: 5px;
    }

    .font-red {
        color: red;
        font-weight: bold;
        cursor: pointer;
    }

    .orderNo {
        display: flex;
        margin-left: 5px;
    }
</style>
