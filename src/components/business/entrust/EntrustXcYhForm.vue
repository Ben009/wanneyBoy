<template>
    <el-col :sm="18">
        <el-row>
            <el-col :span="6">
                <div class="grid-content bg-purple" v-if="!!planData">委托单号:{{this.planData.orderNo}}&nbsp;
                    <el-button type="success" @click="printOrderSingleList">打印所有流转单</el-button>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light" v-if="!!planData">单位名称:{{this.planData.compayName}}</div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple" v-if="!!planData"></div>
                带队人:{{this.planData.personName}}
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light" v-if="!!planData">备注:{{this.planData.remark}}</div>
            </el-col>
        </el-row>
        <el-row class=" m-t-10" style="margin-top: 30px">
            <div class="title-item"><span>器具列表:</span>
                <div class="el-icon-info shuoming">
                    <el-row class="el-sm" style="margin-left:-301px;">
                        <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">
                            事项说明</p>
                        <dl style="padding:6px 10px; ">
                            <p>退号：修改任务认领状态为已退号。</p>
                            <p>撤号：撤回登记号、进行重新要号。</p>
                            <p>重新安排:器具重新安排进行检定。 </p>
                        </dl>
                    </el-row>
                </div>
            </div>
        </el-row>

        <el-row style="margin-bottom: 10px;">
            <el-col :sm="26">

                <el-table :data="planApplianceData" ref="multipleTable" :max-height="QJTableMaxHeight"
                          @selection-change="handleSelectionChang" border stripe @select-all="selectAll"
                          style="width: 100%;" @select="selectEvt">


                    <el-table-column type="selection" label="">

                    </el-table-column>
                    <el-table-column prop="registrationNo" label="登记号" align="center">
                    </el-table-column>
                    <el-table-column prop="orderSingleNo" label="流转单号" align="center">
                    </el-table-column>

                    <el-table-column prop="applianceName" label="器具名称" align="center" s>
                    </el-table-column>


                    <el-table-column prop="model" label="型号规格" align="center">
                    </el-table-column>


                    <el-table-column prop="factoryNo" label="出厂编号" align="center">
                    </el-table-column>


                    <el-table-column prop="equipmentNo" label="设备编号" align="center">
                    </el-table-column>

                    <el-table-column prop="departName" label="检测部门" align="center">
                    </el-table-column>

                    <el-table-column prop="setNumber" label="套数" align="center">
                    </el-table-column>

                    <el-table-column prop="quotPrice" label="报价" align="center">
                    </el-table-column>


                    <!-- <el-table-column  prop="personName"  label="认领人" align="center" >
                    </el-table-column> -->

                    <el-table-column prop="inspector" label="执行人" align="center">
                    </el-table-column>

                    <!-- <el-table-column  prop="isClaim"  label="认领状态" :formatter="formatStat" align="center" >
                    </el-table-column> -->


                    <el-table-column prop="isHaveNumber" label="是否配号" :formatter="formatMatchingnumber"
                                     align="center">
                    </el-table-column>

                    <el-table-column prop="estimatedWorkload" align="center" label="操作">
                        <template slot-scope="scope">
                            <!-- <el-button type="primary" v-if="scope.row.isClaim=='1'&&scope.row.registrationNo==null"  class="tuhao"  @click="openDialog(scope.row.id,scope.row.orderNo,scope.row.registrationNo)" style="background:none;border:none;color:#f56c6c;" >退  号</el-button> -->
                            <el-button type="primary" v-if="scope.row.isClaim=='2'&&scope.row.registrationNo==null"
                                       @click="cancelTh(scope.row.id,scope.row.orderNo)"
                                       style="background:none;border:none;color:#fbb142;">撤退
                            </el-button>
                            <el-button type="primary" v-if="scope.row.registrationNo!=null"
                                       @click="WithdrawalNumber(scope.row.id,scope.row.registrationNo)"
                                       style="background:none;border:none;color:#fbb142;">撤号
                            </el-button>
                            &nbsp;
                            <!-- <el-button type="primary" v-if="scope.row.registrationNo==null" style="margin: -7px;background:none;border:none;color:#3094e0;"  v-mindPopover="{message:'确认要重新安排吗？',success:batchReArrange.bind(this,scope.row.id,scope.row.isHaveNumber)}" >重新安排</el-button> -->
                        </template>
                    </el-table-column>

                </el-table>

            </el-col>

        </el-row>

        <el-row class=" m-t-10" style="margin-top: 20px">
            <el-col :span="24">
                <el-button type="button" @click="yaohao(ids)"
                           class="el-button el-button el-button--primary el-button--mini el-button--but">批量要号
                </el-button>

                <el-button type="button"
                           class="el-button el-button el-button--primary el-button--mini el-button--but"
                           @click="runNumber()">追号
                </el-button>

                <el-button type="button" @click="openDialog('',orderNo)"
                           class="el-button el-button el-button--primary el-button--mini el-button--but">退号
                </el-button>
                <el-button type="button" @click="batchReArrange(ids,isHaveNumbers)"
                           class="el-button el-button el-button--primary el-button-pl el-button--mini el-button--but ">
                    批量重新安排
                </el-button>
            </el-col>
        </el-row>
        <el-row class=" m-t-10" style="margin-top: 30px">
            <div class="title-item"><span>追号列表</span>

                <div class="el-icon-info shuoming">
                    <el-row class="el-sm">
                        <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">
                            事项说明</p>
                        <dl style="padding:6px 10px; ">
                            <p>操作区一：重置委托单号，流转单及认领相关信息，重新进行任务安排及认领</p>
                            <p> 操作方法：勾选需重置的器具，然后点击后方提交按钮！ </p>
                        </dl>
                    </el-row>
                </div>
            </div>
        </el-row>

        <el-row style="margin-bottom: 10px">
            <el-col :sm="24">
                <el-table :data="zhuihao" ref="multipleTable" :max-height="QJTableMaxHeight"
                          @selection-change="handleSelectionChang" border stripe @select-all="selectAll"
                          style="width: 100%;margin-top: 20px;" @select="selectEvt">
                    <!-- <el-table-column  prop="orderNo"  label="委托单号" align="center" show-overflow-tooltip>
                    </el-table-column> -->

                    <el-table-column prop="orderSingleNo" label="流转单号" align="center" show-overflow-tooltip>
                    </el-table-column>


                    <el-table-column prop="registrationNo" label="登记号" align="center" show-overflow-tooltip>
                    </el-table-column>


                    <el-table-column prop="applianceName" label="器具名称" align="center" show-overflow-tooltip>
                    </el-table-column>


                    <el-table-column prop="model" label="器具规格" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <!-- <el-table-column  prop="factoryNo"  label="出厂编号" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column  prop="equipmentNo"  label="设备编号" align="center" show-overflow-tooltip >
                    </el-table-column> -->

                    <el-table-column prop="companyName" label="检测部门" align="center" show-overflow-tooltip>
                    </el-table-column>


                    <el-table-column prop="setNumber" label="套数" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <!-- <el-table-column  prop="pieceNumber"  label="件/套" align="center" show-overflow-tooltip>
                    </el-table-column> -->

                    <el-table-column prop="estimatedWorkload" label=" 删除" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button type="danger"
                                       v-mindPopover="{message:'确认删除该登记号？',success:deleteEntruSjd.bind(this,[scope.row.registrationNo])}">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <EntrustOutDialog @reaload="parentFn" :orderNo="orderNo" :ids="ids" v-if="!!entrustOutDialog"
                          :callback="handleViewCallback">

        </EntrustOutDialog>
    </el-col>
</template>
<script>
    import Vue from "vue";
    import Vuex from "vuex";
    import EntrustOutDialog from "./EntrustOutDialog.vue"
    import VueBarcode from 'vue-barcode';
    import $ from "jquery";
    import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";


    export default {
        props: {
            planApplianceData: {
                type: Array,
                required: true
            },
            zhuihao: {
                type: Array,
                required: true
            },
            quoInfo: {//报价单编号 报价单附件 报价单备注\
                required: true
            },
            planData: {
                required: true
            },
            page: {
                required: true
            },
            planId: {
                required: true
            },
            rows: {
                required: true
            },
            orderNo: {
                required: true
            },
            searchType: {
                required: true
            },
            multipleSelection: [],
        },
        data() {
            return {
                // entryPersonData: [],
                // planData: {}, //器具信息
                arrangeDate: null,
                dialogVisible: false,
                textarea: '',
                entrustOutDialog: null,
                checked: true,
                ids: "",
                stat: "",
                isHaveNumbers: ""
            };
        },
        components: {EntrustOutDialog},
        watch: {
            arrangeDates(value) {
                if (value.length > 1 || value.length == 1) {
                    this.disabled = false;
                }
            },
            isArrange(val) {
                if (val == true) {
                    this.disabled = false;
                    this.arrangeDates = [];
                    this.arrangeDate = "";
                } else {
                    this.disabled = true;
                }
            }
        },
        methods: {
            //流转单打印
            printOrderSingleList() {
                //根据委托单查询流转单号
                ajaxRequest('get', 'back/entrustWtd/getOSByOrderNo', {orderNo: this.planData.orderNo}, res => {
                    if (res.code === 200) {
                        let arr = res.rows;
                        this.printHtml("orderSingle", {key1: '', arr: arr}, 1);
                    }
                });
            },
            //根据报价单编号获取报价单 附件 备注
            getQuoInfo(quoId) {
                ajaxRequest(
                    "get",
                    "back/planAppliance/findByPlanId",
                    {
                        planId: quoId
                    },
                    res => {
                        if (res.code === 200) {
                            this.quoInfo = res.daoResult;
                        }
                    }
                );
            },
            //点击要号查询
            yaohao(ids) {
                if ((ids == null || ids == "")) {
                    this.$message.error('请至少选择一条记录!');
                    return false;
                }
                var index = this.stat.indexOf("2");
                if (index != -1) {
                    this.$message.error("已退号的不允许要号。");
                    return false;
                }
                if (this.isHaveNumbers != "") {
                    if (this.isHaveNumbers.indexOf("1") != -1) {
                        this.$message.error("请选择未配号的记录。");
                        return false;
                    }
                }
                //查询出计划信息
                var object = new Object();
                object.rows = this.rows;
                object.page = this.page;
                object.orderNo = this.orderNo;
                object.planId = this.planData.id;
                object.qjIds = this.ids;
                object.searchType = this.searchType;
                object.quotationNo = this.planData.quotationNo
                console.log(object, '11111');
                this.$router.push({
                    name: '169',
                    params: {
                        source: 2,
                        obj: object
                    }
                })
            },
            formaterselect: function (row, column) {
                if (row.isHaveNumber == '0') {
                    return true;
                } else {
                    return false;
                }
            },
            runNumber() {
                //查询出计划信息
                var object = new Object();
                object.page = this.page;
                object.rows = this.rows;
                object.qjIds = "";
                object.orderNo = this.orderNo;
                object.searchType = this.searchType;
                object.planId = this.planId;
                object.quotationNo = this.planData.quotationNo;
                console.log(object, '11111');
                this.$router.push({
                    name: '169',
                    params: {
                        obj: object,
                        source: 2
                    }
                })
            },
            //根据id删除送检单信息
            deleteEntruSjd(registrationNo) {
                ajaxRequest(
                    "delete",
                    'back/entrustSjd/list/' + registrationNo, {}, res => {
                        console.log(res);
                        if (res.code == 200) {
                            this.$message.success('删除成功');
                            this.$emit("reaload", this.orderNo);
                        }
                    }
                );
            },
            parentFn(orderNo) {
                //回传
                this.$emit("reaload", orderNo);
            },
            WithdrawalNumber(id, registerNo) {
                //先校验登记号是否可以删除
                ajaxRequest(
                    "GET",
                    'back/planAppliance/checkByRegisterNo', {"registerNo": registerNo}, res => {
                        if (res.code == 200) {
                            var count = res.total;
                            if (count > 0) {
                                this.$message.error('已经出过证书或录入过费用的登记号不允许删除。');
                            } else {
                                //删除送检单中的登记号记录
                                ajaxRequest(
                                    "delete",
                                    'back/entrustSjd/list/' + registerNo, {}, res => {
                                        if (res.code == 200) {
                                            ajaxRequest(
                                                "PUT",
                                                'back/planAppliance/', {"id": id, "isHaveNumber": 0}, res => {
                                                    if (res.code == 200) {
                                                        this.$message.success('操作成功');
                                                        this.$emit("reaload", this.orderNo);
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    }
                );

            },
            //批量重新安排
            batchReArrange(id, isHaveNumber) {
                console.log(id);
                if ((id == null || id == "")) {
                    this.$message.error('请至少选择一条记录!');
                    return false;
                } else {
                    //判断isHaveNumber的字段是否包含1  如果包含的话证明已经配过号的不可以重新安排
                    if (isHaveNumber == null || isHaveNumber == "undefined") {
                        isHaveNumber = "";
                    }
                    id = id.toString();
                    //判断一下是否包含1
                    var index = isHaveNumber.indexOf("1");
                    if (index != -1) {
                        this.$message.error('部分记录已配号，禁止本次重新安排！!');
                    } else {
                        //==-1那么可以重新配号
                        //判断一下是否是多个id 如果是多个id调用批量修改  如果是单个直接调用单个修改的操作
                        //单个操作
                        ajaxRequest(
                            "PUT",
                            "back/planAppliance/resetAppliance",
                            {
                                id: id,
                                isClaim: '0',
                                orderNo: this.orderNo,
                                claimTime: null,
                                inspector: "",
                                claimant: null,
                                orderSingleNo: "",
                                estimatedWorkload: ""
                            },
                            res => {
                                if (res.code == 200) {
                                    this.$message.success('重新安排成功!');
                                    this.$emit("reaload", this.orderNo);
                                } else {
                                    this.$message.error('重新安排失败!');
                                }
                            }
                        );
                    }
                }
            },
            cancelTh(id, orderNo) {
                ajaxRequest(
                    "PUT",
                    "back/planAppliance/",
                    {
                        id: id,
                        isClaim: '1',
                        returnReason: ''
                    },
                    res => {
                        if (res.code == 200) {
                            if (res.message == '1') {
                                this.$message.success('撤销成功!');
                                //回传
                                this.$emit("reaload", this.orderNo);
                            } else {
                                this.$message.error('撤销失败!');
                            }
                        } else {
                            this.$message.error("撤销失败!");
                        }
                    }
                );
            },
            openDialog(id, orderNo) {
                if (this.isHaveNumbers != "") {
                    if (this.isHaveNumbers.indexOf("1") != -1) {
                        this.$message.error("退号失败，已要号的不能进行退号。");
                        return false;
                    }
                }

                if (this.ids != "undefined" && this.ids != "") {
                    //this.ids=this.ids;
                } else {
                    this.ids = id;
                }
                if (typeof(this.stat) != "undefined" && this.stat != "") {
                    //判断选择的数据是否已经被退回
                    var index = this.stat.indexOf("2");
                    if (index != -1) {
                        this.$message.error("已退回的数据不能再次退回,请重新选择。");
                        return false;
                    }
                }
                //判断stat存放的数据的值
                if (typeof(this.ids) == "undefined" || this.ids == "") {
                    this.$message.error("请选择要退号的器具信息。");
                    this.entrustOutDialog = null;
                    return false;
                } else {
                    this.entrustOutDialog = '1'
                }
            },
            formatStat: function (row, columns) {
                if (row.isClaim == '0') {
                    return '未认领';
                } else if (row.isClaim == '1') {
                    return '已认领';
                } else if (row.isClaim == '2') {
                    return '已退号';
                }
            },
            formatMatchingnumber: function (row, columns) {
                if (row.isHaveNumber == '0') {
                    return '未配号';
                } else {
                    return '已配号';
                }
            },
            selectAll(selection) {
                if (selection.length > 0) {
                    selection.forEach(val => {
                        Object.assign(val, {
                            checked: true
                        });
                    });
                } else {
                    selection.forEach(val => {
                        aox
                        Object.assign(val, {
                            checked: false
                        });
                    });
                }
            },
            selectEvt(selection, rows) {
                if (rows.checked == true) {
                    rows["checked"] = false;
                } else {
                    rows["checked"] = true;
                }
            },
            getPlanApplianceData(id) {
                ajaxRequest(
                    "get",
                    "back/planAppliance/findByListQj",
                    {
                        orderNo: id
                    },
                    res => {
                        if (res.code == 200) {
                            this.planApplianceData = res.rows;
                        }
                    }
                )
            },
            handleViewCallback: function (orderNo) {
                this.entrustOutDialog = null;
            },
            handleSelectionChang: function (val) {
                var arr = new Array();
                var stat = new Array();
                var isNumbers = new Array();
                val.forEach(v => {
                    arr.push(v.id);
                    stat.push(v.isClaim);
                    isNumbers.push(v.isHaveNumber);
                    this.orderNo = v.orderNo;
                });
                this.stat = stat.toString();
                this.ids = arr.toString();
                console.log(this.ids);
                this.isHaveNumbers = isNumbers.toString();
            },
        },
        filters: {
            myCurrency(myInput) {
                return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
            },
            certificatePrintTimeFormat(myInput) {
                return formatDate(myInput, "YYYY-MM-DD");
            }
        },
        created() {
        },
        mounted() {
        }
    }
</script>
<style scoped>
    .m-b-10 {
        margin-bottom: 10px;
    }

    .m-b-20 {
        margin-bottom: 20px;
    }

    .inline {
        display: inline;
    }

    .m-r-10 {
        margin-right: 661px;
    }

    .m-f-10 {
        margin-left: 10px;
    }

    .m-t-10 {
        margin-top: 10px;
    }

    .m-l-10 {
        margin-left: 10px;
    }

    .m-l-5 {
        /*margin-left: 5px;*/
    }

    .font-blod {
        font-weight: bold;
    }

    .searchTitle {
        color: #fff;
        font-style: normal;
        font-size: 16px;
        background: #1fbba6;
        border: 1px solid #1fbba6;
        width: 100%;
        margin: 1% 1% 0 0%;
        height: 42px;
        line-height: 42px;
        text-indent: 18px;
        text-align: center;
        font-family: "微软雅黑";
    }

    .d_tip2 {
        height: 80px;
        background: #e1f5e3;
        border: 1px solid #abe9b1;
        width: 100%;
        padding: 1%;
        margin: 15px auto;
        color: #333;
        font-size: 14px;
        text-align: left;
        font-family: "微软雅黑";
    }

    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
        float: right;
    }

    .shuoming::after {
        content: "";
        width: 18px;
        height: 34px;
        /* background: white; */
        position: absolute;
        /* z-index: 999; */
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
        margin-left: -301px;
        word-break: break-all;
        margin-top: 5px;
        padding: 4px 5px;
        font-size: 14px;
        opacity: 50;
        width: 320px;
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .shuoming .el-sm {
        display: none;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .shuoming .el-sm {
        display: none;
    }

    .shuoming:hover .el-sm {
        display: block;
    }

    .el-button-pl {
        background: none;
        color: #3094e0;
    }

    .el-button-pl:hover {
        background: #4a90c5;
        border-color: #4a90c5;
        color: #fff;
    }
</style>
