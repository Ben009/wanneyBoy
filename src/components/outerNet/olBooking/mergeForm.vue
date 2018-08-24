<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <div class="title-item" style="margin-top:10px;"><span>合并历史</span></div>
            <el-Row>
                <div style="margin-top:10px;">
                    <el-table :data="mergeTableData" :max-height="QJTableMaxHeight" border style="width: 100%">
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="czr" label="操作人"></el-table-column>
                        <el-table-column prop="djsj" label="转入时间"  :formatter="function(row, column, cellValue, index){return  new Date(cellValue).format('YYYY-MM-DD hh:mm:ss')}"></el-table-column>
                        <el-table-column label="操作" width="120px">
                            <template slot-scope="scope">
                                <el-button @click="findMergeInfoByXh(scope.row)" type="text" style="padding:0;font-size:14px;">
                                    <i>查看历史合并</i></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-Row>
            <div class="title-item" style="margin-top:20px;"><span>报检器具</span></div>
            <el-Row>
                <div style="margin-top:10px; display: -webkit-box;">
                    <div style="width: 44%;">
                        <el-table ref="leftTable" :data="leftTableData" :max-height="QJTableMaxHeight" border style="width: 100%"
                                  @selection-change="handleLeftSelectionChange">
                            <el-table-column type="selection" width="44" :selectable="selectable"></el-table-column>
                            <el-table-column prop="qjmc" label="登记号"></el-table-column>
                            <el-table-column prop="qjmc" label="器具名称"></el-table-column>
                            <el-table-column prop="ccbh" label="出厂编号"></el-table-column>
                            <el-table-column prop="ts" label="套数"></el-table-column>
                            <el-table-column prop="xhgg" label="型号规格"></el-table-column>
                            <el-table-column prop="jcdd" label="检校地点" :formatter="formatterJcdd"></el-table-column>
                        </el-table>
                    </div>
                    <div style="text-align: center;width: 10%; min-width: 100px">
                        <div class="el-transfer__buttons">
                            <el-button type="primary" plain size="medium" @click="merge(leftMultipleSelection)">合 并
                            </el-button>
                            <el-button type="primary" plain size="medium" @click="notMerged(leftMultipleSelection)">不合并
                            </el-button>
                            <el-button v-if="!!type" type="primary" plain size="medium" @click="saveMerge">
                                {{type=='1'?'转计划任务':(type=='2'?'转报价':'转配号')}}
                            </el-button>
                            <el-button plain size="medium" @click="cancel">返 回</el-button>
                        </div>
                    </div>
                    <div style="width: 44%;">
                        <el-table ref="rightTable" :data="rightTableData" :max-height="QJTableMaxHeight" border style="width: 100%">
                            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                            <el-table-column prop="qjmc" label="登记号"></el-table-column>
                            <el-table-column prop="qjmc" label="器具名称"></el-table-column>
                            <el-table-column prop="ccbh" label="出厂编号"></el-table-column>
                            <el-table-column prop="ts" label="套数"></el-table-column>
                            <el-table-column prop="xhgg" label="型号规格"></el-table-column>
                            <el-table-column prop="jcdd" label="检校地点" :formatter="formatterJcdd"></el-table-column>
                            <el-table-column label="操作" w>
                                <template slot-scope="scope">
                                    <el-button @click="undo(scope.row)" type="text" style="padding:0;font-size:14px;">
                                        <i>撤销</i></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-Row>
        </el-form>
        <mergeList v-if="!!edit" :data="edit" :callback="handleEditCallback"></mergeList>
    </div>
</template>

<script>
    import Vue from 'vue';

    import {ajaxRequest} from '../../util/base';
    import $ from 'jquery';
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';
    import mergeList from './mergeList';

    const defaults = {
        hoho: ''
    };
    export default {
        name: "layout",
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {},
                loading: false,
                mergeTableData: [],
                leftTableData: [],
                rightTableData: [],
                olBookingTotal: {},
                leftMultipleSelection: [],
                hideList: [],

                edit: null,

                type: this.$route.query.type //0配号 1计划任务 2报价单
            }
        },
        mounted() {
            this.remoteMethod();
        },
        directives: {rightclick},
        mixins: [rightClick],
        components: {
            mergeList
        },
        methods: {
            formatterJcdd: function (row, column) {
                return row.jcdd == '4' ? '物流送样' : (row.jcdd == '3' ? '带回' : (row.jcdd == '2' ? '询价' : (row.jcdd == '1' ? '现场' : '送检')));
            },

            selectable: function (row, index) {
                //不等于1时可操作
                if (row.isOper != '1') {
                    return true;
                } else {
                    return false;
                }
            },

            checked: function () {
                var _this = this;
                this.$nextTick(val => {
                    var $_this = _this;
                    _this.leftTableData.forEach(row => {
                        if (row.isOper != '1') {
                            $_this.$refs.leftTable.toggleRowSelection(row, true);
                        }
                    });
                })
            },

            getOlBookingTotal: function () {
                //加载报检单器具信息
                var _this = this;
                ajaxRequest('get', 'back/olBooking/getQjListLeft', {
                    id: _this.$route.query.id,
                    type: _this.$route.query.type
                }, (res) => {
                    if (res.code == 200) {
                        _this.olBookingTotal = res.t || {};
                        _this.leftTableData = _this.olBookingTotal.applianceList || [];
                        _this.hideList = JSON.parse(JSON.stringify(_this.leftTableData));
                        _this.leftMultipleSelection = [];
                        _this.checked();
                    } else {
                        _this.$message.error(res.msg);
                    }
                });
            },

            getMergeList: function () {
                //加载合并历史
                var _this = this;
                ajaxRequest('get', 'back/olBooking/findMergeZdList', {
                    bjid: _this.$route.query.id,
                    source: _this.$route.query.type,
                }, (res) => {
                    if (res.code == 200) {
                        _this.mergeTableData = res.rows || [];
                    } else {
                        _this.$message.error(res.msg);
                    }
                });
            },

            findMergeInfoByXh:function (rowInfo) {
                this.edit = rowInfo || {}
            },

            handleEditCallback:function () {
                this.edit = null
            },

            cancel: function () {
                window.history.go(-1);
            },

            handleLeftSelectionChange(val) {
                this.leftMultipleSelection = val;
            },

            //合并
            merge: function (data) {
                //合并器具
                var qjmc = "";
                var ts = "";
                var jcdd = "";
                var xhgg = "";
                var ccbh = "";
                var id = "";
                var ts_right = 0;
                var xhgg_right = "";
                var ccbh_right = "";
                var setflag = "0";
                for (var i = 0; i < data.length; i++) {
                    id += data[i].id + "@@";
                    ts = data[i].ts;
                    jcdd = data[i].jcdd;
                    qjmc = data[i].qjmc;
                    xhgg = data[i].xhgg;
                    ccbh = data[i].ccbh;
                    ts_right += parseInt(ts);
                    if (xhgg != "") {
                        var bool = 0;
                        if (xhgg_right != "") {
                            var xhgg_rights = xhgg_right.split(";");
                            for (var c = 0; c < xhgg_rights.length; c++) {
                                if (xhgg == xhgg_rights[c]) {
                                    bool = 1;
                                    break;
                                }
                            }
                        }
                        if (bool == 0) {
                            xhgg_right += xhgg + ";";
                        }
                    }

                    if (ccbh != "") {
                        var bool = 0;
                        if (ccbh_right != "") {
                            var ccbh_rights = ccbh_right.split(";");
                            for (var c = 0; c < ccbh_rights.length; c++) {
                                if (ccbh == ccbh_rights[c]) {
                                    bool = 1;
                                    break;
                                }
                            }
                        }
                        if (bool == 0) {
                            ccbh_right += ccbh + ";";
                        }
                    }

                    if (setflag == "0") {
                        var qjmc_right = qjmc;
                        var jcdd_right = jcdd;
                        setflag = "1";
                    }
                }

                if (xhgg_right == "") {
                    xhgg_right = "/";
                } else {
                    xhgg_right = xhgg_right.substr(0, xhgg_right.length - 1)
                }

                if (ccbh_right != "") {
                    ccbh_right = ccbh_right.substr(0, ccbh_right.length - 1)
                }

                if (id != "") {
                    var obj = {
                        id: id.substr(0, id.length - 2),
                        qjmc: qjmc_right,
                        ccbh: ccbh_right,
                        ts: ts_right,
                        xhgg: xhgg_right,
                        jcdd: jcdd_right,
                    }

                    this.rightTableData.push(obj);

                }

                for (let i = 0; i < this.leftTableData.length; i++) {
                    for (let j = 0; j < this.leftMultipleSelection.length; j++) {
                        if (this.leftMultipleSelection[j].id == this.leftTableData[i].id) {
                            this.leftTableData.splice(i, 1)
                        }
                    }
                }
                this.leftMultipleSelection = [];
            },

            //不合并
            notMerged: function () {
                for (let j = 0; j < this.leftMultipleSelection.length; j++) {
                    for (let i = 0; i < this.leftTableData.length; i++) {
                        if (this.leftMultipleSelection[j].id == this.leftTableData[i].id) {
                            this.leftTableData.splice(i, 1);
                            i--;
                        }
                    }
                    this.rightTableData.push(this.leftMultipleSelection[j]);
                }
                this.leftMultipleSelection = [];
            },

            //撤销
            undo: function (rowInfo) {
                var ids = rowInfo.id.split("@@");
                for (var i = 0; i < ids.length; i++) {
                    for (var j = 0; j < this.hideList.length; j++) {
                        if (ids[i] == this.hideList[j].id) {
                            this.leftTableData.push(this.hideList[j]);
                        }
                    }
                }

                for (let i = 0; i < this.rightTableData.length; i++) {
                    if (this.rightTableData[i].id == rowInfo.id) {
                        this.rightTableData.splice(i, 1)
                    }
                }
            },

            //跳转受理页
            toAccept: function (mergeXh) {
                if (this.type == '0') {
                    //转配号
                    this.$router.push({
                        name: '460',
                        params: {
                            obj:{mergeXh:mergeXh},
                            source:4
                        }
                    })

                } else if (this.type == '1') {
                    //转计划任务
                    this.$router.push({
                        name: '461',
                        params: {
                            obj:{mergeXh:mergeXh},
                            source:4
                        }
                    })

                } else if (this.type == '2') {
                    //转报价单
                    this.$router.push({
                        name: '459',
                        params: {
                            obj:{mergeXh:mergeXh},
                            source:4
                        }
                    })
                }
            },

            //保存合并信息
            saveMerge: function () {
                var _this = this;
                _this.leftTableData.forEach(row => {
                    if (row.isOper != '1') {
                        _this.$refs.leftTable.toggleRowSelection(row, true);
                    }
                });

                _this.notMerged();

                if(_this.rightTableData.length <=0){
                    _this.$message.error("无已处理器具，无法进行操作");
                    return false;
                }

                var olBookingTotal = {
                    id: _this.olBookingTotal.id,
                    bjType: _this.type,
                    applianceList: _this.rightTableData
                }

                ajaxRequest('post', 'back/olBooking/saveMerge', {olBookingTotalStr: JSON.stringify(olBookingTotal)}, (res) => {
                    if (res.code == 200) {
                        _this.toAccept(res.daoResult);
                    } else {
                        _this.$message.error(res.msg);
                    }
                });
            },

            remoteMethod() {
                this.getOlBookingTotal();
                this.getMergeList();
            }
        },
    }
</script>

<style>
    .right-click-menu {
        position: fixed;
        border: 1px solid #ccc;
        padding: 2px 0;
        background: #fff;
        width: 100px;
        z-index: 9999;
    }

    .right-click-menu li {
        padding: 3px 10px;
        cursor: default;
        font-size: 14px;
        color: #606266;
    }

    .right-click-menu li:hover {
        color: #409eff;
    }

    ul, li {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .el-transfer__buttons > button {
        margin: 15px 0px !important;
        display: block !important;
        width: 84px !important;
        padding: 10px 0px !important;
    }

    .el-transfer__buttons {
        padding: 0px !important;
    }
</style>
