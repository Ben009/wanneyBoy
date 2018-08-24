<template>
    <el-form ref="form" class="sampleForm" label-width="150px" :model="form" :rules="rules">
        <div style="margin-left:10px">{{searchKey}}下所有登记号状态</div>
        <div>
            <el-table :max-height="QJTableMaxHeight" ref="table" :data="tableData" border style="width: 100%"
                      @sort-change="handleSort" :fit="true" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="registrationNo" label="登记号"></el-table-column>
                <el-table-column prop="orderSingleNo" label="流转单编号"></el-table-column>
                <el-table-column prop="companyName" label="委托单位" width="200"></el-table-column>
                <el-table-column prop="applianceName" label="器具名称" width="200"></el-table-column>
                <el-table-column prop="setNumber" label="套数">
                    <template slot-scope="scope">
                        <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pieceNumber" label="套/件"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
                <el-table-column prop="room" label="房间号"></el-table-column>
                <el-table-column prop="receivePersonName" label="交接人"></el-table-column>
                <el-table-column prop="creatorName" label="操作人"></el-table-column>
                <el-table-column prop="createTime" label="操作时间" :formatter="dealDate"></el-table-column>
            </el-table>
        </div>
        <div class="centerForm">
            <el-row>
                <el-form-item label="状态">
                    <el-select v-model="state" class="demo" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.code"
                                :label="item.remark"
                                :value="item.remark">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="房间号">
                        <el-input v-model="roomNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="交接人" prop="handover">
                        <el-input ref="handover" v-model="form.handover" @keyup.enter.native="handleSubmit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 6px;">
                    <el-button type="primary" @click="handleSubmit" style="margin-left:15px;">确定</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div style="margin-left:10px">上述条件所对应委托单下所有证书或样品库房信息</div>
        <div>
            <el-table :max-height="QJTableMaxHeight" ref="table2" :data="tableData2" border style="width: 100%"
                      @sort-change="handleSort" :fit="true">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="registrationNo" label="登记号"></el-table-column>
                <el-table-column prop="orderSingleNo" label="流转单编号"></el-table-column>
                <el-table-column prop="companyName" label="委托单位" width="200"></el-table-column>
                <el-table-column prop="applianceName" label="器具名称" width="200"></el-table-column>
                <el-table-column prop="setNumber" label="套数" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pieceNumber" label="套/件" width="100"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
                <el-table-column prop="room" label="房间号"></el-table-column>
                <el-table-column prop="receivePersonName" label="交接人"></el-table-column>
                <el-table-column prop="creatorName" label="操作人"></el-table-column>
                <el-table-column prop="createTime" label="操作时间" :formatter="dealDate"></el-table-column>
            </el-table>
        </div>
    </el-form>
</template>

<script>
    //引入ajax工具
    import {ajaxProxyRequest, ajaxRequest} from '../../util/base';
    //引入jquery
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";

    export default {
        components: {
            ElRow,
            ElCol
        },
        name: "sampleCirculationDetail",
        data() {
            let checkHandover = (rule, value, callback) => {
                if (this.form.handover !== "") {
                    ajaxRequest('get', 'back/exchange/getRoom', {
                        userNo: this.form.handover,
                    }, (res) => {
                        if (res.code === 200) {
                            this.receivePersonId = res.daoResult;
                            callback();
                        } else {
                            return callback(new Error(res.msg));
                        }
                    })
                } else {
                    return callback(new Error("请输入交接人"));
                }
            };
            return {
                searchKey: "",//查询单号
                paramObj: this.$route.query,
                tableData: [],
                tableData2: [],
                multipleSelection: [],//多选，选中的数据
                handover: "",//交接人
                receivePersonId: "",//交接人id，输入交接人登录号后返回的id
                roomNo: "",//房间号
                options: [],//状态option
                state: "",//状态
                roomOptions: [],//房间号下拉框
                rules: {
                    handover: [{validator: checkHandover, trigger: 'blur'}],
                },
                form: {
                    handover: "",//交接人
                },
            }
        },
        methods: {
            getTableList() {
                this.searchKey = this.paramObj.searchKey;
                this.tableData = this.paramObj.tableData;
                this.tableData2 = this.paramObj.tableData2;
            },
            handleSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (this.multipleSelection.length < 1) {
                            this.$message.warning("至少选择一个登记号");
                            return;
                        }
                        if (this.state == "") {
                            this.$message.warning("未选择状态");
                            return;
                        }
                        if (this.form.handover == "") {
                            this.$message.warning("未填写交接人");
                            return;
                        }
                        ajaxRequest('post', 'back/exchange/exchange', {
                            receivePerson: this.receivePersonId,
                            roomId: this.roomNo,
                            status: this.state,
                            dhlist: JSON.stringify(this.multipleSelection),
                        }, (res) => {
                            if (res.code === 200) {
                                this.$message.success("提交成功");
                                this.$router.push({
                                    path: '/admin/566',
                                    query: {}
                                })
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                    }
                });
            },
            getOptions() {
                ajaxProxyRequest('get', '/njmind/findParams/sampleFlow', {codeType: 'NUMBER'}, (res) => {
                    this.options = res.sampleFlow.list;
                    this.$nextTick(()=>{
                        this.initState();
                    })
                });
            },
            initState() {
                //状态默认值：
                if (this.tableData.length > 0) {

                    let nowHandState=this.tableData[0].status;
                    if (nowHandState == "" || nowHandState == null || nowHandState == undefined) {
                        this.state = this.options[0].remark;
                    } else {
                        let nextHandState = "";
                        for (let i = 0; i < this.options.length; i++) {
                            if (this.options[i].remark == nowHandState) {
                                if ((i + 1) == this.options.length) {
                                    nextHandState = this.options[i].remark;
                                } else {
                                    nextHandState = this.options[i + 1].remark;
                                }
                            }
                        }
                        this.state = nextHandState;
                    }
                }
                for (let i = 0; i < this.tableData.length; i++) {
                    this.$refs.table.toggleRowSelection(this.tableData[i], true);//默认选中
                }
            },
            reset() {
                this.form.handover = "";
                this.roomNo = "";
                this.$nextTick(() => {
                    this.initState();
                    this.$refs.handover.focus();
                })
            },
            dealDate: function (row, column, cellValue) {
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                    return "";
                } else {
                    return new Date(cellValue).format('YYYY-MM-DD ');
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
        },
        mounted() {
            this.getOptions();
            this.getTableList();
            this.$nextTick(() => {
                this.initState();
                this.$refs.handover.focus();
            })
        },
    }
</script>

<style lang="scss">
    .sampleForm {

    .centerForm {
        border: 0;
        border-bottom: 1px solid #ddd;
        margin: 10px 0;
        padding: 10px 10px;

    .demo {

    .el-input {

    .el-input__inner {
        height: 28px !important;
    }

    }
    }
    }
    }

</style>
