<template>
    <el-form ref="form" class="sampleForm" label-width="150px" :model="form" :rules="rules">
        <div>
            <el-Row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="开始时间：" prop="startTime">
                        <el-date-picker
                                v-model="form.startTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="结束时间：" prop="endTime">
                        <el-date-picker
                                v-model="form.endTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="登记号：">
                        <el-input v-model="djh"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="器具名称：">
                        <el-input v-model="applianceName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="部门">
                        <el-select v-model="deptCode" placeholder="请选择" style="width:100%">
                            <el-option
                                    v-for="item in departmentOptions"
                                    :key="item.id"
                                    :label="item.departName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="流转状态：">
                        <el-select v-model="state" placeholder="请选择" style="width:100%">
                            <el-option
                                    v-for="item in stateOptions"
                                    :key="item.code"
                                    :label="item.remark"
                                    :value="item.remark">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row :gutter="20" style="text-align: center;margin-bottom:20px;">
                <el-button type="primary" class="el-icon-search" @click="search">查询</el-button>
                <!--<el-button type="warning" class="el-icon-warning" @click="reset">&nbsp;清空</el-button>-->
                <global-tootips style="float: right;margin-right:20px;">
                    <p>1、开始时间、结束时间为送检日期,为查询必填项；</p>
                    <p>2、若登录人具有查询所有部门的权限则可查询所有部门的流转信息，否则只可查询本部门流转信息。</p>
                </global-tootips>
            </el-Row>
        </div>
        <div>
            <el-table :max-height="QJTableMaxHeight" ref="table" :data="tableData" border
                      style="width: 100%" :fit="true" v-loading="loading">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column label="登记号">
                    <template slot-scope="scope">
                        <span @click="goDetail(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.registrationNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderSingleNo" label="流转单号"></el-table-column>
                <el-table-column prop="companyName" label="委托单位" width="200"></el-table-column>
                <el-table-column prop="applianceName" label="器具名称" width="200"></el-table-column>
                <el-table-column prop="setNumber" label="套数" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pieceNumber" label="套/件" width="100"></el-table-column>
                <el-table-column prop="status" label="流转状态"></el-table-column>
                <el-table-column prop="receivePerson" label="交接人"></el-table-column>
                <el-table-column prop="room" label="房间号"></el-table-column>
                <el-table-column prop="creatorName" label="操作人"></el-table-column>
                <el-table-column prop="createTime" label="操作时间" width="150" :formatter="dealDate"></el-table-column>
                <el-table-column prop="detectionDeadline" label="检测期限" :formatter="detechDate"></el-table-column>
            </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right;">
            <mind-pagination :current-page="page" :page-size="rows" :total="total" @size-change="handlePageSizeChange"
                             @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
    </el-form>
</template>

<script>
    //引入ajax工具
    import {ajaxProxyRequest, ajaxRequest} from '../../util/base';
    //引入jquery
    import $ from 'jquery';
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";

    export default {
        components: {
            ElRow,
            ElCol
        },
        name: "circulationQuery",
        data() {
            return {
                page: 1,//页码
                rows: 10,//每页记录数
                total: 0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
                tableData: [],
                departmentOptions: [],//部门option
                stateOptions: [],//流转状态option
                deptName: null,//部门
                deptCode: null,//部门id
                state: null,//流转状态
                djh: null,//登记号
                applianceName: null,//器具名称
                loading: false,
                rules: {
                    startTime: [{required: true, message: '开始时间不能为空', trigger: 'blur'},],
                    endTime: [{required: true, message: '结束时间不能为空', trigger: 'blur'},],
                },
                form: {
                    startTime: "",//开始日期
                    endTime: "",//结束日期
                },
            }
        },
        methods: {
            search() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        ajaxRequest('get', 'back/exchange/retrieveExchange', {
                            deptCode: this.deptCode,
                            status: this.state,
                            registrationNo: $.trim(this.djh),
                            applianceName: this.applianceName,
                            startTime: this.form.startTime,
                            endTime: this.form.endTime,
                        }, (res) => {
                            if (res.code === 200) {
                                this.tableData = res.rows;
                                this.total = res.total;
                            } else {
                                this.$message.error(res.msg);
                            }
                            this.loading = false;
                        })
                    }
                });
            },
            reset() {
                this.deptCode = null;
                this.state = null;
                this.applianceName = null;
                this.djh = null;
                this.search();
            },
            getOptions() {
                ajaxRequest("get", "back/statistics/getDepartList", {isDelete: 0}, res => {//部门
                    if (res.code === 200) {
                        //判断当前登录人是否有"按钮_流转查询所有部门权限"
                        const btnPower = localStorage.getItem("btnPower");
                        const currUserDepartId = localStorage.getItem("departId");
                        if (btnPower.indexOf("@M563001@") !== -1) {
                            this.departmentOptions = res.rows;
                            this.departmentOptions.push({id: "", departName: "请选择"})
                        } else {
                            this.departmentOptions = res.rows.filter(value => {
                                return value.id === parseInt(currUserDepartId)
                            });
                            this.deptCode = this.departmentOptions[0].id;
                        }


                    }
                });
                ajaxProxyRequest('get', '/njmind/findParams/sampleFlow', {codeType: 'NUMBER'}, (res) => {
                    this.stateOptions = res.sampleFlow.list;
                });
            },
            goDetail(rowInfo) {//查看详情
                this.$router.push({
                    path: '/admin/570',
                    query: {
                        data: rowInfo.registrationNo,
                        flag: true,
                    }
                })
            },
            initDate() {//开始日期为当月第一天，结束日期为今天
                this.form.endTime = new Date().format('YYYY-MM-DD ');
                this.form.startTime = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + "1";
            },
            dealDate: function (row, column, cellValue) {
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                    return "";
                } else {
                    return new Date(cellValue).format('YYYY-MM-DD hh:mm:ss');
                }
            },
            detechDate: function (row, column, cellValue) {
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                    return "";
                } else {
                    return new Date(cellValue).format('YYYY-MM-DD');
                }
            },
            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size;
                this.search()
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage
                this.search()
            },
        },
        mounted() {
            this.initDate();
            this.getOptions();
        },
    }
</script>

<style scoped>

</style>
