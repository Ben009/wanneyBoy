<template>
    <div>
        <div style="text-align:center;">
            <span class="span">部门名称：</span>
            <el-select v-model="input2" :disabled="departFlag">
                <el-option v-for="val in departData" :label="val.departName" :key="val.id" :value="val.id"></el-option>
            </el-select>
            <span class="span">&nbsp;&nbsp;&nbsp;&nbsp;历史记录查询请在此输入日期：</span>
            <el-date-picker
                    v-model="input1"
                    align="right"
                    type="date"
                    placeholder="选择日期">
            </el-date-picker>
            <el-button size="small" type="primary" @click="getTableData()" class="el-icon-search">查询</el-button>
        </div>
        <div style="float: right">
            <global-tootips :width="600">
                <p>１、查询部门人员一周内请假和下厂信息；</p>
                <p>２、有权限用户可以查看其他部门人员的请假和下厂信息，无权限只能查看本部门；</p>
                <p>３、您可将鼠标移至<span style="color:red">下厂</span>字段上查看安排去的厂；</p>
            </global-tootips>
        </div>
        <el-table
                :max-height="QJTableMaxHeight"
                border
                :data="tableData"
                v-if="tableDome" v-loading="loading"
                :span-method="objectSpanMethod"
        >
            <el-table-column prop="DEPART_NAME" label="部门名称"></el-table-column>
            <el-table-column prop="USER_NAME" label="部门人员"></el-table-column>
            <el-table-column :label="defaultInfo.date1">
                <el-table-column :prop="defaultInfo.date1" label="上午" :formatter="handleContent"></el-table-column>
                <el-table-column :prop="defaultInfo.date1" label="下午" :formatter="handleContent"></el-table-column>
            </el-table-column>
            <el-table-column :label="defaultInfo.date2">
                <el-table-column :prop="defaultInfo.date2" label="上午" :formatter="handleContent"></el-table-column>
                <el-table-column :prop="defaultInfo.date2" label="下午" :formatter="handleContent"></el-table-column>
            </el-table-column>
            <el-table-column :label="defaultInfo.date3">
                <el-table-column :prop="defaultInfo.date3" label="上午" :formatter="handleContent"></el-table-column>
                <el-table-column :prop="defaultInfo.date3" label="下午" :formatter="handleContent"></el-table-column>
            </el-table-column>
            <el-table-column :label="defaultInfo.date4">
                <el-table-column :prop="defaultInfo.date4" label="上午" :formatter="handleContent"></el-table-column>
                <el-table-column :prop="defaultInfo.date4" label="下午" :formatter="handleContent"></el-table-column>
            </el-table-column>
            <el-table-column :label="defaultInfo.date5">
                <el-table-column :prop="defaultInfo.date5" label="上午" :formatter="handleContent"></el-table-column>
                <el-table-column :prop="defaultInfo.date5" label="下午" :formatter="handleContent"></el-table-column>
            </el-table-column>
            <el-table-column :label="defaultInfo.date6">
                <el-table-column :prop="defaultInfo.date6" label="上午" :formatter="handleContent"></el-table-column>
                <el-table-column :prop="defaultInfo.date6" label="下午" :formatter="handleContent"></el-table-column>
            </el-table-column>
            <el-table-column :label="defaultInfo.date7">
                <el-table-column :prop="defaultInfo.date7" label="上午" :formatter="handleContent"></el-table-column>
                <el-table-column :prop="defaultInfo.date7" label="下午" :formatter="handleContent"></el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import Vue from "vue";
    import Vuex from "vuex";
    import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
    import $ from 'jquery'
    import ElPopover from "../../../common-el/packages/popover/src/main.vue";

    export default {
        name: "staff-whereabouts",
        props: {},
        data() {
            //查询所有权限
            let departFlag = true;
            //获取登录人权限
            let buttonpermsStr = window.localStorage.getItem("btnPower");
            if (buttonpermsStr.indexOf("@M13940@") != -1) {
                //有按钮权限
                departFlag = false;
            }
            return {
                input1: new Date(),
                input2: Number(window.localStorage.getItem("departId")),//部门
                tableData: [],
                departData: [],
                defaultInfo: {},//初始化页面字段名称
                departFlag: departFlag,//是否部门下拉框可选
                tableDome: false,
                loading: false
            };
        },
        computed: Vuex.mapState(["themeColor", "themeColors"]),
        components: {ElPopover},
        watch: {
            themeColor(newValue) {
                document.body.className = "custom-" + newValue;
            },
        },
        methods: {
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 0) {
                    if (rowIndex === 0) {
                        return {
                            rowspan: this.tableData.length,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            handleContent(row, column, cellValue) {
                if (row.CONTENT != null && row.CONTENT.indexOf(column.property) != -1) {
                    let str = row.CONTENT.substr(row.CONTENT.indexOf(column.property), 16);
                    let arr = str.split("#");
                    let pm = arr[1], hoFlag = arr[2], planFlag = arr[3];
                    if (hoFlag == "1") {
                        if ((pm == "0" && column.label == "上午") || (pm == "1" && column.label == "下午")) {
                            return "请假";
                        } else {
                            return "无";
                        }
                    } else if (planFlag == "1") {
                        let a;
                        ajaxSyncRequest('get', 'back/plan/getAddrByUserData', {
                            userId: row.USER_ID,
                            date: column.property
                        }, (res) => {
                            if (res.code == 200) {
                                let where = res.map.DETECTION_SITE;
                                a = ( <el-popover effect = "light" placement = "bottom" trigger = "hover">
                                    <span slot = "reference" style = "color:red" > 下厂 </span>
                                    <span> 去向：{ where } </span> </el-popover>);
                            }
                        });
                        return a
                    } else {
                        return "无";
                    }
                } else {
                    return "无";
                }
            },
            getDepartData() {
                this.loading = true;
                ajaxRequest(
                    "get",
                    "back/depart/list",
                    {
                        isDelete: 0
                    },
                    res => {
                        if (res.code === 200) {
                            this.departData = res.rows;
                        }
                        this.loading = false;
                    }
                );
            },
            //获取表格数据
            getTableData() {
                ajaxRequest(
                    "get",
                    "back/plan/getStaffWhereabouts",
                    {
                        date: this.input1 ? new Date(this.input1).format('YYYY-MM-DD') : "",
                        deptId: this.input2,
                    },
                    res => {
                        if (res.code == 200) {
                            let dateArr = res.map.dateList;
                            this.defaultInfo = {
                                date1: dateArr[0],
                                date2: dateArr[1],
                                date3: dateArr[2],
                                date4: dateArr[3],
                                date5: dateArr[4],
                                date6: dateArr[5],
                                date7: dateArr[6],
                            };
                            this.tableData = res.rows;
                            this.tableDome = false;
                            this.$nextTick(() => {
                                this.tableDome = true;
                            });
                        }
                    }
                )
            },
        },
        filters: {},
        created() {
            this.getDepartData();
        },
        mounted() {
            this.getTableData();
        }
    };
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
        margin-left: 5px;
    }

    .font-blod {
        font-weight: bold;
    }

</style>
