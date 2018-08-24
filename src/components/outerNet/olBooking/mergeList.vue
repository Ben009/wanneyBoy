<template>
    <mind-dialog
        :title="'器具合并历史记录'"
        :visible="true"
        dialogSize="large"
        center
        v-dialogDrag
        @close="handleCancel">
        <div style="position:relative;">
            <div>
                <div style="margin-top:10px; margin-bottom: 30px">
                        <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%">
                            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>

                            <el-table-column
                                prop="qjmcNew"
                                label="器具名称"
                            >
                            </el-table-column>

                            <el-table-column
                                prop="xhggNew"
                                label="型号规格"
                            >
                            </el-table-column>

                            <el-table-column
                                prop="ccbhNew"
                                label="出厂编号"
                            >
                            </el-table-column>

                            <el-table-column
                                prop="tsNew"
                                label="套数"
                            >
                            </el-table-column>

                            <el-table-column
                                prop="jcddNew"
                                label="检校地点"
                                :formatter="formatterJcdd"
                            >
                            </el-table-column>

                        </el-table>
                    </div>
            </div>
        </div>
    </mind-dialog>
</template>

<script>
    import Vue from 'vue'
    import Vuex from 'vuex'
    import $ from 'jquery'
    import {ajaxRequest, formatArrayToTree,ajaxProxyRequest} from '../../util/base'
    import TableColumnHeader from '../../Table/TableColumnHeader'

    const defaults = {
        hoho: ''
    };
    export default {
        name: 'merge-list',
        props: {//用于接收从父组件中传来的数据
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
                tableData: []
            }
        },
        methods: {

            formatterJcdd: function (row, column) {
                return row.jcdd == '4' ? '物流送样' : (row.jcdd == '3' ? '带回' : (row.jcdd == '2' ? '询价' : (row.jcdd == '1' ? '现场' : '送检')));
            },

            getTableList() {
                var _this = this;
                ajaxRequest('get', 'back/olBooking/findMergeInfoByXh', {
                    xh: _this.form.xh,
                    source:_this.form.source
                }, function (res) {
                    if (res.code === 200) {
                        _this.tableData = res.t.wsMergeDetailList;
                    }
                }.bind(this))
            },

            handleCancel(){
                this.callback();
            }
        },
        components: {
            TableColumnHeader
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

    .bg-red {
        color: red;
    }

</style>
