<template>
    <mind-dialog
        :title="'周检信息'"
        :visible="true"
        dialogSize="large"
        center
        v-dialogDrag
        @close="handleCancel">
        <div>
            <!--<div style="margin-top:10px;">-->
                <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%" @sort-change="handleSort" @selection-change="handleSelectionChange">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>

                    <el-table-column
                        prop="jddw"
                        label="检校机构"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="jdzq"
                        label="检校周期"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="jdf"
                        label="检测费用"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="qtf"
                        label="其它费"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="jdrq"
                        label="检测日期"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="yxq"
                        label="有效期"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="zsbh"
                        label="证书编号"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="jdjl"
                        label="检定结论"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="jdjldetail"
                        label="检定具体结论"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="sjbz"
                        label="备注"
                    >
                    </el-table-column>

                </el-table>
            <!--</div>-->
            <div style="margin-top:10px;text-align:center; float:right;">
                <mind-pagination
                    :current-page="page" :page-size="rows"
                    :total="total" @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
        </div>
    </mind-dialog>
</template>

<script>
    import Vue from 'vue'
    import Vuex from 'vuex'
    import $ from 'jquery'
    import {ajaxRequest, formatArrayToTree} from '../../util/base'
    import Retrieve from '../../Retrieve'
    import WorkMould from '../../mould/WorkMould'
    import TableColumnHeader from '../../Table/TableColumnHeader'

    const defaults = {
        hoho: ''
    };

    export default {
        name: 'cycleTestList',
        props: {
            data: {
                type: Object
            },
            callback: {
                type: Function
            }
        },
        data() {
            return {
                form: $.extend({}, defaults, this.data || {}),

                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: 'a.jdrq',
                orderType: 'desc',
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 0
            }
        },
        methods: {

            handleSort: function (column, prop, order) {
                this.orderProperty = column['prop']
                if (column['order'] == 'descending') {
                    this.orderType = 'desc'
                } else {
                    this.orderType = 'asc'
                }
                this.getTableList()
            },


            advanceSearch: function (data) {
                this.sc = JSON.stringify(data.conditions)
                this.orderProperty = data.sortBy
                this.orderType = data.order
                this.fuzzySearch = 1
                this.getTableList()
            },

            getTableList() {
                ajaxRequest('get', 'back/instruments/findCycleTestList', {
                    fuzzySearch: 1,
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    sc: this.sc,
                    id:this.form.id
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData = res.rows
                        this.total = res.total
                        this.multipleSelection = []

                    }
                })
            },

            handleToggleTheme(color) {
                this.$store.commit('toggleTheme', color)
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },

            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size
                this.getTableList()
            },

            handleCurrentPageChange(currentPage) {
                this.page = currentPage
                this.getTableList()
            },

            handleCancel:function () {
                this.callback();
            }

        },
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve
        },
        mounted() {
            this.getTableList()
        }
    }
</script>

<style scoped>
    .flex-one {
        flex: 1;
    }

    .flex {
        display: flex;
    }

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
</style>
