<template>
    <div style="position:relative;">

        <div>
            <div class="el-tab_head" style="float:left;">
                <!--<el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(multipleSelection)">批量删除</el-button>-->
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增业务组</el-button>
            </div>

            <div class="el-tab_head" style="position:absolute;top:0;right:0px;">
                <span class="span">业务组: </span>
                <el-input placeholder="请输入业务组" class="custom-input" style="width:200px;" v-model="searchKey"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch"
                           style="position:relative;top:-1px">查询
                </el-button>
                <!-- <el-button type="warning" icon="el-icon-info" @click="clearInput = true;handleSearch()">清空</el-button> -->
            </div>

            <div class="el-tab_head">

                <el-table :data="tableData"
                          :max-height="QJTableMaxHeight"
                          border
                          style="width: 100%; position:relative; top:10px;min-height:39vh;"
                          @sort-change="handleSort"
                          @selection-change="handleSelectionChange">


                    <el-table-column
                            prop="businessArea"
                            label="业务组"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="chargeName"
                            label="负责人"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="contractHead"
                            label="合同抬头"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="备注"
                    >
                        <template slot-scope="scope">
                            <span :title="scope.row.remark">{{(scope.row.remark && scope.row.remark.length>20) ? scope.row.remark.slice(0,20)+"...":scope.row.remark}}</span>
                        </template>
                    </el-table-column>


                    <el-table-column
                            label="操作"
                            width="80">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                                    class="el-icon-edit-outline" title="编辑"></i></el-button>
                            <el-button
                                    v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,[scope.row]),placement:'left'}"
                                    type="text" style="padding:0;font-size:18px;"><i
                                    class="el-icon-delete" title="删除"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="text-align:center; margin-top:10px;float:right;">
                <mind-pagination
                        :current-page="page"
                        :page-size="rows"
                        :total="total"
                        @size-change="handlePageSizeChange"
                        @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
            <businessGroupForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></businessGroupForm>
        </div>
    </div>


</template>

<script>
    import Vue from "vue";
    import Vuex from "vuex";
    import {ajaxRequest, formatArrayToTree} from "../../util/base";
    import Retrieve from "../../Retrieve";
    import WorkMould from "../../mould/WorkMould";
    import TableColumnHeader from "../../Table/TableColumnHeader";
    import businessGroupForm from "./businessGroupForm";

    /* import { Table, TableColumn } from "element--ui";
    Vue.use(Table);
    Vue.use(TableColumn); */

    export default {
        name: "parameter-table",
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            businessGroupForm
        },
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: "",
                orderProperty: "id",
                orderType: "desc",
                tableData: [],
                multipleSelection: [],
                isSetting: 0,
                edit: null,
                clearInput: false
            };
        },
        methods: {
            formatterBankId: function (row, column) {
                var bankIds = {
                    1: "负责人1|中国民生银行|6222021122009046480|备注1",
                    2: "负责人2|中国农业银行|6222021122009046481|备注2",
                    3: "负责人3|中国工商银行|6222021122009046482|备注3"
                };
                return bankIds[row.bankId];
            },
            formatterDepartId: function (row, column) {
                var departIds = {
                    1: "部门1",
                    2: "部门2",
                    3: "部门3"
                };
                return departIds[row.departId];
            },
            formatterCharge: function (row, column) {
                var charges = {
                    1: "负责人1",
                    2: "负责人2",
                    3: "负责人3"
                };
                return charges[row.charge];
            },
            handleSort: function (column, prop, order) {
                this.orderProperty = column["prop"];
                if (column["order"] == "descending") {
                    this.orderType = "desc";
                } else {
                    this.orderType = "asc";
                }
                this.getTableList();
            },
            handleSearch() {
                if (this.clearInput) {
                    this.searchKey = "";
                }
                // this.searchKey=value;
                this.page = 1;
                this.total = 0;
                this.getTableList();
                this.clearInput = false;
            },
            getTableList() {
                if (this.searchKey) {
                    ajaxRequest(
                        "get",
                        "back/businessGroup/retrieve",
                        {
                            businessArea: this.searchKey,
                            fuzzySearch: 1,
                            page: this.page,
                            rows: this.rows,
                            orderProperty: this.orderProperty,
                            orderType: this.orderType,
                            total: 0,
                            sc: this.sc
                        },
                        res => {
                            if (res.code === 200) {
                                this.tableData = res.rows;
                                this.total = res.total;
                                this.multipleSelection = [];
                            }
                        }
                    );
                } else {
                    ajaxRequest(
                        "get",
                        "back/businessGroup/list",
                        {
                            page: this.page,
                            rows: this.rows,
                            orderProperty: this.orderProperty,
                            orderType: this.orderType,
                            total: 0
                        },
                        function (res) {
                            if (res.code === 200) {
                                this.tableData = res.rows;
                                this.total = res.total;
                                this.multipleSelection = [];
                            }
                        }.bind(this)
                    );
                }
            },
            handleToggleTheme(color) {
                this.$store.commit("toggleTheme", color);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handlePageSizeChange(size) {
                this.page = 1;
                this.rows = size;
                this.getTableList();
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getTableList();
            },
            handleEdit(rowInfo) {
                this.edit = rowInfo || {};
            },
            handleDelete(data) {
                if (data.length > 0) {
                    let ids = data
                        .map(function (v) {
                            return v.id;
                        })
                        .join(",");
                    ajaxRequest("put", "back/businessGroup/list/" + ids, {isDelete: 1},
                        function (res) {
                            if (res.code === 200) {
                                this.$message.success("删除成功");
                                this.getTableList();
                            } else {
                                this.$message.error(res.msg);
                            }
                        }.bind(this)
                    );
                } else {
                    this.$message({
                        message: "请先选择要删除的数据",
                        type: "warning"
                    });
                }
            },
            handleEditCallback(rowInfo) {
                let _this = this;
                if (rowInfo) {
                    rowInfo.updateTime = new Date().format('YYYY-MM-DD hh:mm');
                    new Promise((resolve, reject) => {
                        ajaxRequest(
                            "get",
                            "back/businessGroup/retrieve",
                            {
                                businessArea: rowInfo.businessArea,
                                fuzzySearch: 0,
                                isDelete: 0
                            },
                            res => {
                                if (res.code == 200) {
                                    resolve(res);
                                } else {
                                    reject(new Error("请求错误"));
                                }
                            }
                        );
                    })
                        .then(data => {
                            // 进行put与post的区分
                            if (rowInfo.id) {
                                let judgeId = true
                                // 如果返回的结果中只有一个数据或者以上
                                if (data.rows.length > 0) {
                                    data.rows.forEach(item => {
                                        if (item.id != rowInfo.id) {
                                            judgeId = false;
                                        }
                                    })
                                }
                                if (judgeId) {
                                    ajaxRequest('put', 'back/businessGroup/',
                                        rowInfo
                                        , function (res) {
                                            if (res.code === 200) {
                                                _this.$message.success('编辑成功');
                                                _this.getTableList();
                                                _this.edit = null;
                                            }
                                            else {
                                                _this.$message.error('编辑失败');
                                            }
                                        });
                                } else {
                                    this.$message.error('业务组区域冲突')
                                }


                            } else {
                                // 业务组不冲突的情况，进行post操作
                                if (!!!data.rows.length) {
                                    ajaxRequest("post", "back/businessGroup/", rowInfo, function (res) {
                                        if (res.code === 200) {
                                            _this.$message.success("新增成功");
                                            _this.edit = null;
                                            _this.getTableList();
                                        } else {
                                            _this.$message.error("新增失败");
                                        }
                                    });
                                } else {
                                    this.$message.error('业务组区域冲突')
                                }
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        });
                } else {
                    this.edit = null;
                }
            },
            getRetrieveHeader() {
                ajaxRequest("get", "back/dictEntry/list/", {dictTypeId: 13}, function (
                    res
                ) {
                    if (res.code === 200) {
                        var rows = res.rows;
                        if (rows != null && rows.length > 0) {
                            for (var i = 0; i < rows.length; i++) {
                                rows[i].title = rows[i].name;
                                rows[i].name = rows[i].dictCode;
                                if (rows[i].memo != null && rows[i].memo.length > 0) {
                                    var comparisonstrs = rows[i].memo.split(",");
                                    var comparisons = [];
                                    for (var j = 0; j < comparisonstrs.length; j++) {
                                        comparisons[j] = new Object();
                                        switch (comparisonstrs[j]) {
                                            case "0":
                                                comparisons[j].title = "包含";
                                                comparisons[j].value = 0;
                                                break;
                                            case "1":
                                                comparisons[j].title = "等于";
                                                comparisons[j].value = 1;
                                                break;
                                            case "2":
                                                comparisons[j].title = "大于";
                                                comparisons[j].value = 2;
                                                break;
                                            case "3":
                                                comparisons[j].title = "大于等于";
                                                comparisons[j].value = 3;
                                                break;
                                            case "4":
                                                comparisons[j].title = "小于";
                                                comparisons[j].value = 4;
                                                break;
                                            case "5":
                                                comparisons[j].title = "小于等于";
                                                comparisons[j].value = 5;
                                                break;
                                            default:
                                        }
                                    }
                                    rows[i].comparisons = comparisons;
                                }
                                rows[i].type = 0;
                            }
                        }
                        this.$refs["retrieve-wapper"].refreshSearchCondition(rows);
                    }
                });
            }
        },
        mounted() {
            this.getTableList();
        }
    };
</script>

<style scoped>
    /* .custom-input{
        width:200px;
        height:32px;
      }
      .custom-input .el-input__inner{
        height:32px;
        line-height:32px;
      }
      .custom-input .el-input-group__append{
        padding:0 10px;
      } */
    .span {
        font-size: 0.9rem;
        color: #606266;
        /* vertical-align: bottom; */
    }
</style>
