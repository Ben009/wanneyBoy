<template>
    <div style="position:relative;">
        <div>
            <div>
                <div class="el-tab_head" style="float:left;">
                    <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增行政区划
                    </el-button>
                </div>

                <div class="el-tab_head" style="float:right;">
                    <span class="span" style="font-size:14px;">行政区划名称: </span>
                    <el-input placeholder="请输入行政区划名称" class="custom-input" style="width:200px;" v-model="searchKey"
                              v-focusSelect></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch"
                               style="position:relative;top:-1px;">查询
                    </el-button>
                    &nbsp;&nbsp;
                    <global-tootips>
                        <p>默认行政区划用于委托单位添加时默认的行政区划</p>
                    </global-tootips>
                </div>

                <div class="el-tab_head">
                    <el-table :data="tableData" border style="width: 100%;position:relative; top:10px;"
                              :max-height="QJTableMaxHeight"
                              @sort-change="handleSort" @selection-change="handleSelectionChange">
                        <el-table-column prop="divisionNum" label="行政区划编号"></el-table-column>
                        <el-table-column prop="divisionName" label="行政区划名称"></el-table-column>
                        <el-table-column prop="divisionFather" label="上级行政区划"
                                         :formatter="formatterDivisionFather"></el-table-column>
                        <el-table-column prop="status" label="是否默认行政区划">
                            <template slot-scope="scope">
                                <span :class="(scope.row.status == '1')?'bg-red':''"
                                      v-text="scope.row.status==1?'是':'否'"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120px">
                            <template slot-scope="scope">
                                <!-- 需要根据是否默认行政区划字段区分不同的提示信息 -->
                                <el-button type="text" style="padding:0;font-size:18px;"
                                           v-mindPopover="{message:'该行政区域已经是默认的行政区划',success:doDefault.bind(this,scope.row)}"
                                           v-if="scope.row.status == 1">
                                    <i class="el-icon-circle-check-outline" title="是否设为默认行政区划"></i>
                                </el-button>
                                <el-button type="text" style="padding:0;font-size:18px;"
                                           v-mindPopover="{message:'确认设为默认行政区划?',success:doDefault.bind(this,scope.row)}"
                                           v-if="scope.row.status != 1">
                                    <i class="el-icon-circle-check-outline" title="是否设为默认行政区划"></i>
                                </el-button>
                                <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                    <i class="el-icon-edit-outline" title="编辑"></i>
                                </el-button>
                                <el-button
                                        v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,[scope.row]),placement:'left'}"
                                        type="text" style="padding:0;font-size:18px;">
                                    <i class="el-icon-delete" title="删除"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div style="text-align:center; margin-top:20px;float:right;">
                    <mind-pagination
                            :current-page="page"
                            :page-size="rows"
                            :total="total"
                            @size-change="handlePageSizeChange"
                            @current-change="handleCurrentPageChange">
                    </mind-pagination>
                </div>

                <divisionForm v-if="!!edit" :data="edit" :callback="handleEditCallback"
                              @getTableList="getTableList"></divisionForm>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Vuex from 'vuex';
    import $ from 'jquery'
    import {ajaxRequest, formatArrayToTree} from '../../util/base';
    import Retrieve from '../../Retrieve';
    import WorkMould from '../../mould/WorkMould';
    import TableColumnHeader from '../../Table/TableColumnHeader';
    import divisionForm from './divisionForm';

    /*     import {Table, TableColumn, Pagination} from 'element--ui';
        Vue.use(Table);
        Vue.use(TableColumn); */

    export default {
        name: "parameter-table",
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            divisionForm
        },
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: 'd.division_num',
                orderType: 'asc',
                tableData: [],
                multipleSelection: [],


                isSetting: 0,  //控制个性化设置弹窗是否展示
                edit: null,   //控制编辑弹窗是否展示
            }
        },
        methods: {
            formatterDivisionFather: function (row, column) {
                return row.divisionFatherName;
            },

            handleSort: function (column, prop, order) {
                this.orderProperty = column['prop'];
                if (column['order'] == 'descending') {
                    this.orderType = 'desc';
                } else {
                    this.orderType = 'asc';
                }
                this.getTableList();
            },

            handleSearch(column, value) {
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
                ajaxRequest('get', 'back/division/list', {
                    divisionName: this.searchKey,
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    sc: this.sc
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData = res.rows;
                        console.log(res, 'res')
                        this.total = res.total;
                        this.multipleSelection = [];
                    }
                })
            },

            handleToggleTheme(color) {
                this.$store.commit('toggleTheme', color)
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size;
                this.getTableList();
            },

            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getTableList();
            },

            handleEdit(rowInfo) {
                this.edit = rowInfo || {}
            },

            handleDelete(data) {
                if (data.length > 0) {
                    let ids = data.map(function (v) {
                        return v.id
                    }).join(",");
                    // this.$confirm('是否确认删除?', '提示', {
                    //     confirmButtonText: '确定',
                    //     cancelButtonText: '取消',
                    //     type: 'warning'
                    // }).then(() => {
                    ajaxRequest('post', 'back/division/list/' + ids, {_method: 'delete'}, function (res) {
                        if (res.code === 200) {
                            this.$message.success('删除成功');
                            this.getTableList();
                        } else if (res.code === 100) {
                            this.$message.error(res.msg);
                        } else {
                            this.$message.error('删除失败');
                        }
                    }.bind(this))
                    // }).catch(() => {
                    //     this.$message({
                    //         type: 'info',
                    //         message: '已取消删除'
                    //     });
                    // });
                } else {
                    this.$message({
                        message: '请先选择要删除的数据',
                        type: 'warning'
                    })
                }
            },

            handleEditCallback(rowInfo) {
                let _this = this;
                if (rowInfo) {
                    if (rowInfo.id) {
                        ajaxRequest('put', 'back/division/', {
                            id: rowInfo.id,
                            category: rowInfo.category,
                            name: rowInfo.name,
                            value: rowInfo.value,
                            memo: rowInfo.memo
                        }, function (res) {
                            if (res.code === 200) {
                                _this.$message.success('编辑成功');
                                _this.edit = null;
                                let roleList = _this.tableData;
                                for (let i = 0, len = roleList.length; i < len; i++) {
                                    if (roleList[i].id === rowInfo.id) {
                                        _this.tableData.splice(i, 1, rowInfo);
                                        break;
                                    }
                                }
                            }
                            else {
                                _this.$message.error('编辑失败');
                            }
                        });
                    }
                    else {
                        ajaxRequest('post', 'back/division/', {
                            category: rowInfo.category,
                            name: rowInfo.name,
                            value: rowInfo.value,
                            memo: rowInfo.memo
                        }, function (res) {
                            if (res.code === 200) {
                                _this.$message.success('新增成功');
                                _this.edit = null;
                                _this.getTableList();
                            }
                            else {
                                _this.$message.error('新增失败');
                            }
                        })
                    }
                }
                else {
                    this.edit = null
                }
            },
            doDefault(rowInfo) {
                let _this = this;
                if (rowInfo.divisionNum) {
                    ajaxRequest('put', 'back/division/doDefault', {
                        divisionNum: rowInfo.divisionNum,
                    }, function (res) {
                        if (res.code === 200) {
                            _this.$message.success('设置成功！');
                            _this.getTableList();
                        } else {
                            _this.$message.error('设置失败！');
                        }
                    });
                }
            }
        },
        mounted() {
            this.getTableList();
        }
    }
</script>

<style scoped>
    .custom-input {
        width: 200px;
        height: 32px;
    }

    .custom-input .el-input__inner {
        height: 32px;
        line-height: 32px;
    }

    .custom-input .el-input-group__append {
        padding: 0 10px;
    }

    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
    }

    .shuoming::after {
        content: "";
        width: 18px;
        height: 35px;
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
        margin-left: -318px;
        word-break: break-all;
        margin-top: 19px;
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

    .shuoming .el-sm {
        display: none;
    }

    .shuoming:hover .el-sm {
        display: block;
    }

    .bg-red {
        color: red;
    }
</style>
